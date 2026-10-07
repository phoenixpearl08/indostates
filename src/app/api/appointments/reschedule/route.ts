import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appointmentId, newDate, newTimeSlot, reason } = body;

    if (!appointmentId || !newDate || !newTimeSlot) {
      return NextResponse.json(
        { error: "Appointment ID, new date, and new time slot are required to reschedule." },
        { status: 400 }
      );
    }

    // 1. Locate existing appointment in HMSService or global
    const appointment = HMSService.getAppointmentById(appointmentId);
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment record not found." },
        { status: 404 }
      );
    }

    if (appointment.status === "CANCELLED" || appointment.status === "COMPLETED") {
      return NextResponse.json(
        { error: `Cannot reschedule appointment with status ${appointment.status}.` },
        { status: 400 }
      );
    }

    // 2. Validate that target new slot is not already reserved by someone else
    const doctorId = appointment.doctorId || appointment.targetId;
    const existingForSlot = HMSService.getAppointments({
      doctorId,
      date: newDate,
      status: "all",
    }).filter(
      (a) =>
        a.id !== appointment.id &&
        a.timeSlot === newTimeSlot &&
        a.status !== "CANCELLED" &&
        a.status !== "REJECTED"
    );

    if (existingForSlot.length > 0) {
      return NextResponse.json(
        { error: `Sorry, ${newTimeSlot} on ${newDate} is already reserved. Please select another slot.` },
        { status: 409 }
      );
    }

    // 3. Check Supabase slot conflict
    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          const { data: conflict } = await admin
            .from("appointments")
            .select("id")
            .eq("doctor_id", doctorId)
            .eq("appointment_date", newDate)
            .eq("time_slot", newTimeSlot)
            .neq("id", appointment.id)
            .neq("status", "cancelled")
            .limit(1);

          if (conflict && conflict.length > 0) {
            return NextResponse.json(
              { error: `The ${newTimeSlot} slot on ${newDate} is already reserved in hospital records.` },
              { status: 409 }
            );
          }
        }
      } catch (err) {
        console.warn("Supabase slot check notice:", err);
      }
    }

    // 4. Atomically apply update to appointment record
    const oldDate = appointment.appointmentDate;
    const oldSlot = appointment.timeSlot;

    appointment.appointmentDate = newDate;
    appointment.timeSlot = newTimeSlot;
    appointment.status = "CONFIRMED";
    appointment.updatedAt = new Date().toISOString();

    // Sync to global appointments if present
    const globalAppts: any[] = (global as any).__ISH_APPOINTMENTS__ || [];
    const gFound = globalAppts.find((a) => a.id === appointment.id || a.referenceCode === appointment.referenceCode);
    if (gFound) {
      gFound.date = newDate;
      gFound.timeSlot = newTimeSlot;
      gFound.status = "confirmed";
    }

    // Sync to Supabase
    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          await admin
            .from("appointments")
            .update({
              appointment_date: newDate,
              time_slot: newTimeSlot,
              status: "confirmed",
              notes: appointment.notes ? `${appointment.notes} | Rescheduled: ${reason || "Patient request"}` : `Rescheduled: ${reason || "Patient request"}`,
            })
            .or(`id.eq.${appointment.id},reference_code.eq.${appointment.referenceCode}`);
        }
      } catch (err) {
        console.warn("Supabase reschedule notice:", err);
      }
    }

    // Record audit log
    HMSService.recordAuditLog(
      appointment.patientId || "patient",
      appointment.patientName,
      "PATIENT",
      "appointment.rescheduled",
      `appointments/${appointment.referenceCode}`,
      {
        appointmentId: appointment.id,
        referenceCode: appointment.referenceCode,
        from: `${oldDate} at ${oldSlot}`,
        to: `${newDate} at ${newTimeSlot}`,
        reason: reason || "Patient self-service reschedule",
      }
    );

    return NextResponse.json({
      success: true,
      appointment,
      message: `Appointment successfully rescheduled to ${newDate} at ${newTimeSlot}.`,
    });
  } catch (error: any) {
    console.error("API /api/appointments/reschedule error:", error);
    return NextResponse.json(
      { error: "Failed to reschedule appointment." },
      { status: 500 }
    );
  }
}
