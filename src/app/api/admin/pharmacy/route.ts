import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { UserRole } from "@/types/hms";
import { requireServerAuth, ADMIN_ACCESS_ROLES } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: [...ADMIN_ACCESS_ROLES, "PHARMACY_STAFF", "PHARMACY_MANAGER", "DOCTOR", "NURSE"],
      requiredPermission: "prescription.read",
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const inventory = HMSService.getPharmacyInventory();
    const prescriptions = HMSService.getPrescriptions();

    const lowStock = inventory.filter((i) => i.currentStock <= i.reorderLevel);
    const expiringSoon = inventory.filter((i) => {
      if (!i.batches || i.batches.length === 0) return false;
      const soon = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString().split("T")[0];
      return i.batches.some((b) => b.expiryDate <= soon);
    });

    return NextResponse.json({
      success: true,
      inventory,
      prescriptions,
      summary: {
        totalItems: inventory.length,
        totalStockUnits: inventory.reduce((sum, i) => sum + i.currentStock, 0),
        lowStockItemsCount: lowStock.length,
        expiringSoonCount: expiringSoon.length,
        dispensedPrescriptions: prescriptions.filter((p) => p.status === "dispensed" || p.status === "completed").length,
        pendingDispensing: prescriptions.filter((p) => p.status === "pending_dispense" || p.status === "partially_dispensed").length,
      },
      lowStock,
      expiringSoon,
    });
  } catch (error: any) {
    console.error("API GET /api/admin/pharmacy error:", error);
    return NextResponse.json({ error: "Failed to fetch pharmacy data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireServerAuth(req, {
      allowedRoles: [...ADMIN_ACCESS_ROLES, "PHARMACY_STAFF", "PHARMACY_MANAGER"],
      requiredPermission: "pharmacy.stock",
    });

    if (!auth.authorized || !auth.staff) {
      return auth.response!;
    }

    const body = await req.json();
    const { action } = body;

    const actor = {
      id: auth.staff.id,
      name: auth.staff.name,
      role: auth.staff.role as UserRole,
    };


    if (action === "adjust_stock") {
      const { itemCode, quantityChange, reason } = body;
      if (!itemCode || quantityChange === undefined) {
        return NextResponse.json({ error: "itemCode and quantityChange are required." }, { status: 400 });
      }

      const updated = HMSService.adjustPharmacyStock(itemCode, Number(quantityChange), reason || "Administrative replenishment", actor);
      if (!updated) {
        return NextResponse.json({ error: "Medicine item not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Inventory updated for ${updated.medicineName}. Current stock: ${updated.currentStock} units.`,
        item: updated,
      });
    }

    if (action === "add_medicine") {
      const { medicineName, genericName, category, form, strength, currentStock, reorderLevel, unitPrice, supplier } = body;
      if (!medicineName || !category || currentStock === undefined) {
        return NextResponse.json({ error: "medicineName, category, and currentStock are required." }, { status: 400 });
      }

      const itemCode = `MED-${medicineName.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      const inventory = HMSService.getPharmacyInventory();

      const validCategory = (["Tablet", "Capsule", "Injection", "Syrup", "IV Fluid", "Topical"].includes(category)
        ? category
        : "Tablet") as "Tablet" | "Capsule" | "Injection" | "Syrup" | "IV Fluid" | "Topical";

      const newItem = {
        id: `med-${Date.now()}`,
        itemCode,
        medicineName: medicineName.trim(),
        genericName: genericName || medicineName.trim(),
        category: validCategory,
        strength: strength || "500mg",
        currentStock: Number(currentStock),
        reorderLevel: Number(reorderLevel) || 50,
        unitPrice: Number(unitPrice) || 20,
        mrp: Number(unitPrice) || 20,
        batches: [
          {
            id: `batch-${Date.now()}`,
            batchNumber: `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
            expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().split("T")[0],
            quantity: Number(currentStock),
            purchaseRate: Math.round((Number(unitPrice) || 20) * 0.75),
            mrp: Number(unitPrice) || 20,
          },
        ],
      };

      inventory.unshift(newItem);

      HMSService.recordAuditLog(
        actor.id,
        actor.name,
        actor.role,
        "pharmacy.add_medicine",
        `pharmacy/${itemCode}`,
        { medicineName: newItem.medicineName, stock: newItem.currentStock }
      );

      return NextResponse.json({
        success: true,
        message: `Medicine ${newItem.medicineName} added to hospital formulary.`,
        item: newItem,
      });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error: any) {
    console.error("API POST /api/admin/pharmacy error:", error);
    return NextResponse.json({ error: "Failed to process pharmacy action." }, { status: 500 });
  }
}
