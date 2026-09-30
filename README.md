# IndoStates Hospital — Web Platform & Administrative Management System

A digital healthcare web platform and administrative backend for **IndoStates Hospital**. Built with React, TypeScript, Node.js, Express, and Prisma ORM with PostgreSQL.

---

## 1. Project Overview

- **Public Hospital Website:** Responsive, accessible, SEO-optimized digital portal for patients, visitors, and community members.
- **Administrative Portal (`/admin`):** Architecturally isolated internal management console with Role-Based Access Control (RBAC).
- **Backend Architecture:** REST API v1 (`/api/v1`) built with Node.js, Express, TypeScript, Zod validation, JWT authentication, and Prisma ORM.
- **Data Safety:** Dual-mode data persistence architecture that connects seamlessly to PostgreSQL via Prisma, while gracefully operating in standalone mode when the database is offline.

---

## 2. Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Lucide Icons, Custom CSS Design System
- **Backend:** Node.js, Express, TypeScript, Zod, BcryptJS, JSONWebToken, Multer
- **Database & ORM:** PostgreSQL, Prisma ORM 6.19+
- **API Standard:** RESTful JSON API under `/api/v1`

---

## 3. Architecture & Directory Structure

```
indo-states-hospital/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment & Database config
│   │   ├── controllers/     # Modular route controllers
│   │   ├── middleware/      # Auth, RBAC, Validation, Error, Rate Limiting, Uploads
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Dual-mode data store & business services
│   │   ├── utils/           # Logger, JWT, Password helpers
│   │   ├── app.ts           # Express application setup
│   │   └── server.ts        # Server entrypoint
│   ├── test/                # Automated API test suite
│   ├── package.json
│   └── tsconfig.json
├── prisma/
│   ├── schema.prisma        # Complete 21-model relational schema
│   └── seed.ts              # RBAC roles & demo master data seed script
├── src/                     # Existing React Frontend
│   ├── components/          # UI components & forms (AppointmentWizard, ContactForm)
│   ├── context/             # Global Notification & State contexts
│   ├── data/                # Master hospital fallback data
│   ├── pages/               # Public pages & isolated AdminPage
│   ├── services/api/        # Centralized frontend API client & domain modules
│   └── types/               # TypeScript interfaces
├── .env.example             # Template for environment variables
├── package.json             # Root monorepo scripts
└── README.md
```

---

## 4. Environment Variables Configuration

Copy `.env.example` to `.env` in the root directory:

```bash
cp .env.example .env
```

Configuration keys:

```env
# Server
PORT=5000
NODE_ENV=development

# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/indostates_hospital?schema=public"

# Authentication
JWT_SECRET="your-secure-jwt-secret-replace-in-production"
JWT_EXPIRES_IN="24h"

# Client URLs
FRONTEND_URL="http://localhost:5173"
CORS_ORIGIN="http://localhost:5173"

# Upload Limits
MAX_UPLOAD_SIZE_MB=5
```

> **Security Rule:** Never commit the `.env` file to version control.

---

## 5. PostgreSQL & Prisma Setup

### 5.1 Generate Prisma Client
```bash
npm run prisma:generate
```

### 5.2 Run Migrations
When your PostgreSQL instance is running:
```bash
npx prisma migrate dev --name init
```

### 5.3 Seed Database
Seed RBAC roles, admin credentials, hospital profile, and departments:
```bash
npm run prisma:seed
```

---

## 6. Development Commands

### Run Frontend Dev Server (Port 5173)
```bash
npm run dev
```

### Run Backend API Server (Port 5000)
```bash
npm run dev:backend
```

### Run Automated Backend Tests
```bash
npm run test:backend
```

---

## 7. Production Build

Build both frontend and backend bundles:

```bash
# Build Frontend (outputs to dist/)
npm run build

# Build Backend (outputs to backend/dist/)
npm run build:backend
```

---

## 8. REST API Endpoints Overview

All APIs are mounted under `/api/v1`:

### Public Endpoints
- `GET /api/v1/health` — Service health check
- `GET /api/v1/hospital` — Hospital profile & verified contact details
- `GET /api/v1/departments` — Department listings (with search & pagination)
- `GET /api/v1/departments/:slug` — Department details & doctors
- `GET /api/v1/doctors` — Doctor roster (search, filter by department)
- `GET /api/v1/doctors/:slug` — Doctor clinical profile
- `GET /api/v1/services` — Medical services directory
- `GET /api/v1/facilities` — Infrastructure & facilities
- `GET /api/v1/health-packages` — Diagnostic & preventive health packages
- `GET /api/v1/articles` — Published health education articles
- `GET /api/v1/events` — Upcoming health camps and workshops
- `GET /api/v1/gallery` — Photo gallery items
- `GET /api/v1/careers` — Job vacancy openings
- `POST /api/v1/careers/:id/apply` — Submit job application & resume
- `POST /api/v1/appointments` — Submit consultation appointment request
- `POST /api/v1/contact` — Submit general contact enquiry
- `GET /api/v1/search?q={term}` — Global site search across doctors, departments, services

### Administrative Endpoints (Protected by JWT & RBAC)
- `POST /api/v1/auth/login` — Administrator authentication
- `GET /api/v1/auth/me` — Current admin profile & permissions
- `POST /api/v1/auth/logout` — Admin logout
- `GET /api/v1/admin/dashboard` — Live KPI metrics
- `GET /api/v1/admin/appointments` — Appointment queue
- `PATCH /api/v1/admin/appointments/:id/status` — Confirm, reschedule, complete, or cancel appointment
- `GET /api/v1/admin/enquiries` — Contact enquiries queue
- `PATCH /api/v1/admin/enquiries/:id/status` — Mark enquiry in-progress or resolved
- `POST /api/v1/admin/doctors` — Enroll new doctor into roster
- `PUT /api/v1/admin/doctors/:id` — Update doctor profile
- `DELETE /api/v1/admin/doctors/:id` — Remove doctor
- `GET /api/v1/admin/audit-logs` — Security audit trail (Super Admin only)

---

## 9. Administrative Accounts & RBAC

The system implements 4 distinct roles:

1. **SUPER_ADMIN**: Full system control, user management, audit logs.
   - Demo: `admin@indostates.example` / `AdminPassword@2026`
2. **HOSPITAL_ADMIN**: Hospital profile, departments, doctors, services.
3. **APPOINTMENT_MANAGER**: Consultation requests queue, status changes, desk notes.
   - Demo: `appointments@indostates.example` / `ApptPassword@2026`
4. **CONTENT_MANAGER**: Articles, events, gallery, announcements.
   - Demo: `content@indostates.example` / `ContentPassword@2026`

Passwords are encrypted using **bcryptjs** (10 salt rounds).

---

## 10. Future HIS/ERP Scope Note

In accordance with Phase 1 constraints, this phase covers the **public website + web management administration**. Full electronic medical records (EMR), inpatient/outpatient clinical workflows, pharmacy ERP, laboratory automation, nursing stations, and billing modules belong to a future hospital information system phase. The current database and API models have been architected with clean foreign keys and extensible schemas to integrate directly with HIS systems.
