"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FlaskConical,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RefreshCw,
  FileCheck,
  Upload,
  Search,
  Check,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { LabOrderRecord } from "@/types/hms";
import { Button } from "@/components/ui/Button";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";

export default function LabDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [orders, setOrders] = useState<LabOrderRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "released">("pending");
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Report release modal/state
  const [selectedOrder, setSelectedOrder] = useState<LabOrderRecord | null>(null);
  const [reportSummary, setReportSummary] = useState("Values evaluated within standard reference range.");
  const [verifierName, setVerifierName] = useState("Dr. Anita Chandrasekhar (MD Pathology)");

  useEffect(() => {
    const s = HospitalStore.getSession();
    const authorized = ["LAB_TECHNICIAN", "LAB_VERIFIER", "SUPER_ADMIN", "HOSPITAL_ADMIN", "OPERATIONS_MANAGER"];
    if (!s) {
      window.location.href = "/login?redirect=/lab/dashboard";
      return;
    }
    if (!authorized.includes((s.role || "").toUpperCase())) {
      window.location.href = "/login?error=unauthorized_role";
      return;
    }
    setSession(s);
    setIsAuthChecking(false);
    fetchLabOrders();
  }, []);

  const fetchLabOrders = async () => {
    try {
      const res = await fetch("/api/hms/lab");
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.labOrders)) {
          setOrders(d.labOrders);
        }
      }
    } catch (err) {
      console.error("Lab fetch error:", err);
    }
  };

  const handleUpdateSampleStatus = async (
    orderId: string,
    sampleStatus: "collected" | "processing" | "completed"
  ) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/hms/lab", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sample",
          orderId,
          sampleStatus,
          actor: {
            id: session?.id || "usr-lab",
            name: session?.name || "Lab Technologist",
            role: "LAB_TECHNICIAN",
          },
        }),
      });

      if (res.ok) {
        setFeedback({ type: "success", message: `Sample status progressed to ${sampleStatus}.` });
        fetchLabOrders();
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to update sample status." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReleaseReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsProcessing(true);
    try {
      const res = await fetch("/api/hms/lab", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "release",
          orderId: selectedOrder.id || selectedOrder.orderId,
          reportUrl: `/reports/lab-${selectedOrder.orderId}.pdf`,
          reportSummary: reportSummary.trim(),
          verifiedBy: verifierName.trim(),
          actor: {
            id: session?.id || "usr-lab",
            name: session?.name || "Lab Technologist",
            role: "LAB_TECHNICIAN",
          },
        }),
      });

      if (res.ok) {
        setFeedback({
          type: "success",
          message: `Diagnostic report for ${selectedOrder.orderId} verified and released to patient portal.`,
        });
        setSelectedOrder(null);
        fetchLabOrders();
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to release report." });
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingOrders = orders.filter((o) => !o.isReportReleased);
  const releasedOrders = orders.filter((o) => o.isReportReleased);

  if (isAuthChecking) {
    return <DashboardSkeleton title="Central Diagnostic Laboratory Portal..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Lab Bar */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center shadow-md">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg leading-tight">
                Central Diagnostic Laboratory Portal
              </h1>
              <p className="text-xs text-slate-400">
                IndoStates Health Hospital • Pathology, Biochemistry &amp; Diagnostic Release
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-800 text-purple-400 px-3 py-1 rounded-full border border-slate-700 font-semibold">
              Tech: {session?.name || "Senior Technologist"}
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

        {/* Pulse Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
            <span className="text-slate-500 text-xs font-semibold block">Pending Tests</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">
              {pendingOrders.length}
            </span>
            <span className="text-[10px] text-slate-400">Needs processing / upload</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
            <span className="text-slate-500 text-xs font-semibold block">Released to Portal</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {releasedOrders.length}
            </span>
            <span className="text-[10px] text-emerald-700/70">Verified by Pathologist</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
            <span className="text-slate-500 text-xs font-semibold block">Central Lab Quality</span>
            <span className="text-lg font-black text-purple-700 mt-1 block">NABL Protocol</span>
            <span className="text-[10px] text-slate-400">Automated analyzers calibrated</span>
          </div>
        </div>

        {/* Orders Table Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex gap-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab("pending")}
                className={`pb-2 ${activeTab === "pending" ? "text-purple-600 border-b-2 border-purple-600" : "text-slate-500"}`}
              >
                In Processing / Pending ({pendingOrders.length})
              </button>
              <button
                onClick={() => setActiveTab("released")}
                className={`pb-2 ${activeTab === "released" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-500"}`}
              >
                Released Reports ({releasedOrders.length})
              </button>
            </div>

            <Button variant="outline" size="sm" onClick={fetchLabOrders}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              <span>Refresh</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Diagnostic Test</th>
                  <th className="py-3 px-4">Ordering Doctor</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(activeTab === "pending" ? pendingOrders : releasedOrders).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No orders in this category.
                    </td>
                  </tr>
                ) : (
                  (activeTab === "pending" ? pendingOrders : releasedOrders).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {order.orderId}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800 block">{order.patientName}</span>
                        <span className="text-[11px] text-slate-400">{order.sampleType}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {order.testName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {order.doctorName}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            order.isReportReleased
                              ? "bg-emerald-100 text-emerald-800"
                              : order.sampleStatus === "collected"
                              ? "bg-blue-100 text-blue-800"
                              : order.sampleStatus === "processing"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.isReportReleased ? "Released" : order.sampleStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {!order.isReportReleased ? (
                          <>
                            {order.sampleStatus === "ordered" && (
                              <button
                                onClick={() => handleUpdateSampleStatus(order.id || order.orderId, "collected")}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px]"
                              >
                                Collect Sample
                              </button>
                            )}
                            {order.sampleStatus === "collected" && (
                              <button
                                onClick={() => handleUpdateSampleStatus(order.id || order.orderId, "processing")}
                                className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold text-[11px]"
                              >
                                Start Process
                              </button>
                            )}
                            {order.sampleStatus === "processing" && (
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]"
                              >
                                Upload &amp; Release &rarr;
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Published
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Release Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-900 text-base">
                  Verify &amp; Release Diagnostic Report
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                <p><strong>Patient:</strong> {selectedOrder.patientName}</p>
                <p><strong>Test:</strong> {selectedOrder.testName}</p>
              </div>

              <form onSubmit={handleReleaseReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pathologist Clinical Findings / Summary *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reportSummary}
                    onChange={(e) => setReportSummary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Verifying Pathologist Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={verifierName}
                    onChange={(e) => setVerifierName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" size="md" type="button" onClick={() => setSelectedOrder(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="md" type="submit" isLoading={isProcessing}>
                    Authorize &amp; Release to Portal
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
