import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DOCTORS, DEPARTMENTS } from "@/data/hospitalData";
import { ShieldCheck, Calendar, Clock, Languages, Award, Stethoscope, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DoctorAvatar } from "@/components/ui/DoctorAvatar";

interface DoctorPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return DOCTORS.map((doc) => ({
    id: doc.id,
  }));
}

const findDoctor = (id: string) => {
  const norm = id.toLowerCase();
  return (
    DOCTORS.find((d) => d.id.toLowerCase() === norm) ||
    DOCTORS.find((d) => d.id.toLowerCase() === `dr-${norm}`) ||
    DOCTORS.find((d) => d.id.replace(/^dr-/, "").toLowerCase() === norm.replace(/^dr-/, "")) ||
    (id === "doc-1" ? DOCTORS[0] : undefined)
  );
};

export function generateMetadata({ params }: DoctorPageProps): Metadata {
  const doctor = findDoctor(params.id);
  if (!doctor) {
    return { title: "Doctor Not Found | Indo States Health" };
  }
  return {
    title: `${doctor.name} (${doctor.qualifications}) | Indo States Health`,
    description: `${doctor.role} at Indo States Health, Coimbatore. Specializing in ${doctor.specialization}. Experience: ${doctor.experienceYears} years.`,
  };
}

export default function DoctorDetailPage({ params }: DoctorPageProps) {
  const doctor = findDoctor(params.id);
  if (!doctor) {
    notFound();
  }

  const dept = DEPARTMENTS.find((d) => d.id === doctor.departmentId);

  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <Link href="/doctors" className="text-slate-600 hover:text-hospital-800 flex items-center gap-1.5 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Doctors
          </Link>
          <span className="text-slate-400">Indo States Health Specialists</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Doctor Card & Quick Facts */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 text-center">
              <div className="flex justify-center mb-6">
                <DoctorAvatar
                  name={doctor.name}
                  avatarUrl={doctor.avatarUrl}
                  specialization={doctor.specialization}
                  size="xl"
                  priority
                />
              </div>

              <div className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Specialist
              </div>

              <h1 className="text-2xl font-bold text-slate-900 font-display mb-1">{doctor.name}</h1>
              <p className="text-xs font-mono text-slate-500 font-medium mb-3">{doctor.qualifications}</p>
              <p className="text-xs font-semibold text-hospital-700 mb-6">{doctor.role}</p>

              <div className="border-t border-slate-100 pt-5 text-left space-y-3 text-xs text-slate-600">
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Experience:</span>
                  <span className="font-semibold text-slate-900">{doctor.experienceYears}+ Years</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-hospital-800">{dept?.name || "General"}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Languages:</span>
                  <span className="font-semibold text-slate-900">{doctor.languages.join(", ")}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Clinical Verification:</span>
                  <span className="font-bold text-emerald-700 text-xs">Official ISH Consultant</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100">
                <Link href={`/book-appointment?doctorId=${doctor.id}`}>
                  <Button variant="primary" size="lg" className="w-full">
                    Book Appointment
                  </Button>
                </Link>
              </div>
            </div>

            {/* Availability Box */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-hospital-600" />
                Clinic Schedule
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-start justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Available Days:</span>
                  <span className="font-semibold text-slate-900 text-right">{doctor.availableDays.join(", ")}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500">Hours:</span>
                  <span className="font-semibold text-slate-900">{doctor.timing}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Clinical Expertise */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-xl font-bold text-slate-900 font-display mb-4">About {doctor.name}</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-8">
                {doctor.biography}
              </p>

              <h3 className="text-base font-bold text-slate-900 font-display mb-3">Subspecialty Focus</h3>
              <div className="p-4 rounded-2xl bg-hospital-50/50 border border-hospital-100 text-xs text-hospital-900 leading-relaxed mb-8">
                <strong className="font-semibold">Clinical Areas:</strong> {doctor.specialization}
              </div>

              {dept && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="text-base font-bold text-slate-900 font-display mb-3">Associated Department</h3>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div>
                      <div className="text-sm font-bold text-slate-900">{dept.name}</div>
                      <div className="text-xs text-slate-500">{dept.tagline}</div>
                    </div>
                    <Link href={`/departments/${dept.slug}`}>
                      <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        View Department
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quality Standard Card */}
            <div className="bg-gradient-to-br from-hospital-900 to-hospital-950 text-white rounded-3xl p-8">
              <div className="flex items-start gap-4">
                <Award className="w-8 h-8 text-cyan-400 shrink-0" />
                <div>
                  <h3 className="text-base font-bold font-display text-white mb-1">
                    Indo States Clinical Commitment
                  </h3>
                  <p className="text-xs text-hospital-200 leading-relaxed mb-4">
                    Every consultation with our specialist doctors includes comprehensive symptom analysis, review of prior scans and blood panels, and personalized treatment or screening plans.
                  </p>
                  <Link href={`/book-appointment?doctorId=${doctor.id}`}>
                    <Button variant="secondary" size="sm">
                      Reserve a Slot with {doctor.name.split(" ")[0]} {doctor.name.split(" ")[1]}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
