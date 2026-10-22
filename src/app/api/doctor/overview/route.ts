import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";
import { DOCTORS } from "@/data/hospitalData";
import { requireServerAuth } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: ["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const { searchParams } = new URL(req.url);
    const requestedDoctorId = searchParams.get("doctorId");

    // Clinical doctors can only view their own overview; Admin/SuperAdmin/Directors can review any doctor
    const isAdminOrDirector = ["ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR"].includes(auth.staff.role);
    let resolvedDoctorId = auth.staff.id;

    if (isAdminOrDirector && requestedDoctorId) {
      resolvedDoctorId = requestedDoctorId;
    } else {
      // Find doctor by session ID or session email
      const matched = DOCTORS.find(
        (d) => d.id === auth.staff!.id || (d.email && d.email.toLowerCase() === auth.staff!.email.toLowerCase())
      );
      if (matched) {
        resolvedDoctorId = matched.id;
      }
    }

    const stats = DoctorService.getDoctorOverview(resolvedDoctorId);
    const doctor = DOCTORS.find((d) => d.id === resolvedDoctorId) || DOCTORS[0];

    return NextResponse.json({
      success: true,
      stats,
      doctor,
      viewerRole: auth.staff.role,
    });
  } catch (error: any) {
    console.error("API GET /api/doctor/overview error:", error);
    return NextResponse.json({ error: "Failed to fetch doctor overview." }, { status: 500 });
  }
}

