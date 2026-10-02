import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { HOSPITAL_INFO, LEADERSHIP_TEAM } from "@/data/hospitalData";
import { ShieldCheck, Heart, Award, Sparkles, CheckCircle2, ArrowRight, Building2, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Indo States Health | Advanced Preventive & Diagnostic Medical Center",
  description:
    "Learn about Indo States Health in Arasur, Coimbatore. Founded by US dual board-certified specialist Dr. Rajesh Rangaswamy to bring world-class preventive medicine, 1.5T MRI, and 128-slice CT to India.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            Institutional Profile
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-6">
            State-of-the-Art Healthcare to the People of India
          </h1>
          <p className="text-lg sm:text-xl text-hospital-200 max-w-3xl mx-auto leading-relaxed font-light">
            Founded with a singular mission: to bridge the gap between world-class international clinical standards and accessible healthcare delivery in Tamil Nadu.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold uppercase mb-4">
              Our Inception
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 font-display">
              A Global Vision Rooted in Indian Soil
            </h2>
            <div className="space-y-4 text-slate-600 text-base leading-relaxed">
              <p>
                Indo States Health was established under the clinical leadership of <strong className="text-slate-900">Dr. Rajesh Rangaswamy</strong>, a renowned neuroradiologist and neurointerventional surgeon dual board-certified in the United States and India.
              </p>
              <p>
                After practicing and leading endovascular stroke programs in leading academic medical institutions in the US, Dr. Rajesh recognized a critical disparity: while reactive tertiary care was expanding in India, early-stage disease prevention and sub-millimeter diagnostic precision were out of reach for everyday citizens.
              </p>
              <p>
                Indo States Health was designed from the ground up as a center of diagnostic excellence—combining ultra-low-dose 128-slice CT, high-field 1.5 Tesla MRI, 3D digital mammography, and comprehensive master health checkups along the Coimbatore-Salem highway corridor.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-2xl font-bold text-hospital-900 font-display">1.5T MRI</div>
                <div className="text-xs text-slate-600 mt-1">High-field neuro & musculoskeletal imaging</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-2xl font-bold text-hospital-900 font-display">128-Slice CT</div>
                <div className="text-xs text-slate-600 mt-1">Sub-second coronary calcium & stroke scans</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 aspect-[4/3]">
              <Image
                src="https://indostates.com/wp-content/uploads/2025/04/Hos-01-1024x548.png"
                alt="Indo States Health Facility"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="mt-3 sm:mt-0 sm:absolute sm:-bottom-6 sm:right-6 bg-white p-4 sm:p-5 rounded-xl shadow-lg sm:shadow-xl border border-slate-200 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Arasur, Coimbatore</div>
                  <div className="text-xs text-slate-600">NH 544 Salem-Kochi Highway</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Pillars */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mb-3">
              Our Four Pillars of Clinical Philosophy
            </h2>
            <p className="text-slate-600 text-sm">
              We shift the paradigm from reactive illness treatment to proactive, lifelong health protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">1. Prevent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stopping disease before onset through lipid optimization, metabolic screening, lifestyle prescriptions, and risk stratification.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-hospital-50 text-hospital-600 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">2. Screen</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Catching asymptomatic malignancies and arterial plaques early via 3D mammography, DEXA, low-dose CT, and tumor markers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">3. Treat</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Delivering evidence-based clinical therapy, acute emergency stabilization, and personalized therapeutic management.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">4. Support</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ensuring equitable community health through ARDOR Care Foundation subsidies, free home sample collection, and patient education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <div className="text-xs uppercase font-semibold text-hospital-600 tracking-wider mb-2">Executive Leadership</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">Guided by Distinguished Clinicians</h2>
          </div>
          <Link href="/leadership">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Leadership
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LEADERSHIP_TEAM.slice(0, 3).map((leader) => (
            <div key={leader.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-white shadow-md">
                <Image src={leader.avatarUrl} alt={leader.name} fill className="object-cover" unoptimized />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{leader.name}</h3>
              <p className="text-xs font-medium text-hospital-700 mb-1">{leader.role}</p>
              <p className="text-[11px] text-slate-500 font-mono mb-3">{leader.qualifications}</p>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{leader.details}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Location & CTA */}
      <section className="bg-hospital-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-display mb-4">
            Visit Indo States Health in Coimbatore
          </h2>
          <p className="text-hospital-200 text-sm max-w-2xl mx-auto mb-8">
            Located conveniently on the Salem-Kochi Highway corridor in Arasur. We welcome you for preventive screenings, diagnostic scans, and clinical consultations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/book-appointment">
              <Button variant="secondary" size="lg">
                Book an Appointment
              </Button>
            </Link>
            <Link href="/find-us">
              <Button variant="outline" size="lg" className="border-hospital-700 text-white hover:bg-hospital-800">
                Directions & Map
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
