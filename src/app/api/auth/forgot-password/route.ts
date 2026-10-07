import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid registered email address." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          await admin.auth.resetPasswordForEmail(normalizedEmail, {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
          });
        }
      } catch (err) {
        console.warn("Supabase resetPasswordForEmail notice:", err);
      }
    }

    // Generate reset token for fallback / local mode
    const resetToken = `rst-${Buffer.from(normalizedEmail).toString("base64")}-${Date.now()}`;

    HMSService.recordAuditLog(
      "anonymous",
      normalizedEmail,
      "PATIENT",
      "auth.forgot_password",
      `users/${normalizedEmail}`,
      { email: normalizedEmail }
    );

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, password reset instructions have been dispatched.",
      resetUrl: `/reset-password?token=${resetToken}&email=${encodeURIComponent(normalizedEmail)}`,
    });
  } catch (error: any) {
    console.error("API /api/auth/forgot-password error:", error);
    return NextResponse.json({ error: "Failed to process password reset request." }, { status: 500 });
  }
}
