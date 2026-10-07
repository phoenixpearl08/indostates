"use client";

import React, { useState } from "react";
import {
  Calendar,
  Search,
  Filter,
  Clock,
  User,
  Stethoscope,
  CheckCircle2,
  XCircle,
  AlertCircle,
  QrCode,
  Edit2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AppointmentsViewProps {
  appointments: any[];
  onRefresh: () => void;
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function AppointmentsView({ appointments, onRefresh, onSetFeedback }: AppointmentsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");

  const [selectedAppt, setSelectedAppt] = useState<any | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("11:00 AM – 11:20 AM");
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  const filteredAppointments = appointments.filter((a) => {
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      a.patientName?.toLowerCase().includes(q) ||
      a.referenceCode?.toLowerCase().includes(q) ||
      a.doctorName?.toLowerCase().includes(q) ||
      a.patientPhone?.includes(q) ||
      a.patientUhid?.toLowerCase().includes(q);

    const matchStatus = statusFilter === "ALL" || a.status === statusFilter;

    let matchDate = true;
    if (dateFilter === "TODAY") matchDate = a.date === todayStr;
    if (dateFilter === "UPCOMING") matchDate = a.date >= todayStr;

    return matchSearch && matchStatus && matchDate;
  });

  const todayCount = appointments.filter((a) => a.date === todayStr).length;
  const maxDailySlots = 250;
  const slotUtilization = Math.min(100, Math.round((todayCount / maxDailySlots) * 100));

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt || !newDate) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reschedule",
          appointmentId: selectedAppt.id,
          newDate,
          newSlot,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        setShowRescheduleModal(false);
        setSelectedAppt(null);
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to reschedule." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error rescheduling appointment." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cancel",
          appointmentId: selectedAppt.id,
          cancelReason,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        setShowCancelModal(false);
        setSelectedAppt(null);
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to cancel appointment." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error cancelling appointment." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Master Consultation Schedule &amp; Bookings</h2>
          <p className="text-xs text-slate-500">
            Monitor real-time patient appointments, token utilization, and schedule modifications
          </p>
        </div>

        {/* Slot Utilization Badge */}
        <div className="bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Today's Slot Utilization</div>
            <div className="text-xs font-black text-slate-800">
              {todayCount} of {maxDailySlots} Booked ({slotUtilization}%)
            </div>
          </div>
          <div className="w-12 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${slotUtilization}%` }}
              className="h-full bg-hospital-600 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by patient name, UHID, booking reference, or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="text-xs font-semibold text-slate-700 py-1.5 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none"
          >
            <option value="ALL">All Dates</option>
            <option value="TODAY">Today's Schedule</option>
            <option value="UPCOMING">Upcoming Schedule</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold text-slate-700 py-1.5 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="in_consultation">In Consultation</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <span className="text-xs font-bold text-slate-500 px-2">{filteredAppointments.length} Bookings</span>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Ref Code</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Physician &amp; Clinic</th>
                <th className="py-3 px-4">Appointment Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt) => {
                  return (
                    <tr key={appt.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setSelectedAppt(appt);
                            setShowQrModal(true);
                          }}
                          className="font-mono font-bold text-hospital-800 hover:underline flex items-center gap-1"
                        >
                          <QrCode className="w-3.5 h-3.5 text-slate-400" />
                          <span>{appt.referenceCode}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{appt.patientName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {appt.patientUhid || "Walk-In"} • {appt.patientPhone}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{appt.doctorName || "General OPD"}</div>
                        <div className="text-[11px] text-slate-500">{appt.targetName}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div className="font-semibold text-slate-800">{appt.date}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{appt.timeSlot}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            appt.status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : appt.status === "confirmed"
                              ? "bg-sky-50 text-sky-700 border border-sky-200"
                              : appt.status === "cancelled"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {appt.status?.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            appt.paymentStatus === "paid_online"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {appt.paymentStatus === "paid_online" ? "Paid Online" : "Pay on Arrival"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAppt(appt);
                            setNewDate(appt.date);
                            setNewSlot(appt.timeSlot);
                            setShowRescheduleModal(true);
                          }}
                          disabled={appt.status === "completed" || appt.status === "cancelled"}
                          className="text-[11px] h-7 px-2"
                        >
                          Reschedule
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAppt(appt);
                            setShowCancelModal(true);
                          }}
                          disabled={appt.status === "completed" || appt.status === "cancelled"}
                          className="text-[11px] h-7 px-2 text-rose-600 hover:bg-rose-50"
                        >
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                    No appointments match your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Reschedule Appointment</h3>
                <span className="text-xs text-amber-400 font-mono">{selectedAppt.referenceCode}</span>
              </div>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReschedule} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">New Appointment Date *</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">New Consultation Slot *</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                >
                  <option value="09:00 AM – 09:20 AM">09:00 AM – 09:20 AM</option>
                  <option value="10:00 AM – 10:20 AM">10:00 AM – 10:20 AM</option>
                  <option value="11:00 AM – 11:20 AM">11:00 AM – 11:20 AM</option>
                  <option value="12:00 PM – 12:20 PM">12:00 PM – 12:20 PM</option>
                  <option value="02:00 PM – 02:20 PM">02:00 PM – 02:20 PM</option>
                  <option value="03:00 PM – 03:20 PM">03:00 PM – 03:20 PM</option>
                  <option value="04:00 PM – 04:20 PM">04:00 PM – 04:20 PM</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                >
                  Close
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Confirm Reschedule"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedAppt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-rose-950 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Cancel Appointment</h3>
                <span className="text-xs text-rose-300 font-mono">{selectedAppt.referenceCode}</span>
              </div>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCancel} className="p-5 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Are you sure you want to cancel the appointment for{" "}
                <strong>{selectedAppt.patientName}</strong> with <strong>{selectedAppt.doctorName}</strong> on{" "}
                <strong>{selectedAppt.date}</strong>?
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Cancellation</label>
                <textarea
                  rows={2}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Patient requested cancellation / Physician in emergency surgery"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep Appointment
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-rose-600 hover:bg-rose-500 text-white"
                >
                  {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Pass Preview Modal */}
      {showQrModal && selectedAppt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-hospital-100 text-hospital-800 mx-auto flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Digital Consultation Pass</h3>
              <p className="text-xs text-slate-500">Scan at Nursing Station or Turnstile</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Token Ref:</span>
                <span className="font-mono font-bold text-slate-800">{selectedAppt.referenceCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patient:</span>
                <span className="font-bold text-slate-800">{selectedAppt.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Physician:</span>
                <span className="font-bold text-slate-800">{selectedAppt.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Slot:</span>
                <span className="font-bold text-hospital-800">
                  {selectedAppt.date} ({selectedAppt.timeSlot})
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQrModal(false)}
              className="w-full text-xs"
            >
              Close Pass
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
