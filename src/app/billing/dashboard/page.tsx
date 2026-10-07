"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RefreshCw,
  Receipt,
  FileText,
  Search,
  DollarSign,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { BillingInvoice } from "@/types/hms";
import { Button } from "@/components/ui/Button";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";

export default function BillingDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "paid">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "card">("upi");
  const [txnRef, setTxnRef] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const s = HospitalStore.getSession();
    const authorized = ["BILLING_STAFF", "FINANCE_MANAGER", "SUPER_ADMIN", "HOSPITAL_ADMIN", "OPERATIONS_MANAGER"];
    if (!s) {
      window.location.href = "/login?redirect=/billing/dashboard";
      return;
    }
    if (!authorized.includes((s.role || "").toUpperCase())) {
      window.location.href = "/login?error=unauthorized_role";
      return;
    }
    setSession(s);
    setIsAuthChecking(false);
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/hms/billing");
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.invoices)) {
          setInvoices(d.invoices);
        }
      }
    } catch (err) {
      console.error("Billing fetch error:", err);
    }
  };

  const handlePayInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    setIsProcessing(true);
    try {
      const res = await fetch("/api/hms/billing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: selectedInvoice.id || selectedInvoice.invoiceId,
          paymentMethod,
          transactionRef: txnRef.trim() || `TXN-${Date.now()}`,
          actor: {
            id: session?.id || "usr-billing",
            name: session?.name || "Cashier Executive",
            role: "BILLING_STAFF",
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Payment recording failed." });
      } else {
        setFeedback({
          type: "success",
          message: `Payment cleared! Issued Receipt Number: ${data.invoice?.receiptNumber}`,
        });
        setSelectedInvoice(null);
        setTxnRef("");
        fetchInvoices();
      }
    } catch {
      setFeedback({ type: "error", message: "Network error processing payment." });
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingInvoices = invoices.filter((i) => i.paymentStatus !== "paid");
  const paidInvoices = invoices.filter((i) => i.paymentStatus === "paid");

  const totalCollectedToday = paidInvoices.reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0);
  const totalPendingAmount = pendingInvoices.reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0);

  if (isAuthChecking) {
    return <DashboardSkeleton title="Hospital Billing & Patient Accounts..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Billing Bar */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center shadow-md">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg leading-tight">
                Hospital Billing &amp; Patient Accounts Portal
              </h1>
              <p className="text-xs text-slate-400">
                IndoStates Health Hospital • Cashier, Invoicing &amp; Official Receipts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-800 text-amber-400 px-3 py-1 rounded-full border border-slate-700 font-semibold">
              Cashier: {session?.name || "Billing Executive"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await HospitalStore.logout();
                window.location.href = "/login?portal=admin";
              }}
              className="border-slate-700 text-slate-300 hover:text-white"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {feedback && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-500 hover:text-slate-700 font-bold">
              Dismiss
            </button>
          </div>
        )}

        {/* Pulse Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
            <span className="text-slate-500 text-xs font-semibold block">Total Collections Today</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              ₹{totalCollectedToday.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-emerald-700/70">Cleared &amp; receipted</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
            <span className="text-slate-500 text-xs font-semibold block">Pending Invoices</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">
              ₹{totalPendingAmount.toLocaleString("en-IN")} ({pendingInvoices.length} Bills)
            </span>
            <span className="text-[10px] text-slate-400">Awaiting payment settlement</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
            <span className="text-slate-500 text-xs font-semibold block">Billing Audit</span>
            <span className="text-lg font-black text-slate-900 mt-1 block">GST &amp; DPDP Compliant</span>
            <span className="text-[10px] text-slate-400">Official hospital accounting</span>
          </div>
        </div>

        {/* Invoices List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex gap-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab("pending")}
                className={`pb-2 ${activeTab === "pending" ? "text-amber-600 border-b-2 border-amber-600" : "text-slate-500"}`}
              >
                Pending Invoices ({pendingInvoices.length})
              </button>
              <button
                onClick={() => setActiveTab("paid")}
                className={`pb-2 ${activeTab === "paid" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-500"}`}
              >
                Paid &amp; Receipted ({paidInvoices.length})
              </button>
            </div>

            <Button variant="outline" size="sm" onClick={fetchInvoices}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              <span>Refresh</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Invoice ID</th>
                  <th className="py-3 px-4">Patient Name &amp; UHID</th>
                  <th className="py-3 px-4">Line Items</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(activeTab === "pending" ? pendingInvoices : paidInvoices).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No invoices in this category.
                    </td>
                  </tr>
                ) : (
                  (activeTab === "pending" ? pendingInvoices : paidInvoices).map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {inv.invoiceId}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800 block">{inv.patientName}</span>
                        <span className="text-[11px] text-slate-500">{inv.patientUhid}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {inv.items.map((it) => it.description).join(", ")}
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900">
                        ₹{Number(inv.totalAmount).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            inv.paymentStatus === "paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {inv.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {inv.paymentStatus !== "paid" ? (
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition"
                          >
                            Collect Payment &rarr;
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold text-[11px]">
                            Receipt: {inv.receiptNumber || "Issued"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-900 text-base">Record Payment &amp; Issue Receipt</h3>
                <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                  ✕
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-1">
                <p><strong>Invoice ID:</strong> {selectedInvoice.invoiceId}</p>
                <p><strong>Patient:</strong> {selectedInvoice.patientName} ({selectedInvoice.patientUhid})</p>
                <p className="text-base font-black text-hospital-800 pt-1">
                  Payable Amount: ₹{Number(selectedInvoice.totalAmount).toLocaleString("en-IN")}
                </p>
              </div>

              <form onSubmit={handlePayInvoice} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 font-semibold"
                  >
                    <option value="upi">UPI / QR Code Scan</option>
                    <option value="cash">Cash on Hand</option>
                    <option value="card">Credit / Debit Card POS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Transaction / Reference Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UPI Ref / Card Last 4 digits..."
                    value={txnRef}
                    onChange={(e) => setTxnRef(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" size="md" type="button" onClick={() => setSelectedInvoice(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="md" type="submit" isLoading={isProcessing}>
                    Confirm Payment &amp; Issue Receipt
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
