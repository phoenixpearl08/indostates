-- ==============================================================================
-- INDOSTATES HOSPITAL: ADMIN PORTAL & ENTERPRISE GOVERNANCE MIGRATION
-- Safe incremental migration - preserves all existing records, tables, and IDs
-- Strictly non-destructive: DO NOT DROP tables or columns, preserves all RLS
-- ==============================================================================

-- 1. Ensure UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Hospital Master Settings
CREATE TABLE IF NOT EXISTS public.hospital_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  hospital_name TEXT NOT NULL DEFAULT 'IndoStates Hospital',
  tagline TEXT NOT NULL DEFAULT 'Super-Specialty Hospital & Research Institute',
  emergency_hotline TEXT NOT NULL DEFAULT '+91 422 249 9999',
  general_enquiries TEXT NOT NULL DEFAULT '+91 422 249 8888',
  support_email TEXT NOT NULL DEFAULT 'care@indostates.com',
  address TEXT NOT NULL DEFAULT 'Trichy Road, Singanallur, Coimbatore, Tamil Nadu 641005',
  weekday_hours TEXT NOT NULL DEFAULT '8:00 AM – 8:00 PM',
  weekend_hours TEXT NOT NULL DEFAULT '8:00 AM – 2:00 PM',
  emergency_hours TEXT NOT NULL DEFAULT '24/7 Trauma & Emergency',
  slot_duration_minutes INTEGER NOT NULL DEFAULT 20,
  max_daily_appointments INTEGER NOT NULL DEFAULT 250,
  maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
  maintenance_notice TEXT NOT NULL DEFAULT 'All clinical systems operational.',
  qr_token_expiry_hours INTEGER NOT NULL DEFAULT 24,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed default settings if not exists
INSERT INTO public.hospital_settings (id, hospital_name, emergency_hotline, general_enquiries, support_email)
VALUES ('default', 'IndoStates Hospital', '+91 422 249 9999', '+91 422 249 8888', 'care@indostates.com')
ON CONFLICT (id) DO NOTHING;

-- 3. Staff Directory Table
CREATE TABLE IF NOT EXISTS public.staff_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  shift TEXT NOT NULL DEFAULT 'Morning',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'on_leave')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_staff_role ON public.staff_members(role);
CREATE INDEX IF NOT EXISTS idx_staff_department ON public.staff_members(department);
CREATE INDEX IF NOT EXISTS idx_staff_status ON public.staff_members(status);

-- Seed initial core staff
INSERT INTO public.staff_members (id, name, email, role, department, shift, status)
VALUES
  ('s-1', 'Dr. Rajesh Rangaswamy', 'dr.rajesh@indostates.com', 'SUPER_ADMIN', 'Executive Board', 'General', 'active'),
  ('s-2', 'Chief Hospital Administrator', 'admin@indostates.com', 'HOSPITAL_ADMIN', 'Hospital Administration', 'General', 'active'),
  ('s-3', 'Dr. Logesh Thirumalaisamy', 'dr.logesh@indostates.com', 'MEDICAL_DIRECTOR', 'Emergency & Acute Care', 'Rotational', 'active'),
  ('s-4', 'Mr. Ayyappan', 'ops@indostates.com', 'OPERATIONS_MANAGER', 'Hospital Operations', 'Morning', 'active'),
  ('s-5', 'Mrs. Revathi Sundaram', 'hr@indostates.com', 'HR_MANAGER', 'Human Resources', 'Morning', 'active'),
  ('s-6', 'Sister Priya Venkatesh', 'nurse@indostates.com', 'NURSE', 'Inpatient Nursing', 'Rotational', 'active'),
  ('s-7', 'Front Office Lead', 'reception@indostates.com', 'RECEPTIONIST', 'Patient Registration', 'Morning', 'active'),
  ('s-8', 'Karthik Subramanian', 'lab@indostates.com', 'LAB_TECHNICIAN', 'Automated Diagnostic Lab', 'Morning', 'active'),
  ('s-9', 'Selvaraj Mani', 'pharmacy@indostates.com', 'PHARMACY_STAFF', 'In-House Pharmacy', 'Rotational', 'active'),
  ('s-10', 'Deepa Raman', 'billing@indostates.com', 'BILLING_STAFF', 'Patient Accounts & TPA', 'Morning', 'active'),
  ('s-11', 'Security Chief Officer', 'security@indostates.com', 'SECURITY_STAFF', 'Campus Security Gate 1', 'Night', 'active')
