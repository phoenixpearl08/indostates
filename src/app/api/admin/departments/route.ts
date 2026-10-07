import { NextRequest, NextResponse } from "next/server";
import { DEPARTMENTS, Department, DOCTORS } from "@/data/hospitalData";
import { HMSService } from "@/lib/hmsService";
import { AdminService } from "@/lib/adminService";

export const dynamic = "force-dynamic";

let dynamicDepartments: (Department & { head?: string; status?: "active" | "inactive" })[] = DEPARTMENTS.map((dept) => ({
  ...dept,
  head: dept.id === "neuro-stroke" ? "Dr. Rajesh Rangaswamy" : dept.id === "emergency" ? "Dr. Logesh Thirumalaisamy" : "Senior Board Consultant",
  status: "active",
}));

export async function GET() {
  try {
    const appointments = HMSService.getAppointments();
    const staff = AdminService.getStaff();

    const departmentsWithMetrics = dynamicDepartments.map((dept) => {
      const doctorsInDept = DOCTORS.filter((d) => d.departmentId === dept.id);
      const staffInDept = staff.filter((s) => s.department.toLowerCase().includes(dept.name.toLowerCase()));
      const apptsInDept = appointments.filter((a) => (a as any).departmentId === dept.id);

      return {
        ...dept,
        metrics: {
          doctorCount: doctorsInDept.length,
          staffCount: staffInDept.length || 4,
          appointmentCount: apptsInDept.length,
          patientVolume: apptsInDept.length * 2 + 18,
          capacityDaily: 50,
        },
      };
    });

    return NextResponse.json({ success: true, departments: departmentsWithMetrics });
  } catch (error: any) {
    console.error("API GET /api/admin/departments error:", error);
    return NextResponse.json({ error: "Failed to fetch departments." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, head, description, services } = body;

    if (!name || !description) {
      return NextResponse.json({ error: "Department name and description are required." }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    const newDept = {
      id: slug,
      name: name.trim(),
      slug,
      shortDescription: description.slice(0, 120),
      fullDescription: description.trim(),
      services: services || ["General Clinical Consultation", "Diagnostic Characterization"],
      keyFeatures: ["Specialized Clinic", "Multidisciplinary Care Board"],
      doctors: [],
      equipment: ["Standard Clinical Suite"],
      head: head || "Appointed Consultant",
      status: "active" as const,
    };

    dynamicDepartments.unshift(newDept as any);

    HMSService.recordAuditLog(
      "admin",
      "Hospital Administrator",
      "HOSPITAL_ADMIN",
      "department.create",
      `departments/${slug}`,
      { name: newDept.name, head: newDept.head }
    );

    return NextResponse.json({
      success: true,
      department: newDept,
      message: `Department ${newDept.name} created successfully.`,
    });
  } catch (error: any) {
    console.error("API POST /api/admin/departments error:", error);
    return NextResponse.json({ error: "Failed to create department." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, head, description, status, services } = body;

    if (!id) {
      return NextResponse.json({ error: "Department ID is required." }, { status: 400 });
    }

    const index = dynamicDepartments.findIndex((d) => d.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Department not found." }, { status: 404 });
    }

    if (name) dynamicDepartments[index].name = name.trim();
    if (head) dynamicDepartments[index].head = head.trim();
    if (description) {
      dynamicDepartments[index].fullDescription = description.trim();
      dynamicDepartments[index].shortDescription = description.slice(0, 120);
    }
    if (status) dynamicDepartments[index].status = status;
    if (services) dynamicDepartments[index].keyServices = services;

    HMSService.recordAuditLog(
      "admin",
      "Hospital Administrator",
      "HOSPITAL_ADMIN",
      "department.update",
      `departments/${id}`,
      { id, updatedFields: Object.keys(body).filter((k) => k !== "id") }
    );

    return NextResponse.json({
      success: true,
      department: dynamicDepartments[index],
      message: `Department ${dynamicDepartments[index].name} updated successfully.`,
    });
  } catch (error: any) {
    console.error("API PUT /api/admin/departments error:", error);
    return NextResponse.json({ error: "Failed to update department." }, { status: 500 });
  }
}
