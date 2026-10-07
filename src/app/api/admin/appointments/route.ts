import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { AppointmentStatus, UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId") || undefined;
    const status = searchParams.get("status") || undefined;
    const date = searchParams.get("date") || undefined;
    const query = searchParams.get("query") || undefined;

    let appointments = HMSService.getAppointments({
      doctorId,
      status: status && status !== "ALL" ? (status as AppointmentStatus) : undefined,
      date,
    });

    if (query) {
      const q = query.toLowerCase().trim();
      appointments = appointments.filter(
        (a) =>
          a.patientName.toLowerCase().includes(q) ||
          a.patientPhone.includes(q) ||
          a.patientUhid?.toLowerCase().includes(q) ||
          a.referenceCode.toLowerCase().includes(q)
      );
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const todayTotal = appointments.filter((a) => a.appointmentDate === todayStr).length;
    const maxCapacity = 250;
    const slotUtilizationPercent = Math.min(100, Math.round((todayTotal / maxCapacity) * 100));

    return NextResponse.json({
      success: true,
      appointments,
      count: appointments.length,
      slotUtilization: {
        todayTotal,
        maxCapacity,
        percentage: slotUtilizationPercent,
      },
    });
  } catch (error: any) {
    console.error("API GET /api/admin/appointments error:", error);
    return NextResponse.json({ error: "Failed to fetch appointments." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, appointmentId, newDate, newSlot, cancelReason } = body;

    const actor = {
      id: "admin",
      name: "Hospital Administrator",
      role: "HOSPITAL_ADMIN" as UserRole,
    };

    if (!appointmentId || !action) {
      return NextResponse.json({ error: "appointmentId and action are required." }, { status: 400 });
    }

    if (action === "reschedule") {
      if (!newDate || !newSlot) {
        return NextResponse.json({ error: "newDate and newSlot are required for rescheduling." }, { status: 400 });
      }
      const appt = HMSService.getAppointmentById(appointmentId);
      if (!appt) return NextResponse.json({ error: "Appointment not found." }, { status: 404 });

      appt.appointmentDate = newDate;
      appt.timeSlot = newSlot;
      appt.status = "CONFIRMED";
      appt.updatedAt = new Date().toISOString();

      HMSService.recordAuditLog(
        actor.id,
        actor.name,
        actor.role,
        "appointment.reschedule",
        `appointments/${appointmentId}`,
        { appointmentId, newDate, newSlot }
      );

      return NextResponse.json({
        success: true,
        message: `Appointment ${appt.referenceCode} rescheduled to ${newDate} at ${newSlot}.`,
        appointment: appt,
      });
    }

    if (action === "cancel") {
      const result = HMSService.transitionAppointmentStatus(
        appointmentId,
        "CANCELLED",
        actor
      );
      if (!result.success || !result.appointment) {
        return NextResponse.json({ error: result.error || "Failed to cancel appointment." }, { status: 400 });
      }

      if (cancelReason) {
        result.appointment.cancellationReason = cancelReason;
      }

      return NextResponse.json({
        success: true,
        message: `Appointment ${result.appointment.referenceCode} cancelled.`,
        appointment: result.appointment,
      });
    }

    if (action === "update_status") {
      const { newStatus } = body;
      const result = HMSService.transitionAppointmentStatus(
        appointmentId,
        newStatus as AppointmentStatus,
        actor
      );
      if (!result.success || !result.appointment) {
        return NextResponse.json({ error: result.error || "Failed to update appointment status." }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `Appointment ${result.appointment.referenceCode} status updated to ${newStatus}.`,
        appointment: result.appointment,
      });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error: any) {
    console.error("API POST /api/admin/appointments error:", error);
    return NextResponse.json({ error: "Failed to process appointment action." }, { status: 500 });
  }
}
