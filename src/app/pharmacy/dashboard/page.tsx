"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Pill,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RefreshCw,
  Search,
  PackageCheck,
  Check,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { PrescriptionRecord } from "@/types/hms";
import { Button } from "@/components/ui/Button";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";

export default function PharmacyDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "dispensed">("pending");
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const s = HospitalStore.getSession();
    const authorized = ["PHARMACY_STAFF", "PHARMACY_MANAGER", "SUPER_ADMIN", "HOSPITAL_ADMIN", "OPERATIONS_MANAGER"];
    if (!s) {
      window.location.href = "/login?redirect=/pharmacy/dashboard";
      return;
    }
    if (!authorized.includes((s.role || "").toUpperCase())) {
      window.location.href = "/login?error=unauthorized_role";
      return;
    }
    setSession(s);
    setIsAuthChecking(false);
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await fetch("/api/hms/prescriptions");
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.prescriptions)) {
          setPrescriptions(d.prescriptions);
        }
      }
    } catch (err) {
      console.error("Pharmacy fetch error:", err);
    }
  };

  const handleDispense = async (prescriptionId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/hms/prescriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prescriptionId,
          pharmacistName: session?.name || "Hospital Pharmacist",
          actor: {
            id: session?.id || "usr-pharmacy",
            name: session?.name || "Chief Pharmacist",
            role: "PHARMACY_STAFF",
          },
        }),
      });

      if (res.ok) {
        setFeedback({
          type: "success",
          message: "Prescription verified and dispensed to patient successfully.",
        });
        fetchPrescriptions();
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to dispense prescription." });
    } finally {
      setIsProcessing(false);
    }
  };

  const pending = prescriptions.filter((p) => p.status !== "dispensed");
  const dispensed = prescriptions.filter((p) => p.status === "dispensed");

  if (isAuthChecking) {
    return <DashboardSkeleton title="24/7 Clinical Pharmacy Dispensing Portal..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Pharmacy Bar */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shadow-md">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg leading-tight">
                24/7 Clinical Pharmacy Dispensing Portal
              </h1>
              <p className="text-xs text-slate-400">
                IndoStates Health Hospital • Prescription Verification &amp; Medication Stock
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-800 text-emerald-400 px-3 py-1 rounded-full border border-slate-700 font-semibold">
              Pharmacist: {session?.name || "Chief Pharmacist"}
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
            <span className="text-slate-500 text-xs font-semibold block">Awaiting Dispensing</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">
              {pending.length}
            </span>
            <span className="text-[10px] text-slate-400">Doctors&rsquo; pending orders</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
            <span className="text-slate-500 text-xs font-semibold block">Dispensed Today</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {dispensed.length}
            </span>
            <span className="text-[10px] text-emerald-700/70">Verified &amp; issued</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
            <span className="text-slate-500 text-xs font-semibold block">Formulary Quality</span>
            <span className="text-lg font-black text-slate-800 mt-1 block">WHO-GMP Stock</span>
            <span className="text-[10px] text-slate-400">100% Verified Quality</span>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex gap-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab("pending")}
                className={`pb-2 ${activeTab === "pending" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-500"}`}
              >
                Pending Prescriptions ({pending.length})
              </button>
              <button
                onClick={() => setActiveTab("dispensed")}
                className={`pb-2 ${activeTab === "dispensed" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-500"}`}
              >
                Dispensed History ({dispensed.length})
              </button>
            </div>

            <Button variant="outline" size="sm" onClick={fetchPrescriptions}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              <span>Refresh</span>
            </Button>
          </div>

          <div className="space-y-4">
            {(activeTab === "pending" ? pending : dispensed).length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10">
                No prescriptions found in this queue.
              </p>
            ) : (
              (activeTab === "pending" ? pending : dispensed).map((rx) => (
                <div
                  key={rx.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">
                        Rx ID: {rx.prescriptionId} • {rx.patientName}
                      </span>
                      <span className="text-xs text-slate-500">
                        Prescribed by: {rx.doctorName}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                          rx.status === "dispensed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {rx.status.replace(/_/g, " ")}
                      </span>

                      {rx.status !== "dispensed" && (
                        <button
                          onClick={() => handleDispense(rx.id || rx.prescriptionId)}
                          disabled={isProcessing}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
                        >
                          Verify &amp; Dispense &rarr;
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Medications Ordered */}
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Medications Prescribed:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {rx.medications.map((med) => (
                        <div
                          key={med.id}
                          className="p-3 bg-white rounded-xl border border-slate-200 text-xs"
                        >
                          <span className="font-bold text-slate-900 block">{med.medicineName}</span>
                          <span className="text-slate-600 text-[11px] block mt-0.5">
                            {med.dosage} • {med.frequency}
                          </span>
                          <span className="text-slate-400 text-[10px] block">
                            Duration: {med.durationDays} Days • {med.instructions}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
