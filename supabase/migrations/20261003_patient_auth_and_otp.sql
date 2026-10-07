-- ==============================================================================
-- INDOSTATES HOSPITAL: PATIENT AUTHENTICATION, OTP & PROFILE EXTENSION
-- Strictly non-destructive additive migration: preserves all existing data and tables
-- Safe idempotency: IF NOT EXISTS for tables, columns, constraints & indexes
-- ==============================================================================

-- 1. Ensure extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Phone OTP Verification Ledger Table
CREATE TABLE IF NOT EXISTS public.phone_verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  phone TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  attempts INTEGER DEFAULT 0 NOT NULL,
  max_attempts INTEGER DEFAULT 3 NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_phone_verifications_phone ON public.phone_verifications(phone);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_expires ON public.phone_verifications(expires_at);

-- Enable RLS on phone verifications
ALTER TABLE public.phone_verifications ENABLE ROW LEVEL SECURITY;

-- Service role only access for phone OTP ledger (never exposed to public)
DROP POLICY IF EXISTS "Service role manages phone verifications" ON public.phone_verifications;
CREATE POLICY "Service role manages phone verifications"
  ON public.phone_verifications FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3. Ensure Patients table columns exist
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS blood_group TEXT;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS allergies TEXT[];
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS emergency_contact_relation TEXT;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active';

-- Safe check constraint for account status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'patients' AND constraint_name = 'patients_account_status_check'
  ) THEN
    ALTER TABLE public.patients ADD CONSTRAINT patients_account_status_check
      CHECK (account_status IN ('active', 'suspended'));
  END IF;
END $$;

-- 4. Safe Row Level Security Policies for Patients Table
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Patients can view their own record
DROP POLICY IF EXISTS "Patients can view own record" ON public.patients;
CREATE POLICY "Patients can view own record"
  ON public.patients FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'doctor')
    )
  );

-- Patients can update their own permitted demographic fields
DROP POLICY IF EXISTS "Patients can update own record" ON public.patients;
CREATE POLICY "Patients can update own record"
  ON public.patients FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins and Doctors can view all patient records
DROP POLICY IF EXISTS "Clinical staff and admins can access patients" ON public.patients;
CREATE POLICY "Clinical staff and admins can access patients"
  ON public.patients FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'doctor')
    )
  );

-- Service role full management
DROP POLICY IF EXISTS "Service role manages patients" ON public.patients;
CREATE POLICY "Service role manages patients"
  ON public.patients FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
