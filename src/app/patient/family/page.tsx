"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Heart,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ChevronRight,
  ArrowRight,
  Eye,
  KeyRound,
  Baby,
  UserCheck,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { HMSService } from "@/lib/hmsService";
import { CaregiverConsent } from "@/types/hms";

interface DependentMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: string;
  uhid: string;
  bloodGroup: string;
  accessLevel: "FULL_CARE" | "APPOINTMENTS_ONLY" | "BILLING_ONLY";
  status: "ACTIVE" | "PENDING_CONSENT";
  addedDate: string;
}

export default function PatientFamilyPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [dependents, setDependents] = useState<DependentMember[]>([]);
  const [consents, setConsents] = useState<CaregiverConsent[]>([]);
  const [activeTab, setActiveTab] = useState<"members" | "consents" | "add">("members");
  
  // Add Member Form
  const [newName, setNewName] = useState("");
  const [newRelation, setNewRelation] = useState("Child");
  const [newAge, setNewAge] = useState("");
  const [newGender, setNewGender] = useState("Male");
  const [newBloodGroup, setNewBloodGroup] = useState("B+");
  const [newPhone, setNewPhone] = useState("");
  const [newScope, setNewScope] = useState<"FULL_CARE" | "APPOINTMENTS_ONLY" | "BILLING_ONLY">("FULL_CARE");
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const s = HospitalStore.getSession();
    setSession(s);

    const uhid = s?.uhid || "IND-UHID-000101";
    const fetchedConsents = HMSService.getCaregiverConsents(uhid);
    setConsents(fetchedConsents);

    // Initial dependents seed
    const initialList: DependentMember[] = [
      {
        id: "dep-001",
        name: "Selvamani Murugan",
        relation: "Spouse",
        age: 52,
        gender: "Female",
        uhid: "IND-UHID-000102",
        bloodGroup: "O+",
        accessLevel: "FULL_CARE",
        status: "ACTIVE",
        addedDate: "2026-01-15",
      },
      {
        id: "dep-002",
        name: "Praveen Murugan",
        relation: "Child",
        age: 24,
        gender: "Male",
        uhid: "IND-UHID-000103",
        bloodGroup: "B+",
        accessLevel: "APPOINTMENTS_ONLY",
        status: "ACTIVE",
        addedDate: "2026-03-20",
      },
    ];
    setDependents(initialList);
  }, []);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAge || !consentAgreed) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const uhid = session?.uhid || "IND-UHID-000101";
      const newUhid = `IND-UHID-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const newMember: DependentMember = {
        id: `dep-${Date.now()}`,
        name: newName,
        relation: newRelation,
        age: parseInt(newAge, 10),
        gender: newGender,
        uhid: newUhid,
        bloodGroup: newBloodGroup,
        accessLevel: newScope,
        status: "ACTIVE",
        addedDate: new Date().toISOString().split("T")[0],
      };

      const actor = {
        id: session?.id || "usr-patient",
        name: session?.name || "Patient",
        role: "PATIENT" as const,
      };

      HMSService.createCaregiverConsent({
        patientUhid: uhid,
        patientName: session?.name || "Patient",
        caregiverName: newName,
        caregiverPhone: newPhone || "+91 94432 00000",
        caregiverEmail: `${newName.toLowerCase().replace(/\s+/g, "")}@example.com`,
        relationship: newRelation as any,
        accessScope: newScope,
        validUntil: new Date(Date.now() + 365 * 86400000).toISOString(),
      }, actor);

      setDependents((prev) => [...prev, newMember]);
      setConsents(HMSService.getCaregiverConsents(uhid));
      setIsSubmitting(false);
      setActionSuccess(`Successfully added ${newName} (${newRelation}) with UHID ${newUhid}`);
      setActiveTab("members");

      // Reset Form
      setNewName("");
      setNewAge("");
      setNewPhone("");
      setConsentAgreed(false);
    }, 600);
  };

  const handleRevokeConsent = (consentId: string) => {
    if (!confirm("Are you sure you want to revoke this caregiver access?")) return;
    const actor = {
      id: session?.id || "usr-patient",
      name: session?.name || "Patient",
      role: "PATIENT" as const,
    };
    HMSService.revokeCaregiverConsent(consentId, actor);
    const uhid = session?.uhid || "IND-UHID-000101";
    setConsents(HMSService.getCaregiverConsents(uhid));
    setActionSuccess("Caregiver access scope successfully revoked.");
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-cyan-900 to-blue-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-200 text-xs font-semibold mb-3">
              <Users className="w-3.5 h-3.5" /> Family Care & Dependents
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Family Members & Caregivers</h1>
            <p className="text-cyan-100/90 text-sm mt-1 max-w-2xl leading-relaxed">
              Manage family dependents under your account, coordinate pediatric or eldercare appointments, and grant explicit consent-governed access to authorized caregivers.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("add")}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
          >
            <UserPlus className="w-4 h-4" /> Add Family Member
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {actionSuccess}
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-900 text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab("members")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "members" ? "border-cyan-600 text-cyan-700" : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4" /> Active Dependents ({dependents.length})
        </button>
        <button
          onClick={() => setActiveTab("consents")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "consents" ? "border-cyan-600 text-cyan-700" : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Caregiver Consents ({consents.length})
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "add" ? "border-cyan-600 text-cyan-700" : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <UserPlus className="w-4 h-4" /> Register New Dependent
        </button>
      </div>

      {/* Tab 1: Active Dependents */}
      {activeTab === "members" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {dependents.map((dep) => (
            <div
              key={dep.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-lg">
                      {dep.relation === "Child" ? <Baby className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{dep.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                        <span className="font-semibold text-cyan-700">{dep.relation}</span> • {dep.age} yrs • {dep.gender}
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {dep.status}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-600 block">Permanent UHID</span>
                    <span className="font-mono font-bold text-slate-800">{dep.uhid}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">Blood Group</span>
                    <span className="font-bold text-slate-800">{dep.bloodGroup}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">Access Scope</span>
                    <span className="font-semibold text-cyan-800">{dep.accessLevel.replace("_", " ")}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">Registered On</span>
                    <span className="text-slate-800">{dep.addedDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <Link
                  href={`/patient/appointments?bookFor=${encodeURIComponent(dep.name)}&uhid=${dep.uhid}`}
                  className="flex-1 text-center py-2 px-3 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold transition-colors"
                >
                  Book Appointment
                </Link>
                <Link
                  href={`/patient/records?patientUhid=${dep.uhid}`}
                  className="py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> Records
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Caregiver Consents */}
      {activeTab === "consents" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Authorized Caregiver Consent Registry</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Compliant with Digital Personal Data Protection (DPDP) Act 2023. Explicit scopes grant access to designated attendants.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Consent ID</th>
                  <th className="py-3 px-4">Caregiver</th>
                  <th className="py-3 px-4">Relation</th>
                  <th className="py-3 px-4">Access Scope</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Valid Until</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {consents.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{c.consentId}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{c.caregiverName}</div>
                      <div className="text-slate-600 text-[11px]">{c.caregiverPhone}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{c.relationship}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-100 text-cyan-800">
                        {c.accessScope.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          c.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{new Date(c.validUntil).toLocaleDateString("en-IN")}</td>
                    <td className="py-3 px-4 text-right">
                      {c.status === "ACTIVE" ? (
                        <button
                          onClick={() => handleRevokeConsent(c.consentId)}
                          className="text-red-600 hover:text-red-800 font-semibold text-xs transition-colors"
                        >
                          Revoke
                        </button>
                      ) : (
                        <span className="text-slate-600 text-xs italic">Revoked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Register Dependent Form */}
      {activeTab === "add" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Add Family Member / Dependent</h3>
            <p className="text-xs text-slate-600 mt-1">
              Creates a linked hospital patient record with a permanent UHID. You will be able to book appointments and view records on their behalf.
            </p>
          </div>

          <form onSubmit={handleAddMember} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Radhika Murugan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Relationship *</label>
                <select
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Child">Child (Son/Daughter)</option>
                  <option value="Spouse">Spouse (Wife/Husband)</option>
                  <option value="Parent">Parent (Mother/Father)</option>
                  <option value="Sibling">Sibling (Brother/Sister)</option>
                  <option value="Guardian">Legal Dependent / Ward</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Age *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="120"
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value)}
                  placeholder="e.g. 14"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
                <select
                  value={newGender}
                  onChange={(e) => setNewGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={newBloodGroup}
                  onChange={(e) => setNewBloodGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone (Optional if child)</label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+91 94432 00000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Delegated Access Permission Scope</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "FULL_CARE", label: "Full Care", desc: "Appointments, Clinical Notes, Lab & Bills" },
                  { id: "APPOINTMENTS_ONLY", label: "Appointments Only", desc: "Booking & Rescheduling visits" },
                  { id: "BILLING_ONLY", label: "Billing Only", desc: "Viewing & settling hospital invoices" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setNewScope(s.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      newScope === s.id
                        ? "border-cyan-600 bg-cyan-50/50 ring-1 ring-cyan-500"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900">{s.label}</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  required
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span>
                  I confirm that I am the authorized legal guardian or representative of this dependent, and consent to digital health record linking in accordance with IndoStates Hospital clinical governance guidelines and the DPDP Act 2023.
                </span>
              </label>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("members")}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !consentAgreed}
                className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? "Linking Dependent..." : "Confirm & Link Dependent"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
