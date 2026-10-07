import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { HMSService } from "@/lib/hmsService";

export const dynamic = "force-dynamic";

// In-memory fallback storage for family members / dependents
const inMemoryFamilyMembers: Record<string, any[]> = (global as any).__ISH_FAMILY_MEMBERS__ || {};
(global as any).__ISH_FAMILY_MEMBERS__ = inMemoryFamilyMembers;

if (!inMemoryFamilyMembers["IND-UHID-000101"]) {
  inMemoryFamilyMembers["IND-UHID-000101"] = [
    {
      id: "fam-seed-001",
      patientUhid: "IND-UHID-000101",
      fullName: "Saraswathi Murugan",
      relationship: "Spouse",
      age: 52,
      gender: "Female",
      phone: "+91 94432 11224",
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uhid = searchParams.get("uhid");

    if (!uhid) {
      return NextResponse.json({ error: "Patient UHID is required." }, { status: 400 });
    }

    // Try Supabase first if configured
    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          const { data, error } = await admin
            .from("family_members")
            .select("*")
            .eq("patient_uhid", uhid)
            .order("created_at", { ascending: false });

          if (!error && data) {
            return NextResponse.json({ success: true, familyMembers: data });
          }
        }
      } catch (err) {
        console.warn("Supabase family members query notice:", err);
      }
    }

    // Fallback to in-memory store
    const list = inMemoryFamilyMembers[uhid] || [];
    return NextResponse.json({ success: true, familyMembers: list });
  } catch (error: any) {
    console.error("API GET /api/patient/family error:", error);
    return NextResponse.json({ error: "Failed to fetch family members." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientUhid, fullName, relationship, age, dateOfBirth, gender, phone, email, notes } = body;

    if (!patientUhid || !fullName || !relationship) {
      return NextResponse.json(
        { error: "patientUhid, fullName, and relationship are required." },
        { status: 400 }
      );
    }

    const memberId = `FAM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newMember = {
      id: memberId,
      patient_uhid: patientUhid,
      full_name: fullName.trim(),
      relationship,
      age: age ? Number(age) : null,
      date_of_birth: dateOfBirth || null,
      gender: gender || "Other",
      phone: phone?.trim() || null,
      email: email?.trim() || null,
      notes: notes || null,
      created_at: new Date().toISOString(),
    };

    // Save in Supabase if available
    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          await admin.from("family_members").insert({
            id: newMember.id,
            patient_uhid: newMember.patient_uhid,
            full_name: newMember.full_name,
            relationship: newMember.relationship,
            age: newMember.age,
            date_of_birth: newMember.date_of_birth,
            gender: newMember.gender,
            phone: newMember.phone,
            email: newMember.email,
            notes: newMember.notes,
          });
        }
      } catch (err) {
        console.warn("Supabase family_members insert notice:", err);
      }
    }

    // Always maintain in-memory store
    if (!inMemoryFamilyMembers[patientUhid]) {
      inMemoryFamilyMembers[patientUhid] = [];
    }
    inMemoryFamilyMembers[patientUhid].unshift(newMember);

    // Audit log
    HMSService.recordAuditLog(
      patientUhid,
      "Patient",
      "PATIENT",
      "family_member.added",
      `patients/${patientUhid}/family`,
      { memberId, fullName: newMember.full_name, relationship }
    );

    return NextResponse.json({
      success: true,
      familyMember: newMember,
      message: `${fullName} added as authorized family dependent (${relationship}).`,
    });
  } catch (error: any) {
    console.error("API POST /api/patient/family error:", error);
    return NextResponse.json({ error: "Failed to add family member." }, { status: 500 });
  }
}
