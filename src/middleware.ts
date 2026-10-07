import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow public routes unconditionally
  if (pathname === "/staff/login" || pathname === "/emergency") {
    return NextResponse.next();
  }

  // 2. Identify protected role dashboard routes
  const protectedPrefixes: Record<string, string[]> = {
    "/patient": ["PATIENT", "ATTENDER", "ATTENDER_CAREGIVER"],
    "/doctor": ["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR"],
    "/admin": ["ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR", "OPERATIONS_MANAGER", "HR_MANAGER", "FINANCE_MANAGER"],
    "/staff": ["DOCTOR", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR", "OPERATIONS_MANAGER", "NURSE", "RECEPTIONIST", "LAB_TECHNICIAN", "PHARMACY_STAFF", "BILLING_STAFF", "SECURITY_STAFF"],
    "/reception": ["RECEPTIONIST", "OPERATIONS_MANAGER", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
    "/nurse": ["NURSE", "DOCTOR", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
    "/lab": ["LAB_TECHNICIAN", "LAB_VERIFIER", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
    "/pharmacy": ["PHARMACY_STAFF", "PHARMACY_MANAGER", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
    "/billing": ["BILLING_STAFF", "FINANCE_MANAGER", "OPERATIONS_MANAGER", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
    "/security": ["SECURITY_STAFF", "OPERATIONS_MANAGER", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
    "/ipd": ["DOCTOR", "NURSE", "MEDICAL_DIRECTOR", "OPERATIONS_MANAGER", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
    "/emergency": ["DOCTOR", "NURSE", "AMBULANCE_STAFF", "OPERATIONS_MANAGER", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
  };

  const matchedPrefix = Object.keys(protectedPrefixes).find((prefix) => pathname.startsWith(prefix));

  if (!matchedPrefix) {
    return NextResponse.next();
  }

  // 3. Read authenticated role from cookie
  const authRoleCookie = req.cookies.get("ish_auth_role")?.value?.toUpperCase();
  const allowedRoles = protectedPrefixes[matchedPrefix];

  // If not logged in at all:
  // Direct staff/clinical routes to /staff/login, patient routes to /login
  if (!authRoleCookie) {
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

    const targetLogin = isStaffPortal ? "/staff/login" : "/login";
    const loginUrl = new URL(targetLogin, req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. If logged in but lacks role access, strictly redirect to authorized dashboard
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
  ],
};
