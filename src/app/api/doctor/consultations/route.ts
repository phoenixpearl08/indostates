import { NextRequest, NextResponse } from "next/server";
import { DoctorService, ConsultationSubmission } from "@/lib/doctorService";
import { UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId") || "dr-logesh-thirumalaisamy";
    const appointmentId = searchParams.get("appointmentId");

    // Check if draft exists for specific appointment
    if (appointmentId) {
      const draft = DoctorService.getConsultationDraft(appointmentId);
      return NextResponse.json({
        success: true,
        draft,
      });
    }

    const consultations = DoctorService.getDoctorConsultations(doctorId);

    return NextResponse.json({
      success: true,
      consultations,
      count: consultations.length,
    });
  } catch (error: any) {
    console.error("API GET /api/doctor/consultations error:", error);
    return NextResponse.json({ error: "Failed to fetch consultations." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const consultation = body.consultation || body;
    const action = body.action || (body.status === "draft" ? "draft" : "finalize");

    if (!consultation || !consultation.appointmentId) {
      return NextResponse.json(
        { error: "Consultation payload and appointmentId are required." },
        { status: 400 }
      );
    }

    const safeActor = body.actor || {
      id: consultation.doctorId || "dr-logesh-thirumalaisamy",
      name: consultation.doctorName || "Dr. Logesh Thirumalaisamy",
      role: "DOCTOR" as UserRole,
    };

    // Action 1: Save Draft
    if (action === "draft") {
      const result = DoctorService.saveConsultationDraft(consultation as ConsultationSubmission);
      return NextResponse.json({
        success: true,
        message: result.message,
      });
    }

    // Action 2: Finalize Consultation
    if (action === "finalize" || !action) {
      if (!consultation.diagnosis || !consultation.diagnosis.trim()) {
        return NextResponse.json(
          { error: "A primary clinical diagnosis is required to complete consultation." },
          { status: 400 }
        );
      }

      const result = DoctorService.finalizeConsultation(
        consultation as ConsultationSubmission,
        safeActor
      );

      return NextResponse.json({
        success: true,
        consultation: {
          ...result.encounter,
          prescriptionId: result.prescription?.id,
        },
        encounter: result.encounter,
        prescription: result.prescription,
        labOrders: result.labOrders,
        message: result.message,
      });
    }

    return NextResponse.json({ error: "Invalid action. Supported: 'draft', 'finalize'." }, { status: 400 });
  } catch (error: any) {
    console.error("API POST /api/doctor/consultations error:", error);
    return NextResponse.json({ error: "Failed to record consultation." }, { status: 500 });
  }
}
