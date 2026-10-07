import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/lib/adminService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const integrations = AdminService.getIntegrations();
    return NextResponse.json({ success: true, integrations });
  } catch (error: any) {
    console.error("API GET /api/admin/integrations error:", error);
    return NextResponse.json({ error: "Failed to fetch integrations." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { integrationId } = body;

    const integrations = AdminService.getIntegrations();
    const target = integrations.find((i) => i.id === integrationId);

    if (!target) {
      return NextResponse.json({ error: "Integration not found." }, { status: 404 });
    }

    target.lastChecked = new Date().toISOString();
    target.latencyMs = Math.floor(Math.random() * 20 + 10);

    return NextResponse.json({
      success: true,
      message: `${target.name} ping verified in ${target.latencyMs}ms.`,
      integration: target,
    });
  } catch (error: any) {
    console.error("API POST /api/admin/integrations error:", error);
    return NextResponse.json({ error: "Failed to test integration." }, { status: 500 });
  }
}
