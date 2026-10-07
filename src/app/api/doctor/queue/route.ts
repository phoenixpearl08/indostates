import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";
import { HMSService } from "@/lib/hmsService";
import { DOCTORS } from "@/data/hospitalData";
import { UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId") || DOCTORS[0].id;
    const queues = DoctorService.getDoctorQueue(doctorId);

    return NextResponse.json({
      success: true,
      queue: queues,
      queues,
      count: queues.length,
      waitingCount: queues.filter((q) => q.status === "waiting").length,
      calledCount: queues.filter((q) => q.status === "called").length,
      inConsultationCount: queues.filter((q) => q.status === "in_consultation").length,
      completedCount: queues.filter((q) => q.status === "completed").length,
    });
  } catch (error: any) {
    console.error("API GET /api/doctor/queue error:", error);
    return NextResponse.json({ error: "Failed to fetch doctor queue." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const queueId = body.queueId || body.queueEntryId;
    const { action, actor } = body;

    if (!queueId || !action) {
      return NextResponse.json({ error: "queueId and action are required." }, { status: 400 });
    }

    const safeActor = actor || {
      id: "dr-logesh-thirumalaisamy",
      name: "Dr. Logesh Thirumalaisamy",
      role: "DOCTOR" as UserRole,
    };

    if (action === "call") {
      const entry = DoctorService.callPatient(queueId, safeActor);
      if (!entry) return NextResponse.json({ error: "Queue entry not found." }, { status: 404 });
      return NextResponse.json({
        success: true,
        message: `Token ${entry.tokenNumber} (${entry.patientName}) called to consultation room.`,
        queueEntry: entry,
      });
    }

    if (action === "start") {
      const entry = DoctorService.startConsultation(queueId, safeActor);
      if (!entry) return NextResponse.json({ error: "Queue entry not found." }, { status: 404 });
      return NextResponse.json({
        success: true,
        message: `Consultation started for Token ${entry.tokenNumber} (${entry.patientName}).`,
        queueEntry: entry,
      });
    }

    if (action === "complete") {
      const entry = HMSService.completeQueueToken(queueId, safeActor);
      if (!entry) return NextResponse.json({ error: "Queue entry not found." }, { status: 404 });
      return NextResponse.json({
        success: true,
        message: `Token ${entry.tokenNumber} marked as consultation completed.`,
        queueEntry: entry,
      });
    }

    return NextResponse.json({ error: "Invalid action. Supported: 'call', 'start', 'complete'." }, { status: 400 });
  } catch (error: any) {
    console.error("API POST /api/doctor/queue error:", error);
    return NextResponse.json({ error: "Failed to process queue action." }, { status: 500 });
  }
}
