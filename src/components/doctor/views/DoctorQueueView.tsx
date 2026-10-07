"use client";

import React, { useState } from "react";
import {
  Users,
  Clock,
  CheckCircle2,
  Stethoscope,
  Volume2,
  Play,
  User,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { QueueEntry, UserRole } from "@/types/hms";
import { EmptyState } from "@/components/ui/EmptyState";

interface DoctorQueueViewProps {
  queues: QueueEntry[];
  onRefresh: () => void;
  onCallPatient: (entry: QueueEntry) => void;
  onStartConsultation: (entry: QueueEntry) => void;
  onViewPatientSummary: (uhid: string) => void;
  onCompleteQueue: (entry: QueueEntry) => void;
}

export function DoctorQueueView({
  queues,
  onRefresh,
  onCallPatient,
  onStartConsultation,
  onViewPatientSummary,
  onCompleteQueue,
}: DoctorQueueViewProps) {
  const [filterStatus, setFilterStatus] = useState<"all" | "waiting" | "called" | "in_consultation" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = queues.filter((q) => {
    const matchesStatus = filterStatus === "all" || q.status === filterStatus;
    const matchesSearch =
      !searchQuery.trim() ||
      q.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.patientUhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_consultation":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 animate-pulse">In Consultation</span>;
      case "called":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800">Called In</span>;
      case "waiting":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800">Waiting</span>;
      case "completed":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">Completed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header with Title & Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-hospital-700" />
            <span>Today's Outpatient Department (OPD) Queue</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time patient queue generated from Front Office Reception check-ins and QR code verifications.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Status Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "all", label: "All Queue", count: queues.length },
            { id: "waiting", label: "Waiting", count: queues.filter((q) => q.status === "waiting").length },
            { id: "called", label: "Called", count: queues.filter((q) => q.status === "called").length },
            { id: "in_consultation", label: "In Consultation", count: queues.filter((q) => q.status === "in_consultation").length },
            { id: "completed", label: "Completed", count: queues.filter((q) => q.status === "completed").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === tab.id
                  ? "bg-hospital-700 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label} <span className="opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, UHID or token..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hospital-500 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Queue Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No patients in queue matching criteria"
          description={
            queues.length === 0
              ? "Patients who check in at Reception or verify digital passes will automatically appear in this list."
              : "Try switching status filters or clearing your search term."
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Token</th>
                  <th className="py-3 px-4">Patient Name & UHID</th>
                  <th className="py-3 px-4">Check-In Time</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Clinical Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      item.status === "in_consultation" ? "bg-emerald-50/40" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-hospital-900 font-black text-xs">
                        {item.tokenNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.patientName}</div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        UHID: {item.patientUhid}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {new Date(item.checkInTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          item.priority === "urgent"
                            ? "bg-rose-100 text-rose-800"
                            : item.priority === "senior"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* Call Patient Button */}
                        {item.status === "waiting" && (
                          <button
                            onClick={() => onCallPatient(item)}
                            className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] flex items-center gap-1 transition-colors"
                            title="Call Patient to OPD Room"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </button>
                        )}

                        {/* Start Consultation Button */}
                        {(item.status === "waiting" || item.status === "called") && (
                          <button
                            onClick={() => onStartConsultation(item)}
                            className="px-3 py-1 rounded-md bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-colors"
                            title="Open Consultation Desk"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>Start Consult</span>
                          </button>
                        )}

                        {/* If in consultation, allow finishing */}
                        {item.status === "in_consultation" && (
                          <button
                            onClick={() => onStartConsultation(item)}
                            className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <span>Resume Consult</span>
                          </button>
                        )}

                        {/* View Patient Clinical Profile */}
                        <button
                          onClick={() => onViewPatientSummary(item.patientUhid)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="View Clinical Profile & Timeline"
                        >
                          <User className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
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
