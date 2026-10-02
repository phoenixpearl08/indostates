import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { DIAGNOSTIC_MODALITIES } from "@/data/hospitalData";
import { Scan, ShieldCheck, ArrowRight, Zap, CheckCircle2, Activity, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Advanced Diagnostic Center | 1.5T MRI, 128-Slice CT, 3D Mammogram & DEXA",
  description:
    "Indo States Health Advanced Diagnostic Center in Coimbatore. High-resolution cross-sectional imaging, lowest radiation protocols, and automated laboratory diagnostics.",
};

export default function DiagnosticCenterPage() {
  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <Scan className="w-3.5 h-3.5 text-cyan-400" />
            Cutting-Edge Medical Imaging
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-4 text-white">
            Advanced Diagnostic Center
          </h1>
          <p className="text-base sm:text-lg text-hospital-200 max-w-2xl mx-auto leading-relaxed">
            High-precision cross-sectional imaging and clinical biochemistry directed by US dual board-certified neuroradiologists.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/book-appointment">
              <Button variant="secondary" size="lg">
                Schedule Diagnostic Scan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modalities Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DIAGNOSTIC_MODALITIES.map((modality) => (
            <div
              key={modality.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-hospital-700 bg-hospital-50 px-2.5 py-0.5 rounded-full">
                    {modality.specification}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 font-display mb-1 group-hover:text-hospital-700 transition">
                  <Link href={`/diagnostic-center/${modality.slug}`}>{modality.name}</Link>
                </h2>
                <p className="text-xs font-medium text-cyan-700 mb-4">{modality.subtitle}</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {modality.description}
                </p>

                <div className="mb-6">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Procedures Included
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {modality.procedures.slice(0, 4).map((proc, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                        <span className="truncate">{proc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <Link href={`/diagnostic-center/${modality.slug}`}>
                  <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Technical Specs
                  </Button>
                </Link>
                <Link href={`/book-appointment?service=${modality.slug}`}>
                  <Button variant="primary" size="sm">
                    Book Scan
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Diagnostic Safety Guarantee */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <div className="bg-hospital-900 text-white rounded-3xl p-8 shadow-xl">
          <Award className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-display mb-2">Radiation Safety & Diagnostic Rigor</h2>
          <p className="text-xs text-hospital-200 leading-relaxed max-w-2xl mx-auto mb-6">
            All CT acquisitions utilize low-dose iterative reconstruction (ASiR-V) delivering up to 80% reduced radiation compared to conventional scanners. MRI examinations run on dedicated coils without ionizing radiation.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/book-appointment">
              <Button variant="secondary" size="md">
                Book a Diagnostic Scan
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="md" className="border-hospital-700 text-white hover:bg-hospital-800">
                Inquire About Scan Preparation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
