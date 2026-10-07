"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Search,
  Filter,
  DollarSign,
  Receipt,
  CheckCircle2,
  Clock,
  X,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface BillingViewProps {
  billingData: any;
  onRefresh: () => void;
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function BillingView({ billingData, onRefresh, onSetFeedback }: BillingViewProps) {
  const invoices = billingData?.invoices || [];
  const summary = billingData?.summary || {};

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Record payment form
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [txnRef, setTxnRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredInvoices = invoices.filter((inv: any) => {
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      inv.invoiceNumber?.toLowerCase().includes(q) ||
      inv.patientName?.toLowerCase().includes(q) ||
      inv.patientUhid?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "ALL" || inv.paymentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice || !paymentAmount) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "record_payment",
          invoiceId: selectedInvoice.id,
          amount: Number(paymentAmount),
          paymentMethod,
          transactionReference: txnRef,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        setShowPaymentModal(false);
        setSelectedInvoice(null);
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to record payment." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error recording payment." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Hospital Billing, TPA Claims &amp; Finance</h2>
          <p className="text-xs text-slate-500">
            Real-time inpatient billing, outpatient fees, GST reporting, and payment reconciliations
          </p>
        </div>
      </div>

      {/* Revenue Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Total Collections</div>
          <div className="text-lg font-black text-slate-800 mt-1">
            {summary.totalRevenueFormatted || "₹ 0"}
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5 font-semibold">
            {summary.paidCount ?? 0} Paid Invoices
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-rose-600">Pending Receivables</div>
          <div className="text-lg font-black text-rose-700 mt-1">
            {summary.pendingReceivablesFormatted || "₹ 0"}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-semibold">
            {summary.pendingCount ?? 0} Unpaid / In-Process
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-hospital-700">GST Collection (5%)</div>
          <div className="text-lg font-black text-hospital-800 mt-1">
            {summary.totalGstFormatted || "₹ 0"}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Tax Reconciled</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Top Payment Channel</div>
          <div className="text-lg font-black text-slate-800 mt-1">UPI &amp; QR</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Instant Digital Settlement</div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by invoice number, patient, or UHID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold text-slate-700 py-1.5 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="partially_paid">Partially Paid</option>
            </select>
            <span className="text-xs font-bold text-slate-500">{filteredInvoices.length} Invoices</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Invoice #</th>
                <th className="py-2.5 px-4">Patient Name &amp; UHID</th>
                <th className="py-2.5 px-4">Total Amount</th>
                <th className="py-2.5 px-4">Paid / Balance</th>
                <th className="py-2.5 px-4">Payment Method</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv: any) => {
                  const isPaid = inv.paymentStatus === "paid";
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-hospital-800">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{inv.patientName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{inv.patientUhid}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        ₹{Number(inv.totalAmount).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div className="font-semibold text-emerald-700">
                          ₹{Number(inv.paidAmount || 0).toLocaleString("en-IN")}
                        </div>
                        {inv.balanceAmount > 0 && (
                          <div className="text-[10px] text-rose-600 font-mono">
                            Bal: ₹{Number(inv.balanceAmount).toLocaleString("en-IN")}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700 uppercase font-semibold text-[11px]">
                        {inv.paymentMethod || "cash"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isPaid
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {inv.paymentStatus?.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!isPaid && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setPaymentAmount(inv.balanceAmount || inv.totalAmount);
                              setShowPaymentModal(true);
                            }}
                            className="text-[11px] h-7 px-2.5"
                          >
                            Record Payment
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                    No billing invoices match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Record Invoice Payment</h3>
                <span className="text-xs text-amber-400 font-mono">{selectedInvoice.invoiceNumber}</span>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Patient:</span>
                  <span className="font-bold text-slate-800">{selectedInvoice.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Invoice Amount:</span>
                  <span className="font-bold text-slate-800">₹{selectedInvoice.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Balance:</span>
                  <span className="font-bold text-rose-600">
                    ₹{selectedInvoice.balanceAmount || selectedInvoice.totalAmount}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Amount to Collect (₹) *</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                >
                  <option value="upi">UPI / Dynamic QR</option>
                  <option value="cash">Cash Counter</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="insurance_tpa">TPA Cashless Insurance</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reference / Transaction Number</label>
                <input
                  type="text"
                  placeholder="e.g. UPI Ref # / Card Auth Code"
                  value={txnRef}
                  onChange={(e) => setTxnRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Confirm & Issue Receipt"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
