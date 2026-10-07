"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bed,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Wrench,
  Ban,
  Plus,
  RefreshCw,
  LogOut,
  FileText,
  UserCheck,
  Search,
} from "lucide-react";
import { AdmissionRecord, BedRecord, BedStatus, WardRecord } from "@/types/hms";
import { Button } from "@/components/ui/Button";
import { HOSPITAL_INFO } from "@/data/hospitalData";
import { HospitalStore, UserSession } from "@/lib/store";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";

export default function IPDDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [wards, setWards] = useState<WardRecord[]>([]);
  const [beds, setBeds] = useState<BedRecord[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // New Admission Modal State
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [admitUhid, setAdmitUhid] = useState("");
  const [admitName, setAdmitName] = useState("");
  const [admitPhone, setAdmitPhone] = useState("");
  const [admitDoctor, setAdmitDoctor] = useState("Dr. Rajesh Rangaswamy");
  const [admitWardId, setAdmitWardId] = useState("");
  const [admitBedId, setAdmitBedId] = useState("");
  const [admitReason, setAdmitReason] = useState("");
  const [isSubmittingAdmit, setIsSubmittingAdmit] = useState(false);
  const [admitFeedback, setAdmitFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Discharge Modal State
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionRecord | null>(null);
  const [dischargeSummary, setDischargeSummary] = useState("");
  const [isSubmittingDischarge, setIsSubmittingDischarge] = useState(false);

  const fetchIPDData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Beds & Wards
      const bedRes = await fetch("/api/hms/beds");
      if (bedRes.ok) {
        const d = await bedRes.json();
        if (d.success) {
          setWards(d.wards || []);
          setBeds(d.beds || []);
          if (!admitWardId && d.wards?.length > 0) {
            setAdmitWardId(d.wards[0].id);
          }
        }
      }

      // 2. Fetch Admissions
      const admRes = await fetch("/api/hms/ipd?status=ADMITTED");
      if (admRes.ok) {
        const ad = await admRes.json();
        if (ad.success) {
          setAdmissions(ad.admissions || []);
        }
      }
    } catch (err) {
      console.error("IPD fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const session = HospitalStore.getSession();
    if (!session) {
      router.push("/login?redirect=/ipd/dashboard");
      return;
    }
    const authorizedRoles = [
      "SUPER_ADMIN",
      "HOSPITAL_ADMIN",
      "OPERATIONS_MANAGER",
      "MEDICAL_DIRECTOR",
      "DOCTOR",
      "NURSE",
    ];
    const roleUpper = (session.role || "").toUpperCase();
    if (!authorizedRoles.includes(roleUpper)) {
      router.push("/login?error=unauthorized_role");
      return;
    }
    setCurrentUser(session);
    setIsAuthChecking(false);
    fetchIPDData();
  }, [router]);

  const handleLogout = async () => {
    await HospitalStore.logout();
    window.location.href = "/login?portal=admin";
  };

  const handleUpdateBedStatus = async (bedId: string, status: BedStatus) => {
    try {
      const res = await fetch("/api/hms/beds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_status", bedId, status }),
      });

      if (res.ok) {
        setBeds((prev) => prev.map((b) => (b.id === bedId ? { ...b, status } : b)));
      }
    } catch (err) {
      console.error("Bed update error:", err);
    }
  };

  const handleCreateAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admitUhid || !admitName || !admitBedId) {
      setAdmitFeedback({ type: "error", message: "Patient UHID, Full Name, and Bed selection are required." });
      return;
    }

    setIsSubmittingAdmit(true);
    setAdmitFeedback(null);

    const targetWard = wards.find((w) => w.id === admitWardId);
    const targetBed = beds.find((b) => b.id === admitBedId);

    try {
      const res = await fetch("/api/hms/ipd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientUhid: admitUhid.trim().toUpperCase(),
          patientName: admitName.trim(),
          patientPhone: admitPhone.trim(),
          doctorId: "dr-rajesh-rangaswamy",
          doctorName: admitDoctor,
          departmentId: targetWard?.departmentId || "general-medicine",
          wardId: targetWard?.id || "w-gwa",
          wardName: targetWard?.name || "Inpatient Ward",
          bedId: targetBed?.id || admitBedId,
          bedNumber: targetBed?.bedNumber || admitBedId,
          admissionReason: admitReason.trim() || "Inpatient therapeutic monitoring",
        }),
      });

      const d = await res.json();
      if (!res.ok) {
        setAdmitFeedback({ type: "error", message: d.error || "Failed to create admission." });
      } else {
        setAdmitFeedback({ type: "success", message: `Admission ${d.admission.admissionNumber} created successfully.` });
        setTimeout(() => {
          setShowAdmitModal(false);
          setAdmitUhid("");
          setAdmitName("");
          setAdmitPhone("");
          setAdmitReason("");
          setAdmitFeedback(null);
          fetchIPDData();
        }, 1200);
      }
    } catch {
      setAdmitFeedback({ type: "error", message: "Network error creating admission." });
    } finally {
      setIsSubmittingAdmit(false);
    }
  };

  const handleDischarge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmission) return;

    setIsSubmittingDischarge(true);
    try {
      const res = await fetch("/api/hms/ipd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "discharge",
          admissionId: selectedAdmission.admissionNumber || selectedAdmission.id,
          summary: dischargeSummary || "Discharged in stable clinical condition. Follow-up advised in 7 days.",
        }),
      });

      if (res.ok) {
        setShowDischargeModal(false);
        setSelectedAdmission(null);
        setDischargeSummary("");
        fetchIPDData();
      }
    } catch (err) {
      console.error("Discharge error:", err);
    } finally {
      setIsSubmittingDischarge(false);
    }
  };

  // Filtered beds
  const filteredBeds = beds.filter((b) => {
    const matchWard = selectedWard === "all" || b.wardId === selectedWard;
    const matchStatus = selectedStatus === "all" || b.status === selectedStatus;
    const matchQuery =
      !searchQuery ||
      b.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.currentPatientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.currentPatientUhid?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchWard && matchStatus && matchQuery;
  });

  const availableBedsForAdmit = beds.filter(
    (b) => b.status === "AVAILABLE" && (!admitWardId || b.wardId === admitWardId)
  );

  if (isAuthChecking) {
    return <DashboardSkeleton title="IPD & Inpatient Bed Occupancy Center..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top Header */}
      <header className="bg-hospital-950 text-white border-b border-hospital-900 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-hospital-600 flex items-center justify-center font-bold text-white shadow-sm">
                IS
              </span>
              <span className="font-display font-extrabold text-base tracking-tight text-white hidden sm:inline">
                {HOSPITAL_INFO.shortName}
              </span>
            </Link>
            <span className="text-slate-500 hidden sm:inline">/</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-hospital-800 text-hospital-200 border border-hospital-700">
              IPD &amp; Bed Occupancy Center
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-hospital-900 border border-hospital-800 text-hospital-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {currentUser.name} ({currentUser.role})
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchIPDData}
              isLoading={isLoading}
              className="border-slate-700 text-slate-300 hover:text-white"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              <span>Refresh</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAdmitModal(true)}
              className="bg-hospital-600 hover:bg-hospital-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              <span>Admit Patient</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-slate-700 text-rose-300 hover:bg-rose-950/40 hover:text-rose-200"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Beds</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{beds.length}</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Available</span>
            <span className="text-2xl font-black text-emerald-800 mt-1 block">
              {beds.filter((b) => b.status === "AVAILABLE").length}
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">Occupied</span>
            <span className="text-2xl font-black text-rose-800 mt-1 block">
              {beds.filter((b) => b.status === "OCCUPIED").length}
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Cleaning</span>
            <span className="text-2xl font-black text-amber-800 mt-1 block">
              {beds.filter((b) => b.status === "CLEANING").length}
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-purple-200 bg-purple-50/20 shadow-xs">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">Maintenance</span>
            <span className="text-2xl font-black text-purple-800 mt-1 block">
              {beds.filter((b) => b.status === "MAINTENANCE").length}
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-hospital-200 bg-hospital-50/30 shadow-xs">
            <span className="text-[11px] font-bold text-hospital-700 uppercase tracking-wider block">IPD Admitted</span>
            <span className="text-2xl font-black text-hospital-900 mt-1 block">{admissions.length}</span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search bed, patient, UHID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-hospital-500 w-48 sm:w-64"
              />
            </div>

            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-hospital-500"
            >
              <option value="all">All Hospital Wards</option>
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-hospital-500"
            >
              <option value="all">All Bed Statuses</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="OCCUPIED">OCCUPIED</option>
              <option value="CLEANING">CLEANING</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="RESERVED">RESERVED</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing <strong>{filteredBeds.length}</strong> of {beds.length} beds
          </span>
        </div>

        {/* Bed Grid Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBeds.map((bed) => {
            const isAvailable = bed.status === "AVAILABLE";
            const isOccupied = bed.status === "OCCUPIED";
            const isCleaning = bed.status === "CLEANING";
            const isMaintenance = bed.status === "MAINTENANCE";

            let borderClass = "border-slate-200 bg-white";
            let badgeBg = "bg-slate-100 text-slate-700";

            if (isAvailable) {
              borderClass = "border-emerald-200 bg-emerald-50/10";
              badgeBg = "bg-emerald-100 text-emerald-800";
            } else if (isOccupied) {
              borderClass = "border-rose-200 bg-rose-50/10";
              badgeBg = "bg-rose-100 text-rose-800";
            } else if (isCleaning) {
              borderClass = "border-amber-200 bg-amber-50/10";
              badgeBg = "bg-amber-100 text-amber-800";
            } else if (isMaintenance) {
              borderClass = "border-purple-200 bg-purple-50/10";
              badgeBg = "bg-purple-100 text-purple-800";
            }

            return (
              <div
                key={bed.id}
                className={`p-5 rounded-2xl border ${borderClass} shadow-xs hover:shadow-sm transition space-y-3 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 text-base">{bed.bedNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeBg}`}>
                      {bed.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 block mt-0.5">{bed.wardName}</span>
                  {bed.roomNumber && (
                    <span className="text-[11px] text-slate-400 block font-mono">Room: {bed.roomNumber}</span>
                  )}

                  {isOccupied && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <span className="font-bold text-slate-900 block truncate">{bed.currentPatientName || "Patient Admitted"}</span>
                      {bed.currentPatientUhid && (
                        <span className="font-mono text-[10px] text-hospital-700 font-bold block">
                          {bed.currentPatientUhid}
                        </span>
                      )}
                    </div>
                  )}

                  {isCleaning && (
                    <p className="mt-3 text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>Sanitization and linen change in progress.</span>
                    </p>
                  )}

                  {isMaintenance && (
                    <p className="mt-3 text-[11px] text-purple-800 bg-purple-50 p-2.5 rounded-xl border border-purple-200 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 shrink-0" />
                      <span>Medical gas / electrical sensor check.</span>
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  {isCleaning && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateBedStatus(bed.id, "AVAILABLE")}
                      className="w-full text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      <span>Mark Ready (Available)</span>
                    </Button>
                  )}

                  {isAvailable && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAdmitWardId(bed.wardId);
                        setAdmitBedId(bed.id);
                        setShowAdmitModal(true);
                      }}
                      className="w-full text-xs text-hospital-700 border-hospital-200 hover:bg-hospital-50"
                    >
                      <UserCheck className="w-3 h-3 mr-1" />
                      <span>Admit Here</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Admissions Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Current Inpatient Census &amp; Discharge</h3>
              <p className="text-xs text-slate-500">
                Patients actively admitted in IPD wards receiving ongoing medical care.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
              Total Admitted: {admissions.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Admission ID</th>
                  <th className="py-3 px-4">Patient Name &amp; UHID</th>
                  <th className="py-3 px-4">Ward &amp; Bed</th>
                  <th className="py-3 px-4">Attending Doctor</th>
                  <th className="py-3 px-4">Admitted On</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No patients currently admitted in IPD.
                    </td>
                  </tr>
                ) : (
                  admissions.map((adm) => (
                    <tr key={adm.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{adm.admissionNumber}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{adm.patientName}</span>
                        <span className="font-mono text-[10px] text-hospital-700 font-bold">{adm.patientUhid}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{adm.bedNumber}</span>
                        <span className="text-slate-500 text-[11px]">{adm.wardName}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">{adm.doctorName}</td>
                      <td className="py-3.5 px-4 text-slate-500">{adm.admissionDate}</td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{adm.admissionReason}</td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAdmission(adm);
                            setShowDischargeModal(true);
                          }}
                          className="border-rose-200 text-rose-700 hover:bg-rose-50 text-xs"
                        >
                          <span>Discharge</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ADMIT PATIENT MODAL */}
      {showAdmitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Inpatient Admission Registration</h3>
              <p className="text-xs text-slate-500">
                Allocate bed and record inpatient clinical reason for admission.
              </p>
            </div>

            {admitFeedback && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  admitFeedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {admitFeedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{admitFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleCreateAdmission} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient UHID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IND-UHID-000101"
                    value={admitUhid}
                    onChange={(e) => setAdmitUhid(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-hospital-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full legal name"
                    value={admitName}
                    onChange={(e) => setAdmitName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-hospital-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ward *</label>
                  <select
                    value={admitWardId}
                    onChange={(e) => {
                      setAdmitWardId(e.target.value);
                      setAdmitBedId("");
                    }}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-hospital-500 bg-white"
                  >
                    {wards.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Available Bed *</label>
                  <select
                    value={admitBedId}
                    required
                    onChange={(e) => setAdmitBedId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-hospital-500 bg-white"
                  >
                    <option value="">-- Select Available Bed --</option>
                    {availableBedsForAdmit.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bedNumber} ({b.wardName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Attending Consultant *</label>
                <select
                  value={admitDoctor}
                  onChange={(e) => setAdmitDoctor(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-hospital-500 bg-white"
                >
                  <option value="Dr. Rajesh Rangaswamy">Dr. Rajesh Rangaswamy (Neurovascular &amp; Stroke)</option>
                  <option value="Dr. Saravanan Subramanian">Dr. Saravanan Subramanian (Cardiothoracic Surgery)</option>
                  <option value="Dr. G. Sivakumar">Dr. G. Sivakumar (General Surgery)</option>
                  <option value="Dr. K. Swaminathan">Dr. K. Swaminathan (Critical Care &amp; Radiology)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Admission Reason &amp; Clinical Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Acute stroke protocol monitoring, continuous hemodynamic observation."
                  value={admitReason}
                  onChange={(e) => setAdmitReason(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  type="button"
                  onClick={() => setShowAdmitModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  isLoading={isSubmittingAdmit}
                >
                  Confirm Inpatient Admission
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISCHARGE MODAL */}
      {showDischargeModal && selectedAdmission && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Inpatient Discharge Summary</h3>
              <p className="text-xs text-slate-500">
                Discharging {selectedAdmission.patientName} ({selectedAdmission.patientUhid}). Bed {selectedAdmission.bedNumber} will be released for sanitization.
              </p>
            </div>

            <form onSubmit={handleDischarge} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Discharge Summary &amp; Clinical Advice *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Clinical recovery notes, discharge medication, activity guidance, and date of follow-up."
                  value={dischargeSummary}
                  onChange={(e) => setDischargeSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
                <span className="font-bold block">Automated Bed Disinfection Notice:</span>
                <span>Submitting discharge will immediately notify Housekeeping and set Bed {selectedAdmission.bedNumber} to CLEANING status.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  type="button"
                  onClick={() => setShowDischargeModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  isLoading={isSubmittingDischarge}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Finalize Discharge
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
