"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Key,
  Users,
  AlertTriangle,
  Save,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SecurityViewProps {
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function SecurityView({ onSetFeedback }: SecurityViewProps) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [maxFailedLogins, setMaxFailedLogins] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/security");
      if (res.ok) {
        const resData = await res.json();
        if (resData.success) {
          setData(resData);
          if (resData.policies) {
            setSessionTimeout(resData.policies.sessionTimeoutMinutes || 60);
            setEnforce2FA(resData.policies.enforce2FAForStaff ?? true);
            setMaxFailedLogins(resData.policies.maxFailedLoginAttempts || 5);
          }
        }
      }
    } catch {
      onSetFeedback({ type: "error", message: "Failed to load security center data." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePolicies = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_policies",
          policies: {
            sessionTimeoutMinutes: Number(sessionTimeout),
            enforce2FAForStaff: enforce2FA,
            maxFailedLoginAttempts: Number(maxFailedLogins),
          },
        }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        onSetFeedback({ type: "success", message: resData.message });
      } else {
        onSetFeedback({ type: "error", message: "Failed to save security policies." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error saving security policies." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="py-16 text-center text-xs text-slate-500">
        Loading security center audit telemetry...
      </div>
    );
  }

  const events = data.events || [];
  const activeSessions = data.activeSessions || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Hospital Security Command &amp; Access Governance</h2>
          <p className="text-xs text-slate-500">
            Real-time session monitoring, failed authentication tracking, and administrative security policy controls
          </p>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Active Admin Sessions</div>
          <div className="text-lg font-black text-slate-800 mt-1">{activeSessions.length} Online</div>
          <div className="text-[10px] text-emerald-600 mt-0.5 font-semibold">Authenticated</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-rose-600">Failed Logins (24h)</div>
          <div className="text-lg font-black text-rose-700 mt-1">{data.failedLoginsCount ?? 0} Attempts</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Rate-Limited &amp; Logged</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-hospital-700">Staff 2FA Status</div>
          <div className="text-lg font-black text-hospital-800 mt-1">
            {enforce2FA ? "Enforced" : "Optional"}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">OTP Multi-Factor</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Session Timeout</div>
          <div className="text-lg font-black text-slate-800 mt-1">{sessionTimeout} Minutes</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Inactivity Revocation</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Policy Form */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Lock className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-xs text-slate-800">Security Governance Policy</h3>
          </div>

          <form onSubmit={handleSavePolicies} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Session Inactivity Timeout (Minutes)</label>
              <input
                type="number"
                min="10"
                max="240"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Max Failed Logins Before Lockout</label>
              <input
                type="number"
                min="3"
                max="10"
                value={maxFailedLogins}
                onChange={(e) => setMaxFailedLogins(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Require 2FA for Staff Portals</span>
                <input
                  type="checkbox"
                  checked={enforce2FA}
                  onChange={(e) => setEnforce2FA(e.target.checked)}
                  className="rounded text-hospital-600 focus:ring-hospital-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Requires mandatory SMS/OTP verification for all nursing, pharmacy, and reception staff logins.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isSubmitting}
              className="w-full font-bold text-xs"
            >
              <Save className="w-3.5 h-3.5 mr-1" />
              <span>{isSubmitting ? "Saving..." : "Apply Security Policies"}</span>
            </Button>
          </form>
        </div>

        {/* Live Active Sessions & Security Log */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden lg:col-span-2">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-800">Active Administrative Sessions</h3>
            <span className="text-[11px] font-bold text-slate-500">{activeSessions.length} Connected</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">User</th>
                  <th className="py-2.5 px-4">Role</th>
                  <th className="py-2.5 px-4">IP Address</th>
                  <th className="py-2.5 px-4">Client</th>
                  <th className="py-2.5 px-4">Login Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeSessions.map((s: any) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{s.user}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[10px] font-bold text-slate-800">
                        {s.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{s.ip}</td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">{s.client}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(s.loginTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
