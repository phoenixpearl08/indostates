import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow public routes unconditionally
  if (pathname === "/staff/login" || pathname === "/emergency") {
    return NextResponse.next();
  }

  // 2. Protect sensitive doctor and admin API routes
  if (pathname.startsWith("/api/doctor") || pathname.startsWith("/api/admin")) {
    const staffToken =
      req.cookies.get("ish_staff_token")?.value ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

    if (!staffToken) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to the hospital staff portal." },
        { status: 401 }
      );
    }

    // Basic structural check for signed token format
    const parts = staffToken.split(".");
    if (parts.length !== 2) {
      return NextResponse.json(
        { error: "Invalid staff session token. Please sign in again." },
        { status: 401 }
      );
    }

    // Role check from cookie if present for early gating
    const roleCookie = req.cookies.get("ish_auth_role")?.value?.toUpperCase();
    if (roleCookie) {
      if (["PATIENT", "ATTENDER", "ATTENDER_CAREGIVER"].includes(roleCookie)) {
        return NextResponse.json(
          { error: `Access denied. Role ${roleCookie} cannot access hospital staff endpoints.` },
          { status: 403 }
        );
      }

      if (pathname.startsWith("/api/admin")) {
        const strictlyAdminPaths = [
          "/api/admin/overview",
          "/api/admin/staff",
          "/api/admin/security",
          "/api/admin/roles",
          "/api/admin/settings",
          "/api/admin/system-health",
          "/api/admin/integrations",
          "/api/admin/audit",
          "/api/admin/audit-logs",
          "/api/admin/reports",
          "/api/admin/website",
          "/api/admin/helpdesk",
        ];
        const adminRoles = ["ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR", "OPERATIONS_MANAGER", "HR_MANAGER"];
        if (strictlyAdminPaths.some((p) => pathname.startsWith(p)) && !adminRoles.includes(roleCookie)) {
          return NextResponse.json(
            { error: `Access denied. Role ${roleCookie} cannot access administrative endpoints.` },
            { status: 403 }
          );
        }
      }

      if (pathname.startsWith("/api/doctor")) {
        const doctorRoles = ["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "NURSE"];
        if (!doctorRoles.includes(roleCookie)) {
          return NextResponse.json(
            { error: `Access denied. Role ${roleCookie} cannot access clinical doctor endpoints.` },
            { status: 403 }
          );
        }
      }
    }

    return NextResponse.next();
  }


  // 3. Identify protected role dashboard routes
  const protectedPrefixes: Record<string, string[]> = {
    "/patient": ["PATIENT", "ATTENDER", "ATTENDER_CAREGIVER"],
    "/doctor": ["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR"],
    "/admin": ["ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR", "OPERATIONS_MANAGER", "HR_MANAGER", "FINANCE_MANAGER"],
    "/staff": ["DOCTOR", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR", "OPERATIONS_MANAGER", "NURSE", "RECEPTIONIST", "LAB_TECHNICIAN", "PHARMACY_STAFF", "BILLING_STAFF", "SECURITY_STAFF"],
    "/reception": ["RECEPTIONIST", "OPERATIONS_MANAGER", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
    "/nurse": ["NURSE", "DOCTOR", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
    "/lab": ["LAB_TECHNICIAN", "LAB_VERIFIER", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
    "/pharmacy": ["PHARMACY_STAFF", "PHARMACY_MANAGER", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
    "/billing": ["BILLING_STAFF", "FINANCE_MANAGER", "OPERATIONS_MANAGER", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
    "/security": ["SECURITY_STAFF", "OPERATIONS_MANAGER", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
    "/ipd": ["DOCTOR", "NURSE", "MEDICAL_DIRECTOR", "OPERATIONS_MANAGER", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
    "/emergency": ["DOCTOR", "NURSE", "AMBULANCE_STAFF", "OPERATIONS_MANAGER", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
  };

  const matchedPrefix = Object.keys(protectedPrefixes).find((prefix) => pathname.startsWith(prefix));

  if (!matchedPrefix) {
    return NextResponse.next();
  }

  // 4. Read authenticated role from cookie
  const authRoleCookie = req.cookies.get("ish_auth_role")?.value?.toUpperCase();
  const allowedRoles = protectedPrefixes[matchedPrefix];

  const isStaffPortal =
    pathname.startsWith("/doctor") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/staff") ||
    pathname.startsWith("/reception") ||
    pathname.startsWith("/nurse") ||
    pathname.startsWith("/lab") ||
    pathname.startsWith("/pharmacy") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/security") ||
    pathname.startsWith("/ipd");

  // If staff portal, strictly require signed HMAC token
  if (isStaffPortal) {
    const staffToken = req.cookies.get("ish_staff_token")?.value;
    if (!staffToken || staffToken.split(".").length !== 2) {
      const loginUrl = new URL("/staff/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If not logged in at all:
  // Direct staff/clinical routes to /staff/login, patient routes to /login
  if (!authRoleCookie) {
    const targetLogin = isStaffPortal ? "/staff/login" : "/login";
    const loginUrl = new URL(targetLogin, req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. If logged in but lacks role access, strictly redirect to authorized dashboard
  if (!allowedRoles.includes(authRoleCookie)) {
    const roleDashboardMap: Record<string, string> = {
      PATIENT: "/patient/dashboard",
      ATTENDER: "/patient/dashboard",
      ATTENDER_CAREGIVER: "/patient/dashboard",
      DOCTOR: "/doctor/dashboard",
      DEPARTMENT_HEAD: "/doctor/dashboard",
      NURSE: "/nurse/dashboard",
      RECEPTIONIST: "/reception/dashboard",
      LAB_TECHNICIAN: "/lab/dashboard",
      LAB_VERIFIER: "/lab/dashboard",
      IMAGING_STAFF: "/doctor/dashboard",
      PHARMACY_STAFF: "/pharmacy/dashboard",
      PHARMACY_MANAGER: "/pharmacy/dashboard",
      BILLING_STAFF: "/billing/dashboard",
      FINANCE_MANAGER: "/billing/dashboard",
      SECURITY_STAFF: "/security/dashboard",
      HOUSEKEEPING_STAFF: "/admin/dashboard",
      MAINTENANCE_STAFF: "/admin/dashboard",
      AMBULANCE_STAFF: "/emergency/dashboard",
      ADMIN: "/admin/dashboard",
      SUPER_ADMIN: "/admin/dashboard",
      HOSPITAL_ADMIN: "/admin/dashboard",
      MEDICAL_DIRECTOR: "/admin/dashboard",
      OPERATIONS_MANAGER: "/admin/dashboard",
      HR_MANAGER: "/admin/dashboard",
    };

    const targetPath = roleDashboardMap[authRoleCookie] || "/unauthorized";
    if (targetPath === pathname) {
      return NextResponse.next();
    }
    const targetUrl = new URL(targetPath, req.url);
    targetUrl.searchParams.set("error", "unauthorized_access");
    return NextResponse.redirect(targetUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/patient/:path*",
    "/doctor/:path*",
    "/staff/:path*",
    "/reception/:path*",
    "/nurse/:path*",
    "/lab/:path*",
    "/pharmacy/:path*",
    "/billing/:path*",
    "/security/:path*",
    "/ipd/:path*",
    "/emergency/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/doctor/:path*",
  ],
};
