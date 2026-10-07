import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { BedStatus, UserRole } from "@/types/hms";
import { DOCTORS } from "@/data/hospitalData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const wards = HMSService.getWards();
    const rooms = HMSService.getRooms();
    const beds = HMSService.getBeds();
    const admissions = HMSService.getAdmissions();

    return NextResponse.json({
      success: true,
      wards,
      rooms,
      beds,
      admissions,
      summary: {
        totalBeds: beds.length,
        availableBeds: beds.filter((b) => b.status === "AVAILABLE").length,
        occupiedBeds: beds.filter((b) => b.status === "OCCUPIED").length,
        maintenanceBeds: beds.filter((b) => b.status === "MAINTENANCE" || b.status === "CLEANING").length,
        activeAdmissions: admissions.filter((a) => a.status === "ADMITTED").length,
      },
    });
  } catch (error: any) {
    console.error("API GET /api/admin/ipd error:", error);
    return NextResponse.json({ error: "Failed to fetch IPD data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const actor = {
      id: "admin",
      name: "Hospital Administrator",
      role: "HOSPITAL_ADMIN" as UserRole,
    };

    if (action === "admit") {
      const { patientUhid, doctorId, wardId, bedId, admissionReason } = body;
      if (!patientUhid || !doctorId || !wardId || !bedId || !admissionReason) {
        return NextResponse.json({ error: "patientUhid, doctorId, wardId, bedId, and admissionReason are required." }, { status: 400 });
      }

      const pat = HMSService.getPatientByUhid(patientUhid);
      const bed = HMSService.getBeds().find((b) => b.id === bedId || b.bedNumber === bedId);
      const ward = HMSService.getWards().find((w) => w.id === wardId || w.wardNumber === wardId);
      const doc = DOCTORS.find((d) => d.id === doctorId);

      const admission = HMSService.createAdmission(
        {
          patientUhid,
          patientName: pat?.fullName || body.patientName || "Admitted Patient",
          patientPhone: pat?.phone || body.patientPhone || "+91 94430 00000",
          doctorId,
          doctorName: doc?.name || body.doctorName || "Attending Physician",
          departmentId: doc?.departmentId || ward?.departmentId || "general-medicine",
          wardId: ward?.id || wardId,
          wardName: ward?.name || bed?.wardName || "General Ward",
          bedId: bed?.id || bedId,
          bedNumber: bed?.bedNumber || bedId,
          admissionDate: new Date().toISOString(),
          admissionReason,
        },
        actor
      );

      return NextResponse.json({
        success: true,
        message: `Patient ${admission.patientName} admitted to Bed ${admission.bedNumber}.`,
        admission,
      });
    }

    if (action === "discharge") {
      const { admissionId, dischargeSummary } = body;
      if (!admissionId) {
        return NextResponse.json({ error: "admissionId is required." }, { status: 400 });
      }

      const discharged = HMSService.dischargePatient(admissionId, dischargeSummary || "Clinical discharge approved.", actor);
      if (!discharged) {
        return NextResponse.json({ error: "Admission record not found or already discharged." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Patient ${discharged.patientName} successfully discharged.`,
        admission: discharged,
      });
    }

    if (action === "update_bed_status") {
      const { bedId, newStatus } = body;
      if (!bedId || !newStatus) {
        return NextResponse.json({ error: "bedId and newStatus are required." }, { status: 400 });
      }

      const updated = HMSService.updateBedStatus(bedId, newStatus as BedStatus, actor);
      if (!updated) {
        return NextResponse.json({ error: "Bed not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Bed ${updated.bedNumber} status updated to ${newStatus}.`,
        bed: updated,
      });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error: any) {
    console.error("API POST /api/admin/ipd error:", error);
    return NextResponse.json({ error: "Failed to process IPD action." }, { status: 500 });
  }
}
