import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { normalizePhoneNumber, isValidPhoneNumber } from "@/lib/otpService";
import { registerPatientCredentials } from "@/lib/serverAuth";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      name,
      email,
      phone,
      password,
      dateOfBirth,
      age,
      gender,
      address,
      bloodGroup,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      consent,
    } = data;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "Full legal name, email address, mobile number, and password are required." },
        { status: 400 }
      );
    }

    if (!isValidPhoneNumber(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile phone number." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const formattedPhone = normalizePhoneNumber(phone);

    // Check for existing duplicate account with same email in memory
    const existingByEmail = HMSService.getPatients().find(
      (p) => p.email.toLowerCase() === normalizedEmail
    );

    let supabaseUserId: string | undefined;

    // 1. Register in Supabase Auth if configured
    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          const { data: authData, error: authError } = await admin.auth.admin.createUser({
            email: normalizedEmail,
            password,
            email_confirm: true,
            user_metadata: {
              full_name: name.trim(),
              role: "patient",
              phone: formattedPhone,
            },
          });

          if (authError && !authError.message.includes("already registered")) {
            console.warn("Supabase createUser warning:", authError.message);
          } else if (authData?.user) {
            supabaseUserId = authData.user.id;
          }
        }
      } catch (err) {
        console.warn("Supabase registration fallback:", err);
      }
    }

    // 2. Create or link Patient Profile with official stable UHID in HMSService
    // If patient already exists with this phone or email, update/link to avoid duplicate UHID
    let patient = existingByEmail || HMSService.getPatients().find((p) => p.phone === formattedPhone);

    if (patient) {
      patient.fullName = name.trim();
      patient.email = normalizedEmail;
      patient.phone = formattedPhone;
      if (dateOfBirth) patient.dateOfBirth = dateOfBirth;
      if (age) patient.age = Number(age);
      if (gender) patient.gender = gender === "Female" ? "Female" : gender === "Other" ? "Other" : "Male";
      if (address) patient.address = address.trim();
      if (bloodGroup) patient.bloodGroup = bloodGroup.trim();
      if (emergencyContactName) patient.emergencyContactName = emergencyContactName.trim();
      if (emergencyContactPhone) patient.emergencyContactPhone = emergencyContactPhone.trim();
      if (emergencyContactRelation) patient.emergencyContactRelation = emergencyContactRelation.trim();
      if (supabaseUserId) patient.userId = supabaseUserId;
      patient.updatedAt = new Date().toISOString();
    } else {
      patient = HMSService.createPatient({
        userId: supabaseUserId,
        fullName: name.trim(),
        email: normalizedEmail,
        phone: formattedPhone,
        dateOfBirth: dateOfBirth || undefined,
        age: Number(age) || 30,
        gender: gender === "Female" ? "Female" : gender === "Other" ? "Other" : "Male",
        address: address ? address.trim() : undefined,
        bloodGroup: bloodGroup ? bloodGroup.trim() : undefined,
        emergencyContactName: emergencyContactName ? emergencyContactName.trim() : undefined,
        emergencyContactPhone: emergencyContactPhone ? emergencyContactPhone.trim() : undefined,
        emergencyContactRelation: emergencyContactRelation ? emergencyContactRelation.trim() : undefined,
        accountStatus: "active",
      });
    }

    // 3. Register credentials in server auth registry
    registerPatientCredentials(normalizedEmail, password);

    // 4. Record Audit Log
    HMSService.recordAuditLog(
      patient.id,
      patient.fullName,
      "PATIENT",
      "auth.register",
      `patients/${patient.uhid}`,
      { email: normalizedEmail, phone: formattedPhone, uhid: patient.uhid, consentGranted: Boolean(consent) }
    );

    const userObj = {
      id: patient.id,
      name: patient.fullName,
      email: patient.email,
      phone: patient.phone,
      role: "PATIENT",
      uhid: patient.uhid,
      token: `ish-patient-sig-${Date.now()}`,
    };

    const response = NextResponse.json({
      success: true,
      user: userObj,
      uhid: patient.uhid,
      redirectUrl: "/patient/dashboard",
      message: `Account created successfully. Your official Patient UHID is ${patient.uhid}.`,
    });

    response.cookies.set("ish_auth_role", "PATIENT", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    response.cookies.set("ish_auth_user", JSON.stringify(userObj), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("API /api/auth/register error:", error);
    return NextResponse.json(
      { error: "Internal server error during patient registration." },
      { status: 500 }
    );
  }
}
