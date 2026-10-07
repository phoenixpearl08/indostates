import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { NotificationRecord, UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

let notificationHistory: NotificationRecord[] = [
  {
    id: "notif-1",
    userId: "all",
    title: "Vascular Neurology Academic Grand Rounds",
    message: "Weekly clinical grand rounds on ultra-early stroke interventions will be held this Thursday at 4:00 PM in the auditorium.",
    type: "info",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "notif-2",
    userId: "staff",
    title: "NABH Protocol Review Complete",
    message: "All clinical nursing units and diagnostic wings are requested to maintain standardized medication administration checklists.",
    type: "warning",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "notif-3",
    userId: "patients",
    title: "Digital Consultation QR Passes Active",
    message: "Patients can now show their mobile QR pass directly at reception and nursing stations for immediate paperless triage.",
    type: "info",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      notifications: notificationHistory,
      count: notificationHistory.length,
    });
  } catch (error: any) {
    console.error("API GET /api/admin/notifications error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, message, type, targetAudience } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "title and message are required." }, { status: 400 });
    }

    const validTypes = ["info", "warning", "success", "alert"] as const;
    const notifType = validTypes.includes(type) ? type : "info";

    const newNotif: NotificationRecord = {
      id: `notif-${Date.now()}`,
      userId: targetAudience || "all",
      title: title.trim(),
      message: message.trim(),
      type: notifType,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    notificationHistory.unshift(newNotif);

    HMSService.recordAuditLog(
      "admin",
      "Hospital Administrator",
      "HOSPITAL_ADMIN",
      "notification.broadcast",
      `notifications/${newNotif.id}`,
      { title: newNotif.title, targetAudience: newNotif.userId, type: newNotif.type }
    );

    return NextResponse.json({
      success: true,
      notification: newNotif,
      message: `Notification broadcasted to ${targetAudience || "All Users"}.`,
    });
  } catch (error: any) {
    console.error("API POST /api/admin/notifications error:", error);
    return NextResponse.json({ error: "Failed to send notification." }, { status: 500 });
  }
}
