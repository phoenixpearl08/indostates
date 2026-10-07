import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { HMSService, generateUHID } from "@/lib/hmsService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/patient/dashboard";

  if (code && isSupabaseConfigured()) {
    const admin = getSupabaseAdmin();
    if (admin) {
      try {
        const { data, error } = await admin.auth.exchangeCodeForSession(code);
        if (!error && data?.user) {
          const user = data.user;
          const email = user.email || "";
          const fullName = user.user_metadata?.full_name || user.user_metadata?.name || email.split("@")[0] || "Patient";
          const phone = user.user_metadata?.phone || user.phone || "";

          // Check if patient profile already exists for this user/email
          let patient = HMSService.getPatients().find(
            (p) => p.email.toLowerCase() === email.toLowerCase() || (user.id && p.userId === user.id)
          );

          if (!patient) {
            // Check Supabase patients table
            const { data: supaPatient } = await admin
              .from("patients")
              .select("*")
              .or(`email.eq.${email},user_id.eq.${user.id}`)
              .maybeSingle();

            if (supaPatient) {
              patient = {
                id: supaPatient.id,
                uhid: supaPatient.uhid,
                userId: supaPatient.user_id,
                fullName: supaPatient.full_name,
                email: supaPatient.email,
                phone: supaPatient.phone,
                age: supaPatient.age,
                gender: supaPatient.gender,
                accountStatus: supaPatient.account_status,
                createdAt: supaPatient.created_at,
                updatedAt: supaPatient.updated_at,
              };
            } else {
              // Create new patient record with permanent UHID
              const uhid = generateUHID();
              const newPatientData = {
                uhid,
                user_id: user.id,
                full_name: fullName,
                email,
                phone: phone || "9000000000",
                age: 30,
                gender: "Male" as const,
                account_status: "active" as const,
              };

              const { data: createdPatient } = await admin
                .from("patients")
                .insert([newPatientData])
                .select()
                .single();

              if (createdPatient) {
                patient = {
                  id: createdPatient.id,
                  uhid: createdPatient.uhid,
                  userId: createdPatient.user_id,
                  fullName: createdPatient.full_name,
                  email: createdPatient.email,
                  phone: createdPatient.phone,
                  age: createdPatient.age,
                  gender: createdPatient.gender,
                  accountStatus: createdPatient.account_status,
                  createdAt: createdPatient.created_at,
                  updatedAt: createdPatient.updated_at,
                };
              } else {
                patient = HMSService.createPatient({
                  userId: user.id,
                  fullName,
                  email,
                  phone: phone || "9000000000",
                  age: 30,
                  gender: "Male",
                  accountStatus: "active",
                });
              }
            }
          }

          // Build session cookie payload
          const sessionPayload = {
            id: patient?.id || user.id,
            name: patient?.fullName || fullName,
            email: email,
            phone: patient?.phone || phone,
            role: "PATIENT",
            uhid: patient?.uhid || "IND-UHID-000101",
          };

          const response = NextResponse.redirect(new URL(next, origin));
          const maxAge = 60 * 60 * 24 * 7;
          response.cookies.set("ish_auth_role", "PATIENT", { path: "/", maxAge, sameSite: "lax" });
          response.cookies.set("ish_auth_user", JSON.stringify(sessionPayload), { path: "/", maxAge, sameSite: "lax" });
          return response;
        }
      } catch (err) {
        console.error("Auth callback error:", err);
      }
    }
  }

  return NextResponse.redirect(new URL(next, origin));
}