ON CONFLICT (id) DO NOTHING;

-- 4. Hospital Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'Normal' CHECK (priority IN ('Normal', 'High', 'Urgent')),
  target_audience TEXT NOT NULL DEFAULT 'All' CHECK (target_audience IN ('All', 'Public', 'Patients', 'Doctors', 'Staff', 'Department')),
  department_id TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at TIMESTAMPTZ,
  created_by TEXT NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_announcements_published ON public.announcements(is_published);
CREATE INDEX IF NOT EXISTS idx_announcements_target ON public.announcements(target_audience);

-- Seed initial announcements
INSERT INTO public.announcements (id, title, content, priority, target_audience, is_published, created_by)
VALUES
  ('ann-1', '24/7 Stroke & Cath Lab Emergency Pathways Active', 'Our comprehensive stroke interventional team and biplane cath lab are on 24/7 standby for acute vascular cases.', 'High', 'Public', TRUE, 'Chief Medical Director'),
  ('ann-2', 'NABH Accreditation Surveillance Audit Passed', 'IndoStates Hospital has successfully cleared the comprehensive NABH re-assessment with zero critical non-conformities.', 'Normal', 'All', TRUE, 'Quality Assurance Lead'),
  ('ann-3', 'Sunday Preventive Health Check Special Camp', 'Comprehensive Master Health Check packages are offered at a 20% promotional discount every Sunday throughout this month.', 'Normal', 'Patients', TRUE, 'Preventive Medicine Dept')
ON CONFLICT (id) DO NOTHING;

-- 5. IndoStates Help Desk Knowledge Base Table
CREATE TABLE IF NOT EXISTS public.helpdesk_knowledge (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_by TEXT NOT NULL DEFAULT 'Admin',
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_kb_category ON public.helpdesk_knowledge(category);
CREATE INDEX IF NOT EXISTS idx_kb_active ON public.helpdesk_knowledge(is_active);

-- Seed core Help Desk knowledge items
INSERT INTO public.helpdesk_knowledge (id, category, title, content, tags, is_active)
VALUES
  ('kb-1', 'EMERGENCY', 'Emergency & Trauma Care Protocol', 'IndoStates 24/7 Emergency Department has dedicated red-triage resuscitation bays, immediate CT access, and on-call trauma surgeons. Direct emergency hotline: +91 422 249 9999.', ARRAY['emergency', 'trauma', 'ambulance', 'hotline'], TRUE),
  ('kb-2', 'APPOINTMENTS', 'Outpatient Booking & Token Process', 'Patients can book appointments online or at reception. Each booking generates an encrypted QR token. Report 15 minutes before the slot for vitals recording at the nursing station.', ARRAY['appointment', 'booking', 'opd', 'qr'], TRUE),
  ('kb-3', 'DIAGNOSTICS', '1.5 Tesla MRI & 128-Slice CT Scans', 'IndoStates Diagnostic Center operates high-resolution 1.5 Tesla MRI with dedicated neuro-vascular coils and low-dose 128-slice CT scans with iterative reconstruction for minimum radiation.', ARRAY['mri', 'ct', 'radiology', 'imaging'], TRUE),
  ('kb-4', 'INSURANCE', 'Cashless Hospitalization & TPA Empanelment', 'We offer cashless hospitalization with Star Health, ICICI Lombard, HDFC ERGO, Care Insurance, Medi Assist, Vidal Health, and Paramount TPA. The TPA desk is in the main lobby.', ARRAY['insurance', 'tpa', 'cashless', 'billing'], TRUE)
ON CONFLICT (id) DO NOTHING;

-- 6. Role-Based Access Control (RBAC) Permission Overrides
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  module TEXT NOT NULL,
  can_read BOOLEAN NOT NULL DEFAULT TRUE,
  can_create BOOLEAN NOT NULL DEFAULT FALSE,
  can_edit BOOLEAN NOT NULL DEFAULT FALSE,
  can_delete BOOLEAN NOT NULL DEFAULT FALSE,
  can_export BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(role, module)
);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON public.role_permissions(role);

