import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";
import { UserRole } from "@/types/hms";
import { VERIFIED_STAFF_ACCOUNTS } from "./serverAuth";

export type StaffRole =
  | "DOCTOR"
  | "ADMIN"
  | "SUPER_ADMIN"
  | "HOSPITAL_ADMIN"
  | "MEDICAL_DIRECTOR"
  | "OPERATIONS_MANAGER"
  | "HR_MANAGER"
  | "FINANCE_MANAGER"
  | "NURSE"
  | "RECEPTIONIST"
  | "LAB_TECHNICIAN"
  | "PHARMACY_STAFF"
  | "BILLING_STAFF"
  | "SECURITY_STAFF";

export interface StaffProfile {
  id: string;
  auth_user_id?: string;
  employee_id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: StaffRole;
  department: string;
  specialization?: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  token?: string;
}

export interface StaffAuthResult {
  success: boolean;
  staff?: StaffProfile;
  redirectUrl?: string;
  error?: string;
  statusCode: number;
}

// In-memory staff directory fallback initialized with verified staff
const IN_MEMORY_STAFF_PROFILES: Record<string, StaffProfile> = {
  "dr.rajesh@indostates.com": {
    id: "stf-001",
    employee_id: "ISH-DOC-001",
    full_name: "Dr. Rajesh Rangaswamy",
    email: "dr.rajesh@indostates.com",
    phone: "+91 94422 11001",
    role: "DOCTOR",
    department: "Neurovascular & Stroke",
    specialization: "Neuroradiology & Neurointervention",
    status: "ACTIVE",
  },
  "admin@indostates.com": {
    id: "stf-002",
    employee_id: "ISH-ADM-001",
    full_name: "Chief Hospital Administrator",
    email: "admin@indostates.com",
    phone: "+91 94422 11002",
    role: "ADMIN",
    department: "Hospital Administration",
    specialization: "Hospital Operations & Governance",
    status: "ACTIVE",
  },
  "superadmin@indostates.com": {
    id: "stf-003",
    employee_id: "ISH-SUP-001",
    full_name: "Dr. Rajesh Rangaswamy (Super Admin)",
    email: "superadmin@indostates.com",
    phone: "+91 94422 11003",
    role: "SUPER_ADMIN",
    department: "Executive Board",
    specialization: "Executive Administration",
    status: "ACTIVE",
  },
  "dr.logesh@indostates.com": {
    id: "stf-004",
    employee_id: "ISH-DOC-002",
    full_name: "Dr. Logesh Thirumalaisamy",
    email: "dr.logesh@indostates.com",
    phone: "+91 94422 11004",
    role: "DOCTOR",
    department: "Emergency & Acute Care",
    specialization: "Emergency Medicine & Triage",
    status: "ACTIVE",
  },
  "dr.vani@indostates.com": {
    id: "stf-005",
    employee_id: "ISH-DOC-003",
    full_name: "Dr. Vani Mohan",
    email: "dr.vani@indostates.com",
    phone: "+91 94422 11005",
    role: "DOCTOR",
    department: "Women's Health & Gynecology",
    specialization: "Obstetrics & Preventive Oncology",
    status: "ACTIVE",
  },
  "nurse@indostates.com": {
    id: "stf-007",
    employee_id: "ISH-NUR-001",
    full_name: "Sister Priya Venkatesh",
    email: "nurse@indostates.com",
    phone: "+91 94422 11007",
    role: "NURSE",
    department: "Inpatient Nursing",
    specialization: "Critical Care Nursing",
    status: "ACTIVE",
  },
  "reception@indostates.com": {
    id: "stf-008",
    employee_id: "ISH-REC-001",
    full_name: "Front Office Reception Lead",
    email: "reception@indostates.com",
    phone: "+91 94422 11008",
    role: "RECEPTIONIST",
    department: "Patient Registration",
    specialization: "Hospital Front Desk",
    status: "ACTIVE",
  },
};

