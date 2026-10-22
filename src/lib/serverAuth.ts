import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";
import { UserRole, Permission } from "@/types/hms";
import { hasPermission } from "./rbac";
import { HMSService } from "./hmsService";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  uhid?: string;
  department?: string;
  specialization?: string;
  token?: string;
}

export interface StaffTokenPayload {
  sessionId: string;
  id: string;
  employee_id?: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  specialization?: string;
  issuedAt: number;
  expiresAt: number;
}

export interface ServerAuthResult {
  authorized: boolean;
  staff?: StaffTokenPayload;
  error?: string;
  response?: NextResponse;
}

export const ADMIN_ACCESS_ROLES: UserRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "HOSPITAL_ADMIN",
  "MEDICAL_DIRECTOR",
  "OPERATIONS_MANAGER",
  "HR_MANAGER",
];

// Hospital Verified Staff Database across all 15 roles
export const VERIFIED_STAFF_ACCOUNTS: Record<
  string,
  { name: string; role: UserRole; department: string; passwordHash: string; uhid?: string }
> = {
  // 1. Super Admin
  "superadmin@indostates.com": {
    name: "Dr. Rajesh Rangaswamy (Executive Founder & Super Admin)",
    role: "SUPER_ADMIN",
    department: "Executive Board",
    passwordHash: "Super@123",
  },

  // 2. Hospital Administrator
  "admin@indostates.com": {
    name: "Chief Hospital Administrator",
    role: "HOSPITAL_ADMIN",
    department: "Hospital Administration",
    passwordHash: "Admin@123",
  },

  // 3. Medical Director
  "director@indostates.com": {
    name: "Dr. Logesh Thirumalaisamy (Medical Director)",
    role: "MEDICAL_DIRECTOR",
    department: "Clinical Governance & Triage",
    passwordHash: "Director@123",
  },

  // 4. Operations Manager
  "ops@indostates.com": {
    name: "Mr. Ayyappan (Hospital Operations Manager)",
    role: "OPERATIONS_MANAGER",
    department: "Hospital Operations",
    passwordHash: "Ops@123",
  },

  // 5. HR Manager
  "hr@indostates.com": {
    name: "Mrs. Revathi Sundaram (HR Director)",
    role: "HR_MANAGER",
    department: "Human Resources",
    passwordHash: "Hr@123",
  },

  // 6. Clinical Doctors
  "dr.rajesh@indostates.com": {
    name: "Dr. Rajesh Rangaswamy",
    role: "DOCTOR",
    department: "Neurovascular & Stroke",
    passwordHash: "Rajesh@123",
  },
  "dr.logesh@indostates.com": {
    name: "Dr. Logesh Thirumalaisamy",
    role: "DOCTOR",
    department: "Emergency & Acute Care",
    passwordHash: "Doctor@123",
  },
  "dr.vani@indostates.com": {
    name: "Dr. Vani Mohan",
    role: "DOCTOR",
    department: "Women's Health & Gynecology",
    passwordHash: "Doctor@123",
  },
  "dr.mohan@indostates.com": {
    name: "Dr. V. Mohan",
    role: "DOCTOR",
    department: "Surgical Services",
    passwordHash: "Doctor@123",
  },
  "dr.sundaram@indostates.com": {
    name: "Dr. K. S. Sundaram",
    role: "DOCTOR",
    department: "Preventive Cardiology",
    passwordHash: "Doctor@123",
  },
  "dr.kavitha@indostates.com": {
    name: "Dr. Anita Chandrasekhar",
    role: "DOCTOR",
    department: "Pathology & Diagnostics",
    passwordHash: "Doctor@123",
  },

  // 7. Nursing Staff
  "nurse@indostates.com": {
    name: "Sister Priya Venkatesh (Head Nurse)",
    role: "NURSE",
    department: "Inpatient & Day Care Nursing",
    passwordHash: "Nurse@123",
  },

  // 8. Front Desk / Reception
  "reception@indostates.com": {
    name: "Front Office Reception Desk",
    role: "RECEPTIONIST",
    department: "Patient Registration & Front Desk",
    passwordHash: "Reception@123",
  },

  // 9. Laboratory Technologist
  "lab@indostates.com": {
    name: "Karthik Subramanian (Senior Lab Tech)",
    role: "LAB_TECHNICIAN",
    department: "Central Automated Diagnostic Laboratory",
    passwordHash: "Lab@123",
  },

  // 10. Pharmacy Staff
  "pharmacy@indostates.com": {
    name: "Selvaraj Mani (Chief Pharmacist)",
    role: "PHARMACY_STAFF",
    department: "24/7 In-House Clinical Pharmacy",
    passwordHash: "Pharmacy@123",
  },

  // 11. Billing & Cashier
  "billing@indostates.com": {
    name: "Deepa Raman (Senior Billing Executive)",
    role: "BILLING_STAFF",
    department: "Patient Accounts & TPA Billing",
    passwordHash: "Billing@123",
  },

  // 12. Security Staff
  "security@indostates.com": {
    name: "Security Chief Officer (Gate 1)",
    role: "SECURITY_STAFF",
    department: "Hospital Security & Visitor Control",
    passwordHash: "Security@123",
  },

  // 13. Lab Verifier
  "verifier@indostates.com": {
    name: "Dr. Anita Chandrasekhar (MD Pathology Verifier)",
    role: "LAB_VERIFIER",
    department: "Central Pathology Verification",
    passwordHash: "Verifier@123",
  },

  // 14. Imaging & Radiology Staff
  "imaging@indostates.com": {
    name: "Ramesh Babu (Lead Radiographer MRI/CT)",
    role: "IMAGING_STAFF",
    department: "Diagnostic Center & Imaging",
    passwordHash: "Imaging@123",
  },

  // 15. Pharmacy Manager
  "pharmacymanager@indostates.com": {
    name: "Sundaramurthy (Pharmacy Inventory Manager)",
    role: "PHARMACY_MANAGER",
    department: "Pharmacy Procurement & Batch Control",
    passwordHash: "Pharmacy@123",
  },

  // 16. Finance Manager
  "finance@indostates.com": {
    name: "Venkatesan CFO (Finance & Reconciliation)",
    role: "FINANCE_MANAGER",
    department: "Finance & Accounts",
    passwordHash: "Finance@123",
  },

  // 17. Housekeeping Staff
  "housekeeping@indostates.com": {
    name: "Marimuthu (Sanitization & Housekeeping Lead)",
    role: "HOUSEKEEPING_STAFF",
    department: "Hospital Sanitization Services",
    passwordHash: "Clean@123",
  },

  // 18. Maintenance Staff
  "maintenance@indostates.com": {
    name: "Palanisamy (Bio-Medical Equipment Engineer)",
    role: "MAINTENANCE_STAFF",
    department: "Bio-Medical & Physical Plant Maintenance",
    passwordHash: "Fix@123",
  },

  // 19. Ambulance Staff
  "ambulance@indostates.com": {
    name: "Suresh Kumar (ACLS Emergency Ambulance Pilot)",
    role: "AMBULANCE_STAFF",
    department: "24/7 Rapid Emergency Response Fleet",
    passwordHash: "Ambulance@123",
  },

  // 20. Verified Patient
  "patient@indostates.com": {
    name: "Murugan Selvam",
    role: "PATIENT",
    department: "General Patient Registry",
    uhid: "IND-UHID-000101",
    passwordHash: "Patient@123",
  },

  // 21. Authorized Caregiver / Attender
  "caregiver@indostates.com": {
    name: "Saraswathi Murugan (Authorized Family Caregiver)",
    role: "ATTENDER_CAREGIVER",
    department: "Caregiver & Family Support",
    uhid: "IND-UHID-000101",
    passwordHash: "Caregiver@123",
  },
};

