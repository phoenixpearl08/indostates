import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { HousekeepingTask, UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tasks = HMSService.getHousekeepingTasks();

    return NextResponse.json({
      success: true,
      tasks,
      summary: {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === "PENDING").length,
        inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
        completed: tasks.filter((t) => t.status === "COMPLETED").length,
      },
    });
  } catch (error: any) {
    console.error("API GET /api/hms/housekeeping error:", error);
    return NextResponse.json({ error: "Failed to fetch housekeeping tasks." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, taskId, status } = body;

    const actor = body.actor || {
      id: "usr-housekeeping",
      name: "Housekeeping Supervisor",
      role: "HOUSEKEEPING_STAFF" as UserRole,
    };

    if (action === "update" && taskId && status) {
      const updated = HMSService.updateHousekeepingStatus(
        taskId,
        status as HousekeepingTask["status"],
        actor
      );

      if (!updated) {
        return NextResponse.json({ error: "Housekeeping task not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Task ${updated.taskNumber} status marked as ${status}.${status === "COMPLETED" ? " Location marked clean and available." : ""}`,
        task: updated,
      });
    }

    // Default: New Housekeeping Task
    const { locationType, locationId, description, priority, assignedStaffName } = body;

    if (!locationType || !locationId || !description) {
      return NextResponse.json(
        { error: "locationType, locationId, and description are required for housekeeping tasks." },
        { status: 400 }
      );
    }

    const task = HMSService.createHousekeepingTask(
      {
        locationType,
        locationId,
        description,
        priority: priority || "NORMAL",
        assignedStaffName,
      },
      actor
    );

    return NextResponse.json({
      success: true,
      message: `Housekeeping ticket ${task.taskNumber} logged for ${task.locationId}.`,
      task,
    });
  } catch (error: any) {
    console.error("API POST /api/hms/housekeeping error:", error);
    return NextResponse.json({ error: "Failed to process housekeeping request." }, { status: 500 });
  }
}
