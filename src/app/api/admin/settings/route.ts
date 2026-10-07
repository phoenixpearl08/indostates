import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/lib/adminService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = AdminService.getSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("API GET /api/admin/settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = AdminService.updateSettings(body);
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
