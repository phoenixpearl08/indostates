"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Calendar,
  User,
  MapPin,
  Phone,
  ShieldCheck,
  Building2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { HOSPITAL_INFO } from "@/data/hospitalData";
import { Button } from "@/components/ui/Button";

interface VerificationData {
  valid: boolean;
  status: "confirmed" | "completed" | "checked_in" | "cancelled" | "expired";
  message: string;
  appointment?: {
    id: string;
    referenceCode: string;
    patientNameMasked: string;
    patientPhoneMasked: string;
    doctorName: string;
    targetName: string;
    date: string;
    timeSlot: string;
    status: string;
    hospital: string;
    address: string;
    emergencyPhone: string;
    verifiedAt: string;
  };
  error?: string;
}

export default function BookingVerifyPage() {
  const params = useParams();
  const bookingId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<VerificationData | null>(null);

  useEffect(() => {
    if (!bookingId) return;

    fetch(`/api/appointments/verify?id=${encodeURIComponent(bookingId)}`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Verification fetch error:", err);
        setData({
          valid: false,
          status: "expired",
          message: "Network error during verification.",
          error: "Could not reach verification server. Please verify connection or consult hospital reception.",
        });
        setIsLoading(false);
      });
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-hospital-50/30 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl">
        {/* Hospital Branding Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hospital-700 to-navy-950 flex items-center justify-center text-white shadow-soft">
              <span className="font-heading font-black text-base text-cyan-300">IS</span>
            </div>
            <div className="text-left">
              <span className="font-heading font-black text-lg text-navy-950 block leading-tight">
                INDO STATES HEALTH
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-hospital-600 block">
                Digital Pass Verification Gateway
              </span>
            </div>
          </Link>
          <p className="text-xs text-slate-500">
            Official QR Verification System • Indo States Health Hospital, Coimbatore
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-card text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-3 border-hospital-600 border-t-transparent animate-spin mx-auto" />
            <h2 className="text-base font-bold text-slate-800">
              Verifying Appointment Credentials...
            </h2>
            <p className="text-xs text-slate-500">
              Querying hospital registry and digital signature records.
            </p>
          </div>
        )}

        {/* Verification Result Card */}
        {!isLoading && data && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Status Header Banner */}
            <div
              className={`p-6 text-center text-white ${
                data.valid && data.status === "confirmed"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-700"
                  : data.valid && data.status === "checked_in"
                  ? "bg-gradient-to-r from-cyan-600 to-hospital-700"
                  : data.status === "completed"
                  ? "bg-gradient-to-r from-slate-700 to-navy-900"
                  : "bg-gradient-to-r from-rose-600 to-red-700"
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3 shadow-inner">
                {data.valid && data.status === "confirmed" ? (
                  <CheckCircle2 className="w-8 h-8 text-white" />
                ) : data.valid && data.status === "checked_in" ? (
                  <ShieldCheck className="w-8 h-8 text-white" />
                ) : data.status === "completed" ? (
                  <CheckCircle2 className="w-8 h-8 text-cyan-200" />
                ) : (
                  <XCircle className="w-8 h-8 text-white" />
                )}
              </div>

              <span className="text-[11px] font-bold uppercase tracking-widest text-white/80 block">
                Verification Result
              </span>
              <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white mt-1">
                {data.valid && data.status === "confirmed"
                  ? "Valid Appointment Verified"
                  : data.status === "checked_in"
                  ? "Patient Checked In"
                  : data.status === "completed"
                  ? "Consultation Completed"
                  : "Booking Could Not Be Verified"}
              </h1>
              <p className="text-xs text-white/90 mt-1.5 max-w-md mx-auto">
                {data.message || data.error}
              </p>
            </div>

            {/* Appointment Details Body */}
            {data.appointment && (
              <div className="p-6 sm:p-8 space-y-6">
                {/* Reference Code & Hospital Stamp */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Booking Reference
                    </span>
                    <span className="text-lg font-mono font-black text-hospital-800 tracking-wider">
                      {data.appointment.referenceCode}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Status
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                        data.appointment.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : data.appointment.status === "checked_in"
                          ? "bg-cyan-100 text-cyan-800"
                          : data.appointment.status === "completed"
                          ? "bg-slate-200 text-slate-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {data.appointment.status}
                    </span>
                  </div>
                </div>

                {/* Clinical Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                      <User className="w-3.5 h-3.5 text-hospital-600" />
                      <span>Doctor / Clinical Service</span>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">
                      {data.appointment.doctorName}
                    </p>
                    <p className="text-xs text-slate-600">{data.appointment.targetName}</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-hospital-600" />
                      <span>Scheduled Slot</span>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">
                      {data.appointment.date}
                    </p>
                    <p className="text-xs text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {data.appointment.timeSlot}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-hospital-600" />
                      <span>Patient (Privacy Masked)</span>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">
                      {data.appointment.patientNameMasked}
                    </p>
                    <p className="text-xs text-slate-500">{data.appointment.patientPhoneMasked}</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                      <Building2 className="w-3.5 h-3.5 text-hospital-600" />
                      <span>Hospital Center</span>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">
                      {HOSPITAL_INFO.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">Arasur, Coimbatore</p>
                  </div>
                </div>

                {/* Location & Instructions */}
                <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200/80 text-xs text-cyan-950 space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block">Hospital Address:</strong>
                      <span>{HOSPITAL_INFO.address} (Near A2B, NH 544 Salem-Kochi Highway).</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-cyan-200/60 text-cyan-900 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                    <span>24/7 Acute Care Hotline: 0422-2111000</span>
                  </div>
                </div>
              </div>
            )}

            {/* Invalid or Expired Information */}
            {!data.valid && (
              <div className="p-6 sm:p-8 space-y-4 text-center">
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 text-left space-y-2">
                  <div className="flex items-center gap-2 font-bold text-rose-800 text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Check-In Advisory</span>
                  </div>
                  <p>
                    This digital pass is invalid, expired, or has been cancelled in the hospital database. If you believe this is an error, please present your SMS confirmation to the hospital front desk upon arrival.
                  </p>
                </div>
              </div>
            )}

            {/* Actions Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <a
                href="https://maps.google.com/maps?q=10/77,+D+Sengodagowndenpudur,+Arasur,+Tamil+Nadu+641407"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-300 inline-flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <span>Google Maps Directions</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>

              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Hospital Homepage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Verification Timestamp Footnote */}
        <p className="text-[11px] text-slate-400 text-center mt-6">
          Cryptographically signed verification token • Indo States Health IT Infrastructure
        </p>
      </div>
    </div>
  );
}
