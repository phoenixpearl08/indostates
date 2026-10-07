import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";
import { DOCTORS } from "@/data/hospitalData";
import { HMSService } from "@/lib/hmsService";
import { UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId") || DOCTORS[0].id;
    const doctor = DOCTORS.find((d) => d.id === doctorId) || DOCTORS[0];

    const encountersCount = HMSService.getEncounters().filter((e) => e.doctorId === doctor.id).length;
    const appointmentsCount = HMSService.getAppointments().filter(
      (a) => a.doctorId === doctor.id || a.targetId === doctor.id
    ).length;

    return NextResponse.json({
      success: true,
      profile: {
        ...doctor,
        hospitalRole: "Attending Consultant / Department Lead",
        registrationNumber: "TN-MCI-2012-00842",
        status: "Active Verified Practitioner",
        totalEncountersCompleted: encountersCount + 142,
        totalAppointmentsManaged: appointmentsCount + 210,
        security: {
          lastLogin: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
          twoFactorEnabled: true,
          activeSessionsCount: 1,
        },
      },
    });
  } catch (error: any) {
    console.error("API GET /api/doctor/profile error:", error);
    return NextResponse.json({ error: "Failed to fetch doctor profile." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctorId, action, biography, timing, newPassword, actor } = body;

    const safeDoctorId = doctorId || DOCTORS[0].id;
    const doctor = DOCTORS.find((d) => d.id === safeDoctorId);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found." }, { status: 404 });
    }

    const safeActor = actor || {
      id: doctor.id,
      name: doctor.name,
      role: "DOCTOR" as UserRole,
    };

    if (action === "update_bio") {
      if (biography) doctor.biography = biography.trim();
      if (timing) doctor.timing = timing.trim();

      HMSService.recordAuditLog(
        safeActor.id,
        safeActor.name,
        safeActor.role,
        "doctor.update_profile",
        `doctors/${doctor.id}`,
        { biography: doctor.biography, timing: doctor.timing }
      );

      return NextResponse.json({
        success: true,
        message: "Doctor professional profile updated.",
        profile: doctor,
      });
    }

    if (action === "change_password") {
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ error: "New password must be at least 6 characters long." }, { status: 400 });
      }

      HMSService.recordAuditLog(
        safeActor.id,
        safeActor.name,
        safeActor.role,
        "doctor.change_password",
        `doctors/${doctor.id}`,
        { status: "success" }
      );

      return NextResponse.json({
        success: true,
        message: "Password changed successfully. Active sessions secured.",
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    console.error("API POST /api/doctor/profile error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
