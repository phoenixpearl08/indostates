"use client";

import React, { useState, useEffect } from "react";
import {
  FlaskConical,
  Search,
  Plus,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Building2,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { Doctor } from "@/data/hospitalData";
import { DoctorLabOrderRecord } from "@/lib/doctorService";

interface DoctorLabOrdersViewProps {
  doctor: Doctor;
  onOpenPatientProfile: (patientId: string) => void;
  onViewReportsTab?: () => void;
}

export function DoctorLabOrdersView({
  doctor,
  onOpenPatientProfile,
  onViewReportsTab,
}: DoctorLabOrdersViewProps) {
  const [labOrders, setLabOrders] = useState<DoctorLabOrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Standalone lab order modal
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState({
    patientUhid: "",
    testName: "Complete Blood Count (CBC)",
    priority: "routine" as "routine" | "urgent" | "stat",
    clinicalIndication: "Clinical assessment & workup",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadLabOrders();
  }, [statusFilter]);

  const loadLabOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = statusFilter === "all"
        ? "/api/doctor/lab-orders"
        : `/api/doctor/lab-orders?status=${statusFilter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load lab orders");
      const data = await res.json();
      setLabOrders(data.labOrders || []);
    } catch (err: any) {
      console.error("Lab orders error:", err);
      setError(err.message || "Failed to load lab orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLabOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.patientUhid.trim() || !orderForm.testName.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      // Find patient by UHID first
      const pRes = await fetch(`/api/doctor/patients?q=${encodeURIComponent(orderForm.patientUhid.trim())}`);
      const pData = await pRes.json();
      const patient = pData.patients?.[0];

      if (!patient) {
        throw new Error(`Patient with UHID "${orderForm.patientUhid}" not found.`);
      }

      const payload = {
        patientId: patient.id,
        patientName: patient.name,
        patientUhid: patient.uhid,
        tests: [
          {
            testName: orderForm.testName,
            priority: orderForm.priority,
            clinicalIndication: orderForm.clinicalIndication,
          },
        ],
        priority: orderForm.priority,
        clinicalIndication: orderForm.clinicalIndication,
      };

      const res = await fetch("/api/doctor/lab-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit lab order");

      setShowOrderModal(false);
      setSuccessMsg("Investigation ordered successfully. Sent to Central Pathology Laboratory.");
      loadLabOrders();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setError(err.message || "Failed to create lab order");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = labOrders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.patientName.toLowerCase().includes(q) ||
      o.patientUhid.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q) ||
      o.tests.some((t: any) => t.testName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-hospital-600" />
              Doctor Diagnostic & Laboratory Orders
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Pathology, Hematology, Biochemistry, and Radiology investigation orders for Dr. {doctor.name}'s patients.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOrderModal(true)}
              className="px-4 py-2 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Order Lab Test</span>
            </button>

            <button
              onClick={loadLabOrders}
              disabled={loading}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Refresh lab orders"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Success / Error Banners */}
        {successMsg && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Filters */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Patient Name, UHID, or Test Name..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 rounded-xl border border-slate-200 text-xs bg-white font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Sample</option>
              <option value="processing">In Processing</option>
              <option value="completed">Completed / Released</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-hospital-600 mb-2" />
            <span>Loading lab orders...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FlaskConical className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No Diagnostic Orders Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No orders found for the selected filter. You can order investigations during consultation or using the button above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Order ID & Date</th>
                  <th className="py-3 px-4 font-bold">Patient Details</th>
                  <th className="py-3 px-4 font-bold">Investigations Ordered</th>
                  <th className="py-3 px-4 font-bold">Priority</th>
                  <th className="py-3 px-4 font-bold">Laboratory Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((order) => {
                  const isCompleted = order.status === "completed";
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-hospital-800">{order.id}</div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{order.patientName}</div>
                        <div className="font-mono text-[11px] text-slate-500">{order.patientUhid}</div>
                      </td>

                      <td className="py-3 px-4 max-w-sm">
                        <div className="flex flex-wrap gap-1">
                          {order.tests.map((t: any, idx: number) => (
                            <span
                              key={idx}
                              className="bg-slate-100 text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded border border-slate-200"
                            >
                              {t.testName}
                            </span>
                          ))}
                        </div>
                        {order.clinicalIndication && (
                          <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                            Indication: {order.clinicalIndication}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            order.priority === "stat"
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : order.priority === "urgent"
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {order.priority}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isCompleted
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : order.status === "processing"
                              ? "bg-sky-50 text-sky-700 border border-sky-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {order.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenPatientProfile(order.patientId)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                          >
                            Dossier
                          </button>

                          {isCompleted && onViewReportsTab && (
                            <button
                              onClick={onViewReportsTab}
                              className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1 border border-emerald-200 transition-colors"
                            >
                              <FileText className="w-3 h-3" />
                              <span>View Report</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Standalone Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-hospital-600" />
                Order Clinical Investigation
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLabOrder} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Patient UHID</label>
                <input
                  type="text"
                  required
                  value={orderForm.patientUhid}
                  onChange={(e) => setOrderForm({ ...orderForm, patientUhid: e.target.value })}
                  placeholder="e.g. ISH-2026-0001"
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Investigation Name</label>
                <input
                  type="text"
                  required
                  value={orderForm.testName}
                  onChange={(e) => setOrderForm({ ...orderForm, testName: e.target.value })}
                  placeholder="e.g. Complete Blood Count (CBC) / Lipid Profile"
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={orderForm.priority}
                    onChange={(e: any) => setOrderForm({ ...orderForm, priority: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white font-bold"
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="stat">STAT / Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Lab</label>
                  <input
                    type="text"
                    disabled
                    value="Central Pathology"
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clinical Indication</label>
                <input
                  type="text"
                  value={orderForm.clinicalIndication}
                  onChange={(e) => setOrderForm({ ...orderForm, clinicalIndication: e.target.value })}
                  placeholder="e.g. Routine pre-op clearance / Suspected infection"
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-3.5 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-hospital-600 hover:bg-hospital-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors disabled:opacity-50"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Submit Lab Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
