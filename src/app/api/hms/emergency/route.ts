import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const cases = HMSService.getEmergencyCases(status);

    return NextResponse.json({
      success: true,
      cases,
      summary: {
        total: cases.length,
        red: cases.filter((c) => c.triagePriority === "RED").length,
        yellow: cases.filter((c) => c.triagePriority === "YELLOW").length,
        green: cases.filter((c) => c.triagePriority === "GREEN").length,
        inTreatment: cases.filter((c) => c.status === "IN_TREATMENT").length,
      },
    });
  } catch (error: any) {
    console.error("API GET /api/hms/emergency error:", error);
    return NextResponse.json({ error: "Failed to fetch emergency cases." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, caseId, updates } = body;

    const actor = body.actor || {
      id: "usr-emergency",
      name: "Emergency Triage Officer",
      role: "DOCTOR" as UserRole,
    };

    if (action === "update" && caseId) {
      const updated = HMSService.updateEmergencyCase(caseId, updates || {}, actor);
      if (!updated) {
        return NextResponse.json({ error: "Emergency case not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Emergency case ${updated.caseNumber} updated. Status: ${updated.status}.`,
        case: updated,
      });
    }

    // Default: New Emergency Registration
    const { patientName, patientPhone, patientUhid, triagePriority, chiefComplaint, vitals, attendingDoctorId, attendingDoctorName, attendingNurseName, bedNumber } =
      body;

    if (!patientName || !chiefComplaint || !triagePriority) {
      return NextResponse.json(
        { error: "patientName, chiefComplaint, and triagePriority (RED, YELLOW, or GREEN) are required." },
        { status: 400 }
      );
    }

    const emg = HMSService.createEmergencyCase(
      {
        patientName,
        patientPhone,
        patientUhid,
        triagePriority,
        chiefComplaint,
        vitals,
        attendingDoctorId,
        attendingDoctorName,
        attendingNurseName,
        bedNumber,
        status: "TRIAGE",
      },
      actor
    );

    return NextResponse.json({
      success: true,
      message: `Emergency triage case ${emg.caseNumber} initiated with priority ${emg.triagePriority}.`,
      case: emg,
    });
  } catch (error: any) {
    console.error("API POST /api/hms/emergency error:", error);
    return NextResponse.json({ error: "Failed to process emergency request." }, { status: 500 });
  }
}
