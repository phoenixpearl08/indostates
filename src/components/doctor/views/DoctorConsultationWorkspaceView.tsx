"use client";

import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Pill,
  FlaskConical,
  Calendar,
  Clock,
  User,
  Plus,
  Trash2,
  Printer,
  ChevronLeft,
  HeartPulse,
  Activity,
  Sparkles,
  ClipboardList,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { QueueEntry } from "@/types/hms";
import { Doctor } from "@/data/hospitalData";
import { PatientDossier } from "@/lib/doctorService";

interface PrescriptionItem {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
}

interface LabOrderItem {
  testName: string;
  priority: "routine" | "urgent" | "stat";
  clinicalIndication: string;
}

interface DoctorConsultationWorkspaceViewProps {
  doctor: Doctor;
  activePatient: QueueEntry | null;
  onClose: () => void;
  onConsultationCompleted: () => void;
  onOpenPatientDossier: (patientId: string) => void;
  onOpenPrintPrescription: (prescriptionData: any) => void;
}

const COMMON_MEDICINES = [
  { name: "Paracetamol 650mg", defaultDosage: "1 Tab", defaultFreq: "1-0-1", defaultRoute: "Oral" },
  { name: "Amoxicillin + Clavulanic Acid 625mg", defaultDosage: "1 Tab", defaultFreq: "1-0-1", defaultRoute: "Oral" },
  { name: "Pantoprazole 40mg", defaultDosage: "1 Tab", defaultFreq: "1-0-0 (Empty Stomach)", defaultRoute: "Oral" },
  { name: "Cetirizine 10mg", defaultDosage: "1 Tab", defaultFreq: "0-0-1 (Bedtime)", defaultRoute: "Oral" },
  { name: "Metformin 500mg", defaultDosage: "1 Tab", defaultFreq: "1-0-1 (After Food)", defaultRoute: "Oral" },
  { name: "Azithromycin 500mg", defaultDosage: "1 Tab", defaultFreq: "1-0-0 (1 hr before food)", defaultRoute: "Oral" },
  { name: "Ibuprofen 400mg", defaultDosage: "1 Tab", defaultFreq: "SOS (After food)", defaultRoute: "Oral" },
  { name: "ORS Sachet", defaultDosage: "1 Sachet in 1L water", defaultFreq: "Sip throughout day", defaultRoute: "Oral" },
  { name: "Salbutamol Inhaler 100mcg", defaultDosage: "2 Puffs", defaultFreq: "SOS as needed", defaultRoute: "Inhalation" },
];

const COMMON_LAB_TESTS = [
  { name: "Complete Blood Count (CBC)", priority: "routine" as const },
  { name: "Random Blood Sugar (RBS)", priority: "routine" as const },
  { name: "HbA1c Glycated Hemoglobin", priority: "routine" as const },
  { name: "Liver Function Test (LFT)", priority: "routine" as const },
  { name: "Kidney Function Test (KFT / Serum Creatinine)", priority: "routine" as const },
  { name: "Lipid Profile", priority: "routine" as const },
  { name: "Urine Routine & Microscopy", priority: "routine" as const },
  { name: "Chest X-Ray PA View", priority: "routine" as const },
  { name: "12-Lead Electrocardiogram (ECG)", priority: "urgent" as const },
  { name: "Serum Electrolytes (Na+, K+, Cl-)", priority: "urgent" as const },
  { name: "D-Dimer Quantitative", priority: "stat" as const },
  { name: "Troponin-I High Sensitivity", priority: "stat" as const },
];

