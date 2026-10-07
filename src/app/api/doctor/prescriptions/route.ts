import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";
import { HMSService } from "@/lib/hmsService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId") || "dr-logesh-thirumalaisamy";
    const prescriptionId = searchParams.get("id");

    if (prescriptionId) {
      const all = HMSService.getPrescriptions();
      const match = all.find((p) => p.id === prescriptionId || p.prescriptionId === prescriptionId);
      if (!match) {
        return NextResponse.json({ error: "Prescription not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true, prescription: match });
    }

    const prescriptions = DoctorService.getDoctorPrescriptions(doctorId);

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