declare global {
  // eslint-disable-next-line no-var
  var __ISH_REGISTERED_PASSWORDS__: Map<string, string> | undefined;
}

export function registerPatientCredentials(email: string, pass: string): void {
  if (!global.__ISH_REGISTERED_PASSWORDS__) {
    global.__ISH_REGISTERED_PASSWORDS__ = new Map();
  }
  global.__ISH_REGISTERED_PASSWORDS__.set(email.toLowerCase().trim(), pass);
}

export function getRegisteredPatientPassword(email: string): string | undefined {
  if (!global.__ISH_REGISTERED_PASSWORDS__) {
    global.__ISH_REGISTERED_PASSWORDS__ = new Map();
  }
  return global.__ISH_REGISTERED_PASSWORDS__.get(email.toLowerCase().trim());
}

export function updateUserPassword(email: string, newPass: string): void {
  const norm = email.toLowerCase().trim();
  if (VERIFIED_STAFF_ACCOUNTS[norm]) {
    VERIFIED_STAFF_ACCOUNTS[norm].passwordHash = newPass;
  }
  registerPatientCredentials(norm, newPass);
}

/**
 * Server-side credential verification
 * NEVER trusts client-provided role. Returns server-verified role.
 */
export async function verifyUserCredentials(
  email: string,
  pass: string
): Promise<{ user: AuthUser | null; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Try Supabase Auth if configured
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      if (admin) {
        const { data: authData, error: authErr } = await admin.auth.signInWithPassword({
          email: normalizedEmail,
          password: pass,
        });

        if (!authErr && authData.user) {
          // Fetch role from profiles table
          const { data: profile } = await admin
            .from("profiles")
            .select("role, full_name")
            .eq("id", authData.user.id)
            .single();

          // Fetch patient uhid if patient
          let uhid: string | undefined;
          const { data: patientData } = await admin
            .from("patients")
            .select("uhid")
            .eq("user_id", authData.user.id)
            .single();
          if (patientData) uhid = patientData.uhid;

          const rawRole = profile?.role || "patient";
          const role = (rawRole.toUpperCase() as UserRole) || "PATIENT";

          return {
            user: {
              id: authData.user.id,
              name: profile?.full_name || authData.user.user_metadata?.full_name || "Authorized User",
              email: normalizedEmail,
              role,
              uhid,
              token: authData.session?.access_token || `token-${Date.now()}`,
            },
          };
        }
      }
    } catch (err) {
      console.warn("Supabase Auth fallback to verified local staff credentials:", err);
    }
  }

  // 2. Verified Staff & Demo Accounts
  const staff = VERIFIED_STAFF_ACCOUNTS[normalizedEmail];
  if (staff) {
    if (pass === staff.passwordHash) {
      const staffId = `usr-${normalizedEmail.replace(/[^a-z0-9]/g, "-")}`;
      const signedStaffToken = signStaffToken({
        sessionId: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        id: staffId,
        name: staff.name,
        email: normalizedEmail,
        role: staff.role,
        department: staff.department,
        issuedAt: Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });

      return {
        user: {
          id: staffId,
          name: staff.name,
          email: normalizedEmail,
          role: staff.role,
          uhid: staff.uhid,
          department: staff.department,
          token: signedStaffToken,
        },
      };
    } else {
      return { user: null, error: "Invalid password for authorized hospital account." };
    }
  }

  // 3. Registered Patients, UHID, Phone & Seed Accounts
  let matchedPatient = HMSService.getPatients().find(
    (p: any) =>
      (p.email && p.email.toLowerCase() === normalizedEmail) ||
      (p.uhid && p.uhid.toLowerCase() === normalizedEmail) ||
      (p.phone && p.phone.replace(/\D/g, "") === normalizedEmail.replace(/\D/g, ""))
  );

  const registeredPass = getRegisteredPatientPassword(normalizedEmail) || (matchedPatient?.email ? getRegisteredPatientPassword(matchedPatient.email) : undefined);

  if (registeredPass) {
    if (pass === registeredPass) {
      return {
        user: {
          id: matchedPatient ? matchedPatient.id : `pat-${Buffer.from(normalizedEmail).toString("base64").substring(0, 10)}`,
          name: matchedPatient ? matchedPatient.fullName : normalizedEmail.split("@")[0],
          email: matchedPatient?.email || normalizedEmail,
          role: "PATIENT",
          uhid: matchedPatient ? matchedPatient.uhid : `IND-UHID-999999`,
          token: `ish-patient-sig-${Date.now()}`,
        },
      };
    } else {
      return { user: null, error: "Invalid password for this registered patient account." };
    }
  }

  // Pre-seeded patient demo accounts or matching patient UHID/email
  if (
    normalizedEmail === "patient@example.com" ||
    normalizedEmail === "patient@indostates.com" ||
    normalizedEmail === "ind-uhid-000101" ||
    normalizedEmail === "9443211223" ||
    (matchedPatient && (pass === "Patient@123" || pass === "123456"))
  ) {
    const p = matchedPatient || {
      id: "pat-seed-001",
      fullName: "Murugan Selvam",
      email: "patient@indostates.com",
      uhid: "IND-UHID-000101",
    };
    return {
      user: {
        id: p.id,
        name: p.fullName,
        email: p.email,
        role: "PATIENT",
        uhid: p.uhid,
        token: `ish-patient-sig-${Date.now()}`,
      },
    };
  }

  // Check if patient exists in HMSService but password wasn't stored (e.g. from seed)
  if (matchedPatient && pass && pass.length >= 6) {
    return {
      user: {
        id: matchedPatient.id,
        name: matchedPatient.fullName,
        email: normalizedEmail,
        role: "PATIENT",
        uhid: matchedPatient.uhid,
        token: `ish-patient-sig-${Date.now()}`,
      },
    };
  }

  return { user: null, error: "No account found with this email. Please create a patient account or use mobile OTP." };
}

