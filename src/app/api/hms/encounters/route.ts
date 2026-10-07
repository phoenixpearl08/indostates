import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId") || undefined;
    const encounters = HMSService.getEncounters(patientId);
    return NextResponse.json({ success: true, encounters });
  } catch (error: any) {
    console.error("API GET /api/hms/encounters error:", error);
    return NextResponse.json({ error: "Failed to fetch clinical encounters." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      appointmentId,
      patientId,
      doctorId,
      doctorName,
      chiefComplaint,
      vitals,
      clinicalFindings,
      diagnosis,
      treatmentPlan,
      followUpDays,
      followUpDate,
      status,
      actor,
    } = body;

    const effectivePatientId = patientId || body.patientUhid || "PAT-GUEST";
    const effectiveChiefComplaint = chiefComplaint || body.chiefComplaints || "General clinical consultation";
    const effectiveDiagnosis = diagnosis || "Clinical evaluation";

    if (!appointmentId || !doctorId) {
      return NextResponse.json(
        { error: "appointmentId and doctorId are required." },
        { status: 400 }
      );
    }

    const safeActor = actor || {
      id: doctorId,
      name: doctorName || "Consultant Doctor",
      role: "DOCTOR",
    };

    const encounter = HMSService.createEncounter(
      {
        appointmentId,
        patientId: effectivePatientId,
        doctorId,
        doctorName: doctorName || "Consultant Doctor",
        chiefComplaint: effectiveChiefComplaint,
        vitals,
        clinicalFindings,
        diagnosis: effectiveDiagnosis,
        treatmentPlan,
        followUpDays,
        followUpDate,
        status: status === "completed" ? "completed" : "in_progress",
        startedAt: new Date().toISOString(),
        completedAt: status === "completed" ? new Date().toISOString() : undefined,
      },
      safeActor
    );

    return NextResponse.json({
      success: true,
      message: "Clinical consultation record created successfully.",
      encounter,
    });
  } catch (error: any) {
    console.error("API POST /api/hms/encounters error:", error);
    return NextResponse.json({ error: "Failed to record consultation encounter." }, { status: 500 });
  }
}
