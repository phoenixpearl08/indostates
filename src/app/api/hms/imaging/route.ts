import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientUhid = searchParams.get("patientUhid") || undefined;
    const orders = HMSService.getImagingOrders(patientUhid);

    return NextResponse.json({
      success: true,
      orders,
      summary: {
        total: orders.length,
        scheduled: orders.filter((o) => o.status === "SCHEDULED").length,
        verified: orders.filter((o) => o.status === "REPORT_VERIFIED").length,
      },
    });
  } catch (error: any) {
    console.error("API GET /api/hms/imaging error:", error);
    return NextResponse.json({ error: "Failed to fetch imaging orders." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const actor = body.actor || {
      id: "usr-imaging",
      name: "Dr. K. Swaminathan",
      role: "IMAGING_STAFF" as UserRole,
    };

    if (action === "verify") {
      const { orderId, reportSummary, radiologistName } = body;
      if (!orderId || !reportSummary) {
        return NextResponse.json({ error: "orderId and reportSummary are required for verification." }, { status: 400 });
      }

      const verified = HMSService.verifyImagingReport(
        orderId,
        reportSummary,
        radiologistName || actor.name,
        actor
      );

      if (!verified) {
        return NextResponse.json({ error: "Imaging order not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Imaging study ${verified.orderId} verified and report released.`,
        order: verified,
      });
    }

    // Default: Order Imaging Study
    const { appointmentId, patientUhid, patientName, doctorId, doctorName, modality, studyName, preparationInstructions } =
      body;

    if (!appointmentId || !patientUhid || !modality || !studyName) {
      return NextResponse.json(
        { error: "appointmentId, patientUhid, modality, and studyName are required." },
        { status: 400 }
      );
    }

    const order = HMSService.createImagingOrder(
      {
        appointmentId,
        patientUhid,
        patientName: patientName || "Patient",
        doctorId: doctorId || "dr-rajesh-rangaswamy",
        doctorName: doctorName || "Dr. Rajesh Rangaswamy",
        modality,
        studyName,
        preparationInstructions: preparationInstructions || "Follow standard departmental instructions.",
      },
      actor
    );

    return NextResponse.json({
      success: true,
      message: `Imaging order ${order.orderId} (${order.studyName}) scheduled successfully.`,
      order,
    });
  } catch (error: any) {
    console.error("API POST /api/hms/imaging error:", error);
    return NextResponse.json({ error: "Failed to process imaging request." }, { status: 500 });
  }
}
