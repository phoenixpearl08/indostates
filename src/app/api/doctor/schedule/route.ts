import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";
import { DOCTORS } from "@/data/hospitalData";
import { requireServerAuth } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: ["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "NURSE", "RECEPTIONIST"],
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const { searchParams } = new URL(req.url);
    const requestedDoctorId = searchParams.get("doctorId");

    const isAdminOrStaff = ["ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR", "NURSE", "RECEPTIONIST"].includes(auth.staff.role);
    let resolvedDoctorId = auth.staff.id;

    if (isAdminOrStaff && requestedDoctorId) {
      resolvedDoctorId = requestedDoctorId;
    } else {
      const matched = DOCTORS.find(
        (d) => d.id === auth.staff!.id || (d.email && d.email.toLowerCase() === auth.staff!.email.toLowerCase())
      );
      if (matched) {
        resolvedDoctorId = matched.id;
      }
    }

    const schedule = DoctorService.getDoctorSchedule(resolvedDoctorId);

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
    const auth = await requireServerAuth(req, {
      allowedRoles: ["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const body = await req.json();
    const { doctorId, action, isOnDuty, statusNotice, blockSlotTime, leaveReason } = body;

    const isAdminOrDirector = ["ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR"].includes(auth.staff.role);
    let targetDoctorId = auth.staff.id;

    if (isAdminOrDirector && doctorId) {
      targetDoctorId = doctorId;
    } else {
      const matched = DOCTORS.find(
        (d) => d.id === auth.staff!.id || (d.email && d.email.toLowerCase() === auth.staff!.email.toLowerCase())
      );
      if (matched) {
        targetDoctorId = matched.id;
      }
    }

    const verifiedActor = {
      id: auth.staff.id,
      name: auth.staff.name,
      role: auth.staff.role,
    };

    if (action === "toggle_duty") {
      const updated = DoctorService.updateDoctorAvailability(
        targetDoctorId,
        {
          isOnDuty: Boolean(isOnDuty),
          statusNotice: statusNotice || (isOnDuty ? "On Duty — Active OPD" : "Off Duty / On Call"),
        },
        verifiedActor
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
      const current = DoctorService.getDoctorSchedule(targetDoctorId);
      const blocked = current.slots.filter((s) => s.isBlocked).map((s) => s.time);
      if (!blocked.includes(blockSlotTime)) blocked.push(blockSlotTime);

      const updated = DoctorService.updateDoctorAvailability(
        targetDoctorId,
        { blockedSlots: blocked },
        verifiedActor
      );
      return NextResponse.json({
        success: true,
        message: `Slot ${blockSlotTime} marked as blocked for procedures/rounds.`,
        availability: updated,
      });
    }

    if (action === "request_leave") {
      const updated = DoctorService.updateDoctorAvailability(
        targetDoctorId,
        {
          isOnDuty: false,
          statusNotice: `On Approved Clinical Leave (${leaveReason || 'Specialized Conference'})`,
        },
        verifiedActor
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

