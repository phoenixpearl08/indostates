"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HospitalStore, StoredAppointment, UserSession } from "@/lib/store";
import { DOCTORS } from "@/data/hospitalData";
import { DoctorAvatar } from "@/components/ui/DoctorAvatar";
import {
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ShieldCheck,
  LogOut,
  Search,
  Activity,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  Filter,
  Check,
  XCircle,
  UserCheck,
  QrCode,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DoctorPortalPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [appointments, setAppointments] = useState<StoredAppointment[]>([]);
  const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "all" | "schedule">("today");
  const [selectedAppt, setSelectedAppt] = useState<StoredAppointment | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState<"in_clinic" | "in_procedure" | "away">("in_clinic");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    // 1. Strict Server/Store Role Authorization Verification
    const s = HospitalStore.getSession();
    if (!s || (s.role !== "doctor" && s.role !== "admin")) {
      setIsAuthorized(false);
      return;
    }

    setSession(s);
    setIsAuthorized(true);

    // 2. Fetch Live Appointments from Server API & Local Cache
    const fetchAppointments = async () => {
      try {
        const res = await fetch("/api/appointments");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.appointments)) {
            // Merge with local appointments ensuring no duplicates
            const local = HospitalStore.getAppointments();
            const combinedMap = new Map<string, StoredAppointment>();
            
            data.appointments.forEach((a: any) => {
              combinedMap.set(a.id, {
                id: a.id,
                referenceCode: a.referenceCode || a.reference_code,
                patientName: a.patientName || a.patient_name,
                patientPhone: a.patientPhone || a.patient_phone,
                patientEmail: a.patientEmail || a.patient_email || "",
                patientAge: Number(a.patientAge || a.patient_age) || 30,
                patientGender: a.patientGender || a.patient_gender || "Other",
                serviceType: a.serviceType || a.service_type || "doctor",
                targetId: a.targetId || a.target_id || "general",
                targetName: a.targetName || a.target_name || "Doctor Consultation",
                doctorName: a.doctorName || a.doctor_name || s.name,
                date: a.date || a.appointment_date,
                timeSlot: a.timeSlot || a.time_slot,
                notes: a.notes || "",
                status: a.status || "confirmed",
                paymentStatus: a.paymentStatus || a.payment_status || "pay_on_arrival",
                createdAt: a.createdAt || a.created_at || new Date().toISOString(),
              });
            });

            local.forEach((l) => {
              if (!combinedMap.has(l.id)) {
                combinedMap.set(l.id, l);
              }
            });

            const merged = Array.from(combinedMap.values());
            setAppointments(merged);
            if (merged.length > 0 && !selectedAppt) {
              setSelectedAppt(merged[0]);
              setClinicalNotes(merged[0].notes || "");
            }
            return;
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote appointments, loading cached store:", err);
      }

      const localAppts = HospitalStore.getAppointments();
      setAppointments(localAppts);
      if (localAppts.length > 0 && !selectedAppt) {
        setSelectedAppt(localAppts[0]);
        setClinicalNotes(localAppts[0].notes || "");
      }
    };

    fetchAppointments();

    const handleApptChange = () => fetchAppointments();
    window.addEventListener("ish_appointments_change", handleApptChange);
    return () => window.removeEventListener("ish_appointments_change", handleApptChange);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignored
    }
    HospitalStore.setSession(null);
    router.push("/login?portal=doctor");
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: "confirmed" | "completed" | "cancelled" | "pending" | "checked_in" | "in_consultation" | "expired"
  ) => {
    setIsUpdatingStatus(true);
    try {
      // Update on server API
      await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, notes: clinicalNotes }),
      });
    } catch (err) {
      console.warn("Server status sync notice:", err);
    }

    const updated = appointments.map((a) =>
      a.id === id ? { ...a, status: newStatus, notes: clinicalNotes } : a
    );
    setAppointments(updated);
    if (selectedAppt && selectedAppt.id === id) {
      setSelectedAppt({ ...selectedAppt, status: newStatus, notes: clinicalNotes });
    }

    // Save to local store
    try {
      localStorage.setItem("ish_appointments", JSON.stringify(updated));
      window.dispatchEvent(new Event("ish_appointments_change"));
    } catch {
      // Storage fallback
    }
    setIsUpdatingStatus(false);
  };

  // Authorization Check
  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Doctor Console Authentication Required
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Patient consultation queues and confidential clinical records are restricted to verified Indo States Health physicians.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link href="/login?portal=doctor">
              <Button variant="primary" size="md" className="w-full">
                Sign In as Clinical Specialist
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="md" className="w-full">
                Return to Hospital Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-3 border-hospital-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Verifying Clinical Credentials...</p>
        </div>
      </div>
    );
  }

  // Appointment metrics
  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const upcomingAppointments = appointments.filter((a) => a.date > todayStr);
  const completedAppointments = appointments.filter((a) => a.status === "completed");
  const pendingAppointments = appointments.filter((a) => a.status === "confirmed" && a.date === todayStr);

  const displayedAppointments = appointments.filter((a) => {
    if (activeTab === "today") return a.date === todayStr;
    if (activeTab === "upcoming") return a.date > todayStr;
    return true;
  }).filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.patientName.toLowerCase().includes(q) ||
      a.referenceCode.toLowerCase().includes(q) ||
      a.targetName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Top Clinical Header */}
      <section className="bg-gradient-to-r from-hospital-950 via-hospital-900 to-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-hospital-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <DoctorAvatar
              name={session?.name || "Dr. Logesh Thirumalaisamy"}
              size="lg"
              className="border-2 border-cyan-400/40 shadow-lg"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-900/60 border border-cyan-700 text-cyan-300 text-[11px] font-semibold tracking-wide uppercase mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                Verified Clinical Console
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
                {session?.name || "Dr. Logesh Thirumalaisamy"}
              </h1>
              <p className="text-xs text-hospital-200">
                Indo States Health • Department of Clinical Operations &amp; Patient Care
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Availability Switch */}
            <div className="flex items-center gap-2 bg-hospital-900/80 p-2 rounded-2xl border border-hospital-700 text-xs">
              <span className="text-slate-400 font-medium">Status:</span>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value as any)}
                className="bg-slate-900/90 text-white font-bold px-2 py-1 rounded-lg border border-slate-700 focus:outline-none cursor-pointer text-xs"
              >
                <option value="in_clinic">🟢 In Clinic (Available)</option>
                <option value="in_procedure">🟡 In MRI / Angio Suite</option>
                <option value="away">🔴 Off-Duty</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-hospital-700 text-hospital-200 hover:bg-hospital-800"
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase">Today&apos;s Queue</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{todayAppointments.length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase">Upcoming</span>
              <span className="text-2xl font-black text-hospital-700 mt-1 block">{upcomingAppointments.length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-hospital-50 text-hospital-700 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase">Pending Action</span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">{pendingAppointments.length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase">Completed</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">{completedAppointments.length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab("today")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === "today"
                  ? "bg-hospital-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Today ({todayAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === "upcoming"
                  ? "bg-hospital-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Upcoming ({upcomingAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === "all"
                  ? "bg-hospital-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All Records ({appointments.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient or ref code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500 bg-slate-50"
            />
          </div>
        </div>

        {/* 2-Column Clinical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Patient Queue List (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Consultation Roster
              </h3>
              <span className="text-xs text-slate-500 font-semibold">
                {displayedAppointments.length} Record{displayedAppointments.length === 1 ? "" : "s"}
              </span>
            </div>

            {displayedAppointments.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-500">No scheduled patients in this queue view.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
                {displayedAppointments.map((appt) => {
                  const isSelected = selectedAppt?.id === appt.id;
                  return (
                    <div
                      key={appt.id}
                      onClick={() => {
                        setSelectedAppt(appt);
                        setClinicalNotes(appt.notes || "");
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? "border-hospital-800 bg-hospital-50/80 shadow-xs ring-1 ring-hospital-700/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-slate-900">{appt.patientName}</span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            appt.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : appt.status === "cancelled"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-cyan-100 text-cyan-800"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 line-clamp-1">{appt.targetName}</div>
                      <div className="text-[11px] text-slate-400 mt-2 flex justify-between font-mono">
                        <span>⏰ {appt.timeSlot} • {appt.date}</span>
                        <span className="font-bold text-hospital-700">{appt.referenceCode}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Patient Details & Clinical Inspection Panel (7 cols) */}
          <div className="lg:col-span-7">
            {selectedAppt ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-5 border-b border-slate-100">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full mb-1 border border-cyan-200/60">
                      Ref: {selectedAppt.referenceCode}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                      {selectedAppt.patientName}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedAppt.patientAge} Years • {selectedAppt.patientGender}
                    </p>
                  </div>

                  {/* Status Transition Action Buttons & QR Verification */}
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedAppt.status !== "checked_in" && selectedAppt.status !== "completed" && (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={isUpdatingStatus}
                        onClick={() => handleUpdateStatus(selectedAppt.id, "checked_in")}
                        className="bg-teal-600 hover:bg-teal-700 text-white"
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Check-In
                      </Button>
                    )}
                    {selectedAppt.status !== "in_consultation" && selectedAppt.status !== "completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isUpdatingStatus}
                        onClick={() => handleUpdateStatus(selectedAppt.id, "in_consultation")}
                        className="text-cyan-700 border-cyan-300 hover:bg-cyan-50"
                        leftIcon={<Activity className="w-3.5 h-3.5" />}
                      >
                        In Consultation
                      </Button>
                    )}
                    <Button
                      variant={selectedAppt.status === "completed" ? "secondary" : "primary"}
                      size="sm"
                      disabled={isUpdatingStatus}
                      onClick={() => handleUpdateStatus(selectedAppt.id, "completed")}
                      leftIcon={<Check className="w-3.5 h-3.5" />}
                    >
                      {selectedAppt.status === "completed" ? "Completed" : "Mark Completed"}
                    </Button>
                    <Link
                      href={`/booking/verify/${selectedAppt.referenceCode}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-hospital-300 bg-white hover:bg-hospital-50 text-slate-700 text-xs font-semibold transition"
                    >
                      <QrCode className="w-3.5 h-3.5 text-hospital-600" />
                      <span>Verify QR</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUpdatingStatus}
                      onClick={() => handleUpdateStatus(selectedAppt.id, "cancelled")}
                      className="text-rose-600 border-rose-200 hover:bg-rose-50"
                      leftIcon={<XCircle className="w-3.5 h-3.5" />}
                    >
                      Cancel Slot
                    </Button>
                  </div>
                </div>

                {/* Patient Summary Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Contact Details
                    </span>
                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-hospital-600 shrink-0" />
                      <span>{selectedAppt.patientPhone}</span>
                    </div>
                    {selectedAppt.patientEmail && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-hospital-600 shrink-0" />
                        <span className="truncate">{selectedAppt.patientEmail}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Appointment Details
                    </span>
                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-hospital-600 shrink-0" />
                      <span>{selectedAppt.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-hospital-600 shrink-0" />
                      <span>{selectedAppt.timeSlot}</span>
                    </div>
                  </div>
                </div>

                {/* Clinical Target Service */}
                <div className="p-4 rounded-2xl bg-hospital-50/60 border border-hospital-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-hospital-700 block mb-1">
                    Scheduled Medical Service
                  </span>
                  <div className="font-bold text-sm text-hospital-950">{selectedAppt.targetName}</div>
                  <div className="text-xs text-hospital-700 mt-0.5">
                    Category: {selectedAppt.serviceType.toUpperCase()} • Payment Status: {selectedAppt.paymentStatus === "paid_online" ? "Online Pre-authorized" : "Pay at Hospital Counter"}
                  </div>
                </div>

                {/* Patient Notes & Symptoms */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Clinical Notes &amp; Findings (Saved on Status Update)
                  </label>
                  <textarea
                    rows={4}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    placeholder="Enter diagnosis notes, scan recommendations, or medication remarks..."
                    className="w-full p-4 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-hospital-500 bg-slate-50/50"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus(selectedAppt.id, selectedAppt.status)}
                  >
                    Save Clinical Notes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
                <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Select a Patient Record</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click on any patient in the consultation roster on the left to inspect clinical history and update consultation progress.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
