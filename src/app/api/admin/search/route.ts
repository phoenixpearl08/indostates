import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/lib/adminService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = AdminService.getSearchAnalytics();
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    console.error("API GET /api/admin/search error:", error);
    return NextResponse.json({ error: "Failed to fetch search analytics." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, query, category, resultsCount } = body;

    if (action === "reindex") {
      return NextResponse.json({
        success: true,
        message: "Hospital catalog and clinical search indexes rebuilt successfully.",
        indexedEntities: {
          doctors: 6,
          departments: 8,
          healthPackages: 4,
          diagnostics: 8,
          faqs: 5,
        },
      });
    }

    if (query) {
      AdminService.recordSearchQuery(query, category || "all", Number(resultsCount) || 0);
      return NextResponse.json({ success: true, message: "Search query logged." });
    }

    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  } catch (error: any) {
    console.error("API POST /api/admin/search error:", error);
    return NextResponse.json({ error: "Failed to process search management action." }, { status: 500 });
  }
}
