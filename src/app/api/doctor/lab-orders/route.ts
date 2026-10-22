import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";
import { HMSService } from "@/lib/hmsService";
import { requireServerAuth } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: ["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN", "LAB_VERIFIER", "NURSE"],
      requiredPermission: "lab.read",
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const { searchParams } = new URL(req.url);
    const requestedDoctorId = searchParams.get("doctorId");

    const isAdminOrStaff = ["ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR", "LAB_TECHNICIAN", "LAB_VERIFIER", "NURSE"].includes(auth.staff.role);
    const resolvedDoctorId = isAdminOrStaff && requestedDoctorId ? requestedDoctorId : auth.staff.id;

    const labOrders = DoctorService.getDoctorLabOrders(resolvedDoctorId);

    return NextResponse.json({
      success: true,
      labOrders,
      count: labOrders.length,
      pendingCount: labOrders.filter((l) => !l.isReportReleased).length,
      releasedCount: labOrders.filter((l) => l.isReportReleased).length,
    });
  } catch (error: any) {
    console.error("API GET /api/doctor/lab-orders error:", error);
    return NextResponse.json({ error: "Failed to fetch lab orders." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: ["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
      requiredPermission: "lab.write",
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const body = await req.json();
    const { appointmentId, patientId, testName, priority, clinicalIndication, sampleType } = body;

    if (!appointmentId || !patientId || !testName) {
      return NextResponse.json(
        { error: "appointmentId, patientId, and testName are required." },
        { status: 400 }
      );
    }

    // Verified actor from authenticated session
    const verifiedActor = {
      id: auth.staff.id,
      name: auth.staff.name,
      role: auth.staff.role,
    };

    const patient = HMSService.getPatientById(patientId) || HMSService.getPatientByUhid(patientId);

    const order = HMSService.createLabOrder(
      {
        appointmentId,
        patientId,
        patientUhid: patient?.uhid || patientId,
        patientName: patient?.fullName || "OPD Patient",
        doctorId: verifiedActor.id,
        doctorName: verifiedActor.name,
        testCode: `TEST-${Math.floor(100 + Math.random() * 900)}`,
        testName: testName.trim(),
        sampleType: sampleType || "Blood / Serum",
        sampleStatus: "ordered",
        isReportReleased: false,
      },
      verifiedActor
    );

    return NextResponse.json({
      success: true,
      message: `Diagnostic test order created: ${order.testName} (${order.orderId}).`,
      labOrder: order,
    });
  } catch (error: any) {
    console.error("API POST /api/doctor/lab-orders error:", error);
    return NextResponse.json({ error: "Failed to create lab order." }, { status: 500 });
  }
}

