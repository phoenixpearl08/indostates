import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId") || undefined;
    const queues = HMSService.getQueues(doctorId);
    return NextResponse.json({ success: true, queues });
  } catch (error: any) {
    console.error("API GET /api/hms/queue error:", error);
    return NextResponse.json({ error: "Failed to fetch consultation queues." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, appointmentId, queueId, actor } = body;

    const safeActor = actor || {
      id: "usr-reception",
      name: "Front Office Reception",
      role: "RECEPTIONIST",
    };

    if (action === "checkin" || action === "check_in") {
      if (!appointmentId) {
        return NextResponse.json({ error: "appointmentId is required for check-in." }, { status: 400 });
      }
      const result = HMSService.checkInAppointment(appointmentId, safeActor);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: `Patient checked in successfully. Token: ${result.queueEntry?.tokenNumber}`,
        queueEntry: result.queueEntry,
        appointment: result.appointment,
      });
    }

    if (action === "call") {
      if (!queueId) {
        return NextResponse.json({ error: "queueId or tokenNumber is required." }, { status: 400 });
      }
      const entry = HMSService.callQueueToken(queueId, safeActor);
      if (!entry) {
        return NextResponse.json({ error: "Queue entry not found." }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Token ${entry.tokenNumber} called to doctor consultation room.`,
        queueEntry: entry,
      });
    }

    if (action === "start") {
      if (!queueId) {
        return NextResponse.json({ error: "queueId or tokenNumber is required." }, { status: 400 });
      }
      const entry = HMSService.startConsultationToken(queueId, safeActor);
      if (!entry) {
        return NextResponse.json({ error: "Queue entry not found." }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Token ${entry.tokenNumber} started consultation.`,
        queueEntry: entry,
      });
    }

    if (action === "complete") {
      if (!queueId) {
        return NextResponse.json({ error: "queueId or tokenNumber is required." }, { status: 400 });
      }
      const entry = HMSService.completeQueueToken(queueId, safeActor);
      if (!entry) {
        return NextResponse.json({ error: "Queue entry not found." }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Token ${entry.tokenNumber} consultation completed.`,
        queueEntry: entry,
      });
    }

    return NextResponse.json({ error: "Invalid action provided. Supported: 'checkin', 'call', 'start', 'complete'." }, { status: 400 });
  } catch (error: any) {
    console.error("API POST /api/hms/queue error:", error);
    return NextResponse.json({ error: "Failed to process queue action." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { queueId, status, actor } = body;
    if (!queueId) {
      return NextResponse.json({ error: "queueId is required." }, { status: 400 });
    }
    const safeActor = actor || {
      id: "usr-doctor",
      name: "Consultant Physician",
      role: "DOCTOR",
    };
    const entry = HMSService.callQueueToken(queueId, safeActor);
    if (!entry) {
      return NextResponse.json({ error: "Queue entry not found." }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: `Queue token ${entry.tokenNumber} updated to ${status || "called"}.`,
      queueEntry: entry,
    });
  } catch (error: any) {
    console.error("API PATCH /api/hms/queue error:", error);
    return NextResponse.json({ error: "Failed to update queue status." }, { status: 500 });
  }
}

