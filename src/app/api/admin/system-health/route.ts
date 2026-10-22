import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/lib/adminService";
import { requireServerAuth } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: ["SUPER_ADMIN", "ADMIN", "HOSPITAL_ADMIN"],
      requiredPermission: "system.manage",
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const health = AdminService.getSystemHealth();
    return NextResponse.json({ success: true, ...health });
  } catch (error: any) {
    console.error("API GET /api/admin/system-health error:", error);
    return NextResponse.json({ error: "Failed to fetch system health telemetry." }, { status: 500 });
  }
}

