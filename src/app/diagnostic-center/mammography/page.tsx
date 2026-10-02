import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { DIAGNOSTIC_MODALITIES } from "@/data/hospitalData";
import { UserCheck, ShieldCheck, CheckCircle2, ArrowLeft, Clock, AlertCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "3D Full-Field Digital Mammography | Indo States Health",
  description:
    "Early breast cancer detection with ergonomic comfort paddles and microcalcification profiling. Supervised by experienced lady physicians in Coimbatore.",
};

export default function MammographyPage() {
  const mammo = DIAGNOSTIC_MODALITIES.find((m) => m.slug === "mammography")!;

  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <Link href="/diagnostic-center" className="text-slate-600 hover:text-hospital-800 flex items-center gap-1.5 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Diagnostic Center
          </Link>
          <span className="text-slate-400">3D Digital Mammography</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            {mammo.specification}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-3 text-white">
            {mammo.name}
          </h1>
          <p className="text-lg text-cyan-300 font-medium mb-4">{mammo.subtitle}</p>
          <p className="text-sm text-hospital-200 max-w-3xl leading-relaxed mb-6">
            {mammo.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/book-appointment?service=mammography">
              <Button variant="secondary" size="md">
                Schedule Mammogram
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Details */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-slate-900 font-display mb-2">Procedures & Screening Services</h2>
              <p className="text-xs text-slate-600 mb-6">
                Designed to minimize discomfort while maximizing detection of microcalcifications and tissue architectural distortion.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mammo.procedures.map((proc, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{proc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h3 className="text-xl font-bold text-slate-900 font-display mb-3">Clinical Significance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {mammo.clinicalSignificance}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Exam Preparation</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {mammo.preparation}
              </p>
              <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                Strict privacy, female radiographers, and caring lady physicians.
              </div>
            </div>

            <div className="bg-gradient-to-br from-hospital-900 to-hospital-950 text-white rounded-3xl p-6">
              <Heart className="w-8 h-8 text-rose-400 mb-3" />
              <h3 className="text-base font-bold font-display text-white mb-2">Annual Breast Screening</h3>
              <p className="text-xs text-hospital-200 leading-relaxed mb-6">
                Recommended annually for all women aged 40 and above. Early stage 0 or 1 detection affords a &gt;98% cure rate.
              </p>
              <Link href="/book-appointment?service=mammography">
                <Button variant="secondary" size="md" className="w-full">
                  Book Mammogram
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
