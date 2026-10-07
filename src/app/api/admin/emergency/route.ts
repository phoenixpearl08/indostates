import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cases = HMSService.getEmergencyCases();
    const ambulances = HMSService.getAmbulances();
    const ambulanceRequests = HMSService.getAmbulanceRequests();

    return NextResponse.json({
      success: true,
      cases,
      ambulances,
      ambulanceRequests,
      summary: {
        totalActive: cases.filter((c) => c.status === "TRIAGE" || c.status === "IN_TREATMENT").length,
        redTriage: cases.filter((c) => c.triagePriority === "RED").length,
        yellowTriage: cases.filter((c) => c.triagePriority === "YELLOW").length,
        greenTriage: cases.filter((c) => c.triagePriority === "GREEN").length,
        ambulancesAvailable: ambulances.filter((a) => a.status === "AVAILABLE").length,
        ambulancesDispatched: ambulances.filter((a) => a.status === "ASSIGNED" || a.status === "EN_ROUTE" || a.status === "AT_HOSPITAL").length,
      },
    });
  } catch (error: any) {
    console.error("API GET /api/admin/emergency error:", error);
    return NextResponse.json({ error: "Failed to fetch emergency data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const actor = {
      id: "admin",
      name: "Emergency Administrator",
      role: "HOSPITAL_ADMIN" as UserRole,
    };

    if (action === "update_case") {
      const { caseId, updates } = body;
      if (!caseId || !updates) {
        return NextResponse.json({ error: "caseId and updates are required." }, { status: 400 });
      }

      const updated = HMSService.updateEmergencyCase(caseId, updates, actor);
      if (!updated) {
        return NextResponse.json({ error: "Emergency case not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Emergency case ${updated.caseNumber} updated.`,
        case: updated,
      });
    }

    if (action === "dispatch_ambulance") {
      const { requestId, ambulanceId, pickupLocation, destination, callerPhone, patientName } = body;
      if (!ambulanceId) {
        return NextResponse.json({ error: "ambulanceId is required." }, { status: 400 });
      }

      let targetRequestId = requestId;
      if (!targetRequestId) {
        const newReq = HMSService.requestAmbulance(
          {
            patientName: patientName || "Emergency Caller",
            patientPhone: callerPhone || "+91 94430 00000",
            pickupAddress: pickupLocation || "Emergency Location",
            destination: destination || "IndoStates Emergency Bay",
            priority: "EMERGENCY",
          },
          actor
        );
        targetRequestId = newReq.id;
      }

      const updated = HMSService.dispatchAmbulance(targetRequestId, ambulanceId, actor);
      if (!updated) {
        return NextResponse.json({ error: "Ambulance or Request not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Ambulance dispatched for request ${updated.requestNumber}.`,
        request: updated,
      });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error: any) {
    console.error("API POST /api/admin/emergency error:", error);
    return NextResponse.json({ error: "Failed to process emergency action." }, { status: 500 });
  }
}
