import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tasks = HMSService.getNurseTasks();
    return NextResponse.json({ success: true, tasks });
  } catch (error: any) {
    console.error("API GET /api/hms/nurse error:", error);
    return NextResponse.json({ error: "Failed to fetch nurse tasks." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appointmentId, patientId, patientName, patientUhid, taskType, description, assignedNurseName, actor } =
      body;

    if (!appointmentId || !patientId || !patientName || !taskType || !description) {
      return NextResponse.json({ error: "Missing required nursing task fields." }, { status: 400 });
    }

    const safeActor = actor || {
      id: "usr-doctor",
      name: "Consultant Physician",
      role: "DOCTOR",
    };

    const task = HMSService.createNurseTask(
      {
        appointmentId,
        patientId,
        patientName,
        patientUhid: patientUhid || "IND-UHID-GENERAL",
        taskType,
        description,
        assignedNurseName,
        status: "pending",
      },
      safeActor
    );

    return NextResponse.json({
      success: true,
      message: `Nurse task ${task.taskId} assigned.`,
      task,
    });
  } catch (error: any) {
    console.error("API POST /api/hms/nurse error:", error);
    return NextResponse.json({ error: "Failed to assign nurse task." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { taskId, notes, actor } = body;

    if (!taskId) {
      return NextResponse.json({ error: "taskId is required." }, { status: 400 });
    }

    const safeActor = actor || {
      id: "usr-nurse",
      name: "Staff Nurse",
      role: "NURSE",
    };

    const task = HMSService.completeNurseTask(taskId, notes || "", safeActor);
    if (!task) {
      return NextResponse.json({ error: "Nurse task not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Nursing task ${task.taskId} marked as completed.`,
      task,
    });
  } catch (error: any) {
    console.error("API PATCH /api/hms/nurse error:", error);
    return NextResponse.json({ error: "Failed to complete nurse task." }, { status: 500 });
  }
}
