"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Pill,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  RefreshCw,
  Search,
  Plus,
  ArrowRight,
  ShieldCheck,
  Send,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";

export default function PatientPharmacyPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [refillMedicineName, setRefillMedicineName] = useState("");
  const [refillQuantity, setRefillQuantity] = useState("30");
  const [refillRxId, setRefillRxId] = useState("RX-44910");
  const [isSubmittingRefill, setIsSubmittingRefill] = useState(false);
  const [refillFeedback, setRefillFeedback] = useState<string | null>(null);

  // Pharmacy Orders Status
  const [dispensingOrders, setDispensingOrders] = useState([
    {
      id: "ph-ord-1",
      orderNumber: "PH-202610-109",
      rxId: "RX-44910",
      doctorName: "Dr. Rajesh Rangaswamy",
      status: "READY_FOR_PICKUP",
      counter: "Counter 2 (Ground Floor OPD Wing)",
      pickupCode: "PK-8812",
      items: [
        { name: "Atorvastatin 20mg", qty: "30 tabs", stock: "In Stock" },
        { name: "Ecosprin 75mg", qty: "30 tabs", stock: "In Stock" },
        { name: "Telmisartan 40mg", qty: "30 tabs", stock: "In Stock" },
      ],
      amount: "₹420",
      date: "Today, 10:45 AM",
    },
    {
      id: "ph-ord-2",
      orderNumber: "PH-202610-098",
      rxId: "RX-44911",
      doctorName: "Dr. Logesh Thirumalaisamy",
      status: "DISPENSED",
      counter: "Counter 1",
      pickupCode: "PK-7741",
      items: [
        { name: "Paracetamol 650mg ER", qty: "10 tabs", stock: "Dispensed" },
        { name: "Pantoprazole 40mg", qty: "10 tabs", stock: "Dispensed" },
      ],
      amount: "₹185",
      date: "3 Oct 2026",
    },
  ]);

  useEffect(() => {
    const s = HospitalStore.getSession();
    if (!s) {
      window.location.href = "/login?portal=patient&redirect=/patient/pharmacy";
      return;
    }
    setSession(s);
  }, []);

  const handleRefillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refillMedicineName.trim()) return;

    setIsSubmittingRefill(true);
    setRefillFeedback(null);

    setTimeout(() => {
      setIsSubmittingRefill(false);
      setRefillFeedback(
        `Refill request for ${refillMedicineName} (${refillQuantity} units) submitted to IndoStates 24/7 Clinical Pharmacy. Pharmacist review in progress.`
      );
      setRefillMedicineName("");
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            Hospital Clinical Pharmacy
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-2">
            Medications &amp; Pharmacy Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track dispensing status of prescribed medications, hospital pharmacy stock, and submit refill requests for chronic therapies.
          </p>
        </div>

        <Link
          href="/patient/prescriptions"
          className="px-5 py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
        >
          <Pill className="w-4 h-4" />
          <span>View Active Prescriptions</span>
        </Link>
      </div>

      {/* Grid: Live Dispensing Status + Refill Request Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Dispensing Orders */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Pharmacy Dispensing Orders</h3>
            <span className="text-xs text-slate-500 font-mono">24/7 OPD Pharmacy Wing</span>
          </div>

          <div className="space-y-4">
            {dispensingOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {ord.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          ord.status === "READY_FOR_PICKUP"
                            ? "bg-emerald-100 text-emerald-800 animate-pulse"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {ord.status === "READY_FOR_PICKUP" ? "Ready at Pharmacy Counter" : "Dispensed"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 font-medium">
                      Prescribed by {ord.doctorName} ({ord.rxId})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-black text-sm text-hospital-800 bg-hospital-50 px-3 py-1 rounded-xl border border-hospital-200 inline-block">
                      Pickup Code: {ord.pickupCode}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">{ord.date}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Packed Medicines
                  </span>
                  <div className="space-y-1.5">
                    {ord.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-50 rounded-xl text-xs flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-800">{it.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 font-mono">{it.qty}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {it.stock}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Counter & Instruction */}
                <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-600 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-hospital-600" />
                    <span>Pickup Location: <strong>{ord.counter}</strong></span>
                  </div>
                  <strong className="text-slate-900 text-sm">{ord.amount}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Request Medication Refill */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Submit Medication Refill</h3>
              <p className="text-xs text-slate-500">
                Request routine refills of continuing therapies for hospital counter pickup.
              </p>
            </div>

            {refillFeedback && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{refillFeedback}</span>
              </div>
            )}

            <form onSubmit={handleRefillSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Prescription Reference (Rx ID)</label>
                <input
                  type="text"
                  required
                  value={refillRxId}
                  onChange={(e) => setRefillRxId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-800 focus:ring-2 focus:ring-hospital-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Medicine Name &amp; Strength *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Atorvastatin 20mg"
                  value={refillMedicineName}
                  onChange={(e) => setRefillMedicineName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-hospital-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantity Requested</label>
                <select
                  value={refillQuantity}
                  onChange={(e) => setRefillQuantity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 bg-white"
                >
                  <option value="15">15 Days Supply</option>
                  <option value="30">30 Days Supply (1 Month)</option>
                  <option value="60">60 Days Supply (2 Months)</option>
                  <option value="90">90 Days Supply (3 Months)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
                <span className="font-bold text-slate-700 block">Hospital Dispensing Policy:</span>
                <p>Scheduled prescription refills require valid active physician authorization on electronic file. Antibiotics and controlled substances cannot be refilled without a physical review.</p>
              </div>

              <button
                type="submit"
                disabled={isSubmittingRefill}
                className="w-full py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingRefill ? "Submitting Request..." : "Submit Refill Request"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
