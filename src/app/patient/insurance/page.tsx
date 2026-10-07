"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Plus,
  RefreshCw,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { Button } from "@/components/ui/Button";

export default function PatientInsurancePage() {
  const [session, setSession] = useState<UserSession | null>(null);

  // Policy Details Form
  const [provider, setProvider] = useState("Star Health & Allied Insurance");
  const [policyNumber, setPolicyNumber] = useState("SH-9922-10492");
  const [tpaName, setTpaName] = useState("Medi Assist TPA");
  const [sumInsured, setSumInsured] = useState("₹5,00,000");
  const [validTill, setValidTill] = useState("2027-03-31");
  const [cardUploaded, setCardUploaded] = useState(true);

  // Claim Status Tracker
  const [claimStatus, setClaimStatus] = useState<"pre_auth_approved" | "under_review" | "settled">("pre_auth_approved");
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const s = HospitalStore.getSession();
    if (!s) {
      window.location.href = "/login?portal=patient&redirect=/patient/insurance";
      return;
    }
    setSession(s);
  }, []);

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setFeedback(null);
    setTimeout(() => {
      setIsUpdating(false);
      setFeedback("Insurance policy and cashless TPA mapping saved successfully to hospital billing records.");
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-hospital-600 bg-hospital-50 px-2.5 py-1 rounded-full border border-hospital-100">
            Cashless Mediclaim &amp; TPA Desk
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-2">
            Insurance &amp; Cashless TPA Services
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Empaneled cashless settlement across Star Health, ICICI Lombard, HDFC ERGO, Niva Bupa, and TN CMCHIS scheme.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Hospital TPA Helpline
          </span>
          <a
            href="tel:+914222969999"
            className="text-xs font-bold text-hospital-700 hover:underline flex items-center gap-1 justify-end mt-0.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>+91 422 296 9999 (Ext 401)</span>
          </a>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Grid: Active Policy Card + Pre-Auth Claim Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Policy Card & Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Policy Card Display */}
          <div className="bg-gradient-to-br from-hospital-900 via-hospital-850 to-navy-950 text-white rounded-3xl p-6 sm:p-8 border border-hospital-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-300">
                  {provider}
                </span>
                <span className="text-xs text-hospital-200 block mt-0.5">Cashless Mediclaim Member</span>
              </div>
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>

            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-hospital-300">Policy / Card Number</span>
              <span className="text-xl font-black font-mono tracking-wider text-white block mt-0.5">
                {policyNumber}
              </span>
            </div>

            <div className="pt-3 border-t border-white/15 grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-hospital-300 block uppercase">Insured Sum</span>
                <strong className="text-white font-mono">{sumInsured}</strong>
              </div>
              <div>
                <span className="text-[10px] text-hospital-300 block uppercase">TPA Partner</span>
                <strong className="text-cyan-300 truncate block">{tpaName}</strong>
              </div>
              <div>
                <span className="text-[10px] text-hospital-300 block uppercase">Valid Until</span>
                <strong className="text-white">{validTill}</strong>
              </div>
            </div>
          </div>

          {/* Edit Policy Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Update Policy Details</h3>

            <form onSubmit={handleSavePolicy} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Insurance Provider *</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 bg-white"
                  >
                    <option value="Star Health & Allied Insurance">Star Health &amp; Allied Insurance</option>
                    <option value="ICICI Lombard General Insurance">ICICI Lombard General</option>
                    <option value="HDFC ERGO Health">HDFC ERGO Health</option>
                    <option value="Niva Bupa Health Insurance">Niva Bupa Health</option>
                    <option value="New India Assurance">New India Assurance</option>
                    <option value="Tamil Nadu CMCHIS Scheme">TN CMCHIS Scheme</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Policy / Member ID *</label>
                  <input
                    type="text"
                    required
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">TPA Coordinator Name</label>
                  <input
                    type="text"
                    value={tpaName}
                    onChange={(e) => setTpaName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Policy Valid Until</label>
                  <input
                    type="date"
                    value={validTill}
                    onChange={(e) => setValidTill(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 bg-white"
                  />
                </div>
              </div>

              {/* Upload trigger */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 text-center space-y-1.5 cursor-pointer hover:border-hospital-500 transition">
                <Upload className="w-5 h-5 mx-auto text-slate-400" />
                <span className="font-bold text-slate-800 block text-xs">
                  {cardUploaded ? "Insurance E-Card Attached (Encrypted) ✓" : "Upload Digital Insurance Card"}
                </span>
                <span className="text-[10px] text-slate-400">PDF, JPG up to 5MB</span>
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="primary" size="md" type="submit" isLoading={isUpdating}>
                  Save Insurance Records
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Pre-Auth Claim Status & Checklist */}
        <div className="lg:col-span-5 space-y-6">
          {/* Claim Status Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Cashless Claim Status</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                Active Pre-Auth
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Claim Ref ID:</span>
                <strong className="font-mono">CLM-202610-881</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pre-Auth Initial Approval:</span>
                <strong className="text-emerald-700 font-bold">₹25,000 Approved</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">TPA Processing Desk:</span>
                <span>Medi Assist Ground Floor Suite 12</span>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-2.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>1. Documents &amp; Policy Submitted</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>2. Hospital Clinical Estimation Sent</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>3. Initial Cashless Pre-Auth Granted</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Clock className="w-4 h-4" />
                <span>4. Final Discharge Settlement</span>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900 text-sm">Required Cashless Documents</h4>
            <ul className="space-y-1.5 list-disc pl-4 text-slate-700">
              <li>Original Photo ID (Aadhaar / Voter ID / Passport)</li>
              <li>Valid Health Insurance Card or Policy E-Copy</li>
              <li>Doctor Consultation Prescription &amp; Investigation Orders</li>
              <li>Employee ID Card (for Corporate Group Mediclaim)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
