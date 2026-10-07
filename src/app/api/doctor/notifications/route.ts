import { NextRequest, NextResponse } from "next/server";
import { DoctorService } from "@/lib/doctorService";
import { DOCTORS } from "@/data/hospitalData";
import { NotificationRecord } from "@/types/hms";

export const dynamic = "force-dynamic";

let inMemoryDoctorNotifications: Record<string, NotificationRecord[]> = {};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId") || DOCTORS[0].id;

    if (!inMemoryDoctorNotifications[doctorId]) {
      inMemoryDoctorNotifications[doctorId] = DoctorService.getDoctorNotifications(doctorId);
    }

    const notifications = inMemoryDoctorNotifications[doctorId];

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
    const body = await req.json();
    const { doctorId, action, notificationId } = body;

    const safeDoctorId = doctorId || DOCTORS[0].id;

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
