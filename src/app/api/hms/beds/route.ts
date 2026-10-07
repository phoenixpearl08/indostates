import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { BedStatus, UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const wardId = searchParams.get("wardId") || undefined;
    const status = (searchParams.get("status") as BedStatus) || undefined;

    const wards = HMSService.getWards();
    const rooms = HMSService.getRooms();
    const beds = HMSService.getBeds(wardId, status);

    return NextResponse.json({
      success: true,
      wards,
      rooms,
      beds,
      summary: {
        total: beds.length,
        available: beds.filter((b) => b.status === "AVAILABLE").length,
        occupied: beds.filter((b) => b.status === "OCCUPIED").length,
        cleaning: beds.filter((b) => b.status === "CLEANING").length,
        maintenance: beds.filter((b) => b.status === "MAINTENANCE").length,
      },
    });
  } catch (error: any) {
    console.error("API GET /api/hms/beds error:", error);
    return NextResponse.json({ error: "Failed to fetch beds." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, bedId, status, patientUhid, patientName, admissionId } = body;

    const actor = body.actor || {
      id: "usr-nurse",
      name: "Nurse Incharge",
      role: "NURSE" as UserRole,
    };

    if (!bedId) {
      return NextResponse.json({ error: "bedId is required." }, { status: 400 });
    }

    if (action === "allocate") {
      if (!patientUhid || !patientName || !admissionId) {
        return NextResponse.json({ error: "patientUhid, patientName, and admissionId are required to allocate a bed." }, { status: 400 });
      }

      const allocated = HMSService.allocateBed(bedId, patientUhid, patientName, admissionId, actor);
      if (!allocated) {
        return NextResponse.json({ error: "Bed not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Bed ${allocated.bedNumber} allocated to ${patientName} (${patientUhid}).`,
        bed: allocated,
      });
    }

    if (action === "release") {
      const released = HMSService.releaseBed(bedId, actor);
      if (!released) {
        return NextResponse.json({ error: "Bed not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Bed ${released.bedNumber} marked for cleaning and sanitization. Housekeeping task dispatched.`,
        bed: released,
      });
    }

    if (action === "update_status" && status) {
      const updated = HMSService.updateBedStatus(bedId, status as BedStatus, actor);
      if (!updated) {
        return NextResponse.json({ error: "Bed not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Bed ${updated.bedNumber} status updated to ${status}.`,
        bed: updated,
      });
    }

    return NextResponse.json({ error: "Invalid action or missing parameters." }, { status: 400 });
  } catch (error: any) {
    console.error("API POST /api/hms/beds error:", error);
    return NextResponse.json({ error: "Failed to update bed record." }, { status: 500 });
  }
}
