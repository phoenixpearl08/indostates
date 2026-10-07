import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientUhid = searchParams.get("patientUhid") || undefined;
    const caregiverEmail = searchParams.get("caregiverEmail") || undefined;

    const consents = HMSService.getCaregiverConsents(patientUhid, caregiverEmail);

    return NextResponse.json({
      success: true,
      consents,
    });
  } catch (error: any) {
    console.error("API GET /api/hms/caregivers error:", error);
    return NextResponse.json({ error: "Failed to fetch caregiver consents." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const actor = body.actor || {
      id: "usr-patient",
      name: "Patient / Attender Portal",
      role: "PATIENT" as UserRole,
    };

    if (action === "revoke") {
      const { consentId } = body;
      if (!consentId) {
        return NextResponse.json({ error: "consentId is required for revocation." }, { status: 400 });
      }

      const revoked = HMSService.revokeCaregiverConsent(consentId, actor);
      if (!revoked) {
        return NextResponse.json({ error: "Consent record not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Caregiver consent ${revoked.consentId} revoked successfully.`,
        consent: revoked,
      });
    }

    // Default: Grant New Caregiver Consent
    const { patientUhid, patientName, caregiverName, caregiverPhone, caregiverEmail, relationship, accessScope, validUntil } =
      body;

    if (!patientUhid || !caregiverName || !caregiverPhone || !caregiverEmail || !relationship) {
      return NextResponse.json(
        { error: "patientUhid, caregiverName, caregiverPhone, caregiverEmail, and relationship are required." },
        { status: 400 }
      );
    }

    const consent = HMSService.createCaregiverConsent(
      {
        patientUhid,
        patientName: patientName || "Patient",
        caregiverName,
        caregiverPhone,
        caregiverEmail,
        relationship,
        accessScope: accessScope || "FULL_CARE",
        validUntil: validUntil || new Date(Date.now() + 365 * 86400000).toISOString(),
      },
      actor
    );

    return NextResponse.json({
      success: true,
      message: `Caregiver consent granted to ${consent.caregiverName} (${consent.relationship}).`,
      consent,
    });
  } catch (error: any) {
    console.error("API POST /api/hms/caregivers error:", error);
    return NextResponse.json({ error: "Failed to process caregiver consent." }, { status: 500 });
  }
}
