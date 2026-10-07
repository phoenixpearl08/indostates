import { NextResponse } from "next/server";
import { AdminService } from "@/lib/adminService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const health = AdminService.getSystemHealth();
    return NextResponse.json({ success: true, ...health });
  } catch (error: any) {
    console.error("API GET /api/admin/system-health error:", error);
    return NextResponse.json({ error: "Failed to fetch system health telemetry." }, { status: 500 });
  }
}
