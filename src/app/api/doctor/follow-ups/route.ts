import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";
import { DOCTORS } from "@/data/hospitalData";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId") || DOCTORS[0].id;

    const followUps = DoctorService.getDoctorFollowUps(doctorId);

    return NextResponse.json({
      success: true,
      ...followUps,
    });
  } catch (error: any) {
    console.error("API GET /api/doctor/follow-ups error:", error);
    return NextResponse.json({ error: "Failed to fetch follow-ups." }, { status: 500 });
  }
}
