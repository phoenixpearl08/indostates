"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Building2,
  Phone,
  Clock,
  Save,
  CheckCircle2,
  AlertTriangle,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SettingsViewProps {
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function SettingsView({ onSetFeedback }: SettingsViewProps) {
  const [settings, setSettings] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSettings(data.settings);
        }
      }
    } catch {
      onSetFeedback({ type: "error", message: "Failed to load hospital settings." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to update settings." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error saving settings." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="py-16 text-center text-xs text-slate-500">
        Loading hospital administrative system settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Hospital Administration Master Settings</h2>
          <p className="text-xs text-slate-500">
            Configure hospital identity, emergency hotline, OPD appointment slot durations, and maintenance modes
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
        {/* Section 1: Hospital Identity */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-xs text-slate-800">
            <Building2 className="w-4 h-4 text-hospital-700" />
            <span>Hospital Brand Identity &amp; Physical Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Official Legal Name</label>
              <input
                type="text"
                required
                value={settings.hospitalName || ""}
                onChange={(e) => setSettings({ ...settings, hospitalName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline || ""}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Physical Campus Address</label>
            <input
              type="text"
              value={settings.address || ""}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
            />
          </div>
        </div>

        {/* Section 2: Contact Hotlines */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-xs text-slate-800">
            <Phone className="w-4 h-4 text-rose-600" />
            <span>Emergency Hotlines &amp; General Inquiries</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">24/7 Emergency Trauma Hotline *</label>
              <input
                type="text"
                required
                value={settings.emergencyHotline || ""}
                onChange={(e) => setSettings({ ...settings, emergencyHotline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs font-bold text-rose-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">General Appointments Line</label>
              <input
                type="text"
                value={settings.generalEnquiries || ""}
                onChange={(e) => setSettings({ ...settings, generalEnquiries: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Support &amp; Patient Care Email</label>
              <input
                type="email"
                value={settings.supportEmail || ""}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Appointment Scheduling Rules */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-xs text-slate-800">
            <Clock className="w-4 h-4 text-hospital-700" />
            <span>OPD Scheduling Parameters &amp; Capacity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Consultation Slot Duration (Minutes)</label>
              <select
                value={settings.slotDurationMinutes || 20}
                onChange={(e) =>
                  setSettings({ ...settings, slotDurationMinutes: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
              >
                <option value="15">15 Minutes</option>
                <option value="20">20 Minutes (Standard)</option>
                <option value="30">30 Minutes (Comprehensive)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Max Daily Appointment Intake</label>
              <input
                type="number"
                value={settings.maxDailyAppointments || 250}
                onChange={(e) =>
                  setSettings({ ...settings, maxDailyAppointments: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">QR Pass Security Expiry (Hours)</label>
              <input
                type="number"
                value={settings.qrTokenExpiryHours || 24}
                onChange={(e) =>
                  setSettings({ ...settings, qrTokenExpiryHours: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Maintenance Mode */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-xs text-slate-800">Hospital Maintenance Notice Mode</span>
            </div>
            <input
              type="checkbox"
              checked={!!settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            When enabled, displays a temporary clinical advisory banner on patient booking forms and public pages.
          </p>
          <input
            type="text"
            value={settings.maintenanceNotice || ""}
            onChange={(e) => setSettings({ ...settings, maintenanceNotice: e.target.value })}
            placeholder="e.g. Scheduled biplane cath lab upgrade from 10 PM to 2 AM."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
            <Save className="w-3.5 h-3.5 mr-1" />
            <span>{isSubmitting ? "Saving..." : "Save Hospital Master Settings"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
