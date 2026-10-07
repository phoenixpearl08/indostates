import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId") || undefined;
    const prescriptions = HMSService.getPrescriptions(patientId);
    return NextResponse.json({ success: true, prescriptions });
  } catch (error: any) {
    console.error("API GET /api/hms/prescriptions error:", error);
    return NextResponse.json({ error: "Failed to fetch prescriptions." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      encounterId,
      appointmentId,
      patientId,
      patientName,
      doctorId,
      doctorName,
      medications,
      instructions,
      actor,
    } = body;

    const effectivePatientId = patientId || body.patientUhid || "PAT-GUEST";
    const effectiveMeds = Array.isArray(medications) ? medications : Array.isArray(body.items) ? body.items : [];

    if (!appointmentId || !patientName || !doctorId || effectiveMeds.length === 0) {
      return NextResponse.json({ error: "Missing required prescription fields or medications list." }, { status: 400 });
    }

    const safeActor = actor || {
      id: doctorId,
      name: doctorName || "Consultant Doctor",
      role: "DOCTOR",
    };

    const prescription = HMSService.createPrescription(
      {
        encounterId: encounterId || "",
        appointmentId,
        patientId: effectivePatientId,
        patientName,
        doctorId,
        doctorName: doctorName || "Consultant Doctor",
        medications: effectiveMeds,
        instructions: instructions || "Follow prescribed dosages carefully.",
        status: "pending_dispense",
      },
      safeActor
    );

    return NextResponse.json({
      success: true,
      message: `Prescription ${prescription.prescriptionId} generated and transmitted to pharmacy.`,
      prescription,
    });
  } catch (error: any) {
    console.error("API POST /api/hms/prescriptions error:", error);
    return NextResponse.json({ error: "Failed to create prescription." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { prescriptionId, pharmacistName, actor } = body;

    if (!prescriptionId) {
      return NextResponse.json({ error: "prescriptionId is required." }, { status: 400 });
    }

    const safeActor = actor || {
      id: "usr-pharmacy",
      name: pharmacistName || "Hospital Pharmacist",
      role: "PHARMACY_STAFF",
    };

    const target = HMSService.dispensePrescription(prescriptionId, pharmacistName || "Hospital Pharmacist", safeActor);
    if (!target) {
      return NextResponse.json({ error: "Prescription record not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Prescription ${target.prescriptionId} marked as dispensed.`,
      prescription: target,
    });
  } catch (error: any) {
    console.error("API PATCH /api/hms/prescriptions error:", error);
    return NextResponse.json({ error: "Failed to update prescription status." }, { status: 500 });
  }
}
