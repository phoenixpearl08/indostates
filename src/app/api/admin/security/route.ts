import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/lib/adminService";

export const dynamic = "force-dynamic";

let securityPolicies = {
  sessionTimeoutMinutes: 60,
  enforce2FAForStaff: true,
  maxFailedLoginAttempts: 5,
  passwordExpiryDays: 90,
  ipAllowlistEnabled: false,
};

export async function GET() {
  try {
    const events = AdminService.getSecurityEvents();
    const activeSessions = [
      { id: "sess-1", user: "admin@indostates.com", role: "HOSPITAL_ADMIN", ip: "192.168.1.10", client: "Chrome / Windows 11", loginTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), status: "active" },
      { id: "sess-2", user: "dr.rajesh@indostates.com", role: "SUPER_ADMIN", ip: "192.168.1.25", client: "Safari / macOS Sonoma", loginTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(), status: "active" },
      { id: "sess-3", user: "reception@indostates.com", role: "RECEPTIONIST", ip: "192.168.1.15", client: "Firefox / Windows 10", loginTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(), status: "active" },
    ];

    const failedLoginsCount = events.filter((e) => e.eventType === "LOGIN_FAILED").length;

    return NextResponse.json({
      success: true,
      events,
      activeSessions,
      failedLoginsCount,
      policies: securityPolicies,
    });
  } catch (error: any) {
    console.error("API GET /api/admin/security error:", error);
    return NextResponse.json({ error: "Failed to fetch security center data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "update_policies") {
      const { policies } = body;
      securityPolicies = { ...securityPolicies, ...policies };
      return NextResponse.json({
        success: true,
        message: "Hospital security policies updated.",
        policies: securityPolicies,
      });
    }

    if (action === "revoke_session") {
      const { sessionId } = body;
      return NextResponse.json({
        success: true,
        message: `Session ${sessionId} revoked immediately.`,
      });
    }

    return NextResponse.json({ error: "Invalid security action." }, { status: 400 });
  } catch (error: any) {
    console.error("API POST /api/admin/security error:", error);
    return NextResponse.json({ error: "Failed to process security action." }, { status: 500 });
  }
}
