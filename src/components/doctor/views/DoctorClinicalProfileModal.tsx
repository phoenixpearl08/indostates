"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  HeartPulse,
  Activity,
  AlertCircle,
  FileText,
  Pill,
  FlaskConical,
  ShieldCheck,
  Clock,
  Building,
  CheckCircle2,
} from "lucide-react";
import { PatientProfile } from "@/types/hms";

interface DoctorClinicalProfileModalProps {
  patientUhid: string;
  onClose: () => void;
  onStartConsultationWithPatient?: (patient: PatientProfile) => void;
}

export function DoctorClinicalProfileModal({
  patientUhid,
  onClose,
  onStartConsultationWithPatient,
}: DoctorClinicalProfileModalProps) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"summary" | "encounters" | "prescriptions" | "lab" | "timeline">("summary");

  useEffect(() => {
    fetchProfile();
  }, [patientUhid]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctor/patients?uhid=${patientUhid}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      }
    } catch (e) {
      console.error("Clinical profile error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!patientUhid) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-hospital-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {data?.patient?.fullName || "Patient Clinical Profile"}
                </h3>
                <span className="px-2 py-0.5 rounded bg-hospital-500/30 text-hospital-200 text-xs font-mono font-bold">
                  {patientUhid}
                </span>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                <span>Age: {data?.patient?.age || "—"}</span>
                <span>•</span>
                <span>Gender: {data?.patient?.gender || "—"}</span>
                <span>•</span>
                <span>Blood Group: {data?.patient?.bloodGroup || "O+ Positive"}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          {[
            { id: "summary", label: "Medical Summary" },
            { id: "encounters", label: `Consultations (${data?.encounters?.length || 0})` },
            { id: "prescriptions", label: `Prescriptions (${data?.prescriptions?.length || 0})` },
            { id: "lab", label: `Lab Orders (${data?.labOrders?.length || 0})` },
            { id: "timeline", label: "Full Timeline" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-hospital-700 text-hospital-800 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading clinical history...</div>
          ) : !data ? (
            <div className="py-12 text-center text-slate-400">Unable to load patient records.</div>
          ) : (
            <>
              {/* Tab 1: Medical Summary */}
              {activeTab === "summary" && (
                <div className="space-y-4">
                  {/* Critical Medical Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Primary Phone</div>
                      <div className="font-bold text-slate-800 text-sm">{data.patient.phone}</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Emergency Contact</div>
                      <div className="font-bold text-slate-800 text-sm">
                        {data.patient.emergencyContactName || "Family Attender"} ({data.patient.emergencyContactPhone || data.patient.phone})
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                      <div className="text-[10px] uppercase font-bold text-rose-700 mb-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Allergies & Contraindications</span>
                      </div>
                      <div className="font-bold text-rose-900">
                        {data.patient.allergies?.join(", ") || "No Known Drug Allergies (NKDA)"}
                      </div>
                    </div>
                  </div>

                  {/* Caregiver / Attender Consent (Section 19) */}
                  {data.consents && data.consents.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-hospital-50/60 border border-hospital-100 space-y-1">
                      <div className="font-bold text-hospital-900 text-xs flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-hospital-700" />
                        <span>Authorized Family Caregiver / Attender Proxy</span>
                      </div>
                      <div className="text-slate-600 text-[11px]">
                        {data.consents[0].caregiverName} ({data.consents[0].relationship}) is authorized for clinical care review under scope {data.consents[0].accessScope}.
                      </div>
                    </div>
                  )}

                  {/* Previous Diagnoses */}
                  <div className="p-4 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-2">Previous Clinical Diagnoses</h4>
                    {data.encounters && data.encounters.length > 0 ? (
                      <div className="space-y-2">
                        {data.encounters.map((enc: any) => (
                          <div key={enc.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between">
                            <div>
                              <div className="font-bold text-slate-800">{enc.diagnosis}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">{enc.chiefComplaint}</div>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(enc.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-400">No prior consultation encounters recorded.</div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Encounters */}
              {activeTab === "encounters" && (
                <div className="space-y-3">
                  {data.encounters && data.encounters.length > 0 ? (
                    data.encounters.map((enc: any) => (
                      <div key={enc.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <div>
                            <span className="font-bold text-sm text-slate-900">{enc.diagnosis}</span>
                            <div className="text-[11px] text-hospital-700 font-semibold">{enc.doctorName}</div>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {new Date(enc.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                          <div><span className="text-slate-400">BP:</span> {enc.vitals?.bloodPressure || "120/80"}</div>
                          <div><span className="text-slate-400">Pulse:</span> {enc.vitals?.pulseRate || 72} bpm</div>
                          <div><span className="text-slate-400">SpO2:</span> {enc.vitals?.oxygenSaturation || 98}%</div>
                          <div><span className="text-slate-400">Temp:</span> {enc.vitals?.temperature || 98.4}°F</div>
                        </div>
                        {enc.clinicalFindings && (
                          <div className="text-slate-600 bg-slate-50 p-2 rounded text-[11px]">
                            {enc.clinicalFindings}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400">No prior encounters found.</div>
                  )}
                </div>
              )}

              {/* Tab 3: Prescriptions */}
              {activeTab === "prescriptions" && (
                <div className="space-y-3">
                  {data.prescriptions && data.prescriptions.length > 0 ? (
                    data.prescriptions.map((rx: any) => (
                      <div key={rx.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="font-bold text-slate-900 font-mono">{rx.prescriptionId}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-hospital-100 text-hospital-800">
                            {rx.status.replace("_", " ")}
                          </span>
                        </div>
                        <div className="space-y-1 pt-1">
                          {rx.medications.map((m: any, mIdx: number) => (
                            <div key={mIdx} className="flex justify-between text-xs py-1 border-b border-slate-50">
                              <span className="font-bold text-slate-800">{m.medicineName}</span>
                              <span className="text-slate-600">{m.dosage} • {m.frequency} ({m.durationDays} days)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400">No prescriptions recorded.</div>
                  )}
                </div>
              )}

              {/* Tab 4: Lab Orders */}
              {activeTab === "lab" && (
                <div className="space-y-3">
                  {data.labOrders && data.labOrders.length > 0 ? (
                    data.labOrders.map((lab: any) => (
                      <div key={lab.id} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-800">{lab.testName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{lab.orderId} • {lab.sampleType}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          lab.isReportReleased ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {lab.isReportReleased ? "Report Released" : lab.sampleStatus}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400">No laboratory test orders found.</div>
                  )}
                </div>
              )}

              {/* Tab 5: Timeline */}
              {activeTab === "timeline" && (
                <div className="space-y-3">
                  {data.timeline && data.timeline.length > 0 ? (
                    data.timeline.map((evt: any) => (
                      <div key={evt.id} className="p-3 rounded-lg border border-slate-200 bg-white flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-hospital-600 mt-1.5 shrink-0" />
                        <div className="flex-1">
                          <div className="font-bold text-slate-800">{evt.title}</div>
                          <div className="text-slate-500 text-[11px]">{evt.description}</div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            {new Date(evt.timestamp).toLocaleString()} • {evt.actorName}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400">No clinical timeline events recorded.</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
          >
            Close Profile
          </button>

          {data?.patient && onStartConsultationWithPatient && (
            <button
              onClick={() => {
                onStartConsultationWithPatient(data.patient);
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <HeartPulse className="w-4 h-4" />
              <span>Start Consultation with Patient</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
