import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";
import { requireServerAuth } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: ["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN", "LAB_VERIFIER", "IMAGING_STAFF"],
      requiredPermission: "lab.read",
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const { searchParams } = new URL(req.url);
    const requestedDoctorId = searchParams.get("doctorId");

    const isAdminOrStaff = ["ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR", "LAB_TECHNICIAN", "LAB_VERIFIER", "IMAGING_STAFF"].includes(auth.staff.role);
    const resolvedDoctorId = isAdminOrStaff && requestedDoctorId ? requestedDoctorId : auth.staff.id;

    const { labReports, imagingReports } = DoctorService.getDoctorReports(resolvedDoctorId);

    return NextResponse.json({
      success: true,
      labReports,
      imagingReports,
      totalCount: labReports.length + imagingReports.length,
    });
  } catch (error: any) {
    console.error("API GET /api/doctor/reports error:", error);
    return NextResponse.json({ error: "Failed to fetch diagnostic reports." }, { status: 500 });
  }
}

