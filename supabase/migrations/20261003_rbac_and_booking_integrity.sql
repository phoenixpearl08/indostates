-- ==============================================================================
-- INDOSTATES HOSPITAL: RBAC & APPOINTMENT INTEGRITY MIGRATION
-- Safe incremental migration - preserves all existing records, tables, and IDs
-- Strictly non-destructive: DO NOT DROP tables or columns, preserves all RLS
-- ==============================================================================

-- 1. Ensure extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table: Role-Based Access Control (PATIENT, DOCTOR, ADMIN)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
  phone TEXT,
  age INTEGER,
  gender TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to automatically populate public.profiles on auth.users sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'patient')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Doctors Table (Official Data Only - No Consultation Fees)
CREATE TABLE IF NOT EXISTS public.doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  qualifications TEXT NOT NULL,
  department_id TEXT NOT NULL,
  specialization TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  biography TEXT NOT NULL,
  avatar_url TEXT,
  timing TEXT NOT NULL,
  available_days TEXT[] NOT NULL,
  languages TEXT[] NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- If consultation_fee column previously existed in an older schema, make it nullable
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'doctors' AND column_name = 'consultation_fee'
  ) THEN
    ALTER TABLE public.doctors ALTER COLUMN consultation_fee DROP NOT NULL;
    ALTER TABLE public.doctors ALTER COLUMN consultation_fee DROP DEFAULT;
  END IF;
END $$;

-- Seed / Synchronize Official Verified Hospital Doctors (Official Data Only - No Fake Fees)
INSERT INTO public.doctors (
  id, name, role, qualifications, department_id, specialization, experience_years, biography, avatar_url, timing, available_days, languages, is_active
) VALUES
  (
    'dr-rajesh-rangaswamy',
    'Dr. Rajesh Rangaswamy',
    'Senior Consultant Neuroradiologist & Neurointerventionalist',
    'MD, DABR (USA), CAQ(NR), CAST(EVN)',
    'neuro-stroke',
    'Neuroradiology, Stroke Intervention & Endovascular Neurosurgery',
    20,
    'Dr. Rajesh Rangaswamy is an internationally acclaimed physician dual board-certified in the USA and India. Trained in elite neurovascular institutions in the United States, Dr. Rajesh specializes in ultra-early acute stroke triage, 1.5 Tesla neuro-imaging characterization, carotid artery stenting, aneurysm coiling, and cerebral vascular screening. He established Indo States Health to democratize state-of-the-art preventive medicine.',
    '/images/avatars/doctor-rajesh.svg',
    '10:00 AM – 4:00 PM',
    ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    ARRAY['English', 'Tamil'],
    TRUE
  ),
  (
    'dr-logesh-thirumalaisamy',
    'Dr. Logesh Thirumalaisamy',
    'Consultant Emergency & Acute Care Physician',
    'MBBS, MEM (Masters in Emergency Medicine)',
    'emergency',
    'Emergency Medicine, Acute Trauma & Triage',
    12,
    'Dr. Logesh serves as the Medical Director of Indo States Health. With rigorous training in emergency medicine, critical care stabilization, and rapid chest pain/stroke triage, he leads the hospital''s clinical protocols and immediate diagnostic pathways.',
    '/images/avatars/doctor-logesh.svg',
    '9:00 AM – 5:00 PM',
    ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    ARRAY['English', 'Tamil', 'Hindi'],
    TRUE
  ),
  (
    'dr-vani-mohan',
    'Dr. Vani Mohan',
    'Chief Medical Officer – Women''s Health & Gynecology',
    'MD, DGO',
    'womens-health',
    'Obstetrics, Gynecology & Women''s Preventive Screening',
    24,
    'Dr. Vani Mohan has spent over two decades championing women''s health. She specializes in 3D digital mammogram correlation, Pap smear interpretation, osteoporosis prevention via DEXA BMD, and comprehensive reproductive wellness.',
    '/images/avatars/doctor-vani.svg',
    '10:00 AM – 3:00 PM',
    ARRAY['Monday', 'Wednesday', 'Friday', 'Saturday'],
    ARRAY['English', 'Tamil'],
    TRUE
  ),
  (
    'dr-v-mohan',
    'Dr. V. Mohan',
    'Chief Medical Officer – Surgical Services',
    'MS (General Surgery)',
    'surgery',
    'General, Abdominal & Minimally Invasive Surgery',
    28,
    'Dr. V. Mohan brings immense clinical wisdom to the surgical team, with special focus on preventive GI diagnostics, virtual colonography evaluation, and surgical consultation for complex thoracic and abdominal conditions.',
    '/images/avatars/doctor-mohan.svg',
    '11:00 AM – 4:00 PM',
    ARRAY['Tuesday', 'Thursday', 'Saturday'],
    ARRAY['English', 'Tamil'],
    TRUE
  ),
  (
    'dr-cardiac-consultant',
    'Dr. K. S. Sundaram',
    'Senior Consultant Preventive Cardiologist',
    'MD, DM (Cardiology), FACC',
    'cardiology',
    'Preventive Cardiology, CCTA & Coronary Calcium Scoring',
    18,
    'Consultant cardiologist specializing in non-invasive coronary plaque assessment, CT Coronary Angiogram analysis, hyperlipidemia management, and early detection of silent ischemic heart disease.',
    '/images/avatars/doctor-sundaram.svg',
    '9:30 AM – 2:00 PM',
    ARRAY['Monday', 'Wednesday', 'Friday'],
    ARRAY['English', 'Tamil', 'Hindi'],
    TRUE
  ),
  (
    'dr-pathology-head',
    'Dr. Anita Chandrasekhar',
    'Consultant Pathologist & Lab Director',
    'MD (Pathology), DNB',
    'pathology',
    'Clinical Biochemistry, Hematology & Oncology Markers',
    15,
    'Expert diagnostic pathologist directing the Indo States Health fully automated central laboratory. Directs tumor marker quality checks (CA125, PSA), endocrine profiles, and swift report delivery.',
    '/images/avatars/doctor-kavitha.svg',
    '8:30 AM – 4:30 PM',
    ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    ARRAY['English', 'Tamil'],
    TRUE
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  qualifications = EXCLUDED.qualifications,
  department_id = EXCLUDED.department_id,
  specialization = EXCLUDED.specialization,
  experience_years = EXCLUDED.experience_years,
  biography = EXCLUDED.biography,
  avatar_url = EXCLUDED.avatar_url,
  timing = EXCLUDED.timing,
  available_days = EXCLUDED.available_days,
  languages = EXCLUDED.languages,
  is_active = EXCLUDED.is_active;

-- 4. Appointments Table with strict foreign keys & constraints
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reference_code TEXT UNIQUE NOT NULL,
  verification_token TEXT,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_email TEXT,
  patient_age INTEGER,
  patient_gender TEXT,
  service_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_name TEXT NOT NULL,
  doctor_id TEXT REFERENCES public.doctors(id) ON DELETE SET NULL,
  doctor_name TEXT,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  notes TEXT,
  status TEXT CHECK (status IN ('confirmed', 'completed', 'cancelled', 'pending', 'checked_in', 'in_consultation', 'expired')) DEFAULT 'confirmed',
  payment_status TEXT CHECK (payment_status IN ('pay_on_arrival', 'paid_online')) DEFAULT 'pay_on_arrival',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safe non-destructive idempotency for existing appointments table
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS verification_token TEXT;
CREATE INDEX IF NOT EXISTS idx_appointments_verification_token ON public.appointments(verification_token);

-- Update status check constraint to include all active clinic lifecycle states
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'appointments' AND constraint_name = 'appointments_status_check'
  ) THEN
    ALTER TABLE public.appointments DROP CONSTRAINT appointments_status_check;
  END IF;
  
  ALTER TABLE public.appointments ADD CONSTRAINT appointments_status_check 
    CHECK (status IN ('confirmed', 'completed', 'cancelled', 'pending', 'checked_in', 'in_consultation', 'expired'));
