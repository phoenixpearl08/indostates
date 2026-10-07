import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId") || undefined;
    const labOrders = HMSService.getLabOrders(patientId);
    return NextResponse.json({ success: true, labOrders });
  } catch (error: any) {
    console.error("API GET /api/hms/lab error:", error);
    return NextResponse.json({ error: "Failed to fetch lab orders." }, { status: 500 });
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
      testCode,
      testName,
      sampleType,
      actor,
    } = body;

    const effectivePatientId = patientId || body.patientUhid || "PAT-GUEST";
    const effectiveTestCode = testCode || `LAB-${Math.floor(1000 + Math.random() * 9000)}`;

    if (!appointmentId || !patientName || !doctorId || !testName) {
      return NextResponse.json({ error: "Missing required lab test order fields." }, { status: 400 });
    }

    const safeActor = actor || {
      id: doctorId,
      name: doctorName || "Consultant Doctor",
      role: "DOCTOR",
    };

    const order = HMSService.createLabOrder(
      {
        encounterId,
        appointmentId,
        patientId: effectivePatientId,
        patientName,
        doctorId,
        doctorName: doctorName || "Consultant Doctor",
        testCode: effectiveTestCode,
        testName,
        sampleType: sampleType || "Blood Sample",
        sampleStatus: "ordered",
        isReportReleased: false,
      },
      safeActor
    );

    return NextResponse.json({
      success: true,
      message: `Diagnostic order ${order.orderId} transmitted to laboratory.`,
      order,
      labOrder: order,
    });
  } catch (error: any) {
    console.error("API POST /api/hms/lab error:", error);
    return NextResponse.json({ error: "Failed to generate lab order." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, orderId, sampleStatus, reportUrl, reportSummary, verifiedBy, actor } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required." }, { status: 400 });
    }

    const safeActor = actor || {
      id: "usr-lab",
      name: "Laboratory Technologist",
      role: "LAB_TECHNICIAN",
    };

    if (action === "sample") {
      const updated = HMSService.updateLabOrderStatus(orderId, sampleStatus, safeActor);
      if (!updated) {
        return NextResponse.json({ error: "Lab order not found." }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Sample status updated to ${sampleStatus}.`,
        order: updated,
      });
    }

    if (action === "release" || body.releasedToPatient || body.reportUrl || body.status === "completed") {
      const summaryText = reportSummary || body.findings || "Parameters within clinically acceptable limits.";
      const released = HMSService.releaseLabReport(
        orderId,
        reportUrl || "/reports/sample-diagnostic-report.pdf",
        summaryText,
        verifiedBy || "Dr. Anita Chandrasekhar (MD Pathology)",
        safeActor
      );
      if (!released) {
        return NextResponse.json({ error: "Lab order not found." }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Diagnostic report for ${released.orderId} verified and released to patient portal.`,
        order: released,
      });
    }

    return NextResponse.json({ error: "Invalid action. Supported: 'sample', 'release'." }, { status: 400 });
  } catch (error: any) {
    console.error("API PATCH /api/hms/lab error:", error);
    return NextResponse.json({ error: "Failed to update lab order." }, { status: 500 });
  }
}
