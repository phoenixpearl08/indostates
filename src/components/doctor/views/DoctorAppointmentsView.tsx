"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Stethoscope,
  RefreshCw,
  Phone,
  Filter,
} from "lucide-react";
import { Doctor } from "@/data/hospitalData";
import { QueueEntry } from "@/types/hms";

interface DoctorAppointmentsViewProps {
  doctor: Doctor;
  onOpenPatientProfile: (patientId: string) => void;
  onStartConsultationForPatient: (patient: QueueEntry) => void;
}

export function DoctorAppointmentsView({
  doctor,
  onOpenPatientProfile,
  onStartConsultationForPatient,
}: DoctorAppointmentsViewProps) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "completed" | "cancelled">("today");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadAppointments();
  }, [activeTab]);

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Reuses appointment/queue data from doctor queue API
      const res = await fetch(`/api/doctor/queue`);
      if (!res.ok) throw new Error("Failed to load appointments");
      const data = await res.json();
      const allTokens: QueueEntry[] = data.queue || [];

      // Categorize tokens into appointments structure
      const formatted = allTokens.map((t) => ({
        id: t.appointmentId || t.id,
        queueEntryId: t.id,
        tokenNumber: t.tokenNumber,
        patientId: t.patientId,
        patientName: t.patientName,
        patientUhid: t.patientUhid,
        patientAge: t.patientAge,
        patientGender: t.patientGender,
        appointmentType: t.appointmentType || "opd",
        appointmentTime: t.appointmentTime || "10:00 AM",
        status: t.status, // waiting, called, in_consultation, completed, cancelled, no_show
        priority: t.priority,
        triageNotes: t.triageNotes,
        rawEntry: t,
      }));

      setAppointments(formatted);
    } catch (err: any) {
      console.error("Appointments fetch error:", err);
      setError(err.message || "Failed to load doctor appointments");
    } finally {
      setLoading(false);
    }
  };

  const filtered = appointments.filter((apt) => {
    // Tab filter
    if (activeTab === "today") {
      if (apt.status === "completed" || apt.status === "cancelled") return false;
    } else if (activeTab === "completed") {
      if (apt.status !== "completed") return false;
    } else if (activeTab === "cancelled") {
      if (apt.status !== "cancelled" && apt.status !== "no_show") return false;
    }

    // Search query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      apt.patientName.toLowerCase().includes(q) ||
      apt.patientUhid.toLowerCase().includes(q) ||
      apt.tokenNumber.toString().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-hospital-600" />
              Doctor OPD Appointments & Schedule
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Real-time schedule of verified hospital appointments for Dr. {doctor.name} ({doctor.department}).
            </p>
          </div>

          <button
            onClick={loadAppointments}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors self-start sm:self-auto"
            title="Refresh appointments"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="mt-4 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("today")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === "today"
                ? "bg-hospital-700 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Active & Waiting OPD
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === "completed"
                ? "bg-hospital-700 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Completed Consultations
          </button>

          <button
            onClick={() => setActiveTab("cancelled")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === "cancelled"
                ? "bg-hospital-700 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Cancelled / No-Show
          </button>
        </div>

        {/* Search */}
        <div className="mt-3 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search appointments by Patient name, UHID, or Token #..."
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

      {/* Appointment Cards / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-hospital-600 mb-2" />
            <span>Loading appointments...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No Appointments Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No appointments match the selected filter. Appointments booked via Reception or Patient Portal will reflect here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Token</th>
                  <th className="py-3 px-4 font-bold">Patient Details</th>
                  <th className="py-3 px-4 font-bold">Time Slot</th>
                  <th className="py-3 px-4 font-bold">Type</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-8 h-8 rounded-lg bg-hospital-50 border border-hospital-200 text-hospital-700 font-bold flex items-center justify-center text-xs">
                        #{apt.tokenNumber}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{apt.patientName}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-mono text-hospital-700 font-semibold">{apt.patientUhid}</span>
                        <span>•</span>
                        <span>{apt.patientGender}, {apt.patientAge}y</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-700">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.appointmentTime}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 capitalize">
                        {apt.appointmentType}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          apt.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : apt.status === "in_consultation"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : apt.status === "called"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : apt.status === "cancelled" || apt.status === "no_show"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-sky-50 text-sky-700 border border-sky-200"
                        }`}
                      >
                        {apt.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenPatientProfile(apt.patientId)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                        >
                          Dossier
                        </button>

                        {apt.status !== "completed" && apt.status !== "cancelled" && (
                          <button
                            onClick={() => onStartConsultationForPatient(apt.rawEntry)}
                            className="px-3 py-1 rounded-lg bg-hospital-600 hover:bg-hospital-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                          >
                            <Stethoscope className="w-3 h-3" />
                            <span>Consult</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
