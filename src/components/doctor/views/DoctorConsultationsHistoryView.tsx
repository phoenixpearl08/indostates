"use client";

import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Search,
  Calendar,
  FileText,
  Printer,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  Pill,
  FlaskConical,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Doctor } from "@/data/hospitalData";
import { ConsultationRecord } from "@/lib/doctorService";

interface DoctorConsultationsHistoryViewProps {
  doctor: Doctor;
  onOpenPatientProfile: (patientId: string) => void;
  onOpenPrintPrescription: (prescriptionData: any) => void;
}

export function DoctorConsultationsHistoryView({
  doctor,
  onOpenPatientProfile,
  onOpenPrintPrescription,
}: DoctorConsultationsHistoryViewProps) {
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "draft">("all");
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRecord | null>(null);

  useEffect(() => {
    loadConsultations();
  }, [statusFilter]);

  const loadConsultations = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = statusFilter === "all"
        ? "/api/doctor/consultations"
        : `/api/doctor/consultations?status=${statusFilter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load consultation records");
      const data = await res.json();
      setConsultations(data.consultations || []);
    } catch (err: any) {
      console.error("Consultations fetch error:", err);
      setError(err.message || "Failed to load consultations");
    } finally {
      setLoading(false);
    }
  };

  const filteredConsultations = consultations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.patientName.toLowerCase().includes(q) ||
      c.patientUhid.toLowerCase().includes(q) ||
      c.diagnosis.toLowerCase().includes(q)
    );
  });

  const handlePrint = (c: ConsultationRecord) => {
    if (!c.prescriptions || c.prescriptions.length === 0) return;
    const printableData = {
      id: c.prescriptionId || c.id,
      rxNumber: `RX-${new Date(c.createdAt).getFullYear()}-${c.id.slice(-4).toUpperCase()}`,
      patientName: c.patientName,
      patientUhid: c.patientUhid,
      patientAge: 35, // default if not on encounter
      patientGender: "Patient",
      doctorName: c.doctorName,
      doctorQualification: doctor.qualification,
      doctorRegNo: doctor.licenseNumber || "KMC-48291",
      doctorDepartment: c.department,
      date: c.createdAt,
      diagnosis: c.diagnosis,
      vitals: c.vitals,
      medicines: c.prescriptions,
      followUpDate: c.followUpDate || undefined,
      followUpInstructions: c.followUpInstructions || undefined,
    };
    onOpenPrintPrescription(printableData);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-hospital-600" />
              Clinical Consultation History
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Complete historical record of patient consultations, diagnoses, and prescriptions recorded by Dr. {doctor.name}.
            </p>
          </div>

          <button
            onClick={loadConsultations}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors self-start sm:self-auto"
            title="Refresh consultations"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Patient Name, UHID, or Diagnosis..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="py-2 px-3 rounded-xl border border-slate-200 text-xs bg-white font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table or Empty State */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-hospital-600 mb-2" />
            <span>Loading consultation history...</span>
          </div>
        ) : filteredConsultations.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No Consultations Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No clinical consultations match your active filters. Once you finalize patient consultations in the workspace, they will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Date & Time</th>
                  <th className="py-3 px-4 font-bold">Patient Details</th>
                  <th className="py-3 px-4 font-bold">Clinical Diagnosis</th>
                  <th className="py-3 px-4 font-bold">Prescriptions</th>
                  <th className="py-3 px-4 font-bold">Investigations</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredConsultations.map((c) => {
                  const hasPrescription = c.prescriptions && c.prescriptions.length > 0;
                  const hasLab = c.labOrders && c.labOrders.length > 0;

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{c.patientName}</div>
                        <div className="font-mono text-[11px] text-hospital-700 font-semibold">
                          {c.patientUhid}
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-slate-800 line-clamp-1">
                          {c.diagnosis || "Undiagnosed"}
                        </div>
                        {c.chiefComplaint && (
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            CC: {c.chiefComplaint}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {hasPrescription ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Pill className="w-3 h-3" />
                            {c.prescriptions?.length || 0} Meds
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">None</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {hasLab ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                            <FlaskConical className="w-3 h-3" />
                            {c.labOrders?.length || 0} Tests
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">None</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            c.status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {c.status === "completed" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {c.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {hasPrescription && (
                            <button
                              onClick={() => handlePrint(c)}
                              className="p-1.5 rounded-lg text-hospital-700 hover:bg-hospital-50 border border-transparent hover:border-hospital-200 transition-colors"
                              title="Print Digital Prescription"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedConsultation(c)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Consultation Summary Modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Consultation Summary — {selectedConsultation.patientName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="font-mono text-hospital-700 font-bold">
                    {selectedConsultation.patientUhid}
                  </span>
                  <span>•</span>
                  <span>{new Date(selectedConsultation.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedConsultation(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="font-bold text-slate-700 mb-1">Chief Complaint</div>
                <div className="text-slate-900">{selectedConsultation.chiefComplaint || "None recorded"}</div>
              </div>

              <div className="p-3 bg-hospital-50/50 rounded-xl border border-hospital-100">
                <div className="font-bold text-hospital-800 mb-1">Clinical Diagnosis</div>
                <div className="font-bold text-slate-900 text-sm">{selectedConsultation.diagnosis}</div>
                {selectedConsultation.icd10Code && (
                  <div className="text-[11px] font-mono text-hospital-700 mt-1">
                    ICD-10: {selectedConsultation.icd10Code}
                  </div>
                )}
              </div>

              {selectedConsultation.treatmentPlan && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-700 mb-1">Treatment Plan & Advice</div>
                  <div className="text-slate-900">{selectedConsultation.treatmentPlan}</div>
                </div>
              )}

              {selectedConsultation.prescriptions && selectedConsultation.prescriptions.length > 0 && (
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-800">Prescribed Medications:</div>
                  <div className="space-y-1">
                    {selectedConsultation.prescriptions.map((m, i) => (
                      <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900">{m.medicine} ({m.dosage})</span>
                        <span className="font-mono font-bold text-hospital-700">{m.frequency} • {m.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedConsultation.followUpDate && (
                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-800">
                  <strong>Follow-up scheduled: </strong>
                  {new Date(selectedConsultation.followUpDate).toLocaleDateString()}
                  {selectedConsultation.followUpInstructions && ` — ${selectedConsultation.followUpInstructions}`}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  onOpenPatientProfile(selectedConsultation.patientId);
                  setSelectedConsultation(null);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Open Full Dossier
              </button>

              <button
                onClick={() => setSelectedConsultation(null)}
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
