"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  QrCode,
  RefreshCw,
  X,
  Plus,
  AlertCircle,
  CheckCircle2,
  CalendarDays,
  ExternalLink,
  MapPin,
  Share2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { AppointmentRecord } from "@/types/hms";
import { formatDate } from "@/lib/utils";

export default function PatientAppointmentsPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"upcoming" | "past" | "cancelled">("upcoming");

  // Reschedule Modal State
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleTargetAppt, setRescheduleTargetAppt] = useState<AppointmentRecord | null>(null);
  const [rescheduleNewDate, setRescheduleNewDate] = useState("");
  const [rescheduleNewSlot, setRescheduleNewSlot] = useState("10:00 AM");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [rescheduleSlots, setRescheduleSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmittingReschedule, setIsSubmittingReschedule] = useState(false);
  const [rescheduleFeedback, setRescheduleFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Cancel Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelTargetAppt, setCancelTargetAppt] = useState<AppointmentRecord | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const s = HospitalStore.getSession();
    if (!s) {
      window.location.href = "/login?portal=patient&redirect=/patient/appointments";
      return;
    }
    setSession(s);
    fetchAppointments(s);
  }, []);

  const fetchAppointments = async (user: UserSession) => {
    setIsLoading(true);
    try {
      const patientUhid = user.uhid || "IND-UHID-000101";
      const res = await fetch(
        `/api/appointments?uhid=${encodeURIComponent(patientUhid)}&phone=${encodeURIComponent(user.phone || "")}&email=${encodeURIComponent(user.email || "")}`
      );
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.appointments)) {
          setAppointments(d.appointments);
          setIsLoading(false);
          return;
        }
      }

      // Local fallback
      const local = HospitalStore.getAppointments();
      if (local && local.length > 0) {
        setAppointments(
          local.map((a: any) => ({
            id: a.id,
            appointmentId: a.referenceCode || a.id,
            referenceCode: a.referenceCode || a.id,
            verificationToken: a.verificationToken || a.id,
            patientId: a.patientId || "pat-1",
            patientUhid: user.uhid || "IND-UHID-000101",
            patientName: a.patientName || user.name,
            patientPhone: a.patientPhone || user.phone || "",
            patientEmail: a.patientEmail || user.email || "",
            patientAge: a.patientAge || 30,
            patientGender: a.patientGender || "Male",
            serviceType: a.serviceType || "doctor",
            targetId: a.targetId || "dr-rajesh-rangaswamy",
            targetName: a.targetName || a.doctorName || "Dr. Rajesh Rangaswamy",
            doctorName: a.doctorName || a.targetName || "Dr. Rajesh Rangaswamy",
            departmentId: "neuro-stroke",
            departmentName: "Neurovascular & Stroke",
            appointmentDate: a.date || a.appointmentDate,
            timeSlot: a.timeSlot || "10:00 AM",
            status: (a.status?.toUpperCase() || "CONFIRMED") as any,
            paymentStatus: a.paymentStatus || "pay_on_arrival",
            qrVerified: false,
            createdAt: a.createdAt || new Date().toISOString(),
            updatedAt: a.createdAt || new Date().toISOString(),
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const upcoming = appointments.filter(
    (a) => a.status !== "CANCELLED" && a.status !== "COMPLETED" && a.status !== "EXPIRED"
  );
  const past = appointments.filter((a) => a.status === "COMPLETED");
  const cancelled = appointments.filter((a) => a.status === "CANCELLED");

  const displayedList =
    activeFilter === "upcoming" ? upcoming : activeFilter === "past" ? past : cancelled;

  // Reschedule handler
  const handleOpenReschedule = (appt: AppointmentRecord) => {
    setRescheduleTargetAppt(appt);
    setRescheduleFeedback(null);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    setRescheduleNewDate(dateStr);
    setIsRescheduleModalOpen(true);
    fetchSlots(appt.doctorId || appt.targetId, dateStr);
  };

  const fetchSlots = async (docId: string, dateStr: string) => {
    setIsLoadingSlots(true);
    try {
      const res = await fetch(
        `/api/appointments/slots?doctorId=${encodeURIComponent(docId || "dr-rajesh-rangaswamy")}&date=${encodeURIComponent(dateStr)}`
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.availableSlots)) {
        setRescheduleSlots(data.availableSlots);
        if (data.availableSlots.length > 0) {
          setRescheduleNewSlot(data.availableSlots[0]);
        }
      }
    } catch {
      setRescheduleSlots(["09:30 AM", "10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSubmitReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTargetAppt || !rescheduleNewDate || !rescheduleNewSlot) return;

    setIsSubmittingReschedule(true);
    setRescheduleFeedback(null);

    try {
      const res = await fetch("/api/appointments/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: rescheduleTargetAppt.id,
          newDate: rescheduleNewDate,
          newTimeSlot: rescheduleNewSlot,
          reason: rescheduleReason.trim() || "Patient requested reschedule",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setRescheduleFeedback({
          type: "error",
          message: data.error || "Selected slot is unavailable. Please choose another date or time.",
        });
      } else {
        setRescheduleFeedback({
          type: "success",
          message: `Appointment successfully rescheduled to ${rescheduleNewDate} at ${rescheduleNewSlot}.`,
        });
        if (session) fetchAppointments(session);
        setTimeout(() => setIsRescheduleModalOpen(false), 1200);
      }
    } catch {
      setRescheduleFeedback({ type: "error", message: "Network error during rescheduling." });
    } finally {
      setIsSubmittingReschedule(false);
    }
  };

  // Cancel handler
  const handleOpenCancel = (appt: AppointmentRecord) => {
    setCancelTargetAppt(appt);
    setCancelFeedback(null);
    setCancelReason("");
    setIsCancelModalOpen(true);
  };

  const handleSubmitCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelTargetAppt) return;

    setIsSubmittingCancel(true);
    setCancelFeedback(null);

    try {
      const res = await fetch("/api/appointments/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: cancelTargetAppt.id,
          reason: cancelReason.trim() || "Patient requested cancellation",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setCancelFeedback({ type: "error", message: data.error || "Failed to cancel appointment." });
      } else {
        setCancelFeedback({
          type: "success",
          message: "Appointment cancelled successfully. Slot has been released.",
        });
        if (session) fetchAppointments(session);
        setTimeout(() => setIsCancelModalOpen(false), 1200);
      }
    } catch {
      setCancelFeedback({ type: "error", message: "Network error cancelling appointment." });
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = (appt: AppointmentRecord) => {
    const title = encodeURIComponent(`IndoStates Consultation: ${appt.doctorName || appt.targetName}`);
    const details = encodeURIComponent(
      `Appointment Ref: ${appt.referenceCode || appt.appointmentId}\nDoctor: ${appt.doctorName || appt.targetName}\nIndoStates Hospital Main Campus OPD Block`
    );
    const location = encodeURIComponent("IndoStates Health Hospital, Salem-Kochi Highway, Arasur, Coimbatore");
    const dateFormatted = appt.appointmentDate ? appt.appointmentDate.replace(/-/g, "") : "20261010";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateFormatted}T043000Z/${dateFormatted}T053000Z`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-hospital-600 bg-hospital-50 px-2.5 py-1 rounded-full border border-hospital-100">
            Clinical Consultations
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-2">
            My Appointments &amp; Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your specialist consultations, diagnostic imaging slots, and health checkups.
          </p>
        </div>

        <Link
          href="/book-appointment"
          className="px-5 py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold gap-6">
        <button
          type="button"
          onClick={() => setActiveFilter("upcoming")}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeFilter === "upcoming"
              ? "border-hospital-700 text-hospital-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Upcoming ({upcoming.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("past")}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeFilter === "past"
              ? "border-hospital-700 text-hospital-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Completed Visits ({past.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("cancelled")}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeFilter === "cancelled"
              ? "border-hospital-700 text-hospital-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <X className="w-4 h-4" />
          <span>Cancelled ({cancelled.length})</span>
        </button>
      </div>

      {/* Appointment Cards List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-hospital-600" />
            <span>Loading verified appointments...</span>
          </div>
        ) : displayedList.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">No {activeFilter} appointments found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeFilter === "upcoming"
                ? "You have no active consultations scheduled. Book a consultation or health package today."
                : "No past records matching this category."}
            </p>
            {activeFilter === "upcoming" && (
              <Link
                href="/book-appointment"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-hospital-700 text-white font-bold text-xs hover:bg-hospital-800 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Book Appointment</span>
              </Link>
            )}
          </div>
        ) : (
          displayedList.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 hover:shadow-card transition space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-hospital-800 bg-hospital-50 px-2.5 py-0.5 rounded-md border border-hospital-200">
                      Ref: {appt.referenceCode || appt.appointmentId}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        appt.status === "CONFIRMED"
                          ? "bg-emerald-100 text-emerald-800"
                          : appt.status === "CHECKED_IN"
                          ? "bg-cyan-100 text-cyan-800"
                          : appt.status === "COMPLETED"
                          ? "bg-slate-100 text-slate-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base mt-2">
                    {appt.doctorName || appt.targetName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {appt.departmentName || "General OPD"} • {appt.serviceType === "package" ? "Health Package" : "Doctor Consultation"}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Scheduled Slot
                  </span>
                  <span className="font-bold text-slate-900 text-sm block">
                    {formatDate(appt.appointmentDate)}
                  </span>
                  <span className="text-xs font-semibold text-hospital-700 flex items-center gap-1 justify-end mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{appt.timeSlot}</span>
                  </span>
                </div>
              </div>

              {/* Details and Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-hospital-600 shrink-0" />
                  <span>Main Hospital Block, OPD Suite 102</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-hospital-600 shrink-0" />
                  <span>Arrive 15 mins prior for vitals check</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">Payment:</span>
                  <span className="capitalize">{appt.paymentStatus?.replace(/_/g, " ") || "Pay on Arrival"}</span>
                </div>
              </div>

              {/* Actions Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/patient/qr-pass?id=${appt.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold hover:bg-cyan-100 transition flex items-center gap-1.5 shadow-xs"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View QR Pass</span>
                  </Link>

                  <a
                    href={getGoogleCalendarUrl(appt)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Add to Calendar</span>
                  </a>

                  <Link
                    href={`/patient/pre-check-in?appointmentId=${appt.id}`}
                    className="px-3 py-1.5 rounded-xl bg-hospital-50 text-hospital-800 border border-hospital-200 text-xs font-bold hover:bg-hospital-100 transition"
                  >
                    Pre-Check-In &rarr;
                  </Link>
                </div>

                {activeFilter === "upcoming" && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenReschedule(appt)}
                      className="text-xs font-bold text-hospital-700 hover:underline px-2 py-1"
                    >
                      Reschedule
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => handleOpenCancel(appt)}
                      className="text-xs font-bold text-rose-600 hover:underline px-2 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {activeFilter !== "upcoming" && (
                  <Link
                    href={`/book-appointment?doctorId=${appt.doctorId || appt.targetId}`}
                    className="px-3.5 py-1.5 rounded-xl bg-hospital-700 text-white text-xs font-bold hover:bg-hospital-800 transition"
                  >
                    Rebook Consultation
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && rescheduleTargetAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Reschedule Appointment</h3>
                <p className="text-xs text-slate-500">
                  Target: {rescheduleTargetAppt.doctorName || rescheduleTargetAppt.targetName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRescheduleModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {rescheduleFeedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  rescheduleFeedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {rescheduleFeedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{rescheduleFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReschedule} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select New Date *</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={rescheduleNewDate}
                  onChange={(e) => {
                    setRescheduleNewDate(e.target.value);
                    fetchSlots(rescheduleTargetAppt.doctorId || rescheduleTargetAppt.targetId, e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-hospital-500 bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700">Available Time Slots *</label>
                  {isLoadingSlots && <span className="text-[10px] text-hospital-600">Checking slots...</span>}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {rescheduleSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setRescheduleNewSlot(slot)}
                      className={`p-2 rounded-xl border text-xs font-bold transition text-center ${
                        rescheduleNewSlot === slot
                          ? "bg-hospital-700 border-hospital-700 text-white"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Schedule conflict"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRescheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReschedule}
                  className="px-4 py-2 rounded-xl bg-hospital-700 text-white font-bold hover:bg-hospital-800 transition"
                >
                  {isSubmittingReschedule ? "Rescheduling..." : "Confirm Reschedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {isCancelModalOpen && cancelTargetAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Cancel Appointment?</h3>
                <p className="text-xs text-slate-500">Ref: {cancelTargetAppt.referenceCode}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel your consultation with{" "}
              <strong>{cancelTargetAppt.doctorName || cancelTargetAppt.targetName}</strong> on{" "}
              <strong>{formatDate(cancelTargetAppt.appointmentDate)}</strong> at{" "}
              <strong>{cancelTargetAppt.timeSlot}</strong>? The reserved slot will be released back to the hospital.
            </p>

            {cancelFeedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  cancelFeedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                <span>{cancelFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmitCancel} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Cancellation</label>
                <input
                  type="text"
                  placeholder="e.g. Schedule conflict, feeling better"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Keep Appointment
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCancel}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition"
                >
                  {isSubmittingCancel ? "Cancelling..." : "Yes, Cancel Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
