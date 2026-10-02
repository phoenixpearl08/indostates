"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { HospitalStore, UserSession } from "@/lib/store";
import { Lock, Mail, ShieldCheck, Stethoscope, Building2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { getAppBaseUrl } from "@/lib/qrCode";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const portalParam = searchParams.get("portal") || "";
  const redirectParam = searchParams.get("redirect") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [oauthNotice, setOauthNotice] = useState<string | null>(null);

  // Pre-fill email hint if navigating via specific portal link
  useEffect(() => {
    if (portalParam === "doctor" && !email) {
      setEmail("dr.logesh@indostates.com");
      setPassword("Doctor@123");
    } else if (portalParam === "admin" && !email) {
      setEmail("admin@indostates.com");
      setPassword("Admin@123");
    }
  }, [portalParam]);

  const handleLogin = async (e: React.FormEvent) => {
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

      // Store server-verified session
      const verifiedUser = data.user;
      const session: UserSession = {
        id: verifiedUser.id,
        name: verifiedUser.name,
        email: verifiedUser.email,
        role: verifiedUser.role, // Determined strictly on the server
        token: verifiedUser.token,
      };

      HospitalStore.setSession(session);

      // Route strictly based on verified server role
      let destination = data.redirectUrl;
      if (verifiedUser.role === "patient" && redirectParam) {
        destination = redirectParam;
      } else if (!destination) {
        destination =
          verifiedUser.role === "admin"
            ? "/admin/dashboard"
            : verifiedUser.role === "doctor"
            ? "/doctor/dashboard"
            : "/portal/patient";
      }
      router.push(destination);
    } catch (err: any) {
      console.error("Login request error:", err);
      setErrorMsg("Network communication error. Please ensure server is running and retry.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setOauthNotice(null);

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        try {
          const baseUrl = getAppBaseUrl();
          const targetRedirect = redirectParam ? `${baseUrl}${redirectParam}` : `${baseUrl}/login`;
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
      "Google OAuth Provider Notice: Connect your Google Client ID and Secret in your Supabase Dashboard (Authentication -> Providers -> Google) to activate direct Google sign-in. You can sign in immediately using verified hospital staff or patient credentials below."
    );
  };

  const setCredential = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setErrorMsg(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Portal Header Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-100 text-hospital-800 text-xs font-semibold mb-3 border border-hospital-200">
            {portalParam === "doctor" ? (
              <>
                <Stethoscope className="w-3.5 h-3.5 text-hospital-700" />
                <span>Doctor &amp; Clinical Staff Authentication</span>
              </>
            ) : portalParam === "admin" ? (
              <>
                <Building2 className="w-3.5 h-3.5 text-hospital-700" />
                <span>Hospital Administration Console</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-hospital-700" />
                <span>Indo States Health Unified Sign In</span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Shared Hospital Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1.5">
            Single secure gateway for Doctors, Hospital Administrators, and Patients
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
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

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@indostates.com or patient email"
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
                <Link href="/faq" className="text-[11px] text-hospital-700 hover:underline">
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
                  <span>Sign In &amp; Access Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="shrink mx-3 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">Or</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2.5 transition shadow-2xs"
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

          {/* Quick Evaluator Credentials Preset */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Quick Role Verification Presets
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCredential("admin@indostates.com", "Admin@123")}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition text-[11px]"
              >
                <span className="font-bold text-slate-900 block">Admin</span>
                <span className="text-[10px] text-slate-500 font-mono">admin@...</span>
              </button>
              <button
                type="button"
                onClick={() => setCredential("dr.logesh@indostates.com", "Doctor@123")}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition text-[11px]"
              >
                <span className="font-bold text-slate-900 block">Doctor</span>
                <span className="text-[10px] text-slate-500 font-mono">dr.logesh@...</span>
              </button>
              <button
                type="button"
                onClick={() => setCredential("patient@example.com", "Patient@123")}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition text-[11px]"
              >
                <span className="font-bold text-slate-900 block">Patient</span>
                <span className="text-[10px] text-slate-500 font-mono">patient@...</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2">
            New patient?{" "}
            <Link href="/register" className="text-hospital-700 font-bold hover:underline">
              Create a Patient Account
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
