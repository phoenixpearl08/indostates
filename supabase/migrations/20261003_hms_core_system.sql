-- ==============================================================================
-- INDOSTATES HOSPITAL: COMPLETE CONNECTED HMS DATABASE MIGRATION
-- Non-destructive extension: preserves all existing data and tables
-- Enables RLS on all clinical, operational, billing, and audit entities
-- ==============================================================================

-- 1. Ensure extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Patients Table (Stable UHID identification)
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  uhid TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  address TEXT,
  blood_group TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relation TEXT,
  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_patients_uhid ON public.patients(uhid);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON public.patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_email ON public.patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON public.patients(user_id);

-- 3. Staff Table (Hospital Staff Directory & Role Metadata)
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  designation TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_staff_email ON public.staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_role ON public.staff(role);

-- 4. Extend Appointments Table for Full HMS Lifecycle
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS appointment_id TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS patient_uhid TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS token_number TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS check_in_time TIMESTAMPTZ;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS qr_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_appointments_appointment_id ON public.appointments(appointment_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_uhid ON public.appointments(patient_uhid);
CREATE INDEX IF NOT EXISTS idx_appointments_token_number ON public.appointments(token_number);

-- Safe non-destructive upgrade of status constraint to full 16 HMS states
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'appointments' AND constraint_name = 'appointments_status_check'
  ) THEN
    ALTER TABLE public.appointments DROP CONSTRAINT appointments_status_check;
  END IF;

  ALTER TABLE public.appointments ADD CONSTRAINT appointments_status_check
    CHECK (status IN (
      'BOOKED', 'CONFIRMED', 'CHECKED_IN', 'WAITING', 'CALLED',
      'IN_CONSULTATION', 'CONSULTATION_COMPLETED', 'LAB_PENDING', 'LAB_COMPLETED',
      'PHARMACY_PENDING', 'PHARMACY_COMPLETED', 'BILLING_PENDING',
      'PAYMENT_COMPLETED', 'COMPLETED', 'CANCELLED', 'NO_SHOW',
      -- lower-case legacy compatibility
      'confirmed', 'completed', 'cancelled', 'pending', 'checked_in', 'in_consultation', 'expired'
    ));
END $$;

-- 5. Queues Table (Reception & Doctor Consultation Queue)
CREATE TABLE IF NOT EXISTS public.queues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_uhid TEXT NOT NULL,
  doctor_id TEXT REFERENCES public.doctors(id) ON DELETE SET NULL,
  department_id TEXT NOT NULL,
  token_number TEXT NOT NULL,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'called', 'in_consultation', 'completed', 'skipped')),
  check_in_time TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  called_time TIMESTAMPTZ,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent', 'senior')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_queues_doctor_status ON public.queues(doctor_id, status);
CREATE INDEX IF NOT EXISTS idx_queues_check_in_time ON public.queues(check_in_time);

-- 6. Encounters Table (Doctor Clinical Consultations)
CREATE TABLE IF NOT EXISTS public.encounters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  encounter_id TEXT UNIQUE NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id TEXT REFERENCES public.doctors(id) ON DELETE SET NULL,
  doctor_name TEXT NOT NULL,
  chief_complaint TEXT NOT NULL,
  vitals JSONB DEFAULT '{}'::jsonb,
  clinical_findings TEXT,
  diagnosis TEXT NOT NULL,
  treatment_plan TEXT,
  follow_up_days INTEGER,
  follow_up_date DATE,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  started_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_encounters_patient_id ON public.encounters(patient_id);
CREATE INDEX IF NOT EXISTS idx_encounters_doctor_id ON public.encounters(doctor_id);
CREATE INDEX IF NOT EXISTS idx_encounters_appointment_id ON public.encounters(appointment_id);

