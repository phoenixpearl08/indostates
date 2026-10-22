import { NextRequest, NextResponse } from "next/server";
import { DoctorService, ConsultationSubmission } from "@/lib/doctorService";
import { requireServerAuth } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: ["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
      requiredPermission: "clinical.read",
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("appointmentId");
    const requestedDoctorId = searchParams.get("doctorId");

    // Check if draft exists for specific appointment
    if (appointmentId) {
      const draft = DoctorService.getConsultationDraft(appointmentId);
      return NextResponse.json({
        success: true,
        draft,
      });
    }

    const isAdminOrDirector = ["ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR"].includes(auth.staff.role);
    const resolvedDoctorId = isAdminOrDirector && requestedDoctorId ? requestedDoctorId : auth.staff.id;

    const consultations = DoctorService.getDoctorConsultations(resolvedDoctorId);

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
    const auth = await requireServerAuth(req, {
      allowedRoles: ["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
      requiredPermission: "clinical.write",
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const body = await req.json();
    const consultation = body.consultation || body;
    const action = body.action || (body.status === "draft" ? "draft" : "finalize");

    if (!consultation || !consultation.appointmentId) {
      return NextResponse.json(
        { error: "Consultation payload and appointmentId are required." },
        { status: 400 }
      );
    }

    // Server-verified actor - cannot be spoofed by client
    const verifiedActor = {
      id: auth.staff.id,
      name: auth.staff.name,
      role: auth.staff.role,
    };

    // Bind consultation author to the authenticated clinician
    consultation.doctorId = auth.staff.id;
    consultation.doctorName = auth.staff.name;

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
        verifiedActor
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

