import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";
import { DOCTORS } from "@/data/hospitalData";
import { UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId") || DOCTORS[0].id;

    const schedule = DoctorService.getDoctorSchedule(doctorId);

    return NextResponse.json({
      success: true,
      schedule,
    });
  } catch (error: any) {
    console.error("API GET /api/doctor/schedule error:", error);
    return NextResponse.json({ error: "Failed to fetch doctor schedule." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctorId, action, isOnDuty, statusNotice, opdRoom, blockSlotTime, leaveReason, actor } = body;

    const safeDoctorId = doctorId || "dr-logesh-thirumalaisamy";
    const safeActor = actor || {
      id: safeDoctorId,
      name: "Dr. Logesh Thirumalaisamy",
      role: "DOCTOR" as UserRole,
    };

    if (action === "toggle_duty") {
      const updated = DoctorService.updateDoctorAvailability(
        safeDoctorId,
        {
          isOnDuty: Boolean(isOnDuty),
          statusNotice: statusNotice || (isOnDuty ? "On Duty — Active OPD" : "Off Duty / On Call"),
        },
        safeActor
      );
      return NextResponse.json({
        success: true,
        message: `Duty status updated: ${updated.statusNotice}.`,
        availability: updated,
      });
    }

    if (action === "block_slot") {
      if (!blockSlotTime) {
        return NextResponse.json({ error: "blockSlotTime is required to block a slot." }, { status: 400 });
      }
      const current = DoctorService.getDoctorSchedule(safeDoctorId);
      const blocked = current.slots.filter((s) => s.isBlocked).map((s) => s.time);
      if (!blocked.includes(blockSlotTime)) blocked.push(blockSlotTime);

      const updated = DoctorService.updateDoctorAvailability(
        safeDoctorId,
        { blockedSlots: blocked },
        safeActor
      );
      return NextResponse.json({
        success: true,
        message: `Slot ${blockSlotTime} marked as blocked for procedures/rounds.`,
        availability: updated,
      });
    }

    if (action === "request_leave") {
      const updated = DoctorService.updateDoctorAvailability(
        safeDoctorId,
        {
          isOnDuty: false,
          statusNotice: `On Approved Clinical Leave (${leaveReason || 'Specialized Conference'})`,
        },
        safeActor
      );
      return NextResponse.json({
        success: true,
        message: `Clinical leave request logged and notified to Medical Director.`,
        availability: updated,
      });
    }

    return NextResponse.json({ error: "Invalid schedule action. Supported: 'toggle_duty', 'block_slot', 'request_leave'." }, { status: 400 });
  } catch (error: any) {
    console.error("API POST /api/doctor/schedule error:", error);
    return NextResponse.json({ error: "Failed to update doctor schedule." }, { status: 500 });
  }
}