export class StaffAuthService {
  /**
   * Determine target dashboard route based on staff role
   */
  static getDashboardRoute(role: StaffRole): string {
    const upper = role.toUpperCase();
    if (upper === "DOCTOR") {
      return "/doctor/dashboard";
    }
    if (["ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR", "OPERATIONS_MANAGER", "HR_MANAGER", "FINANCE_MANAGER"].includes(upper)) {
      return "/admin/dashboard";
    }
    if (upper === "NURSE") return "/nurse/dashboard";
    if (upper === "RECEPTIONIST") return "/reception/dashboard";
    if (upper === "LAB_TECHNICIAN" || upper === "LAB_VERIFIER") return "/lab/dashboard";
    if (upper === "PHARMACY_STAFF" || upper === "PHARMACY_MANAGER") return "/pharmacy/dashboard";
    if (upper === "BILLING_STAFF") return "/billing/dashboard";
    if (upper === "SECURITY_STAFF") return "/security/dashboard";
    return "/staff/login";
  }

  /**
   * Authenticate a staff member with email and password
   */
  static async authenticateStaff(email: string, pass: string): Promise<StaffAuthResult> {
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail || !pass) {
      return {
        success: false,
        error: "Please enter both staff email address and password.",
        statusCode: 400,
      };
    }

    let authenticatedUserId: string | null = null;
    let authPassed = false;

    // 1. Check Supabase Auth if configured
    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          const { data: authData, error: authErr } = await admin.auth.signInWithPassword({
            email: normalizedEmail,
            password: pass,
          });

          if (!authErr && authData.user) {
            authenticatedUserId = authData.user.id;
            authPassed = true;
          }
        }
      } catch (err) {
        console.warn("Supabase Auth check skipped / fallback:", err);
      }
    }

    // 2. Fallback to Verified Staff Directory Password Verification
    if (!authPassed) {
      const verifiedStaff = VERIFIED_STAFF_ACCOUNTS[normalizedEmail];
      if (verifiedStaff && verifiedStaff.passwordHash === pass) {
        authPassed = true;
        authenticatedUserId = `stf-usr-${normalizedEmail.replace(/[^a-z0-9]/g, "-")}`;
      }
    }

    if (!authPassed) {
      return {
        success: false,
        error: "Invalid email or password.",
        statusCode: 401,
      };
    }

    // 3. Fetch Staff Profile from Database (or Fallback Directory)
    let staffProfile: StaffProfile | null = null;

    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          const { data: dbStaff } = await admin
            .from("staff_profiles")
            .select("*")
            .eq("email", normalizedEmail)
            .single();

          if (dbStaff) {
            staffProfile = {
              id: dbStaff.id,
              auth_user_id: dbStaff.auth_user_id || authenticatedUserId || undefined,
              employee_id: dbStaff.employee_id,
              full_name: dbStaff.full_name,
              email: dbStaff.email,
              phone: dbStaff.phone,
              role: dbStaff.role as StaffRole,
              department: dbStaff.department,
              specialization: dbStaff.specialization,
              status: dbStaff.status,
            };
          }
        }
      } catch (err) {
        console.warn("Supabase staff_profiles query fallback:", err);
      }
    }

    if (!staffProfile) {
      staffProfile = IN_MEMORY_STAFF_PROFILES[normalizedEmail] || null;
    }

    // If still no profile, check verified staff accounts
    if (!staffProfile && VERIFIED_STAFF_ACCOUNTS[normalizedEmail]) {
      const vs = VERIFIED_STAFF_ACCOUNTS[normalizedEmail];
      staffProfile = {
        id: `stf-${normalizedEmail.replace(/[^a-z0-9]/g, "-")}`,
        employee_id: `ISH-EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        full_name: vs.name,
        email: normalizedEmail,
        role: vs.role as StaffRole,
        department: vs.department,
        status: "ACTIVE",
      };
    }

    if (!staffProfile) {
      return {
        success: false,
        error: "You are not authorized to access this portal.",
        statusCode: 403,
      };
    }

    // 4. Verify Account Status
    if (staffProfile.status === "INACTIVE" || staffProfile.status === "SUSPENDED") {
      return {
        success: false,
        error: "Your staff account is currently inactive. Please contact the hospital administrator.",
        statusCode: 403,
      };
    }

    // 5. Generate secure token
    staffProfile.token = `ish-stf-sig-${Buffer.from(normalizedEmail + ":" + Date.now()).toString("base64")}`;

    const redirectUrl = this.getDashboardRoute(staffProfile.role);

    return {
      success: true,
      staff: staffProfile,
      redirectUrl,
      statusCode: 200,
    };
  }
}
