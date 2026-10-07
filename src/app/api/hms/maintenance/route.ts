import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tickets = HMSService.getMaintenanceTickets();

    return NextResponse.json({
      success: true,
      tickets,
      summary: {
        total: tickets.length,
        open: tickets.filter((t) => t.status === "OPEN").length,
        inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
        resolved: tickets.filter((t) => t.status === "RESOLVED").length,
        critical: tickets.filter((t) => t.priority === "CRITICAL" && t.status !== "RESOLVED").length,
      },
    });
  } catch (error: any) {
    console.error("API GET /api/hms/maintenance error:", error);
    return NextResponse.json({ error: "Failed to fetch maintenance tickets." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ticketId } = body;

    const actor = body.actor || {
      id: "usr-maintenance",
      name: "Bio-Med Engineer",
      role: "MAINTENANCE_STAFF" as UserRole,
    };

    if (action === "resolve" && ticketId) {
      const resolved = HMSService.resolveMaintenanceTicket(ticketId, actor);

      if (!resolved) {
        return NextResponse.json({ error: "Maintenance ticket not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Maintenance ticket ${resolved.ticketNumber} marked resolved.`,
        ticket: resolved,
      });
    }

    // Default: New Maintenance Ticket
    const { equipmentName, department, issueDescription, priority, downtimeReported, assignedTo } = body;

    if (!equipmentName || !department || !issueDescription) {
      return NextResponse.json(
        { error: "equipmentName, department, and issueDescription are required." },
        { status: 400 }
      );
    }

    const ticket = HMSService.createMaintenanceTicket(
      {
        equipmentName,
        department,
        issueDescription,
        priority: priority || "MEDIUM",
        reportedBy: actor.name,
        assignedTo,
        downtimeReported: Boolean(downtimeReported),
      },
      actor
    );

    return NextResponse.json({
      success: true,
      message: `Maintenance ticket ${ticket.ticketNumber} logged for ${ticket.equipmentName}.`,
      ticket,
    });
  } catch (error: any) {
    console.error("API POST /api/hms/maintenance error:", error);
    return NextResponse.json({ error: "Failed to process maintenance ticket." }, { status: 500 });
  }
}
