"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ClipboardCheck,
  User,
  HeartPulse,
  AlertTriangle,
  ShieldCheck,
  FileText,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  Calendar,
  Lock,
  Sparkles,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { Button } from "@/components/ui/Button";

function PreCheckInContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  const [session, setSession] = useState<UserSession | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Personal Details
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");

  // Step 2: Medical Symptoms & History
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [symptomDuration, setSymptomDuration] = useState("3_days");
  const [hasFever, setHasFever] = useState(false);
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [hasHypertension, setHasHypertension] = useState(false);
  const [hasHeartCondition, setHasHeartCondition] = useState(false);

  // Step 3: Allergies & Current Medications
  const [allergiesText, setAllergiesText] = useState("None reported");
  const [currentMedsText, setCurrentMedsText] = useState("");

  // Step 4: Insurance & ID
  const [hasInsurance, setHasInsurance] = useState(false);
  const [insuranceProvider, setInsuranceProvider] = useState("Star Health");
  const [policyNumber, setPolicyNumber] = useState("");
  const [uploadedGovtId, setUploadedGovtId] = useState(false);
  const [uploadedInsCard, setUploadedInsCard] = useState(false);

  // Step 5: Medical Consent
  const [agreedGeneralConsent, setAgreedGeneralConsent] = useState(true);
  const [agreedDpdpDataProcessing, setAgreedDpdpDataProcessing] = useState(true);

  // Step 6: Payment
  const [paymentChoice, setPaymentChoice] = useState<"pay_on_arrival" | "prepay_online">("pay_on_arrival");

  useEffect(() => {
    const s = HospitalStore.getSession();
    if (!s) {
      window.location.href = "/login?portal=patient&redirect=/patient/pre-check-in";
      return;
    }
    setSession(s);
    setFullName(s.name || "Murugan Selvam");
    setPhone(s.phone || "+91 94432 11223");
  }, []);

  const stepsList = [
    { num: 1, label: "Personal Details", icon: User },
    { num: 2, label: "Medical Symptoms", icon: HeartPulse },
    { num: 3, label: "Allergies & Meds", icon: AlertTriangle },
    { num: 4, label: "Insurance & ID", icon: ShieldCheck },
    { num: 5, label: "Hospital Consent", icon: FileText },
    { num: 6, label: "Payment Preference", icon: CreditCard },
  ];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmitPreCheckIn();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmitPreCheckIn = async () => {
    setIsSubmitting(true);
    // Simulate pre-check-in submission and verification
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
    }, 1000);
  };

  const progressPercent = Math.round((currentStep / 6) * 100);

  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto py-10 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Express Check-In Cleared
          </span>
          <h2 className="text-2xl font-black text-slate-900 font-display">
            Pre-Check-In Completed Successfully!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Your clinical triage questionnaire, allergy log, and consent records have been sent to the OPD nursing station.
          </p>
        </div>

        {/* Verification Checkpoints Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 text-left text-xs space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Personal Demographics</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">✓ Verified</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Medical Symptoms</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">✓ Logged</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Allergies &amp; Medications</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">✓ Documented</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Hospital Legal Consent</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">✓ Signed</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-600 font-medium">Payment Option</span>
            <span className="text-emerald-700 font-bold capitalize">
              ✓ {paymentChoice.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/patient/qr-pass"
            className="px-5 py-2.5 rounded-xl bg-hospital-700 text-white font-bold text-xs hover:bg-hospital-800 transition shadow-sm"
          >
            View Fast-Track QR Pass &rarr;
          </Link>
          <Link
            href="/patient/visit-tracking"
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
          >
            Track Visit Journey
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-100">
            Express Hospital Arrival
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-2">
            Patient Pre-Check-In
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete your symptoms questionnaire, allergies, insurance documents, and consent from home to bypass the registration desk queue.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>
              Step {currentStep} of 6: {stepsList[currentStep - 1].label}
            </span>
            <span className="text-hospital-700 font-mono">{progressPercent}% Completed</span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-hospital-700 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="hidden sm:grid grid-cols-6 gap-2 pt-1 text-[10px] font-semibold text-slate-400">
            {stepsList.map((s) => (
              <span
                key={s.num}
                className={s.num <= currentStep ? "text-hospital-700 font-bold" : "text-slate-400"}
              >
                {s.num}. {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Step Form Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        {/* STEP 1: Personal Details */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Step 1: Patient Demographics</h3>
              <p className="text-xs text-slate-500">Confirm your personal identification and contact details.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Contact Person</label>
                <input
                  type="text"
                  placeholder="e.g. Spouse / Relative"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Medical Symptoms */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Step 2: Medical Symptoms Questionnaire</h3>
              <p className="text-xs text-slate-500">Share your primary symptoms with the physician prior to entry.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                What is your primary medical concern today? *
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Mild headache, feverish feeling for 2 days, chest discomfort..."
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Pre-existing Medical History:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasDiabetes}
                    onChange={(e) => setHasDiabetes(e.target.checked)}
                    className="rounded text-hospital-700"
                  />
                  <span>Diabetes Mellitus</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasHypertension}
                    onChange={(e) => setHasHypertension(e.target.checked)}
                    className="rounded text-hospital-700"
                  />
                  <span>Hypertension (BP)</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasHeartCondition}
                    onChange={(e) => setHasHeartCondition(e.target.checked)}
                    className="rounded text-hospital-700"
                  />
                  <span>Cardiac / Heart Disease</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasFever}
                    onChange={(e) => setHasFever(e.target.checked)}
                    className="rounded text-hospital-700"
                  />
                  <span>Fever / Chills in last 24h</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Allergies & Medications */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Step 3: Known Allergies &amp; Routine Medicines</h3>
              <p className="text-xs text-slate-500">Crucial for clinical safety before medication orders.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Do you have any drug or food allergies?
              </label>
              <input
                type="text"
                placeholder="e.g. Penicillin, Sulfa drugs, Shellfish, None"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                List any medications currently being taken:
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Metformin 500mg (1-0-1), Telmisartan 40mg (1-0-0)..."
                value={currentMedsText}
                onChange={(e) => setCurrentMedsText(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Insurance & ID */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Step 4: Insurance &amp; Verification Documents</h3>
              <p className="text-xs text-slate-500">Upload your government ID or insurance card for cashless pre-approval.</p>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <input
                type="checkbox"
                id="hasIns"
                checked={hasInsurance}
                onChange={(e) => setHasInsurance(e.target.checked)}
                className="w-4 h-4 rounded text-hospital-700"
              />
              <label htmlFor="hasIns" className="text-xs font-bold text-slate-800 cursor-pointer">
                I am covered under health insurance / corporate TPA cashless policy
              </label>
            </div>

            {hasInsurance && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">TPA / Insurance Company</label>
                  <select
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProvider(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="Star Health">Star Health &amp; Allied Insurance</option>
                    <option value="ICICI Lombard">ICICI Lombard General</option>
                    <option value="HDFC ERGO">HDFC ERGO Health</option>
                    <option value="Max Bupa">Niva Bupa Health</option>
                    <option value="CMCHIS">TN Chief Minister Health Insurance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Policy / Member ID</label>
                  <input
                    type="text"
                    placeholder="e.g. SH-99882211"
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>
            )}

            {/* Document upload triggers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div
                onClick={() => setUploadedGovtId(true)}
                className={`p-4 rounded-2xl border-2 border-dashed cursor-pointer text-center space-y-2 transition ${
                  uploadedGovtId ? "border-emerald-500 bg-emerald-50/50" : "border-slate-300 hover:border-hospital-400"
                }`}
              >
                <Upload className="w-5 h-5 mx-auto text-slate-400" />
                <span className="text-xs font-bold text-slate-800 block">
                  {uploadedGovtId ? "Government ID Attached ✓" : "Upload Aadhaar / Govt ID"}
                </span>
                <span className="text-[10px] text-slate-400">PDF, JPG up to 5MB</span>
              </div>

              <div
                onClick={() => setUploadedInsCard(true)}
                className={`p-4 rounded-2xl border-2 border-dashed cursor-pointer text-center space-y-2 transition ${
                  uploadedInsCard ? "border-emerald-500 bg-emerald-50/50" : "border-slate-300 hover:border-hospital-400"
                }`}
              >
                <Upload className="w-5 h-5 mx-auto text-slate-400" />
                <span className="text-xs font-bold text-slate-800 block">
                  {uploadedInsCard ? "Insurance Card Attached ✓" : "Upload Insurance Card"}
                </span>
                <span className="text-[10px] text-slate-400">PDF, JPG up to 5MB</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Hospital Consent */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Step 5: Hospital Consent &amp; DPDP Notice</h3>
              <p className="text-xs text-slate-500">Legal medical examination acknowledgement.</p>
            </div>

            <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedGeneralConsent}
                  onChange={(e) => setAgreedGeneralConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-hospital-700"
                />
                <span>
                  <strong>General OPD Medical Consent:</strong> I authorize the clinical staff and physicians of IndoStates Health Hospital to perform necessary outpatient examinations, vitals assessment, and diagnostic evaluations.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedDpdpDataProcessing}
                  onChange={(e) => setAgreedDpdpDataProcessing(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-hospital-700"
                />
                <span>
                  <strong>Data Privacy (DPDP Act 2023):</strong> I consent to the secure storage of my health records within the hospital&apos;s encrypted electronic health record system for medical care continuity.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 6: Payment Preference */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Step 6: Payment Preference</h3>
              <p className="text-xs text-slate-500">Select how you wish to settle consultation and diagnostic charges.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setPaymentChoice("pay_on_arrival")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentChoice === "pay_on_arrival"
                    ? "border-hospital-700 bg-hospital-50/70 shadow-xs"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-sm">Pay on Arrival</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Settle at the billing counter via Cash, UPI, Card, or Mediclaim prior to consultation.
                </p>
              </div>

              <div
                onClick={() => setPaymentChoice("prepay_online")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentChoice === "prepay_online"
                    ? "border-hospital-700 bg-hospital-50/70 shadow-xs"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-sm">Prepay Online (Simulated)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                    Instant
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Instant contactless clearance. Invoice receipt auto-generated to your portal.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <Button
            variant="primary"
            size="md"
            type="button"
            isLoading={isSubmitting}
            onClick={handleNext}
          >
            {currentStep === 6 ? "Complete Pre-Check-In" : "Continue to Next Step"}
            {currentStep < 6 && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PatientPreCheckInPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading pre-check-in...</div>}>
      <PreCheckInContent />
    </Suspense>
  );
}
