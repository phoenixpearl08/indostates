"use client";

import React, { useState } from "react";
import {
  Siren,
  Truck,
  AlertTriangle,
  User,
  Clock,
  CheckCircle2,
  Stethoscope,
  Send,
  X,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmergencyViewProps {
  emergencyData: any;
  onRefresh: () => void;
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function EmergencyView({ emergencyData, onRefresh, onSetFeedback }: EmergencyViewProps) {
  const cases = emergencyData?.cases || [];
  const ambulances = emergencyData?.ambulances || [];
  const summary = emergencyData?.summary || {};

  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);

  // Dispatch form
  const [selectedAmbulance, setSelectedAmbulance] = useState(ambulances[0]?.id || "");
  const [pickupLocation, setPickupLocation] = useState("");
  const [callerPhone, setCallerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Case update form
  const [newTriage, setNewTriage] = useState("RED");
  const [newStatus, setNewStatus] = useState("IN_TREATMENT");

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmbulance || !pickupLocation) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "dispatch_ambulance",
          ambulanceId: selectedAmbulance,
          pickupLocation,
          callerPhone,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        setShowDispatchModal(false);
        setPickupLocation("");
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to dispatch ambulance." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error dispatching ambulance." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_case",
          caseId: selectedCase.id,
          updates: {
            triagePriority: newTriage,
            status: newStatus,
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        setShowCaseModal(false);
        setSelectedCase(null);
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to update emergency case." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error updating case." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">24/7 Acute Trauma &amp; Emergency Command Center</h2>
          <p className="text-xs text-slate-500">
            Real-time trauma triage, emergency resuscitation bays, and ALS/BLS ambulance fleet management
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowDispatchModal(true)}
          className="text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
        >
          <Truck className="w-3.5 h-3.5 mr-1" />
          <span>Dispatch Ambulance</span>
        </Button>
      </div>

      {/* Triage Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl shadow-xs">
          <div className="text-[11px] font-bold text-rose-700 uppercase">RED Triage (Immediate)</div>
          <div className="text-2xl font-black text-rose-900 mt-1">{summary.redTriage ?? 0} Cases</div>
          <div className="text-[10px] text-rose-700 mt-0.5 font-semibold">Resuscitation Required</div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl shadow-xs">
          <div className="text-[11px] font-bold text-amber-700 uppercase">YELLOW Triage (Urgent)</div>
          <div className="text-2xl font-black text-amber-900 mt-1">{summary.yellowTriage ?? 0} Cases</div>
          <div className="text-[10px] text-amber-700 mt-0.5 font-semibold">Under Acute Stabilization</div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl shadow-xs">
          <div className="text-[11px] font-bold text-emerald-700 uppercase">GREEN Triage (Standard)</div>
          <div className="text-2xl font-black text-emerald-900 mt-1">{summary.greenTriage ?? 0} Cases</div>
          <div className="text-[10px] text-emerald-700 mt-0.5 font-semibold">Non-Critical Observation</div>
        </div>

        <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xs">
          <div className="text-[11px] font-bold text-amber-400 uppercase">Ambulance Fleet Status</div>
          <div className="text-2xl font-black text-white mt-1">
            {summary.ambulancesAvailable ?? 2} Ready / {summary.ambulancesDispatched ?? 1} En Route
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-semibold">Coimbatore &amp; Highway Radius</div>
        </div>
      </div>

      {/* Active Trauma Cases */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-800">Active Emergency Cases in Trauma Bays</h3>
          <span className="text-[11px] font-bold text-slate-500">{cases.length} Total Registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Case #</th>
                <th className="py-2.5 px-4">Patient</th>
                <th className="py-2.5 px-4">Triage Priority</th>
                <th className="py-2.5 px-4">Chief Complaint</th>
                <th className="py-2.5 px-4">Attending Team</th>
                <th className="py-2.5 px-4">ER Bay</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.length > 0 ? (
                cases.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-rose-800">{c.caseNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{c.patientName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {c.patientUhid || "Trauma Walk-in"} • {c.patientPhone || "N/A"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          c.triagePriority === "RED"
                            ? "bg-rose-600 text-white"
                            : c.triagePriority === "YELLOW"
                            ? "bg-amber-500 text-slate-950 font-bold"
                            : "bg-emerald-600 text-white"
                        }`}
                      >
                        {c.triagePriority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium max-w-xs truncate">
                      {c.chiefComplaint}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-semibold">{c.attendingDoctorName || "ER Lead"}</div>
                      <div className="text-[11px] text-slate-500">{c.attendingNurseName || "Trauma Nurse"}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {c.bedNumber || "Bay 1"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCase(c);
                          setNewTriage(c.triagePriority);
                          setNewStatus(c.status);
                          setShowCaseModal(true);
                        }}
                        className="text-[11px] h-7 px-2.5"
                      >
                        Update Triage
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                    No active trauma cases currently in emergency resuscitation.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ambulance Fleet Cards */}
      <div>
        <h3 className="font-bold text-xs text-slate-800 mb-3">Live Emergency Ambulance Fleet</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ambulances.map((amb: any) => {
            const isAvail = amb.status === "AVAILABLE";
            return (
              <div
                key={amb.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-hospital-700" />
                    <span className="font-mono font-black text-xs text-slate-900">{amb.vehicleNumber}</span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      isAvail
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {amb.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 font-medium">Type: {amb.vehicleType}</div>
                <div className="text-[11px] text-slate-500">
                  Driver: <span className="font-semibold text-slate-700">{amb.driverName}</span> (
                  {amb.driverPhone})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dispatch Ambulance Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-rose-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-sm text-white">Emergency Ambulance Dispatch</h3>
              </div>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatch} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Available Ambulance *</label>
                <select
                  value={selectedAmbulance}
                  onChange={(e) => setSelectedAmbulance(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                >
                  {ambulances.map((a: any) => (
                    <option key={a.id} value={a.id}>
                      {a.vehicleNumber} ({a.vehicleType} • {a.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Incident / Pickup Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Avinashi Road Flyover / KMCH Junction"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Caller / Attender Phone</label>
                <input
                  type="tel"
                  placeholder="+91 94430 00000"
                  value={callerPhone}
                  onChange={(e) => setCallerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  {isSubmitting ? "Dispatching..." : "Confirm Emergency Dispatch"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Case Modal */}
      {showCaseModal && selectedCase && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Update Triage Status</h3>
                <span className="text-xs text-amber-400 font-mono">{selectedCase.caseNumber}</span>
              </div>
              <button
                onClick={() => setShowCaseModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCase} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Triage Priority</label>
                <select
                  value={newTriage}
                  onChange={(e) => setNewTriage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                >
                  <option value="RED">RED - Immediate Resuscitation</option>
                  <option value="YELLOW">YELLOW - Urgent Intervention</option>
                  <option value="GREEN">GREEN - Non-Critical Observation</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                >
                  <option value="TRIAGE">TRIAGE</option>
                  <option value="IN_TREATMENT">IN_TREATMENT</option>
                  <option value="ADMITTED_IPD">ADMITTED_IPD</option>
                  <option value="DISCHARGED">DISCHARGED</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowCaseModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Trauma Record"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
