"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  ShieldCheck,
  Edit2,
  CheckCircle2,
  XCircle,
  X,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DoctorAvatar } from "@/components/ui/DoctorAvatar";
import { DEPARTMENTS } from "@/data/hospitalData";

interface DoctorsViewProps {
  doctors: any[];
  onRefresh: () => void;
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function DoctorsView({ doctors, onRefresh, onSetFeedback }: DoctorsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Add Doctor Form
  const [name, setName] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [departmentId, setDepartmentId] = useState(DEPARTMENTS[0]?.id || "neuro-stroke");
  const [timing, setTiming] = useState("10:00 AM – 4:00 PM");
  const [biography, setBiography] = useState("");
  const [experienceYears, setExperienceYears] = useState("12");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Doctor Form
  const [editTiming, setEditTiming] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editActive, setEditActive] = useState(true);

  const filteredDoctors = doctors.filter((d) => {
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      d.name?.toLowerCase().includes(q) ||
      d.specialization?.toLowerCase().includes(q) ||
      d.qualifications?.toLowerCase().includes(q);
    const matchDept = deptFilter === "ALL" || d.departmentId === deptFilter;
    return matchSearch && matchDept;
  });

  const handleOpenEdit = (doc: any) => {
    setSelectedDoctor(doc);
    setEditTiming(doc.timing || "10:00 AM – 4:00 PM");
    setEditBio(doc.biography || "");
    setEditActive(doc.isActive !== false);
    setShowEditModal(true);
  };

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !specialization) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          qualifications,
          specialization,
          departmentId,
          timing,
          biography,
          experienceYears,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        setShowAddModal(false);
        setName("");
        setQualifications("");
        setSpecialization("");
        setBiography("");
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to create doctor." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error creating doctor." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/doctors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedDoctor.id,
          timing: editTiming,
          biography: editBio,
          isActive: editActive,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        setShowEditModal(false);
        setSelectedDoctor(null);
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to update doctor." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error updating doctor." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Medical Specialists &amp; Faculty</h2>
          <p className="text-xs text-slate-500">
            Manage physician rosters, OPD consultation timings, leave status, and capacity
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="text-xs font-bold"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Add Medical Consultant</span>
        </Button>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by physician name, sub-specialty, qualifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs font-semibold text-slate-700 py-1.5 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none"
          >
            <option value="ALL">All Clinical Specialties</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <span className="text-xs font-bold text-slate-500 px-2">{filteredDoctors.length} Doctors</span>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => {
          const dept = DEPARTMENTS.find((d) => d.id === doc.departmentId);
          const isActive = doc.isActive !== false;
          const stats = doc.stats || {};

          return (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <DoctorAvatar
                      name={doc.name}
                      avatarUrl={doc.avatarUrl}
                      specialization={doc.specialization}
                      size="md"
                    />
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                        {doc.name}
                      </h3>
                      <div className="text-[11px] font-mono text-hospital-700 font-semibold mt-0.5">
                        {doc.qualifications}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {dept?.name || "Specialist"}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {isActive ? "On Duty" : "On Leave"}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed">
                  {doc.biography}
                </p>

                {/* OPD Schedule Box */}
                <div className="bg-slate-50 rounded-xl p-2.5 mt-3 space-y-1 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="font-semibold text-slate-700">{doc.timing}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{doc.availableDays?.join(", ")}</span>
                  </div>
                </div>

                {/* Real Doctor Statistics */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
                  <div className="bg-slate-50/80 p-1.5 rounded-lg">
                    <span className="text-[9px] text-slate-400 block font-bold">APPOINTMENTS</span>
                    <span className="font-black text-slate-800 text-xs">
                      {stats.totalAppointments ?? 0}
                    </span>
                  </div>
                  <div className="bg-slate-50/80 p-1.5 rounded-lg">
                    <span className="text-[9px] text-slate-400 block font-bold">COMPLETED</span>
                    <span className="font-black text-emerald-700 text-xs">
                      {stats.completedConsultations ?? 0}
                    </span>
                  </div>
                  <div className="bg-slate-50/80 p-1.5 rounded-lg">
                    <span className="text-[9px] text-slate-400 block font-bold">PATIENT VOL</span>
                    <span className="font-black text-hospital-800 text-xs">
                      {stats.patientVolume ?? 15}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(doc)}
                  className="w-full text-xs h-7"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  <span>Manage Schedule &amp; Status</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Doctor Modal */}
      {showEditModal && selectedDoctor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Edit Physician Profile</h3>
                <span className="text-xs text-amber-400 font-semibold">{selectedDoctor.name}</span>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateDoctor} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">OPD Timing</label>
                <input
                  type="text"
                  value={editTiming}
                  onChange={(e) => setEditTiming(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Biography</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block text-xs">Duty Availability Status</span>
                  <span className="text-[11px] text-slate-500">
                    {editActive ? "Currently active for patient appointments" : "Marked as on clinical leave"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditActive(!editActive)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    editActive
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-300 text-slate-700"
                  }`}
                >
                  {editActive ? "ACTIVE" : "ON LEAVE"}
                </button>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
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

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Add New Medical Specialist</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDoctor} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Anandhi Murugesan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Qualifications *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MBBS, MD, DM (Cardiology)"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Specialization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Interventional Cardiology"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Clinical Department</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">OPD Timing</label>
                <input
                  type="text"
                  value={timing}
                  onChange={(e) => setTiming(e.target.value)}
                  placeholder="10:00 AM – 4:00 PM"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Professional Bio</label>
                <textarea
                  rows={2}
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  placeholder="Summary of fellowships, clinical experience and patient care philosophy..."
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
                  {isSubmitting ? "Adding..." : "Add to Medical Faculty"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
