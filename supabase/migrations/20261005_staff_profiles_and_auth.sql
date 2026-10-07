-- =========================================================================
-- INDOSTATES HOSPITAL: STAFF PROFILES & DEDICATED AUTHENTICATION ARCHITECTURE
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.staff_profiles (
  id TEXT PRIMARY KEY DEFAULT ('stf-' || substr(md5(random()::text), 1, 10)),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  employee_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN (
    'DOCTOR',
    'ADMIN',
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'MEDICAL_DIRECTOR',
    'OPERATIONS_MANAGER',
    'HR_MANAGER',
    'FINANCE_MANAGER',
    'NURSE',
    'RECEPTIONIST',
    'LAB_TECHNICIAN',
    'LAB_VERIFIER',
    'PHARMACY_STAFF',
    'PHARMACY_MANAGER',
    'BILLING_STAFF',
    'SECURITY_STAFF'
  )),
  department TEXT NOT NULL,
  specialization TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_staff_profiles_email ON public.staff_profiles(email);
CREATE INDEX IF NOT EXISTS idx_staff_profiles_role ON public.staff_profiles(role);
CREATE INDEX IF NOT EXISTS idx_staff_profiles_status ON public.staff_profiles(status);
CREATE INDEX IF NOT EXISTS idx_staff_profiles_emp_id ON public.staff_profiles(employee_id);

-- Enable Row Level Security
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;

-- Allow public/authenticated read access for directory verification
DROP POLICY IF EXISTS "Public staff profiles read" ON public.staff_profiles;
CREATE POLICY "Public staff profiles read"
  ON public.staff_profiles FOR SELECT
  USING (true);

-- Allow service role full control
DROP POLICY IF EXISTS "Service role full staff access" ON public.staff_profiles;
CREATE POLICY "Service role full staff access"
  ON public.staff_profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Seed Initial Verified Staff Profiles
INSERT INTO public.staff_profiles (id, employee_id, full_name, email, phone, role, department, specialization, status)
VALUES
  ('stf-001', 'ISH-DOC-001', 'Dr. Rajesh Rangaswamy', 'dr.rajesh@indostates.com', '+91 94422 11001', 'DOCTOR', 'Neurovascular & Stroke', 'Neuroradiology & Neurointervention', 'ACTIVE'),
  ('stf-002', 'ISH-ADM-001', 'Chief Hospital Administrator', 'admin@indostates.com', '+91 94422 11002', 'ADMIN', 'Hospital Administration', 'Hospital Operations & Governance', 'ACTIVE'),
  ('stf-003', 'ISH-SUP-001', 'Dr. Rajesh Rangaswamy (Super Admin)', 'superadmin@indostates.com', '+91 94422 11003', 'SUPER_ADMIN', 'Executive Board', 'Executive Administration', 'ACTIVE'),
  ('stf-004', 'ISH-DOC-002', 'Dr. Logesh Thirumalaisamy', 'dr.logesh@indostates.com', '+91 94422 11004', 'DOCTOR', 'Emergency & Acute Care', 'Emergency Medicine & Triage', 'ACTIVE'),
  ('stf-005', 'ISH-DOC-003', 'Dr. Vani Mohan', 'dr.vani@indostates.com', '+91 94422 11005', 'DOCTOR', 'Women''s Health & Gynecology', 'Obstetrics & Preventive Oncology', 'ACTIVE'),
  ('stf-006', 'ISH-DOC-004', 'Dr. V. Mohan', 'dr.mohan@indostates.com', '+91 94422 11006', 'DOCTOR', 'Surgical Services', 'Minimally Invasive Surgery', 'ACTIVE'),
  ('stf-007', 'ISH-NUR-001', 'Sister Priya Venkatesh', 'nurse@indostates.com', '+91 94422 11007', 'NURSE', 'Inpatient Nursing', 'Critical Care Nursing', 'ACTIVE'),
  ('stf-008', 'ISH-REC-001', 'Front Office Reception Lead', 'reception@indostates.com', '+91 94422 11008', 'RECEPTIONIST', 'Patient Registration', 'Hospital Front Desk', 'ACTIVE'),
  ('stf-009', 'ISH-LAB-001', 'Karthik Subramanian', 'lab@indostates.com', '+91 94422 11009', 'LAB_TECHNICIAN', 'Automated Diagnostic Lab', 'Clinical Pathology & Hematology', 'ACTIVE'),
  ('stf-010', 'ISH-PHR-001', 'Selvaraj Mani', 'pharmacy@indostates.com', '+91 94422 11010', 'PHARMACY_STAFF', 'In-House Clinical Pharmacy', 'Dispensing & Medication Safety', 'ACTIVE'),
  ('stf-011', 'ISH-BIL-001', 'Deepa Raman', 'billing@indostates.com', '+91 94422 11011', 'BILLING_STAFF', 'Patient Accounts', 'Hospital Billing & TPA', 'ACTIVE'),
  ('stf-012', 'ISH-SEC-001', 'Security Chief Officer', 'security@indostates.com', '+91 94422 11012', 'SECURITY_STAFF', 'Hospital Security', 'Perimeter & Access Control', 'ACTIVE')
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  specialization = EXCLUDED.specialization,
  status = EXCLUDED.status,
  updated_at = timezone('utc'::text, now());
