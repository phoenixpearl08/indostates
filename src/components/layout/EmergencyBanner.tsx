"use client";

import React from "react";
import { PhoneCall, AlertCircle, MapPin } from "lucide-react";
import { HOSPITAL_INFO } from "@/data/hospitalData";

export const EmergencyBanner: React.FC = () => {
  return (
    <div
      role="banner"
      aria-label="Emergency information"
      className="w-full bg-gradient-to-r from-red-700 via-emergency to-red-700 text-white text-xs sm:text-sm py-2 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left w-full">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 min-w-0">
          <span className="p-1 rounded-full bg-white/20 animate-pulse inline-flex shrink-0">
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </span>
          <span className="font-semibold tracking-wide">
            24/7 Acute Stroke & Trauma Emergency:
          </span>
          <span className="hidden md:inline text-white/90">
            Immediate 128-slice CT & 1.5T MRI triage on standby
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 shrink-0">
          <a
            href={`tel:${HOSPITAL_INFO.primaryPhoneRaw}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white text-emergency-dark font-bold text-xs hover:bg-red-50 transition-colors shadow-xs"
            aria-label={`Call Emergency Hotline ${HOSPITAL_INFO.emergencyPhone}`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-emergency-dark" />
            <span>0422-2111000</span>
          </a>
          <a
            href="/emergency"
            className="text-white/90 hover:text-white underline text-xs hidden lg:inline"
          >
            Emergency Protocols
          </a>
          <a
            href="/find-us"
            className="inline-flex items-center gap-1 text-white/90 hover:text-white underline text-xs"
          >
            <MapPin className="w-3 h-3" />
            <span>Directions</span>
          </a>
        </div>
      </div>
    </div>
  );
};
