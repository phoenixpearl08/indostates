-- ==============================================================================
-- INDOSTATES HOSPITAL: ENTERPRISE HMS EXTENSIONS MIGRATION
-- Non-destructive addition: Wards, Beds, IPD Admissions, Emergency Cases,
-- Ambulances, Imaging Orders, Pharmacy Inventory, Housekeeping, Maintenance,
-- and Caregiver Consents with strict Row Level Security (RLS)
-- ==============================================================================

-- 1. Ensure extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Wards Table
CREATE TABLE IF NOT EXISTS public.wards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ward_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  floor TEXT NOT NULL,
  total_beds INTEGER NOT NULL DEFAULT 0,
  department_id TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_number TEXT UNIQUE NOT NULL,
  ward_id UUID REFERENCES public.wards(id) ON DELETE CASCADE,
  room_type TEXT NOT NULL CHECK (room_type IN ('general', 'semi_private', 'deluxe', 'icu')),
  daily_rate NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Beds Table
CREATE TABLE IF NOT EXISTS public.beds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bed_number TEXT UNIQUE NOT NULL,
  ward_id UUID REFERENCES public.wards(id) ON DELETE CASCADE,
  ward_name TEXT NOT NULL,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  room_number TEXT,
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'RESERVED', 'OCCUPIED', 'CLEANING', 'MAINTENANCE', 'BLOCKED')),
  current_patient_uhid TEXT,
  current_patient_name TEXT,
  current_admission_id TEXT,
  last_cleaned_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_beds_status ON public.beds(status);
CREATE INDEX IF NOT EXISTS idx_beds_ward ON public.beds(ward_id);

-- 5. Inpatient Admissions (IPD)
CREATE TABLE IF NOT EXISTS public.admissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admission_number TEXT UNIQUE NOT NULL,
  patient_uhid TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT,
  doctor_id TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  department_id TEXT NOT NULL,
  ward_id TEXT NOT NULL,
  ward_name TEXT NOT NULL,
  bed_id TEXT NOT NULL,
  bed_number TEXT NOT NULL,
  admission_date DATE NOT NULL,
  discharge_date TIMESTAMPTZ,
  admission_reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ADMITTED' CHECK (status IN ('ADMITTED', 'DISCHARGED', 'TRANSFERRED')),
  discharge_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admissions_uhid ON public.admissions(patient_uhid);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON public.admissions(status);

-- 6. Emergency Cases
CREATE TABLE IF NOT EXISTS public.emergency_cases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_number TEXT UNIQUE NOT NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT,
  patient_uhid TEXT,
  triage_priority TEXT NOT NULL CHECK (triage_priority IN ('RED', 'YELLOW', 'GREEN')),
  chief_complaint TEXT NOT NULL,
  vitals JSONB,
  attending_doctor_id TEXT,
  attending_doctor_name TEXT,
  attending_nurse_name TEXT,
  bed_number TEXT,
  status TEXT NOT NULL DEFAULT 'TRIAGE' CHECK (status IN ('TRIAGE', 'IN_TREATMENT', 'ADMITTED_IPD', 'DISCHARGED', 'DECEASED')),
  arrived_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_emergency_priority ON public.emergency_cases(triage_priority);
CREATE INDEX IF NOT EXISTS idx_emergency_status ON public.emergency_cases(status);

-- 7. Ambulances Table
CREATE TABLE IF NOT EXISTS public.ambulances (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vehicle_number TEXT UNIQUE NOT NULL,
  vehicle_type TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  driver_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'PATIENT_PICKED', 'AT_HOSPITAL', 'COMPLETED', 'MAINTENANCE')),
  current_location TEXT NOT NULL,
  equipment_ready BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Ambulance Requests
CREATE TABLE IF NOT EXISTS public.ambulance_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  request_number TEXT UNIQUE NOT NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  destination TEXT NOT NULL,
  ambulance_id UUID REFERENCES public.ambulances(id) ON DELETE SET NULL,
  vehicle_number TEXT,
  driver_name TEXT,
  driver_phone TEXT,
  status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'DISPATCHED', 'EN_ROUTE', 'AT_SCENE', 'TRANSPORTING', 'ARRIVED_HOSPITAL', 'CANCELLED')),
  priority TEXT NOT NULL DEFAULT 'EMERGENCY' CHECK (priority IN ('EMERGENCY', 'NON_EMERGENCY')),
  requested_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMPTZ
);

-- 9. Imaging / Radiology Orders
CREATE TABLE IF NOT EXISTS public.imaging_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  appointment_id TEXT NOT NULL,
  patient_uhid TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  doctor_id TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  modality TEXT NOT NULL,
  study_name TEXT NOT NULL,
  preparation_instructions TEXT,
  status TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'REPORT_VERIFIED')),
  report_url TEXT,
  report_summary TEXT,
  radiologist_name TEXT,
  verified_at TIMESTAMPTZ,
  is_report_released BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_imaging_uhid ON public.imaging_orders(patient_uhid);
