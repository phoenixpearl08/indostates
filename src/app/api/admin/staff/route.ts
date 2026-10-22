import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/lib/adminService";
import { requireServerAuth, ADMIN_ACCESS_ROLES, revokeStaffSessions } from "@/lib/serverAuth";
import { HMSService } from "@/lib/hmsService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: ADMIN_ACCESS_ROLES,
      requiredPermission: "staff.manage",
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department") || undefined;
    const status = searchParams.get("status") || undefined;

    const staff = AdminService.getStaff(department, status);
    return NextResponse.json({ success: true, staff, count: staff.length });
  } catch (error: any) {
    console.error("API GET /api/admin/staff error:", error);
    return NextResponse.json({ error: "Failed to fetch staff directory." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: ADMIN_ACCESS_ROLES,
      requiredPermission: "staff.manage",
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const body = await req.json();
    const { name, email, phone, role, department, shift } = body;

    if (!name || !email || !role || !department) {
      return NextResponse.json({ error: "Name, email, role, and department are required." }, { status: 400 });
    }

    const newStaff = AdminService.createStaff({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      role: role.trim(),
      department: department.trim(),
      shift: shift || "Morning",
      status: "active",
    });

    HMSService.recordAuditLog(
      auth.staff.id,
      auth.staff.name,
      auth.staff.role,
      "staff.create",
      `staff/${newStaff.id}`,
      { name: newStaff.name, email: newStaff.email, role: newStaff.role }
    );

    return NextResponse.json({
      success: true,
      staff: newStaff,
      message: `Staff member ${newStaff.name} created successfully.`,
    });
  } catch (error: any) {
    console.error("API POST /api/admin/staff error:", error);
    return NextResponse.json({ error: "Failed to create staff member." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: ADMIN_ACCESS_ROLES,
      requiredPermission: "staff.manage",
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const body = await req.json();
    const { id, status, shift, role, department, phone, name } = body;

    if (!id) {
      return NextResponse.json({ error: "Staff ID is required." }, { status: 400 });
    }

    const updated = AdminService.updateStaff(id, {
      ...(status && { status }),
      ...(shift && { shift }),
      ...(role && { role }),
      ...(department && { department }),
      ...(phone && { phone }),
      ...(name && { name }),
    });

    if (!updated) {
      return NextResponse.json({ error: "Staff member not found." }, { status: 404 });
    }

    // Task 6: Staff deactivation and session revocation
    // If status is set to inactive or suspended, immediately revoke all active sessions
    if (status && (status.toLowerCase() === "inactive" || status.toLowerCase() === "suspended")) {
      revokeStaffSessions(updated.email);
      revokeStaffSessions(updated.id);
    }

    HMSService.recordAuditLog(
      auth.staff.id,
      auth.staff.name,
      auth.staff.role,
      "staff.update",
      `staff/${id}`,
      { id, updatedStatus: status, updatedFields: Object.keys(body).filter((k) => k !== "id") }
    );

    return NextResponse.json({
      success: true,
      staff: updated,
      message: `Staff member ${updated.name} updated successfully.`,
    });
  } catch (error: any) {
    console.error("API PUT /api/admin/staff error:", error);
    return NextResponse.json({ error: "Failed to update staff member." }, { status: 500 });
  }
}

