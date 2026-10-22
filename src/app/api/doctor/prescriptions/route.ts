import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";
import { HMSService } from "@/lib/hmsService";
import { requireServerAuth } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: ["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACY_STAFF", "PHARMACY_MANAGER", "NURSE"],
      requiredPermission: "prescription.read",
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const { searchParams } = new URL(req.url);
    const requestedDoctorId = searchParams.get("doctorId");
    const prescriptionId = searchParams.get("id");

    if (prescriptionId) {
      const all = HMSService.getPrescriptions();
      const match = all.find((p) => p.id === prescriptionId || p.prescriptionId === prescriptionId);
      if (!match) {
        return NextResponse.json({ error: "Prescription not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true, prescription: match });
    }

    const isAdminOrStaff = ["ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR", "PHARMACY_STAFF", "PHARMACY_MANAGER", "NURSE"].includes(auth.staff.role);
    const resolvedDoctorId = isAdminOrStaff && requestedDoctorId ? requestedDoctorId : auth.staff.id;

    const prescriptions = DoctorService.getDoctorPrescriptions(resolvedDoctorId);

    return NextResponse.json({
      success: true,
      prescriptions,
      count: prescriptions.length,
      pendingDispenseCount: prescriptions.filter((p) => p.status === "pending_dispense").length,
      dispensedCount: prescriptions.filter((p) => p.status === "dispensed" || p.status === "completed").length,
    });
  } catch (error: any) {
    console.error("API GET /api/doctor/prescriptions error:", error);
    return NextResponse.json({ error: "Failed to fetch prescriptions." }, { status: 500 });
  }
}

