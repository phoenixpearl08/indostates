import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";
import { UserRole } from "@/types/hms";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const invoices = HMSService.getInvoices();

    const paidInvoices = invoices.filter((i) => i.paymentStatus === "paid");
    const pendingInvoices = invoices.filter((i) => i.paymentStatus === "unpaid" || i.paymentStatus === "partially_paid");

    const totalCollected = paidInvoices.reduce((sum, i) => sum + (Number(i.paidAmount) || Number(i.totalAmount) || 0), 0);
    const pendingAmount = pendingInvoices.reduce((sum, i) => sum + (Number(i.totalAmount) - Number(i.paidAmount || 0)), 0);

    // Method breakdown
    const methods: Record<string, number> = { upi: 0, cash: 0, card: 0, insurance_tpa: 0 };
    paidInvoices.forEach((i) => {
      const m = i.paymentMethod || "cash";
      methods[m] = (methods[m] || 0) + (Number(i.paidAmount) || Number(i.totalAmount) || 0);
    });

    // GST Tax summary (assuming 5% or 12% health service GST where applicable)
    const totalGstCollected = Math.round(totalCollected * 0.05);

    return NextResponse.json({
      success: true,
      invoices,
      summary: {
        totalInvoices: invoices.length,
        paidCount: paidInvoices.length,
        pendingCount: pendingInvoices.length,
        totalRevenue: totalCollected,
        totalRevenueFormatted: `₹ ${totalCollected.toLocaleString("en-IN")}`,
        pendingReceivables: pendingAmount,
        pendingReceivablesFormatted: `₹ ${pendingAmount.toLocaleString("en-IN")}`,
        totalGstFormatted: `₹ ${totalGstCollected.toLocaleString("en-IN")}`,
        paymentMethods: methods,
      },
    });
  } catch (error: any) {
    console.error("API GET /api/admin/billing error:", error);
    return NextResponse.json({ error: "Failed to fetch billing data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const actor = {
      id: "admin",
      name: "Patient Accounts Officer",
      role: "HOSPITAL_ADMIN" as UserRole,
    };

    if (action === "record_payment") {
      const { invoiceId, paymentMethod, transactionReference } = body;
      if (!invoiceId) {
        return NextResponse.json({ error: "invoiceId is required." }, { status: 400 });
      }

      const updated = HMSService.recordInvoicePayment(
        invoiceId,
        paymentMethod || "upi",
        transactionReference || `TXN-${Date.now().toString().slice(-6)}`,
        actor
      );

      if (!updated) {
        return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Payment recorded for Invoice ${updated.invoiceId}.`,
        invoice: updated,
      });
    }

    if (action === "create_invoice") {
      const { patientUhid, items, paymentMethod } = body;
      if (!patientUhid || !items || !Array.isArray(items)) {
        return NextResponse.json({ error: "patientUhid and items array are required." }, { status: 400 });
      }

      const patient = HMSService.getPatientByUhid(patientUhid);
      const subtotal = items.reduce((s: number, it: any) => s + ((Number(it.unitPrice) || 0) * (Number(it.quantity) || 1)), 0);
      const invoice = HMSService.createInvoice(
        {
          appointmentId: body.appointmentId || "apt-direct",
          patientId: patient?.id || patientUhid,
          patientName: patient?.fullName || "OPD Patient",
          patientUhid,
          items: items.map((it: any, idx: number) => ({
            id: `item-${idx + 1}`,
            description: it.description || "Medical Service",
            category: it.category || "consultation",
            unitPrice: Number(it.unitPrice) || 500,
            quantity: Number(it.quantity) || 1,
            total: (Number(it.unitPrice) || 500) * (Number(it.quantity) || 1),
          })),
          subtotal,
          discount: 0,
          tax: Math.round(subtotal * 0.05),
          totalAmount: Math.round(subtotal * 1.05),
          paidAmount: 0,
          paymentStatus: "unpaid",
          paymentMethod: paymentMethod || "cash",
          generatedBy: actor.name,
        },
        actor
      );

      return NextResponse.json({
        success: true,
        message: `Invoice ${invoice.invoiceId} generated for ${invoice.patientName}.`,
        invoice,
      });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error: any) {
    console.error("API POST /api/admin/billing error:", error);
    return NextResponse.json({ error: "Failed to process billing action." }, { status: 500 });
  }
}
