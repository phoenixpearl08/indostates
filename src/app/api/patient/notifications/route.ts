import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { NotificationRecord } from "@/types/hms";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || searchParams.get("uhid");

    const appts = HMSService.getAppointments({
      patientId: userId || undefined,
      status: "all",
    });

    // Auto-generate notifications based on patient events
    const generated: NotificationRecord[] = [];

    appts.forEach((a) => {
      generated.push({
        id: `notif-appt-${a.id}`,
        userId: userId || a.patientId,
        title: `Appointment ${a.status === "CONFIRMED" ? "Confirmed" : a.status}`,
        message: `Your appointment with ${a.doctorName || a.targetName} is scheduled for ${a.appointmentDate} at ${a.timeSlot}. Ref: ${a.referenceCode}.`,
        type: a.status === "CONFIRMED" ? "success" : a.status === "CANCELLED" ? "warning" : "info",
        isRead: false,
        linkUrl: `/patient/dashboard`,
        createdAt: a.updatedAt || a.createdAt,
      });

      if (a.tokenNumber) {
        generated.push({
          id: `notif-tok-${a.id}`,
          userId: userId || a.patientId,
          title: "OPD Queue Token Issued",
          message: `Your consultation queue token is #${a.tokenNumber}. Please proceed to OPD Waiting Room 102.`,
          type: "info",
          isRead: false,
          linkUrl: `/patient/dashboard`,
          createdAt: a.updatedAt || a.createdAt,
        });
      }
    });

    if (generated.length === 0) {
      generated.push({
        id: "notif-welcome-1",
        userId: userId || "patient",
        title: "Welcome to IndoStates Health",
        message: "Your permanent hospital UHID is active. You can now manage appointments, lab records, and prescriptions.",
        type: "success",
        isRead: true,
        linkUrl: "/patient/dashboard",
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      notifications: generated,
    });
  } catch (error: any) {
    console.error("API GET /api/patient/notifications error:", error);
    return NextResponse.json({ error: "Failed to retrieve notifications." }, { status: 500 });
  }
}
