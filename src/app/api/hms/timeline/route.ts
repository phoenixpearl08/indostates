import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uhid = searchParams.get("uhid");
    const forPatientView = searchParams.get("patientView") !== "false";

    if (!uhid) {
      return NextResponse.json({ error: "Patient UHID is required to retrieve timeline." }, { status: 400 });
    }

    const timeline = HMSService.getPatientTimeline(uhid, forPatientView);

    return NextResponse.json({
      success: true,
      uhid,
      eventCount: timeline.length,
      timeline,
    });
  } catch (error: any) {
    console.error("API GET /api/hms/timeline error:", error);
    return NextResponse.json({ error: "Failed to compile patient timeline." }, { status: 500 });
  }
}
