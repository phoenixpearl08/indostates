"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Printer,
  Download,
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  QrCode,
  ExternalLink,
  Maximize2,
  X,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { StoredAppointment } from "@/lib/store";
import { HOSPITAL_INFO } from "@/data/hospitalData";
import { formatDate } from "@/lib/utils";
import { generateQRCodeDataUrl, getAppointmentVerificationUrl } from "@/lib/qrCode";

export interface DigitalPassProps {
  appointment: StoredAppointment;
  onBookAnother?: () => void;
  onClose?: () => void;
}

export const DigitalPass: React.FC<DigitalPassProps> = ({
  appointment,
  onBookAnother,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [verificationUrl, setVerificationUrl] = useState<string>("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  useEffect(() => {
    if (appointment) {
      const targetId = appointment.referenceCode || appointment.id;
      const url = getAppointmentVerificationUrl(targetId);
      setVerificationUrl(url);

      // Generate dynamic QR code encoding canonical verification URL
      generateQRCodeDataUrl(url, {
        width: 320,
        margin: 2,
        darkColor: "#0f172a", // Deep Navy
        lightColor: "#ffffff",
      })
        .then((dataUrl) => setQrDataUrl(dataUrl))
        .catch((err) => console.error("QR Generation error in pass:", err));
    }
  }, [appointment]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `IndoStates-Pass-${appointment.referenceCode || "Appointment"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Success Badge */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-soft">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="font-heading font-extrabold text-2xl text-slate-900">
          Appointment Confirmed!
        </h3>
        <p className="text-xs sm:text-sm text-slate-500">
          Your booking is registered. Scan the dynamic QR code below with any camera or Google Lens to verify.
        </p>
      </div>

      {/* The Printable Pass Card */}
      <div
        ref={printRef}
        className="bg-white rounded-3xl border-2 border-hospital-600 shadow-card overflow-hidden print:border-black print:shadow-none"
      >
        {/* Pass Header */}
        <div className="bg-gradient-to-r from-hospital-800 to-navy-950 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-navy-950 font-heading font-black text-xl flex items-center justify-center shadow-xs">
                IS
              </div>
              <div>
                <h4 className="font-heading font-bold text-base tracking-wide">
                  INDO STATES HEALTH
                </h4>
                <p className="text-[10px] text-cyan-300 uppercase tracking-widest font-semibold">
                  Official Digital Appointment Pass
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase text-cyan-200 tracking-wider block">
                Booking Reference
              </span>
              <span className="font-mono font-black text-sm sm:text-base text-white tracking-widest bg-white/10 px-2 py-0.5 rounded border border-white/20">
                {appointment.referenceCode}
              </span>
            </div>
          </div>
        </div>

        {/* Pass Body */}
        <div className="p-6 space-y-6 bg-gradient-to-b from-white to-slate-50/50">
          {/* Patient and Service Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pb-4 border-b border-slate-200/80">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Patient Name
              </span>
              <h5 className="font-heading font-bold text-sm text-slate-900 mt-0.5">
                {appointment.patientName}
              </h5>
              <span className="text-xs text-slate-500">
                {appointment.patientAge ? `${appointment.patientAge} Yrs • ` : ""}
                {appointment.patientGender}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Contact Number
              </span>
              <p className="font-mono text-xs sm:text-sm font-semibold text-slate-900 mt-0.5">
                {appointment.patientPhone}
              </p>
              <span className="text-xs text-slate-500 truncate block">
                {appointment.patientEmail || "Registered with hospital"}
              </span>
            </div>
          </div>

          {/* Appointment Schedule & Doctor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pb-4 border-b border-slate-200/80">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Selected Service / Department
              </span>
              <h5 className="font-bold text-sm text-hospital-800 mt-0.5">
                {appointment.targetName}
              </h5>
              {appointment.doctorName && (
                <span className="text-xs text-slate-600 block mt-0.5">
                  Consultant: {appointment.doctorName}
                </span>
              )}
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Scheduled Date & Time
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-hospital-600" />
                <span>{formatDate(appointment.date)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-hospital-600" />
                <span>{appointment.timeSlot}</span>
              </div>
            </div>
          </div>

          {/* Dynamic QR Code & Hospital Instructions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            {/* Real Standard QR Code Display */}
            <div className="shrink-0 text-center">
              <div
                onClick={() => setIsQrModalOpen(true)}
                className="w-28 h-28 p-1.5 bg-white border-2 border-slate-900 rounded-2xl flex items-center justify-center mx-auto shadow-xs cursor-pointer hover:border-hospital-600 group relative transition-colors"
                title="Click to enlarge QR code"
              >
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrDataUrl}
                    alt={`Appointment QR Code for ${appointment.referenceCode}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-6 h-6 border-2 border-hospital-600 border-t-transparent rounded-full animate-spin" />
                )}
                <div className="absolute inset-0 bg-slate-900/10 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Maximize2 className="w-5 h-5 text-slate-900 drop-shadow-sm" />
                </div>
              </div>

              <div className="mt-1.5 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span className="text-[10px] text-slate-600 font-semibold">
                  Google Lens Ready
                </span>
              </div>
            </div>

            {/* Visit Guidelines */}
            <div className="space-y-2 text-xs text-slate-600 text-left">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-hospital-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Location:</strong> {HOSPITAL_INFO.address} (Near A2B, NH 544).
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-hospital-600 shrink-0 mt-0.5" />
                <span>
                  Please present this digital pass on your phone or printout at the <strong>Reception Desk</strong> 15 minutes before your time slot.
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <Phone className="w-3.5 h-3.5 text-hospital-600 shrink-0 mt-0.5" />
                <span>
                  Assistance hotline: <strong>0422-2111000</strong>.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Link Row */}
        {verificationUrl && (
          <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
            <span className="truncate text-[11px] text-slate-500 font-mono">
              Online Verification: {verificationUrl}
            </span>
            <Link
              href={verificationUrl}
              target="_blank"
              className="text-hospital-700 hover:text-hospital-900 font-semibold inline-flex items-center gap-1 shrink-0 ml-2"
            >
              <span>Test Verify</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Pass Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500">
          Payment Status:{" "}
          <span className="font-bold text-slate-800 uppercase tracking-wide">
            {appointment.paymentStatus === "paid_online"
              ? "Paid Online"
              : "Pay on Arrival at Hospital Desk"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 print:hidden">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print Pass (A4)</span>
        </button>

        <button
          onClick={handleDownloadQR}
          disabled={!qrDataUrl}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Download QR</span>
        </button>

        <Link
          href="/portal/patient"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-300 shadow-2xs transition-all"
        >
          <User className="w-4 h-4 text-hospital-600" />
          <span>Patient Dashboard</span>
        </Link>

        {onBookAnother && (
          <button
            onClick={onBookAnother}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-all"
          >
            <span>Book Another</span>
          </button>
        )}

        {onClose && (
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-all"
          >
            <span>Close Pass</span>
          </button>
        )}
      </div>

      {/* Enlarged QR Modal */}
      {isQrModalOpen && qrDataUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="text-left">
                <h4 className="font-heading font-bold text-sm text-slate-900">
                  Appointment QR Code
                </h4>
                <span className="text-xs font-mono text-hospital-700">
                  {appointment.referenceCode}
                </span>
              </div>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center text-sm font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-white border-2 border-slate-900 rounded-2xl inline-block shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="Enlarged Appointment QR"
                className="w-56 h-56 mx-auto object-contain"
              />
            </div>

            <p className="text-xs text-slate-500">
              Scannable with Google Lens, Android Camera, or iOS Camera from up to 2 meters.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleDownloadQR}
                className="flex-1 py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Image</span>
              </button>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
