"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Pill,
  Download,
  Printer,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  ShoppingBag,
  Stethoscope,
  Plus,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { PrescriptionRecord, PrescriptionItem } from "@/types/hms";
import { formatDate } from "@/lib/utils";

export default function PatientPrescriptionsPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRx, setSelectedRx] = useState<PrescriptionRecord | null>(null);

  useEffect(() => {
    const s = HospitalStore.getSession();
    if (!s) {
      window.location.href = "/login?portal=patient&redirect=/patient/prescriptions";
      return;
    }
    setSession(s);
    fetchPrescriptions(s);
  }, []);

  const fetchPrescriptions = async (user: UserSession) => {
    setIsLoading(true);
    try {
      const patientId = user.id;
      const res = await fetch(`/api/hms/prescriptions?patientId=${patientId}`);
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.prescriptions)) {
          setPrescriptions(d.prescriptions);
          setIsLoading(false);
          return;
        }
      }

      // Default mock prescriptions
      setPrescriptions([
        {
          id: "rx-001",
          prescriptionId: "RX-44910",
          encounterId: "enc-001",
          appointmentId: "apt-1",
          patientId: user.id,
          patientName: user.name || "Murugan Selvam",
          doctorId: "dr-rajesh",
          doctorName: "Dr. Rajesh Rangaswamy",
          medications: [
            {
              id: "m-1",
              medicineName: "Atorvastatin Calcium",
              dosage: "20 mg",
              frequency: "0-0-1 (Night)",
              durationDays: 30,
              instructions: "Take once daily after dinner with water. Avoid grapefruit juice.",
            },
            {
              id: "m-2",
              medicineName: "Ecosprin (Aspirin Gastro-resistant)",
              dosage: "75 mg",
              frequency: "0-1-0 (Noon)",
              durationDays: 30,
              instructions: "Take after lunch. Do not take on an empty stomach.",
            },
            {
              id: "m-3",
              medicineName: "Telmisartan Tablets IP",
              dosage: "40 mg",
              frequency: "1-0-0 (Morning)",
              durationDays: 30,
              instructions: "Take in the morning after breakfast.",
            },
          ],
          instructions: "Continue regular blood pressure checks. Follow low sodium, heart-healthy diet. Revisit OPD in 30 days.",
          status: "dispensed",
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
        {
          id: "rx-002",
          prescriptionId: "RX-44911",
          encounterId: "enc-002",
          appointmentId: "apt-2",
          patientId: user.id,
          patientName: user.name || "Murugan Selvam",
          doctorId: "dr-logesh",
          doctorName: "Dr. Logesh Thirumalaisamy",
          medications: [
            {
              id: "m-4",
              medicineName: "Paracetamol Extended Release",
              dosage: "650 mg",
              frequency: "1-0-1 (SOS / When required)",
              durationDays: 5,
              instructions: "Take for body ache or temperature above 99.5°F. Max 3 tablets in 24 hours.",
            },
            {
              id: "m-5",
              medicineName: "Pantoprazole Gastro-resistant",
              dosage: "40 mg",
              frequency: "1-0-0 (Morning)",
              durationDays: 7,
              instructions: "Take 30 minutes before breakfast on an empty stomach.",
            },
          ],
          instructions: "Drink adequate oral fluids. Rest adequately.",
          status: "dispensed",
          createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRx = prescriptions.filter((rx) => {
    return (
      rx.prescriptionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.medications.some((m) => m.medicineName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            Digital Health Regimens
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-2">
            Doctor Prescriptions (e-Rx)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Digitally certified medical prescriptions with dosages, food timing instructions, and refill records.
          </p>
        </div>

        <Link
          href="/patient/pharmacy"
          className="px-5 py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Pharmacy Dispensing</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search medicine name, physician, or Rx ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none bg-slate-50/50"
          />
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-hospital-600" />
            <span>Loading active medical prescriptions...</span>
          </div>
        ) : filteredRx.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
            <Pill className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-900 text-sm">No Prescriptions Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No active or previous medication regimens match your search.
            </p>
          </div>
        ) : (
          filteredRx.map((rx) => (
            <div
              key={rx.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 hover:shadow-card transition space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      {rx.prescriptionId}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                      Status: {rx.status}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base mt-1.5 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-hospital-600" />
                    <span>Prescribed by {rx.doctorName}</span>
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Prescription Date
                  </span>
                  <span className="font-bold text-slate-900 text-sm block">
                    {formatDate(rx.createdAt)}
                  </span>
                </div>
              </div>

              {/* Medicines Table / Cards */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Prescribed Medication Regimen ({rx.medications.length} items)
                </span>

                <div className="space-y-2">
                  {rx.medications.map((it: PrescriptionItem, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <strong className="text-slate-900 font-extrabold text-sm block">
                          {it.medicineName} <span className="text-hospital-700 font-bold">({it.dosage})</span>
                        </strong>
                        <span className="text-slate-600 font-medium">
                          Timing: <strong>{it.frequency}</strong> • Duration: <strong>{it.durationDays} days</strong>
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5 italic">
                          Instruction: {it.instructions}
                        </p>
                      </div>

                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100/70 text-emerald-800 font-bold text-[10px] uppercase">
                        Active Dose
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Physician Advice */}
              {rx.instructions && (
                <div className="bg-hospital-50/50 p-3.5 rounded-2xl border border-hospital-100 text-xs text-hospital-900 space-y-1">
                  <strong className="font-bold block">Physician General Advice:</strong>
                  <p className="leading-relaxed text-hospital-800">{rx.instructions}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Authorized digital e-prescription valid at all pharmacy outlets</span>
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/patient/pharmacy?rxId=${rx.prescriptionId}`}
                    className="px-3.5 py-1.5 rounded-xl bg-hospital-50 hover:bg-hospital-100 text-hospital-800 font-bold text-xs transition"
                  >
                    Pharmacy Refill &rarr;
                  </Link>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Rx</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
