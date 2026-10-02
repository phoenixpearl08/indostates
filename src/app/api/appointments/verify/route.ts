import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase";
import { DOCTORS, HOSPITAL_INFO } from "@/data/hospitalData";

export const dynamic = "force-dynamic";

// Mask sensitive patient name for privacy compliance
function maskPatientName(name: string): string {
  if (!name) return "Patient";
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    const n = parts[0];
    return n.length > 2 ? `${n[0]}***${n[n.length - 1]}` : `${n[0]}***`;
  }
  const first = parts[0];
  const lastInitial = parts[parts.length - 1][0] || "";
  return `${first} ${lastInitial}***`;
}

function maskPhone(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\s+/g, "");
  if (cleaned.length < 8) return "******";
  return `${cleaned.slice(0, 4)}*****${cleaned.slice(-2)}`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const code = searchParams.get("code") || searchParams.get("referenceCode");
    const token = searchParams.get("token");

    const queryKey = id || code || token;
    if (!queryKey) {
      return NextResponse.json(
        {
          valid: false,
          error: "Verification identifier or token is required.",
        },
        { status: 400 }
      );
    }

    // 1. Check Supabase first if configured
    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          const { data, error } = await admin
            .from("appointments")
            .select("*")
            .or(`id.eq.${queryKey},reference_code.eq.${queryKey}`)
            .single();

          if (!error && data) {
            const isCancelled = data.status === "cancelled";
            const isCompleted = data.status === "completed";
            const isCheckedIn = data.status === "checked_in";

            return NextResponse.json({
              valid: !isCancelled,
              status: data.status || "confirmed",
              message: isCancelled
                ? "This appointment was cancelled and is no longer valid for hospital check-in."
                : isCompleted
                ? "This consultation was previously completed."
                : isCheckedIn
                ? "Patient is already checked in for today's consultation."
                : "Official Appointment Verified with Indo States Health.",
              appointment: {
                id: data.id,
                referenceCode: data.reference_code,
                patientNameMasked: maskPatientName(data.patient_name),
                patientPhoneMasked: maskPhone(data.patient_phone),
                doctorName: data.doctor_name || "Specialist Physician",
                targetName: data.target_name || data.service_type || "Clinical Consultation",
                date: data.appointment_date,
                timeSlot: data.time_slot,
                status: data.status,
                hospital: HOSPITAL_INFO.name,
                address: HOSPITAL_INFO.address,
                emergencyPhone: HOSPITAL_INFO.emergencyPhone,
                verifiedAt: new Date().toISOString(),
              },
            });
          }
        }
      } catch (err) {
        console.warn("Supabase verify query notice:", err);
      }
    }

    // 2. Query persistent server registry
    // Access global registry populated by /api/appointments
    const globalAppointments = (global as any).__ISH_APPOINTMENTS__ || [];
    const matched = globalAppointments.find(
      (a: any) =>
        a.id === queryKey ||
        a.referenceCode?.toUpperCase() === queryKey.toUpperCase() ||
        a.verificationToken === queryKey
    );

    if (matched) {
      const isCancelled = matched.status === "cancelled";
      const isCompleted = matched.status === "completed";
      const isCheckedIn = matched.status === "checked_in";

      return NextResponse.json({
        valid: !isCancelled,
        status: matched.status || "confirmed",
        message: isCancelled
          ? "This appointment was cancelled and is no longer valid for hospital check-in."
          : isCompleted
          ? "This consultation was previously completed."
          : isCheckedIn
          ? "Patient is already checked in for today's consultation."
          : "Official Appointment Verified with Indo States Health.",
        appointment: {
          id: matched.id,
          referenceCode: matched.referenceCode,
          patientNameMasked: maskPatientName(matched.patientName),
          patientPhoneMasked: maskPhone(matched.patientPhone),
          doctorName: matched.doctorName || "Specialist Physician",
          targetName: matched.targetName || "Clinical Consultation",
          date: matched.date,
          timeSlot: matched.timeSlot,
          status: matched.status,
          hospital: HOSPITAL_INFO.name,
          address: HOSPITAL_INFO.address,
          emergencyPhone: HOSPITAL_INFO.emergencyPhone,
          verifiedAt: new Date().toISOString(),
        },
      });
    }

    // Not found
    return NextResponse.json(
      {
        valid: false,
        error: "Booking record could not be verified. Please check the reference code or consult hospital reception desk.",
      },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("API /api/appointments/verify error:", error);
    return NextResponse.json(
      { valid: false, error: "Internal error during appointment verification." },
      { status: 500 }
    );
  }
}
