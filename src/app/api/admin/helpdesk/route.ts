import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/lib/adminService";

export const dynamic = "force-dynamic";

const commonQuestions = [
  { question: "How do I book an appointment with Dr. Rajesh?", count: 142, category: "APPOINTMENTS" },
  { question: "What is the emergency ambulance hotline?", count: 98, category: "EMERGENCY" },
  { question: "Do you have cashless insurance with Star Health?", count: 87, category: "INSURANCE" },
  { question: "What preparation is needed for an MRI Brain scan?", count: 64, category: "DIAGNOSTICS" },
  { question: "What are the visiting hours for general wards?", count: 52, category: "FACILITIES" },
];

const failedQueries = [
  { query: "Do you perform cosmetic plastic surgery?", count: 12, reason: "Sub-specialty not offered in current formulary" },
  { query: "Ayurvedic panchakarma treatment schedule", count: 8, reason: "Allopathic hospital only" },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;

    const knowledgeBase = AdminService.getKnowledgeBase(category);

    return NextResponse.json({
      success: true,
      stats: {
        totalConversations: 1284,
        totalQuestionsAnswered: 3940,
        positiveFeedbackRate: "97.4%",
        knowledgeItemsCount: knowledgeBase.length,
      },
      commonQuestions,
      failedQueries,
      knowledgeBase,
    });
  } catch (error: any) {
    console.error("API GET /api/admin/helpdesk error:", error);
    return NextResponse.json({ error: "Failed to fetch Help Desk administration data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, category, title, content, tags, isActive } = body;

    if (!category || !title || !content) {
      return NextResponse.json({ error: "category, title, and content are required." }, { status: 400 });
    }

    const item = AdminService.saveKnowledgeItem({
      id,
      category,
      title: title.trim(),
      content: content.trim(),
      tags: tags || [],
      isActive: isActive !== undefined ? isActive : true,
      updatedBy: "Hospital Administration",
    });

    return NextResponse.json({
      success: true,
      item,
      message: `Knowledge base item "${item.title}" saved successfully.`,
    });
  } catch (error: any) {
    console.error("API POST /api/admin/helpdesk error:", error);
    return NextResponse.json({ error: "Failed to save Help Desk knowledge item." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
    }

    const deleted = AdminService.deleteKnowledgeItem(id);
    if (!deleted) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Knowledge base item deleted successfully.",
    });
  } catch (error: any) {
    console.error("API DELETE /api/admin/helpdesk error:", error);
    return NextResponse.json({ error: "Failed to delete Help Desk knowledge item." }, { status: 500 });
  }
}