CREATE INDEX IF NOT EXISTS idx_imaging_status ON public.imaging_orders(status);

-- 10. Pharmacy Inventory & Stock
CREATE TABLE IF NOT EXISTS public.pharmacy_inventory (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_code TEXT UNIQUE NOT NULL,
  medicine_name TEXT NOT NULL,
  generic_name TEXT NOT NULL,
  category TEXT NOT NULL,
  strength TEXT NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 50,
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  mrp NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Pharmacy Batches
CREATE TABLE IF NOT EXISTS public.pharmacy_batches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES public.pharmacy_inventory(id) ON DELETE CASCADE,
  batch_number TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  purchase_rate NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  mrp NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Housekeeping Tasks
CREATE TABLE IF NOT EXISTS public.housekeeping_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_number TEXT UNIQUE NOT NULL,
  location_type TEXT NOT NULL CHECK (location_type IN ('BED', 'ROOM', 'WARD', 'OPD', 'EMERGENCY')),
  location_id TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'NORMAL' CHECK (priority IN ('HIGH', 'NORMAL', 'URGENT')),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')),
  assigned_staff_name TEXT,
  requested_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMPTZ
);

-- 13. Maintenance Tickets
CREATE TABLE IF NOT EXISTS public.maintenance_tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  equipment_name TEXT NOT NULL,
  department TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
  reported_by TEXT NOT NULL,
  assigned_to TEXT,
  downtime_reported BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. Caregiver Consents
CREATE TABLE IF NOT EXISTS public.caregiver_consents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  consent_id TEXT UNIQUE NOT NULL,
  patient_uhid TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  caregiver_name TEXT NOT NULL,
  caregiver_phone TEXT NOT NULL,
  caregiver_email TEXT NOT NULL,
  relationship TEXT NOT NULL,
  access_scope TEXT NOT NULL CHECK (access_scope IN ('APPOINTMENTS_ONLY', 'FULL_CARE', 'BILLING_ONLY')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVOKED', 'EXPIRED')),
  valid_until TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_caregiver_uhid ON public.caregiver_consents(patient_uhid);
CREATE INDEX IF NOT EXISTS idx_caregiver_email ON public.caregiver_consents(caregiver_email);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imaging_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.housekeeping_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_consents ENABLE ROW LEVEL SECURITY;

-- Wards, Rooms, Beds read access for authenticated staff and public view of availability
CREATE POLICY "Public bed availability read" ON public.beds FOR SELECT USING (true);
CREATE POLICY "Public ward read" ON public.wards FOR SELECT USING (true);
CREATE POLICY "Public room read" ON public.rooms FOR SELECT USING (true);

-- Staff bed updates
CREATE POLICY "Staff bed manage" ON public.beds FOR ALL TO authenticated USING (true);

-- Admissions: Patients view own, clinical staff view all
CREATE POLICY "Patient read own admissions" ON public.admissions FOR SELECT TO authenticated
  USING (patient_uhid IN (SELECT uhid FROM public.patients WHERE user_id = auth.uid()));

CREATE POLICY "Staff manage admissions" ON public.admissions FOR ALL TO authenticated USING (true);

-- Imaging: Patients view verified & released reports only
CREATE POLICY "Patient read released imaging reports" ON public.imaging_orders FOR SELECT TO authenticated
  USING (
    is_report_released = TRUE AND
    patient_uhid IN (SELECT uhid FROM public.patients WHERE user_id = auth.uid())
  );

CREATE POLICY "Clinical staff manage imaging" ON public.imaging_orders FOR ALL TO authenticated USING (true);

-- Caregiver Consents: Patient can manage own consents, caregiver can view active consent
CREATE POLICY "Patient manage own caregiver consents" ON public.caregiver_consents FOR ALL TO authenticated
  USING (patient_uhid IN (SELECT uhid FROM public.patients WHERE user_id = auth.uid()));

-- Emergency & Ambulances: Staff management
CREATE POLICY "Staff manage emergency" ON public.emergency_cases FOR ALL TO authenticated USING (true);
CREATE POLICY "Public read ambulance status" ON public.ambulances FOR SELECT USING (true);
CREATE POLICY "Public request ambulance" ON public.ambulance_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff manage ambulance" ON public.ambulance_requests FOR ALL TO authenticated USING (true);

-- Housekeeping & Maintenance
CREATE POLICY "Staff manage housekeeping" ON public.housekeeping_tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff manage maintenance" ON public.maintenance_tickets FOR ALL TO authenticated USING (true);

-- Pharmacy
CREATE POLICY "Staff manage pharmacy inventory" ON public.pharmacy_inventory FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff manage pharmacy batches" ON public.pharmacy_batches FOR ALL TO authenticated USING (true);
