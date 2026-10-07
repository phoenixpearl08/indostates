import { NextRequest, NextResponse } from "next/server";
import { OTPService } from "@/lib/otpService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp, fullName, dateOfBirth, age, gender, email } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Both mobile number and 6-digit OTP code are required." },
        { status: 400 }
      );
    }

    const result = await OTPService.verifyOTP(phone, otp, {
      fullName,
      dateOfBirth,
      age,
      gender,
      email,
    });

    if (!result.success || !result.patient) {
      return NextResponse.json(
        {
          error: result.error || "Verification failed. Please check the OTP code and retry.",
          remainingAttempts: result.remainingAttempts,
        },
        { status: 401 }
      );
    }

    const patient = result.patient;

    const userObj = {
      id: patient.id,
      name: patient.fullName,
      email: patient.email,
      phone: patient.phone,
      role: "PATIENT",
      uhid: patient.uhid,
      token: `ish-patient-otp-sig-${Date.now()}`,
    };

    const response = NextResponse.json({
      success: true,
      user: userObj,
      uhid: patient.uhid,
      isNewPatient: result.isNewPatient,
      redirectUrl: "/patient/dashboard",
      message: `Verified successfully. Welcome, ${patient.fullName}. UHID: ${patient.uhid}.`,
    });

    // Set secure authentication cookies for session persistence
    response.cookies.set("ish_auth_role", "PATIENT", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days persistent session
      path: "/",
    });

    response.cookies.set("ish_auth_user", JSON.stringify(userObj), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("API /api/auth/otp/verify error:", error);
    return NextResponse.json(
      { error: "Server error during OTP verification." },
      { status: 500 }
    );
  }
}
