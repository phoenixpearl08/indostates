import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";
import { HMSService } from "@/lib/hmsService";
import { UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId") || "dr-logesh-thirumalaisamy";

    const labOrders = DoctorService.getDoctorLabOrders(doctorId);

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
    const body = await req.json();
    const { appointmentId, patientId, testName, priority, clinicalIndication, sampleType, actor } = body;

    if (!appointmentId || !patientId || !testName) {
      return NextResponse.json(
        { error: "appointmentId, patientId, and testName are required." },
        { status: 400 }
      );
    }

    const safeActor = actor || {
      id: "dr-logesh-thirumalaisamy",
      name: "Dr. Logesh Thirumalaisamy",
      role: "DOCTOR" as UserRole,
    };

    const patient = HMSService.getPatientById(patientId) || HMSService.getPatientByUhid(patientId);

    const order = HMSService.createLabOrder(
      {
        appointmentId,
        patientId,
        patientUhid: patient?.uhid || patientId,
        patientName: patient?.fullName || "OPD Patient",
        doctorId: safeActor.id,
        doctorName: safeActor.name,
        testCode: `TEST-${Math.floor(100 + Math.random() * 900)}`,
        testName: testName.trim(),
        sampleType: sampleType || "Blood / Serum",
        sampleStatus: "ordered",
        isReportReleased: false,
      },
      safeActor
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
