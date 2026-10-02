# Supabase Setup Guide – Indo States Health

This guide explains how to initialize and configure Supabase for Indo States Health.

## 1. Project Initialization
1. Navigate to [supabase.com](https://supabase.com) and create an organization and project named `indostates-health`.
2. Choose your region (recommended: **ap-south-1 (Mumbai, India)** for lowest latency and compliance with India's DPDP Act 2023).
3. Set a strong database password and save it securely in a password manager.

## 2. Running Schema Migrations
In your Supabase project dashboard, navigate to **SQL Editor** -> **New Query**, paste the following DDL, and run:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Patients, Doctors, Admins)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  role text not null check (role in ('patient', 'doctor', 'admin')),
  phone text,
  age integer,
  gender text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Doctor Directory
create table if not exists public.doctors (
  id text primary key,
  name text not null,
  role text not null,
  qualifications text not null,
  department_id text not null,
  specialization text not null,
  experience_years integer not null,
  biography text not null,
  avatar_url text,
  consultation_fee integer not null default 500,
  timing text not null,
  available_days text[] not null,
  languages text[] not null,
  is_active boolean default true
);

-- 3. Appointments Table
create table if not exists public.appointments (
  id uuid default uuid_generate_v4() primary key,
  reference_code text unique not null,
  patient_id uuid references public.profiles(id) on delete set null,
  patient_name text not null,
  patient_phone text not null,
  patient_email text,
  patient_age integer,
  patient_gender text,
  service_type text not null,
  target_id text not null,
  target_name text not null,
  doctor_id text references public.doctors(id) on delete set null,
  doctor_name text,
  appointment_date date not null,
  time_slot text not null,
  notes text,
  status text check (status in ('confirmed', 'completed', 'cancelled', 'pending')) default 'confirmed',
  payment_status text check (payment_status in ('pay_on_arrival', 'paid_online')) default 'pay_on_arrival',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.appointments enable row level security;

-- Profiles Policy: Users can view & update their own profile
create policy "Allow user access own profile" on public.profiles
  for all using (auth.uid() = id);

-- Appointments Policy: Patients view their own; Staff/Admins view all
create policy "Allow patient access own appointments" on public.appointments
  for select using (auth.uid() = patient_id);

create policy "Allow staff and admin access all appointments" on public.appointments
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role in ('doctor', 'admin')
    )
  );

-- Public Doctors View Policy
alter table public.doctors enable row level security;
create policy "Allow public read access to doctors" on public.doctors
  for select using (true);
```

## 3. Storage Bucket Configuration
For medical documents, report PDFs, and digital passes:
1. Navigate to **Storage** -> **Create new bucket**.
2. Name the bucket `medical-records`.
3. Set visibility to **Private** (Restricted).
4. Add access policies restricting downloads to the authenticated patient or treating physician.
