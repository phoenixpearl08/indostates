"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  QrCode,
  Calendar,
  Clock,
  Printer,
  Download,
  Share2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Plus,
  Building2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { HospitalStore, UserSession, StoredAppointment } from "@/lib/store";
import { DigitalPass } from "@/components/booking/DigitalPass";

function QrPassContent() {
  const searchParams = useSearchParams();
  const targetId = searchParams.get("id");

  const [session, setSession] = useState<UserSession | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const s = HospitalStore.getSession();
    if (!s) {
      window.location.href = "/login?portal=patient&redirect=/patient/qr-pass";
      return;
    }
    setSession(s);
    loadAppointments(s);
  }, [targetId]);

  const loadAppointments = async (user: UserSession) => {
    setIsLoading(true);
    try {
      const patientUhid = user.uhid || "IND-UHID-000101";
      const res = await fetch(
        `/api/appointments?uhid=${encodeURIComponent(patientUhid)}&phone=${encodeURIComponent(user.phone || "")}&email=${encodeURIComponent(user.email || "")}`
      );
      let list: any[] = [];
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.appointments)) {
          list = d.appointments;
        }
      }

      // Merge local appointments if needed
      const local = HospitalStore.getAppointments();
      if (local && local.length > 0) {
        const seen = new Set(list.map((a) => a.id));
        local.forEach((la) => {
          if (!seen.has(la.id)) list.push(la);
        });
      }

      setAppointments(list);

      // Select target or most imminent upcoming appointment
      if (list.length > 0) {
        if (targetId) {
          const match = list.find((a) => a.id === targetId || a.referenceCode === targetId);
          setSelectedAppointment(match || list[0]);
        } else {
          const upcoming = list.filter((a) => a.status !== "CANCELLED");
          setSelectedAppointment(upcoming.length > 0 ? upcoming[0] : list[0]);
        }
      }
    } catch (err) {
      console.error("Error loading appointments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (!selectedAppointment) return;
    const ref = selectedAppointment.referenceCode || selectedAppointment.id;
    const url = `${window.location.origin}/booking/verify/${ref}`;
    if (navigator.share) {
      navigator.share({
        title: `IndoStates Health Pass: ${ref}`,
        text: `Official Digital Medical Pass for ${selectedAppointment.patientName} with ${selectedAppointment.doctorName || selectedAppointment.targetName}`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-100">
            Contactless Hospital Admission
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-2">
            Digital QR Appointment Pass
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Display this QR at IndoStates main entrance security gates, reception kiosks, or nurse triage desks for instant verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedAppointment && (
            <button
              type="button"
              onClick={handleShare}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? "Link Copied!" : "Share Pass"}</span>
            </button>
          )}

          <Link
            href="/book-appointment"
            className="px-4 py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Book Another</span>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-hospital-600" />
          <span>Generating verified digital pass...</span>
        </div>
      ) : appointments.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No Active Medical Passes Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Book your consultation or diagnostic scan to generate an encrypted QR pass.
          </p>
          <Link
            href="/book-appointment"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-hospital-700 text-white font-bold text-xs hover:bg-hospital-800 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: List of passes */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Select Appointment Pass
            </h3>

            <div className="space-y-2.5">
              {appointments.map((appt) => {
                const isSelected = selectedAppointment?.id === appt.id;
                return (
                  <div
                    key={appt.id}
                    onClick={() => setSelectedAppointment(appt)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                      isSelected
                        ? "border-hospital-700 bg-hospital-50/70 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-hospital-800 text-xs">
                        {appt.referenceCode || appt.appointmentId}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          appt.status === "CONFIRMED"
                            ? "bg-emerald-100 text-emerald-800"
                            : appt.status === "CHECKED_IN"
                            ? "bg-cyan-100 text-cyan-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs truncate">
                      {appt.doctorName || appt.targetName}
                    </h4>

                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{appt.appointmentDate || appt.date} at {appt.timeSlot}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Google Lens Notice */}
            <div className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-hospital-600" />
                <span>Google Lens &amp; Scanner Compatible</span>
              </span>
              <p className="text-[11px] leading-relaxed">
                This QR code encodes an authenticated hospital URL. Gate staff and patients can scan it using any smartphone camera or Google Lens.
              </p>
            </div>
          </div>

          {/* Right Column: Full Pass Viewer */}
          <div className="lg:col-span-8">
            {selectedAppointment ? (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Official IndoStates Medical Pass
                  </span>
                  <Link
                    href={`/booking/verify/${selectedAppointment.referenceCode || selectedAppointment.id}`}
                    target="_blank"
                    className="text-xs font-bold text-hospital-700 hover:underline flex items-center gap-1"
                  >
                    <span>Public Gate Verification</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <DigitalPass appointment={selectedAppointment} />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PatientQrPassPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading pass...</div>}>
      <QrPassContent />
    </Suspense>
  );
}
