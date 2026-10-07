"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Clock,
  Calendar,
  Stethoscope,
  Pill,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function PatientTeleconsultationPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  // Active Tele-Appointment State
  const activeTeleAppt = {
    id: "tele-001",
    doctorName: "Dr. Rajesh Rangaswamy",
    department: "Neurovascular & Stroke Care",
    specialty: "Senior Consultant Neuro-Interventionalist",
    date: "Today",
    timeSlot: "04:30 PM - 05:00 PM",
    status: "ROOM_OPEN",
    meetingId: "ISH-TELE-8819-204",
  };

  useEffect(() => {
    const s = HospitalStore.getSession();
    if (!s) {
      window.location.href = "/login?portal=patient&redirect=/patient/teleconsultation";
      return;
    }
    setSession(s);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isInCall) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isInCall]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-100">
            Encrypted Telehealth Gateway
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-2">
            Virtual Doctor Teleconsultation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect directly with your IndoStates specialist through secure, WebRTC-compliant video consultation.
          </p>
        </div>

        <Link
          href="/book-appointment"
          className="px-5 py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
        >
          <Video className="w-4 h-4" />
          <span>Book Tele-Consult</span>
        </Link>
      </div>

      {/* Main Waiting Room / Active Call Screen */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {isInCall ? (
          /* ACTIVE VIDEO CALL ROOM */
          <div className="bg-slate-950 text-white p-6 sm:p-10 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  Room: {activeTeleAppt.meetingId}
                </span>
                <h3 className="font-bold text-base text-white">
                  Live Consultation with {activeTeleAppt.doctorName}
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{formatTimer(callDuration)}</span>
              </div>
            </div>

            {/* Simulated Two-Way Video Frames */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-80">
              {/* Doctor Frame */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-20 h-20 rounded-full bg-hospital-800 text-cyan-300 flex items-center justify-center font-bold text-2xl mb-2">
                  RR
                </div>
                <strong className="text-sm font-bold text-slate-200">{activeTeleAppt.doctorName}</strong>
                <span className="text-xs text-slate-500">{activeTeleAppt.specialty}</span>
                <span className="absolute bottom-3 left-3 bg-black/60 px-2 py-0.5 rounded text-[10px] text-slate-300">
                  Doctor Feed (Encrypted)
                </span>
              </div>

              {/* Patient Frame */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-20 h-20 rounded-full bg-cyan-900 text-cyan-200 flex items-center justify-center font-bold text-2xl mb-2">
                  {session?.name ? session.name[0].toUpperCase() : "P"}
                </div>
                <strong className="text-sm font-bold text-slate-200">{session?.name || "Patient"}</strong>
                <span className="text-xs text-slate-500">Camera: {isCameraOn ? "Active" : "Off"}</span>
                <span className="absolute bottom-3 left-3 bg-black/60 px-2 py-0.5 rounded text-[10px] text-slate-300">
                  Self Video
                </span>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-2xl transition ${
                  isMicOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-rose-600 text-white"
                }`}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`p-3 rounded-2xl transition ${
                  isCameraOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-rose-600 text-white"
                }`}
              >
                {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsInCall(false)}
                className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition"
              >
                <PhoneOff className="w-5 h-5" />
                <span>End Teleconsultation</span>
              </button>
            </div>
          </div>
        ) : (
          /* WAITING ROOM READY SCREEN */
          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Physician Online &amp; Waiting Room Ready
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-2">
                  Scheduled Consultation with {activeTeleAppt.doctorName}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {activeTeleAppt.department} • {activeTeleAppt.specialty}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 block">{activeTeleAppt.date}</span>
                <span className="text-xs text-hospital-700 font-semibold block mt-0.5">
                  {activeTeleAppt.timeSlot}
                </span>
              </div>
            </div>

            {/* Pre-call Diagnostics Check */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
              <strong className="text-slate-900 font-bold block">Hardware &amp; Network Readiness Check:</strong>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700">
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Camera: Enabled</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Microphone: Ready</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Network: Low Latency</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>End-to-end encrypted virtual consultation compliant with Telemedicine Practice Guidelines</span>
              </span>

              <button
                type="button"
                onClick={() => setIsInCall(true)}
                className="px-6 py-3 rounded-2xl bg-hospital-700 hover:bg-hospital-800 text-white font-extrabold text-xs transition flex items-center gap-2 shadow-md"
              >
                <Video className="w-4 h-4" />
                <span>Enter Video Consultation Room</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Post-Consultation Workflow Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/patient/prescriptions"
          className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-hospital-300 transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 block">Post-Consultation e-Prescription</strong>
              <span className="text-[11px] text-slate-500">Auto-synced after call completion</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-hospital-600" />
        </Link>

        <Link
          href="/patient/follow-ups"
          className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-hospital-300 transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-hospital-50 text-hospital-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 block">Follow-Up Scheduling</strong>
              <span className="text-[11px] text-slate-500">Book next review slot</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-hospital-600" />
        </Link>
      </div>
    </div>
  );
}
