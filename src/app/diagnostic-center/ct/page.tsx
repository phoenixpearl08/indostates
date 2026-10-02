import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { DIAGNOSTIC_MODALITIES } from "@/data/hospitalData";
import { Scan, ShieldCheck, CheckCircle2, ArrowLeft, Clock, AlertCircle, HeartPulse, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "128-Slice Low Dose CT Scan & Calcium Score | Indo States Health",
  description:
    "Ultra-fast 128-slice CT scanner with sub-second rotation and low-dose radiation. Agatston coronary calcium scoring, CT coronary angiography, and virtual colonoscopy.",
};

export default function CTPage() {
  const ct = DIAGNOSTIC_MODALITIES.find((m) => m.slug === "ct")!;

  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <Link href="/diagnostic-center" className="text-slate-600 hover:text-hospital-800 flex items-center gap-1.5 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Diagnostic Center
          </Link>
          <span className="text-slate-400">128-Slice Volumetric CT</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            {ct.specification}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-3 text-white">
            {ct.name}
          </h1>
          <p className="text-lg text-cyan-300 font-medium mb-4">{ct.subtitle}</p>
          <p className="text-sm text-hospital-200 max-w-3xl leading-relaxed mb-6">
            {ct.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/book-appointment?service=ct">
              <Button variant="secondary" size="md">
                Schedule CT Examination
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Details */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Procedures Grid */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-slate-900 font-display mb-2">Advanced CT Protocols</h2>
              <p className="text-xs text-slate-600 mb-6">
                Equipped with sub-millimeter collimation for sub-second whole-organ volumetric evaluation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ct.procedures.map((proc, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{proc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Significance */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h3 className="text-xl font-bold text-slate-900 font-display mb-3">Clinical Significance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {ct.clinicalSignificance}
              </p>
            </div>
          </div>

          {/* Right Column: Safety & Booking */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Patient Preparation</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {ct.preparation}
              </p>
              <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                Up to 80% reduced radiation via low-dose iterative reconstruction.
              </div>
            </div>

            <div className="bg-gradient-to-br from-hospital-900 to-hospital-950 text-white rounded-3xl p-6">
              <HeartPulse className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="text-base font-bold font-display text-white mb-2">10-Minute Calcium Score</h3>
              <p className="text-xs text-hospital-200 leading-relaxed mb-6">
                Discover your Agatston heart attack risk score without needles, dyes, or hospital admission. Safe, quick, and life-saving.
              </p>
              <Link href="/book-appointment?service=ct">
                <Button variant="secondary" size="md" className="w-full">
                  Book CT Calcium Score
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