-- 7. Prescriptions Table (Doctor Orders → Pharmacy Dispensing)
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  prescription_id TEXT UNIQUE NOT NULL,
  encounter_id UUID REFERENCES public.encounters(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  doctor_id TEXT REFERENCES public.doctors(id) ON DELETE SET NULL,
  doctor_name TEXT NOT NULL,
  medications JSONB NOT NULL DEFAULT '[]'::jsonb,
  instructions TEXT,
  status TEXT DEFAULT 'pending_dispense' CHECK (status IN ('pending_dispense', 'partially_dispensed', 'dispensed')),
  dispensed_by TEXT,
  dispensed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON public.prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON public.prescriptions(status);

-- 8. Lab Orders & Reports Table (Doctor Orders → Lab Processing → Patient Release)
CREATE TABLE IF NOT EXISTS public.lab_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  encounter_id UUID REFERENCES public.encounters(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  doctor_id TEXT REFERENCES public.doctors(id) ON DELETE SET NULL,
  doctor_name TEXT NOT NULL,
  test_code TEXT NOT NULL,
  test_name TEXT NOT NULL,
  sample_type TEXT NOT NULL,
  sample_status TEXT DEFAULT 'ordered' CHECK (sample_status IN ('ordered', 'collected', 'processing', 'completed')),
  collected_at TIMESTAMPTZ,
  collected_by TEXT,
  report_url TEXT,
  report_summary TEXT,
  is_report_released BOOLEAN DEFAULT FALSE,
  released_at TIMESTAMPTZ,
  verified_by TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lab_orders_patient_id ON public.lab_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_orders_sample_status ON public.lab_orders(sample_status);
CREATE INDEX IF NOT EXISTS idx_lab_orders_released ON public.lab_orders(is_report_released);

-- 9. Billing Invoices & Payments Table
CREATE TABLE IF NOT EXISTS public.billing_invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_id TEXT UNIQUE NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_uhid TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  paid_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partially_paid', 'paid', 'refunded')),
  payment_method TEXT CHECK (payment_method IN ('cash', 'upi', 'card', 'insurance', 'online')),
  transaction_ref TEXT,
  receipt_number TEXT,
  paid_at TIMESTAMPTZ,
  generated_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_billing_patient_id ON public.billing_invoices(patient_id);
CREATE INDEX IF NOT EXISTS idx_billing_status ON public.billing_invoices(payment_status);

-- 10. Nurse Tasks Table (Clinical Inpatient & Outpatient Care Tasks)
CREATE TABLE IF NOT EXISTS public.nurse_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id TEXT UNIQUE NOT NULL,
  encounter_id UUID REFERENCES public.encounters(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_uhid TEXT NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('vitals_check', 'medication_admin', 'iv_infusion', 'wound_dressing', 'observation')),
  description TEXT NOT NULL,
  assigned_nurse_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_nurse_tasks_status ON public.nurse_tasks(status);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_role TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'alert')),
  is_read BOOLEAN DEFAULT FALSE,
  link_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- 12. Audit Logs Table (Append-Only, Immutable Event Log)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  actor_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failure')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- 13. Enable Row Level Security (RLS) on All Tables
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nurse_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 14. RLS Policies: Patient Data Isolation
DROP POLICY IF EXISTS "Patients view own profile" ON public.patients;
CREATE POLICY "Patients view own profile"
  ON public.patients FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Patients update own profile" ON public.patients;
CREATE POLICY "Patients update own profile"
  ON public.patients FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Staff can view patients if authorized
DROP POLICY IF EXISTS "Authorized staff can view patients" ON public.patients;
CREATE POLICY "Authorized staff can view patients"
  ON public.patients FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role NOT IN ('patient', 'attender')
    )
  );

-- 15. RLS Policies: Prescriptions (Patient Isolation)
DROP POLICY IF EXISTS "Patients view own prescriptions" ON public.prescriptions;
CREATE POLICY "Patients view own prescriptions"
  ON public.prescriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = prescriptions.patient_id AND patients.user_id = auth.uid()
    )
  );

-- 16. RLS Policies: Lab Reports (Patient only sees released reports)
DROP POLICY IF EXISTS "Patients view released lab reports" ON public.lab_orders;
CREATE POLICY "Patients view released lab reports"
  ON public.lab_orders FOR SELECT
  TO authenticated
  USING (
    is_report_released = true AND
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = lab_orders.patient_id AND patients.user_id = auth.uid()
    )
  );

-- 17. RLS Policies: Billing Invoices (Patient Isolation)
DROP POLICY IF EXISTS "Patients view own invoices" ON public.billing_invoices;
CREATE POLICY "Patients view own invoices"
  ON public.billing_invoices FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = billing_invoices.patient_id AND patients.user_id = auth.uid()
    )
  );

-- 18. RLS Policies: Audit Logs (Strictly Append-Only)
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Server can insert audit logs" ON public.audit_logs;
CREATE POLICY "Server can insert audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);
