"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  Lock,
  LogIn,
} from "lucide-react";
import { DOCTORS, DEPARTMENTS, HEALTH_PACKAGES, Doctor, Department, HealthPackage } from "@/data/hospitalData";
import { HospitalStore, StoredAppointment, UserSession } from "@/lib/store";
import { DigitalPass } from "./DigitalPass";
import { generateAppointmentRef } from "@/lib/utils";
import { DoctorAvatar } from "@/components/ui/DoctorAvatar";

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
  // Step tracker: 1 to 8 (8 is completed state)
  const [step, setStep] = useState(1);
  const [session, setSession] = useState<UserSession | null>(null);

  // Form State
  const [bookingType, setBookingType] = useState<"package" | "department" | "doctor">(
    initialPackageId ? "package" : initialDoctorId ? "doctor" : "package"
  );
  const [selectedPackage, setSelectedPackage] = useState<string>(initialPackageId || "master-health-checkup");
  const [selectedDepartment, setSelectedDepartment] = useState<string>(initialDepartmentId || "diagnostic-imaging");
  const [selectedDoctor, setSelectedDoctor] = useState<string>(initialDoctorId || "dr-rajesh-rangaswamy");

  // Date and Time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("10:00 AM");

  // Patient Info
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientAge, setPatientAge] = useState<number | "">("");
  const [patientGender, setPatientGender] = useState("Male");
  const [patientNotes, setPatientNotes] = useState("");
  const [paymentOption, setPaymentOption] = useState<"pay_on_arrival" | "paid_online">("pay_on_arrival");

  // Validation & Error State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<StoredAppointment | null>(null);

  // Check authentication session and restore draft if returning from login
  useEffect(() => {
    const currentSession = HospitalStore.getSession();
    setSession(currentSession);
    if (currentSession) {
      if (currentSession.name) setPatientName(currentSession.name);
      if (currentSession.email) setPatientEmail(currentSession.email);
    }

    try {
      const draft = sessionStorage.getItem("ish_booking_draft");
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.bookingType) setBookingType(parsed.bookingType);
        if (parsed.selectedPackage) setSelectedPackage(parsed.selectedPackage);
        if (parsed.selectedDepartment) setSelectedDepartment(parsed.selectedDepartment);
        if (parsed.selectedDoctor) setSelectedDoctor(parsed.selectedDoctor);
        if (parsed.selectedDate) setSelectedDate(parsed.selectedDate);
        if (parsed.selectedTimeSlot) setSelectedTimeSlot(parsed.selectedTimeSlot);
        if (parsed.patientAge) setPatientAge(parsed.patientAge);
        if (parsed.patientGender) setPatientGender(parsed.patientGender);
        if (parsed.patientPhone) setPatientPhone(parsed.patientPhone);
        if (parsed.patientNotes) setPatientNotes(parsed.patientNotes);
        if (parsed.step) setStep(parsed.step);
        sessionStorage.removeItem("ish_booking_draft");
      }
    } catch {
      // Storage fallback
    }
  }, []);

  // Available Time Slots for Indo States Health
  const timeSlots = [
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
  ];

  // Helper getters
  const currentPackage = HEALTH_PACKAGES.find((p) => p.id === selectedPackage);
  const currentDepartment = DEPARTMENTS.find((d) => d.id === selectedDepartment);
  const currentDoctor = DOCTORS.find((d) => d.id === selectedDoctor);

  const getTargetTitle = () => {
    if (bookingType === "package") return currentPackage?.name || "Health Package";
    if (bookingType === "doctor") return `${currentDoctor?.name} (${currentDoctor?.specialization})`;
    return currentDepartment?.name || "Clinical Department";
  };

  // Step Validation
  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 3) {
      if (!selectedDate) errs.date = "Please select an appointment date.";
    }

    if (currentStep === 4) {
      if (!selectedTimeSlot) errs.slot = "Please select a time slot.";
    }

    if (currentStep === 5) {
      if (!patientName.trim()) errs.name = "Full patient name is required.";
      if (!patientPhone.trim() || patientPhone.length < 10)
        errs.phone = "Valid 10-digit mobile number is required.";
      if (!patientEmail.trim() || !patientEmail.includes("@"))
        errs.email = "Valid email address is required.";
      if (!patientAge || Number(patientAge) <= 0)
        errs.age = "Valid age is required.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Final Submission with Server-Side Validation & Persistence
  const handleFinalSubmit = async () => {
    const currentSession = HospitalStore.getSession();
    if (!currentSession) {
      try {
        sessionStorage.setItem(
          "ish_booking_draft",
          JSON.stringify({
            bookingType,
            selectedPackage,
            selectedDepartment,
            selectedDoctor,
            selectedDate,
            selectedTimeSlot,
            patientName,
            patientPhone,
            patientEmail,
            patientAge,
            patientGender,
            patientNotes,
            step: 7,
          })
        );
      } catch {
        // Storage fallback
      }
      router.push("/login?redirect=/book-appointment");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        patientId: currentSession.id,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail.trim(),
        patientAge: Number(patientAge),
        patientGender,
        serviceType: bookingType,
        targetId:
          bookingType === "package"
            ? selectedPackage
            : bookingType === "doctor"
            ? selectedDoctor
            : selectedDepartment,
        targetName: getTargetTitle(),
        doctorId: bookingType === "doctor" ? selectedDoctor : undefined,
        doctorName:
          bookingType === "doctor"
            ? currentDoctor?.name
            : bookingType === "package"
            ? "Specialist Physician Review"
            : currentDepartment?.headDoctor,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        notes: patientNotes.trim(),
        paymentStatus: paymentOption,
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setErrors({
          submit: result.error || "The requested appointment slot could not be confirmed. Please select another slot.",
        });
        setIsSubmitting(false);
        // If conflict on slot, navigate back to slot step
        if (res.status === 409) {
          setStep(4);
        }
        return;
      }

      const confirmedAppt: StoredAppointment = {
        id: result.appointment.id,
        referenceCode: result.appointment.referenceCode,
        patientName: result.appointment.patientName,
        patientPhone: result.appointment.patientPhone,
        patientEmail: result.appointment.patientEmail,
        patientAge: result.appointment.patientAge,
        patientGender: result.appointment.patientGender,
        serviceType: result.appointment.serviceType,
        targetId: result.appointment.targetId,
        targetName: result.appointment.targetName,
        doctorName: result.appointment.doctorName,
        date: result.appointment.date,
        timeSlot: result.appointment.timeSlot,
        notes: result.appointment.notes,
        status: result.appointment.status,
        paymentStatus: result.appointment.paymentStatus,
        createdAt: result.appointment.createdAt,
      };

      // Save into client persistence layer for instant offline pass & dashboard view
      HospitalStore.saveAppointment(confirmedAppt);
      setConfirmedAppointment(confirmedAppt);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Canvas confetti fallback
      }

      setIsSubmitting(false);
      setStep(8);
    } catch (err: any) {
      console.warn("Network error during appointment creation, falling back to offline pass:", err);
      // Safe offline fallback: never lose patient booking
      const ref = generateAppointmentRef();
      const offlineAppt: StoredAppointment = {
        id: `apt-offline-${Date.now()}`,
        referenceCode: ref,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail.trim(),
        patientAge: Number(patientAge),
        patientGender,
        serviceType: bookingType,
        targetId:
          bookingType === "package"
            ? selectedPackage
            : bookingType === "doctor"
            ? selectedDoctor
            : selectedDepartment,
        targetName: getTargetTitle(),
        doctorName:
          bookingType === "doctor"
            ? currentDoctor?.name
            : bookingType === "package"
            ? "Specialist Physician Review"
            : currentDepartment?.headDoctor,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        notes: patientNotes.trim(),
        status: "confirmed",
        paymentStatus: paymentOption,
        createdAt: new Date().toISOString(),
      };

      HospitalStore.saveAppointment(offlineAppt);
      setConfirmedAppointment(offlineAppt);
      setIsSubmitting(false);
      setStep(8);
    }
  };

  if (step === 8 && confirmedAppointment) {
    return (
      <DigitalPass
        appointment={confirmedAppointment}
        onBookAnother={() => {
          setConfirmedAppointment(null);
          setStep(1);
        }}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
      {/* Step Progress Bar */}
      <div className="bg-slate-50 p-4 border-b border-slate-200">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span>Step {step} of 7: {getStepName(step)}</span>
          <span>{Math.round((step / 7) * 100)}% Completed</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-hospital-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* STEP 1: Select Booking Category */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900">
                What would you like to book today?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Choose between our popular all-in-one health packages, specialty clinical departments, or consulting a specific doctor.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBookingType("package")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  bookingType === "package"
                    ? "border-hospital-600 bg-hospital-50 ring-2 ring-hospital-600/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 font-bold text-xs">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Health Package</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Master Health Checkup (₹3,500), Cardiac & Stroke screening
                </p>
              </button>

              <button
                type="button"
                onClick={() => setBookingType("doctor")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  bookingType === "doctor"
                    ? "border-hospital-600 bg-hospital-50 ring-2 ring-hospital-600/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-hospital-100 text-hospital-700 flex items-center justify-center mb-2 font-bold text-xs">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Doctor Consultation</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Dr. Rajesh Rangaswamy & Senior Specialists
                </p>
              </button>

              <button
                type="button"
                onClick={() => setBookingType("department")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  bookingType === "department"
                    ? "border-hospital-600 bg-hospital-50 ring-2 ring-hospital-600/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2 font-bold text-xs">
                  <Building className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Department / Scan</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  MRI 1.5T, CT 128-Slice, 3D Mammogram, DEXA
                </p>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Specific Item */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900">
                {bookingType === "package"
                  ? "Select a Health Package"
                  : bookingType === "doctor"
                  ? "Select a Specialist Doctor"
                  : "Select a Department or Diagnostic Modality"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Choose the exact service you require from our verified hospital options.
              </p>
            </div>

            {/* Packages list */}
            {bookingType === "package" && (
              <div className="space-y-2.5">
                {HEALTH_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      selectedPackage === pkg.id
                        ? "border-hospital-600 bg-hospital-50 ring-2 ring-hospital-600/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{pkg.name}</span>
                        {pkg.isFeatured && (
                          <span className="text-[10px] bg-hospital-600 text-white font-bold px-2 py-0.5 rounded-full">
                            Most Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{pkg.tagline}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-base text-hospital-800">₹{pkg.price}</span>
                      <span className="block text-[10px] text-slate-400 line-through">₹{pkg.originalPrice}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Doctors list */}
            {bookingType === "doctor" && (
              <div className="space-y-2.5">
                {DOCTORS.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDoctor(doc.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-4 ${
                      selectedDoctor === doc.id
                        ? "border-hospital-600 bg-hospital-50 ring-2 ring-hospital-600/20 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <DoctorAvatar
                      name={doc.name}
                      avatarUrl={doc.avatarUrl}
                      specialization={doc.specialization}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 truncate">{doc.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900 text-[10px] font-semibold shrink-0">
                          Verified Specialist
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{doc.specialization}</p>
                      <span className="text-[11px] text-hospital-700 font-medium block mt-0.5">
                        {doc.timing} • {doc.availableDays.slice(0, 3).join(", ")}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {/* Departments list */}
            {bookingType === "department" && (
              <div className="space-y-2.5">
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => setSelectedDepartment(dept.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      selectedDepartment === dept.id
                        ? "border-hospital-600 bg-hospital-50 ring-2 ring-hospital-600/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-sm text-slate-900">{dept.name}</span>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{dept.tagline}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Select Date */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900">
                Select Your Appointment Date
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Appointments are scheduled starting tomorrow to ensure proper fasting preparation when required.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label htmlFor="appointment-date-input" className="block text-xs font-bold uppercase text-slate-600">
                Pick a Date:
              </label>
              <input
                id="appointment-date-input"
                type="date"
                min={defaultDateStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-hospital-500 focus:outline-none"
              />
              {errors.date && <p className="text-xs text-red-600">{errors.date}</p>}

              <div className="p-3 bg-hospital-50 rounded-xl text-xs text-hospital-800 flex items-start gap-2 border border-hospital-200">
                <Sparkles className="w-4 h-4 text-hospital-600 shrink-0 mt-0.5" />
                <span>
                  Tip: For morning Master Health Checkups, report between 9:00 AM – 10:30 AM after 10-12 hours of overnight fasting.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Select Time Slot */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900">
                Select an Available Time Slot
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                To prevent overcrowding and ensure a calm healing environment, we limit slots per session.
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`py-3 px-2 rounded-xl text-xs font-semibold transition-all border text-center ${
                    selectedTimeSlot === slot
                      ? "bg-hospital-700 text-white border-hospital-700 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-hospital-400"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            {errors.slot && <p className="text-xs text-red-600">{errors.slot}</p>}
          </div>
        )}

        {/* STEP 5: Patient Contact Details */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900">
                Enter Patient Details
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                These details will be printed on your digital appointment pass.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="patient-full-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Full Name *
                </label>
                <input
                  id="patient-full-name"
                  type="text"
                  autoComplete="name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base focus:bg-white focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="patient-phone-number" className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  id="patient-phone-number"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base focus:bg-white focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="patient-email-address" className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="patient-email-address"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base focus:bg-white focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="patient-age-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Age (Years) *
                </label>
                <input
                  id="patient-age-input"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="120"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : "")}
                  placeholder="e.g. 42"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base focus:bg-white focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                />
                {errors.age && <p className="text-xs text-red-600 mt-1">{errors.age}</p>}
              </div>

              <div>
                <label htmlFor="patient-gender-select" className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  id="patient-gender-select"
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="patient-symptoms-notes" className="block text-xs font-semibold text-slate-700 mb-1">
                  Symptoms or Health Notes (Optional)
                </label>
                <textarea
                  id="patient-symptoms-notes"
                  rows={2}
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  placeholder="Mention previous medical conditions, current medications, or specific concerns..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Confirmation & Payment Preference */}
        {step === 6 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900">
                Payment & Billing Preference
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                You can pay when you arrive at the hospital registration counter or opt for digital pre-authorization.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 p-4 rounded-2xl border border-hospital-600 bg-hospital-50/70 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentOption === "pay_on_arrival"}
                  onChange={() => setPaymentOption("pay_on_arrival")}
                  className="w-4 h-4 text-hospital-600"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Pay on Arrival at Hospital Registration Desk (Recommended)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Accepts Cash, UPI (GPay/PhonePe), Credit/Debit Cards, and Insurance claim guidance.
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentOption === "paid_online"}
                  onChange={() => setPaymentOption("paid_online")}
                  className="w-4 h-4 text-hospital-600"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Online Digital Pre-authorization
                  </h4>
                  <p className="text-xs text-slate-500">
                    Instant computerized receipt issued with digital pass.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 7: Review & Confirm */}
        {step === 7 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900">
                Review Your Appointment Summary
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Please double check your booking details before confirming.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-900 text-right">{getTargetTitle()}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Date:</span>
                <span className="font-semibold text-slate-900">{selectedDate}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Time Slot:</span>
                <span className="font-semibold text-slate-900">{selectedTimeSlot}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold text-slate-900">
                  {patientName} ({patientAge} Yrs, {patientGender})
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Contact:</span>
                <span className="font-semibold text-slate-900">{patientPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment:</span>
                <span className="font-bold text-hospital-700 uppercase text-xs">
                  {paymentOption === "pay_on_arrival" ? "Pay at Hospital Counter" : "Pre-authorized"}
                </span>
              </div>
            </div>

            {/* Authentication Required Guard Banner */}
            {!session ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Authentication Required to Confirm Appointment</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  In compliance with hospital patient safety and data privacy protocols, please sign in or create an account to confirm this booking, receive your verified QR pass, and access your appointment in the patient portal.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        sessionStorage.setItem(
                          "ish_booking_draft",
                          JSON.stringify({
                            bookingType,
                            selectedPackage,
                            selectedDepartment,
                            selectedDoctor,
                            selectedDate,
                            selectedTimeSlot,
                            patientName,
                            patientPhone,
                            patientEmail,
                            patientAge,
                            patientGender,
                            patientNotes,
                            step: 7,
                          })
                        );
                      } catch {
                        // Storage fallback
                      }
                      router.push("/login?redirect=/book-appointment");
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In to Confirm Appointment</span>
                  </button>
                  <Link
                    href="/register?redirect=/book-appointment"
                    className="px-4 py-2 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-xs transition-all inline-flex items-center"
                  >
                    <span>Create Patient Account</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="truncate">
                    Authenticated Patient: <strong>{session.name}</strong> ({session.email})
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px] uppercase shrink-0">
                  Verified
                </span>
              </div>
            )}

            {errors.submit && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.submit}</span>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons (Back / Next / Confirm) */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className={`inline-flex items-center gap-2 px-7 py-3 rounded-xl text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 ${
                !session
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isSubmitting ? (
                <span>Confirming Slot...</span>
              ) : !session ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In &amp; Confirm Booking</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm Booking &amp; Get QR Pass</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function getStepName(step: number): string {
  switch (step) {
    case 1:
      return "Service Category";
    case 2:
      return "Select Doctor / Service";
    case 3:
      return "Appointment Date";
    case 4:
      return "Time Slot";
    case 5:
      return "Patient Details";
    case 6:
      return "Payment Mode";
    case 7:
      return "Review & Confirm";
    default:
      return "Booking";
  }
}
