"use client";

import React, { useState } from "react";
import {
  Bed,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  UserX,
  X,
  LogOut,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DOCTORS } from "@/data/hospitalData";

interface BedsViewProps {
  beds: any[];
  admissions: any[];
  wards: any[];
  onRefresh: () => void;
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function BedsView({ beds, admissions, wards, onRefresh, onSetFeedback }: BedsViewProps) {
  const [selectedWard, setSelectedWard] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<any | null>(null);

  // Admit form
  const [admitUhid, setAdmitUhid] = useState("");
  const [admitDoctor, setAdmitDoctor] = useState(DOCTORS[0]?.id || "dr-rajesh-rangaswamy");
  const [admitWard, setAdmitWard] = useState(wards[0]?.id || "ward-gen-a");
  const [admitBed, setAdmitBed] = useState("");
  const [admitReason, setAdmitReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Discharge form
  const [dischargeSummary, setDischargeSummary] = useState("");

  const filteredBeds = beds.filter((b) => {
    const matchWard = selectedWard === "ALL" || b.wardId === selectedWard;
    const matchStatus = selectedStatus === "ALL" || b.status === selectedStatus;
    return matchWard && matchStatus;
  });

  const availableBedsForAdmit = beds.filter((b) => b.status === "AVAILABLE" && (!admitWard || b.wardId === admitWard));

  const handleStatusChange = async (bedId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/ipd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_bed_status", bedId, newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to update bed status." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error updating bed." });
    }
  };

  const handleAdmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admitUhid || !admitBed || !admitReason) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/ipd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "admit",
          patientUhid: admitUhid,
          doctorId: admitDoctor,
          wardId: admitWard,
          bedId: admitBed,
          admissionReason: admitReason,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        setShowAdmitModal(false);
        setAdmitUhid("");
        setAdmitReason("");
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to admit patient." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error processing admission." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDischarge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmission) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/ipd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "discharge",
          admissionId: selectedAdmission.id,
          dischargeSummary: dischargeSummary || "Discharged in stable condition.",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        setShowDischargeModal(false);
        setSelectedAdmission(null);
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to discharge patient." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error processing discharge." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.status === "OCCUPIED").length;
  const availableBeds = beds.filter((b) => b.status === "AVAILABLE").length;
  const maintenanceBeds = beds.filter((b) => b.status === "MAINTENANCE" || b.status === "CLEANING").length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Inpatient Bed &amp; Ward Command Center</h2>
          <p className="text-xs text-slate-500">
            Real-time ward occupancy, critical care ICU bed allocation, and inpatient discharge workflows
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAdmitModal(true)}
          className="text-xs font-bold"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Admit Patient to Bed</span>
        </Button>
      </div>

      {/* Bed Status Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Total Ward Beds</div>
          <div className="text-lg font-black text-slate-800 mt-1">{totalBeds} Beds</div>
          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Campus Capacity</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-emerald-600">Available Beds</div>
          <div className="text-lg font-black text-emerald-700 mt-1">{availableBeds} Ready</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Immediate Intake</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-rose-600">Occupied Beds</div>
          <div className="text-lg font-black text-rose-700 mt-1">{occupiedBeds} Inpatients</div>
          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
            {totalBeds > 0 ? `${Math.round((occupiedBeds / totalBeds) * 100)}% Occupancy` : "0%"}
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-amber-600">Maintenance &amp; Sanitation</div>
          <div className="text-lg font-black text-amber-700 mt-1">{maintenanceBeds} Units</div>
          <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Cleaning Turnaround</div>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="text-xs font-semibold text-slate-700 py-1.5 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none"
          >
            <option value="ALL">All Clinical Wards</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.floor})
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-semibold text-slate-700 py-1.5 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none"
          >
            <option value="ALL">All Bed Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="CLEANING">Cleaning</option>
          </select>
        </div>

        <span className="text-xs font-bold text-slate-500">{filteredBeds.length} Beds Displayed</span>
      </div>

      {/* Visual Ward Bed Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredBeds.map((bed) => {
          const isOccupied = bed.status === "OCCUPIED";
          const isAvailable = bed.status === "AVAILABLE";

          return (
            <div
              key={bed.id}
              className={`p-3.5 rounded-2xl border transition shadow-xs flex flex-col justify-between space-y-2 ${
                isOccupied
                  ? "bg-rose-50/60 border-rose-200"
                  : isAvailable
                  ? "bg-emerald-50/60 border-emerald-200"
                  : "bg-amber-50/60 border-amber-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs text-slate-900">{bed.bedNumber}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOccupied ? "bg-rose-500" : isAvailable ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                </div>
                <div className="text-[10px] text-slate-500 truncate font-semibold mt-0.5">
                  {bed.wardName || "General Ward"}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">{bed.roomNumber}</div>

                {isOccupied && (
                  <div className="mt-2 pt-2 border-t border-rose-200/80 text-[11px]">
                    <div className="font-bold text-slate-900 truncate">
                      {bed.currentPatientName || "Inpatient"}
                    </div>
                    <div className="text-[10px] font-mono text-rose-700 truncate">
                      {bed.currentPatientUhid}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Action Menu */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                <select
                  value={bed.status}
                  onChange={(e) => handleStatusChange(bed.id, e.target.value)}
                  className="w-full text-[10px] font-bold py-1 px-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="CLEANING">CLEANING</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Admissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mt-6">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-800">Active Inpatient Admissions</h3>
          <span className="text-[11px] font-bold text-slate-500">
            {admissions.filter((a) => a.status === "ADMITTED").length} Patients in Wards
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Admission ID</th>
                <th className="py-2.5 px-4">Patient Name &amp; UHID</th>
                <th className="py-2.5 px-4">Ward &amp; Bed</th>
                <th className="py-2.5 px-4">Attending Doctor</th>
                <th className="py-2.5 px-4">Admission Reason</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admissions.filter((a) => a.status === "ADMITTED").map((adm) => (
                <tr key={adm.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-hospital-800">{adm.admissionNumber}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{adm.patientName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{adm.patientUhid}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {adm.wardName} • Bed {adm.bedNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-700">{adm.doctorName}</td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-xs">{adm.admissionReason}</td>
                  <td className="py-3 px-4 text-slate-500">{adm.admissionDate}</td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAdmission(adm);
                        setShowDischargeModal(true);
                      }}
                      className="text-[11px] h-7 px-2.5"
                    >
                      <LogOut className="w-3 h-3 mr-1" />
                      <span>Discharge</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admit Patient Modal */}
      {showAdmitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Inpatient Bed Admission</h3>
              </div>
              <button
                onClick={() => setShowAdmitModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient UHID *</label>
                <input
                  type="text"
                  required
                  placeholder="IND-UHID-XXXXXX"
                  value={admitUhid}
                  onChange={(e) => setAdmitUhid(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Attending Physician *</label>
                <select
                  value={admitDoctor}
                  onChange={(e) => setAdmitDoctor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                >
                  {DOCTORS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Ward</label>
                  <select
                    value={admitWard}
                    onChange={(e) => setAdmitWard(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                  >
                    {wards.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Available Bed *</label>
                  <select
                    required
                    value={admitBed}
                    onChange={(e) => setAdmitBed(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                  >
                    <option value="">Select Bed</option>
                    {availableBedsForAdmit.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bedNumber} ({b.roomNumber})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Admission Indication / Reason *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Acute cerebral infarction stabilization, continuous hemodynamic monitoring"
                  value={admitReason}
                  onChange={(e) => setAdmitReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowAdmitModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Allocating..." : "Confirm Inpatient Admission"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discharge Modal */}
      {showDischargeModal && selectedAdmission && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Discharge Inpatient</h3>
                <span className="text-xs text-amber-400">{selectedAdmission.patientName}</span>
              </div>
              <button
                onClick={() => setShowDischargeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDischarge} className="p-5 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Approve inpatient discharge from <strong>{selectedAdmission.wardName}</strong> (Bed{" "}
                <strong>{selectedAdmission.bedNumber}</strong>). This will free the assigned bed for sanitation.
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Discharge Clinical Summary</label>
                <textarea
                  rows={3}
                  value={dischargeSummary}
                  onChange={(e) => setDischargeSummary(e.target.value)}
                  placeholder="Patient vitals stable, recovered satisfactorily, follow-up OPD review in 7 days."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowDischargeModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Discharging..." : "Authorize Discharge"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
