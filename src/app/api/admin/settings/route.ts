import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/lib/adminService";
import { requireServerAuth } from "@/lib/serverAuth";
import { HMSService } from "@/lib/hmsService";

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

    const settings = AdminService.getSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("API GET /api/admin/settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: ["SUPER_ADMIN", "ADMIN", "HOSPITAL_ADMIN"],
      requiredPermission: "system.manage",
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const body = await req.json();
    const updated = AdminService.updateSettings(body);

    HMSService.recordAuditLog(
      auth.staff.id,
      auth.staff.name,
      auth.staff.role,
      "settings.update",
      "settings/master",
      { updatedKeys: Object.keys(body) }
    );

    return NextResponse.json({
      success: true,
      message: "Hospital master configuration updated successfully.",
      settings: updated,
    });
  } catch (error: any) {
    console.error("API PUT /api/admin/settings error:", error);
    return NextResponse.json({ error: "Failed to update hospital settings." }, { status: 500 });
  }
}

