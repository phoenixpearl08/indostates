import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";
import { HMSService } from "@/lib/hmsService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || searchParams.get("q");
    const uhid = searchParams.get("uhid") || searchParams.get("patientId") || searchParams.get("id");
    const doctorId = searchParams.get("doctorId") || "dr-logesh-thirumalaisamy";

    // If a specific patient UHID/ID is requested, return their complete clinical dossier
    if (uhid) {
      const summary = DoctorService.getPatientClinicalSummary(uhid);
      if (!summary) {
        return NextResponse.json({ error: "Patient clinical record not found." }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        ...summary,
      });
    }

    // Search or list patients
    const patients = DoctorService.searchAuthorizedPatients(query || "", doctorId);

    // Enrich patients with their latest appointment and encounter status
    const allAppointments = HMSService.getAppointments();
    const enriched = patients.map((pat) => {
      const patAppts = allAppointments.filter(
        (a) => a.patientId === pat.id || a.patientUhid === pat.uhid
      );
      const latestAppt = patAppts[0] || null;
      return {
        ...pat,
        latestAppointment: latestAppt,
        totalVisits: patAppts.length,
      };
    });

    return NextResponse.json({
      success: true,
      patients: enriched,
      count: enriched.length,
    });
  } catch (error: any) {
    console.error("API GET /api/doctor/patients error:", error);
    return NextResponse.json({ error: "Failed to fetch patient records." }, { status: 500 });
  }
}
