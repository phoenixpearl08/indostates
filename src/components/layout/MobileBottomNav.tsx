"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Calendar, Bot, PhoneCall, Stethoscope, Building2, Sparkles } from "lucide-react";
import { HOSPITAL_INFO } from "@/data/hospitalData";
import { HospitalStore, UserSession } from "@/lib/store";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const [session, setSession] = useState<UserSession | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setSession(HospitalStore.getSession());
    const handleSession = () => setSession(HospitalStore.getSession());
    window.addEventListener("ish_session_change", handleSession);
    return () => window.removeEventListener("ish_session_change", handleSession);
  }, []);

  const activeSession = isMounted ? session : null;
  const role = (activeSession?.role || "").toUpperCase();
  const isDoctor = role === "DOCTOR" || role === "DEPARTMENT_HEAD";
  const isAdmin = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR", "OPERATIONS_MANAGER", "HR_MANAGER"].includes(role);

  return (
    <nav
      aria-label="Mobile Quick Navigation Bar"
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] print:hidden"
      style={{
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0.5rem))",
      }}
    >
      <div className="grid grid-cols-5 items-center px-2 py-1 max-w-md mx-auto">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors ${
            pathname === "/" ? "text-hospital-700 font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Home</span>
        </Link>

        {/* 2. Role Destination or Doctors */}
        {isDoctor ? (
          <Link
            href="/doctor/dashboard"
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors ${
              pathname.startsWith("/doctor") ? "text-cyan-700 font-bold" : "text-slate-500 hover:text-cyan-700"
            }`}
          >
            <Stethoscope className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">OPD</span>
          </Link>
        ) : isAdmin ? (
          <Link
            href="/admin/dashboard"
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors ${
              pathname.startsWith("/admin") ? "text-amber-700 font-bold" : "text-slate-500 hover:text-amber-700"
            }`}
          >
            <Building2 className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Admin</span>
          </Link>
        ) : (
          <Link
            href="/doctors"
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors ${
              pathname.startsWith("/doctors") ? "text-hospital-700 font-bold" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Doctors</span>
          </Link>
        )}

        {/* 3. Center Elevated Action (Book for patients / public, Queue for doctor, Dashboard for Admin) */}
        {isDoctor ? (
          <Link
            href="/doctor/dashboard?tab=queue"
            className="flex flex-col items-center justify-center -mt-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-cyan-700 text-white flex items-center justify-center shadow-lg group-hover:scale-105 active:scale-95 transition-transform border-2 border-white">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-cyan-800 mt-1">Queue</span>
          </Link>
        ) : isAdmin ? (
          <Link
            href="/admin/dashboard?tab=overview"
            className="flex flex-col items-center justify-center -mt-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-amber-700 text-white flex items-center justify-center shadow-lg group-hover:scale-105 active:scale-95 transition-transform border-2 border-white">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-amber-800 mt-1">Center</span>
          </Link>
        ) : (
          <Link
            href="/book-appointment"
            className="flex flex-col items-center justify-center -mt-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-hospital-700 text-white flex items-center justify-center shadow-lg group-hover:scale-105 active:scale-95 transition-transform border-2 border-white">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-hospital-800 mt-1">Book</span>
          </Link>
        )}

        {/* 4. IndoStates Help Desk */}
        <Link
          href="/assistant"
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors ${
            pathname === "/assistant" ? "text-teal-700 font-bold" : "text-slate-500 hover:text-teal-700"
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5 text-teal-600" />
          <span className="text-[10px] leading-tight">Help Desk</span>
        </Link>

        {/* 5. Emergency Tap-to-Call */}
        <a
          href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-rose-600 hover:text-rose-700 active:scale-95 transition-all"
        >
          <PhoneCall className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold leading-tight">24/7 Call</span>
        </a>
      </div>
    </nav>
  );
};
