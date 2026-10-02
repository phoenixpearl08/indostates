import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { DIAGNOSTIC_MODALITIES, HOSPITAL_INFO } from "@/data/hospitalData";
import { FlaskConical, ShieldCheck, CheckCircle2, ArrowLeft, Clock, AlertCircle, Phone, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Clinical Pathology & Automated Laboratory Services | Indo States Health",
  description:
    "Accredited central clinical laboratory delivering same-day blood panels, biochemistry, tumor markers, and zero-cost home sample collection in Coimbatore.",
};

export default function LaboratoryPage() {
  const lab = DIAGNOSTIC_MODALITIES.find((m) => m.slug === "laboratory")!;

  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <Link href="/diagnostic-center" className="text-slate-600 hover:text-hospital-800 flex items-center gap-1.5 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Diagnostic Center
          </Link>
          <span className="text-slate-400">Clinical Laboratory</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
            {lab.specification}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-3 text-white">
            {lab.name}
          </h1>
          <p className="text-lg text-cyan-300 font-medium mb-4">{lab.subtitle}</p>
          <p className="text-sm text-hospital-200 max-w-3xl leading-relaxed mb-6">
            {lab.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/book-appointment?service=laboratory">
              <Button variant="secondary" size="md">
                Schedule Lab Tests
              </Button>
            </Link>
            <a href={`tel:${HOSPITAL_INFO.primaryPhoneRaw}`}>
              <Button variant="outline" size="md" className="border-hospital-700 text-white hover:bg-hospital-800" leftIcon={<Home className="w-4 h-4" />}>
                Book Free Home Collection
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Main Details */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-slate-900 font-display mb-2">Automated Laboratory Profiles</h2>
              <p className="text-xs text-slate-600 mb-6">
                Barcoded sample tubes, robotic analyzers, and dual clinical pathologist sign-offs for guaranteed precision.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lab.procedures.map((proc, idx) => (
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
                {lab.clinicalSignificance}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Fasting Instructions</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {lab.preparation}
              </p>
              <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                Digital lab reports delivered via patient portal within 4-8 hours.
              </div>
            </div>

            <div className="bg-emerald-900 text-white rounded-3xl p-6">
              <Home className="w-8 h-8 text-emerald-300 mb-3" />
              <h3 className="text-base font-bold font-display text-white mb-2">Free Home Sample Collection</h3>
              <p className="text-xs text-emerald-100 leading-relaxed mb-6">
                Avoid traveling while fasting. Our certified phlebotomists visit your home in Coimbatore at zero extra charge with cold-chain transport boxes.
              </p>
              <a href={`tel:${HOSPITAL_INFO.primaryPhoneRaw}`}>
                <Button variant="secondary" size="md" className="w-full" leftIcon={<Phone className="w-4 h-4" />}>
                  Call {HOSPITAL_INFO.primaryPhone}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
