import { NextRequest, NextResponse } from "next/server";
import { HMSService } from "@/lib/hmsService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId") || undefined;
    const invoices = HMSService.getInvoices(patientId);
    return NextResponse.json({ success: true, invoices });
  } catch (error: any) {
    console.error("API GET /api/hms/billing error:", error);
    return NextResponse.json({ error: "Failed to fetch invoices." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appointmentId, patientId, patientName, patientUhid, items, subtotal, discount, tax, totalAmount, actor } =
      body;

    const effectivePatientId = patientId || patientUhid || body.patientUhid || "PAT-GUEST";
    const effectiveItems = Array.isArray(items) ? items : [];

    if (!appointmentId || !patientName || effectiveItems.length === 0) {
      return NextResponse.json({ error: "appointmentId, patientName, and items array are required." }, { status: 400 });
    }

    const calculatedSubtotal = effectiveItems.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
    const effectiveTotal = Number(totalAmount) || calculatedSubtotal;

    const safeActor = actor || {
      id: "usr-billing",
      name: "Patient Accounts Cashier",
      role: "BILLING_STAFF",
    };

    let invoice = HMSService.createInvoice(
      {
        appointmentId,
        patientId: effectivePatientId,
        patientName,
        patientUhid: patientUhid || body.patientUhid || "IND-UHID-GENERAL",
        items: effectiveItems,
        subtotal: calculatedSubtotal,
        discount: Number(discount) || 0,
        tax: Number(tax) || 0,
        totalAmount: effectiveTotal,
        paidAmount: 0,
        paymentStatus: "unpaid",
        generatedBy: safeActor.name,
      },
      safeActor
    );

    // If payment details are supplied in the same payload, settle immediately
    if (body.paymentMethod) {
      const settled = HMSService.recordInvoicePayment(
        invoice.id,
        body.paymentMethod,
        body.transactionRef || `TXN-${Date.now()}`,
        safeActor
      );
      if (settled) invoice = settled;
    }

    return NextResponse.json({
      success: true,
      message: `Invoice ${invoice.invoiceId} generated successfully.${invoice.receiptNumber ? ` Receipt ${invoice.receiptNumber} issued.` : ""}`,
      invoice,
    });
  } catch (error: any) {
    console.error("API POST /api/hms/billing error:", error);
    return NextResponse.json({ error: "Failed to create invoice." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceId, paymentMethod, transactionRef, actor } = body;

    if (!invoiceId || !paymentMethod) {
      return NextResponse.json({ error: "invoiceId and paymentMethod are required." }, { status: 400 });
    }

    const safeActor = actor || {
      id: "usr-billing",
      name: "Patient Accounts Cashier",
      role: "BILLING_STAFF",
    };

    const updated = HMSService.recordInvoicePayment(
      invoiceId,
      paymentMethod,
      transactionRef || `TXN-${Date.now()}`,
      safeActor
    );

    if (!updated) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Payment received for Invoice ${updated.invoiceId}. Receipt ${updated.receiptNumber} issued.`,
      invoice: updated,
    });
  } catch (error: any) {
    console.error("API PATCH /api/hms/billing error:", error);
    return NextResponse.json({ error: "Failed to record payment." }, { status: 500 });
  }
}
