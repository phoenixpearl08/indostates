# Indo States Health – Deployment & Handover Guide

## Executive Summary
This document provides production deployment instructions, environment setup, database migrations, security configurations, and administrative handover protocols for the new **Indo States Health** full-stack AI-enabled healthcare platform.

Official Hospital Domain: `https://indostates.com/`  
Facility Location: 10/77 - D Sengodagownden Pudur, Arasur, Coimbatore - 641407, Tamil Nadu, India.

---

## 1. System Architecture Overview

```
                                  [ Client Browser ]
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   ▼                                             ▼
          [ Public Pages ]                              [ Protected Portals ]
    • Homepage, About, Vision                    • Patient Dashboard (/portal/patient)
    • Doctors & Specialty Profiles               • Doctor Practice (/portal/doctor)
    • Diagnostic Center (1.5T MRI / 128 CT)      • Admin CMS (/portal/admin)
    • Master Health Checkup (₹3,500)
    • 8-Step Appointment Wizard
                   │                                             │
                   └──────────────────────┬──────────────────────┘
                                          │
                         [ Next.js 14 App Router API Layer ]
                   ┌──────────────────────┼──────────────────────┐
                   ▼                      ▼                      ▼
           /api/chat (IndoCare)  /api/appointments       /api/search
                   │                      │                      │
       [ Clinical Guardrails ]   [ Double-Booking Guard]  [ Full Spectrum Search ]
                   │                      │                      │
                   └──────────────────────┼──────────────────────┘
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   ▼                                             ▼
       [ Supabase PostgreSQL + RLS ]                 [ Local/Resilient Fallback ]
        (Encrypted Patient Records)                   (HospitalStore LocalStorage)
```

---

## 2. Complete Route Map

| Category | Route | Purpose & Key Features |
| :--- | :--- | :--- |
| **Core** | `/` | Homepage: Emergency ribbons, Hero, Flagship Master Checkup, 1.5T MRI/128-CT, Leadership preview. |
| **Institutional** | `/about` | Founding history under Dr. Rajesh Rangaswamy, 4 pillars (Prevent, Screen, Treat, Support). |
| | `/vision-mission` | Institutional vision, mission statements, and 4 core values. |
| | `/leadership` | Verified bios of executive leadership & clinical department heads. |
| | `/charity` | ARDOR Care Foundation, Section 12A/80G status, US 501(c)(3) entity. |
| | `/career` | Job openings (radiology technologists, phlebotomists, ICU/ER staff nurses). |
| **Specialists** | `/doctors` | Searchable directory with department filters and direct slot booking. |
| | `/doctors/[id]` | Individual specialist profile with clinical achievements, fees, and schedule. |
| **Departments** | `/departments` | All 8 clinical divisions & centers of excellence. |
| | `/departments/[slug]` | Individual department detail with doctor roster and key procedures. |
| **Preventive Care** | `/preventive-health` | 10 pillars of proactive screening and home blood collection. |
| | `/health-packages` | Package comparison: Master Checkup (₹3,500), Stroke Panel, Cardiac Risk. |
| **Diagnostics** | `/diagnostic-center` | Modality hub: 1.5T MRI, 128-Slice CT, 3D Mammography, DEXA, Central Lab. |
| | `/diagnostic-center/mri` | 1.5 Tesla MRI details, 14+ specialized scans, and matrix coil specs. |
| | `/diagnostic-center/ct` | 128-Slice CT, coronary calcium score, and virtual colonography. |
| | `/diagnostic-center/dexa` | Lunar DEXA Bone Mineral Densitometry & osteoporosis fracture risk (FRAX). |
| | `/diagnostic-center/mammography`| 3D Full-Field digital mammography for early breast cancer screening. |
| | `/diagnostic-center/laboratory` | Central clinical lab, automated biochemistry, and free home collection. |
| **Scheduling** | `/book-appointment` | 8-step wizard: Department -> Doctor -> Date -> Slot -> Patient -> Digital Pass. |
| **Support & Wayfinding**| `/patient-info` | First-time visitor guide, visiting hours, and legacy EHR bridge. |
| | `/emergency` | Direct 24/7 hotline (`0422-2111000`), Code Stroke protocol, and ground floor bay. |
| | `/contact` | Inquiry form, verified emails, phone numbers, and social channels. |
| | `/find-us` | Highway driving directions, GPS coordinates, and airport transit guide. |
| | `/faq` | Categorized searchable FAQs with accordion interactivity. |
| | `/assistant` | Dedicated IndoCare AI full-page conversational interface. |
| **Compliance** | `/privacy-policy` | DPDP Act 2023 compliance, data retention, and grievance contact. |
| | `/terms` | Booking rules, cancellation policy, and strict medical disclaimers. |
| | `/accessibility` | WCAG 2.1 AA conformance, high contrast, text scaling, and multilingual toggles. |
| **Portals & Auth** | `/login` & `/register` | Multi-role authentication (Patient, Doctor, Admin) with 1-click demo evaluation. |
| | `/portal/patient` | "What do I need to do next?", digital passes, rescheduling, family records. |
| | `/portal/doctor` | Clinic schedule, patient queue, consultation status, and clinical notes. |
| | `/portal/admin` | Doctor management CRUD, package pricing adjust, FAQ CMS, AI knowledge base. |

---

## 3. Production Build & Deployment Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Validate TypeScript & Compile Production Bundle
```bash
npm run build
```
Verify that the output shows `Route (app)` for all routes with zero errors.

### Step 3: Run the Production Server
```bash
npm run start
```
By default, the server listens on `http://localhost:3000`.

### Step 4: Deploying to Vercel / AWS / Hospital Cloud
1. Connect the GitHub repository to Vercel or your containerized host (Docker/ECS).
2. Configure environment variables using `.env.example`.
3. Set Node.js runtime version to `18.x` or higher.
4. Bind custom domain `indostates.com` with SSL/TLS termination.

---

## 4. Supabase Database Setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the Supabase SQL Editor, run the database migration script documented in `docs/architecture.md`.
3. Enable Row Level Security (RLS) on `patient_profiles`, `appointments`, and `medical_records`.
4. Copy `Project URL` and `anon public key` into your `.env` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

---

## 5. IndoCare AI Configuration & Safety

IndoCare AI is designed with strict healthcare guardrails:
1. **Never Diagnoses:** Refuses to diagnose acute symptoms as definitive conditions.
2. **Never Prescribes:** Refuses to recommend specific medications or dosages.
3. **Emergency Escalation:** Instantly detects stroke, chest pain, and trauma keywords, outputting the direct 24/7 hotline (`0422-2111000`).
4. **Verified RAG:** Grounds answers strictly in `hospitalData.ts`.

To connect external LLM providers (Google Gemini or OpenAI):
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-key
```
If no external API key is provided, IndoCare AI automatically operates in resilient local retrieval mode without breaking user experience.

---

## 6. Hospital IT Handover Checklist

- [x] All 27 public routes operational and styled with modern healthcare aesthetics.
- [x] Verified hospital data (address, leadership bios, package price ₹3,500, hotline `0422-2111000`) verified against `indostates.com`.
- [x] Multi-language support (English, தமிழ், हिंदी) functional across public UI and chatbot.
- [x] WCAG 2.1 AA accessibility bar operational (High Contrast, Large Font, Reduced Motion).
- [x] 8-Step appointment booking engine generating verifiable digital passes with QR codes.
- [x] Patient, Doctor, and Admin portals fully functional with interactive data persistence.
- [x] XML Sitemap and Robots.txt generated for SEO.
- [x] DPDP Act 2023 compliant privacy policy and medical disclaimers in place.
