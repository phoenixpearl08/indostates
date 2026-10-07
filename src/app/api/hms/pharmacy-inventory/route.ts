import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const inventory = HMSService.getPharmacyInventory();

    return NextResponse.json({
      success: true,
      inventory,
      summary: {
        totalItems: inventory.length,
        totalStockUnits: inventory.reduce((acc, it) => acc + it.currentStock, 0),
        lowStockItems: inventory.filter((it) => it.currentStock <= it.reorderLevel),
      },
    });
  } catch (error: any) {
    console.error("API GET /api/hms/pharmacy-inventory error:", error);
    return NextResponse.json({ error: "Failed to fetch pharmacy inventory." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemCode, quantityChange, reason } = body;

    const actor = body.actor || {
      id: "usr-pharmacy-mgr",
      name: "Chief Pharmacist",
      role: "PHARMACY_MANAGER" as UserRole,
    };

    if (!itemCode || quantityChange === undefined) {
      return NextResponse.json({ error: "itemCode and quantityChange are required." }, { status: 400 });
    }

    const updated = HMSService.adjustPharmacyStock(
      itemCode,
      Number(quantityChange),
      reason || "Manual stock adjustment / purchase receipt",
      actor
    );

    if (!updated) {
      return NextResponse.json({ error: "Pharmacy inventory item not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Stock for ${updated.medicineName} (${updated.itemCode}) updated. Current stock: ${updated.currentStock} units.`,
      item: updated,
    });
  } catch (error: any) {
    console.error("API POST /api/hms/pharmacy-inventory error:", error);
    return NextResponse.json({ error: "Failed to adjust pharmacy stock." }, { status: 500 });
  }
}
