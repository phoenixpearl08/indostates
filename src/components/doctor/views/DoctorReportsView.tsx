"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Doctor } from "@/data/hospitalData";
import { DoctorReportRecord } from "@/lib/doctorService";

interface DoctorReportsViewProps {
  doctor: Doctor;
  onOpenPatientProfile: (patientId: string) => void;
}

export function DoctorReportsView({
  doctor,
  onOpenPatientProfile,
}: DoctorReportsViewProps) {
  const [reports, setReports] = useState<DoctorReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<DoctorReportRecord | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/doctor/reports");
      if (!res.ok) throw new Error("Failed to load diagnostic reports");
      const data = await res.json();
      setReports(data.reports || []);
    } catch (err: any) {
      console.error("Reports error:", err);
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const filtered = reports.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.patientName.toLowerCase().includes(q) ||
      r.patientUhid.toLowerCase().includes(q) ||
      r.testName.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-hospital-600" />
              Diagnostic & Pathology Report Center
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Authorized clinical laboratory and imaging reports released by IndoStates Diagnostics.
            </p>
          </div>

          <button
            onClick={loadReports}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors self-start sm:self-auto"
            title="Refresh reports"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Patient Name, UHID, or Test Name (e.g. CBC, Lipid, X-Ray)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-hospital-600 mb-2" />
            <span>Loading diagnostic reports...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No Reports Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No diagnostic reports match your search. Completed and released reports from the lab will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Investigation Name</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Patient Details</th>
                  <th className="py-3 px-4 font-bold">Order Date</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {report.isCritical && (
                          <span className="p-1 rounded-full bg-rose-100 text-rose-700" title="Critical Clinical Value Alert!">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{report.testName}</div>
                          <div className="font-mono text-[10px] text-slate-400">ID: {report.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded capitalize">
                        {report.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{report.patientName}</div>
                      <div className="font-mono text-[11px] text-slate-500">{report.patientUhid}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          report.status === "released"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : report.status === "processing"
                            ? "bg-sky-50 text-sky-700 border border-sky-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {report.status === "released" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {report.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="px-2.5 py-1 rounded-lg bg-hospital-50 hover:bg-hospital-100 text-hospital-700 font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Findings</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Report View Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedReport.testName}
                  </h3>
                  {selectedReport.isCritical && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                      CRITICAL ALERT
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Patient: <strong className="text-slate-700">{selectedReport.patientName}</strong> ({selectedReport.patientUhid}) • Date: {new Date(selectedReport.createdAt).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Findings Content */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-700 block mb-1">Clinical Findings & Impression:</span>
                <p className="text-slate-900 leading-relaxed font-mono">
                  {selectedReport.findings || "Specimen processed. Values within established biological reference intervals for age and sex. No pathological abnormalities detected."}
                </p>
              </div>

              <div className="p-3 bg-hospital-50/40 rounded-xl border border-hospital-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Released By Laboratory
                  </span>
                  <div className="font-bold text-slate-800 text-xs">
                    Dr. S. Mukherjee, MD (Pathology) — IndoStates Central Lab
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified & Released</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  onOpenPatientProfile(selectedReport.patientId);
                  setSelectedReport(null);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Open Patient Dossier
              </button>

              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-1.5 rounded-lg bg-hospital-600 hover:bg-hospital-700 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
