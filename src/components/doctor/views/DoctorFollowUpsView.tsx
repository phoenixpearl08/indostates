"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Search,
  RefreshCw,
  Phone,
  FileText,
  CalendarPlus,
} from "lucide-react";
import { Doctor } from "@/data/hospitalData";
import { DoctorFollowUpRecord } from "@/lib/doctorService";

interface DoctorFollowUpsViewProps {
  doctor: Doctor;
  onOpenPatientProfile: (patientId: string) => void;
}

export function DoctorFollowUpsView({
  doctor,
  onOpenPatientProfile,
}: DoctorFollowUpsViewProps) {
  const [followUps, setFollowUps] = useState<DoctorFollowUpRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPeriod, setFilterPeriod] = useState<"all" | "today" | "upcoming">("all");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadFollowUps();
  }, [filterPeriod]);

  const loadFollowUps = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = filterPeriod === "today"
        ? "/api/doctor/follow-ups?due=today"
        : "/api/doctor/follow-ups";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load follow-up records");
      const data = await res.json();
      setFollowUps(data.followUps || []);
    } catch (err: any) {
      console.error("Follow-ups error:", err);
      setError(err.message || "Failed to load follow-ups");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteFollowUp = async (id: string) => {
    try {
      const res = await fetch("/api/doctor/follow-ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete", followUpId: id }),
      });
      if (!res.ok) throw new Error("Failed to mark follow-up completed");
      setSuccessMsg("Follow-up marked as completed.");
      loadFollowUps();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to complete follow-up");
    }
  };

  const filtered = followUps.filter((f) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.patientName.toLowerCase().includes(q) ||
      f.patientUhid.toLowerCase().includes(q) ||
      f.clinicalReason.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-hospital-600" />
              Patient Follow-Up & Review Tracker
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Scheduled clinical reviews advised during previous OPD consultations for Dr. {doctor.name}.
            </p>
          </div>

          <button
            onClick={loadFollowUps}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors self-start sm:self-auto"
            title="Refresh follow-ups"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Success / Error alerts */}
        {successMsg && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Filters */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Patient Name, UHID, or Clinical Reason..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterPeriod}
              onChange={(e: any) => setFilterPeriod(e.target.value)}
              className="py-2 px-3 rounded-xl border border-slate-200 text-xs bg-white font-medium"
            >
              <option value="all">All Follow-ups</option>
              <option value="today">Due Today</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </div>
      </div>

      {/* Follow-ups Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-hospital-600 mb-2" />
            <span>Loading follow-up schedule...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No Pending Follow-ups</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No follow-ups due for the selected filter. When you assign review dates during consultations, they will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Due Date</th>
                  <th className="py-3 px-4 font-bold">Patient Details</th>
                  <th className="py-3 px-4 font-bold">Clinical Reason</th>
                  <th className="py-3 px-4 font-bold">Instructions</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((f) => {
                  const isPending = f.status === "pending";
                  const isToday = new Date(f.followUpDate).toDateString() === new Date().toDateString();

                  return (
                    <tr key={f.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className={`font-bold ${isToday ? "text-amber-700 font-extrabold" : "text-slate-900"}`}>
                          {new Date(f.followUpDate).toLocaleDateString()}
                        </div>
                        {isToday && (
                          <span className="text-[10px] font-bold text-amber-600 uppercase">
                            Due Today
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{f.patientName}</div>
                        <div className="font-mono text-[11px] text-slate-500">{f.patientUhid}</div>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-800">
                        {f.clinicalReason}
                      </td>

                      <td className="py-3 px-4 text-slate-600 max-w-xs">
                        {f.instructions || "Routine post-treatment review"}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            f.status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {f.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenPatientProfile(f.patientId)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                          >
                            Dossier
                          </button>

                          {isPending && (
                            <button
                              onClick={() => handleCompleteFollowUp(f.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition-colors"
                            >
                              Mark Seen
                            </button>
                          )}
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
    </div>
  );
}
