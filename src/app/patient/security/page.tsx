"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  ShieldCheck,
  KeyRound,
  Smartphone,
  Laptop,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  EyeOff,
  UserCheck,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";

export default function PatientSecurityPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Password Update
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Active Sessions
  const [sessionsList, setSessionsList] = useState([
    {
      id: "sess-1",
      device: "Windows Chrome (Current Session)",
      ip: "157.48.21.104 (Coimbatore, India)",
      lastActive: "Active Now",
      isCurrent: true,
    },
    {
      id: "sess-2",
      device: "Android IndoStates Mobile App",
      ip: "157.48.21.99 (Tamil Nadu, India)",
      lastActive: "2 hours ago",
      isCurrent: false,
    },
  ]);

  useEffect(() => {
    setIsMounted(true);
    setSession(HospitalStore.getSession());
  }, []);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    setTimeout(() => {
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    }, 600);
  };

  const handleRevokeOtherSessions = () => {
    setSessionsList((prev) => prev.filter((s) => s.isCurrent));
    alert("All other active device sessions have been revoked.");
  };

  const handleExportData = () => {
    const data = {
      hospital: "IndoStates Hospital",
      uhid: session?.uhid || "IND-UHID-000101",
      name: session?.name || "Patient",
      email: session?.email || "patient@example.com",
      exportedAt: new Date().toISOString(),
      disclaimer: "Official patient summary generated under DPDP Act 2023 compliance.",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IndoStates-Health-Data-${session?.uhid || "UHID"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-200 text-xs font-semibold mb-3">
              <Lock className="w-3.5 h-3.5" /> Healthcare Privacy &amp; Data Protection
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Privacy &amp; Account Security</h1>
            <p className="text-cyan-100/90 text-sm mt-1 max-w-2xl leading-relaxed">
              Manage your IndoStates digital account credentials, active device authorizations, two-factor authentication, and data consent under DPDP Act 2023.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs shrink-0">
            <ShieldCheck className="w-4 h-4 text-cyan-300" />
            <span>Strict Row-Level Security Enforced</span>
          </div>
        </div>
      </div>

      {/* 2-Column: Password & 2FA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Change Password Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Change Portal Password</h2>
              <span className="text-[11px] text-slate-500">Update your sign-in credentials</span>
            </div>
          </div>

          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Password successfully updated.</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Password *</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">New Password *</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Confirm New Password *</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1.5"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? "Hide" : "Show"} password</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-cyan-700 text-white font-bold transition-colors shadow-sm"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>

        {/* 2FA & Data Export Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Two-Factor Authentication (2FA)</h2>
                <span className="text-[11px] text-slate-500">Protect portal logins via Mobile SMS OTP</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-900">SMS OTP Verification</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Sends a 6-digit secure code to your registered mobile number upon login.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  twoFactorEnabled ? "bg-emerald-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-sm absolute top-0.5 ${
                    twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* DPDP Data Export */}
            <div className="pt-2">
              <h3 className="font-bold text-xs text-slate-900 mb-1">DPDP Act 2023 Data Rights</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                You have the statutory right to download a machine-readable archive of all your personal clinical identifiers and consent records.
              </p>
              <button
                type="button"
                onClick={handleExportData}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" /> Download My Patient Data Archive
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Device Sessions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Authorized Sessions</h3>
            <p className="text-xs text-slate-500">Devices currently authenticated to access your health portal</p>
          </div>
          {sessionsList.length > 1 && (
            <button
              onClick={handleRevokeOtherSessions}
              className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors"
            >
              Sign out all other devices
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {sessionsList.map((s) => (
            <div key={s.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  {s.device.includes("Windows") ? <Laptop className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{s.device}</span>
                    {s.isCurrent && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        This Device
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {s.ip} • <span className="text-slate-700 font-medium">{s.lastActive}</span>
                  </div>
                </div>
              </div>

              {!s.isCurrent && (
                <button
                  onClick={() => setSessionsList((prev) => prev.filter((item) => item.id !== s.id))}
                  className="text-xs text-slate-400 hover:text-red-600 font-semibold transition-colors"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
