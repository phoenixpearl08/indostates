"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  HeartPulse,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  LogOut,
  RefreshCw,
  Plus,
  ClipboardList,
  Search,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { NurseTaskRecord } from "@/types/hms";
import { Button } from "@/components/ui/Button";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";

export default function NurseDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [tasks, setTasks] = useState<NurseTaskRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // New task form
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientUhid, setNewPatientUhid] = useState("");
  const [newTaskType, setNewTaskType] = useState<NurseTaskRecord["taskType"]>("vitals_check");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    const s = HospitalStore.getSession();
    const authorized = ["NURSE", "DOCTOR", "SUPER_ADMIN", "HOSPITAL_ADMIN", "OPERATIONS_MANAGER"];
    if (!s) {
      window.location.href = "/login?redirect=/nurse/dashboard";
      return;
    }
    if (!authorized.includes((s.role || "").toUpperCase())) {
      window.location.href = "/login?error=unauthorized_role";
      return;
    }
    setSession(s);
    setIsAuthChecking(false);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/hms/nurse");
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.tasks)) {
          setTasks(d.tasks);
        }
      }
    } catch (err) {
      console.error("Nurse task error:", err);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/hms/nurse", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          notes: "Task performed and vitals verified as clinically stable.",
          actor: {
            id: session?.id || "usr-nurse",
            name: session?.name || "Staff Nurse",
            role: "NURSE",
          },
        }),
      });

      if (res.ok) {
        setFeedback({ type: "success", message: "Nursing care task marked as completed." });
        fetchTasks();
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to update nursing task." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newDescription.trim()) return;

    setIsProcessing(true);
    try {
      const res = await fetch("/api/hms/nurse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: `apt-care-${Date.now()}`,
          patientId: `pat-${Date.now()}`,
          patientName: newPatientName.trim(),
          patientUhid: newPatientUhid.trim() || "IND-UHID-GENERAL",
          taskType: newTaskType,
          description: newDescription.trim(),
          assignedNurseName: session?.name || "Staff Nurse",
          actor: {
            id: session?.id || "usr-nurse",
            name: session?.name || "Staff Nurse",
            role: "NURSE",
          },
        }),
      });

      if (res.ok) {
        setFeedback({ type: "success", message: "New nursing task registered." });
        setNewPatientName("");
        setNewPatientUhid("");
        setNewDescription("");
        fetchTasks();
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to create task." });
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  if (isAuthChecking) {
    return <DashboardSkeleton title="Nursing Station & Patient Care Dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nurse Bar */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center shadow-md">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg leading-tight">
                Nursing Station &amp; Patient Care Dashboard
              </h1>
              <p className="text-xs text-slate-400">
                IndoStates Health Hospital • Clinical Nursing &amp; Vitals Triage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-800 text-rose-400 px-3 py-1 rounded-full border border-slate-700 font-semibold">
              Nurse: {session?.name || "Staff Nurse"}
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
          <div
            className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-500 hover:text-slate-700 font-bold">
              Dismiss
            </button>
          </div>
        )}

        {/* Action Grid: Quick Stats & New Task */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Care Task Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <Plus className="w-4 h-4 text-hospital-600" />
              <span>Log Patient Nursing Task</span>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kavitha Raman"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Patient UHID</label>
                <input
                  type="text"
                  placeholder="e.g. IND-UHID-000101"
                  value={newPatientUhid}
                  onChange={(e) => setNewPatientUhid(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Task Type</label>
                <select
                  value={newTaskType}
                  onChange={(e) => setNewTaskType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none"
                >
                  <option value="vitals_check">Vitals Monitoring &amp; Recording</option>
                  <option value="medication_admin">Medication Administration</option>
                  <option value="iv_infusion">IV Cannulation &amp; Infusion</option>
                  <option value="wound_dressing">Wound Dressing / Minor Care</option>
                  <option value="observation">Clinical Post-Procedure Observation</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Care Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Hourly SpO2 and BP monitoring following stroke protocol..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <Button type="submit" variant="primary" size="md" isLoading={isProcessing} className="w-full">
                Add to Nursing Schedule
              </Button>
            </form>
          </div>

          {/* Nursing Shift Pulse */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
                <span className="text-slate-500 text-xs font-semibold block">Pending Tasks</span>
                <span className="text-2xl font-black text-rose-600 mt-1 block">
                  {pendingTasks.length}
                </span>
                <span className="text-[10px] text-slate-400">Needs nurse action</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
                <span className="text-slate-500 text-xs font-semibold block">Completed Today</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">
                  {completedTasks.length}
                </span>
                <span className="text-[10px] text-emerald-700/70">Verified &amp; signed</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center col-span-2 sm:col-span-1">
                <span className="text-slate-500 text-xs font-semibold block">Active Shift</span>
                <span className="text-lg font-black text-slate-900 mt-1 block">Day Duty</span>
                <span className="text-[10px] text-slate-400">07:00 AM – 03:00 PM</span>
              </div>
            </div>

            {/* Task List */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex gap-4 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab("pending")}
                    className={`pb-1 ${activeTab === "pending" ? "text-rose-600 border-b-2 border-rose-600" : "text-slate-500"}`}
                  >
                    Pending Tasks ({pendingTasks.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("completed")}
                    className={`pb-1 ${activeTab === "completed" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-500"}`}
                  >
                    Completed ({completedTasks.length})
                  </button>
                </div>
                <Button variant="outline" size="sm" onClick={fetchTasks}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  <span>Refresh</span>
                </Button>
              </div>

              <div className="space-y-3">
                {(activeTab === "pending" ? pendingTasks : completedTasks).length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">
                    No {activeTab} nursing tasks.
                  </p>
                ) : (
                  (activeTab === "pending" ? pendingTasks : completedTasks).map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{task.patientName}</span>
                          <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                            {task.patientUhid}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700">{task.description}</p>
                        <span className="text-[10px] text-slate-400 block">
                          Type: {task.taskType.replace(/_/g, " ").toUpperCase()} • Assigned: {task.assignedNurseName || "General Nursing"}
                        </span>
                      </div>

                      {task.status !== "completed" ? (
                        <button
                          onClick={() => handleCompleteTask(task.id || task.taskId)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
                        >
                          Mark Completed &rarr;
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
