import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId") || "dr-logesh-thirumalaisamy";

    const { labReports, imagingReports } = DoctorService.getDoctorReports(doctorId);

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