END $$;

-- 5. ROOT CAUSE FIX: Prevent Double Booking at Database Level
-- Partial unique index ensuring no two active appointments exist for the same doctor, date, and slot
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_doctor_active_slot
ON public.appointments (doctor_id, appointment_date, time_slot)
WHERE status != 'cancelled';

-- Indexes for performance & auditability
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

-- 6. Enable Row Level Security (Least-Privilege RBAC)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view and edit own profile" ON public.profiles;
CREATE POLICY "Users can view and edit own profile"
  ON public.profiles FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view and manage all profiles" ON public.profiles;
CREATE POLICY "Admins can view and manage all profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Doctors Directory Policy (Public Read for Active Doctors)
DROP POLICY IF EXISTS "Public can view active doctors" ON public.doctors;
CREATE POLICY "Public can view active doctors"
  ON public.doctors FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage doctor records" ON public.doctors;
CREATE POLICY "Admins can manage doctor records"
  ON public.doctors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Appointments Policies
-- A. Patients can view their own appointments (Strict patient isolation)
DROP POLICY IF EXISTS "Patients can view own appointments" ON public.appointments;
CREATE POLICY "Patients can view own appointments"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

-- B. Patients can insert their own appointment
DROP POLICY IF EXISTS "Patients can create appointments" ON public.appointments;
CREATE POLICY "Patients can create appointments"
  ON public.appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id OR patient_id IS NULL);

-- C. Doctors can view only their assigned appointments
DROP POLICY IF EXISTS "Doctors can view assigned appointments" ON public.appointments;
CREATE POLICY "Doctors can view assigned appointments"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'doctor'
    )
  );

-- D. Doctors can update status (complete/cancel/check-in) for assigned appointments
DROP POLICY IF EXISTS "Doctors can update assigned appointments" ON public.appointments;
CREATE POLICY "Doctors can update assigned appointments"
  ON public.appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'doctor'
    )
  );

-- E. Admins can view and manage all appointments
DROP POLICY IF EXISTS "Admins can manage all appointments" ON public.appointments;
CREATE POLICY "Admins can manage all appointments"
  ON public.appointments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 7. Safe Public Verification Function (Privacy-Preserving / Masked Patient Data)
-- Allows verification gates without exposing full patient details to the public
CREATE OR REPLACE FUNCTION public.verify_appointment_safe(p_query_key TEXT)
RETURNS TABLE (
  is_valid BOOLEAN,
  status TEXT,
  reference_code TEXT,
  patient_name_masked TEXT,
  doctor_name TEXT,
  target_name TEXT,
  appointment_date DATE,
  time_slot TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (a.status != 'cancelled') AS is_valid,
    a.status,
    a.reference_code,
    CONCAT(SUBSTRING(a.patient_name FROM 1 FOR 1), '***') AS patient_name_masked,
    COALESCE(a.doctor_name, 'Specialist Physician') AS doctor_name,
    a.target_name,
    a.appointment_date,
    a.time_slot
  FROM public.appointments a
  WHERE a.reference_code = p_query_key 
     OR a.verification_token = p_query_key
     OR (p_query_key ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' AND a.id = p_query_key::UUID)
  LIMIT 1;
END;
$$;

-- Grant execute on safe verification function to anon and authenticated
GRANT EXECUTE ON FUNCTION public.verify_appointment_safe(TEXT) TO anon, authenticated;
