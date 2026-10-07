"use client";

import React, { useState, useEffect } from "react";
import {
  Pill,
  Search,
  Printer,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  RefreshCw,
  Building2,
} from "lucide-react";
import { Doctor } from "@/data/hospitalData";
import { DoctorPrescriptionRecord } from "@/lib/doctorService";

interface DoctorPrescriptionsViewProps {
  doctor: Doctor;
  onOpenPatientProfile: (patientId: string) => void;
  onOpenPrintPrescription: (prescriptionData: any) => void;
}

export function DoctorPrescriptionsView({
  doctor,
  onOpenPatientProfile,
  onOpenPrintPrescription,
}: DoctorPrescriptionsViewProps) {
  const [prescriptions, setPrescriptions] = useState<DoctorPrescriptionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRx, setSelectedRx] = useState<DoctorPrescriptionRecord | null>(null);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/doctor/prescriptions");
      if (!res.ok) throw new Error("Failed to load prescriptions");
      const data = await res.json();
      setPrescriptions(data.prescriptions || []);
    } catch (err: any) {
      console.error("Prescriptions fetch error:", err);
      setError(err.message || "Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const filtered = prescriptions.filter((rx) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      rx.patientName.toLowerCase().includes(q) ||
      rx.patientUhid.toLowerCase().includes(q) ||
      rx.rxNumber.toLowerCase().includes(q)
    );
  });

  const handlePrintClick = (rx: DoctorPrescriptionRecord) => {
    const printableData = {
      id: rx.id,
      rxNumber: rx.rxNumber,
      patientName: rx.patientName,
      patientUhid: rx.patientUhid,
      patientAge: 40,
      patientGender: "Patient",
      doctorName: rx.doctorName,
      doctorQualification: doctor.qualification,
      doctorRegNo: doctor.licenseNumber || "KMC-48291",
      doctorDepartment: doctor.department,
      date: rx.createdAt,
      diagnosis: rx.diagnosis || "Clinical Management",
      medicines: rx.medicines,
      followUpDate: rx.followUpDate || undefined,
      followUpInstructions: rx.followUpInstructions || undefined,
    };
    onOpenPrintPrescription(printableData);
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <Pill className="w-5 h-5 text-hospital-600" />
              Doctor Digital Prescriptions (Rx)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Authorized digital prescriptions directly dispatched to IndoStates Central Pharmacy and Patient Portal.
            </p>
          </div>

          <button
            onClick={loadPrescriptions}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors self-start sm:self-auto"
            title="Refresh prescriptions"
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
            placeholder="Search by Rx Number, Patient Name, or UHID..."
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

      {/* Prescriptions List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-hospital-600 mb-2" />
            <span>Loading prescription records...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Pill className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No Prescriptions Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No prescriptions recorded yet. Digital prescriptions created during consultation will appear here immediately.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Rx # & Date</th>
                  <th className="py-3 px-4 font-bold">Patient Details</th>
                  <th className="py-3 px-4 font-bold">Diagnosis</th>
                  <th className="py-3 px-4 font-bold">Medications Summary</th>
                  <th className="py-3 px-4 font-bold">Pharmacy Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((rx) => (
                  <tr key={rx.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-hospital-800">{rx.rxNumber}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(rx.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{rx.patientName}</div>
                      <div className="font-mono text-[11px] text-slate-500">{rx.patientUhid}</div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-800 line-clamp-1">
                        {rx.diagnosis || "Routine prescription"}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-sm">
                      <div className="flex flex-wrap gap-1">
                        {rx.medicines.slice(0, 3).map((m: any, idx: number) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-200"
                          >
                            {m.medicine}
                          </span>
                        ))}
                        {rx.medicines.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-semibold self-center">
                            +{rx.medicines.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          rx.status === "dispensed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {rx.status === "dispensed" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {rx.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handlePrintClick(rx)}
                          className="p-1.5 rounded-lg text-hospital-700 hover:bg-hospital-50 border border-transparent hover:border-hospital-200 transition-colors"
                          title="Print Official Prescription"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setSelectedRx(rx)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                        >
                          View
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

      {/* Prescription Details Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Prescription Details — {selectedRx.rxNumber}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Patient: <strong className="text-slate-700">{selectedRx.patientName}</strong> ({selectedRx.patientUhid})
                </div>
              </div>
              <button
                onClick={() => setSelectedRx(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-2 font-bold">Medicine</th>
                      <th className="p-2 font-bold">Dosage</th>
                      <th className="p-2 font-bold">Frequency</th>
                      <th className="p-2 font-bold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedRx.medicines.map((m: any, i: number) => (
                      <tr key={i}>
                        <td className="p-2 font-bold text-slate-900">{m.medicine}</td>
                        <td className="p-2 text-slate-700">{m.dosage}</td>
                        <td className="p-2 font-mono font-bold text-hospital-700">{m.frequency}</td>
                        <td className="p-2 text-slate-700">{m.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedRx.notes && (
                <div className="p-2.5 bg-slate-50 rounded-lg text-slate-600">
                  <strong>Advice: </strong> {selectedRx.notes}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  handlePrintClick(selectedRx);
                  setSelectedRx(null);
                }}
                className="px-4 py-2 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Rx</span>
              </button>

              <button
                onClick={() => setSelectedRx(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
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
