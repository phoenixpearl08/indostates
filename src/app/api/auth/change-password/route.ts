import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { updateUserPassword } from "@/lib/serverAuth";

export async function POST(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const authUserCookie = req.cookies.get("ish_auth_user")?.value;
    if (!authUserCookie) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    let parsedUser: any;
    try {
      parsedUser = JSON.parse(authUserCookie);
    } catch {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }

    // Persist to server authentication store
    if (parsedUser.email) {
      updateUserPassword(parsedUser.email, newPassword);
    }

    // Update in Supabase Auth if user ID is a UUID
    if (isSupabaseConfigured() && parsedUser.id) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          await admin.auth.admin.updateUserById(parsedUser.id, {
            password: newPassword,
          });
        }
      } catch (err) {
        console.warn("Supabase password update fallback:", err);
      }
    }

    HMSService.recordAuditLog(
      parsedUser.id,
      parsedUser.name,
      parsedUser.role,
      "auth.change_password",
      `users/${parsedUser.email}`,
      { email: parsedUser.email }
    );

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error: any) {
    console.error("API /api/auth/change-password error:", error);
    return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
  }
}