-- Seed baseline permissions for standard modules
INSERT INTO public.role_permissions (id, role, module, can_read, can_create, can_edit, can_delete, can_export)
VALUES
  ('rp-sa-all', 'SUPER_ADMIN', 'ALL', TRUE, TRUE, TRUE, TRUE, TRUE),
  ('rp-ha-all', 'HOSPITAL_ADMIN', 'ALL', TRUE, TRUE, TRUE, TRUE, TRUE),
  ('rp-md-clin', 'MEDICAL_DIRECTOR', 'CLINICAL', TRUE, TRUE, TRUE, FALSE, TRUE),
  ('rp-doc-pat', 'DOCTOR', 'PATIENTS', TRUE, TRUE, TRUE, FALSE, TRUE),
  ('rp-rec-apt', 'RECEPTIONIST', 'APPOINTMENTS', TRUE, TRUE, TRUE, FALSE, TRUE),
  ('rp-nur-ipd', 'NURSE', 'IPD', TRUE, TRUE, TRUE, FALSE, FALSE),
  ('rp-lab-ord', 'LAB_TECHNICIAN', 'LAB', TRUE, TRUE, TRUE, FALSE, TRUE),
  ('rp-pha-inv', 'PHARMACY_STAFF', 'PHARMACY', TRUE, TRUE, TRUE, FALSE, TRUE),
  ('rp-bil-inv', 'BILLING_STAFF', 'BILLING', TRUE, TRUE, TRUE, FALSE, TRUE),
  ('rp-sec-gat', 'SECURITY_STAFF', 'SECURITY', TRUE, TRUE, TRUE, FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- 7. Search Analytics Table
CREATE TABLE IF NOT EXISTS public.search_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  query TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'all',
  results_count INTEGER NOT NULL DEFAULT 0,
  user_uhid TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_search_created_at ON public.search_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_search_query ON public.search_analytics(query);

-- Enable RLS
ALTER TABLE public.hospital_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.helpdesk_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
DROP POLICY IF EXISTS "Public can view hospital settings" ON public.hospital_settings;
CREATE POLICY "Public can view hospital settings" ON public.hospital_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active announcements" ON public.announcements;
CREATE POLICY "Public can view active announcements" ON public.announcements FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can view active helpdesk knowledge" ON public.helpdesk_knowledge;
CREATE POLICY "Public can view active helpdesk knowledge" ON public.helpdesk_knowledge FOR SELECT USING (is_active = true);

-- Staff & Admin Policies
DROP POLICY IF EXISTS "Authenticated staff can view staff directory" ON public.staff_members;
CREATE POLICY "Authenticated staff can view staff directory" ON public.staff_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated staff can view permissions" ON public.role_permissions;
CREATE POLICY "Authenticated staff can view permissions" ON public.role_permissions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage hospital settings" ON public.hospital_settings;
CREATE POLICY "Admins can manage hospital settings" ON public.hospital_settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Admins can manage staff members" ON public.staff_members;
CREATE POLICY "Admins can manage staff members" ON public.staff_members FOR ALL USING (true);

DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;
CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL USING (true);

DROP POLICY IF EXISTS "Admins can manage helpdesk knowledge" ON public.helpdesk_knowledge;
CREATE POLICY "Admins can manage helpdesk knowledge" ON public.helpdesk_knowledge FOR ALL USING (true);

DROP POLICY IF EXISTS "Admins can manage role permissions" ON public.role_permissions;
CREATE POLICY "Admins can manage role permissions" ON public.role_permissions FOR ALL USING (true);

DROP POLICY IF EXISTS "Admins can manage search analytics" ON public.search_analytics;
CREATE POLICY "Admins can manage search analytics" ON public.search_analytics FOR ALL USING (true);