export function DoctorConsultationWorkspaceView({
  doctor,
  activePatient,
  onClose,
  onConsultationCompleted,
  onOpenPatientDossier,
  onOpenPrintPrescription,
}: DoctorConsultationWorkspaceViewProps) {
  // Clinical fields state
  const [chiefComplaint, setChiefComplaint] = useState(activePatient?.triageNotes || "");
  const [historyOfPresentIllness, setHistoryOfPresentIllness] = useState("");
  const [physicalExamination, setPhysicalExamination] = useState("");
  const [clinicalAssessment, setClinicalAssessment] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [icd10Code, setIcd10Code] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");

  // Vitals
  const [vitals, setVitals] = useState({
    bpSystolic: activePatient?.vitals?.bpSystolic || 120,
    bpDiastolic: activePatient?.vitals?.bpDiastolic || 80,
    pulse: activePatient?.vitals?.pulse || 72,
    temperature: activePatient?.vitals?.temperature || 98.6,
    spo2: activePatient?.vitals?.spo2 || 99,
    weight: activePatient?.vitals?.weight || 68,
    height: 170,
    respiratoryRate: 16,
  });

  // Prescriptions
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      medicine: "Paracetamol 650mg",
      dosage: "1 Tablet",
      frequency: "1-0-1 (BD)",
      duration: "3 Days",
      route: "Oral",
      instructions: "After meals. For pain/fever.",
    },
  ]);

  // New med line
  const [newMed, setNewMed] = useState<PrescriptionItem>({
    medicine: "",
    dosage: "1 Tab",
    frequency: "1-0-1",
    duration: "5 Days",
    route: "Oral",
    instructions: "After food",
  });

  // Lab Orders
  const [labOrders, setLabOrders] = useState<LabOrderItem[]>([]);
  const [newLab, setNewLab] = useState<LabOrderItem>({
    testName: "",
    priority: "routine",
    clinicalIndication: "",
  });

  // Follow-up
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpInstructions, setFollowUpInstructions] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"clinical" | "rx" | "lab" | "followup">("clinical");

  // Load existing draft if any
  useEffect(() => {
    if (activePatient) {
      loadExistingDraft();
    }
  }, [activePatient?.id]);

  const loadExistingDraft = async () => {
    try {
      const res = await fetch(`/api/doctor/consultations?patientId=${activePatient?.patientId}&status=draft`);
      if (res.ok) {
        const data = await res.json();
        if (data.consultations && data.consultations.length > 0) {
          const draft = data.consultations[0];
          setChiefComplaint(draft.chiefComplaint || "");
          setHistoryOfPresentIllness(draft.historyOfPresentIllness || "");
          setPhysicalExamination(draft.physicalExamination || "");
          setClinicalAssessment(draft.clinicalAssessment || "");
          setDiagnosis(draft.diagnosis || "");
          setIcd10Code(draft.icd10Code || "");
          setTreatmentPlan(draft.treatmentPlan || "");
          setDoctorNotes(draft.doctorNotes || "");
          if (draft.prescriptions && draft.prescriptions.length > 0) {
            setPrescriptions(draft.prescriptions);
          }
          if (draft.labOrders && draft.labOrders.length > 0) {
            setLabOrders(draft.labOrders);
          }
          if (draft.followUpDate) setFollowUpDate(draft.followUpDate);
          if (draft.followUpInstructions) setFollowUpInstructions(draft.followUpInstructions);
        }
      }
    } catch (e) {
      console.warn("Could not load draft:", e);
    }
  };

  if (!activePatient) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
        <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Patient Selected for Consultation</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
          Please select a waiting patient from Today's Queue or patient search to start clinical consultation.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-hospital-600 text-white font-bold text-xs"
        >
          Return to Queue
        </button>
      </div>
    );
  }

  // Prescription Helpers
  const addPrescriptionItem = () => {
    if (!newMed.medicine.trim()) return;
    setPrescriptions([...prescriptions, { ...newMed }]);
    setNewMed({
      medicine: "",
      dosage: "1 Tab",
      frequency: "1-0-1",
      duration: "5 Days",
      route: "Oral",
      instructions: "After food",
    });
  };

  const removePrescriptionItem = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const quickPickMedicine = (med: (typeof COMMON_MEDICINES)[0]) => {
    setNewMed({
      medicine: med.name,
      dosage: med.defaultDosage,
      frequency: med.defaultFreq,
      duration: "5 Days",
      route: med.defaultRoute,
      instructions: "As directed",
    });
  };

  // Lab Helpers
  const addLabItem = () => {
    if (!newLab.testName.trim()) return;
    setLabOrders([...labOrders, { ...newLab }]);
    setNewLab({
      testName: "",
      priority: "routine",
      clinicalIndication: diagnosis || "",
    });
  };

  const removeLabItem = (index: number) => {
    setLabOrders(labOrders.filter((_, i) => i !== index));
  };

  const quickPickLab = (test: (typeof COMMON_LAB_TESTS)[0]) => {
    setLabOrders([
      ...labOrders,
      {
        testName: test.name,
        priority: test.priority,
        clinicalIndication: diagnosis || "Diagnostic assessment",
      },
    ]);
  };

  // Save consultation handler
  const handleSaveConsultation = async (status: "draft" | "completed") => {
    setError(null);
    setSuccessMessage(null);

    if (status === "completed") {
      if (!chiefComplaint.trim()) {
        setError("Chief Complaint is mandatory to finalize consultation.");
        setActiveTab("clinical");
        return;
      }
      if (!diagnosis.trim()) {
        setError("Clinical Diagnosis is mandatory to finalize consultation.");
        setActiveTab("clinical");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        patientId: activePatient.patientId,
        queueEntryId: activePatient.id,
        appointmentId: activePatient.appointmentId,
        doctorId: doctor.id,
        doctorName: doctor.name,
        department: doctor.department,
        chiefComplaint,
        historyOfPresentIllness,
        physicalExamination,
        clinicalAssessment,
        diagnosis,
        icd10Code,
        treatmentPlan,
        doctorNotes,
        vitals,
        prescriptions,
        labOrders,
        followUpDate: followUpDate || null,
        followUpInstructions: followUpInstructions || null,
        status,
      };

      const res = await fetch("/api/doctor/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to record consultation");
      }

      const result = await res.json();

      if (status === "completed") {
        setSuccessMessage("Consultation finalized successfully. Queue updated & Rx sent to pharmacy.");

        // If prescription was created, offer to print
        if (prescriptions.length > 0) {
          const printableData = {
            id: result.consultation?.prescriptionId || `RX-${Date.now().toString().slice(-6)}`,
            rxNumber: `RX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            patientName: activePatient.patientName,
            patientUhid: activePatient.patientUhid,
            patientAge: activePatient.patientAge,
            patientGender: activePatient.patientGender,
            doctorName: doctor.name,
            doctorQualification: doctor.qualification,
            doctorRegNo: doctor.licenseNumber || "KMC-48291",
            doctorDepartment: doctor.department,
            date: new Date().toISOString(),
            diagnosis,
            vitals,
            medicines: prescriptions,
            followUpDate,
            followUpInstructions,
          };
          onOpenPrintPrescription(printableData);
        }

        setTimeout(() => {
          onConsultationCompleted();
        }, 1500);
      } else {
        setSuccessMessage("Consultation draft saved successfully.");
      }
    } catch (err: any) {
      console.error("Save consultation error:", err);
      setError(err.message || "Failed to save consultation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for quick follow-up date calculation
  const setQuickFollowUp = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setFollowUpDate(d.toISOString().split("T")[0]);
  };

  return (
    <div className="space-y-5">
      {/* Top Patient Bar */}
      <div className="bg-white rounded-2xl border border-hospital-200/90 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Return to Queue"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="w-11 h-11 rounded-xl bg-hospital-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
              #{activePatient.tokenNumber}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {activePatient.patientName}
                </h2>
                <span className="font-mono text-xs font-bold text-hospital-700 bg-hospital-50 px-2 py-0.5 rounded border border-hospital-200">
                  {activePatient.patientUhid}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {activePatient.patientGender}, {activePatient.patientAge} yrs
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span>Room: <strong className="text-slate-700">{doctor.opdRoom || "OPD-104"}</strong></span>
                <span>•</span>
                <span>Type: <strong className="text-slate-700 capitalize">{activePatient.appointmentType}</strong></span>
                <span>•</span>
                <span>Triage: <strong className="text-slate-700 capitalize">{activePatient.priority} Priority</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPatientDossier(activePatient.patientId)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Full Medical Dossier</span>
            </button>

            <button
              onClick={() => handleSaveConsultation("draft")}
              disabled={isSubmitting}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-amber-600" />
              <span>Save Draft</span>
            </button>

            <button
              onClick={() => handleSaveConsultation("completed")}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Finalizing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Finalize Consultation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs for Workspace */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-xl shadow-2xs">
        <button
          onClick={() => setActiveTab("clinical")}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "clinical"
              ? "border-hospital-600 text-hospital-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Clinical Examination & Diagnosis</span>
        </button>

        <button
          onClick={() => setActiveTab("rx")}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "rx"
              ? "border-hospital-600 text-hospital-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Digital Prescription ({prescriptions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("lab")}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "lab"
              ? "border-hospital-600 text-hospital-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Lab & Diagnostic Orders ({labOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("followup")}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "followup"
              ? "border-hospital-600 text-hospital-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Follow-up & Advice</span>
        </button>
      </div>

      {/* TAB 1: Clinical Examination & Diagnosis */}
      {activeTab === "clinical" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left 2 Cols: Main Clinical Notes */}
          <div className="lg:col-span-2 space-y-4">
            {/* Chief Complaint */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  Chief Complaint *
                </span>
                <span className="text-[10px] text-rose-500 font-normal">Required for EMR</span>
              </label>
              <textarea
                rows={2}
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="e.g. High fever for 3 days with productive cough, headache and chills..."
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-hidden"
              />
            </div>

            {/* History of Present Illness (HPI) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <ClipboardList className="w-4 h-4 text-hospital-600" />
                History of Present Illness (HPI) & Medical History
              </label>
              <textarea
                rows={2}
                value={historyOfPresentIllness}
                onChange={(e) => setHistoryOfPresentIllness(e.target.value)}
                placeholder="Onset, duration, severity, aggravating/relieving factors, previous episodes, known drug allergies..."
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-hidden"
              />
            </div>

            {/* Physical Examination */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <Activity className="w-4 h-4 text-hospital-600" />
                Physical Examination
              </label>
              <textarea
                rows={2}
                value={physicalExamination}
                onChange={(e) => setPhysicalExamination(e.target.value)}
                placeholder="General appearance, chest auscultation (bilateral air entry, wheeze/creps), CVS (S1 S2 normal), per abdomen (soft, non-tender)..."
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-hidden"
              />
            </div>

            {/* Assessment & Diagnosis */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                    <Stethoscope className="w-4 h-4 text-hospital-600" />
                    Clinical Diagnosis *
                  </label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Acute Upper Respiratory Tract Infection / Bronchitis"
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-hospital-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                    ICD-10 Code
                  </label>
                  <input
                    type="text"
                    value={icd10Code}
                    onChange={(e) => setIcd10Code(e.target.value)}
                    placeholder="e.g. J06.9 / J20.9"
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 focus:ring-2 focus:ring-hospital-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                  Clinical Assessment & Discussion
                </label>
                <textarea
                  rows={2}
                  value={clinicalAssessment}
                  onChange={(e) => setClinicalAssessment(e.target.value)}
                  placeholder="Clinical impression, differential diagnoses considered, severity score..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Treatment Plan & Doctor's Notes */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <FileText className="w-4 h-4 text-hospital-600" />
                Treatment Plan & Advice
              </label>
              <textarea
                rows={2}
                value={treatmentPlan}
                onChange={(e) => setTreatmentPlan(e.target.value)}
                placeholder="Treatment strategy, hydration, rest, steam inhalation, warning signs to watch out for..."
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-hidden"
              />

              <div className="mt-3 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mb-1">
                  Confidential Doctor Notes (Internal HMS only)
                </label>
                <input
                  type="text"
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Observations for next visiting physician..."
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs text-slate-600 focus:ring-2 focus:ring-hospital-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Right Col: Vitals & Quick Reference */}
          <div className="space-y-4">
            {/* Vitals Panel */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-3">
                <HeartPulse className="w-4 h-4 text-hospital-600" />
                Patient Vitals
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">BP (mmHg)</label>
                    <div className="flex items-center gap-1 mt-0.5">
                      <input
                        type="number"
                        value={vitals.bpSystolic}
                        onChange={(e) => setVitals({ ...vitals, bpSystolic: Number(e.target.value) })}
                        className="w-full p-1.5 rounded border border-slate-200 text-xs text-center font-bold"
                        title="Systolic"
                      />
                      <span className="text-slate-400">/</span>
                      <input
                        type="number"
                        value={vitals.bpDiastolic}
                        onChange={(e) => setVitals({ ...vitals, bpDiastolic: Number(e.target.value) })}
                        className="w-full p-1.5 rounded border border-slate-200 text-xs text-center font-bold"
                        title="Diastolic"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Pulse (bpm)</label>
                    <input
                      type="number"
                      value={vitals.pulse}
                      onChange={(e) => setVitals({ ...vitals, pulse: Number(e.target.value) })}
                      className="w-full p-1.5 mt-0.5 rounded border border-slate-200 text-xs text-center font-bold text-rose-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">SpO2 (%)</label>
                    <input
                      type="number"
                      value={vitals.spo2}
                      onChange={(e) => setVitals({ ...vitals, spo2: Number(e.target.value) })}
                      className="w-full p-1.5 mt-0.5 rounded border border-slate-200 text-xs text-center font-bold text-sky-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Temp (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={vitals.temperature}
                      onChange={(e) => setVitals({ ...vitals, temperature: Number(e.target.value) })}
                      className="w-full p-1.5 mt-0.5 rounded border border-slate-200 text-xs text-center font-bold text-amber-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Weight (kg)</label>
                    <input
                      type="number"
                      value={vitals.weight}
                      onChange={(e) => setVitals({ ...vitals, weight: Number(e.target.value) })}
                      className="w-full p-1.5 mt-0.5 rounded border border-slate-200 text-xs text-center font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Resp Rate (/min)</label>
                    <input
                      type="number"
                      value={vitals.respiratoryRate}
                      onChange={(e) => setVitals({ ...vitals, respiratoryRate: Number(e.target.value) })}
                      className="w-full p-1.5 mt-0.5 rounded border border-slate-200 text-xs text-center font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action to Prescription or Lab */}
            <div className="bg-hospital-50/70 border border-hospital-100 rounded-xl p-4 space-y-2.5">
              <h4 className="text-xs font-bold text-hospital-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-hospital-600" />
                Next Clinical Actions
              </h4>
              <button
                onClick={() => setActiveTab("rx")}
                className="w-full py-2 px-3 rounded-lg bg-white hover:bg-hospital-100 text-hospital-800 border border-hospital-200 font-bold text-xs flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-hospital-600" />
                  Prescribe Medications
                </span>
                <span className="text-[10px] bg-hospital-100 px-1.5 py-0.5 rounded font-bold">
                  {prescriptions.length} Added
                </span>
              </button>

              <button
                onClick={() => setActiveTab("lab")}
                className="w-full py-2 px-3 rounded-lg bg-white hover:bg-hospital-100 text-hospital-800 border border-hospital-200 font-bold text-xs flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-hospital-600" />
                  Order Lab / Radiology Tests
                </span>
                <span className="text-[10px] bg-hospital-100 px-1.5 py-0.5 rounded font-bold">
                  {labOrders.length} Ordered
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Digital Prescription Builder */}
      {activeTab === "rx" && (
        <div className="space-y-5">
          {/* Quick formulary pick */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-hospital-600" />
                Hospital Formulary Quick-Select:
              </span>
              <span className="text-[11px] text-slate-500">Click to autofill medicine card</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_MEDICINES.map((med, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => quickPickMedicine(med)}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-hospital-50 hover:text-hospital-700 hover:border-hospital-200 text-slate-700 border border-slate-200 text-[11px] font-medium transition-colors"
                >
                  + {med.name}
                </button>
              ))}
            </div>
          </div>

          {/* Add Medicine Form */}
          <div className="bg-white p-4 rounded-xl border border-hospital-200 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-hospital-600" />
              Add Prescription Item
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-600">Medicine Name</label>
                <input
                  type="text"
                  value={newMed.medicine}
                  onChange={(e) => setNewMed({ ...newMed, medicine: e.target.value })}
                  placeholder="e.g. Paracetamol 650mg"
                  className="w-full p-2 mt-0.5 rounded-lg border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600">Dosage</label>
                <input
                  type="text"
                  value={newMed.dosage}
                  onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                  placeholder="e.g. 1 Tablet"
                  className="w-full p-2 mt-0.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600">Frequency</label>
                <select
                  value={newMed.frequency}
                  onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                  className="w-full p-2 mt-0.5 rounded-lg border border-slate-200 text-xs bg-white"
                >
                  <option value="1-0-1">1-0-1 (Twice daily)</option>
                  <option value="1-1-1">1-1-1 (Thrice daily)</option>
                  <option value="1-0-0">1-0-0 (Morning only)</option>
                  <option value="0-0-1">0-0-1 (Night only)</option>
                  <option value="SOS">SOS (When required)</option>
                  <option value="Stat">Stat (Immediate dose)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600">Duration</label>
                <input
                  type="text"
                  value={newMed.duration}
                  onChange={(e) => setNewMed({ ...newMed, duration: e.target.value })}
                  placeholder="e.g. 5 Days"
                  className="w-full p-2 mt-0.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600">Route</label>
                <select
                  value={newMed.route}
                  onChange={(e) => setNewMed({ ...newMed, route: e.target.value })}
                  className="w-full p-2 mt-0.5 rounded-lg border border-slate-200 text-xs bg-white"
                >
                  <option value="Oral">Oral</option>
                  <option value="Topical">Topical</option>
                  <option value="Inhalation">Inhalation</option>
                  <option value="IV">IV</option>
                  <option value="IM">IM</option>
                  <option value="Sublingual">Sublingual</option>
                </select>
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={newMed.instructions}
                  onChange={(e) => setNewMed({ ...newMed, instructions: e.target.value })}
                  placeholder="Special instructions (e.g. After meals with warm water, avoid milk)..."
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <button
                type="button"
                onClick={addPrescriptionItem}
                disabled={!newMed.medicine.trim()}
                className="px-4 py-2 rounded-lg bg-hospital-600 hover:bg-hospital-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Prescription</span>
              </button>
            </div>
          </div>

          {/* Current Prescriptions Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Prescribed Medications ({prescriptions.length})
              </span>
              <span className="text-[11px] text-slate-500">
                Will be automatically queued at IndoStates Hospital Pharmacy
              </span>
            </div>

            {prescriptions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No medications added yet. Add from the form above or pick from the formulary.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">#</th>
                      <th className="py-2.5 px-4 font-semibold">Medicine</th>
                      <th className="py-2.5 px-4 font-semibold">Dosage</th>
                      <th className="py-2.5 px-4 font-semibold">Frequency</th>
                      <th className="py-2.5 px-4 font-semibold">Duration</th>
                      <th className="py-2.5 px-4 font-semibold">Route</th>
                      <th className="py-2.5 px-4 font-semibold">Instructions</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {prescriptions.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-4 font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">{p.medicine}</td>
                        <td className="py-2.5 px-4 text-slate-700">{p.dosage}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-hospital-700 bg-hospital-50/50">
                          {p.frequency}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">{p.duration}</td>
                        <td className="py-2.5 px-4 text-slate-600">{p.route}</td>
                        <td className="py-2.5 px-4 text-slate-500">{p.instructions || "—"}</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => removePrescriptionItem(idx)}
                            className="p-1 rounded text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Remove medication"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Lab & Diagnostic Orders */}
      {activeTab === "lab" && (
        <div className="space-y-5">
          {/* Quick Lab tests pick */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-hospital-600" />
                Frequently Ordered Clinical Investigations:
              </span>
              <span className="text-[11px] text-slate-500">Click to add test</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_LAB_TESTS.map((test, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => quickPickLab(test)}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-hospital-50 hover:text-hospital-700 hover:border-hospital-200 text-slate-700 border border-slate-200 text-[11px] font-medium transition-colors"
                >
                  + {test.name}
                </button>
              ))}
            </div>
          </div>

          {/* Add Custom Test */}
          <div className="bg-white p-4 rounded-xl border border-hospital-200 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-hospital-600" />
              Order Diagnostic Test
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-600">Test / Investigation Name</label>
                <input
                  type="text"
                  value={newLab.testName}
                  onChange={(e) => setNewLab({ ...newLab, testName: e.target.value })}
                  placeholder="e.g. USG Whole Abdomen / 2D Echocardiography / Serum Ferritin"
                  className="w-full p-2 mt-0.5 rounded-lg border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600">Priority Level</label>
                <select
                  value={newLab.priority}
                  onChange={(e: any) => setNewLab({ ...newLab, priority: e.target.value })}
                  className="w-full p-2 mt-0.5 rounded-lg border border-slate-200 text-xs bg-white font-bold"
                >
                  <option value="routine">Routine (Same Day)</option>
                  <option value="urgent">Urgent (&lt; 2 Hours)</option>
                  <option value="stat">STAT / Emergency (&lt; 30 Mins)</option>
                </select>
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={newLab.clinicalIndication}
                  onChange={(e) => setNewLab({ ...newLab, clinicalIndication: e.target.value })}
                  placeholder="Clinical Indication / Reason for test (e.g. Rule out dengue, acute abdomen, chest pain)..."
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <button
                type="button"
                onClick={addLabItem}
                disabled={!newLab.testName.trim()}
                className="px-4 py-2 rounded-lg bg-hospital-600 hover:bg-hospital-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Test Order</span>
              </button>
            </div>
          </div>

          {/* Current Lab Orders Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Tests Ordered ({labOrders.length})
              </span>
              <span className="text-[11px] text-slate-500">
                Will be submitted to IndoStates Central Diagnostic Laboratory
              </span>
            </div>

            {labOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No lab tests ordered for this consultation yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">#</th>
                      <th className="py-2.5 px-4 font-semibold">Investigation Name</th>
                      <th className="py-2.5 px-4 font-semibold">Priority</th>
                      <th className="py-2.5 px-4 font-semibold">Clinical Indication</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {labOrders.map((l, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-4 font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">{l.testName}</td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              l.priority === "stat"
                                ? "bg-rose-100 text-rose-800 border border-rose-300"
                                : l.priority === "urgent"
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {l.priority}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">{l.clinicalIndication || "Diagnostic evaluation"}</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => removeLabItem(idx)}
                            className="p-1 rounded text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Remove test"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Follow-up & Advice */}
      {activeTab === "followup" && (
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4 max-w-2xl">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-hospital-600" />
              Schedule Follow-up Consultation
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Set the review date for this patient. This will appear on the prescription and in the patient portal.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
              Quick Select Follow-up Period:
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setQuickFollowUp(3)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-hospital-50 hover:text-hospital-700 transition-colors"
              >
                In 3 Days
              </button>
              <button
                type="button"
                onClick={() => setQuickFollowUp(7)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-hospital-50 hover:text-hospital-700 transition-colors"
              >
                In 1 Week
              </button>
              <button
                type="button"
                onClick={() => setQuickFollowUp(14)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-hospital-50 hover:text-hospital-700 transition-colors"
              >
                In 2 Weeks
              </button>
              <button
                type="button"
                onClick={() => setQuickFollowUp(30)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-hospital-50 hover:text-hospital-700 transition-colors"
              >
                In 1 Month
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                Follow-up Date
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                Follow-up Instructions
              </label>
              <input
                type="text"
                value={followUpInstructions}
                onChange={(e) => setFollowUpInstructions(e.target.value)}
                placeholder="e.g. Return earlier if high fever or breathlessness persists"
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
        >
          Cancel & Return
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSaveConsultation("draft")}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => handleSaveConsultation("completed")}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-2xs transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Finalize & Prescribe</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
