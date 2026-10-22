import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";
import { DOCTORS } from "@/data/hospitalData";
import { NotificationRecord } from "@/types/hms";
import { requireServerAuth } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

let inMemoryDoctorNotifications: Record<string, NotificationRecord[]> = {};

export async function GET(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: ["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const { searchParams } = new URL(req.url);
    const requestedDoctorId = searchParams.get("doctorId");

    const isAdminOrDirector = ["ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR"].includes(auth.staff.role);
    let resolvedDoctorId = auth.staff.id;

    if (isAdminOrDirector && requestedDoctorId) {
      resolvedDoctorId = requestedDoctorId;
    } else {
      const matched = DOCTORS.find(
        (d) => d.id === auth.staff!.id || (d.email && d.email.toLowerCase() === auth.staff!.email.toLowerCase())
      );
      if (matched) {
        resolvedDoctorId = matched.id;
      }
    }

    if (!inMemoryDoctorNotifications[resolvedDoctorId]) {
      inMemoryDoctorNotifications[resolvedDoctorId] = DoctorService.getDoctorNotifications(resolvedDoctorId);
    }

    const notifications = inMemoryDoctorNotifications[resolvedDoctorId];

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    });
  } catch (error: any) {
    console.error("API GET /api/doctor/notifications error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: ["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR", "ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN"],
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const body = await req.json();
    const { doctorId, action, notificationId } = body;

    const isAdminOrDirector = ["ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR"].includes(auth.staff.role);
    let safeDoctorId = auth.staff.id;

    if (isAdminOrDirector && doctorId) {
      safeDoctorId = doctorId;
    } else {
      const matched = DOCTORS.find(
        (d) => d.id === auth.staff!.id || (d.email && d.email.toLowerCase() === auth.staff!.email.toLowerCase())
      );
      if (matched) {
        safeDoctorId = matched.id;
      }
    }

    if (!inMemoryDoctorNotifications[safeDoctorId]) {
      inMemoryDoctorNotifications[safeDoctorId] = DoctorService.getDoctorNotifications(safeDoctorId);
    }

    if (action === "mark_all_read") {
      inMemoryDoctorNotifications[safeDoctorId].forEach((n) => (n.isRead = true));
      return NextResponse.json({ success: true, message: "All notifications marked as read." });
    }

    if (action === "mark_read" && notificationId) {
      const match = inMemoryDoctorNotifications[safeDoctorId].find((n) => n.id === notificationId);
      if (match) match.isRead = true;
      return NextResponse.json({ success: true, message: "Notification marked as read." });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    console.error("API POST /api/doctor/notifications error:", error);
    return NextResponse.json({ error: "Failed to update notification." }, { status: 500 });
  }
}

