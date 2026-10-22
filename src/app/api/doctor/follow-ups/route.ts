import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";
import { DOCTORS } from "@/data/hospitalData";
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
    const requestedDoctorId = searchParams.get("doctorId");

    const isAdminOrDirector = ["ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR"].includes(auth.staff.role);
    let resolvedDoctorId = auth.staff.id;

    if (isAdminOrDirector && requestedDoctorId) {
      resolvedDoctorId = requestedDoctorId;
    } else {
      const matched = DOCTORS.find(
        (d) => d.id === auth.staff!.id || (d.email && d.email.toLowerCase() === auth.staff!.email.toLowerCase())
      );
      if (matched) {
        resolvedDoctorId = matched.id;
      }
    }

    const followUps = DoctorService.getDoctorFollowUps(resolvedDoctorId);

    return NextResponse.json({
      success: true,
      ...followUps,
    });
  } catch (error: any) {
    console.error("API GET /api/doctor/follow-ups error:", error);
    return NextResponse.json({ error: "Failed to fetch follow-ups." }, { status: 500 });
  }
}

