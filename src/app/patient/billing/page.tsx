"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  Plus,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { BillingInvoice } from "@/types/hms";
import { formatDate } from "@/lib/utils";

export default function PatientBillingPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "paid">("all");
  const [payingInvoice, setPayingInvoice] = useState<BillingInvoice | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentFeedback, setPaymentFeedback] = useState<string | null>(null);

  useEffect(() => {
    const s = HospitalStore.getSession();
    if (!s) {
      window.location.href = "/login?portal=patient&redirect=/patient/billing";
      return;
    }
    setSession(s);
    fetchInvoices(s);
  }, []);

  const fetchInvoices = async (user: UserSession) => {
    setIsLoading(true);
    try {
      const patientId = user.id;
      const res = await fetch(`/api/hms/billing?patientId=${patientId}`);
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.invoices)) {
          setInvoices(d.invoices);
          setIsLoading(false);
          return;
        }
      }

      // Default mock invoices
      setInvoices([
        {
          id: "inv-001",
          invoiceId: "INV-99210",
          appointmentId: "apt-1",
          patientId: user.id,
          patientName: user.name || "Murugan Selvam",
          patientUhid: user.uhid || "IND-UHID-000101",
          items: [
            { id: "it-1", description: "Specialist OPD Consultation - Dr. Rajesh Rangaswamy", unitPrice: 650, quantity: 1, total: 650, category: "consultation" },
            { id: "it-2", description: "Clinical Nursing & Triage Vitals Check", unitPrice: 150, quantity: 1, total: 150, category: "nursing" },
          ],
          subtotal: 800,
          discount: 0,
          tax: 0,
          totalAmount: 800,
          paidAmount: 800,
          paymentStatus: "paid",
          paymentMethod: "upi",
          receiptNumber: "REC-202610-8819",
          generatedBy: "Deepa Raman (Billing Staff)",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: "inv-002",
          invoiceId: "INV-99211",
          appointmentId: "apt-1",
          patientId: user.id,
          patientName: user.name || "Murugan Selvam",
          patientUhid: user.uhid || "IND-UHID-000101",
          items: [
            { id: "it-3", description: "Complete Blood Count (CBC) with ESR", unitPrice: 450, quantity: 1, total: 450, category: "lab" },
            { id: "it-4", description: "Comprehensive Fasting Lipid Profile", unitPrice: 750, quantity: 1, total: 750, category: "lab" },
          ],
          subtotal: 1200,
          discount: 0,
          tax: 0,
          totalAmount: 1200,
          paidAmount: 1200,
          paymentStatus: "paid",
          paymentMethod: "card",
          receiptNumber: "REC-202610-8820",
          generatedBy: "Deepa Raman (Billing Staff)",
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
        {
          id: "inv-003",
          invoiceId: "INV-99212",
          appointmentId: "apt-1",
          patientId: user.id,
          patientName: user.name || "Murugan Selvam",
          patientUhid: user.uhid || "IND-UHID-000101",
          items: [
            { id: "it-5", description: "OPD Pharmacy Dispensing: Atorvastatin, Ecosprin, Telmisartan", unitPrice: 420, quantity: 1, total: 420, category: "pharmacy" },
          ],
          subtotal: 420,
          discount: 0,
          tax: 0,
          totalAmount: 420,
          paidAmount: 0,
          paymentStatus: "unpaid",
          generatedBy: "Central Pharmacy Billing",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Error loading invoices:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulatePayment = (inv: BillingInvoice) => {
    setIsProcessingPayment(true);
    setPaymentFeedback(null);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentFeedback(`Payment of ₹${inv.totalAmount} for Invoice ${inv.invoiceId} completed successfully via UPI. Official receipt issued.`);
      setInvoices((prev) =>
        prev.map((i) =>
          i.id === inv.id
            ? { ...i, paymentStatus: "paid", receiptNumber: `REC-${Date.now().toString().slice(-6)}` }
            : i
        )
      );
      setPayingInvoice(null);
    }, 1200);
  };

  const pendingTotal = invoices
    .filter((i) => i.paymentStatus === "unpaid" || (i.paymentStatus as string) === "pending")
    .reduce((acc, curr) => acc + Number(curr.totalAmount || 0), 0);

  const filteredInvoices = invoices.filter((i) => {
    if (activeTab === "pending") return i.paymentStatus === "unpaid" || (i.paymentStatus as string) === "pending";
    if (activeTab === "paid") return i.paymentStatus === "paid";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-hospital-600 bg-hospital-50 px-2.5 py-1 rounded-full border border-hospital-100">
            Patient Accounts &amp; Settlements
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-2">
            Invoices, Bills &amp; Payment Receipts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review detailed itemized invoices for consultations, pathology, diagnostic radiology, and in-house pharmacy.
          </p>
        </div>

        {/* Outstanding Balance Pill */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Outstanding Due
          </span>
          <span className="text-2xl font-black font-mono text-cyan-300">
            ₹{pendingTotal.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {paymentFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{paymentFeedback}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`pb-3 border-b-2 transition ${
            activeTab === "all" ? "border-hospital-700 text-hospital-800" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          All Invoices ({invoices.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === "pending" ? "border-hospital-700 text-hospital-800" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Pending Dues</span>
          {pendingTotal > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("paid")}
          className={`pb-3 border-b-2 transition ${
            activeTab === "paid" ? "border-hospital-700 text-hospital-800" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Paid Receipts
        </button>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-hospital-600" />
            <span>Loading verified invoices...</span>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
            <FileText className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-900 text-sm">No Invoices Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No bills match your current view.
            </p>
          </div>
        ) : (
          filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 hover:shadow-card transition space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {inv.invoiceId}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        inv.paymentStatus === "paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : inv.paymentStatus === "unpaid" || (inv.paymentStatus as string) === "pending"
                          ? "bg-amber-100 text-amber-800 animate-pulse"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {inv.paymentStatus}
                    </span>
                  </div>

                  {inv.receiptNumber && (
                    <span className="text-xs text-emerald-700 font-mono font-bold block mt-1">
                      Official Receipt: {inv.receiptNumber}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-slate-900 block">
                    ₹{Number(inv.totalAmount).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {formatDate(inv.createdAt)}
                  </span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-1.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 text-xs">
                {inv.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <span className="text-slate-700">{it.description}</span>
                    <strong className="text-slate-900 font-mono">₹{it.total ?? it.unitPrice}</strong>
                  </div>
                ))}
              </div>

              {/* Actions Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className="text-[11px] text-slate-500">
                  GSTIN: 33AAACI9912K1Z9 • IndoStates Health Hospital
                </span>

                <div className="flex items-center gap-2">
                  {(inv.paymentStatus === "unpaid" || (inv.paymentStatus as string) === "pending") && (
                    <button
                      type="button"
                      onClick={() => setPayingInvoice(inv)}
                      className="px-4 py-2 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs transition shadow-xs"
                    >
                      Pay Online (UPI / Card)
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Online Payment Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-hospital-700 tracking-wider">
                  Secure Checkout
                </span>
                <h3 className="font-bold text-slate-900 text-base">Invoice Payment Settlement</h3>
              </div>
              <button
                type="button"
                onClick={() => setPayingInvoice(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice:</span>
                <strong className="font-mono">{payingInvoice.invoiceId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Payable:</span>
                <strong className="text-lg font-black font-mono text-hospital-800">
                  ₹{Number(payingInvoice.totalAmount).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 block">Select Instant Payment Channel:</label>
              <div className="grid grid-cols-2 gap-2 font-bold text-slate-800">
                <div className="p-3 rounded-xl border-2 border-hospital-600 bg-hospital-50/50 text-center cursor-pointer">
                  UPI (GPay / PhonePe / BHIM)
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white text-center cursor-pointer hover:bg-slate-50">
                  Credit / Debit Card
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPayingInvoice(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={() => handleSimulatePayment(payingInvoice)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
              >
                {isProcessingPayment ? "Processing UPI Payment..." : `Authorize ₹${payingInvoice.totalAmount}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
