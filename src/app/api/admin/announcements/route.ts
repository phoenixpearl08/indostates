import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/lib/adminService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publishedOnly = searchParams.get("published") === "true";

    const announcements = AdminService.getAnnouncements(publishedOnly);
    return NextResponse.json({ success: true, announcements, count: announcements.length });
  } catch (error: any) {
    console.error("API GET /api/admin/announcements error:", error);
    return NextResponse.json({ error: "Failed to fetch announcements." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, priority, targetAudience, isPublished } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "title and content are required." }, { status: 400 });
    }

    const announcement = AdminService.createAnnouncement({
      title: title.trim(),
      content: content.trim(),
      priority: priority || "Normal",
      targetAudience: targetAudience || "All",
      isPublished: isPublished !== undefined ? isPublished : true,
      publishedAt: new Date().toISOString(),
      createdBy: "Hospital Administration",
    });

    return NextResponse.json({
      success: true,
      announcement,
      message: `Announcement "${announcement.title}" created successfully.`,
    });
  } catch (error: any) {
    console.error("API POST /api/admin/announcements error:", error);
    return NextResponse.json({ error: "Failed to create announcement." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, content, priority, targetAudience, isPublished } = body;

    if (!id) {
      return NextResponse.json({ error: "Announcement ID is required." }, { status: 400 });
    }

    const updated = AdminService.updateAnnouncement(id, {
      ...(title && { title: title.trim() }),
      ...(content && { content: content.trim() }),
      ...(priority && { priority }),
      ...(targetAudience && { targetAudience }),
      ...(isPublished !== undefined && { isPublished }),
    });

    if (!updated) {
      return NextResponse.json({ error: "Announcement not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      announcement: updated,
      message: `Announcement "${updated.title}" updated successfully.`,
    });
  } catch (error: any) {
    console.error("API PUT /api/admin/announcements error:", error);
    return NextResponse.json({ error: "Failed to update announcement." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Announcement ID is required." }, { status: 400 });
    }

    const deleted = AdminService.deleteAnnouncement(id);
    if (!deleted) {
      return NextResponse.json({ error: "Announcement not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully.",
    });
  } catch (error: any) {
    console.error("API DELETE /api/admin/announcements error:", error);
    return NextResponse.json({ error: "Failed to delete announcement." }, { status: 500 });
  }
}
