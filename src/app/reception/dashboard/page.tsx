"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  Clock,
  QrCode,
  Search,
  CheckCircle2,
  AlertCircle,
  Phone,
  ArrowRight,
  LogOut,
  RefreshCw,
  UserCheck,
  Stethoscope,
  Filter,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { AppointmentRecord, QueueEntry } from "@/types/hms";
import { Button } from "@/components/ui/Button";
import { DOCTORS } from "@/data/hospitalData";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatTime } from "@/lib/utils";

export default function ReceptionDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [queues, setQueues] = useState<QueueEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [qrCodeInput, setQrCodeInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"today" | "queue" | "checkin">("today");

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const s = HospitalStore.getSession();
    const authorized = ["RECEPTIONIST", "SUPER_ADMIN", "HOSPITAL_ADMIN", "OPERATIONS_MANAGER"];
    if (!s) {
      window.location.href = "/login?redirect=/reception/dashboard";
      return;
    }
    if (!authorized.includes((s.role || "").toUpperCase())) {
      window.location.href = "/login?error=unauthorized_role";
      return;
    }
    setSession(s);
    setIsAuthChecking(false);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [apptsRes, queueRes] = await Promise.all([
        fetch("/api/appointments"),
        fetch("/api/hms/queue"),
      ]);

      if (apptsRes.ok) {
        const d = await apptsRes.json();
        if (d.success && Array.isArray(d.appointments)) {
          setAppointments(d.appointments);
        }
      }

      if (queueRes.ok) {
        const qd = await queueRes.json();
        if (qd.success && Array.isArray(qd.queues)) {
          setQueues(qd.queues);
        }
      }
    } catch (err) {
      console.error("Error fetching reception data:", err);
    }
  };

  const handleCheckIn = async (appointmentId: string) => {
    setIsProcessing(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/hms/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "checkin",
          appointmentId,
          actor: {
            id: session?.id || "usr-reception",
            name: session?.name || "Reception Desk",
            role: "RECEPTIONIST",
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.error || "Check-in failed." });
      } else {
        setFeedback({
          type: "success",
          message: `Checked in successfully! Issued Token: ${data.queueEntry?.tokenNumber}`,
        });
        fetchData();
      }
    } catch {
      setFeedback({ type: "error", message: "Network communication error." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQrLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCodeInput.trim()) return;

    const query = qrCodeInput.trim().toUpperCase();
    const matched = appointments.find(
      (a) =>
        a.referenceCode?.toUpperCase() === query ||
        a.appointmentId?.toUpperCase() === query ||
        a.verificationToken === query ||
        a.id === query
    );

    if (matched) {
      handleCheckIn(matched.id || matched.appointmentId);
      setQrCodeInput("");
    } else {
      setFeedback({
        type: "error",
        message: `No appointment found matching code '${qrCodeInput}'. Check reference code and retry.`,
      });
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch =
      (a.patientName && a.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.patientPhone && a.patientPhone.includes(searchQuery)) ||
      (a.referenceCode && a.referenceCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.patientUhid && a.patientUhid.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.appointmentId && a.appointmentId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || a.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  if (isAuthChecking) {
    return <DashboardSkeleton title="Front Desk & Reception Portal..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Reception Bar */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white font-bold flex items-center justify-center shadow-md">
              RC
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg leading-tight">
                Reception &amp; Front Desk Portal
              </h1>
              <p className="text-xs text-slate-400">
                IndoStates Health Hospital • Coimbatore
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-800 text-cyan-400 px-3 py-1 rounded-full border border-slate-700 font-semibold">
              Operator: {session?.name || "Front Desk"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await HospitalStore.logout();
                window.location.href = "/login?portal=admin";
              }}
              className="border-slate-700 text-slate-300 hover:text-white"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-slate-500 hover:text-slate-700 ml-4 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Action Grid: Quick Stats & QR Check-in */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* QR Instant Scanner / Code Input */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <QrCode className="w-5 h-5 text-hospital-600" />
              <span>Instant Pass / QR Check-In</span>
            </div>
            <p className="text-xs text-slate-500">
              Enter Appointment ID, Reference Code (e.g. ISH-552910), or scan the barcode from the patient&rsquo;s Digital Pass.
            </p>

            <form onSubmit={handleQrLookup} className="space-y-3">
              <input
                type="text"
                placeholder="Scan or enter ISH-XXXXXX..."
                value={qrCodeInput}
                onChange={(e) => setQrCodeInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500 font-mono uppercase"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isProcessing}
                className="w-full"
              >
                <UserCheck className="w-4 h-4 mr-1.5" />
                <span>Verify &amp; Issue Token</span>
              </Button>
            </form>
          </div>

          {/* Quick Metrics */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
              <span className="text-slate-500 text-xs font-semibold block">Total Bookings</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {appointments.length}
              </span>
              <span className="text-[10px] text-slate-400">All registered visits</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
              <span className="text-slate-500 text-xs font-semibold block">In Waiting Queue</span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">
                {queues.filter((q) => q.status === "waiting").length}
              </span>
              <span className="text-[10px] text-amber-700/70">Awaiting consultation</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
              <span className="text-slate-500 text-xs font-semibold block">In Consultation</span>
              <span className="text-2xl font-black text-cyan-600 mt-1 block">
                {queues.filter((q) => q.status === "in_consultation" || q.status === "called").length}
              </span>
              <span className="text-[10px] text-cyan-700/70">With doctors now</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
              <span className="text-slate-500 text-xs font-semibold block">Specialists Available</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">
                {DOCTORS.length}
              </span>
              <span className="text-[10px] text-emerald-700/70">Active duty</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 text-xs font-bold gap-4">
          <button
            onClick={() => setActiveTab("today")}
            className={`pb-3 px-2 border-b-2 transition ${
              activeTab === "today"
                ? "border-hospital-600 text-hospital-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Today&rsquo;s Appointments Schedule ({filteredAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab("queue")}
            className={`pb-3 px-2 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "queue"
                ? "border-hospital-600 text-hospital-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Live Consultation Queue ({queues.length})</span>
          </button>
        </div>

        {/* TAB 1: APPOINTMENT SCHEDULE */}
        {activeTab === "today" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
            {/* Search & Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by Patient Name, Phone, Reference Code, UHID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-semibold focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="WAITING">Checked In / Waiting</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <Button variant="outline" size="sm" onClick={fetchData}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  <span>Refresh</span>
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-3 px-4">Ref / Token</th>
                    <th className="py-3 px-4">Patient Name &amp; UHID</th>
                    <th className="py-3 px-4">Specialist / Service</th>
                    <th className="py-3 px-4">Schedule</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                        No appointments found matching your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((appt) => {
                      const isCheckedIn =
                        appt.status === "WAITING" ||
                        appt.status === "CALLED" ||
                        appt.status === "IN_CONSULTATION" ||
                        appt.status === "COMPLETED";

                      return (
                        <tr key={appt.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-slate-900 block">
                              {appt.referenceCode || appt.appointmentId}
                            </span>
                            {appt.tokenNumber && (
                              <span className="text-[11px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                                Token: {appt.tokenNumber}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-800 block">
                              {appt.patientName}
                            </span>
                            <span className="text-slate-500 text-[11px] block">
                              {appt.patientPhone} • {appt.patientUhid || "UHID Pending"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-800 block">
                              {appt.doctorName || appt.targetName}
                            </span>
                            <span className="text-slate-400 text-[11px]">
                              {appt.serviceType?.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-slate-700 block font-medium">
                              {appt.appointmentDate || (appt as any).date}
                            </span>
                            <span className="text-slate-500 text-[11px]">
                              {appt.timeSlot}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                                appt.status === "WAITING"
                                  ? "bg-amber-100 text-amber-800"
                                  : appt.status === "COMPLETED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : appt.status === "CANCELLED"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {appt.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {!isCheckedIn && appt.status !== "CANCELLED" ? (
                              <button
                                onClick={() => handleCheckIn(appt.id || appt.appointmentId)}
                                disabled={isProcessing}
                                className="px-3 py-1.5 rounded-lg bg-hospital-600 text-white font-bold text-xs hover:bg-hospital-700 transition"
                              >
                                Check In &rarr;
                              </button>
                            ) : (
                              <span className="text-slate-400 text-xs font-semibold">
                                {appt.status === "CANCELLED" ? "Cancelled" : "Checked In"}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE QUEUE */}
        {activeTab === "queue" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Active Consultation Queue Tokens
                </h3>
                <p className="text-xs text-slate-500">
                  Synchronized in real-time across Doctor Consultation Desks and Waiting Halls
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={fetchData}>
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                <span>Refresh Queue</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {queues.length === 0 ? (
                <div className="col-span-3 py-10 text-center text-slate-400 text-xs">
                  No patients currently in the waiting queue. All checked-in patients will appear here.
                </div>
              ) : (
                queues.map((q) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-hospital-800 font-mono">
                        {q.tokenNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          q.status === "waiting"
                            ? "bg-amber-100 text-amber-800"
                            : q.status === "called"
                            ? "bg-cyan-100 text-cyan-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        {q.patientName}
                      </span>
                      <span className="text-[11px] text-slate-500">UHID: {q.patientUhid}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                      <span>Doctor: {q.doctorName || "Assigned Specialist"}</span>
                      <span className="text-slate-400">
                        {formatTime(q.checkInTime)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
