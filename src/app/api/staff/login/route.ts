import { NextRequest, NextResponse } from "next/server";
import { StaffAuthService } from "@/lib/staffAuthService";
import { HMSService } from "@/lib/hmsService";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please enter both staff email address and password." },
        { status: 400 }
      );
    }

    const result = await StaffAuthService.authenticateStaff(email, password);

    if (!result.success || !result.staff) {
      return NextResponse.json(
        { error: result.error || "Invalid email or password." },
        { status: result.statusCode || 401 }
      );
    }

    const staff = result.staff;

    // Record audit log
    try {
      HMSService.recordAuditLog(
        staff.id,
        staff.full_name,
        staff.role as any,
        "staff.auth.login",
        `staff/${staff.email}`,
        { email: staff.email, role: staff.role, department: staff.department }
      );
    } catch {}

    const response = NextResponse.json({
      success: true,
      staff: {
        id: staff.id,
        employee_id: staff.employee_id,
        name: staff.full_name,
        email: staff.email,
        role: staff.role,
        department: staff.department,
        specialization: staff.specialization,
      },
      redirectUrl: result.redirectUrl,
      message: `Staff authentication successful as ${staff.role}.`,
    });

    // Set secure authentication cookies
    const cookieMaxAge = 60 * 60 * 24 * 7; // 7 days

    response.cookies.set("ish_auth_role", staff.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: cookieMaxAge,
      path: "/",
    });

    response.cookies.set(
      "ish_auth_user",
      JSON.stringify({
        id: staff.id,
        employee_id: staff.employee_id,
        name: staff.full_name,
        email: staff.email,
        role: staff.role,
        department: staff.department,
        specialization: staff.specialization,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: cookieMaxAge,
        path: "/",
      }
    );

    if (staff.token) {
      response.cookies.set("ish_staff_token", staff.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: cookieMaxAge,
        path: "/",
      });
    }

    return response;
  } catch (error: any) {
    console.error("API /api/staff/login error:", error);
    return NextResponse.json(
      { error: "Unable to sign in right now. Please try again." },
      { status: 500 }
    );
  }
}
