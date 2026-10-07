"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  PhoneCall,
  Ambulance,
  HeartPulse,
  MapPin,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Navigation,
  Activity,
  ArrowRight,
  Info,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";

export default function PatientEmergencyPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Ambulance request state
  const [pickupLocation, setPickupLocation] = useState("");
  const [patientCondition, setPatientCondition] = useState("Severe Chest Pain / Heart Emergency");
  const [callerPhone, setCallerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ambulanceDispatched, setAmbulanceDispatched] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const s = HospitalStore.getSession();
    setSession(s);
    setCallerPhone(s?.phone || "+91 94432 11223");
  }, []);

  const handleRequestAmbulance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupLocation || !callerPhone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const dispatchId = `AMB-DISP-${Math.floor(1000 + Math.random() * 9000)}`;
      setIsSubmitting(false);
      setAmbulanceDispatched(dispatchId);
    }, 700);
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* High-Alert Emergency Banner */}
      <div className="bg-gradient-to-r from-red-950 via-rose-900 to-red-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border-2 border-red-500/40">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/30 border border-red-400 text-red-100 text-xs font-bold mb-3 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-amber-300" /> LEVEL-1 TRAUMA &amp; EMERGENCY CARE
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              24/7 Emergency &amp; Trauma Bay
            </h1>
            <p className="text-red-100/90 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              IndoStates Hospital operates a dedicated 24-hour Advanced Resuscitation Bay, Cardiac Cath Lab STEMI fast-track, and acute Stroke Code IV thrombolysis team.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href="tel:+914224000108"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-red-50 text-red-950 font-black text-sm transition-all shadow-xl active:scale-95"
            >
              <PhoneCall className="w-5 h-5 text-red-600" />
              <span>Call Hotline: +91 422 4000108</span>
            </a>
            <a
              href="tel:108"
              className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm transition-all border border-red-400 active:scale-95"
            >
              <Ambulance className="w-5 h-5" />
              <span>Dial 108</span>
            </a>
          </div>
        </div>
      </div>

      {/* Ambulance Dispatch Notification */}
      {ambulanceDispatched && (
        <div className="p-6 rounded-3xl bg-red-50 border-2 border-red-300 text-red-950 shadow-md space-y-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
              <Ambulance className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-red-950">Ambulance Dispatch Alert Logged!</h3>
              <p className="text-xs text-red-800">
                Dispatch Reference: <strong className="font-mono">{ambulanceDispatched}</strong>. Central Control Room is assigning the nearest Advanced Cardiac Life Support (ACLS) unit. Driver and medical officer will call immediately.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2-Column: Request Ambulance & Triage Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Ambulance Request Card (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
              <Ambulance className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Request Emergency Ambulance</h2>
              <span className="text-xs text-slate-500">ACLS with Onboard Ventilator &amp; Defibrillator</span>
            </div>
          </div>

          <form onSubmit={handleRequestAmbulance} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pickup Address &amp; Location *</label>
              <textarea
                required
                rows={2}
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Enter exact landmark, building name, street, and area..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Emergency Nature / Condition *</label>
              <select
                value={patientCondition}
                onChange={(e) => setPatientCondition(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="Severe Chest Pain / Heart Emergency">Acute Severe Chest Pain / Heart Attack Suspected</option>
                <option value="Stroke Signs (Face Droop, Arm Weakness, Slurred Speech)">Acute Stroke Signs (FAST protocol)</option>
                <option value="Severe Road Traffic Accident / Trauma">Road Traffic Accident / Orthopedic Trauma</option>
                <option value="Acute Respiratory Distress / Breathlessness">Severe Respiratory Distress / Low SpO2</option>
                <option value="Unconscious / Seizure Episode">Unconscious Patient / Prolonged Seizure</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Phone Number *</label>
              <input
                type="tel"
                required
                value={callerPhone}
                onChange={(e) => setCallerPhone(e.target.value)}
                placeholder="+91 94432 11223"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-lg shadow-red-600/25 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Transmitting Alert..." : "Dispatch Ambulance Alert"}
            </button>
          </form>
        </div>

        {/* Triage Guidelines (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-red-600" />
              <span>Hospital Arrival Information</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                <span className="font-bold text-red-900 block">RED — Resuscitation Priority</span>
                <p className="text-red-700 mt-0.5 text-[11px] leading-relaxed">
                  Immediate zero-wait bedside access. Direct alert to Emergency Consultant, Cardiologist &amp; Anesthetist.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                <span className="font-bold text-amber-900 block">YELLOW — Urgent Care</span>
                <p className="text-amber-800 mt-0.5 text-[11px] leading-relaxed">
                  High fevers, fractures, acute abdominal colic. Triaged within 10 minutes.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="font-bold text-emerald-900 block">GREEN — Semi-Urgent / Minor</span>
                <p className="text-emerald-800 mt-0.5 text-[11px] leading-relaxed">
                  Minor lacerations, mild sprains, stable vital signs.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <MapPin className="w-4 h-4 text-red-600" /> Location:
              </div>
              <p className="text-[11px]">
                IndoStates Hospital Main Campus, Emergency Bay, Ground Floor, Avinashi Road, Coimbatore - 641014.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
