import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";
import { HMSService } from "@/lib/hmsService";
import { DOCTORS } from "@/data/hospitalData";
import { requireServerAuth } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: ["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "NURSE"],
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const { searchParams } = new URL(req.url);
    const requestedDoctorId = searchParams.get("doctorId");

    const isAdminOrStaff = ["ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR", "NURSE"].includes(auth.staff.role);
    let resolvedDoctorId = auth.staff.id;

    if (isAdminOrStaff && requestedDoctorId) {
      resolvedDoctorId = requestedDoctorId;
    } else {
      const matched = DOCTORS.find(
        (d) => d.id === auth.staff!.id || (d.email && d.email.toLowerCase() === auth.staff!.email.toLowerCase())
      );
      if (matched) {
        resolvedDoctorId = matched.id;
      }
    }

    const queues = DoctorService.getDoctorQueue(resolvedDoctorId);

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
    const auth = await requireServerAuth(req, {
      allowedRoles: ["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "NURSE"],
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const body = await req.json();
    const queueId = body.queueId || body.queueEntryId;
    const { action } = body;

    if (!queueId || !action) {
      return NextResponse.json({ error: "queueId and action are required." }, { status: 400 });
    }

    // Actor is strictly resolved from the authenticated server session
    const verifiedActor = {
      id: auth.staff.id,
      name: auth.staff.name,
      role: auth.staff.role,
    };

    if (action === "call") {
      const entry = DoctorService.callPatient(queueId, verifiedActor);
      if (!entry) return NextResponse.json({ error: "Queue entry not found." }, { status: 404 });
      return NextResponse.json({
        success: true,
        message: `Token ${entry.tokenNumber} (${entry.patientName}) called to consultation room.`,
        queueEntry: entry,
      });
    }

    if (action === "start") {
      const entry = DoctorService.startConsultation(queueId, verifiedActor);
      if (!entry) return NextResponse.json({ error: "Queue entry not found." }, { status: 404 });
      return NextResponse.json({
        success: true,
        message: `Consultation started for Token ${entry.tokenNumber} (${entry.patientName}).`,
        queueEntry: entry,
      });
    }

    if (action === "complete") {
      const entry = HMSService.completeQueueToken(queueId, verifiedActor);
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

