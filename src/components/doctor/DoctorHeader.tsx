"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  Stethoscope,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Doctor } from "@/data/hospitalData";
import { DoctorTabId } from "./DoctorSidebar";

interface DoctorHeaderProps {
  doctor: Doctor;
  activeTab: DoctorTabId;
  onSelectTab: (tab: DoctorTabId) => void;
  onToggleSidebar: () => void;
  onLogout: () => void;
  unreadCount?: number;
  opdRoom?: string;
  isOnDuty?: boolean;
}

export function DoctorHeader({
  doctor,
  activeTab,
  onSelectTab,
  onToggleSidebar,
  onLogout,
  unreadCount = 0,
  opdRoom = "OPD Room 204",
  isOnDuty = true,
}: DoctorHeaderProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const currentDateFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Clinical Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">{getGreeting()},</span>
              <span className="text-sm font-bold text-slate-900">{doctor.name}</span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  isOnDuty ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOnDuty ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                  }`}
                />
                {isOnDuty ? "On Duty" : "Off Duty"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
              <span className="font-medium text-hospital-700">{doctor.specialization}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3 h-3 text-slate-400" />
                {opdRoom}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:flex items-center gap-1 text-slate-400">
                <Calendar className="w-3 h-3" />
                {currentDateFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Notifications & Profile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Button */}
          <button
            onClick={() => onSelectTab("notifications")}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Clinical Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 transition-colors"
              aria-expanded={profileDropdownOpen}
            >
              <div className="w-8 h-8 rounded-full bg-hospital-100 border border-hospital-200 flex items-center justify-center text-hospital-700 font-bold text-xs shrink-0 overflow-hidden">
                {doctor.avatarUrl ? (
                  <img
                    src={doctor.avatarUrl}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  doctor.name.slice(3, 5).toUpperCase()
                )}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                  {doctor.name.replace("Dr. ", "")}
                </div>
                <div className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">
                  {doctor.qualifications}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setProfileDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-40 text-xs text-slate-700 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/60">
                    <div className="font-bold text-slate-900">{doctor.name}</div>
                    <div className="text-[11px] text-hospital-700 font-medium">
                      {doctor.specialization}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onSelectTab("profile");
                    }}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-slate-50 text-left font-medium text-slate-700"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    Doctor Profile & Credentials
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onSelectTab("schedule");
                    }}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-slate-50 text-left font-medium text-slate-700"
                  >
                    <Clock className="w-4 h-4 text-slate-400" />
                    OPD Schedule & Duty Hours
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onSelectTab("settings");
                    }}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-slate-50 text-left font-medium text-slate-700"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Consultation Settings
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-rose-50 text-left font-semibold text-rose-700"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
