import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appointmentId, reason } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required to cancel." },
        { status: 400 }
      );
    }

    // 1. Locate appointment
    const appointment = HMSService.getAppointmentById(appointmentId);
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment record not found." },
        { status: 404 }
      );
    }

    if (appointment.status === "CANCELLED") {
      return NextResponse.json(
        { error: "This appointment is already cancelled." },
        { status: 400 }
      );
    }

    if (appointment.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Completed consultations cannot be cancelled." },
        { status: 400 }
      );
    }

    // 2. Update in HMSService memory
    appointment.status = "CANCELLED";
    appointment.updatedAt = new Date().toISOString();
    if (reason) {
      appointment.notes = appointment.notes ? `${appointment.notes} | Cancellation Reason: ${reason}` : `Cancellation Reason: ${reason}`;
    }

    // 3. Update in global fallback
    const globalAppts: any[] = (global as any).__ISH_APPOINTMENTS__ || [];
    const gFound = globalAppts.find((a) => a.id === appointment.id || a.referenceCode === appointment.referenceCode);
    if (gFound) {
      gFound.status = "cancelled";
    }

    // 4. Update in Supabase
    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          await admin
            .from("appointments")
            .update({
              status: "cancelled",
              notes: appointment.notes,
            })
            .or(`id.eq.${appointment.id},reference_code.eq.${appointment.referenceCode}`);
        }
      } catch (err) {
        console.warn("Supabase cancel sync notice:", err);
      }
    }

    // 5. Record audit log
    HMSService.recordAuditLog(
      appointment.patientId || "patient",
      appointment.patientName,
      "PATIENT",
      "appointment.cancelled",
      `appointments/${appointment.referenceCode}`,
      {
        appointmentId: appointment.id,
        referenceCode: appointment.referenceCode,
        date: appointment.appointmentDate,
        timeSlot: appointment.timeSlot,
        reason: reason || "Patient self-service cancellation",
      }
    );

    return NextResponse.json({
      success: true,
      appointment,
      message: `Appointment ${appointment.referenceCode || appointment.id} has been successfully cancelled. The time slot is now released.`,
    });
  } catch (error: any) {
    console.error("API /api/appointments/cancel error:", error);
    return NextResponse.json(
      { error: "Failed to cancel appointment." },
      { status: 500 }
    );
  }
}
