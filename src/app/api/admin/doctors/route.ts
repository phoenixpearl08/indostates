import { NextRequest, NextResponse } from "next/server";
import { DOCTORS, Doctor } from "@/data/hospitalData";
import { HMSService } from "@/lib/hmsService";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type AdminDoctor = Doctor & { isActive?: boolean };

let dynamicDoctors: AdminDoctor[] = [...DOCTORS].map((d) => ({ ...d, isActive: true }));

export async function GET() {
  try {
    const appointments = HMSService.getAppointments();

    const doctorsWithStats = dynamicDoctors.map((doc) => {
      const docAppts = appointments.filter((a) => a.doctorId === doc.id);
      const completed = docAppts.filter((a) => a.status === "COMPLETED").length;
      const cancelled = docAppts.filter((a) => a.status === "CANCELLED").length;
      return {
        ...doc,
        stats: {
          totalAppointments: docAppts.length,
          completedConsultations: completed,
          cancelledAppointments: cancelled,
          patientVolume: docAppts.length * 3 + 12,
        },
      };
    });

    return NextResponse.json({
      success: true,
      doctors: doctorsWithStats,
      count: dynamicDoctors.length,
    });
  } catch (error: any) {
    console.error("API GET /api/admin/doctors error:", error);
    return NextResponse.json({ error: "Failed to fetch doctors." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, qualifications, specialization, departmentId, timing, availableDays, languages, biography, experienceYears } = body;

    if (!name || !specialization || !departmentId) {
      return NextResponse.json({ error: "Name, specialization, and department are required." }, { status: 400 });
    }

    const id = `dr-${name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")}-${Date.now().toString().slice(-4)}`;
    const newDoc: AdminDoctor = {
      id,
      name: name.trim(),
      role: `Consultant ${specialization}`,
      qualifications: qualifications || "MBBS, MD",
      departmentId,
      specialization: specialization.trim(),
      experienceYears: Number(experienceYears) || 10,
      biography: biography || `Senior specialist in ${specialization} at IndoStates Hospital.`,
      avatarUrl: "/images/avatars/doctor-rajesh.svg",
      timing: timing || "10:00 AM – 4:00 PM",
      availableDays: availableDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      languages: languages || ["English", "Tamil"],
      isActive: true,
    };

    dynamicDoctors.unshift(newDoc);

    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          await admin.from("doctors").insert({
            id: newDoc.id,
            name: newDoc.name,
            role: newDoc.role,
            qualifications: newDoc.qualifications,
            department_id: newDoc.departmentId,
            specialization: newDoc.specialization,
            experience_years: newDoc.experienceYears,
            biography: newDoc.biography,
            avatar_url: newDoc.avatarUrl,
            timing: newDoc.timing,
            available_days: newDoc.availableDays,
            languages: newDoc.languages,
            is_active: newDoc.isActive,
          });
        }
      } catch (e) {
        console.warn("Supabase doctor insert notice:", e);
      }
    }

    HMSService.recordAuditLog(
      "admin",
      "Hospital Administrator",
      "HOSPITAL_ADMIN",
      "doctor.create",
      `doctors/${newDoc.id}`,
      { name: newDoc.name, departmentId: newDoc.departmentId }
    );

    return NextResponse.json({
      success: true,
      doctor: newDoc,
      message: `Doctor ${newDoc.name} registered successfully.`,
    });
  } catch (error: any) {
    console.error("API POST /api/admin/doctors error:", error);
    return NextResponse.json({ error: "Failed to create doctor." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isActive, timing, availableDays, biography, qualifications, specialization, departmentId } = body;

    if (!id) {
      return NextResponse.json({ error: "Doctor ID is required." }, { status: 400 });
    }

    const index = dynamicDoctors.findIndex((d) => d.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }

    if (isActive !== undefined) dynamicDoctors[index].isActive = isActive;
    if (timing) dynamicDoctors[index].timing = timing;
    if (availableDays) dynamicDoctors[index].availableDays = availableDays;
    if (biography) dynamicDoctors[index].biography = biography;
    if (qualifications) dynamicDoctors[index].qualifications = qualifications;
    if (specialization) dynamicDoctors[index].specialization = specialization;
    if (departmentId) dynamicDoctors[index].departmentId = departmentId;

    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          await admin
            .from("doctors")
            .update({
              is_active: dynamicDoctors[index].isActive,
              timing: dynamicDoctors[index].timing,
              available_days: dynamicDoctors[index].availableDays,
              biography: dynamicDoctors[index].biography,
              qualifications: dynamicDoctors[index].qualifications,
              specialization: dynamicDoctors[index].specialization,
              department_id: dynamicDoctors[index].departmentId,
            })
            .eq("id", id);
        }
      } catch (e) {
        console.warn("Supabase doctor update notice:", e);
      }
    }

    HMSService.recordAuditLog(
      "admin",
      "Hospital Administrator",
      "HOSPITAL_ADMIN",
      "doctor.update",
      `doctors/${id}`,
      { id, updatedFields: Object.keys(body).filter((k) => k !== "id") }
    );

    return NextResponse.json({
      success: true,
      doctor: dynamicDoctors[index],
      message: `Doctor ${dynamicDoctors[index].name} updated successfully.`,
    });
  } catch (error: any) {
    console.error("API PUT /api/admin/doctors error:", error);
    return NextResponse.json({ error: "Failed to update doctor." }, { status: 500 });
  }
}
