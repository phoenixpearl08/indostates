"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { HospitalStore, UserSession } from "@/lib/store";
import {
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Stethoscope,
  Building2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  RotateCcw,
  KeyRound,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { getAppBaseUrl } from "@/lib/qrCode";

type TargetPortal = "patient" | "doctor" | "admin";
type AuthMode = "mobile" | "email" | "google" | "uhid";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const portalQuery = (searchParams.get("portal") || "").toLowerCase();
  const redirectParam = searchParams.get("redirect") || "";

  // Dedicated Active Portal: "patient", "doctor", or "admin"
  const [selectedPortal, setSelectedPortal] = useState<TargetPortal>(
    portalQuery === "doctor" ? "doctor" : portalQuery === "admin" ? "admin" : "patient"
  );

  // Active Login Method (Mobile OTP for patients, Email for doctor/admin)
  const [authMode, setAuthMode] = useState<AuthMode>(
    portalQuery === "doctor" || portalQuery === "admin" ? "email" : "mobile"
  );

  // Email State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Mobile OTP State
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState<string | null>(null);

  // Patient UHID / Patient ID State
  const [uhidNumber, setUhidNumber] = useState("");
  const [uhidPassword, setUhidPassword] = useState("");

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [oauthNotice, setOauthNotice] = useState<string | null>(null);

  // Adjust form fields when switching portals
  useEffect(() => {
    if (selectedPortal === "doctor") {
      setAuthMode("email");
      if (!email || email.includes("admin") || email.includes("patient")) {
        setEmail("dr.logesh@indostates.com");
        setPassword("Doctor@123");
      }
    } else if (selectedPortal === "admin") {
      setAuthMode("email");
      if (!email || email.includes("dr.") || email.includes("patient")) {
        setEmail("admin@indostates.com");
        setPassword("Admin@123");
      }
    } else {
      // Patient portal defaults to mobile OTP
      if (!email || email.includes("indostates.com")) {
        setEmail("patient@indostates.com");
        setPassword("Patient@123");
      }
    }
    setErrorMsg(null);
  }, [selectedPortal]);

  // Resend OTP countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => Math.max(prev - 1, 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Helper to compute safe destination according to role
  const resolveTargetDestination = (userRole: string, requestedRedirect?: string | null): string => {
    const role = userRole.toUpperCase();
    const roleMap: Record<string, string> = {
      PATIENT: "/patient/dashboard",
      ATTENDER: "/patient/dashboard",
      ATTENDER_CAREGIVER: "/patient/dashboard",
      DOCTOR: "/doctor/dashboard",
      DEPARTMENT_HEAD: "/doctor/dashboard",
      SUPER_ADMIN: "/admin/dashboard",
      HOSPITAL_ADMIN: "/admin/dashboard",
      MEDICAL_DIRECTOR: "/admin/dashboard",
      OPERATIONS_MANAGER: "/admin/dashboard",
      HR_MANAGER: "/admin/dashboard",
      RECEPTIONIST: "/reception/dashboard",
      NURSE: "/nurse/dashboard",
      LAB_TECHNICIAN: "/lab/dashboard",
      LAB_VERIFIER: "/lab/dashboard",
      IMAGING_STAFF: "/doctor/dashboard",
      PHARMACY_STAFF: "/pharmacy/dashboard",
      PHARMACY_MANAGER: "/pharmacy/dashboard",
      BILLING_STAFF: "/billing/dashboard",
      FINANCE_MANAGER: "/billing/dashboard",
      SECURITY_STAFF: "/security/dashboard",
      AMBULANCE_STAFF: "/emergency/dashboard",
    };

    const defaultTarget = roleMap[role] || "/patient/dashboard";

    if (!requestedRedirect) return defaultTarget;

    // Check if the requested redirect is authorized for this role
    if (requestedRedirect.startsWith("/admin") && !["SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR", "OPERATIONS_MANAGER", "HR_MANAGER"].includes(role)) {
      return defaultTarget;
    }
    if (requestedRedirect.startsWith("/doctor") && !["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR", "SUPER_ADMIN", "HOSPITAL_ADMIN"].includes(role)) {
      return defaultTarget;
    }
    if (requestedRedirect.startsWith("/patient") && !["PATIENT", "ATTENDER", "ATTENDER_CAREGIVER", "SUPER_ADMIN", "HOSPITAL_ADMIN"].includes(role)) {
      return defaultTarget;
    }

    return requestedRedirect;
  };

  // 1. MOBILE OTP DISPATCH (Patient)
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mobileNumber.trim()) {
      setErrorMsg("Please enter your 10-digit mobile number.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setOtpSuccessMsg(null);

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobileNumber.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to dispatch verification code.");
        if (data.cooldownSeconds) setResendCooldown(data.cooldownSeconds);
        setIsLoading(false);
        return;
      }

      setOtpSent(true);
      setResendCooldown(data.cooldownSeconds || 60);
      setOtpSuccessMsg(data.message || "6-digit OTP code dispatched via SMS.");

      if (data.devOtp) {
        setOtpCode(data.devOtp);
      }
    } catch {
      setErrorMsg("Network error communicating with authentication service.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. MOBILE OTP VERIFICATION (Patient)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: mobileNumber.trim(),
          otp: otpCode.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Invalid OTP code. Please check and retry.");
        setIsLoading(false);
        return;
      }

      const verifiedUser = data.user;
      const session: UserSession = {
        id: verifiedUser.id,
        name: verifiedUser.name,
        email: verifiedUser.email,
        phone: verifiedUser.phone,
        role: "PATIENT",
        uhid: verifiedUser.uhid,
        token: verifiedUser.token,
      };

      HospitalStore.setSession(session);

      const targetDestination = resolveTargetDestination("PATIENT", redirectParam);
      window.location.href = targetDestination;
    } catch {
      setErrorMsg("Network error verifying code. Please retry.");
      setIsLoading(false);
    }
  };

  // 3. EMAIL + PASSWORD LOGIN (Patient, Doctor, Admin, Staff)
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email address and password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Authentication failed. Please verify your credentials.");
        setIsLoading(false);
        return;
      }

      const verifiedUser = data.user;
      const session: UserSession = {
        id: verifiedUser.id,
        name: verifiedUser.name,
        email: verifiedUser.email,
        role: verifiedUser.role,
        uhid: verifiedUser.uhid,
        token: verifiedUser.token,
      };

      HospitalStore.setSession(session);

      const targetDestination = resolveTargetDestination(verifiedUser.role, redirectParam);
      window.location.href = targetDestination;
    } catch {
      setErrorMsg("Network communication error. Please ensure server is running.");
      setIsLoading(false);
    }
  };

  // 4. GOOGLE OAUTH (Patient)
  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setOauthNotice(null);

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        try {
          const baseUrl = getAppBaseUrl();
          const targetRedirect = redirectParam
            ? `${baseUrl}${redirectParam}`
            : `${baseUrl}/patient/dashboard`;
          const { error } = await client.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: targetRedirect,
            },
          });
          if (error) {
            setErrorMsg(`Google OAuth error: ${error.message}`);
          }
          return;
        } catch (err: any) {
          console.error("OAuth invocation error:", err);
        }
      }
    }

    setOauthNotice(
      "Google OAuth Provider Notice: Connect your Google Client ID and Secret in Supabase Auth to activate direct Google sign-in. You can sign in immediately using Mobile OTP or email credentials."
    );
  };

  // 5. PATIENT ID / UHID LOGIN
  const handleUhidLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uhidNumber.trim()) {
      setErrorMsg("Please enter your permanent Hospital UHID / Patient ID.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: uhidNumber.trim(),
          password: uhidPassword || "Patient@123",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Could not find a verified patient record matching this UHID.");
        setIsLoading(false);
        return;
      }

      const verifiedUser = data.user;
      const session: UserSession = {
        id: verifiedUser.id,
        name: verifiedUser.name,
        email: verifiedUser.email,
        phone: verifiedUser.phone,
        role: "PATIENT",
        uhid: verifiedUser.uhid,
        token: verifiedUser.token,
      };

      HospitalStore.setSession(session);
      const targetDestination = resolveTargetDestination("PATIENT", redirectParam);
      window.location.href = targetDestination;
    } catch {
      setErrorMsg("Network error connecting to patient verification.");
      setIsLoading(false);
    }
  };

  const setCredential = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setErrorMsg(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-5">
          <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-hospital-700 to-navy-900 flex items-center justify-center text-white shadow-soft">
              <span className="font-heading font-black text-sm text-cyan-300">IS</span>
            </div>
            <span className="font-heading font-black text-base text-navy-950">
              INDO STATES <span className="text-hospital-600">HEALTH</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display">
            {selectedPortal === "doctor"
              ? "Doctor & Clinical OPD Console"
              : selectedPortal === "admin"
              ? "Hospital Administration Center"
              : "Patient Portal Sign In"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {selectedPortal === "doctor"
              ? "Access consultation queues, digital prescriptions, and patient records"
              : selectedPortal === "admin"
              ? "Hospital oversight, user governance, doctor directory, and HMS monitoring"
              : "View your appointments, digital passes, prescriptions, and lab reports"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-5">
          {/* THREE USER ROLE SWITCHER */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-center">
              Select Your Access Role
            </label>
            <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setSelectedPortal("patient");
                  setAuthMode("mobile");
                }}
                className={`py-2 px-1 rounded-xl transition flex flex-col items-center gap-1 ${
                  selectedPortal === "patient"
                    ? "bg-white text-hospital-700 shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-[11px]">Patient</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPortal("doctor");
                  setAuthMode("email");
                }}
                className={`py-2 px-1 rounded-xl transition flex flex-col items-center gap-1 ${
                  selectedPortal === "doctor"
                    ? "bg-white text-hospital-700 shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span className="text-[11px]">Doctor</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPortal("admin");
                  setAuthMode("email");
                }}
                className={`py-2 px-1 rounded-xl transition flex flex-col items-center gap-1 ${
                  selectedPortal === "admin"
                    ? "bg-white text-hospital-700 shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-[11px]">Admin / Staff</span>
              </button>
            </div>
          </div>

          {/* Sub-modes for Patient */}
          {selectedPortal === "patient" && (
            <div className="flex border-b border-slate-100 pb-2 gap-4 text-xs font-medium justify-center">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("mobile");
                  setErrorMsg(null);
                }}
                className={`pb-1 border-b-2 transition ${
                  authMode === "mobile"
                    ? "border-hospital-600 text-hospital-700 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Mobile OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("email");
                  setErrorMsg(null);
                }}
                className={`pb-1 border-b-2 transition ${
                  authMode === "email"
                    ? "border-hospital-600 text-hospital-700 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Email Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("uhid");
                  setErrorMsg(null);
                }}
                className={`pb-1 border-b-2 transition ${
                  authMode === "uhid"
                    ? "border-hospital-600 text-hospital-700 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Patient ID / UHID
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("google");
                  setErrorMsg(null);
                }}
                className={`pb-1 border-b-2 transition ${
                  authMode === "google"
                    ? "border-hospital-600 text-hospital-700 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Google
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {otpSuccessMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{otpSuccessMsg}</span>
            </div>
          )}

          {oauthNotice && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>External Provider Configuration</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">{oauthNotice}</p>
            </div>
          )}

          {/* 1. MOBILE NUMBER + OTP (Patients) */}
          {selectedPortal === "patient" && authMode === "mobile" && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Registered Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="98765 43210"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full pl-16 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-hospital-500 bg-slate-50/50 font-medium"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      A 6-digit one-time passcode will be sent via SMS for instant verification.
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2"
                  >
                    {isLoading ? (
                      <span>Sending OTP...</span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span>Send Verification OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span>
                      Code sent to: <strong className="text-slate-900">+91 {mobileNumber}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode("");
                        setErrorMsg(null);
                      }}
                      className="text-hospital-600 font-bold hover:underline text-[11px]"
                    >
                      Change Number
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Enter 6-Digit OTP Code
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        autoFocus
                        placeholder="123456"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-base font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-hospital-500 bg-slate-50/50 text-center font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    {resendCooldown > 0 ? (
                      <span className="text-slate-500 text-[11px]">
                        Resend code in <strong>{resendCooldown}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        className="text-hospital-700 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Resend OTP Code</span>
                      </button>
                    )}
                    <span className="text-[11px] text-slate-400">Valid for 5 mins</span>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2"
                  >
                    {isLoading ? (
                      <span>Verifying Code...</span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span>Verify &amp; Open Patient Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          )}

          {/* UHID / PATIENT ID LOGIN FORM */}
          {selectedPortal === "patient" && authMode === "uhid" && (
            <form onSubmit={handleUhidLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Permanent Patient UHID / Hospital ID
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. IND-UHID-000101"
                    value={uhidNumber}
                    onChange={(e) => setUhidNumber(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-hospital-500 bg-slate-50/50"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Issued on your appointment pass, bill receipt, or discharge summary.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Account Password / PIN (Optional for verified UHID)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="•••••••• (Default: Patient@123)"
                    value={uhidPassword}
                    onChange={(e) => setUhidPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-hospital-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={isLoading}
                className="w-full mt-2"
              >
                {isLoading ? (
                  <span>Authenticating UHID...</span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Access Patient Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          )}

          {/* 2. EMAIL + PASSWORD (All Roles) */}
          {authMode === "email" && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {selectedPortal === "doctor"
                    ? "Doctor Work Email"
                    : selectedPortal === "admin"
                    ? "Administrative Staff Email"
                    : "Patient Registered Email"}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder={
                      selectedPortal === "doctor"
                        ? "dr.name@indostates.com"
                        : selectedPortal === "admin"
                        ? "admin@indostates.com"
                        : "patient@example.com"
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-hospital-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password / PIN
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] text-hospital-700 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-hospital-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-hospital-600 rounded"
                  />
                  <span className="text-slate-600">Keep me signed in for 7 days</span>
                </label>
              </div>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={isLoading}
                className="w-full mt-2"
              >
                {isLoading ? (
                  <span>Verifying Authorization...</span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>
                      {selectedPortal === "doctor"
                        ? "Sign In to Doctor OPD"
                        : selectedPortal === "admin"
                        ? "Sign In to Admin Center"
                        : "Sign In to Patient Portal"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              {/* Quick Evaluator Role Presets */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                  Quick {selectedPortal.toUpperCase()} Credentials
                </span>

                {selectedPortal === "doctor" && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCredential("dr.logesh@indostates.com", "Doctor@123")}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition text-[11px]"
                    >
                      <span className="font-bold text-slate-900 block truncate">Dr. Logesh (Emergency)</span>
                      <span className="text-[10px] text-slate-500 font-mono">dr.logesh@...</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCredential("dr.rajesh@indostates.com", "Rajesh@123")}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition text-[11px]"
                    >
                      <span className="font-bold text-slate-900 block truncate">Dr. Rajesh (Neuro)</span>
                      <span className="text-[10px] text-slate-500 font-mono">dr.rajesh@...</span>
                    </button>
                  </div>
                )}

                {selectedPortal === "admin" && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCredential("admin@indostates.com", "Admin@123")}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition text-[11px]"
                    >
                      <span className="font-bold text-slate-900 block">Chief Administrator</span>
                      <span className="text-[10px] text-slate-500 font-mono">admin@...</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCredential("superadmin@indostates.com", "Super@123")}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition text-[11px]"
                    >
                      <span className="font-bold text-slate-900 block">Super Admin Board</span>
                      <span className="text-[10px] text-slate-500 font-mono">superadmin@...</span>
                    </button>
                  </div>
                )}

                {selectedPortal === "patient" && (
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => setCredential("patient@indostates.com", "Patient@123")}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition text-[11px] flex justify-between items-center"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">Murugan Selvam (Verified Patient)</span>
                        <span className="text-[10px] text-slate-500 font-mono">UHID: IND-UHID-000101</span>
                      </div>
                      <span className="text-hospital-700 text-xs font-bold">Fill</span>
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}

          {/* 3. GOOGLE OAUTH */}
          {selectedPortal === "patient" && authMode === "google" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed text-center">
                Sign in with your verified Google account. If your email matches an existing patient record or appointment, your UHID will link automatically.
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2.5 transition shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          )}

          {/* Footer Links */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <div>
              New patient?{" "}
              <Link href="/register" className="text-hospital-700 font-bold hover:underline">
                Register &amp; Get UHID
              </Link>
            </div>
            <div>
              <Link href="/forgot-password" className="text-slate-500 hover:text-slate-800 hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500">Hospital Doctor or Administrator? </span>
            <Link href="/staff/login" className="text-xs text-hospital-700 font-bold hover:underline">
              Staff Clinical Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="w-8 h-8 rounded-full border-2 border-hospital-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
