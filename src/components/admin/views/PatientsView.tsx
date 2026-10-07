"use client";

import React, { useState } from "react";
import {
  User,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  UserX,
  UserCheck,
  FileText,
  Activity,
  CreditCard,
  Pill,
  FlaskConical,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PatientsViewProps {
  patients: any[];
  onRefresh: () => void;
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function PatientsView({ patients, onRefresh, onSetFeedback }: PatientsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [patientDetails, setPatientDetails] = useState<any | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Patient Form
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAge, setNewAge] = useState("35");
  const [newGender, setNewGender] = useState("Male");
  const [newBloodGroup, setNewBloodGroup] = useState("O+");
  const [newAddress, setNewAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredPatients = patients.filter((p) => {
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      p.fullName?.toLowerCase().includes(q) ||
      p.phone?.includes(q) ||
      p.uhid?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "ALL" || (p.accountStatus || "active") === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleOpenPatientDetails = async (patient: any) => {
    setSelectedPatient(patient);
    setIsLoadingDetails(true);
    try {
      const res = await fetch(`/api/admin/patients?uhid=${encodeURIComponent(patient.uhid)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPatientDetails(data);
        }
      }
    } catch (err) {
      console.error("Fetch patient details error:", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleToggleStatus = async (patient: any) => {
    const currentStatus = patient.accountStatus || "active";
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      const res = await fetch("/api/admin/patients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uhid: patient.uhid, accountStatus: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: `Patient account status changed to ${nextStatus}.` });
        onRefresh();
        if (selectedPatient?.uhid === patient.uhid) {
          setSelectedPatient({ ...selectedPatient, accountStatus: nextStatus });
        }
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to update status." });
      }
    } catch (err) {
      onSetFeedback({ type: "error", message: "Network error updating patient status." });
    }
  };

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newName,
          phone: newPhone,
          email: newEmail,
          age: newAge,
          gender: newGender,
          bloodGroup: newBloodGroup,
          address: newAddress,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        setShowAddModal(false);
        setNewName("");
        setNewPhone("");
        setNewEmail("");
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to register patient." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error registering patient." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Master Patient Registry</h2>
          <p className="text-xs text-slate-500">
            Search, verify, and inspect electronic medical records across all hospital clinical wings
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Register New Patient</span>
          </Button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by UHID, patient name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold text-slate-700 py-1.5 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="active">Active Accounts</option>
            <option value="suspended">Suspended Accounts</option>
          </select>
          <span className="text-xs font-bold text-slate-500 px-2">
            {filteredPatients.length} Records
          </span>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">UHID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Demographics</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => {
                  const isActive = (p.accountStatus || "active") === "active";
                  return (
                    <tr key={p.id || p.uhid} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-hospital-800">
                        {p.uhid}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{p.fullName}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {p.address || "Coimbatore, TN"}
                        </div>
                      </td>
                      <td className="py-3 px-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{p.phone}</span>
                        </div>
                        {p.email && (
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[140px]">{p.email}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span>{p.age ? `${p.age} yrs` : "N/A"}</span> •{" "}
                        <span>{p.gender || "Other"}</span> •{" "}
                        <span className="font-semibold text-rose-700">{p.bloodGroup || "O+"}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          {isActive ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenPatientDetails(p)}
                          className="text-[11px] h-7 px-2.5"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          <span>EHR</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(p)}
                          className={`text-[11px] h-7 px-2 ${
                            isActive ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-400">
                    No patients match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail / EHR Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                  {selectedPatient.fullName?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">{selectedPatient.fullName}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                      {selectedPatient.uhid}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {selectedPatient.age} yrs • {selectedPatient.gender} • Blood Group:{" "}
                    <strong className="text-rose-400">{selectedPatient.bloodGroup}</strong> •{" "}
                    {selectedPatient.phone}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPatient(null);
                  setPatientDetails(null);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Tabs of EHR */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs">
              {isLoadingDetails ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  Retrieving complete clinical electronic health record...
                </div>
              ) : patientDetails ? (
                <div className="space-y-6">
                  {/* Summary Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-semibold block text-[10px]">APPOINTMENTS</span>
                      <span className="font-black text-slate-800 text-sm">
                        {patientDetails.appointments?.length || 0} Scheduled
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-semibold block text-[10px]">LAB ORDERS</span>
                      <span className="font-black text-slate-800 text-sm">
                        {patientDetails.labOrders?.length || 0} Ordered
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-semibold block text-[10px]">PRESCRIPTIONS</span>
                      <span className="font-black text-slate-800 text-sm">
                        {patientDetails.prescriptions?.length || 0} Formularies
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-semibold block text-[10px]">INVOICES</span>
                      <span className="font-black text-slate-800 text-sm">
                        {patientDetails.invoices?.length || 0} Invoices
                      </span>
                    </div>
                  </div>

                  {/* Appointments History */}
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs mb-2">Consultation Bookings</h4>
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 space-y-2">
                      {patientDetails.appointments?.length > 0 ? (
                        patientDetails.appointments.map((a: any) => (
                          <div
                            key={a.id}
                            className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between"
                          >
                            <div>
                              <span className="font-bold text-slate-800">{a.referenceCode}</span> •{" "}
                              <span className="text-slate-600 font-semibold">{a.doctorName || "General Consultation"}</span>
                              <div className="text-[11px] text-slate-400">
                                {a.date} at {a.timeSlot}
                              </div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              {a.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400 py-2">No appointment history.</div>
                      )}
                    </div>
                  </div>

                  {/* Diagnostic Lab Tests */}
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs mb-2">Diagnostic Laboratory Orders</h4>
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 space-y-2">
                      {patientDetails.labOrders?.length > 0 ? (
                        patientDetails.labOrders.map((l: any) => (
                          <div
                            key={l.id}
                            className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between"
                          >
                            <div>
                              <span className="font-bold text-slate-800">{l.orderId}</span>:{" "}
                              <span className="text-slate-700 font-medium">
                                {l.tests?.map((t: any) => t.testName).join(", ")}
                              </span>
                              <div className="text-[11px] text-slate-400">
                                Ordered by {l.doctorName} on {new Date(l.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                l.isReportReleased
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {l.isReportReleased ? "Report Released" : "Processing"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400 py-2">No lab orders on file.</div>
                      )}
                    </div>
                  </div>

                  {/* Billing Invoices */}
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs mb-2">Billing &amp; TPA Invoices</h4>
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 space-y-2">
                      {patientDetails.invoices?.length > 0 ? (
                        patientDetails.invoices.map((inv: any) => (
                          <div
                            key={inv.id}
                            className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between"
                          >
                            <div>
                              <span className="font-bold text-slate-800">{inv.invoiceNumber}</span> •{" "}
                              <span className="text-slate-600">Total: ₹{inv.totalAmount}</span>
                              <div className="text-[11px] text-slate-400">
                                Method: {inv.paymentMethod} • Date: {new Date(inv.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                inv.paymentStatus === "paid"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {inv.paymentStatus?.toUpperCase()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400 py-2">No billing invoices recorded.</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Register Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Register New Patient Profile</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterPatient} className="p-4 sm:p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hospital-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hospital-500 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="patient@email.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hospital-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={newBloodGroup}
                    onChange={(e) => setNewBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="Street, City, Postal Code"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Generate UHID & Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