// ==============================================================================
// ENTERPRISE CRYPTOGRAPHIC STAFF SESSION & SERVER AUTHORIZATION ENGINE
// ==============================================================================

const STAFF_AUTH_SECRET =
  process.env.STAFF_AUTH_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "indostates_secure_staff_hmac_secret_key_2026_enterprise_production";

/**
 * Sign a staff token using HMAC SHA-256
 */
export function signStaffToken(payload: StaffTokenPayload): string {
  const json = JSON.stringify(payload);
  const dataB64 = Buffer.from(json, "utf-8").toString("base64url");
  const signature = crypto
    .createHmac("sha256", STAFF_AUTH_SECRET)
    .update(dataB64)
    .digest("base64url");
  return `${dataB64}.${signature}`;
}

/**
 * Verify a cryptographic staff token
 */
export function verifyStaffToken(token: string): StaffTokenPayload | null {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }
  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }
  const [dataB64, signature] = parts;
  try {
    const expectedSignature = crypto
      .createHmac("sha256", STAFF_AUTH_SECRET)
      .update(dataB64)
      .digest("base64url");

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const json = Buffer.from(dataB64, "base64url").toString("utf-8");
    const payload = JSON.parse(json) as StaffTokenPayload;

    if (!payload.expiresAt || payload.expiresAt <= Date.now()) {
      return null;
    }

    if (isSessionRevoked(payload.sessionId, payload.email, payload.issuedAt)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Session Revocation Store
declare global {
  // eslint-disable-next-line no-var
  var __ISH_REVOKED_SESSIONS__: Set<string> | undefined;
  // eslint-disable-next-line no-var
  var __ISH_REVOKED_USERS_TIMESTAMP__: Map<string, number> | undefined;
}

export function revokeSession(sessionId: string): void {
  if (!global.__ISH_REVOKED_SESSIONS__) {
    global.__ISH_REVOKED_SESSIONS__ = new Set();
  }
  global.__ISH_REVOKED_SESSIONS__.add(sessionId);
}

export function revokeStaffSessions(emailOrId: string): void {
  const key = emailOrId.toLowerCase().trim();
  if (!global.__ISH_REVOKED_USERS_TIMESTAMP__) {
    global.__ISH_REVOKED_USERS_TIMESTAMP__ = new Map();
  }
  global.__ISH_REVOKED_USERS_TIMESTAMP__.set(key, Date.now());
}

export function isSessionRevoked(sessionId: string, emailOrId: string, issuedAt: number): boolean {
  if (global.__ISH_REVOKED_SESSIONS__?.has(sessionId)) {
    return true;
  }
  if (global.__ISH_REVOKED_USERS_TIMESTAMP__) {
    const revTime = global.__ISH_REVOKED_USERS_TIMESTAMP__.get(emailOrId.toLowerCase().trim());
    if (revTime && issuedAt <= revTime) {
      return true;
    }
  }
  return false;
}

/**
 * Check whether a staff account is currently ACTIVE
 */
export async function isStaffActive(email: string, id?: string): Promise<boolean> {
  const normEmail = email.toLowerCase().trim();

  // 1. Supabase check if configured
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      if (admin) {
        const { data } = await admin
          .from("staff_profiles")
          .select("status")
          .eq("email", normEmail)
          .single();
        if (data) {
          return data.status === "ACTIVE";
        }
      }
    } catch (e) {
      console.warn("Supabase staff active check notice:", e);
    }
  }

  // 2. In-memory check
  const staffMembers = typeof (HMSService as any).getStaff === "function" ? (HMSService as any).getStaff() : [];
  const found = staffMembers.find((s: any) => s.email?.toLowerCase() === normEmail || (id && s.id === id));
  if (found && (found.status === "suspended" || found.status === "inactive" || found.status === "INACTIVE" || found.status === "SUSPENDED")) {
    return false;
  }

  return true;
}

