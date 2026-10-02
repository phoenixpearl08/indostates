"use client";

import React from "react";
import Link from "next/link";
import { WifiOff, PhoneCall, MapPin, RefreshCw, Home, Clock } from "lucide-react";
import { HOSPITAL_INFO } from "@/data/hospitalData";

export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-card text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <WifiOff className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-heading font-black text-2xl text-slate-900">
            You are Currently Offline
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Internet connection was interrupted. Even without internet, our emergency hotline and physical hospital location are available.
          </p>
        </div>

        {/* Emergency & Address Information */}
        <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200 text-left space-y-2.5">
          <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
            <PhoneCall className="w-4 h-4 text-red-600" />
            <span>24/7 Emergency Line:</span>
          </div>
          <a
            href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
            className="block text-xl font-heading font-black text-red-700 hover:underline"
          >
            {HOSPITAL_INFO.emergencyPhone}
          </a>
          <p className="text-[11px] text-red-600">
            Direct telephone connection does not require data connection.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2 text-xs text-slate-700">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-hospital-600 shrink-0 mt-0.5" />
            <span>
              <strong>Address:</strong> {HOSPITAL_INFO.address}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-hospital-600 shrink-0" />
            <span>
              <strong>OPD Hours:</strong> Mon–Sun 9:00 AM – 6:00 PM
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.reload();
              }
            }}
            className="flex-1 py-3 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>

          <Link
            href="/"
            className="flex-1 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs border border-slate-300 flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-hospital-600" />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
