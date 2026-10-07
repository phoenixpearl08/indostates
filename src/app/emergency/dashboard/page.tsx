"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Siren,
  Truck,
  HeartPulse,
  AlertTriangle,
  Clock,
  CheckCircle2,
  RefreshCw,
  Plus,
  PhoneCall,
  Navigation,
  Activity,
  ShieldAlert,
  UserCheck,
  LogOut,
} from "lucide-react";
import { AmbulanceRecord, AmbulanceRequest, EmergencyCase } from "@/types/hms";
import { Button } from "@/components/ui/Button";
import { HOSPITAL_INFO } from "@/data/hospitalData";
import { HospitalStore, UserSession } from "@/lib/store";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatTime } from "@/lib/utils";

export default function EmergencyDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [cases, setCases] = useState<EmergencyCase[]>([]);
  const [ambulances, setAmbulances] = useState<AmbulanceRecord[]>([]);
  const [ambulanceRequests, setAmbulanceRequests] = useState<AmbulanceRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"triage" | "ambulances">("triage");
  const [isLoading, setIsLoading] = useState(false);

  // New Emergency Case Modal State
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [caseName, setCaseName] = useState("");
  const [casePhone, setCasePhone] = useState("");
  const [casePriority, setCasePriority] = useState<"RED" | "YELLOW" | "GREEN">("RED");
  const [caseComplaint, setCaseComplaint] = useState("");
  const [caseBp, setCaseBp] = useState("");
  const [casePulse, setCasePulse] = useState("");
  const [caseSpo2, setCaseSpo2] = useState("");
  const [caseBed, setCaseBed] = useState("BED-ER-01");
  const [isSubmittingCase, setIsSubmittingCase] = useState(false);

  // Ambulance Request Modal State
  const [showAmbModal, setShowAmbModal] = useState(false);
  const [ambPatient, setAmbPatient] = useState("");
  const [ambPhone, setAmbPhone] = useState("");
  const [ambPickup, setAmbPickup] = useState("");
  const [ambPriority, setAmbPriority] = useState<"EMERGENCY" | "NON_EMERGENCY">("EMERGENCY");
  const [isSubmittingAmb, setIsSubmittingAmb] = useState(false);

  const fetchEmergencyData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Emergency Cases
      const emgRes = await fetch("/api/hms/emergency");
      if (emgRes.ok) {
        const d = await emgRes.json();
        if (d.success) {
          setCases(d.cases || []);
        }
      }

      // 2. Fetch Ambulances
      const ambRes = await fetch("/api/hms/ambulance");
      if (ambRes.ok) {
        const ad = await ambRes.json();
        if (ad.success) {
          setAmbulances(ad.ambulances || []);
          setAmbulanceRequests(ad.requests || []);
        }
      }
    } catch (err) {
      console.error("Emergency fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const session = HospitalStore.getSession();
    if (!session) {
      router.push("/login?redirect=/emergency/dashboard");
      return;
    }
    const authorizedRoles = [
      "SUPER_ADMIN",
      "HOSPITAL_ADMIN",
      "OPERATIONS_MANAGER",
      "MEDICAL_DIRECTOR",
      "DOCTOR",
      "NURSE",
      "SECURITY_STAFF",
      "AMBULANCE_STAFF",
    ];
    const roleUpper = (session.role || "").toUpperCase();
    if (!authorizedRoles.includes(roleUpper)) {
      router.push("/login?error=unauthorized_role");
      return;
    }
    setCurrentUser(session);
    setIsAuthChecking(false);
    fetchEmergencyData();
    const interval = setInterval(fetchEmergencyData, 15000); // Polling update every 15s
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = async () => {
    await HospitalStore.logout();
    window.location.href = "/login?portal=admin";
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseName || !caseComplaint) return;

    setIsSubmittingCase(true);
    try {
      const res = await fetch("/api/hms/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: caseName.trim(),
          patientPhone: casePhone.trim(),
          triagePriority: casePriority,
          chiefComplaint: caseComplaint.trim(),
          bedNumber: caseBed,
          attendingDoctorName: "Dr. Saravanan Subramanian",
          attendingNurseName: "Nurse Sister Priya",
          vitals: {
            bloodPressure: caseBp || "120/80",
            pulseRate: Number(casePulse) || 82,
            spO2: Number(caseSpo2) || 98,
            gcs: 15,
          },
        }),
      });

      if (res.ok) {
        setShowCaseModal(false);
        setCaseName("");
        setCasePhone("");
        setCaseComplaint("");
        setCaseBp("");
        setCasePulse("");
        setCaseSpo2("");
        fetchEmergencyData();
      }
    } catch (err) {
      console.error("Case creation error:", err);
    } finally {
      setIsSubmittingCase(false);
    }
  };

  const handleDispatchAmbulance = async (requestId: string, ambulanceId: string) => {
    try {
      const res = await fetch("/api/hms/ambulance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "dispatch", requestId, ambulanceId }),
      });

      if (res.ok) {
        fetchEmergencyData();
      }
    } catch (err) {
      console.error("Dispatch error:", err);
    }
  };

  const handleRequestAmbulance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ambPatient || !ambPhone || !ambPickup) return;

    setIsSubmittingAmb(true);
    try {
      const res = await fetch("/api/hms/ambulance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: ambPatient.trim(),
          patientPhone: ambPhone.trim(),
          pickupAddress: ambPickup.trim(),
          priority: ambPriority,
        }),
      });

      if (res.ok) {
        setShowAmbModal(false);
        setAmbPatient("");
        setAmbPhone("");
        setAmbPickup("");
        fetchEmergencyData();
      }
    } catch (err) {
      console.error("Ambulance request error:", err);
    } finally {
      setIsSubmittingAmb(false);
    }
  };

  const redCount = cases.filter((c) => c.triagePriority === "RED").length;
  const yellowCount = cases.filter((c) => c.triagePriority === "YELLOW").length;
  const greenCount = cases.filter((c) => c.triagePriority === "GREEN").length;
  const availableAmbulances = ambulances.filter((a) => a.status === "AVAILABLE");

  if (isAuthChecking) {
    return <DashboardSkeleton title="Emergency & Acute Trauma Command..." />;
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100">
      {/* Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center font-bold text-white shadow-sm">
                <Siren className="w-4 h-4 animate-pulse" />
              </span>
              <span className="font-display font-extrabold text-base tracking-tight text-white hidden sm:inline">
                {HOSPITAL_INFO.shortName}
              </span>
            </Link>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/80">
              Emergency &amp; Trauma Command
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/60 border border-rose-800 text-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                {currentUser.name} ({currentUser.role})
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchEmergencyData}
              isLoading={isLoading}
              className="border-slate-700 text-slate-300 hover:text-white"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              <span>Refresh</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCaseModal(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              <span>Triage Registration</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAmbModal(true)}
              className="border-amber-500/50 text-amber-300 hover:bg-amber-950"
            >
              <Truck className="w-4 h-4 mr-1" />
              <span>Dispatch Call</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-slate-700 text-rose-300 hover:bg-rose-950/40 hover:text-rose-200"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 bg-slate-950 rounded-2xl border border-rose-500/40 shadow-xs">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
              Priority Red
            </span>
            <span className="text-2xl font-black text-rose-300 mt-1 block">{redCount}</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/30 shadow-xs">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Priority Yellow</span>
            <span className="text-2xl font-black text-amber-300 mt-1 block">{yellowCount}</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Priority Green</span>
            <span className="text-2xl font-black text-emerald-300 mt-1 block">{greenCount}</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total In ER</span>
            <span className="text-2xl font-black text-slate-100 mt-1 block">{cases.length}</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-cyan-500/30 shadow-xs">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">Ambulances Ready</span>
            <span className="text-2xl font-black text-cyan-300 mt-1 block">{availableAmbulances.length}</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-purple-500/30 shadow-xs">
            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">En Route Fleet</span>
            <span className="text-2xl font-black text-purple-300 mt-1 block">
              {ambulances.filter((a) => a.status === "EN_ROUTE" || a.status === "ASSIGNED").length}
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab("triage")}
            className={`flex items-center gap-2 pb-2 px-1 border-b-2 transition ${
              activeTab === "triage"
                ? "border-rose-500 text-rose-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>Emergency Triage Queue ({cases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("ambulances")}
            className={`flex items-center gap-2 pb-2 px-1 border-b-2 transition ${
              activeTab === "ambulances"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Fleet &amp; Dispatch ({ambulances.length} Vehicles)</span>
          </button>
        </div>

        {/* TAB 1: EMERGENCY TRIAGE CASES */}
        {activeTab === "triage" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cases.map((c) => {
                const isRed = c.triagePriority === "RED";
                const isYellow = c.triagePriority === "YELLOW";

                let borderClass = "border-slate-800 bg-slate-950/80";
                let badgeClass = "bg-emerald-950 text-emerald-400 border border-emerald-800";

                if (isRed) {
                  borderClass = "border-rose-600/70 bg-rose-950/20";
                  badgeClass = "bg-rose-950 text-rose-300 border border-rose-700 animate-pulse";
                } else if (isYellow) {
                  borderClass = "border-amber-600/60 bg-amber-950/20";
                  badgeClass = "bg-amber-950 text-amber-300 border border-amber-700";
                }

                return (
                  <div
                    key={c.id}
                    className={`p-5 rounded-2xl border ${borderClass} shadow-md space-y-3 flex flex-col justify-between`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-xs text-slate-400">{c.caseNumber}</span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${badgeClass}`}>
                          PRIORITY {c.triagePriority}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-base">{c.patientName}</h4>
                        {c.patientPhone && <span className="text-xs text-slate-400">{c.patientPhone}</span>}
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                        <span className="font-bold text-slate-300 block text-[11px] uppercase tracking-wide">
                          Chief Presentation
                        </span>
                        <p className="text-slate-200 leading-relaxed font-medium">{c.chiefComplaint}</p>
                      </div>

                      {c.vitals && (
                        <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
                          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">BP</span>
                            <strong className="text-white font-mono">{c.vitals.bloodPressure || "N/A"}</strong>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">PULSE</span>
                            <strong className="text-rose-400 font-mono">{c.vitals.pulseRate || "N/A"} bpm</strong>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">SpO2</span>
                            <strong className="text-cyan-400 font-mono">{c.vitals.spO2 || "N/A"}%</strong>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Bay: <strong className="text-slate-200">{c.bedNumber || "Triage Bay"}</strong></span>
                      <span className="font-mono text-slate-500">
                        {formatTime(c.arrivedAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: AMBULANCE FLEET & DISPATCH */}
        {activeTab === "ambulances" && (
          <div className="space-y-6">
            {/* Live Fleet Status */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-white text-base">IndoStates 24x7 Ambulance Fleet</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ambulances.map((amb) => {
                  const isAvailable = amb.status === "AVAILABLE";
                  const isEnRoute = amb.status === "EN_ROUTE" || amb.status === "ASSIGNED";

                  return (
                    <div
                      key={amb.id}
                      className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-white text-sm">{amb.vehicleNumber}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isAvailable
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : isEnRoute
                              ? "bg-amber-950 text-amber-400 border border-amber-800 animate-pulse"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {amb.status}
                        </span>
                      </div>

                      <span className="text-xs text-hospital-300 block font-semibold">{amb.vehicleType}</span>

                      <div className="text-xs text-slate-400 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{amb.currentLocation}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <PhoneCall className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{amb.driverName} ({amb.driverPhone})</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pending Dispatch Calls */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white text-base">Active Emergency Dispatch Requests</h3>
                  <p className="text-xs text-slate-400">Calls logged via hospital 1066 hotline and patient emergency requests.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAmbModal(true)}
                  className="border-amber-500/50 text-amber-300 hover:bg-amber-950"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Log Emergency Call</span>
                </Button>
              </div>

              <div className="space-y-3">
                {ambulanceRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-amber-400">{req.requestNumber}</span>
                        <span className="font-bold text-white text-sm">{req.patientName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            req.status === "REQUESTED"
                              ? "bg-rose-950 text-rose-400 border border-rose-800 animate-pulse"
                              : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Pickup: <strong>{req.pickupAddress}</strong> • Destination: {req.destination}
                      </p>
                      <span className="text-[11px] text-slate-400 block">
                        Contact: {req.patientPhone}
                        {req.vehicleNumber && ` • Assigned Vehicle: ${req.vehicleNumber} (${req.driverName})`}
                      </span>
                    </div>

                    {req.status === "REQUESTED" && availableAmbulances.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleDispatchAmbulance(req.id, availableAmbulances[0].id)}
                          className="bg-amber-600 hover:bg-amber-700 text-slate-950 font-bold text-xs"
                        >
                          <span>Dispatch {availableAmbulances[0].vehicleNumber}</span>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* NEW EMERGENCY CASE MODAL */}
      {showCaseModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-800 space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Emergency Triage Registration</h3>
              <p className="text-xs text-slate-400">Immediate classification under Manchester Triage System.</p>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Patient Name"
                    value={caseName}
                    onChange={(e) => setCaseName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91..."
                    value={casePhone}
                    onChange={(e) => setCasePhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Triage Priority Level *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCasePriority("RED")}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      casePriority === "RED"
                        ? "bg-rose-950 border-rose-500 text-rose-300"
                        : "border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    RED (Immediate)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCasePriority("YELLOW")}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      casePriority === "YELLOW"
                        ? "bg-amber-950 border-amber-500 text-amber-300"
                        : "border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    YELLOW (Urgent)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCasePriority("GREEN")}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      casePriority === "GREEN"
                        ? "bg-emerald-950 border-emerald-500 text-emerald-300"
                        : "border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    GREEN (Standard)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Chief Presenting Complaint *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Acute chest pain with radiation, stroke symptoms, major trauma..."
                  value={caseComplaint}
                  onChange={(e) => setCaseComplaint(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">BP (mmHg)</label>
                  <input
                    type="text"
                    placeholder="120/80"
                    value={caseBp}
                    onChange={(e) => setCaseBp(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Pulse (bpm)</label>
                  <input
                    type="number"
                    placeholder="84"
                    value={casePulse}
                    onChange={(e) => setCasePulse(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    placeholder="98"
                    value={caseSpo2}
                    onChange={(e) => setCaseSpo2(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  type="button"
                  onClick={() => setShowCaseModal(false)}
                  className="border-slate-700 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  isLoading={isSubmittingCase}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Confirm Emergency Triage
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AMBULANCE DISPATCH MODAL */}
      {showAmbModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-800 space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Log Ambulance Dispatch Call</h3>
              <p className="text-xs text-slate-400">Record emergency pickup location and patient condition.</p>
            </div>

            <form onSubmit={handleRequestAmbulance} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Caller / Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={ambPatient}
                  onChange={(e) => setAmbPatient(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91..."
                  value={ambPhone}
                  onChange={(e) => setAmbPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Pickup Address &amp; Landmark *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Complete street address with prominent landmark..."
                  value={ambPickup}
                  onChange={(e) => setAmbPickup(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  type="button"
                  onClick={() => setShowAmbModal(false)}
                  className="border-slate-700 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  isLoading={isSubmittingAmb}
                  className="bg-amber-600 hover:bg-amber-700 text-slate-950 font-bold"
                >
                  Log Call &amp; Dispatch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