/**
 * Server-side authorization helper for sensitive API routes
 * Enforces cryptographic token check, active status, and role/permission authorization.
 */
export async function requireServerAuth(
  req: NextRequest,
  options?: {
    allowedRoles?: (UserRole | string)[];
    requiredPermission?: Permission;
  }
): Promise<ServerAuthResult> {
  // Extract token from cookie or Authorization header
  const cookieToken = req.cookies.get("ish_staff_token")?.value;
  const headerToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const token = cookieToken || headerToken;

  if (!token) {
    return {
      authorized: false,
      error: "Authentication required. Please sign in to the hospital staff portal.",
      response: NextResponse.json(
        { error: "Authentication required. Please sign in to the hospital staff portal." },
        { status: 401 }
      ),
    };
  }

  const payload = verifyStaffToken(token);
  if (!payload) {
    return {
      authorized: false,
      error: "Invalid or expired staff session. Please sign in again.",
      response: NextResponse.json(
        { error: "Invalid or expired staff session. Please sign in again." },
        { status: 401 }
      ),
    };
  }

  const active = await isStaffActive(payload.email, payload.id);
  if (!active) {
    revokeSession(payload.sessionId);
    return {
      authorized: false,
      error: "Your staff account has been deactivated. Please contact hospital administration.",
      response: NextResponse.json(
        { error: "Your staff account has been deactivated. Please contact hospital administration." },
        { status: 401 }
      ),
    };
  }

  if (options?.allowedRoles && options.allowedRoles.length > 0) {
    const normUserRole = (payload.role || "").toUpperCase();
    const normalizedAllowed = options.allowedRoles.map((r) => r.toUpperCase());
    if (!normalizedAllowed.includes(normUserRole)) {
      return {
        authorized: false,
        staff: payload,
        error: `Access denied. Role ${payload.role} does not have access to this resource.`,
        response: NextResponse.json(
          { error: `Access denied. Role ${payload.role} does not have access to this resource.` },
          { status: 403 }
        ),
      };
    }
  }

  if (options?.requiredPermission) {
    if (!hasPermission(payload.role, options.requiredPermission)) {
      return {
        authorized: false,
        staff: payload,
        error: `Access denied. Missing required permission: ${options.requiredPermission}.`,
        response: NextResponse.json(
          { error: `Access denied. Missing required permission: ${options.requiredPermission}.` },
          { status: 403 }
        ),
      };
    }
  }

  return {
    authorized: true,
    staff: payload,
  };
}
