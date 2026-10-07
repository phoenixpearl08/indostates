import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uhidParam = searchParams.get("uhid");
    const idParam = searchParams.get("id");
    const emailParam = searchParams.get("email");
    const phoneParam = searchParams.get("phone");

    const isListAll = searchParams.get("all") === "true" || searchParams.get("list") === "true";
    if (isListAll) {
      let patients = HMSService.getPatients();
      if (isSupabaseConfigured()) {
        try {
          const admin = getSupabaseAdmin();
          if (admin) {
            const { data } = await admin.from("patients").select("*");
            if (data && data.length > 0) {
              const supaPatients = data.map((d: any) => ({
                id: d.id,
                uhid: d.uhid,
                fullName: d.full_name,
                email: d.email,
                phone: d.phone,
                age: d.age,
                gender: d.gender,
                bloodGroup: d.blood_group,
                accountStatus: d.account_status || "active",
                createdAt: d.created_at,
              }));
              const seen = new Set(patients.map((p) => p.uhid));
              supaPatients.forEach((sp: any) => {
                if (!seen.has(sp.uhid)) patients.push(sp);
              });
            }
          }
        } catch {}
      }
      return NextResponse.json({ success: true, patients });
    }

    // Read cookie if no query param
    let lookupUhid = uhidParam;
    let lookupEmail = emailParam;

    if (!lookupUhid && !lookupEmail && !idParam && !phoneParam) {
      const cookieUser = req.cookies.get("ish_auth_user")?.value;
      if (cookieUser) {
        try {
          const parsed = JSON.parse(cookieUser);
          lookupUhid = parsed.uhid;
          lookupEmail = parsed.email;
        } catch {}
      }
    }

    let patient = null;

    if (lookupUhid) {
      patient = HMSService.getPatientByUhid(lookupUhid);
    }

    if (!patient && idParam) {
      patient = HMSService.getPatientById(idParam);
    }

    if (!patient && lookupEmail) {
      patient = HMSService.getPatients().find(
        (p) => p.email.toLowerCase() === lookupEmail!.toLowerCase()
      );
    }

    if (!patient && phoneParam) {
      patient = HMSService.getPatients().find(
        (p) => p.phone.replace(/\D/g, "").includes(phoneParam.replace(/\D/g, ""))
      );
    }

    // Try Supabase if not found in memory
    if (!patient && isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          let query = admin.from("patients").select("*");
          if (lookupUhid) query = query.eq("uhid", lookupUhid);
          else if (idParam) query = query.eq("id", idParam);
          else if (lookupEmail) query = query.eq("email", lookupEmail);
          else if (phoneParam) query = query.eq("phone", phoneParam);

          const { data } = await query.single();
          if (data) {
            patient = {
              id: data.id,
              uhid: data.uhid,
              userId: data.user_id,
              fullName: data.full_name,
              email: data.email,
              phone: data.phone,
              dateOfBirth: data.date_of_birth,
              age: data.age,
              gender: data.gender,
              address: data.address,
              bloodGroup: data.blood_group,
              emergencyContactName: data.emergency_contact_name,
              emergencyContactPhone: data.emergency_contact_phone,
              emergencyContactRelation: data.emergency_contact_relation,
              accountStatus: data.account_status || "active",
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            };
          }
        }
      } catch (err) {
        console.warn("Supabase patient profile lookup notice:", err);
      }
    }

    if (!patient) {
      return NextResponse.json(
        { error: "Patient profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      patient,
    });
  } catch (error: any) {
    console.error("API /api/patient/profile GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve patient profile." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      uhid,
      fullName,
      phone,
      dateOfBirth,
      age,
      gender,
      address,
      bloodGroup,
      allergies,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
    } = body;

    if (!uhid) {
      return NextResponse.json(
        { error: "Patient UHID is required to update profile." },
        { status: 400 }
      );
    }

    // Find patient
    const patient = HMSService.getPatientByUhid(uhid);
    if (!patient) {
      return NextResponse.json(
        { error: "Patient with specified UHID not found." },
        { status: 404 }
      );
    }

    // Update permitted demographic fields only (UHID, id, accountStatus are strictly locked)
    if (fullName) patient.fullName = fullName.trim();
    if (phone) patient.phone = phone.trim();
    if (dateOfBirth) patient.dateOfBirth = dateOfBirth;
    if (age) patient.age = Number(age);
    if (gender) patient.gender = gender;
    if (address !== undefined) patient.address = address.trim();
    if (bloodGroup !== undefined) patient.bloodGroup = bloodGroup.trim();
    if (allergies !== undefined) patient.allergies = allergies;
    if (emergencyContactName !== undefined) patient.emergencyContactName = emergencyContactName.trim();
    if (emergencyContactPhone !== undefined) patient.emergencyContactPhone = emergencyContactPhone.trim();
    if (emergencyContactRelation !== undefined) patient.emergencyContactRelation = emergencyContactRelation.trim();
    patient.updatedAt = new Date().toISOString();

    // Sync to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          await admin
            .from("patients")
            .update({
              full_name: patient.fullName,
              phone: patient.phone,
              date_of_birth: patient.dateOfBirth,
              age: patient.age,
              gender: patient.gender,
              address: patient.address,
              blood_group: patient.bloodGroup,
              emergency_contact_name: patient.emergencyContactName,
              emergency_contact_phone: patient.emergencyContactPhone,
              emergency_contact_relation: patient.emergencyContactRelation,
              updated_at: patient.updatedAt,
            })
            .eq("uhid", uhid);
        }
      } catch (err) {
        console.warn("Supabase patient update notice:", err);
      }
    }

    // Record audit log
    HMSService.recordAuditLog(
      patient.id,
      patient.fullName,
      "PATIENT",
      "patient.profile_update",
      `patients/${uhid}`,
      { uhid, updatedFields: Object.keys(body).filter((k) => k !== "uhid") }
    );

    return NextResponse.json({
      success: true,
      patient,
      message: "Patient profile updated successfully.",
    });
  } catch (error: any) {
    console.error("API /api/patient/profile PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update patient profile." },
      { status: 500 }
    );
  }
}
