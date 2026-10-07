import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const actor = searchParams.get("actor") || undefined;
    const action = searchParams.get("action") || undefined;
    const resource = searchParams.get("resource") || undefined;
    const format = searchParams.get("format");

    let logs = HMSService.getAuditLogs();

    if (actor) {
      logs = logs.filter((l) => l.actorName.toLowerCase().includes(actor.toLowerCase()) || l.actorRole.toLowerCase().includes(actor.toLowerCase()));
    }
    if (action) {
      logs = logs.filter((l) => l.action.toLowerCase().includes(action.toLowerCase()));
    }
    if (resource) {
      logs = logs.filter((l) => l.resource.toLowerCase().includes(resource.toLowerCase()));
    }

    if (format === "csv") {
      let csv = "Log ID,Timestamp,Actor Name,Actor Role,Action,Resource,Status,Details\n";
      logs.forEach((l) => {
        const detailsStr = JSON.stringify(l.details || {}).replace(/"/g, '""');
        csv += `"${l.id}","${l.createdAt}","${l.actorName}","${l.actorRole}","${l.action}","${l.resource}","${l.status}","${detailsStr}"\n`;
      });

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="indostates-audit-trail-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      logs,
      count: logs.length,
    });
  } catch (error: any) {
    console.error("API GET /api/admin/audit error:", error);
    return NextResponse.json({ error: "Failed to fetch audit logs." }, { status: 500 });
  }
}
