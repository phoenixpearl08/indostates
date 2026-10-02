import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { DIAGNOSTIC_MODALITIES } from "@/data/hospitalData";
import { Activity, ShieldCheck, CheckCircle2, ArrowLeft, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "DEXA Bone Mineral Densitometry (BMD) | Indo States Health",
  description:
    "Gold standard DEXA bone density scan to diagnose osteopenia, osteoporosis, and calculate 10-year fracture risk (FRAX). State-of-the-art Lunar fan-beam system.",
};

export default function DexaPage() {
  const dexa = DIAGNOSTIC_MODALITIES.find((m) => m.slug === "dexa")!;

  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <Link href="/diagnostic-center" className="text-slate-600 hover:text-hospital-800 flex items-center gap-1.5 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Diagnostic Center
          </Link>
          <span className="text-slate-400">DEXA Bone Densitometry</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            {dexa.specification}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-3 text-white">
            {dexa.name}
          </h1>
          <p className="text-lg text-cyan-300 font-medium mb-4">{dexa.subtitle}</p>
          <p className="text-sm text-hospital-200 max-w-3xl leading-relaxed mb-6">
            {dexa.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/book-appointment?service=dexa">
              <Button variant="secondary" size="md">
                Schedule DEXA Scan
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
              <h2 className="text-2xl font-bold text-slate-900 font-display mb-2">Examinations & Metrics</h2>
              <p className="text-xs text-slate-600 mb-6">
                Quantifies bone mineral density at critical fracture sites: femoral neck, total hip, and lumbar spine.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dexa.procedures.map((proc, idx) => (
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
                {dexa.clinicalSignificance}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Scan Preparation</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {dexa.preparation}
              </p>
              <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                Exam duration: Approximately 10-15 minutes. Non-invasive and comfortable.
              </div>
            </div>

            <div className="bg-gradient-to-br from-hospital-900 to-hospital-950 text-white rounded-3xl p-6">
              <h3 className="text-base font-bold font-display text-white mb-2">Who Needs a DEXA Scan?</h3>
              <ul className="text-xs text-hospital-200 space-y-2 mb-6">
                <li>• Women aged 50+ or post-menopausal</li>
                <li>• Individuals with unexplained height loss or back pain</li>
                <li>• Patients taking long-term steroid therapy</li>
                <li>• History of low-trauma bone fractures</li>
              </ul>
              <Link href="/book-appointment?service=dexa">
                <Button variant="secondary" size="md" className="w-full">
                  Book DEXA Bone Scan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
