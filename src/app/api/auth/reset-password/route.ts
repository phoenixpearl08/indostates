import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, token, newPassword } = await req.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          // Look up user by email
          const { data } = await admin.auth.admin.listUsers();
          const targetUser = data?.users?.find((u) => u.email?.toLowerCase() === normalizedEmail);
          if (targetUser) {
            await admin.auth.admin.updateUserById(targetUser.id, {
              password: newPassword,
            });
          }
        }
      } catch (err) {
        console.warn("Supabase reset password update warning:", err);
      }
    }

    HMSService.recordAuditLog(
      "anonymous",
      normalizedEmail,
      "PATIENT",
      "auth.reset_password_success",
      `users/${normalizedEmail}`,
      { email: normalizedEmail }
    );

    return NextResponse.json({
      success: true,
      message: "Your password has been reset successfully. You may now log in with your new password.",
      redirectUrl: "/login",
    });
  } catch (error: any) {
    console.error("API /api/auth/reset-password error:", error);
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
  }
}
