import { NextRequest, NextResponse } from "next/server";
import { generateReferenceCode } from "@/lib/utils";
import { DOCTORS } from "@/data/hospitalData";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export interface ServerAppointment {
  id: string;
  referenceCode: string;
  verificationToken?: string;
  patientId?: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: number;
  patientGender: string;
  serviceType: "package" | "department" | "doctor";
  targetId: string;
  targetName: string;
  doctorId?: string;
  doctorName?: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: "confirmed" | "completed" | "cancelled" | "pending" | "checked_in" | "in_consultation" | "expired";
  createdAt: string;
  paymentStatus: "pay_on_arrival" | "paid_online";
}

// Global server-side appointment registry (persists across API requests in Node server process)
declare global {
  // eslint-disable-next-line no-var
  var __ISH_APPOINTMENTS__: ServerAppointment[] | undefined;
}

function getStoredServerAppointments(): ServerAppointment[] {
  if (!global.__ISH_APPOINTMENTS__) {
    const todayStr = new Date().toISOString().split("T")[0];
    global.__ISH_APPOINTMENTS__ = [
      {
        id: "appt-seed-1",
        referenceCode: "ISH-552910",
        patientName: "Murugan Selvam",
        patientPhone: "+91 94432 11223",
        patientEmail: "murugan@example.com",
        patientAge: 56,
        patientGender: "Male",
        serviceType: "doctor",
        targetId: "dr-rajesh-rangaswamy",
        targetName: "Neurovascular & Stroke Consultation",
        doctorId: "dr-rajesh-rangaswamy",
        doctorName: "Dr. Rajesh Rangaswamy",
        date: todayStr,
        timeSlot: "10:30 AM",
        notes: "Transient numbness and mild speech hesitation. Code stroke evaluation requested.",
        status: "confirmed",
        createdAt: new Date().toISOString(),
        paymentStatus: "pay_on_arrival",
      },
      {
        id: "appt-seed-2",
        referenceCode: "ISH-881240",
        patientName: "Kavitha Raman",
        patientPhone: "+91 98421 99887",
        patientEmail: "kavitha@example.com",
        patientAge: 48,
        patientGender: "Female",
        serviceType: "package",
        targetId: "master-health-checkup",
        targetName: "Master Health Checkup (₹3,500)",
        date: todayStr,
        timeSlot: "09:30 AM",
        notes: "Executive health checkup with fasting blood glucose and ECG screening.",
        status: "confirmed",
        createdAt: new Date().toISOString(),
        paymentStatus: "paid_online",
      },
      {
        id: "appt-seed-3",
        referenceCode: "ISH-440192",
        patientName: "Senthil Kumar",
        patientPhone: "+91 97890 22334",
        patientEmail: "senthil@example.com",
        patientAge: 42,
        patientGender: "Male",
        serviceType: "doctor",
        targetId: "dr-logesh-thirumalaisamy",
        targetName: "Emergency & Acute Care Triage",
        doctorId: "dr-logesh-thirumalaisamy",
        doctorName: "Dr. Logesh Thirumalaisamy",
        date: todayStr,
        timeSlot: "11:00 AM",
        notes: "Acute muscular back spasm following lifting injury.",
        status: "confirmed",
        createdAt: new Date().toISOString(),
        paymentStatus: "pay_on_arrival",
      },
    ];
  }
  return global.__ISH_APPOINTMENTS__;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");
    const doctorName = searchParams.get("doctorName");
    const patientPhone = searchParams.get("phone");
    const status = searchParams.get("status");
    const date = searchParams.get("date");

    // 1. Check Supabase first if configured
    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          let query = admin.from("appointments").select("*").order("appointment_date", { ascending: false });
          if (doctorId) query = query.eq("doctor_id", doctorId);
          if (status && status !== "all") query = query.eq("status", status);
          if (date) query = query.eq("appointment_date", date);

          const { data, error } = await query;
          if (!error && data && data.length > 0) {
            return NextResponse.json({ success: true, appointments: data });
          }
        }
      } catch (err) {
        console.warn("Supabase GET appointments fallback to server memory:", err);
      }
    }

    // 2. Fallback to server registry
    let results = getStoredServerAppointments();

    if (doctorId) {
      results = results.filter((a) => a.doctorId === doctorId || a.targetId === doctorId);
    } else if (doctorName) {
      results = results.filter((a) => a.doctorName?.toLowerCase().includes(doctorName.toLowerCase()));
    }

    if (patientPhone) {
      results = results.filter((a) => a.patientPhone.includes(patientPhone));
    }

    if (status && status !== "all") {
      results = results.filter((a) => a.status === status);
    }

    if (date) {
      results = results.filter((a) => a.date === date);
    }

    return NextResponse.json({ success: true, appointments: results });
  } catch (error: any) {
    console.error("API GET /api/appointments error:", error);
    return NextResponse.json({ error: "Failed to retrieve appointments." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      patientName,
      patientPhone,
      patientEmail,
      patientAge,
      patientGender,
      serviceType = "doctor",
      targetId,
      targetName,
      doctorId,
      doctorName,
      date,
      appointmentDate,
      timeSlot,
      notes,
      paymentStatus = "pay_on_arrival",
      patientId,
      userId,
      verificationToken,
    } = data;

    const effectiveDate = date || appointmentDate;
    const effectiveTargetName = targetName || doctorName || "Specialist Consultation";
    const effectiveDoctorId = doctorId || (serviceType === "doctor" ? targetId : undefined);

    // 1. Mandatory Fields Validation
    if (!patientName?.trim() || !patientPhone?.trim() || !effectiveDate || !timeSlot || !effectiveTargetName) {
      return NextResponse.json(
        { error: "Please provide all required fields: patient name, phone number, date, time slot, and service." },
        { status: 400 }
      );
    }

    // 2. Phone Number Format Validation
    const cleanPhone = patientPhone.replace(/[^0-9+]/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit mobile phone number for SMS confirmation." },
        { status: 400 }
      );
    }

    // 3. Past Date Validation
    const bookingDate = new Date(`${effectiveDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format specified." }, { status: 400 });
    }

    if (bookingDate < today) {
      return NextResponse.json(
        { error: "Appointment date cannot be in the past. Please select tomorrow or a future date." },
        { status: 400 }
      );
    }

    // 4. Doctor Schedule & Day Availability Validation
    if (serviceType === "doctor" && effectiveDoctorId) {
      const matchedDoctor = DOCTORS.find((d) => d.id === effectiveDoctorId);

      if (matchedDoctor) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const appointmentDay = daysOfWeek[bookingDate.getDay()];

        if (!matchedDoctor.availableDays.includes(appointmentDay)) {
          return NextResponse.json(
            {
              error: `${matchedDoctor.name} is not available on ${appointmentDay}s. Consultation days: ${matchedDoctor.availableDays.join(", ")}.`,
            },
            { status: 400 }
          );
        }
      }
    }

    // 5. Server-Side Duplicate & Double-Booking Prevention
    const existing = getStoredServerAppointments();
    const isDoubleBooked = existing.some((a) => {
      if (a.status === "cancelled") return false;
      const isSameDateSlot = a.date === effectiveDate && a.timeSlot === timeSlot;
      const isSameTarget = a.targetId === (targetId || effectiveDoctorId) || (effectiveDoctorId && a.doctorId === effectiveDoctorId);
      return isSameDateSlot && isSameTarget;
    });

    if (isDoubleBooked) {
      return NextResponse.json(
        {
          error: `The ${timeSlot} slot on ${effectiveDate} is already reserved for this specialist. Please choose another available time slot.`,
        },
        { status: 409 }
      );
    }

    // 6. Generate Reference & Unique ID & Secure Verification Token
    const referenceCode = generateReferenceCode();
    const appointmentId = `apt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const secureToken = verificationToken || `tok_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;

    const newAppointment: ServerAppointment = {
      id: appointmentId,
      referenceCode,
      verificationToken: secureToken,
      patientId: patientId || userId || undefined,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientEmail: patientEmail ? patientEmail.trim() : "",
      patientAge: Number(patientAge) || 30,
      patientGender: patientGender || "Other",
      serviceType: serviceType || "package",
      targetId: targetId || effectiveDoctorId || "general",
      targetName: effectiveTargetName,
      doctorId: effectiveDoctorId,
      doctorName: doctorName || (effectiveDoctorId ? DOCTORS.find((d) => d.id === effectiveDoctorId)?.name : undefined),
      date: effectiveDate,
      timeSlot,
      notes: notes ? notes.trim() : "",
      status: "confirmed",
      createdAt: new Date().toISOString(),
      paymentStatus: paymentStatus === "paid_online" ? "paid_online" : "pay_on_arrival",
    };

    // 7. Save into Persistent Server Registry
    existing.unshift(newAppointment);

    // 8. Sync with Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          await admin.from("appointments").insert({
            reference_code: referenceCode,
            patient_id: newAppointment.patientId,
            verification_token: newAppointment.verificationToken,
            patient_name: newAppointment.patientName,
            patient_phone: newAppointment.patientPhone,
            patient_email: newAppointment.patientEmail,
            patient_age: newAppointment.patientAge,
            patient_gender: newAppointment.patientGender,
            service_type: newAppointment.serviceType,
            target_id: newAppointment.targetId,
            target_name: newAppointment.targetName,
            doctor_id: newAppointment.doctorId,
            doctor_name: newAppointment.doctorName,
            appointment_date: newAppointment.date,
            time_slot: newAppointment.timeSlot,
            notes: newAppointment.notes,
            status: newAppointment.status,
            payment_status: newAppointment.paymentStatus,
          });
        }
      } catch (dbErr) {
        console.warn("Supabase insertion notice (running in local mode):", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Appointment confirmed successfully.",
      appointment: newAppointment,
    });
  } catch (error: any) {
    console.error("API POST /api/appointments error:", error);
    return NextResponse.json(
      { error: "Internal server error while confirming booking. Please retry or call 0422-2111000." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, status, notes } = data;

    if (!id || !status) {
      return NextResponse.json({ error: "Appointment ID and status are required." }, { status: 400 });
    }

    const validStatuses = ["confirmed", "completed", "cancelled", "pending", "checked_in", "in_consultation", "expired"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value provided." }, { status: 400 });
    }

    const appointments = getStoredServerAppointments();
    const target = appointments.find((a) => a.id === id || a.referenceCode === id);

    if (!target) {
      return NextResponse.json({ error: "Appointment record not found." }, { status: 404 });
    }

    target.status = status;
    if (notes !== undefined) {
      target.notes = notes;
    }

    // Sync status with Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          await admin
            .from("appointments")
            .update({ status, notes: target.notes })
            .or(`id.eq.${id},reference_code.eq.${id}`);
        }
      } catch (dbErr) {
        console.warn("Supabase PATCH status notice:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Appointment status updated to ${status}.`,
      appointment: target,
    });
  } catch (error: any) {
    console.error("API PATCH /api/appointments error:", error);
    return NextResponse.json({ error: "Failed to update appointment status." }, { status: 500 });
  }
}
