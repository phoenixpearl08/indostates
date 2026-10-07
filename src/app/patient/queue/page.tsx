"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Users,
  Activity,
  Bell,
  Volume2,
  VolumeX,
  RefreshCw,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Building2,
  Radio,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";

export default function PatientQueuePage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");

  // Live Queue Metrics
  const [patientToken, setPatientToken] = useState("T-005");
  const [currentToken, setCurrentToken] = useState("T-003");
  const [patientsAhead, setPatientsAhead] = useState(2);
  const [estimatedWaitMinutes, setEstimatedWaitMinutes] = useState(12);
  const [doctorName, setDoctorName] = useState("Dr. Rajesh Rangaswamy");
  const [departmentName, setDepartmentName] = useState("Neurovascular & Stroke OPD");
  const [consultationRoom, setConsultationRoom] = useState("Suite 102 (First Floor)");
  const [queueStatus, setQueueStatus] = useState<"WAITING" | "CALLED" | "IN_PROGRESS">("WAITING");

  useEffect(() => {
    const s = HospitalStore.getSession();
    if (!s) {
      window.location.href = "/login?portal=patient&redirect=/patient/queue";
      return;
    }
    setSession(s);
    fetchLiveQueue();

    // Auto sync queue every 15 seconds
    const interval = setInterval(fetchLiveQueue, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveQueue = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/hms/queue?doctorId=dr-rajesh-rangaswamy");
      if (res.ok) {
        const d = await res.json();
        if (d.success) {
          if (d.calledToken) setCurrentToken(d.calledToken);
          if (d.waitingCount !== undefined) {
            setPatientsAhead(Math.max(1, d.waitingCount - 1));
            setEstimatedWaitMinutes(Math.max(5, (d.waitingCount - 1) * 8));
          }
        }
      }
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (err) {
      console.warn("Queue sync note:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const playChime = () => {
    if (!isAudioEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {}
  };

  const isTurnApproaching = patientsAhead <= 2;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Hospital Queue Synchronizer
            </span>
            <span className="text-xs text-slate-400 font-mono">Last sync: {lastSyncTime || "Just now"}</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-2">
            Live OPD Token Status
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time consultation queue updates for your appointment today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              isAudioEnabled
                ? "bg-cyan-50 border-cyan-200 text-cyan-800"
                : "bg-slate-50 border-slate-200 text-slate-600"
            }`}
            title="Toggle audio alert on turn announcement"
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4 text-cyan-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span>{isAudioEnabled ? "Audio Alert On" : "Muted"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              fetchLiveQueue();
              playChime();
            }}
            disabled={isSyncing}
            className="px-4 py-2 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>Sync Now</span>
          </button>
        </div>
      </div>

      {/* Approaching Turn Alert Banner */}
      {isTurnApproaching && (
        <div className="bg-amber-50 border border-amber-200 p-4 sm:p-5 rounded-3xl flex items-start gap-3.5 text-amber-900 animate-in fade-in duration-200">
          <div className="w-9 h-9 rounded-xl bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-amber-950">
              Your Turn is Approaching! (Only {patientsAhead} patient{patientsAhead !== 1 ? "s" : ""} ahead)
            </h4>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              Please proceed toward <strong>{consultationRoom}</strong> and keep your digital appointment pass or hospital ID ready for the nursing triage assistant.
            </p>
          </div>
        </div>
      )}

      {/* Big Token Status Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Your Token Card */}
        <div className="bg-gradient-to-br from-hospital-900 via-hospital-850 to-navy-950 text-white rounded-3xl p-6 sm:p-8 border border-hospital-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-300">
              Your Scheduled Token
            </span>
            <span className="text-xs font-mono font-bold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
              {queueStatus}
            </span>
          </div>

          <div className="py-2 text-center">
            <span className="text-5xl sm:text-6xl font-black font-mono tracking-widest text-white drop-shadow-md">
              {patientToken}
            </span>
            <span className="text-xs text-hospital-200 block mt-2">
              Assigned to {session?.name || "Patient"} • Ref # ISH-992201
            </span>
          </div>

          <div className="pt-4 border-t border-white/15 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-hospital-300 uppercase font-bold block">Doctor</span>
              <strong className="text-white truncate block">{doctorName}</strong>
            </div>
            <div>
              <span className="text-[10px] text-hospital-300 uppercase font-bold block">Room</span>
              <strong className="text-cyan-300 truncate block">{consultationRoom}</strong>
            </div>
          </div>
        </div>

        {/* Current Called Token Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Currently Inside Consultation Room
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" /> Live OPD
              </span>
            </div>

            <div className="py-2 text-center">
              <span className="text-5xl sm:text-6xl font-black font-mono tracking-widest text-slate-900">
                {currentToken}
              </span>
              <span className="text-xs text-slate-500 block mt-2">
                Consultation in progress with {doctorName}
              </span>
            </div>
          </div>

          {/* Metrics Pills */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Patients Ahead</span>
              <span className="text-xl font-black font-mono text-slate-800">{patientsAhead}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Wait</span>
              <span className="text-xl font-black font-mono text-hospital-700">~{estimatedWaitMinutes} min</span>
            </div>
          </div>
        </div>
      </div>

      {/* OPD Waiting Guidelines */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
        <h4 className="font-bold text-slate-900 text-sm">OPD Consultation Guidelines</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50">
            <MapPin className="w-4 h-4 text-hospital-600 shrink-0 mt-0.5" />
            <span>Stay in the designated OPD waiting lounge so nurse calls are heard clearly.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50">
            <Clock className="w-4 h-4 text-hospital-600 shrink-0 mt-0.5" />
            <span>Emergency trauma cases take immediate precedence over scheduled tokens.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50">
            <CheckCircle2 className="w-4 h-4 text-hospital-600 shrink-0 mt-0.5" />
            <span>Carry previous medical prescriptions, CT/MRI films, or lab reports into the room.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
