import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LEADERSHIP_TEAM } from "@/data/hospitalData";
import { Users, Award, ShieldCheck, Mail, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Leadership & Clinical Board | Indo States Health",
  description:
    "Meet the visionary clinical founders and executive leaders of Indo States Health, Coimbatore, led by US dual board-certified neuroradiologist Dr. Rajesh Rangaswamy.",
};

export default function LeadershipPage() {
  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            Executive & Clinical Stewardship
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-4 text-white">
            Hospital Leadership & Team
          </h1>
          <p className="text-base sm:text-lg text-hospital-200 max-w-2xl mx-auto leading-relaxed">
            Distinguished physicians, healthcare innovators, and administrative pioneers committed to global healthcare excellence in India.
          </p>
        </div>
      </section>

      {/* Leadership Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LEADERSHIP_TEAM.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition group"
            >
              <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={member.avatarUrl}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs font-mono font-medium text-cyan-300 mb-1">{member.qualifications}</div>
                  <h3 className="text-xl font-bold font-display">{member.name}</h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-hospital-50 text-hospital-700 text-xs font-semibold uppercase tracking-wider mb-2">
                    {member.role}
                  </div>
                  <div className="text-xs font-semibold text-slate-800 mb-3">
                    {member.specialization}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {member.details}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Credential
                  </span>
                  <Link href="/book-appointment">
                    <button className="text-xs font-semibold text-hospital-700 hover:text-hospital-900 flex items-center gap-1">
                      Consultation <ArrowRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Philosophy Callout */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <Award className="w-10 h-10 text-hospital-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 font-display mb-3">
            American Standards. Indian Compassion.
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto mb-6">
            Under the guidance of Dr. Rajesh Rangaswamy (MD, DABR, CAQ-NR, CAST-EVN), every protocol at Indo States Health adheres to rigorous international quality guidelines, ensuring radiation safety, diagnostic accuracy, and patient dignity.
          </p>
          <Link href="/contact">
            <Button variant="outline" size="md">
              Contact Leadership Office
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
