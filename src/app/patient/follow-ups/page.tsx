"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarClock,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Bell,
  Heart,
  Pill,
  Sparkles,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";

interface FollowUpItem {
  id: string;
  doctorName: string;
  department: string;
  originalVisitDate: string;
  recommendedDate: string;
  reason: string;
  instructions: string[];
  status: "RECOMMENDED" | "SCHEDULED" | "COMPLETED";
  appointmentId?: string;
}

export default function PatientFollowUpsPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([]);

  useEffect(() => {
    setIsMounted(true);
    setSession(HospitalStore.getSession());

    const initialList: FollowUpItem[] = [
      {
        id: "fu-01",
        doctorName: "Dr. Rajesh Rangaswamy",
        department: "Neurovascular & Stroke Care",
        originalVisitDate: "14 days ago",
        recommendedDate: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
        reason: "Evaluation of cerebral arterial Doppler & blood pressure stabilization post-TIA episode.",
        instructions: [
          "Complete repeat Lipid Profile at least 24 hours prior to visit",
          "Log morning and evening Blood Pressure readings for 7 days",
          "Bring current Atorvastatin and Aspirin medication containers",
        ],
        status: "RECOMMENDED",
      },
      {
        id: "fu-02",
        doctorName: "Dr. Saravanan Subramanian",
        department: "Interventional Cardiology",
        originalVisitDate: "30 days ago",
        recommendedDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
        reason: "Cardiac functional assessment and resting 12-lead ECG review.",
        instructions: [
          "Avoid caffeine or smoking 4 hours prior to ECG",
          "Ensure light morning breakfast",
        ],
        status: "SCHEDULED",
        appointmentId: "IND-APT-100001",
      },
    ];
    setFollowUps(initialList);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-400/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-3">
              <CalendarClock className="w-3.5 h-3.5" /> Post-Consultation Continuum
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Follow-Up Consultations &amp; Reminders</h1>
            <p className="text-indigo-100/90 text-sm mt-1 max-w-2xl leading-relaxed">
              Timely follow-ups ensure treatment efficacy and recovery monitoring. Review instructions recorded by your attending specialists and schedule your revisit with one click.
            </p>
          </div>
          <Link
            href="/patient/appointments"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-400 hover:bg-indigo-300 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 shrink-0"
          >
            <Calendar className="w-4 h-4" /> All Scheduled Visits
          </Link>
        </div>
      </div>

      {/* Follow-up Cards */}
      <div className="space-y-4">
        {followUps.map((fu) => (
          <div
            key={fu.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{fu.doctorName}</h3>
                  <span className="text-xs text-indigo-700 font-semibold">{fu.department}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    fu.status === "RECOMMENDED"
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  {fu.status === "RECOMMENDED" ? "Revisit Recommended" : "Visit Scheduled"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>Recommended Revisit Window:</span>
                  <strong className="text-slate-900 font-mono">
                    {new Date(fu.recommendedDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </strong>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  <strong>Clinical Rationale:</strong> {fu.reason}
                </p>
              </div>

              {/* Instructions Checklist */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                  Pre-Revisit Checklist:
                </span>
                {fu.instructions.map((inst, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{inst}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {fu.status === "RECOMMENDED" ? (
                <Link
                  href={`/patient/appointments?rebookDoctor=${encodeURIComponent(fu.doctorName)}&date=${fu.recommendedDate}`}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span>Book Recommended Revisit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <Link
                  href={`/patient/qr-pass?apptId=${fu.appointmentId}`}
                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>View Appointment &amp; Pass</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
