import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";
import { DOCTORS } from "@/data/hospitalData";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId") || DOCTORS[0].id;

    const stats = DoctorService.getDoctorOverview(doctorId);
    const doctor = DOCTORS.find((d) => d.id === doctorId) || DOCTORS[0];

    return NextResponse.json({
      success: true,
      stats,
      doctor,
    });
  } catch (error: any) {
    console.error("API GET /api/doctor/overview error:", error);
    return NextResponse.json({ error: "Failed to fetch doctor overview." }, { status: 500 });
  }
}
