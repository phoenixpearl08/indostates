"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Building2,
  CheckCircle2,
  AlertCircle,
  Lock,
  Plus,
  Trash2,
  ShieldCheck,
  RefreshCw,
  Power,
  CalendarCheck,
  CalendarX,
  Send,
} from "lucide-react";
import { Doctor } from "@/data/hospitalData";
import { DoctorScheduleData } from "@/lib/doctorService";

interface DoctorScheduleViewProps {
  doctor: Doctor;
  onDutyStatusChanged?: (isOnDuty: boolean) => void;
}

export function DoctorScheduleView({
  doctor,
  onDutyStatusChanged,
}: DoctorScheduleViewProps) {
  const [scheduleData, setScheduleData] = useState<DoctorScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modals state
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Block slot form
  const [blockForm, setBlockForm] = useState({
    date: new Date().toISOString().split("T")[0],
    startTime: "02:00 PM",
    endTime: "03:00 PM",
    reason: "Clinical Grand Rounds / Academic Session",
  });

  // Leave request form
  const [leaveForm, setLeaveForm] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    reason: "Medical Conference / CME",
  });

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/doctor/schedule");
      if (!res.ok) throw new Error("Failed to load schedule");
      const data = await res.json();
      setScheduleData(data.schedule || null);
    } catch (err: any) {
      console.error("Schedule error:", err);
      setError(err.message || "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDuty = async () => {
    if (!scheduleData) return;
    const newStatus = !scheduleData.isOnDuty;
    try {
      const res = await fetch("/api/doctor/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_duty", isOnDuty: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to toggle duty status");
      setScheduleData({ ...scheduleData, isOnDuty: newStatus });
      onDutyStatusChanged?.(newStatus);
      setSuccessMsg(`Status updated: You are now marked as ${newStatus ? "ON DUTY" : "OFF DUTY"}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to change duty status");
    }
  };

  const handleBlockSlotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/doctor/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "block_slot", ...blockForm }),
      });
      if (!res.ok) throw new Error("Failed to block slot");
      setShowBlockModal(false);
      setSuccessMsg("OPD Slot successfully blocked. Patients cannot book this slot.");
      loadSchedule();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setError(err.message || "Failed to block slot");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/doctor/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_leave", ...leaveForm }),
      });
      if (!res.ok) throw new Error("Failed to submit leave request");
      setShowLeaveModal(false);
      setSuccessMsg("Clinical leave request submitted to Hospital Medical Director / Admin for approval.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to submit leave request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-hospital-600" />
              Doctor Roster & OPD Clinic Timetable
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Department of {doctor.department} • Room: <strong>{doctor.opdRoom || "OPD-104"}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleToggleDuty}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-2xs ${
                scheduleData?.isOnDuty
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-slate-200 hover:bg-slate-300 text-slate-700"
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{scheduleData?.isOnDuty ? "Currently ON DUTY" : "Mark ON DUTY"}</span>
            </button>

            <button
              onClick={() => setShowBlockModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Block Slot</span>
            </button>

            <button
              onClick={() => setShowLeaveModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <CalendarX className="w-3.5 h-3.5 text-slate-500" />
              <span>Request Leave</span>
            </button>
          </div>
        </div>

        {/* Success / Error Banners */}
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
      </div>

      {/* Grid: Timetable & Policy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly OPD Timetable (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-hospital-600" />
              Standard Weekly OPD Schedule
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">
              Admin Verified Roster
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-hospital-600" />
              Loading OPD schedule...
            </div>
          ) : (
            <div className="space-y-2">
              {scheduleData?.weeklySchedule.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-28 font-bold text-xs text-slate-800">
                    {item.day}
                  </div>

                  <div className="flex-1 px-3">
                    <div className="text-xs font-semibold text-hospital-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-hospital-600" />
                      <span>{item.timing}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Room {item.room}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Blocked Slots Section */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              Currently Blocked OPD Slots
            </h4>

            {scheduleData?.blockedSlots && scheduleData.blockedSlots.length > 0 ? (
              <div className="space-y-2">
                {scheduleData.blockedSlots.map((b: any) => (
                  <div
                    key={b.id}
                    className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{b.date}</span>
                      <span className="text-slate-500"> ({b.startTime} - {b.endTime})</span>
                      <span className="text-amber-800 text-[11px] block mt-0.5">
                        Reason: {b.reason}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      Blocked
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 text-slate-400 text-xs text-center">
                No slots currently blocked. Normal booking is active.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Admin Policy Notice & OPD Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-hospital-600" />
              OPD Clinic Details
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-500">Consultation Room:</span>
                <strong className="text-slate-800">{doctor.opdRoom || "OPD-104"}</strong>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-500">Department:</span>
                <strong className="text-slate-800">{doctor.department}</strong>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-500">Slot Duration:</span>
                <strong className="text-slate-800">15 Minutes / Patient</strong>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-500">Max OPD Quota:</span>
                <strong className="text-slate-800">35 Patients / Session</strong>
              </div>
            </div>
          </div>

          {/* Admin Policy Compliance Notice */}
          <div className="bg-hospital-50/70 rounded-2xl border border-hospital-100 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-hospital-800">
              <ShieldCheck className="w-4 h-4 text-hospital-600 shrink-0" />
              <span>Hospital Scheduling Governance</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Standard OPD hours, emergency shifts, and department rotations are configured by the IndoStates Hospital Administration. Doctors may block specific clinical slots or request conference leave through the portal, which integrates directly with the Reception booking engine.
            </p>
          </div>
        </div>
      </div>

      {/* Block Slot Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                Block OPD Time Slot
              </h3>
              <button
                onClick={() => setShowBlockModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBlockSlotSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={blockForm.date}
                  onChange={(e) => setBlockForm({ ...blockForm, date: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    value={blockForm.startTime}
                    onChange={(e) => setBlockForm({ ...blockForm, startTime: e.target.value })}
                    placeholder="e.g. 02:00 PM"
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">End Time</label>
                  <input
                    type="text"
                    required
                    value={blockForm.endTime}
                    onChange={(e) => setBlockForm({ ...blockForm, endTime: e.target.value })}
                    placeholder="e.g. 03:00 PM"
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clinical Reason</label>
                <input
                  type="text"
                  required
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                  placeholder="e.g. Emergency OT / Clinical Conference / Rounds"
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="px-3.5 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Confirm Slot Block</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Request Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CalendarX className="w-4 h-4 text-hospital-600" />
                Submit Clinical Leave Request
              </h3>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason for Leave</label>
                <textarea
                  rows={2}
                  required
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="e.g. National Cardiology Conference attendance / Family emergency"
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-3.5 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-hospital-600 hover:bg-hospital-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Admin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
