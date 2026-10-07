"use client";

import React, { useRef } from "react";
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Calendar,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
} from "lucide-react";

interface PrintablePrescriptionData {
  id: string;
  rxNumber: string;
  patientName: string;
  patientUhid: string;
  patientAge: number;
  patientGender: string;
  doctorName: string;
  doctorQualification: string;
  doctorRegNo: string;
  doctorDepartment: string;
  date: string;
  diagnosis: string;
  vitals?: {
    bpSystolic?: number;
    bpDiastolic?: number;
    pulse?: number;
    temperature?: number;
    weight?: number;
    spo2?: number;
  };
  medicines: Array<{
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
    route: string;
    instructions: string;
  }>;
  followUpDate?: string;
  followUpInstructions?: string;
}

interface DoctorPrintPrescriptionModalProps {
  prescription: PrintablePrescriptionData | null;
  onClose: () => void;
}

export function DoctorPrintPrescriptionModal({
  prescription,
  onClose,
}: DoctorPrintPrescriptionModalProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Controls Bar (hidden during window.print()) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Printer className="w-4 h-4 text-hospital-600" />
            <span>Digital Prescription Pass — {prescription.rxNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Prescription</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Prescription Body */}
        <div
          ref={printAreaRef}
          className="p-6 sm:p-8 overflow-y-auto print:p-0 print:m-0 print:overflow-visible space-y-6 text-slate-800"
        >
          {/* Hospital Header */}
          <div className="border-b-2 border-hospital-700 pb-4 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-hospital-700 text-white font-black flex items-center justify-center text-sm">
                  IS
                </div>
                <div>
                  <h1 className="text-xl font-black text-hospital-800 tracking-tight leading-none">
                    INDOSTATES MULTI-SPECIALTY HOSPITAL
                  </h1>
                  <span className="text-[10px] font-bold text-hospital-600 uppercase tracking-wider">
                    Center of Excellence in Clinical Healthcare
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Plot 12, Healthcare Avenue, Knowledge Park, New Delhi • Emergency: +91 11 2345 6789
              </p>
            </div>

            <div className="text-right space-y-0.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Prescription ID
              </span>
              <div className="font-mono text-sm font-extrabold text-hospital-800">
                {prescription.rxNumber}
              </div>
              <div className="text-[11px] text-slate-500">
                Date: {new Date(prescription.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </div>
            </div>
          </div>

          {/* Doctor & Patient Info Bar */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 text-xs">
            {/* Doctor Info */}
            <div className="space-y-1 border-r border-slate-200 pr-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Consultant Physician
              </div>
              <div className="font-bold text-sm text-slate-900">{prescription.doctorName}</div>
              <div className="text-[11px] text-slate-600">{prescription.doctorQualification}</div>
              <div className="text-[11px] text-hospital-700 font-semibold">
                Dept: {prescription.doctorDepartment} • Reg: {prescription.doctorRegNo}
              </div>
            </div>

            {/* Patient Info */}
            <div className="space-y-1 pl-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Patient Details
              </div>
              <div className="font-bold text-sm text-slate-900">{prescription.patientName}</div>
              <div className="text-[11px] text-slate-600">
                UHID: <span className="font-mono font-bold text-slate-900">{prescription.patientUhid}</span>
              </div>
              <div className="text-[11px] text-slate-600">
                Age: {prescription.patientAge} Years • Gender: {prescription.patientGender}
              </div>
            </div>
          </div>

          {/* Vitals Summary if available */}
          {prescription.vitals && (
            <div className="flex flex-wrap gap-4 text-xs bg-hospital-50/40 p-2.5 rounded-lg border border-hospital-100">
              <span className="font-bold text-slate-600">Recorded Vitals:</span>
              {prescription.vitals.bpSystolic && (
                <span>BP: <strong className="text-slate-800">{prescription.vitals.bpSystolic}/{prescription.vitals.bpDiastolic} mmHg</strong></span>
              )}
              {prescription.vitals.pulse && (
                <span>Pulse: <strong className="text-slate-800">{prescription.vitals.pulse} bpm</strong></span>
              )}
              {prescription.vitals.temperature && (
                <span>Temp: <strong className="text-slate-800">{prescription.vitals.temperature} °F</strong></span>
              )}
              {prescription.vitals.spo2 && (
                <span>SpO2: <strong className="text-slate-800">{prescription.vitals.spo2}%</strong></span>
              )}
              {prescription.vitals.weight && (
                <span>Weight: <strong className="text-slate-800">{prescription.vitals.weight} kg</strong></span>
              )}
            </div>
          )}

          {/* Clinical Diagnosis */}
          <div className="text-xs">
            <span className="font-bold text-slate-700">Diagnosis: </span>
            <span className="font-bold text-hospital-800 text-sm">{prescription.diagnosis}</span>
          </div>

          {/* Rx Symbol & Medication Table */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black font-serif text-hospital-800">℞</span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Prescribed Medications
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 font-bold">#</th>
                    <th className="py-2 px-3 font-bold">Medicine Name</th>
                    <th className="py-2 px-3 font-bold">Dosage</th>
                    <th className="py-2 px-3 font-bold">Frequency</th>
                    <th className="py-2 px-3 font-bold">Duration</th>
                    <th className="py-2 px-3 font-bold">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prescription.medicines.map((m, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{m.medicine}</td>
                      <td className="py-2.5 px-3 text-slate-700">{m.dosage}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-hospital-700">{m.frequency}</td>
                      <td className="py-2.5 px-3 text-slate-700">{m.duration}</td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px]">{m.instructions || "As advised"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Follow-up & Advice */}
          {(prescription.followUpDate || prescription.followUpInstructions) && (
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 text-xs space-y-1">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                Follow-up Consultation Advice
              </div>
              {prescription.followUpDate && (
                <div className="text-slate-700">
                  Review on: <strong className="text-slate-900">{new Date(prescription.followUpDate).toLocaleDateString()}</strong>
                </div>
              )}
              {prescription.followUpInstructions && (
                <div className="text-slate-600 text-[11px]">
                  Note: {prescription.followUpInstructions}
                </div>
              )}
            </div>
          )}

          {/* Footer Signature & Verification Block */}
          <div className="pt-6 border-t border-slate-200 flex items-end justify-between text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>Digitally Authenticated EMR Record</span>
              </div>
              <p className="text-[10px] text-slate-400 max-w-xs">
                Generated via IndoStates Hospital Clinical Information System. Valid across IndoStates Hospital Pharmacy & Diagnostics.
              </p>
            </div>

            <div className="text-right space-y-1">
              <div className="font-serif italic font-bold text-sm text-hospital-800">
                {prescription.doctorName}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Signature of Attending Doctor
              </div>
              <div className="text-[10px] text-slate-400">
                KMC License #{prescription.doctorRegNo}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
