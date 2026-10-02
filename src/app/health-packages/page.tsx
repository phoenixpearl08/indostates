"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { HEALTH_PACKAGES } from "@/data/hospitalData";
import { HospitalStore } from "@/lib/store";
import { ShieldCheck, Clock, CheckCircle2, Sparkles, Filter, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HealthPackagesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const packages = useMemo(() => {
    return HospitalStore.getAllPackages();
  }, []);

  const categories = ["All", "Comprehensive", "Neuro", "Cardiac", "Women"];

  const filteredPackages = useMemo(() => {
    if (selectedCategory === "All") return packages;
    return packages.filter((p) => p.category === selectedCategory);
  }, [packages, selectedCategory]);

  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Transparent Clinical Packages
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-4 text-white">
            Health Checkup Packages
          </h1>
          <p className="text-base sm:text-lg text-hospital-200 max-w-2xl mx-auto leading-relaxed">
            All-inclusive, transparently priced preventive diagnostic packages designed by expert clinicians. Zero hidden fees.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition shadow-sm ${
                selectedCategory === cat
                  ? "bg-hospital-900 text-white shadow-md"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat} Packages
            </button>
          ))}
        </div>

        {/* Packages List */}
        <div className="space-y-8 mt-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-3xl border ${
                pkg.isFeatured ? "border-cyan-400 ring-2 ring-cyan-400/20" : "border-slate-200"
              } shadow-sm overflow-hidden p-6 sm:p-8 hover:shadow-md transition`}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-hospital-700 bg-hospital-50 px-2.5 py-0.5 rounded-full">
                      {pkg.category} Screening
                    </span>
                    {pkg.isFeatured && (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-600" />
                        Most Popular
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">{pkg.name}</h2>
                  <p className="text-xs font-medium text-cyan-700 mt-1">{pkg.tagline}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-slate-400 line-through">₹{pkg.originalPrice}</div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-hospital-900 font-display">
                      ₹{pkg.price}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">Net Inclusive Price</div>
                  </div>
                  <Link href={`/book-appointment?packageId=${pkg.id}`}>
                    <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Book Package
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Package Details & Inclusions */}
              <div className="py-6">
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl mb-6">
                  {pkg.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pkg.testsIncluded.map((group, gIdx) => (
                    <div key={gIdx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                      <div className="text-xs font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {group.category}
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {group.items.map((item, iIdx) => (
                          <li key={iIdx} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* Clinical Evaluation Column */}
                  <div className="bg-hospital-50/60 rounded-2xl p-4 border border-hospital-100">
                    <div className="text-xs font-bold text-hospital-900 mb-2.5 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-hospital-600" />
                      Consultation & Services
                    </div>
                    <ul className="space-y-1.5 text-xs text-hospital-800">
                      {pkg.clinicalEvaluation.map((evalItem, eIdx) => (
                        <li key={eIdx} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-hospital-600 mt-1.5 shrink-0" />
                          <span>{evalItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Fasting & Report Timeline Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Turnaround: {pkg.turnaroundTime}
                  </span>
                  {pkg.fastingRequired && (
                    <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      Fasting: {pkg.fastingHours} Hours Overnight
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">
                  Complimentary Home Collection Available in Coimbatore
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
