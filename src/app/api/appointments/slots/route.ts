import { NextRequest, NextResponse } from "next/server";
import { DOCTORS } from "@/data/hospitalData";
import { HMSService } from "@/lib/hmsService";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const STANDARD_TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date parameter (YYYY-MM-DD) is required to query live slots." },
        { status: 400 }
      );
    }

    const doctor = DOCTORS.find((d) => d.id === doctorId) || DOCTORS[0];

    // Check doctor availability for selected day
    const bookingDate = new Date(`${date}T00:00:00`);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = daysOfWeek[bookingDate.getDay()];
    const isDoctorAvailable = doctor.availableDays.includes(dayName);

    // 1. Fetch active bookings from HMSService in-memory registry
    const memoryAppointments = HMSService.getAppointments({
      doctorId: doctor.id,
      date,
      status: "all",
    }).filter((a) => a.status !== "CANCELLED" && a.status !== "REJECTED");

    // Also check global appointments fallback
    const globalAppts: any[] = (global as any).__ISH_APPOINTMENTS__ || [];
    const globalBooked = globalAppts.filter(
      (a) =>
        (a.doctorId === doctor.id || a.targetId === doctor.id) &&
        a.date === date &&
        a.status !== "cancelled"
    );

    const bookedSlotsSet = new Set<string>();
    memoryAppointments.forEach((a) => bookedSlotsSet.add(a.timeSlot));
    globalBooked.forEach((a) => bookedSlotsSet.add(a.timeSlot));

    // 2. Fetch from Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          const { data: dbAppts } = await admin
            .from("appointments")
            .select("time_slot")
            .eq("doctor_id", doctor.id)
            .eq("appointment_date", date)
            .neq("status", "cancelled");

          if (dbAppts) {
            dbAppts.forEach((a) => bookedSlotsSet.add(a.time_slot));
          }
        }
      } catch (err) {
        console.warn("Supabase slots query notice:", err);
      }
    }

    const bookedSlots = Array.from(bookedSlotsSet);
    const availableSlots = isDoctorAvailable
      ? STANDARD_TIME_SLOTS.filter((s) => !bookedSlotsSet.has(s))
      : [];

    return NextResponse.json({
      success: true,
      doctorId: doctor.id,
      doctorName: doctor.name,
      departmentId: doctor.departmentId,
      date,
      dayName,
      isDoctorAvailableOnDay: isDoctorAvailable,
      consultationTiming: doctor.timing,
      allSlots: STANDARD_TIME_SLOTS,
      bookedSlots,
      availableSlots,
      totalAvailable: availableSlots.length,
    });
  } catch (error: any) {
    console.error("API /api/appointments/slots error:", error);
    return NextResponse.json(
      { error: "Failed to query live appointment slot availability." },
      { status: 500 }
    );
  }
}
