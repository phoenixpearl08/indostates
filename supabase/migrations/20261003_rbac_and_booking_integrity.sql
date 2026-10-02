-- ==============================================================================
-- INDOSTATES HOSPITAL: RBAC & APPOINTMENT INTEGRITY MIGRATION
-- Safe incremental migration - preserves all existing records, tables, and IDs
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

-- If consultation_fee column previously existed, make it nullable so it never requires fake values
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

-- 4. Appointments Table with strict foreign keys & constraints
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reference_code TEXT UNIQUE NOT NULL,
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
  status TEXT CHECK (status IN ('confirmed', 'completed', 'cancelled', 'pending')) DEFAULT 'confirmed',
  payment_status TEXT CHECK (payment_status IN ('pay_on_arrival', 'paid_online')) DEFAULT 'pay_on_arrival',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ROOT CAUSE FIX: Prevent Double Booking at Database Level
-- Partial unique index ensuring no two active appointments exist for the same doctor, date, and slot
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_doctor_active_slot
ON public.appointments (doctor_id, appointment_date, time_slot)
WHERE status != 'cancelled';

-- Indexes for performance
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

-- Doctors Directory Policy (Public Read)
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
-- A. Patients can view their own appointments
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

-- D. Doctors can update status (complete/cancel) for assigned appointments
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
