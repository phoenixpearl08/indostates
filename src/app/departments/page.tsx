import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { DEPARTMENTS } from "@/data/hospitalData";
import { ShieldCheck, ArrowRight, Brain, Scan, HeartPulse, UserCheck, FlaskConical, AlertTriangle, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Clinical Departments & Centers of Excellence | Indo States Health",
  description:
    "Explore Indo States Health clinical departments: Neurovascular & Stroke, Advanced Diagnostic Imaging, Preventive Health, Cardiology, Women's Health, Central Laboratory, and 24/7 Emergency.",
};

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Brain,
  Scan,
  ShieldCheck,
  HeartPulse,
  UserCheck,
  FlaskConical,
  AlertTriangle,
  Stethoscope,
};

export default function DepartmentsPage() {
  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            Specialized Medicine
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-4 text-white">
            Clinical Departments
          </h1>
          <p className="text-base sm:text-lg text-hospital-200 max-w-2xl mx-auto leading-relaxed">
            Multidisciplinary medical divisions equipped with state-of-the-art diagnostic technology and led by seasoned clinicians.
          </p>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DEPARTMENTS.map((dept) => {
            const IconComponent = iconMap[dept.iconName] || Stethoscope;
            return (
              <div
                key={dept.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-hospital-50 text-hospital-700 flex items-center justify-center group-hover:bg-hospital-900 group-hover:text-white transition duration-300">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Head: {dept.headDoctor}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 font-display mb-2 group-hover:text-hospital-700 transition">
                    <Link href={`/departments/${dept.slug}`}>{dept.name}</Link>
                  </h2>
                  <p className="text-xs font-medium text-cyan-700 mb-3">{dept.tagline}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {dept.shortDescription}
                  </p>

                  <div className="mb-6">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                      Key Services & Protocols
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {dept.keyServices.slice(0, 4).map((service, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                          <span className="truncate">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <Link href={`/departments/${dept.slug}`}>
                    <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Explore Department
                    </Button>
                  </Link>
                  <Link href={`/book-appointment?departmentId=${dept.id}`}>
                    <Button variant="primary" size="sm">
                      Book Service
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
