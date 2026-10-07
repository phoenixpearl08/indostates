import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as "ADMITTED" | "DISCHARGED" | "TRANSFERRED" | undefined;
    const uhid = searchParams.get("uhid") || undefined;
    const admissions = HMSService.getAdmissions(status, uhid);
    return NextResponse.json({ success: true, admissions });
  } catch (error: any) {
    console.error("API GET /api/hms/ipd error:", error);
    return NextResponse.json({ error: "Failed to fetch IPD admissions." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const actor = body.actor || {
      id: "usr-doctor",
      name: "Dr. Rajesh Rangaswamy",
      role: "DOCTOR" as UserRole,
    };

    if (action === "discharge") {
      const { admissionId, summary } = body;
      if (!admissionId) {
        return NextResponse.json({ error: "admissionId is required for discharge." }, { status: 400 });
      }

      const discharged = HMSService.dischargePatient(
        admissionId,
        summary || "Discharged in stable condition. Medication and follow-up advice given.",
        actor
      );

      if (!discharged) {
        return NextResponse.json({ error: "Admission record not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Patient discharged successfully under ${discharged.admissionNumber}. Bed released for sanitization.`,
        admission: discharged,
      });
    }

    // Default: New Inpatient Admission
    const { patientUhid, patientName, patientPhone, doctorId, doctorName, departmentId, wardId, wardName, bedId, bedNumber, admissionReason } =
      body;

    if (!patientUhid || !patientName || !bedId || !bedNumber || !wardId) {
      return NextResponse.json(
        { error: "patientUhid, patientName, wardId, bedId, and bedNumber are required for admission." },
        { status: 400 }
      );
    }

    const admission = HMSService.createAdmission(
      {
        patientUhid,
        patientName,
        patientPhone: patientPhone || "",
        doctorId: doctorId || "dr-rajesh-rangaswamy",
        doctorName: doctorName || "Dr. Rajesh Rangaswamy",
        departmentId: departmentId || "general-medicine",
        wardId,
        wardName: wardName || "Inpatient Ward",
        bedId,
        bedNumber,
        admissionDate: body.admissionDate || new Date().toISOString().split("T")[0],
        admissionReason: admissionReason || "Inpatient monitoring and clinical stabilization",
      },
      actor
    );

    return NextResponse.json({
      success: true,
      message: `Admission ${admission.admissionNumber} created. Bed ${admission.bedNumber} allocated.`,
      admission,
    });
  } catch (error: any) {
    console.error("API POST /api/hms/ipd error:", error);
    return NextResponse.json({ error: "Failed to process IPD admission request." }, { status: 500 });
  }
}
