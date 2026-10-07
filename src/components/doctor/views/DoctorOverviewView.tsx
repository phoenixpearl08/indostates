"use client";

import React from "react";
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Pill,
  FlaskConical,
  ArrowRight,
  UserCheck,
  Search,
  CalendarClock,
  Sparkles,
  Siren,
  Play,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { DoctorOverviewStats } from "@/lib/doctorService";
import { Doctor } from "@/data/hospitalData";
import { DoctorTabId } from "../DoctorSidebar";
import { QueueEntry } from "@/types/hms";

interface DoctorOverviewViewProps {
  stats: DoctorOverviewStats;
  doctor: Doctor;
  onSelectTab: (tab: DoctorTabId) => void;
  onStartConsultationForPatient: (patient: QueueEntry) => void;
}

export function DoctorOverviewView({
  stats,
  doctor,
  onSelectTab,
  onStartConsultationForPatient,
}: DoctorOverviewViewProps) {
  return (
    <div className="space-y-6">
      {/* 1. Quick Actions Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Sparkles className="w-4 h-4 text-hospital-600" />
            <span>Clinical Quick Actions:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (stats.nextPatient) {
                  onStartConsultationForPatient(stats.nextPatient);
                } else {
                  onSelectTab("consultation");
                }
              }}
              className="px-3.5 py-1.5 rounded-lg bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Consultation</span>
            </button>

            <button
              onClick={() => onSelectTab("queue")}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-slate-600" />
              <span>View Queue ({stats.waitingPatientsCount})</span>
            </button>

            <button
              onClick={() => onSelectTab("search")}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-600" />
              <span>Search Patient</span>
            </button>

            <button
              onClick={() => onSelectTab("prescriptions")}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Pill className="w-3.5 h-3.5 text-hospital-600" />
              <span>New Prescription</span>
            </button>

            <button
              onClick={() => onSelectTab("lab-orders")}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
              <span>Order Lab Test</span>
            </button>

            <button
              onClick={() => onSelectTab("schedule")}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              <span>View Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Urgent Emergency / Priority Alert (If any) */}
      {stats.emergencyPriorityCount > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-4 text-rose-900 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Siren className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">
                Priority / Acute Clinical Attention Required ({stats.emergencyPriorityCount} Cases)
              </div>
              <div className="text-xs text-rose-700">
                Urgent triage patients or priority queues are waiting for doctor assessment.
              </div>
            </div>
          </div>
          <button
            onClick={() => onSelectTab("queue")}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 shadow-2xs transition-colors"
          >
            Review Priority
          </button>
        </div>
      )}

      {/* 3. Next Patient Spotlight Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-gradient-to-br from-hospital-900 via-hospital-800 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-hospital-200 text-xs font-bold tracking-wide uppercase backdrop-blur-xs">
                <Clock className="w-3.5 h-3.5" />
                Next Patient in Queue
              </span>
              <span className="text-xs font-medium text-slate-300">
                {stats.opdRoom}
              </span>
            </div>

            {stats.nextPatient ? (
              <div className="space-y-2 mt-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-white text-hospital-900 font-extrabold text-sm shadow-xs">
                    Token {stats.nextPatient.tokenNumber}
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    {stats.nextPatient.patientName}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-hospital-200 font-medium">
                  <span>UHID: {stats.nextPatient.patientUhid}</span>
                  <span>•</span>
                  <span>Checked In: {new Date(stats.nextPatient.checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  <span>•</span>
                  <span className="capitalize">Status: {stats.nextPatient.status.replace("_", " ")}</span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-slate-300 text-sm font-medium">
                No patients currently waiting in queue. New check-ins at reception will immediately appear here.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 relative z-10">
            <div className="text-xs text-slate-300">
              {stats.waitingPatientsCount} total patients in waiting lounge
            </div>

            {stats.nextPatient && (
              <button
                onClick={() => onStartConsultationForPatient(stats.nextPatient!)}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-hospital-50 text-hospital-900 font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
              >
                <Stethoscope className="w-4 h-4 text-hospital-700" />
                <span>START CONSULTATION</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Decorative background glow */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-hospital-500/20 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Current Active Consultation Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                In-Consultation Status
              </span>
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  stats.currentPatient ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                }`}
              />
            </div>

            {stats.currentPatient ? (
              <div className="space-y-3 mt-2">
                <div>
                  <span className="text-[11px] font-bold text-hospital-700 uppercase">Active Session</span>
                  <div className="text-lg font-bold text-slate-900">
                    {stats.currentPatient.patientName}
                  </div>
                  <div className="text-xs text-slate-500">
                    Token {stats.currentPatient.tokenNumber} • {stats.currentPatient.patientUhid}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="text-slate-500">Started: Just now</div>
                  <div className="font-medium text-slate-700">Clinical notes & vitals entry active</div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400 text-xs">
                <UserCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                No active consultation in progress. Click Start Consultation on the next patient.
              </div>
            )}
          </div>

          <button
            onClick={() => onSelectTab("consultation")}
            className="w-full mt-4 py-2 px-3 rounded-lg border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Open Consultation Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Primary Operational KPI Cards (6 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Today's Total"
          value={stats.todayAppointmentsCount}
          subtitle="Registered & Walk-in"
          variant="primary"
          icon={<Users className="w-5 h-5 text-hospital-600" />}
        />
        <StatCard
          title="Waiting Queue"
          value={stats.waitingPatientsCount}
          subtitle="In reception lounge"
          variant={stats.waitingPatientsCount > 5 ? "warning" : "default"}
          icon={<Clock className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title="Completed Consults"
          value={stats.completedConsultationsCount}
          subtitle="Finished today"
          variant="success"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Remaining Patients"
          value={stats.remainingPatientsCount}
          subtitle="To be examined"
          variant="default"
          icon={<Stethoscope className="w-5 h-5 text-slate-600" />}
        />
        <StatCard
          title="Pending Lab Tests"
          value={stats.pendingLabReportsCount}
          subtitle="Awaiting reports"
          variant="default"
          icon={<FlaskConical className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title="Follow-ups Today"
          value={stats.followUpsTodayCount}
          subtitle="Scheduled review"
          variant="primary"
          icon={<CalendarClock className="w-5 h-5 text-hospital-600" />}
        />
      </div>

      {/* 5. Clinical Queue Snapshot */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Today's Patient Queue Overview</h3>
            <p className="text-xs text-slate-500">Live order of consultation arrivals from Front Office Reception</p>
          </div>
          <button
            onClick={() => onSelectTab("queue")}
            className="text-xs font-bold text-hospital-700 hover:text-hospital-900 flex items-center gap-1"
          >
            <span>Full Queue Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats.waitingPatientsCount === 0 && stats.completedConsultationsCount === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No patient check-ins recorded for today yet. Reception check-ins sync automatically here.
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-12 text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 px-3">
              <span className="col-span-2">Token</span>
              <span className="col-span-4">Patient Name & UHID</span>
              <span className="col-span-3">Check-In Time</span>
              <span className="col-span-3 text-right">Queue Action</span>
            </div>

            {/* Quick Next Patients Preview */}
            <div className="divide-y divide-slate-100 text-xs">
              {stats.nextPatient && (
                <div className="grid grid-cols-12 items-center py-2.5 px-3 bg-hospital-50/50 rounded-lg font-medium">
                  <span className="col-span-2 font-bold text-hospital-800">
                    Token {stats.nextPatient.tokenNumber}
                  </span>
                  <div className="col-span-4">
                    <div className="font-bold text-slate-900">{stats.nextPatient.patientName}</div>
                    <div className="text-[10px] text-slate-500">{stats.nextPatient.patientUhid}</div>
                  </div>
                  <span className="col-span-3 text-slate-600">
                    {new Date(stats.nextPatient.checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <div className="col-span-3 text-right">
                    <button
                      onClick={() => onStartConsultationForPatient(stats.nextPatient!)}
                      className="px-3 py-1 rounded-md bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-[11px]"
                    >
                      Start
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
