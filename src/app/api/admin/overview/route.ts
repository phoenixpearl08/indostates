import { NextResponse } from "next/server";
import { AdminService } from "@/lib/adminService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = AdminService.getExecutiveOverview();
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    console.error("API GET /api/admin/overview error:", error);
    return NextResponse.json({ error: "Failed to fetch executive overview." }, { status: 500 });
  }
}
