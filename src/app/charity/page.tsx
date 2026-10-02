import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Globe, ShieldCheck, CheckCircle2, ArrowRight, ExternalLink, Gift, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HOSPITAL_INFO } from "@/data/hospitalData";

export const metadata: Metadata = {
  title: "ARDOR Care Foundation | Philanthropic Arm of Indo States Health",
  description:
    "ARDOR Care Foundation provides subsidized healthcare, free diagnostic screening camps, and medical outreach across rural Tamil Nadu. Registered under Section 12A & 80G in India and 501(c)(3) in the USA.",
};

export default function CharityPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            Philanthropy & Community Health
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-4 text-white">
            ARDOR Care Foundation
          </h1>
          <p className="text-base sm:text-lg text-hospital-200 max-w-2xl mx-auto leading-relaxed">
            Ensuring no individual is denied life-saving diagnostic imaging or acute medical care due to financial hardship.
          </p>
        </div>
      </section>

      {/* Legal Status & Dual Wings */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-xs uppercase font-bold text-emerald-700 mb-1">India Non-Profit Wing</div>
            <h2 className="text-2xl font-bold text-slate-900 font-display mb-3">ARDOR Care Foundation</h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Registered in India with Section 12A and 80G status under the Income Tax Act. Indian donors receive 50% tax deductions on all contributions toward medical subsidies.
            </p>
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">Tax Exemption:</span>
                <span className="font-mono text-emerald-700">Section 12A & 80G</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">Registered Office:</span>
                <span>Coimbatore, Tamil Nadu</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-6">
              <Globe className="w-6 h-6" />
            </div>
            <div className="text-xs uppercase font-bold text-cyan-700 mb-1">United States Partner</div>
            <h2 className="text-2xl font-bold text-slate-900 font-display mb-3">Ardor Corporation</h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Recognized as a 501(c)(3) public charity in the United States. US-based donors and diaspora members can contribute with full federal tax deductibility.
            </p>
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">US Status:</span>
                <span className="font-mono text-cyan-700">501(c)(3) Public Charity</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">Official Site:</span>
                <a
                  href="https://ardoronline.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-hospital-700 font-semibold hover:underline flex items-center gap-1"
                >
                  ardoronline.com <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mb-3">Key Outreach Pillars</h2>
            <p className="text-slate-600 text-sm">
              Delivering quantifiable, life-saving impacts across rural and semi-urban communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <HandHeart className="w-8 h-8 text-rose-600 mb-4" />
              <h3 className="font-bold text-slate-900 text-base mb-2">Subsidized Scans & Blood Panels</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Covering up to 100% of MRI, CT, and laboratory expenses for BPL (Below Poverty Line) patients and agricultural workers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="font-bold text-slate-900 text-base mb-2">Rural Stroke & Heart Screening</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Conducting mobile blood pressure, blood glucose, and ECG screening camps in villages around Arasur and Sulur.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <Gift className="w-8 h-8 text-cyan-600 mb-4" />
              <h3 className="font-bold text-slate-900 text-base mb-2">Medical Aid & Devices</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Providing free walking aids, diabetic footwear, medications, and rehabilitation equipment for recovering stroke survivors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Partner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 font-display mb-4">Partner with ARDOR Care Foundation</h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto mb-8 leading-relaxed">
          For CSR partnerships, institutional grants, or community screening requests in Coimbatore district, reach out to our foundation desk.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href={`mailto:${HOSPITAL_INFO.emails.support}`}>
            <Button variant="primary" size="md">
              Contact Foundation Desk
            </Button>
          </a>
          <a href="https://ardoronline.com/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="md" rightIcon={<ExternalLink className="w-4 h-4" />}>
              Visit US Foundation Site
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
