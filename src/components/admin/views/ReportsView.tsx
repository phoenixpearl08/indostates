"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  Users,
  CreditCard,
  Building2,
  Stethoscope,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ReportsViewProps {
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function ReportsView({ onSetFeedback }: ReportsViewProps) {
  const [reportData, setReportData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<"appointments" | "finance" | "patients" | "doctors">("appointments");

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/reports");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReportData(data.report);
        }
      }
    } catch {
      onSetFeedback({ type: "error", message: "Failed to load reports." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCsv = (cat: string) => {
    window.open(`/api/admin/reports?format=csv&category=${cat}`, "_blank");
  };

  if (isLoading || !reportData) {
    return (
      <div className="py-16 text-center text-xs text-slate-500">
        Aggregating multi-department clinical &amp; financial reports...
      </div>
    );
  }

  const appts = reportData.appointments || {};
  const fin = reportData.finance || {};
  const pats = reportData.patients || {};
  const docs = reportData.doctors || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Hospital Analytics &amp; Statutory Reports</h2>
          <p className="text-xs text-slate-500">
            Real-time clinical throughput, financial reconciliations, patient demographics, and CSV export
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownloadCsv(activeCategory)}
            className="text-xs font-bold"
          >
            <Download className="w-3.5 h-3.5 mr-1 text-hospital-700" />
            <span>Export {activeCategory.toUpperCase()} CSV</span>
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveCategory("appointments")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            activeCategory === "appointments"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          Appointments &amp; OPD
        </button>
        <button
          onClick={() => setActiveCategory("finance")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            activeCategory === "finance"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          Revenue &amp; Collections
        </button>
        <button
          onClick={() => setActiveCategory("patients")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            activeCategory === "patients"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          Patient Demographics
        </button>
        <button
          onClick={() => setActiveCategory("doctors")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            activeCategory === "doctors"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          Physician Productivity
        </button>
      </div>

      {/* Tab 1: Appointments Report */}
      {activeCategory === "appointments" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-bold block">TOTAL BOOKINGS</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{appts.total ?? 0}</span>
              <span className="text-[10px] text-slate-400">All Consultations</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-emerald-600 font-bold block">COMPLETED SESSIONS</span>
              <span className="text-xl font-black text-emerald-700 mt-1 block">{appts.completed ?? 0}</span>
              <span className="text-[10px] text-emerald-600 font-semibold">{appts.completionRate} Rate</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-rose-600 font-bold block">CANCELLED SESSIONS</span>
              <span className="text-xl font-black text-rose-700 mt-1 block">{appts.cancelled ?? 0}</span>
              <span className="text-[10px] text-slate-400">Patient or Doctor Request</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-sky-600 font-bold block">UPCOMING ACTIVE</span>
              <span className="text-xl font-black text-sky-700 mt-1 block">{appts.confirmed ?? 0}</span>
              <span className="text-[10px] text-slate-400">Pending Review</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-slate-800">Weekly Appointment Distribution</h3>
            <div className="h-36 flex items-end justify-between gap-3 pt-4 px-4">
              {(appts.byDay || []).map((d: any) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-500">{d.count}</span>
                  <div className="w-full bg-slate-100 rounded-t-lg h-24 flex items-end">
                    <div
                      style={{ height: `${Math.min(100, (d.count / 80) * 100)}%` }}
                      className="w-full bg-hospital-600 rounded-t-lg"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Finance Report */}
      {activeCategory === "finance" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-bold block">GROSS COLLECTIONS</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {fin.totalRevenueFormatted || "₹ 0"}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">
                {fin.paidInvoicesCount ?? 0} Invoices Settled
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-amber-600 font-bold block">AVERAGE INVOICE VALUE</span>
              <span className="text-2xl font-black text-amber-700 mt-1 block">
                ₹{Number(fin.averageBillValue || 0).toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-slate-400">Per Patient Encounter</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-rose-600 font-bold block">PENDING INVOICES</span>
              <span className="text-2xl font-black text-rose-700 mt-1 block">
                {fin.pendingInvoicesCount ?? 0}
              </span>
              <span className="text-[10px] text-rose-600 font-semibold">Under TPA / Counter Review</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Patients Report */}
      {activeCategory === "patients" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-bold block">TOTAL REGISTERED PATIENTS</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{pats.total ?? 0}</span>
              <span className="text-[10px] text-slate-400">With Unique UHID</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-hospital-700 font-bold block">GENDER RATIO</span>
              <div className="text-sm font-bold text-slate-800 mt-2 space-y-1">
                <div>Male: {pats.genderDistribution?.male ?? 0}</div>
                <div>Female: {pats.genderDistribution?.female ?? 0}</div>
                <div>Other: {pats.genderDistribution?.other ?? 0}</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-emerald-600 font-bold block">NEW PATIENT REGISTRATIONS</span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">
                {pats.newRegistrationsThisWeek ?? 0}
              </span>
              <span className="text-[10px] text-slate-400">Past 7 Days</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Doctor Productivity */}
      {activeCategory === "doctors" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Doctor Name</th>
                  <th className="py-2.5 px-4">Specialization</th>
                  <th className="py-2.5 px-4">Total Appointments</th>
                  <th className="py-2.5 px-4">Completed Consultations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {docs.map((d: any) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{d.name}</td>
                    <td className="py-3 px-4 text-slate-600">{d.specialization}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{d.appointmentsCount}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">{d.completedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
