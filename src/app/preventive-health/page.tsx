"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, Sparkles, CheckCircle2, ArrowRight, Activity, Zap, FileText, Phone } from "lucide-react";
import { HEALTH_PACKAGES, HOSPITAL_INFO } from "@/data/hospitalData";

export default function PreventiveHealthPage() {
  const masterPackage = HEALTH_PACKAGES.find((p) => p.slug === "master-health-checkup");

  const pillars = [
    { title: "Cardiovascular Risk", desc: "Coronary calcium score & lipid subfractions to detect soft and calcified plaques before heart attack." },
    { title: "Neurovascular & Stroke", desc: "1.5T MRI angiography & carotid intima-media thickness (CIMT) to stop silent strokes." },
    { title: "Oncology Early Screening", desc: "Targeted tumor markers (CA125, PSA) and 3D digital mammography to catch micro-malignancies early." },
    { title: "Metabolic & Diabetes", desc: "HbA1c, fasting glucose, insulin resistance, and pancreatic enzymes for metabolic longevity." },
    { title: "Hepatic & Renal Integrity", desc: "Liver enzymes (SGOT/SGPT), fatty liver assessment, and kidney creatinine clearance." },
    { title: "Bone & Skeletal Density", desc: "Lunar DEXA BMD scans to halt osteopenia and prevent osteoporotic fractures." },
    { title: "Endocrine & Thyroid", desc: "High-sensitivity TSH and endocrine panels to eliminate fatigue and hormonal disruption." },
    { title: "Hematology & Immunity", desc: "5-part differential hemogram to detect subtle anemias, cytopenias, and immune deficiencies." },
    { title: "Nutritional Vitality", desc: "Serum Vitamin D3, Vitamin B12, and ferritin screening to optimize energy and cognition." },
    { title: "Cardiopulmonary Fitness", desc: "12-lead ECG and low-dose CT chest evaluation for smokers and high-risk individuals." },
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            Center for Longevity & Prevention
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-4 text-white">
            Preventive Health Center
          </h1>
          <p className="text-base sm:text-lg text-hospital-200 max-w-3xl mx-auto leading-relaxed">
            Stop disease decades before symptoms arise. We shift healthcare from treating late-stage complications to safeguarding vibrant, long-term vitality.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/health-packages"
              className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 px-6 py-3 text-base bg-hospital-100 hover:bg-hospital-200 text-hospital-900 shadow-sm"
            >
              View Health Packages
            </Link>
            <Link
              href="/book-appointment"
              className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 px-6 py-3 text-base border border-hospital-700 text-white hover:bg-hospital-800"
            >
              Book Master Checkup (₹3,500)
            </Link>
          </div>
        </div>
      </section>

      {/* Flagship Master Checkup Highlight */}
      {masterPackage && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="bg-white rounded-3xl border-2 border-cyan-500 shadow-2xl p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                Hospital Flagship Offering
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mb-2">
                {masterPackage.name}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {masterPackage.description}
              </p>
              <div className="flex flex-wrap gap-y-2 gap-x-6 text-xs text-slate-700">
                <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Free Home Blood Collection in Coimbatore
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                  Over 25 Vital Diagnostic Tests
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                  12-Lead ECG & Doctor Review
                </span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center shrink-0 w-full sm:w-64">
              <div className="text-xs text-slate-400 line-through mb-1">Original ₹{masterPackage.originalPrice}</div>
              <div className="text-4xl font-extrabold text-hospital-900 font-display mb-1">
                ₹{masterPackage.price}
              </div>
              <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider mb-4">
                All-Inclusive Package
              </div>
              <Link
                href={`/book-appointment?packageId=${masterPackage.id}`}
                className="w-full inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 px-4 py-2 text-sm bg-hospital-700 hover:bg-hospital-800 text-white shadow-sm"
              >
                Book Checkup
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 10 Health Pillars Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold text-hospital-600 uppercase tracking-wider mb-2">Holistic Clinical Framework</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mb-3">
            The 10 Vital Pillars of Prevention
          </h2>
          <p className="text-slate-600 text-sm">
            Unlike superficial basic tests, our multidisciplinary screening evaluates biological systems interconnectedly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 flex items-start gap-4 hover:border-hospital-300 transition">
              <div className="w-10 h-10 rounded-xl bg-hospital-900 text-white flex items-center justify-center font-display font-bold text-sm shrink-0">
                {idx + 1}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-1">{pillar.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Home Sample Collection Banner */}
      <section className="bg-hospital-50 border-y border-hospital-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-hospital-950 font-display mb-1">
              Zero-Cost Home Blood Sample Collection
            </h3>
            <p className="text-xs text-hospital-800 leading-relaxed max-w-xl">
              For seniors, busy executives, and families across Coimbatore, our certified phlebotomists collect fasting blood samples safely at your doorstep with cold-chain transport.
            </p>
          </div>
          <a
            href={`tel:${HOSPITAL_INFO.primaryPhoneRaw}`}
            className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 px-4 py-2 text-sm bg-hospital-700 hover:bg-hospital-800 text-white shadow-sm shrink-0 gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Call {HOSPITAL_INFO.primaryPhone}</span>
          </a>
        </div>
      </section>
    </div>
  );
}
