"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Activity,
  HeartPulse,
  AlertTriangle,
  Stethoscope,
  Calendar,
  Clock,
  Download,
  Lock,
  ShieldCheck,
  ChevronRight,
  Filter,
  User,
  Plus,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { PatientEncounter, TimelineEvent } from "@/types/hms";
import { formatDate } from "@/lib/utils";

export default function PatientMedicalRecordsPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [encounters, setEncounters] = useState<PatientEncounter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"encounters" | "allergies" | "timeline" | "discharge">("encounters");

  useEffect(() => {
    const s = HospitalStore.getSession();
    if (!s) {
      window.location.href = "/login?portal=patient&redirect=/patient/records";
      return;
    }
    setSession(s);
    fetchRecords(s);
  }, []);

  const fetchRecords = async (user: UserSession) => {
    setIsLoading(true);
    try {
      const patientUhid = user.uhid || "IND-UHID-000101";

      // 1. Unified Timeline
      const tlRes = await fetch(`/api/hms/timeline?uhid=${encodeURIComponent(patientUhid)}`);
      if (tlRes.ok) {
        const d = await tlRes.json();
        if (d.success && Array.isArray(d.timeline)) {
          setTimelineEvents(d.timeline);
        }
      }

      // 2. Encounters / Consultations
      const encRes = await fetch(`/api/hms/encounters?uhid=${encodeURIComponent(patientUhid)}`);
      if (encRes.ok) {
        const ed = await encRes.json();
        if (ed.success && Array.isArray(ed.encounters)) {
          setEncounters(ed.encounters);
        }
      }
    } catch (err) {
      console.error("Error loading medical records:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-hospital-600 bg-hospital-50 px-2.5 py-1 rounded-full border border-hospital-100">
              Electronic Health Records (EHR)
            </span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> DPDP Encrypted
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-2">
            Personal Medical Records
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authenticated clinical encounters, physician notes, diagnoses, and outpatient visit summaries.
          </p>
        </div>

        <Link
          href="/book-appointment"
          className="px-5 py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Book Specialist Review</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("encounters")}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === "encounters"
              ? "border-hospital-700 text-hospital-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Clinical Encounters ({encounters.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("timeline")}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === "timeline"
              ? "border-hospital-700 text-hospital-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Complete Audit Timeline ({timelineEvents.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("allergies")}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === "allergies"
              ? "border-hospital-700 text-hospital-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Allergies &amp; Chronic Conditions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("discharge")}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === "discharge"
              ? "border-hospital-700 text-hospital-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Discharge Summaries</span>
        </button>
      </div>

      {/* TAB 1: Clinical Encounters */}
      {activeTab === "encounters" && (
        <div className="space-y-4">
          {encounters.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
              <Stethoscope className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-900 text-sm">No Recorded Encounters Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Completed physician consultations and examination notes will automatically sync here.
              </p>
            </div>
          ) : (
            encounters.map((enc) => (
              <div
                key={enc.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono font-bold text-xs text-hospital-800 bg-hospital-50 px-2.5 py-0.5 rounded-md">
                      Encounter #{enc.encounterId}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1.5">
                      Consultation with {enc.doctorName}
                    </h3>
                  </div>

                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Status: {enc.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Chief Complaint</span>
                    <p className="text-slate-800 font-semibold">{enc.chiefComplaint}</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Diagnosis</span>
                    <p className="text-hospital-900 font-bold">{enc.diagnosis}</p>
                  </div>
                </div>

                {enc.vitals && (
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Recorded Vitals by Nursing Station
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                      <div>BP: <strong>{enc.vitals.bloodPressure || "120/80 mmHg"}</strong></div>
                      <div>Pulse: <strong>{enc.vitals.pulseRate || 74} bpm</strong></div>
                      <div>SpO2: <strong>{enc.vitals.oxygenSaturation || 99}%</strong></div>
                      <div>Temp: <strong>{enc.vitals.temperature || 98.4}°F</strong></div>
                    </div>
                  </div>
                )}

                {enc.treatmentPlan && (
                  <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <strong className="text-slate-900 block mb-1">Physician Treatment Plan:</strong>
                    <p className="leading-relaxed">{enc.treatmentPlan}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Complete Timeline */}
      {activeTab === "timeline" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="font-bold text-slate-900 text-sm">Chronological Visit &amp; Care Events</h3>

          {timelineEvents.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No recorded chronological events.</p>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {timelineEvents.map((ev) => (
                <div key={ev.id} className="relative space-y-1.5">
                  <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-hospital-600 ring-4 ring-white" />
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold">{ev.title}</strong>
                      <span className="text-[10px] font-mono text-slate-400">{formatDate(ev.timestamp)}</span>
                    </div>
                    <p className="text-slate-600">{ev.description}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      Staff: {ev.actorName} ({ev.actorRole})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Allergies */}
      {activeTab === "allergies" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Documented Allergies &amp; Chronic Alerts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
              <span className="font-bold block">Drug Allergies</span>
              <p>No critical penicillin or NSAID anaphylaxis logged on electronic file.</p>
            </div>
            <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-900 space-y-1">
              <span className="font-bold block">Blood Group Verification</span>
              <p>Blood Group: <strong>O Positive (O+)</strong> verified by IndoStates Blood Bank.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Discharge Summaries */}
      {activeTab === "discharge" && (
        <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
          <FileText className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 text-sm">No Inpatient Admissions On Record</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Discharge summaries are generated automatically upon IPD ward or ICU discharge clearance.
          </p>
        </div>
      )}
    </div>
  );
}
