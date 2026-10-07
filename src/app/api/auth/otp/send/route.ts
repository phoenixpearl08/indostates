import { NextRequest, NextResponse } from "next/server";
import { OTPService } from "@/lib/otpService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Mobile number is required to receive a verification OTP." },
        { status: 400 }
      );
    }

    const result = await OTPService.sendOTP(phone);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || "Failed to send verification OTP.",
          cooldownSeconds: result.cooldownSeconds,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to your mobile number. Valid for 5 minutes.`,
      cooldownSeconds: result.cooldownSeconds || 60,
      devOtp: result.devOtp, // In test/dev mode only for automated assertions
    });
  } catch (error: any) {
    console.error("API /api/auth/otp/send error:", error);
    return NextResponse.json(
      { error: "Server error while processing OTP dispatch." },
      { status: 500 }
    );
  }
}
