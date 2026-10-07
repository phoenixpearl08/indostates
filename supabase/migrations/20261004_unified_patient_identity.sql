-- ==============================================================================
-- INDOSTATES HOSPITAL: UNIFIED PATIENT IDENTITY & FAMILY MEMBERS MIGRATION
-- Safe incremental migration - strictly additive and non-destructive
-- ==============================================================================

-- 1. Create family_members table for authorized dependents
CREATE TABLE IF NOT EXISTS public.family_members (
  id TEXT PRIMARY KEY,
  patient_uhid TEXT NOT NULL,
  full_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  age INTEGER,
  date_of_birth DATE,
  gender TEXT,
  phone TEXT,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for rapid dependent lookup by primary patient UHID
CREATE INDEX IF NOT EXISTS idx_family_members_patient_uhid ON public.family_members(patient_uhid);

-- Enable RLS on family_members
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Drop prior policies if exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Patients can view their own family members" ON public.family_members;
  DROP POLICY IF EXISTS "Patients can manage their own family members" ON public.family_members;
  DROP POLICY IF EXISTS "Service role has full access to family members" ON public.family_members;
END $$;

-- Policies for family_members
CREATE POLICY "Patients can view their own family members"
  ON public.family_members FOR SELECT
  USING (
    patient_uhid IN (
      SELECT uhid FROM public.patient_profiles WHERE id = auth.uid()
    )
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Patients can manage their own family members"
  ON public.family_members FOR ALL
  USING (
    patient_uhid IN (
      SELECT uhid FROM public.patient_profiles WHERE id = auth.uid()
    )
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Service role has full access to family members"
  ON public.family_members FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 2. Additive columns for appointments if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'appointment_id'
  ) THEN
    ALTER TABLE public.appointments ADD COLUMN appointment_id TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'patient_uhid'
  ) THEN
    ALTER TABLE public.appointments ADD COLUMN patient_uhid TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'check_in_status'
  ) THEN
    ALTER TABLE public.appointments ADD COLUMN check_in_status TEXT DEFAULT 'PENDING';
  END IF;
END $$;

-- 3. Atomic Slot Reservation & Double Booking Prevention
-- Ensures no two active appointments exist for the same doctor, date, and slot
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_doctor_active_slot_v2
  ON public.appointments (doctor_id, appointment_date, time_slot)
  WHERE doctor_id IS NOT NULL 
    AND status NOT IN ('cancelled', 'CANCELLED', 'rejected', 'REJECTED');

-- Index on patient_uhid for appointment retrieval
CREATE INDEX IF NOT EXISTS idx_appointments_patient_uhid ON public.appointments(patient_uhid);
