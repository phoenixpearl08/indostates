import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";
import { HMSService } from "@/lib/hmsService";
import { requireServerAuth } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: ["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "NURSE"],
      requiredPermission: "clinical.read",
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || searchParams.get("q");
    const uhid = searchParams.get("uhid") || searchParams.get("patientId") || searchParams.get("id");
    const requestedDoctorId = searchParams.get("doctorId");

    const isAdminOrDirector = ["ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR"].includes(auth.staff.role);
    const resolvedDoctorId = isAdminOrDirector && requestedDoctorId ? requestedDoctorId : auth.staff.id;

    // If a specific patient UHID/ID is requested, return their clinical summary
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

    // Search patients scoped to authorized access
    const patients = DoctorService.searchAuthorizedPatients(query || "", resolvedDoctorId);

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

