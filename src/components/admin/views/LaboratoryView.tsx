"use client";

import React, { useState } from "react";
import {
  FlaskConical,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LaboratoryViewProps {
  labData: any;
  onRefresh: () => void;
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function LaboratoryView({ labData, onRefresh, onSetFeedback }: LaboratoryViewProps) {
  const labOrders = labData?.labOrders || [];
  const catalog = labData?.catalog || [];
  const summary = labData?.summary || {};

  const [activeSubTab, setActiveSubTab] = useState<"orders" | "catalog">("orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [showAddTestModal, setShowAddTestModal] = useState(false);

  // Release form
  const [resultsText, setResultsText] = useState("");
  const [isCritical, setIsCritical] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add test form
  const [testName, setTestName] = useState("");
  const [testDept, setTestDept] = useState("Clinical Pathology");
  const [testPrice, setTestPrice] = useState("500");
  const [testSample, setTestSample] = useState("Serum");
  const [testTurnaround, setTestTurnaround] = useState("2");

  const filteredOrders = labOrders.filter((o: any) => {
    const q = searchTerm.toLowerCase().trim();
    return (
      !q ||
      o.orderId?.toLowerCase().includes(q) ||
      o.patientName?.toLowerCase().includes(q) ||
      o.patientUhid?.toLowerCase().includes(q) ||
      o.doctorName?.toLowerCase().includes(q)
    );
  });

  const handleReleaseReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !resultsText) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "release_report",
          labOrderId: selectedOrder.id,
          resultsText,
          criticalValues: isCritical,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        setShowReleaseModal(false);
        setSelectedOrder(null);
        setResultsText("");
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to release report." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error releasing lab report." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName || !testPrice) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_test",
          name: testName,
          department: testDept,
          price: testPrice,
          sampleType: testSample,
          turnaroundHours: testTurnaround,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        setShowAddTestModal(false);
        setTestName("");
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to add test." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error adding test." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Diagnostic Laboratory &amp; Pathology</h2>
          <p className="text-xs text-slate-500">
            Automated specimen tracking, clinical findings release, turnaround time monitoring, and test catalog
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeSubTab === "orders" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveSubTab("orders")}
            className="text-xs"
          >
            <span>Lab Orders Queue</span>
          </Button>
          <Button
            variant={activeSubTab === "catalog" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveSubTab("catalog")}
            className="text-xs"
          >
            <span>Test Catalog ({catalog.length})</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddTestModal(true)}
            className="text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Add Test</span>
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Total Laboratory Orders</div>
          <div className="text-lg font-black text-slate-800 mt-1">{summary.totalOrders ?? 0} Orders</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Clinical Pipeline</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-amber-600">Pending Processing</div>
          <div className="text-lg font-black text-amber-700 mt-1">{summary.pendingReports ?? 0} Pending</div>
          <div className="text-[10px] text-amber-600 mt-0.5">Awaiting Release</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-emerald-600">Released Reports</div>
          <div className="text-lg font-black text-emerald-700 mt-1">{summary.releasedReports ?? 0} Verified</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Signed by Pathologist</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-sky-600">Average Turnaround</div>
          <div className="text-lg font-black text-sky-700 mt-1">{summary.turnaroundAverage || "1.8 hrs"}</div>
          <div className="text-[10px] text-sky-600 mt-0.5">Sample to Result</div>
        </div>
      </div>

      {activeSubTab === "orders" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders by ID, patient, or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none bg-white"
              />
            </div>
            <span className="text-xs font-bold text-slate-500">{filteredOrders.length} Orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Order ID</th>
                  <th className="py-2.5 px-4">Patient Name &amp; UHID</th>
                  <th className="py-2.5 px-4">Ordered Tests</th>
                  <th className="py-2.5 px-4">Prescribing Doctor</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-hospital-800">{ord.orderId}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{ord.patientName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{ord.patientUhid}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">
                          {ord.tests?.map((t: any) => t.testName).join(", ")}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{ord.doctorName}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            ord.isReportReleased
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {ord.isReportReleased ? "REPORT RELEASED" : ord.status || "PROCESSING"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!ord.isReportReleased ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(ord);
                              setShowReleaseModal(true);
                            }}
                            className="text-[11px] h-7 px-2.5"
                          >
                            Release Report
                          </Button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-semibold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-slate-400">
                      No laboratory orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Test Catalog Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {catalog.map((t: any) => (
            <div
              key={t.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-hospital-700 bg-hospital-50 px-2 py-0.5 rounded-md">
                    {t.department}
                  </span>
                  <span className="font-mono text-xs text-slate-400">Sample: {t.sampleType}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 mt-2 leading-snug">{t.name}</h4>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">PRICE</span>
                  <span className="text-sm font-black text-slate-900">₹{t.price}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">TURNAROUND</span>
                  <span className="text-xs font-bold text-slate-700">{t.turnaroundHours} hrs</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Release Lab Report Modal */}
      {showReleaseModal && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Release Diagnostic Report</h3>
                <span className="text-xs text-amber-400 font-mono">{selectedOrder.orderId}</span>
              </div>
              <button
                onClick={() => setShowReleaseModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReleaseReport} className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800">{selectedOrder.patientName}</div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {selectedOrder.patientUhid} • Doctor: {selectedOrder.doctorName}
                </div>
                <div className="text-xs font-semibold text-hospital-700 mt-1">
                  Tests: {selectedOrder.tests?.map((t: any) => t.testName).join(", ")}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Findings &amp; Values *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Hemoglobin: 14.2 g/dL (Normal). Platelets: 245,000 /mcL. WBC: 6,800 /mcL. No atypical cells seen."
                  value={resultsText}
                  onChange={(e) => setResultsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                <input
                  type="checkbox"
                  id="critCheck"
                  checked={isCritical}
                  onChange={(e) => setIsCritical(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="critCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Flag as Critical Value (alerts attending physician immediately)
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowReleaseModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Releasing..." : "Authorize & Release Report"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Test to Catalog Modal */}
      {showAddTestModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Add Diagnostic Test to Catalog</h3>
              </div>
              <button
                onClick={() => setShowAddTestModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTest} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Test Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Serum Ferritin & Iron Studies"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Diagnostic Wing</label>
                  <select
                    value={testDept}
                    onChange={(e) => setTestDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                  >
                    <option value="Clinical Pathology">Clinical Pathology</option>
                    <option value="Clinical Biochemistry">Clinical Biochemistry</option>
                    <option value="Neuroradiology">Neuroradiology</option>
                    <option value="Diagnostic Radiology">Diagnostic Radiology</option>
                    <option value="Microbiology">Microbiology</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Standard Rate (₹) *</label>
                  <input
                    type="number"
                    required
                    value={testPrice}
                    onChange={(e) => setTestPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sample Type</label>
                  <input
                    type="text"
                    value={testSample}
                    onChange={(e) => setTestSample(e.target.value)}
                    placeholder="Serum / Whole Blood / Urine"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Turnaround (Hours)</label>
                  <input
                    type="number"
                    value={testTurnaround}
                    onChange={(e) => setTestTurnaround(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowAddTestModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add to Hospital Catalog"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
