import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/lib/adminService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || undefined;

    const permissions = AdminService.getRolePermissions(role);
    const rolesList = [
      "SUPER_ADMIN",
      "HOSPITAL_ADMIN",
      "MEDICAL_DIRECTOR",
      "DOCTOR",
      "NURSE",
      "RECEPTIONIST",
      "LAB_TECHNICIAN",
      "PHARMACY_STAFF",
      "BILLING_STAFF",
      "SECURITY_STAFF",
      "PATIENT",
    ];

    const modulesList = [
      { id: "ALL", name: "Global Hospital System" },
      { id: "CLINICAL", name: "Clinical & Consultation Suite" },
      { id: "PATIENTS", name: "Patient Registry & Demographics" },
      { id: "APPOINTMENTS", name: "Appointment Scheduling & Check-In" },
      { id: "IPD", name: "Inpatient Bed & Ward Control" },
      { id: "EMERGENCY", name: "Emergency Trauma & Ambulance" },
      { id: "LAB", name: "Automated Diagnostic Laboratory" },
      { id: "PHARMACY", name: "Pharmacy Inventory & Dispensing" },
      { id: "BILLING", name: "Patient Accounts & TPA Billing" },
      { id: "SECURITY", name: "Campus Security & Turnstiles" },
      { id: "REPORTS", name: "Executive Reports & Analytics" },
    ];

    return NextResponse.json({
      success: true,
      permissions,
      roles: rolesList,
      modules: modulesList,
    });
  } catch (error: any) {
    console.error("API GET /api/admin/roles error:", error);
    return NextResponse.json({ error: "Failed to fetch role permissions." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, module, permissions } = body;

    if (!role || !module || !permissions) {
      return NextResponse.json({ error: "role, module, and permissions are required." }, { status: 400 });
    }

    const updated = AdminService.updateRolePermission(role, module, permissions);

    return NextResponse.json({
      success: true,
      permission: updated,
      message: `Permissions updated for role ${role} on module ${module}.`,
    });
  } catch (error: any) {
    console.error("API POST /api/admin/roles error:", error);
    return NextResponse.json({ error: "Failed to update role permissions." }, { status: 500 });
  }
}
