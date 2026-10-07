"use client";

import React, { useState } from "react";
import {
  Building2,
  Plus,
  Users,
  Stethoscope,
  Calendar,
  CheckCircle2,
  Edit2,
  X,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DepartmentsViewProps {
  departments: any[];
  onRefresh: () => void;
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function DepartmentsView({ departments, onRefresh, onSetFeedback }: DepartmentsViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<any | null>(null);

  // Add form
  const [name, setName] = useState("");
  const [head, setHead] = useState("");
  const [description, setDescription] = useState("");
  const [servicesStr, setServicesStr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit form
  const [editHead, setEditHead] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleOpenEdit = (dept: any) => {
    setSelectedDept(dept);
    setEditHead(dept.head || "");
    setEditDescription(dept.fullDescription || dept.shortDescription || "");
    setShowEditModal(true);
  };

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    setIsSubmitting(true);
    try {
      const services = servicesStr.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await fetch("/api/admin/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, head, description, services }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        setShowAddModal(false);
        setName("");
        setHead("");
        setDescription("");
        setServicesStr("");
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to create department." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error creating department." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/departments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedDept.id,
          head: editHead,
          description: editDescription,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        setShowEditModal(false);
        setSelectedDept(null);
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to update department." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error updating department." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Clinical Departments &amp; Centers of Excellence</h2>
          <p className="text-xs text-slate-500">
            Configure sub-specialty clinics, clinical heads, OPD capacity, and diagnostic wings
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="text-xs font-bold"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Add Clinical Department</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => {
          const metrics = dept.metrics || {};
          return (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-hospital-100 text-hospital-800 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">{dept.name}</h3>
                      <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                        Head: {dept.head || "Clinical Board"}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                    Active
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 mt-3 leading-relaxed">
                  {dept.shortDescription || dept.fullDescription}
                </p>

                {/* Metrics bar */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-400 font-bold block">FACULTY</span>
                    <span className="font-black text-slate-800 text-xs">
                      {metrics.doctorCount ?? 2} Doctors
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-400 font-bold block">BOOKINGS</span>
                    <span className="font-black text-hospital-800 text-xs">
                      {metrics.appointmentCount ?? 8} OPD
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-400 font-bold block">CAPACITY</span>
                    <span className="font-black text-slate-800 text-xs">
                      {metrics.capacityDaily ?? 50}/day
                    </span>
                  </div>
                </div>

                {/* Services list */}
                {dept.services && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {dept.services.slice(0, 3).map((s: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                    {dept.services.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md text-slate-400 font-medium">
                        +{dept.services.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(dept)}
                  className="w-full text-xs h-7"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  <span>Edit Department Configuration</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Department Modal */}
      {showEditModal && selectedDept && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Edit Clinical Department</h3>
                <span className="text-xs text-amber-400 font-semibold">{selectedDept.name}</span>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateDept} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Department Head / Lead</label>
                <input
                  type="text"
                  value={editHead}
                  onChange={(e) => setEditHead(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Department Clinical Scope</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Create Clinical Department</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDept} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Department Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Center for Interventional Pulmonology"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Appointed Clinical Head</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Senior Consultant"
                  value={head}
                  onChange={(e) => setHead(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Scope &amp; Facilities *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed description of diagnostic and therapeutic procedures performed..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Services (comma separated)</label>
                <input
                  type="text"
                  placeholder="Diagnostic Bronchoscopy, EBUS, Thoracoscopy"
                  value={servicesStr}
                  onChange={(e) => setServicesStr(e.target.value)}
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
                  {isSubmitting ? "Creating..." : "Establish Department"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
