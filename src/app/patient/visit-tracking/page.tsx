"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Footprints,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Stethoscope,
  FlaskConical,
  Pill,
  CreditCard,
  Building2,
  RefreshCw,
  QrCode,
  ArrowRight,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { formatDate } from "@/lib/utils";

interface VisitStage {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  department: string;
  room: string;
  estimatedMinutes: number;
}

const VISIT_STAGES: VisitStage[] = [
  {
    id: "BOOKED",
    name: "1. Appointment Booked",
    description: "Slot reserved with specialist physician.",
    icon: Calendar,
    department: "Online Gateway",
    room: "Digital",
    estimatedMinutes: 0,
  },
  {
    id: "CHECKED_IN",
    name: "2. Hospital Arrival & Check-In",
    description: "QR scanned at security gate; registered at reception kiosk.",
    icon: QrCode,
    department: "Main Reception",
    room: "Desk 3",
    estimatedMinutes: 5,
  },
  {
    id: "WAITING",
    name: "3. Triage & OPD Queue Waiting",
    description: "Vitals recorded (BP, Pulse, SpO2) by nurse; waiting for room call.",
    icon: Clock,
    department: "Nursing Triage",
    room: "OPD Waiting Lounge",
    estimatedMinutes: 15,
  },
  {
    id: "IN_CONSULTATION",
    name: "4. Doctor Clinical Consultation",
    description: "Consultation, diagnosis, and prescription with specialist.",
    icon: Stethoscope,
    department: "Neurovascular / General OPD",
    room: "Suite 102",
    estimatedMinutes: 20,
  },
  {
    id: "LAB_PENDING",
    name: "5. Diagnostic Investigation Orders",
    description: "Blood sample collected / Imaging scan underway.",
    icon: FlaskConical,
    department: "Central Diagnostic Center",
    room: "Lab Station 1 / MRI Room",
    estimatedMinutes: 25,
  },
  {
    id: "PHARMACY_PENDING",
    name: "6. Pharmacy Dispensing",
    description: "Prescription verified and packed at hospital dispensary.",
    icon: Pill,
    department: "24/7 Hospital Pharmacy",
    room: "Counter 2",
    estimatedMinutes: 10,
  },
  {
    id: "BILLING_PENDING",
    name: "7. Accounts & Billing Clearance",
    description: "Mediclaim pre-auth settled / receipt generated.",
    icon: CreditCard,
    department: "Patient Accounts",
    room: "Cashier Desk 4",
    estimatedMinutes: 5,
  },
  {
    id: "COMPLETED",
    name: "8. Visit Successfully Completed",
    description: "Discharge instructions issued; follow-up scheduled.",
    icon: CheckCircle2,
    department: "Patient Care Coordinator",
    room: "Departure Lounge",
    estimatedMinutes: 0,
  },
];

