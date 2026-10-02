import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Target, Shield, Heart, Award, Eye, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Vision, Mission & Core Values | Indo States Health",
  description:
    "Explore the vision, mission, and institutional principles of Indo States Health, delivering international-standard preventive and diagnostic medicine to India.",
};

export default function VisionMissionPage() {
  const values = [
    {
      title: "Clinical Excellence",
      desc: "Upholding uncompromising precision in neurovascular, cardiovascular, and diagnostic imaging guided by US board-certified protocols.",
      icon: Award,
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Compassion & Dignity",
      desc: "Treating every patient and family with warmth, deep listening, respect, and utmost care regardless of socioeconomic background.",
      icon: Heart,
      color: "bg-rose-50 text-rose-700",
    },
    {
      title: "Proactive Prevention",
      desc: "Empowering individuals to detect risk factors decades before symptoms manifest through rigorous screening and lifestyle guidance.",
      icon: Shield,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Radical Transparency",
      desc: "Clear, upfront pricing with zero hidden surcharges, honest medical counsel, and patient ownership of diagnostic data.",
      icon: Eye,
      color: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            Institutional Purpose
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-4 text-white">
            Vision, Mission & Values
          </h1>
          <p className="text-base sm:text-lg text-hospital-200 max-w-2xl mx-auto leading-relaxed">
            The foundational principles steering Indo States Health toward becoming India’s beacon for preventive healthcare.
          </p>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision */}
          <div className="bg-gradient-to-br from-hospital-50/70 to-cyan-50/40 p-8 rounded-3xl border border-hospital-100 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-hospital-900 text-white flex items-center justify-center mb-6 shadow-md">
              <Eye className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display mb-4">Our Vision</h2>
            <p className="text-slate-700 leading-relaxed text-base mb-6">
              To be the most trusted, patient-centric preventive healthcare institution in India, revolutionizing illness prevention by making advanced subspecialty diagnostics, early stroke detection, and cardiovascular screening universally accessible, affordable, and actionable.
            </p>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Eradicate preventable stroke and sudden cardiac death</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Set global benchmarks for low-radiation imaging</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Foster lifelong patient-doctor trust</span>
              </li>
            </ul>
          </div>

          {/* Mission */}
          <div className="bg-gradient-to-br from-emerald-50/60 to-slate-50 p-8 rounded-3xl border border-emerald-100 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mb-6 shadow-md">
              <Target className="w-6 h-6 text-emerald-200" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display mb-4">Our Mission</h2>
            <p className="text-slate-700 leading-relaxed text-base mb-6">
              To deliver compassionate, world-standard clinical care powered by high-field 1.5 Tesla MRI, 128-slice CT, and automated laboratory diagnostics. We combine clinical rigor, transparent consultation, and philanthropic outreach through the ARDOR Care Foundation to elevate the health of our community.
            </p>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Rapid same-day diagnostic turnaround</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero-cost home blood sample collection in Coimbatore</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Philanthropic medical aid for economically vulnerable patients</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mb-3">Our Core Values</h2>
            <p className="text-slate-600 text-sm">
              The internal moral compass guiding every nurse, radiographer, physician, and staff member at Indo States Health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${v.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1.5">{v.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-4 font-display">Experience Patient-First Care Today</h3>
        <div className="flex justify-center gap-4">
          <Button href="/book-appointment" variant="primary" size="md">
            Book Appointment
          </Button>
          <Button href="/about" variant="outline" size="md">
            Institutional Profile
          </Button>
        </div>
      </section>
    </div>
  );
}
