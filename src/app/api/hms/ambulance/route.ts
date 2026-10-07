import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { AmbulanceRecord, UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ambulances = HMSService.getAmbulances();
    const requests = HMSService.getAmbulanceRequests();

    return NextResponse.json({
      success: true,
      ambulances,
      requests,
      summary: {
        totalFleet: ambulances.length,
        available: ambulances.filter((a) => a.status === "AVAILABLE").length,
        dispatched: ambulances.filter((a) => a.status === "EN_ROUTE" || a.status === "ASSIGNED").length,
        pendingRequests: requests.filter((r) => r.status === "REQUESTED").length,
      },
    });
  } catch (error: any) {
    console.error("API GET /api/hms/ambulance error:", error);
    return NextResponse.json({ error: "Failed to fetch ambulance fleet data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const actor = body.actor || {
      id: "usr-ambulance",
      name: "Emergency Dispatch Controller",
      role: "AMBULANCE_STAFF" as UserRole,
    };

    if (action === "dispatch") {
      const { requestId, ambulanceId } = body;
      if (!requestId || !ambulanceId) {
        return NextResponse.json({ error: "requestId and ambulanceId are required for dispatch." }, { status: 400 });
      }

      const dispatched = HMSService.dispatchAmbulance(requestId, ambulanceId, actor);
      if (!dispatched) {
        return NextResponse.json({ error: "Ambulance request or vehicle not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Ambulance ${dispatched.vehicleNumber} dispatched to ${dispatched.pickupAddress}.`,
        request: dispatched,
      });
    }

    if (action === "update_status") {
      const { ambulanceId, status, location } = body;
      if (!ambulanceId || !status) {
        return NextResponse.json({ error: "ambulanceId and status are required." }, { status: 400 });
      }

      const updated = HMSService.updateAmbulanceStatus(
        ambulanceId,
        status as AmbulanceRecord["status"],
        location || "En Route",
        actor
      );

      if (!updated) {
        return NextResponse.json({ error: "Ambulance not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Ambulance ${updated.vehicleNumber} status updated to ${status}. Location: ${updated.currentLocation}.`,
        ambulance: updated,
      });
    }

    // Default: New Ambulance Request
    const { patientName, patientPhone, pickupAddress, destination, priority } = body;

    if (!patientName || !patientPhone || !pickupAddress) {
      return NextResponse.json(
        { error: "patientName, patientPhone, and pickupAddress are required to request an ambulance." },
        { status: 400 }
      );
    }

    const request = HMSService.requestAmbulance(
      {
        patientName,
        patientPhone,
        pickupAddress,
        destination: destination || "IndoStates Hospital Emergency Department",
        priority: priority || "EMERGENCY",
      },
      actor
    );

    return NextResponse.json({
      success: true,
      message: `Emergency dispatch request ${request.requestNumber} logged. Dispatching nearest available unit.`,
      request,
    });
  } catch (error: any) {
    console.error("API POST /api/hms/ambulance error:", error);
    return NextResponse.json({ error: "Failed to process ambulance dispatch request." }, { status: 500 });
  }
}
