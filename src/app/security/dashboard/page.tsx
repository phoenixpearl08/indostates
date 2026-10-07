"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  LogOut,
  RefreshCw,
  Plus,
  Car,
  QrCode,
  Search,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatTime } from "@/lib/utils";

interface VisitorLog {
  id: string;
  visitorName: string;
  phone: string;
  patientUhid: string;
  entryGate: string;
  badgeNumber: string;
  timeIn: string;
  status: "admitted" | "departed";
}

export default function SecurityDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([
    {
      id: "vis-1",
      visitorName: "Selvamani Murugan",
      phone: "+91 94432 11224",
      patientUhid: "IND-UHID-000101",
      entryGate: "Main OPD Gate 1",
      badgeNumber: "ATT-102",
      timeIn: "09:45 AM",
      status: "admitted",
    },
  ]);

  const [newVisitor, setNewVisitor] = useState({
    name: "",
    phone: "",
    patientUhid: "",
    entryGate: "Main Entrance Gate 1",
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const s = HospitalStore.getSession();
    const authorized = ["SECURITY_STAFF", "SUPER_ADMIN", "HOSPITAL_ADMIN", "OPERATIONS_MANAGER"];
    if (!s) {
      window.location.href = "/login?redirect=/security/dashboard";
      return;
    }
    if (!authorized.includes((s.role || "").toUpperCase())) {
      window.location.href = "/login?error=unauthorized_role";
      return;
    }
    setSession(s);
    setIsAuthChecking(false);
  }, []);

  const handleAddVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisitor.name.trim() || !newVisitor.phone.trim()) return;

    const newLog: VisitorLog = {
      id: `vis-${Date.now()}`,
      visitorName: newVisitor.name.trim(),
      phone: newVisitor.phone.trim(),
      patientUhid: newVisitor.patientUhid.trim() || "OPD Attendee",
      entryGate: newVisitor.entryGate,
      badgeNumber: `V-${visitorLogs.length + 101}`,
      timeIn: formatTime(new Date().toISOString()),
      status: "admitted",
    };

    setVisitorLogs([newLog, ...visitorLogs]);
    setNewVisitor({ name: "", phone: "", patientUhid: "", entryGate: "Main Entrance Gate 1" });
    setFeedback(`Pass ${newLog.badgeNumber} issued to ${newLog.visitorName}. Entry cleared.`);
  };

  const handleMarkDeparted = (id: string) => {
    setVisitorLogs(
      visitorLogs.map((v) => (v.id === id ? { ...v, status: "departed" } : v))
    );
  };

  if (isAuthChecking) {
    return <DashboardSkeleton title="Hospital Security & Perimeter Control..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Security Bar */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-700 text-white font-bold flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg leading-tight">
                Hospital Perimeter &amp; Visitor Security Portal
              </h1>
              <p className="text-xs text-slate-400">
                IndoStates Health Hospital • Gate Clearance, Attender Passes &amp; Emergency Access
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-800 text-emerald-400 px-3 py-1 rounded-full border border-slate-700 font-semibold">
              Officer: {session?.name || "Security Desk"}
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
        {feedback && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{feedback}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-500 font-bold">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Issue Visitor Pass Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <Plus className="w-4 h-4 text-hospital-600" />
              <span>Log Visitor / Attender Entry</span>
            </div>

            <form onSubmit={handleAddVisitor} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Visitor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newVisitor.name}
                  onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98421 99887"
                  value={newVisitor.phone}
                  onChange={(e) => setNewVisitor({ ...newVisitor, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Visiting Patient UHID</label>
                <input
                  type="text"
                  placeholder="e.g. IND-UHID-000101"
                  value={newVisitor.patientUhid}
                  onChange={(e) => setNewVisitor({ ...newVisitor, patientUhid: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Gate Location</label>
                <select
                  value={newVisitor.entryGate}
                  onChange={(e) => setNewVisitor({ ...newVisitor, entryGate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none"
                >
                  <option>Main Entrance Gate 1</option>
                  <option>Emergency Triage Ramp Gate 2</option>
                  <option>Diagnostic Wing Gate 3</option>
                </select>
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full">
                Verify &amp; Issue Badge
              </Button>
            </form>
          </div>

          {/* Active Logs Table */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Active Campus Visitor Clearance ({visitorLogs.filter((v) => v.status === "admitted").length} On Campus)
              </h3>
              <span className="text-xs text-slate-400 font-semibold">24-Hour Gate Register</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">Badge ID</th>
                    <th className="py-2.5 px-3">Visitor Name</th>
                    <th className="py-2.5 px-3">Patient UHID</th>
                    <th className="py-2.5 px-3">Time In</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visitorLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {log.badgeNumber}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-800 block">{log.visitorName}</span>
                        <span className="text-[11px] text-slate-400">{log.phone}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {log.patientUhid}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {log.timeIn}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            log.status === "admitted"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {log.status === "admitted" && (
                          <button
                            onClick={() => handleMarkDeparted(log.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold transition"
                          >
                            Mark Exit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
