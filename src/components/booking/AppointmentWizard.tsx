"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Calendar,
  Clock,
  User,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Activity,
  Stethoscope,
  Building,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  Check,
  Building2,
  FileText,
  BadgeCheck,
  Lock,
  RefreshCw,
  QrCode,
  Printer,
  ChevronRight,
} from "lucide-react";
import {
  DOCTORS,
  DEPARTMENTS,
  HEALTH_PACKAGES,
  Doctor,
  Department,
  HealthPackage,
} from "@/data/hospitalData";
import { HospitalStore, StoredAppointment, UserSession } from "@/lib/store";
import { DigitalPass } from "./DigitalPass";
import { DoctorAvatar } from "@/components/ui/DoctorAvatar";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export interface AppointmentWizardProps {
  initialDoctorId?: string;
  initialPackageId?: string;
  initialDepartmentId?: string;
}

export const AppointmentWizard: React.FC<AppointmentWizardProps> = ({
  initialDoctorId,
  initialPackageId,
  initialDepartmentId,
}) => {
  const router = useRouter();

  // 6-Step Master Flow:
  // 1: Patient (New / Existing + Inline OTP verification)
  // 2: Department
  // 3: Doctor (Official specialists)
  // 4: Date & Time (LIVE slots from backend)
  // 5: Review
  // 6: Confirmation (Completed Digital Pass)
  const [step, setStep] = useState(1);
  const [session, setSession] = useState<UserSession | null>(null);

  // Patient Identity Sub-flow in Step 1
  const [patientMode, setPatientMode] = useState<"new" | "existing">("new");
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("Male");
  const [patientNotes, setPatientNotes] = useState("");

  // OTP Verification State
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpFeedback, setOtpFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [isPatientVerified, setIsPatientVerified] = useState(false);
  const [verifiedUhid, setVerifiedUhid] = useState<string>("");

  // Service & Department Selection
  const [serviceCategory, setServiceCategory] = useState<"doctor" | "package" | "department">(
    initialDoctorId ? "doctor" : initialPackageId ? "package" : "doctor"
  );
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(
    initialDepartmentId || "neuro-stroke"
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    initialDoctorId || "dr-rajesh-rangaswamy"
  );
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    initialPackageId || "master-health-checkup"
  );

  // Scheduling & Live Slots
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("10:00 AM");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isDoctorAvailableOnDay, setIsDoctorAvailableOnDay] = useState(true);

  // Review & Confirmation State
  const [paymentOption, setPaymentOption] = useState<"pay_on_arrival" | "paid_online">("pay_on_arrival");
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<StoredAppointment | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 1. Check existing session on mount
  useEffect(() => {
    const s = HospitalStore.getSession();
    setSession(s);
    if (s) {
      if (s.name) setFullName(s.name);
      if (s.phone) setMobileNumber(s.phone);
      if (s.email) setEmail(s.email);
      if (s.uhid) setVerifiedUhid(s.uhid);
      setIsPatientVerified(true);
    }
  }, []);

  // 2. Query Live Slots from Backend whenever Doctor or Date changes
  useEffect(() => {
    let isCancelled = false;

    async function fetchLiveSlots() {
      setIsLoadingSlots(true);
      try {
        const queryDoctorId = selectedDoctorId || "dr-rajesh-rangaswamy";
        const res = await fetch(`/api/appointments/slots?doctorId=${encodeURIComponent(queryDoctorId)}&date=${encodeURIComponent(selectedDate)}`);
        const data = await res.json();

        if (!isCancelled && data.success) {
          setAvailableSlots(data.availableSlots || []);
          setBookedSlots(data.bookedSlots || []);
          setIsDoctorAvailableOnDay(data.isDoctorAvailableOnDay !== false);

          // If current selected time slot is booked, default to first available
          if (data.availableSlots && data.availableSlots.length > 0) {
            if (!data.availableSlots.includes(selectedTimeSlot)) {
              setSelectedTimeSlot(data.availableSlots[0]);
            }
          }
        }
      } catch (err) {
        console.warn("Notice fetching live slots:", err);
      } finally {
        if (!isCancelled) setIsLoadingSlots(false);
      }
    }

    if (selectedDate && (step === 4 || step === 5)) {
      fetchLiveSlots();
    }

    return () => {
      isCancelled = true;
    };
  }, [selectedDoctorId, selectedDate, step]);

  // Selected Entities
  const selectedDoctor = DOCTORS.find((d) => d.id === selectedDoctorId) || DOCTORS[0];
  const selectedDepartment =
    DEPARTMENTS.find((dept) => dept.id === selectedDepartmentId) || DEPARTMENTS[0];
  const selectedPackage =
    HEALTH_PACKAGES.find((pkg) => pkg.id === selectedPackageId) || HEALTH_PACKAGES[0];

  const getTargetTitle = () => {
    if (serviceCategory === "doctor") return `${selectedDoctor.name} (${selectedDoctor.role})`;
    if (serviceCategory === "package") return `${selectedPackage.name} (₹${selectedPackage.price.toLocaleString("en-IN")})`;
    return selectedDepartment.name;
  };

  // OTP Handlers
  const handleSendOtp = async () => {
    setOtpFeedback(null);
    setErrors({});

    const cleanPhone = mobileNumber.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrors({ phone: "Valid 10-digit mobile number is required." });
      return;
    }

    if (patientMode === "new") {
      if (!fullName.trim()) {
        setErrors({ name: "Full legal name is required." });
        return;
      }
      if (!age || Number(age) <= 0 || Number(age) > 120) {
        setErrors({ age: "Please enter a valid age between 1 and 120." });
        return;
      }
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: mobileNumber.trim(),
          email: email.trim() || undefined,
          purpose: "patient_booking_identity",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setOtpFeedback({ type: "error", message: data.error || "Failed to send OTP code." });
      } else {
        setOtpSent(true);
        const demoNote = data.otpCode ? ` (Verification code: ${data.otpCode})` : "";
        setOtpFeedback({
          type: "success",
          message: `Verification code sent to +91 ${cleanPhone.slice(-10)}.${demoNote}`,
        });
      }
    } catch {
      setOtpFeedback({ type: "error", message: "Network error sending OTP. Please retry." });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpFeedback(null);
    if (!otpCode || otpCode.trim().length < 4) {
      setOtpFeedback({ type: "error", message: "Please enter the verification code sent to your phone." });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: mobileNumber.trim(),
          code: otpCode.trim(),
          fullName: fullName.trim(),
          age: Number(age) || undefined,
          gender: gender,
          email: email.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setOtpFeedback({ type: "error", message: data.error || "Invalid or expired verification code." });
      } else {
        const uhid = data.patient?.uhid || data.session?.uhid || "IND-UHID-NEW";
        setVerifiedUhid(uhid);
        setIsPatientVerified(true);
        if (data.patient?.fullName) setFullName(data.patient.fullName);

        const newSession: UserSession = data.session || {
          id: data.patient?.id || `usr-${Date.now()}`,
          uhid: uhid,
          name: data.patient?.fullName || fullName,
          email: data.patient?.email || email || "patient@indostates.hospital",
          phone: data.patient?.phone || mobileNumber,
          role: "PATIENT",
        };
        HospitalStore.setSession(newSession);
        setSession(newSession);

        setOtpFeedback({
          type: "success",
          message: `Identity verified! Permanent UHID: ${uhid}. Moving to department selection...`,
        });

        // Automatically advance to Step 2
        setTimeout(() => {
          setStep(2);
          window.scrollTo({ top: 250, behavior: "smooth" });
        }, 800);
      }
    } catch {
      setOtpFeedback({ type: "error", message: "Network error verifying OTP." });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Step Validation
  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!isPatientVerified) {
        errs.auth = "Please verify your mobile number with OTP to continue your booking.";
      }
    }

    if (currentStep === 4) {
      if (!selectedDate) errs.date = "Please select an appointment date.";
      if (!selectedTimeSlot) errs.slot = "Please select an available consultation slot.";
      if (bookedSlots.includes(selectedTimeSlot)) {
        errs.slot = "Sorry, this slot is already booked. Please select another time.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 6));
      window.scrollTo({ top: 250, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 250, behavior: "smooth" });
  };

  // Step 5: Final Submission (Atomic booking & Duplicate Prevention)
  const handleConfirmBooking = async () => {
    if (!validateStep(4)) {
      setStep(4);
      return;
    }

    setIsSubmittingBooking(true);
    setErrors({});

    try {
      const payload = {
        patientName: fullName.trim() || session?.name || "Patient",
        patientPhone: mobileNumber.trim() || session?.phone || "",
        patientEmail: email.trim() || session?.email || "",
        patientAge: Number(age) || 35,
        patientGender: gender,
        serviceType: serviceCategory,
        targetId:
          serviceCategory === "doctor"
            ? selectedDoctor.id
            : serviceCategory === "package"
            ? selectedPackage.id
            : selectedDepartment.id,
        targetName: getTargetTitle(),
        doctorId: serviceCategory === "doctor" ? selectedDoctor.id : undefined,
        doctorName: serviceCategory === "doctor" ? selectedDoctor.name : undefined,
        departmentId:
          serviceCategory === "doctor"
            ? selectedDoctor.departmentId
            : selectedDepartment.id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        notes: patientNotes.trim(),
        paymentStatus: paymentOption,
        userId: session?.id,
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-patient-uhid": verifiedUhid || session?.uhid || "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Displays exact message if slot already taken
        setErrors({
          submit: data.error || "Sorry, this slot is no longer available. Please select another time.",
        });
        setIsSubmittingBooking(false);
        return;
      }

      const confirmedAppt: StoredAppointment = {
        id: data.appointment.id,
        referenceCode: data.appointment.referenceCode,
        verificationToken: data.appointment.verificationToken,
        patientId: data.appointment.patientId,
        patientName: data.appointment.patientName,
        patientPhone: data.appointment.patientPhone,
        patientEmail: data.appointment.patientEmail,
        patientAge: data.appointment.patientAge,
        patientGender: data.appointment.patientGender,
        serviceType: data.appointment.serviceType,
        targetId: data.appointment.targetId,
        targetName: data.appointment.targetName,
        doctorName: data.appointment.doctorName,
        date: data.appointment.date,
        timeSlot: data.appointment.timeSlot,
        notes: data.appointment.notes,
        status: data.appointment.status || "CONFIRMED",
        createdAt: data.appointment.createdAt,
        paymentStatus: data.appointment.paymentStatus,
      };

      // Save to local hospital store
      HospitalStore.saveAppointment(confirmedAppt);
      setConfirmedAppointment(confirmedAppt);
      setStep(6); // Step 6: Confirmation Screen

      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch {}
    } catch (err: any) {
      console.error("Booking submission error:", err);
      setErrors({ submit: "Communication error with booking server. Please retry." });
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Step Indicator labels
  const stepsList = [
    { num: 1, label: "Patient" },
    { num: 2, label: "Department" },
    { num: 3, label: "Doctor" },
    { num: 4, label: "Date & Time" },
    { num: 5, label: "Review" },
    { num: 6, label: "Confirmation" },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl max-w-4xl mx-auto">
      {/* 6-Step Visual Indicator */}
      <div className="mb-8">
        <div className="grid grid-cols-6 gap-1.5 sm:gap-3 items-center">
          {stepsList.map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="text-center">
                <div
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? "bg-emerald-600"
                      : isCurrent
                      ? "bg-hospital-700 ring-2 ring-hospital-400/30"
                      : "bg-slate-100"
                  }`}
                />
                <span
                  className={`hidden sm:block text-[11px] font-bold mt-1.5 truncate ${
                    isCurrent
                      ? "text-hospital-800"
                      : isCompleted
                      ? "text-emerald-700"
                      : "text-slate-400"
                  }`}
                >
                  {s.num}. {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span className="text-hospital-700 font-bold uppercase tracking-wider">
            Step {step} of 6: {stepsList[step - 1].label}
          </span>
          <span>{Math.round((step / 6) * 100)}% Complete</span>
        </div>
      </div>

      {/* Global Error Banner */}
      {errors.submit && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span className="font-semibold">{errors.submit}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 1: PATIENT IDENTITY (NEW / EXISTING GUEST OTP)      */}
      {/* ======================================================== */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Patient Identification &amp; Mobile Verification
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              No account creation required beforehand. New patients are automatically issued a permanent hospital UHID after quick mobile OTP verification.
            </p>
          </div>

          {isPatientVerified && (session || verifiedUhid) ? (
            /* Verified Patient Identity Card */
            <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-300 text-emerald-950 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{fullName || session?.name}</h3>
                    <p className="text-xs text-slate-600 flex items-center gap-2 mt-0.5">
                      <span>Phone: <strong>{mobileNumber || session?.phone}</strong></span>
                      {email && <span>• Email: {email}</span>}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                    Permanent Hospital UHID
                  </span>
                  <span className="font-mono font-black text-sm text-emerald-900 bg-white px-3 py-1 rounded-xl border border-emerald-300 shadow-xs inline-block">
                    {verifiedUhid || session?.uhid}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-200/70 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-emerald-800 flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Patient identity successfully linked. Ready to select medical department.
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setIsPatientVerified(false);
                    setOtpSent(false);
                    setOtpFeedback(null);
                  }}
                  className="text-slate-500 hover:text-slate-800 underline text-[11px]"
                >
                  Change Mobile / Patient
                </button>
              </div>
            </div>
          ) : (
            /* Patient Identification Form with Inline OTP */
            <div className="space-y-6">
              {/* Toggle: New Patient vs Existing Patient */}
              <div className="flex p-1 bg-slate-100 rounded-2xl max-w-md">
                <button
                  type="button"
                  onClick={() => {
                    setPatientMode("new");
                    setOtpFeedback(null);
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
                    patientMode === "new"
                      ? "bg-white text-hospital-800 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  New Patient (First Visit)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPatientMode("existing");
                    setOtpFeedback(null);
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
                    patientMode === "existing"
                      ? "bg-white text-hospital-800 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Existing Patient
                </button>
              </div>

              {otpFeedback && (
                <div
                  className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 ${
                    otpFeedback.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : otpFeedback.type === "error"
                      ? "bg-rose-50 text-rose-800 border border-rose-200"
                      : "bg-cyan-50 text-cyan-800 border border-cyan-200"
                  }`}
                >
                  {otpFeedback.type === "success" ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{otpFeedback.message}</span>
                </div>
              )}

              {/* Patient Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {patientMode === "new" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Legal Patient Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Murugan Selvam"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                    />
                    {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number * {patientMode === "existing" && "(or registered phone)"}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 94432 11223"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                  />
                  {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
                </div>

                {patientMode === "new" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Age (Years) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        required
                        placeholder="e.g. 45"
                        value={age}
                        onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                      />
                      {errors.age && <p className="text-xs text-rose-600 mt-1">{errors.age}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Gender *
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address <span className="text-slate-400 font-normal">(Optional — for digital pass &amp; reports)</span>
                      </label>
                      <input
                        type="email"
                        placeholder="patient@example.com (optional)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* OTP Action Area */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Hospital Phone Verification</h4>
                    <p className="text-[11px] text-slate-500">
                      We will verify your mobile number with a one-time passcode to protect your medical records.
                    </p>
                  </div>

                  {!otpSent ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      isLoading={isSendingOtp}
                      onClick={handleSendOtp}
                    >
                      Send Verification Code
                    </Button>
                  ) : (
                    <button
                      type="button"
                      disabled={isSendingOtp}
                      onClick={handleSendOtp}
                      className="text-xs text-hospital-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? "animate-spin" : ""}`} />
                      <span>Resend Code</span>
                    </button>
                  )}
                </div>

                {otpSent && (
                  <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-48 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono tracking-widest text-center focus:ring-2 focus:ring-hospital-500 focus:outline-none bg-white font-bold"
                    />

                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      isLoading={isVerifyingOtp}
                      onClick={handleVerifyOtp}
                    >
                      Verify &amp; Continue
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {errors.auth && <p className="text-xs text-rose-600 mt-2 font-semibold">{errors.auth}</p>}
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 2: DEPARTMENT SELECTION                             */}
      {/* ======================================================== */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Select Clinical Department
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Choose the clinical specialty corresponding to your symptoms or required consultation.
            </p>
          </div>

          {/* Department Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {DEPARTMENTS.map((dept) => {
              const isSelected = selectedDepartmentId === dept.id && serviceCategory === "doctor";
              return (
                <div
                  key={dept.id}
                  onClick={() => {
                    setServiceCategory("doctor");
                    setSelectedDepartmentId(dept.id);
                    const doc = DOCTORS.find((d) => d.departmentId === dept.id);
                    if (doc) setSelectedDoctorId(doc.id);
                  }}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-hospital-700 bg-hospital-50/60 shadow-md ring-2 ring-hospital-400/20"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2 font-bold text-slate-900 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-hospital-100 text-hospital-700 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="line-clamp-1">{dept.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{dept.tagline}</p>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-hospital-700">{dept.headDoctor}</span>
                    {isSelected && <Check className="w-4 h-4 text-hospital-700" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Also allow health checkup packages or imaging */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-600">
              Need a full body preventive health checkup or specialized MRI/CT scan instead?
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setServiceCategory("package");
                  setStep(3);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100"
              >
                Health Packages &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 3: DOCTOR SELECTION                                 */}
      {/* ======================================================== */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Choose Specialist Physician
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              IndoStates Hospital official medical faculty. Board-certified consultants and surgeons.
            </p>
          </div>

          {serviceCategory === "doctor" ? (
            <div className="space-y-3.5">
              {DOCTORS.map((doctor) => {
                const isSelected = selectedDoctorId === doctor.id;
                const isMatchingDept = doctor.departmentId === selectedDepartmentId;

                return (
                  <div
                    key={doctor.id}
                    onClick={() => {
                      setSelectedDoctorId(doctor.id);
                      setSelectedDepartmentId(doctor.departmentId);
                    }}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 ${
                      isSelected
                        ? "border-hospital-700 bg-hospital-50/70 shadow-md ring-2 ring-hospital-400/20"
                        : isMatchingDept
                        ? "border-hospital-200 bg-white hover:border-hospital-300"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <DoctorAvatar name={doctor.name} size="md" />

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{doctor.name}</h3>
                        <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-semibold">
                          {doctor.qualifications}
                        </span>
                        {isMatchingDept && (
                          <span className="text-[10px] bg-hospital-100 text-hospital-800 px-2 py-0.5 rounded-full font-bold">
                            Department Specialist
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-hospital-800 mt-0.5">{doctor.role}</p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{doctor.specialization}</p>

                      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600">
                        <span>Clinic Hours: <strong>{doctor.timing}</strong></span>
                        <span>Days: <strong>{doctor.availableDays.join(", ")}</strong></span>
                        <span>Experience: <strong>{doctor.experienceYears}+ Years</strong></span>
                        <span>Languages: {doctor.languages.join(", ")}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      {isSelected ? (
                        <div className="w-8 h-8 rounded-full bg-hospital-700 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 hover:text-hospital-700">
                          Select
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Health Package View */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {HEALTH_PACKAGES.map((pkg) => {
                const isSelected = selectedPackageId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition ${
                      isSelected
                        ? "border-hospital-700 bg-hospital-50 shadow-md ring-2 ring-hospital-400/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900 text-sm">{pkg.name}</h4>
                      <span className="text-xs font-black text-hospital-800 bg-hospital-100 px-2.5 py-1 rounded-full">
                        ₹{pkg.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">{pkg.description}</p>
                    <span className="text-[11px] text-slate-500">
                      Turnaround: {pkg.turnaroundTime} • {pkg.testsIncluded.length} diagnostic panels
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 4: DATE & LIVE TIME SLOTS                           */}
      {/* ======================================================== */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Select Consultation Date &amp; Live Time Slot
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Slots are verified live against our hospital appointment registry to prevent double booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Doctor Card & Date Selector */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Physician
                </span>
                <div className="font-bold text-slate-900 text-sm">{selectedDoctor.name}</div>
                <div className="text-hospital-700 font-semibold">{selectedDoctor.role}</div>
                <div className="text-slate-500">OPD Consultation Room 102</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Appointment Date *
                </label>
                <input
                  type="date"
                  min={defaultDateStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-hospital-500 focus:outline-none bg-white"
                />
                {errors.date && <p className="text-xs text-rose-600 mt-1">{errors.date}</p>}
              </div>

              {!isDoctorAvailableOnDay && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Doctor Not Available On This Day</span>
                  </div>
                  <p className="text-[11px]">
                    Consultation days for {selectedDoctor.name}: <strong>{selectedDoctor.availableDays.join(", ")}</strong>.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Live Available Slots */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Live Available Slots ({formatDate(selectedDate)})
                </label>
                {isLoadingSlots && (
                  <span className="text-[11px] text-hospital-700 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Checking live availability...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  "09:00 AM",
                  "09:30 AM",
                  "10:00 AM",
                  "10:30 AM",
                  "11:00 AM",
                  "11:30 AM",
                  "02:00 PM",
                  "02:30 PM",
                  "03:00 PM",
                  "03:30 PM",
                  "04:00 PM",
                  "04:30 PM",
                ].map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = selectedTimeSlot === slot && !isBooked;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked || !isDoctorAvailableOnDay}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                        isBooked
                          ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through"
                          : isSelected
                          ? "bg-hospital-700 border-hospital-700 text-white shadow-md ring-2 ring-hospital-400/20"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{slot}</span>
                      </div>
                      {isBooked ? (
                        <span className="text-[9px] font-mono uppercase bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                          Booked
                        </span>
                      ) : isSelected ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {errors.slot && <p className="text-xs text-rose-600 mt-2 font-semibold">{errors.slot}</p>}

              <p className="text-[11px] text-slate-400 mt-3">
                • Confirmed slots are held atomically. If another patient completes booking simultaneously, you will be prompted to select another slot.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 5: REVIEW APPOINTMENT & INSTRUCTIONS                 */}
      {/* ======================================================== */}
      {step === 5 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Review Appointment Details
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Please inspect all details before final confirmation and digital pass generation.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
            {/* Primary Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Patient Name
                </span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                  {fullName} ({gender}, {age} yrs)
                </span>
                <span className="text-slate-500">
                  UHID: <strong className="font-mono text-hospital-800">{verifiedUhid || session?.uhid || "Auto-Provisioned"}</strong>
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Contact Mobile
                </span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                  {mobileNumber}
                </span>
                <span className="text-slate-500">{email || "No email specified"}</span>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Specialist &amp; Department
                </span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                  {selectedDoctor.name}
                </span>
                <span className="text-slate-500">{selectedDepartment.name} • {selectedDoctor.role}</span>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Scheduled Consultation
                </span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                  {formatDate(selectedDate)}
                </span>
                <span className="font-bold text-hospital-800">{selectedTimeSlot} (Confirmed Slot)</span>
              </div>
            </div>

            {/* Hospital Location */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-hospital-700 tracking-wider block">
                Hospital Location &amp; Room
              </span>
              <p className="font-bold text-slate-900">
                IndoStates Hospital Main Campus, 45 Gandhi Road, Coimbatore, Tamil Nadu 641001
              </p>
              <p className="text-slate-500">
                OPD Clinical Suite 102, Wing B, First Floor
              </p>
            </div>

            {/* Important Instructions */}
            <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-cyan-950 text-xs space-y-1.5">
              <span className="font-bold text-cyan-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-700" /> Important Instructions for Consultation
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px] leading-relaxed">
                <li>Please arrive 15 minutes prior to your time slot for biometric QR check-in at Reception Desk A.</li>
                <li>Bring a valid government-issued photo ID (Aadhaar / Voter ID / Passport) and previous medical records.</li>
                <li>Your digital QR pass will be displayed immediately upon confirmation and will be saved in your patient dashboard.</li>
              </ul>
            </div>

            {/* Chief Concern */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Visit / Chief Complaint (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Follow-up consultation, periodic migraine evaluation, routine check"
                value={patientNotes}
                onChange={(e) => setPatientNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none bg-white"
              />
            </div>

            {/* Payment Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setPaymentOption("pay_on_arrival")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                    paymentOption === "pay_on_arrival"
                      ? "border-hospital-700 bg-hospital-50 font-bold"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span>Pay at Hospital Reception Desk</span>
                    {paymentOption === "pay_on_arrival" && <Check className="w-4 h-4 text-hospital-700" />}
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal mt-1">
                    Cash, UPI, Credit/Debit cards accepted at reception billing counter.
                  </p>
                </div>

                <div
                  onClick={() => setPaymentOption("paid_online")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                    paymentOption === "paid_online"
                      ? "border-hospital-700 bg-hospital-50 font-bold"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span>Fast-Track Online Payment</span>
                    {paymentOption === "paid_online" && <Check className="w-4 h-4 text-hospital-700" />}
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal mt-1">
                    Direct entry to consultation room upon arrival with zero registration counter wait.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 6: BOOKING CONFIRMATION & DIGITAL PASS              */}
      {/* ======================================================== */}
      {step === 6 && confirmedAppointment && (
        <div className="space-y-8">
          <DigitalPass appointment={confirmedAppointment} />

          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Next Steps: Connected Patient Journey</h4>
              <p className="text-xs text-slate-500">
                Your permanent medical record is linked. Access lab reports, prescriptions, and follow-ups in your portal.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/patient/dashboard"
                className="px-5 py-2.5 rounded-xl bg-hospital-700 text-white font-bold text-xs hover:bg-hospital-800 transition flex items-center gap-2 shadow-sm"
              >
                <span>Open Patient Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setConfirmedAppointment(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wizard Bottom Navigation (Steps 1 to 5) */}
      {step < 6 && (
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-hospital-700 text-white text-xs font-bold hover:bg-hospital-800 transition shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="lg"
              isLoading={isSubmittingBooking}
              onClick={handleConfirmBooking}
              className="px-8 shadow-md"
            >
              Confirm Appointment &amp; Issue Digital Pass
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
