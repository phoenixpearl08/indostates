"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Stethoscope,
  Building2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Hospital,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HospitalStore, UserSession } from "@/lib/store";

function StaffLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (errorParam === "unauthorized_role" || errorParam === "unauthorized_access") {
      setErrorMsg("You are not authorized to access that dashboard with your current role permissions.");
    }
  }, [errorParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg("Please enter both your hospital email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Invalid email or password.");
        setIsLoading(false);
        return;
      }

      const staff = data.staff;
      const session: UserSession = {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        department: staff.department,
        token: `ish-stf-sig-${staff.role.toLowerCase()}-${Date.now()}`,
      };

      HospitalStore.setSession(session);

      // Determine target destination
      let targetDestination = data.redirectUrl || "/doctor/dashboard";
      if (redirectParam && redirectParam.startsWith("/")) {
        // Enforce role boundary on redirect
        if (redirectParam.startsWith("/admin") && !["ADMIN", "SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR", "OPERATIONS_MANAGER"].includes(staff.role)) {
          targetDestination = data.redirectUrl;
        } else if (redirectParam.startsWith("/doctor") && staff.role !== "DOCTOR" && !["SUPER_ADMIN", "HOSPITAL_ADMIN"].includes(staff.role)) {
          targetDestination = data.redirectUrl;
        } else {
          targetDestination = redirectParam;
        }
      }

      window.location.href = targetDestination;
    } catch {
      setErrorMsg("Unable to sign in right now. Please try again.");
      setIsLoading(false);
    }
  };

  const setStaffCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-hospital-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-hospital-500 selection:text-white">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center px-4">
        {/* Hospital Branding */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-hospital-500 to-cyan-700 flex items-center justify-center text-white shadow-lg shadow-cyan-900/30 group-hover:scale-105 transition-transform">
            <Hospital className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="text-lg font-extrabold tracking-tight text-white font-display">
              INDO STATES <span className="text-cyan-400">HEALTH</span>
            </div>
            <span className="text-[10px] tracking-widest uppercase text-hospital-300 font-semibold block">
              Staff Clinical Portal
            </span>
          </div>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Hospital Staff Login
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
          Authorized clinical &amp; administrative access for Doctors, Consultants, and Hospital Administrators.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl space-y-6">
          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-rose-300 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@indostates.com"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-11 py-3 bg-slate-950/60 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-hospital-600 to-cyan-600 hover:from-hospital-500 hover:to-cyan-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Staff Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In to Staff Console</span>
                </>
              )}
            </Button>
          </form>

          {/* Development Quick Role Selectors */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Quick Test Credentials</span>
              <span className="text-[10px] text-cyan-400 font-mono">Dev Mode</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStaffCredentials("dr.rajesh@indostates.com", "Rajesh@123")}
                className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-left transition-colors flex items-center gap-2 text-xs text-slate-200"
              >
                <div className="w-6 h-6 rounded-lg bg-cyan-900/60 text-cyan-400 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-white text-[11px]">Doctor Login</div>
                  <div className="text-[9px] text-slate-400 font-mono">dr.rajesh</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStaffCredentials("admin@indostates.com", "Admin@123")}
                className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-left transition-colors flex items-center gap-2 text-xs text-slate-200"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-900/60 text-amber-400 flex items-center justify-center shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-white text-[11px]">Admin Login</div>
                  <div className="text-[9px] text-slate-400 font-mono">admin@</div>
                </div>
              </button>
            </div>
          </div>

          {/* Link to Patient Login */}
          <div className="pt-4 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              Are you a patient or attender?{" "}
              <Link
                href="/login?portal=patient"
                className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 hover:underline"
              >
                <span>Patient Portal Login</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-6 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-600" />
          <span>Restricted to authorized IndoStates Health medical and administrative personnel.</span>
        </div>
      </div>
    </div>
  );
}

export default function StaffLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <StaffLoginForm />
    </Suspense>
  );
}
