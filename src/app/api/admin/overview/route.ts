import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/lib/adminService";
import { requireServerAuth, ADMIN_ACCESS_ROLES } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: ADMIN_ACCESS_ROLES,
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const data = AdminService.getExecutiveOverview();
    return NextResponse.json({ success: true, ...data, viewer: auth.staff.role });
  } catch (error: any) {
    console.error("API GET /api/admin/overview error:", error);
    return NextResponse.json({ error: "Failed to fetch executive overview." }, { status: 500 });
  }
}

