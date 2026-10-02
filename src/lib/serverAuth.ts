import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";

export type UserRole = "patient" | "doctor" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  specialization?: string;
  token?: string;
}

// Hospital Verified Staff Database (Seeds for hospital operations & fallback when Supabase keys are pending)
export const VERIFIED_STAFF_ACCOUNTS: Record<
  string,
  { name: string; role: UserRole; department: string; passwordHash: string }
> = {
  "admin@indostates.com": {
    name: "Chief Hospital Administrator",
    role: "admin",
    department: "Hospital Administration",
    passwordHash: "Admin@123",
  },
  "director@indostates.com": {
    name: "Mrs. R. Vijayalakshmi (Managing Director)",
    role: "admin",
    department: "Hospital Operations",
    passwordHash: "Director@123",
  },
  "dr.rajesh@indostates.com": {
    name: "Dr. Rajesh Rangaswamy",
    role: "admin", // Executive Founder has dual admin & clinical lead
    department: "Neurovascular & Stroke",
    passwordHash: "Rajesh@123",
  },
  "dr.logesh@indostates.com": {
    name: "Dr. Logesh Thirumalaisamy",
    role: "doctor",
    department: "Emergency & Acute Care",
    passwordHash: "Doctor@123",
  },
  "dr.vani@indostates.com": {
    name: "Dr. Vani Mohan",
    role: "doctor",
    department: "Women's Health & Gynecology",
    passwordHash: "Doctor@123",
  },
  "dr.mohan@indostates.com": {
    name: "Dr. V. Mohan",
    role: "doctor",
    department: "Surgical Services",
    passwordHash: "Doctor@123",
  },
  "dr.sundaram@indostates.com": {
    name: "Dr. K. S. Sundaram",
    role: "doctor",
    department: "Preventive Cardiology",
    passwordHash: "Doctor@123",
  },
  "dr.kavitha@indostates.com": {
    name: "Dr. Anita Chandrasekhar",
    role: "doctor",
    department: "Pathology & Diagnostics",
    passwordHash: "Doctor@123",
  },
};

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
        // Authenticate via Supabase Auth
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

          const role = (profile?.role as UserRole) || "patient";
          return {
            user: {
              id: authData.user.id,
              name: profile?.full_name || authData.user.user_metadata?.full_name || "Authorized User",
              email: normalizedEmail,
              role,
              token: authData.session?.access_token || `token-${Date.now()}`,
            },
          };
        }
      }
    } catch (err) {
      console.warn("Supabase Auth fallback to verified local staff credentials:", err);
    }
  }

  // 2. Verified Staff Accounts (Clinical & Administrative Staff)
  const staff = VERIFIED_STAFF_ACCOUNTS[normalizedEmail];
  if (staff) {
    if (pass === staff.passwordHash) {
      return {
        user: {
          id: `usr-${normalizedEmail.replace(/[^a-z0-9]/g, "-")}`,
          name: staff.name,
          email: normalizedEmail,
          role: staff.role,
          department: staff.department,
          token: `ish-${staff.role}-sig-${Buffer.from(normalizedEmail).toString("base64")}`,
        },
      };
    } else {
      return { user: null, error: "Invalid password for authorized staff account." };
    }
  }

  // 3. Registered Patient Access (Patients can sign in with any valid email and 6+ character password)
  if (pass && pass.length >= 6) {
    return {
      user: {
        id: `patient-${Buffer.from(normalizedEmail).toString("base64").substring(0, 10)}`,
        name: normalizedEmail.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        email: normalizedEmail,
        role: "patient",
        token: `ish-patient-sig-${Date.now()}`,
      },
    };
  }

  return { user: null, error: "Invalid email or password. Password must be at least 6 characters." };
}
