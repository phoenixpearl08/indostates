"use client";

import React, { useState } from "react";
import {
  Pill,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Package,
  X,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PharmacyViewProps {
  pharmacyData: any;
  onRefresh: () => void;
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function PharmacyView({ pharmacyData, onRefresh, onSetFeedback }: PharmacyViewProps) {
  const inventory = pharmacyData?.inventory || [];
  const prescriptions = pharmacyData?.prescriptions || [];
  const summary = pharmacyData?.summary || {};
  const lowStock = pharmacyData?.lowStock || [];
  const expiringSoon = pharmacyData?.expiringSoon || [];

  const [activeSubTab, setActiveSubTab] = useState<"inventory" | "prescriptions">("inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Adjust Form
  const [quantityChange, setQuantityChange] = useState("100");
  const [adjustReason, setAdjustReason] = useState("Routine Stock Replenishment");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add Medicine Form
  const [medicineName, setMedicineName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [category, setCategory] = useState("Analgesic");
  const [form, setForm] = useState("Tablet");
  const [strength, setStrength] = useState("500mg");
  const [currentStock, setCurrentStock] = useState("200");
  const [reorderLevel, setReorderLevel] = useState("50");
  const [unitPrice, setUnitPrice] = useState("15");
  const [supplier, setSupplier] = useState("MedSource India Ltd");

  const filteredInventory = inventory.filter((item: any) => {
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.medicineName?.toLowerCase().includes(q) ||
      item.genericName?.toLowerCase().includes(q) ||
      item.itemCode?.toLowerCase().includes(q);
    const matchCat = categoryFilter === "ALL" || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const categories = Array.from(new Set(inventory.map((i: any) => i.category))).filter(Boolean);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !quantityChange) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/pharmacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "adjust_stock",
          itemCode: selectedItem.itemCode,
          quantityChange: Number(quantityChange),
          reason: adjustReason,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        setShowAdjustModal(false);
        setSelectedItem(null);
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to adjust stock." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error adjusting pharmacy inventory." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName || !currentStock) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/pharmacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_medicine",
          medicineName,
          genericName,
          category,
          form,
          strength,
          currentStock: Number(currentStock),
          reorderLevel: Number(reorderLevel),
          unitPrice: Number(unitPrice),
          supplier,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        setShowAddModal(false);
        setMedicineName("");
        setGenericName("");
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to add medicine." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error adding medicine to formulary." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Pharmacy Formulary &amp; Inventory</h2>
          <p className="text-xs text-slate-500">
            Control medication inventory, batch expiration dates, reorder threshold alerts, and dispensing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeSubTab === "inventory" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveSubTab("inventory")}
            className="text-xs"
          >
            <span>Medicine Inventory</span>
          </Button>
          <Button
            variant={activeSubTab === "prescriptions" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveSubTab("prescriptions")}
            className="text-xs"
          >
            <span>Prescriptions Queue ({prescriptions.length})</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Add Medication</span>
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Formulary Items</div>
          <div className="text-lg font-black text-slate-800 mt-1">{summary.totalItems ?? 0} Products</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{summary.totalStockUnits ?? 0} Total Units</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-rose-600">Low Stock Warnings</div>
          <div className="text-lg font-black text-rose-700 mt-1">{summary.lowStockItemsCount ?? 0} Items</div>
          <div className="text-[10px] text-rose-600 mt-0.5">Below Reorder Level</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-amber-600">Batch Expiry Watch</div>
          <div className="text-lg font-black text-amber-700 mt-1">{summary.expiringSoonCount ?? 0} Batches</div>
          <div className="text-[10px] text-amber-600 mt-0.5">Expiring in &lt; 90 Days</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-emerald-600">Dispensing Queue</div>
          <div className="text-lg font-black text-emerald-700 mt-1">
            {summary.dispensedPrescriptions ?? 0} Dispensed
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {summary.pendingDispensing ?? 0} Pending Handout
          </div>
        </div>
      </div>

      {activeSubTab === "inventory" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search medication by brand, generic, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs font-semibold text-slate-700 py-1.5 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c: any) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <span className="text-xs font-bold text-slate-500">{filteredInventory.length} Medicines</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Code</th>
                  <th className="py-2.5 px-4">Medication &amp; Generic</th>
                  <th className="py-2.5 px-4">Dosage / Form</th>
                  <th className="py-2.5 px-4">Stock Units</th>
                  <th className="py-2.5 px-4">Unit Rate</th>
                  <th className="py-2.5 px-4">Batch &amp; Expiry</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventory.map((item: any) => {
                  const isLow = item.currentStock <= item.reorderLevel;
                  const firstBatch = item.batches?.[0];
                  return (
                    <tr key={item.itemCode} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-hospital-800">{item.itemCode}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.medicineName}</div>
                        <div className="text-[11px] text-slate-400 italic">{item.genericName}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {item.form} • <span className="font-semibold text-slate-800">{item.strength}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-black ${isLow ? "text-rose-600" : "text-slate-900"}`}>
                            {item.currentStock}
                          </span>
                          {isLow && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700">
                              LOW
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">Min: {item.reorderLevel} units</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                        ₹{item.unitPrice}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {firstBatch ? (
                          <>
                            <div className="font-mono text-[11px] font-bold text-slate-700">
                              {firstBatch.batchNumber}
                            </div>
                            <div className="text-[10px] text-slate-400">Exp: {firstBatch.expiryDate}</div>
                          </>
                        ) : (
                          <span className="text-slate-400">Standard</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setShowAdjustModal(true);
                          }}
                          className="text-[11px] h-7 px-2.5"
                        >
                          <Package className="w-3 h-3 mr-1" />
                          <span>Restock</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Prescriptions Queue */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-xs text-slate-800">Physician Prescriptions &amp; Dispensing Pipeline</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Rx Number</th>
                  <th className="py-2.5 px-4">Patient Name &amp; UHID</th>
                  <th className="py-2.5 px-4">Prescribed Medicines</th>
                  <th className="py-2.5 px-4">Prescribing Doctor</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prescriptions.map((rx: any) => (
                  <tr key={rx.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-hospital-800">{rx.prescriptionNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{rx.patientName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{rx.patientUhid}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {rx.items?.map((m: any) => `${m.medicineName} (${m.dosage})`).join(", ")}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{rx.doctorName}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          rx.isDispensed
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {rx.isDispensed ? "DISPENSED" : "PENDING DISPENSING"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {showAdjustModal && selectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Replenish Medicine Stock</h3>
                <span className="text-xs text-amber-400 font-semibold">{selectedItem.medicineName}</span>
              </div>
              <button
                onClick={() => setShowAdjustModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustStock} className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Stock:</span>
                  <span className="font-bold text-slate-800">{selectedItem.currentStock} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reorder Threshold:</span>
                  <span className="font-bold text-rose-600">{selectedItem.reorderLevel} units</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Add Quantity (Units) *</label>
                <input
                  type="number"
                  required
                  value={quantityChange}
                  onChange={(e) => setQuantityChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Receipt / Invoice Reason</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Purchase order PO-2026-882 received from supplier"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Confirm Restock"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Add Medication to Formulary</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedicine} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Telmisartan 40mg"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Generic Molecule *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Telmisartan"
                    value={genericName}
                    onChange={(e) => setGenericName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                  >
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Analgesic">Analgesic</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Antidiabetic">Antidiabetic</option>
                    <option value="Neurology">Neurology</option>
                    <option value="IV Fluid">IV Fluid</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dosage Form</label>
                  <select
                    value={form}
                    onChange={(e) => setForm(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Injection">Injection</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Infusion">Infusion</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Strength</label>
                  <input
                    type="text"
                    value={strength}
                    onChange={(e) => setStrength(e.target.value)}
                    placeholder="40mg / 100ml"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Initial Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={currentStock}
                    onChange={(e) => setCurrentStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reorder Level</label>
                  <input
                    type="number"
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Authorized Supplier Name</label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="e.g. Cipla Healthcare Dist."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add to Pharmacy Formulary"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