export default function PatientVisitTrackingPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeAppointment, setActiveAppointment] = useState<any | null>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(2); // e.g. Waiting in queue
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const s = HospitalStore.getSession();
    if (!s) {
      window.location.href = "/login?portal=patient&redirect=/patient/visit-tracking";
      return;
    }
    setSession(s);
    loadActiveAppointment(s);
  }, []);

  const loadActiveAppointment = async (user: UserSession) => {
    setIsRefreshing(true);
    try {
      const patientUhid = user.uhid || "IND-UHID-000101";
      const res = await fetch(
        `/api/appointments?uhid=${encodeURIComponent(patientUhid)}&phone=${encodeURIComponent(user.phone || "")}&email=${encodeURIComponent(user.email || "")}`
      );
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.appointments) && d.appointments.length > 0) {
          const appt = d.appointments[0];
          setActiveAppointment(appt);

          // Map appointment status to stage index
          const status = appt.status?.toUpperCase() || "CONFIRMED";
          if (status === "BOOKED" || status === "CONFIRMED") setCurrentStageIndex(1);
          else if (status === "CHECKED_IN") setCurrentStageIndex(2);
          else if (status === "WAITING" || status === "CALLED") setCurrentStageIndex(2);
          else if (status === "IN_CONSULTATION") setCurrentStageIndex(3);
          else if (status === "LAB_PENDING" || status === "LAB_COMPLETED") setCurrentStageIndex(4);
          else if (status === "PHARMACY_PENDING" || status === "PHARMACY_COMPLETED") setCurrentStageIndex(5);
          else if (status === "BILLING_PENDING" || status === "PAYMENT_COMPLETED") setCurrentStageIndex(6);
          else if (status === "COMPLETED") setCurrentStageIndex(7);
        }
      }
    } catch (err) {
      console.error("Error loading visit appointment:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const currentStage = VISIT_STAGES[currentStageIndex];
  const nextStage = currentStageIndex < VISIT_STAGES.length - 1 ? VISIT_STAGES[currentStageIndex + 1] : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-hospital-600 bg-hospital-50 px-2.5 py-1 rounded-full border border-hospital-100">
            Real-Time Patient Flow
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-2">
            Hospital Visit Journey Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Live step-by-step progress of your OPD visit from arrival check-in to pharmacy and discharge.
          </p>
        </div>

        <button
          type="button"
          onClick={() => session && loadActiveAppointment(session)}
          disabled={isRefreshing}
          className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-hospital-600" : ""}`} />
          <span>Refresh Live Status</span>
        </button>
      </div>

      {/* Live Stage Highlight Card */}
      <div className="bg-gradient-to-br from-hospital-900 via-hospital-850 to-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-hospital-800 relative overflow-hidden space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-300 bg-cyan-900/60 px-2.5 py-1 rounded-full border border-cyan-500/30">
              Active Step {currentStageIndex + 1} of 8
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white mt-2">
              {currentStage.name}
            </h2>
            <p className="text-xs text-hospital-200">{currentStage.description}</p>
          </div>

          <div className="text-right bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-md">
            <span className="text-[10px] uppercase font-bold text-cyan-300 block">Assigned Token</span>
            <span className="text-2xl font-black font-mono tracking-wider text-white">
              {activeAppointment?.tokenNumber || "T-005"}
            </span>
            <span className="text-[11px] text-hospital-200 block mt-0.5">
              Est. Wait: ~{currentStage.estimatedMinutes} mins
            </span>
          </div>
        </div>

        {/* Current Location & Next Step Bar */}
        <div className="pt-4 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-hospital-300 uppercase font-bold block">Current Location</span>
            <strong className="text-white font-semibold">
              {currentStage.department} ({currentStage.room})
            </strong>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-hospital-300 uppercase font-bold block">Doctor In Charge</span>
            <strong className="text-white font-semibold">
              {activeAppointment?.doctorName || "Dr. Rajesh Rangaswamy"}
            </strong>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-hospital-300 uppercase font-bold block">Upcoming Step</span>
            <strong className="text-cyan-300 font-semibold truncate block">
              {nextStage ? nextStage.name : "All stages completed"}
            </strong>
          </div>
        </div>
      </div>

      {/* 8-Stage Timeline Stepper */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <h3 className="font-extrabold text-slate-900 text-base">Complete Hospital Visit Workflow</h3>

        <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {VISIT_STAGES.map((stage, idx) => {
            const isPassed = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isFuture = idx > currentStageIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.id} className="relative flex items-start gap-4">
                {/* Step node dot */}
                <div
                  className={`absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white transition ${
                    isPassed
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-hospital-700 text-white ring-hospital-200 animate-pulse"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>

                {/* Content Box */}
                <div
                  className={`flex-1 p-4 rounded-2xl border transition ${
                    isCurrent
                      ? "border-hospital-600 bg-hospital-50/60 shadow-xs"
                      : isPassed
                      ? "border-slate-200 bg-white"
                      : "border-slate-100 bg-slate-50/40 opacity-70"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isCurrent ? "text-hospital-700" : isPassed ? "text-emerald-600" : "text-slate-400"}`} />
                      <strong className={`text-sm ${isCurrent ? "text-hospital-900 font-bold" : "text-slate-800"}`}>
                        {stage.name}
                      </strong>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isPassed
                          ? "bg-emerald-100 text-emerald-800"
                          : isCurrent
                          ? "bg-cyan-100 text-cyan-800 font-black"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {isPassed ? "Completed" : isCurrent ? "In Progress" : "Pending"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {stage.description}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Location: <strong className="text-slate-700">{stage.department} • {stage.room}</strong></span>
                    {stage.estimatedMinutes > 0 && <span>Duration: ~{stage.estimatedMinutes} mins</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
