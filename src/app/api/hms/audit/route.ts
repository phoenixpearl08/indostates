import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const roleCookie = (req.cookies.get("ish_auth_role")?.value || req.headers.get("x-hms-role"))?.toUpperCase();
    const adminRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR", "OPERATIONS_MANAGER", "HR_MANAGER"];

    if (!roleCookie || !adminRoles.includes(roleCookie)) {
      return NextResponse.json(
        { error: "Forbidden. Administrative privileges are required to inspect audit logs." },
        { status: 403 }
      );
    }

    const auditLogs = HMSService.getAuditLogs();
    return NextResponse.json({ success: true, auditLogs });
  } catch (error: any) {
    console.error("API GET /api/hms/audit error:", error);
    return NextResponse.json({ error: "Failed to retrieve audit logs." }, { status: 500 });
  }
}
