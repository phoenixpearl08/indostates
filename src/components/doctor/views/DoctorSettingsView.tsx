"use client";

import React, { useState } from "react";
import {
  Settings,
  Bell,
  Stethoscope,
  Globe,
  Save,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Doctor } from "@/data/hospitalData";

interface DoctorSettingsViewProps {
  doctor: Doctor;
}

export function DoctorSettingsView({ doctor }: DoctorSettingsViewProps) {
  const [defaultFollowUpDays, setDefaultFollowUpDays] = useState("7");
  const [defaultPrescriptionNotes, setDefaultPrescriptionNotes] = useState(
    "Drink plenty of warm fluids. Take medications strictly after meals."
  );
  const [notifyOnCheckIn, setNotifyOnCheckIn] = useState(true);
  const [notifyOnCriticalLab, setNotifyOnCriticalLab] = useState(true);
  const [emergencySoundAlert, setEmergencySoundAlert] = useState(true);
  const [language, setLanguage] = useState("en");
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "ish_doctor_settings",
        JSON.stringify({
          defaultFollowUpDays,
          defaultPrescriptionNotes,
          notifyOnCheckIn,
          notifyOnCriticalLab,
          emergencySoundAlert,
          language,
        })
      );
    }
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-hospital-600" />
          Doctor Workspace Preferences & Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Customize your clinical consultation defaults, notification preferences, and workspace experience.
        </p>

        {savedMsg && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Preferences saved successfully.</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
        {/* Consultation Defaults */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Stethoscope className="w-4 h-4 text-hospital-600" />
            Consultation Defaults
          </h3>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Default Follow-up Period
            </label>
            <select
              value={defaultFollowUpDays}
              onChange={(e) => setDefaultFollowUpDays(e.target.value)}
              className="w-full sm:w-64 p-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium"
            >
              <option value="3">In 3 Days</option>
              <option value="5">In 5 Days</option>
              <option value="7">In 1 Week (7 Days)</option>
              <option value="14">In 2 Weeks (14 Days)</option>
              <option value="30">In 1 Month (30 Days)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Standard Prescription Advice Template
            </label>
            <textarea
              rows={2}
              value={defaultPrescriptionNotes}
              onChange={(e) => setDefaultPrescriptionNotes(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 text-xs"
            />
          </div>
        </div>

        {/* Clinical Notifications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Bell className="w-4 h-4 text-hospital-600" />
            Clinical Alerts & Notification Toggles
          </h3>

          <div className="space-y-2.5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOnCheckIn}
                onChange={(e) => setNotifyOnCheckIn(e.target.checked)}
                className="w-4 h-4 rounded text-hospital-600 focus:ring-hospital-500"
              />
              <span className="font-medium text-slate-800">
                Notify immediately when Reception checks in a waiting patient
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOnCriticalLab}
                onChange={(e) => setNotifyOnCriticalLab(e.target.checked)}
                className="w-4 h-4 rounded text-hospital-600 focus:ring-hospital-500"
              />
              <span className="font-medium text-slate-800">
                Audio alert on Critical Laboratory Values (STAT alerts)
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emergencySoundAlert}
                onChange={(e) => setEmergencySoundAlert(e.target.checked)}
                className="w-4 h-4 rounded text-hospital-600 focus:ring-hospital-500"
              />
              <span className="font-medium text-slate-800">
                Emergency Priority patient flashing banner on dashboard
              </span>
            </label>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Globe className="w-4 h-4 text-hospital-600" />
            Interface Language
          </h3>

          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="radio"
                name="lang"
                value="en"
                checked={language === "en"}
                onChange={(e) => setLanguage(e.target.value)}
              />
              English (Clinical Standard)
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="radio"
                name="lang"
                value="hi"
                checked={language === "hi"}
                onChange={(e) => setLanguage(e.target.value)}
              />
              Hindi (हिंदी)
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs flex items-center gap-2 shadow-2xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </form>
    </div>
  );
}
