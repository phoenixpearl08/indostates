import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

let testCatalog = [
  { id: "tc-1", name: "1.5 Tesla High-Field Brain MRI with Neuro-Perfusion", department: "Neuroradiology", price: 7500, turnaroundHours: 2, sampleType: "Radiological" },
  { id: "tc-2", name: "128-Slice Low-Dose Chest CT Scan (HRCT)", department: "Diagnostic Radiology", price: 4500, turnaroundHours: 1, sampleType: "Radiological" },
  { id: "tc-3", name: "Complete Blood Count (CBC) with Automated Differential", department: "Clinical Pathology", price: 450, turnaroundHours: 2, sampleType: "Whole Blood" },
  { id: "tc-4", name: "Comprehensive Metabolic Panel (CMP / LFT / KFT)", department: "Clinical Biochemistry", price: 1200, turnaroundHours: 4, sampleType: "Serum" },
  { id: "tc-5", name: "Lipid Profile with ApoB & hs-CRP", department: "Clinical Biochemistry", price: 950, turnaroundHours: 3, sampleType: "Serum" },
  { id: "tc-6", name: "DEXA Whole Body Bone Mineral Densitometry", department: "Orthopedic Imaging", price: 2800, turnaroundHours: 1, sampleType: "Radiological" },
  { id: "tc-7", name: "HbA1c Glycated Hemoglobin (HPLC Gold Standard)", department: "Endocrinology", price: 600, turnaroundHours: 2, sampleType: "EDTA Blood" },
  { id: "tc-8", name: "Troponin I High-Sensitivity Cardiac Marker", department: "Emergency Cardiac Lab", price: 1400, turnaroundHours: 0.5, sampleType: "Plasma" },
];

export async function GET() {
  try {
    const labOrders = HMSService.getLabOrders();
    const imagingOrders = HMSService.getImagingOrders();

    return NextResponse.json({
      success: true,
      labOrders,
      imagingOrders,
      catalog: testCatalog,
      summary: {
        totalOrders: labOrders.length,
        pendingReports: labOrders.filter((l) => !l.isReportReleased).length,
        releasedReports: labOrders.filter((l) => l.isReportReleased).length,
        turnaroundAverage: "1.8 hours",
      },
    });
  } catch (error: any) {
    console.error("API GET /api/admin/lab error:", error);
    return NextResponse.json({ error: "Failed to fetch laboratory data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const actor = {
      id: "admin",
      name: "Laboratory Director",
      role: "HOSPITAL_ADMIN" as UserRole,
    };

    if (action === "release_report") {
      const { labOrderId, resultsText, reportUrl, verifiedBy } = body;
      if (!labOrderId || !resultsText) {
        return NextResponse.json({ error: "labOrderId and resultsText are required." }, { status: 400 });
      }

      const updated = HMSService.releaseLabReport(
        labOrderId,
        reportUrl || `/reports/lab-${labOrderId}.pdf`,
        resultsText,
        verifiedBy || actor.name,
        actor
      );
      if (!updated) {
        return NextResponse.json({ error: "Lab order not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Lab report for order ${updated.orderId} verified and released.`,
        labOrder: updated,
      });
    }

    if (action === "update_status") {
      const { labOrderId, newStatus } = body;
      if (!labOrderId || !newStatus) {
        return NextResponse.json({ error: "labOrderId and newStatus are required." }, { status: 400 });
      }

      const updated = HMSService.updateLabOrderStatus(labOrderId, newStatus, actor);
      if (!updated) {
        return NextResponse.json({ error: "Lab order not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Lab order ${updated.orderId} status updated to ${newStatus}.`,
        labOrder: updated,
      });
    }

    if (action === "add_test") {
      const { name, department, price, turnaroundHours, sampleType } = body;
      if (!name || !price) {
        return NextResponse.json({ error: "name and price are required." }, { status: 400 });
      }

      const newTest = {
        id: `tc-${Date.now()}`,
        name: name.trim(),
        department: department || "General Diagnostics",
        price: Number(price),
        turnaroundHours: Number(turnaroundHours) || 2,
        sampleType: sampleType || "Serum",
      };
      testCatalog.push(newTest);

      return NextResponse.json({
        success: true,
        message: `Diagnostic test ${newTest.name} added to catalog.`,
        test: newTest,
      });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error: any) {
    console.error("API POST /api/admin/lab error:", error);
    return NextResponse.json({ error: "Failed to process laboratory action." }, { status: 500 });
  }
}
