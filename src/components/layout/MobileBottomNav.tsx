"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Calendar, Bot, PhoneCall } from "lucide-react";
import { HOSPITAL_INFO } from "@/data/hospitalData";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  // Hide on printing or on admin portal to allow full dashboard width
  if (pathname.startsWith("/portal/admin")) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile Quick Navigation Bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] print:hidden"
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

        {/* 2. Doctors */}
        <Link
          href="/doctors"
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors ${
            pathname.startsWith("/doctors") ? "text-hospital-700 font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Doctors</span>
        </Link>

        {/* 3. Book Appointment (Center Elevated CTA) */}
        <Link
          href="/book-appointment"
          className="flex flex-col items-center justify-center -mt-4 group"
        >
          <div className="w-12 h-12 rounded-full bg-hospital-700 text-white flex items-center justify-center shadow-lg group-hover:scale-105 active:scale-95 transition-transform border-2 border-white">
            <Calendar className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-hospital-800 mt-1">Book</span>
        </Link>

        {/* 4. IndoCare AI */}
        <Link
          href="/assistant"
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors ${
            pathname === "/assistant" ? "text-teal-700 font-bold" : "text-slate-500 hover:text-teal-700"
          }`}
        >
          <Bot className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">AI Care</span>
        </Link>

        {/* 5. Emergency Tap-to-Call */}
        <a
          href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-red-600 hover:text-red-700 active:scale-95 transition-all"
        >
          <PhoneCall className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold leading-tight">Call 24/7</span>
        </a>
      </div>
    </nav>
  );
};
