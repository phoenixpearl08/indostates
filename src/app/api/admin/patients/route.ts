import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uhidParam = searchParams.get("uhid");
    const query = searchParams.get("query");
    const status = searchParams.get("status");

    if (uhidParam) {
      const patient = HMSService.getPatientByUhid(uhidParam);
      if (!patient) {
        return NextResponse.json({ error: "Patient not found." }, { status: 404 });
      }

      // Collect complete medical and administrative profile
      const appointments = HMSService.getAppointments({ patientId: patient.id });
      const encounters = HMSService.getEncounters(patient.id);
      const prescriptions = HMSService.getPrescriptions(patient.id);
      const labOrders = HMSService.getLabOrders(patient.id);
      const invoices = HMSService.getInvoices(patient.id);
      const admissions = HMSService.getAdmissions().filter((a) => a.patientUhid === uhidParam);
      const emergencyCases = HMSService.getEmergencyCases().filter((e) => e.patientUhid === uhidParam);
      const timeline = HMSService.getPatientTimeline(uhidParam, false);
      const consents = HMSService.getCaregiverConsents(uhidParam);

      return NextResponse.json({
        success: true,
        patient,
        appointments,
        encounters,
        prescriptions,
        labOrders,
        invoices,
        admissions,
        emergencyCases,
        timeline,
        consents,
      });
    }

    let patients = HMSService.getPatients(query || undefined);

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
      } catch (e) {
        console.warn("Supabase patient fetch notice:", e);
      }
    }

    if (status && status !== "ALL") {
      patients = patients.filter((p: any) => (p.accountStatus || "active") === status);
    }

    return NextResponse.json({
      success: true,
      patients,
      count: patients.length,
    });
  } catch (error: any) {
    console.error("API GET /api/admin/patients error:", error);
    return NextResponse.json({ error: "Failed to fetch patients." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, age, gender, bloodGroup, address } = body;

    if (!fullName || !phone) {
      return NextResponse.json({ error: "Patient name and phone number are required." }, { status: 400 });
    }

    const patient = HMSService.createPatient({
      fullName: fullName.trim(),
      email: email ? email.trim().toLowerCase() : "",
      phone: phone.trim(),
      age: Number(age) || 30,
      gender: gender || "Other",
      bloodGroup: bloodGroup || "O+",
      address: address || "Coimbatore, Tamil Nadu",
      allergies: [],
      accountStatus: "active",
    });

    HMSService.recordAuditLog(
      "admin",
      "Hospital Administrator",
      "HOSPITAL_ADMIN",
      "patient.create",
      `patients/${patient.uhid}`,
      { uhid: patient.uhid, name: patient.fullName, phone: patient.phone }
    );

    return NextResponse.json({
      success: true,
      patient,
      message: `Patient ${patient.fullName} registered with UHID ${patient.uhid}.`,
    });
  } catch (error: any) {
    console.error("API POST /api/admin/patients error:", error);
    return NextResponse.json({ error: "Failed to create patient." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { uhid, accountStatus, fullName, phone, bloodGroup, address } = body;

    if (!uhid) {
      return NextResponse.json({ error: "Patient UHID is required." }, { status: 400 });
    }

    const patient = HMSService.getPatientByUhid(uhid);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found." }, { status: 404 });
    }

    if (accountStatus) (patient as any).accountStatus = accountStatus;
    if (fullName) patient.fullName = fullName.trim();
    if (phone) patient.phone = phone.trim();
    if (bloodGroup) patient.bloodGroup = bloodGroup.trim();
    if (address) patient.address = address.trim();
    patient.updatedAt = new Date().toISOString();

    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          await admin
            .from("patients")
            .update({
              account_status: (patient as any).accountStatus,
              full_name: patient.fullName,
              phone: patient.phone,
              blood_group: patient.bloodGroup,
              address: patient.address,
              updated_at: patient.updatedAt,
            })
            .eq("uhid", uhid);
        }
      } catch (e) {
        console.warn("Supabase patient update notice:", e);
      }
    }

    HMSService.recordAuditLog(
      "admin",
      "Hospital Administrator",
      "HOSPITAL_ADMIN",
      "patient.admin_update",
      `patients/${uhid}`,
      { uhid, updatedFields: Object.keys(body).filter((k) => k !== "uhid") }
    );

    return NextResponse.json({
      success: true,
      patient,
      message: `Patient ${patient.fullName} (${uhid}) updated successfully.`,
    });
  } catch (error: any) {
    console.error("API PUT /api/admin/patients error:", error);
    return NextResponse.json({ error: "Failed to update patient." }, { status: 500 });
  }
}
