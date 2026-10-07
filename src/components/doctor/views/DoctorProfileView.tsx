"use client";

import React, { useState } from "react";
import {
  User,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  Award,
  Key,
  Lock,
  Clock,
  Save,
  CheckCircle2,
  AlertCircle,
  FileBadge,
} from "lucide-react";
import { Doctor } from "@/data/hospitalData";

interface DoctorProfileViewProps {
  doctor: Doctor;
  onProfileUpdated?: (updatedDoctor: Doctor) => void;
}

export function DoctorProfileView({
  doctor,
  onProfileUpdated,
}: DoctorProfileViewProps) {
  // Permitted edit fields
  const [phone, setPhone] = useState(doctor.phone || "+91 98765 43210");
  const [about, setAbout] = useState(doctor.about || "");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/doctor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_profile",
          phone,
          about,
        }),
      });
      if (!res.ok) throw new Error("Failed to update profile details");
      const data = await res.json();
      setSuccessMsg("Doctor profile updated successfully.");
      onProfileUpdated?.({ ...doctor, phone, about });
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErr(null);
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordErr("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErr("New passwords do not match.");
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch("/api/doctor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          currentPassword,
          newPassword,
        }),
      });
      if (!res.ok) throw new Error("Failed to change password");
      setPasswordMsg("Doctor account password updated securely.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMsg(null), 3500);
    } catch (err: any) {
      setPasswordErr(err.message || "Failed to update password");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Profile Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-hospital-50 border-2 border-hospital-200 flex items-center justify-center font-bold text-hospital-700 text-xl overflow-hidden shadow-2xs">
              {doctor.image ? (
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                doctor.name.charAt(0)
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{doctor.name}</h2>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Doctor
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {doctor.qualification} • {doctor.specialty}
              </p>
              <div className="flex items-center gap-2 text-xs text-hospital-700 font-semibold mt-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Department of {doctor.department}</span>
                <span>•</span>
                <span>Room {doctor.opdRoom || "OPD-104"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Success / Error alerts */}
        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Grid: Official Verified Credentials vs Permitted Contact Edits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Official Credentials (Read-only / Admin controlled) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <FileBadge className="w-4 h-4 text-hospital-600" />
              Official Verified Credentials
            </h3>
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              Admin Controlled
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block mb-0.5">Medical Council Reg. No.</span>
              <div className="p-2.5 rounded-lg bg-slate-50 font-mono font-bold text-slate-800 border border-slate-200">
                {doctor.licenseNumber || "KMC-48291-MED"}
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block mb-0.5">Primary Specialization</span>
              <div className="p-2.5 rounded-lg bg-slate-50 font-bold text-slate-800 border border-slate-200">
                {doctor.specialty}
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block mb-0.5">Assigned Department</span>
              <div className="p-2.5 rounded-lg bg-slate-50 font-bold text-slate-800 border border-slate-200">
                {doctor.department}
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block mb-0.5">Clinical Experience</span>
              <div className="p-2.5 rounded-lg bg-slate-50 font-bold text-slate-800 border border-slate-200">
                {doctor.experience || "12 Years Clinical Practice"}
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block mb-0.5">Hospital System Role</span>
              <div className="p-2.5 rounded-lg bg-slate-50 font-mono font-bold text-hospital-800 border border-slate-200">
                ROLE_DOCTOR (Clinical Practitioner)
              </div>
            </div>
          </div>
        </div>

        {/* Right: Permitted Doctor Updates */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-hospital-600" />
              Doctor Contact & Bio Information
            </h3>
            <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Editable by You
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                Official Hospital Email (Login ID)
              </label>
              <input
                type="text"
                disabled
                value={doctor.email || "doctor@indostates.org"}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-500 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                Contact Phone / Extension
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-hospital-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                Clinical Overview & Patient Notes
              </label>
              <textarea
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Brief summary of clinical focus, patient consultation philosophy..."
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving Changes..." : "Save Profile Details"}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Security & Password Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Key className="w-4 h-4 text-hospital-600" />
            Doctor Account Security & Password
          </h3>
          <span className="text-[10px] text-slate-400">
            Last authenticated login: Today
          </span>
        </div>

        {passwordMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{passwordMsg}</span>
          </div>
        )}
        {passwordErr && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{passwordErr}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-700 font-semibold block mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 rounded-lg border border-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full p-2.5 rounded-lg border border-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full p-2.5 rounded-lg border border-slate-200 text-xs"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              disabled={passwordSaving}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{passwordSaving ? "Updating Password..." : "Update Security Password"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
