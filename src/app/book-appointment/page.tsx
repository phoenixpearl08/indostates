import React from "react";
import type { Metadata } from "next";
import { AppointmentWizard } from "@/components/booking/AppointmentWizard";
import { ShieldCheck, Phone, Clock, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { HOSPITAL_INFO } from "@/data/hospitalData";

export const metadata: Metadata = {
  title: "Book an Appointment | Indo States Health Coimbatore",
  description:
    "Schedule your doctor consultation, 1.5T MRI, 128-slice CT scan, or Master Health Checkup (₹3,500) online. Instant digital appointment pass with QR code.",
};

export default function BookAppointmentPage() {
  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-hospital-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            Direct Patient Scheduling
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display mb-4 text-white">
            Schedule Your Visit
          </h1>
          <p className="text-hospital-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Reserve clinical consultations, state-of-the-art diagnostic imaging (1.5T MRI / 128-slice CT), or the Master Health Checkup. Instant digital confirmation.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-hospital-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant QR Digital Pass</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Pay on Arrival</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Waiting Time Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Wizard Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <AppointmentWizard />
      </section>

      {/* Information & Guidelines Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Arrival Time</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Please arrive 15 minutes before your scheduled slot for registration and vitals check. For MRI/CT with contrast, plan for 30 minutes early arrival.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Fasting Instructions</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Master Health Checkup and Lipid tests require 10-12 hours of overnight fasting. You may drink plain water. Please hold morning diabetic medication until after blood collection.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-hospital-50 flex items-center justify-center text-hospital-600 mb-4">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Need Assistance?</h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            Our scheduling desk is ready to help with special accessibility needs or same-day inquiries.
          </p>
          <a
            href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
            className="text-xs font-semibold text-hospital-700 hover:text-hospital-900 flex items-center gap-1.5"
          >
            Call {HOSPITAL_INFO.primaryPhone} &rarr;
          </a>
        </div>
      </section>

      {/* Emergency Notice */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900">
            <span className="font-bold">Medical Emergency Warning:</span> If you are experiencing sudden chest pain, facial drooping, one-sided weakness, or acute difficulty breathing, do not wait for an online appointment. Call our 24/7 Emergency Line immediately at{" "}
            <a href={`tel:${HOSPITAL_INFO.emergencyPhone}`} className="underline font-bold text-rose-950">
              {HOSPITAL_INFO.emergencyPhone}
            </a>{" "}
            or proceed directly to our Emergency Department on Salem-Kochi Highway, Arasur.
          </div>
        </div>
      </section>
    </div>
  );
}
