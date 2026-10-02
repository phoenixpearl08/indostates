import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEPARTMENTS, DOCTORS } from "@/data/hospitalData";
import { ShieldCheck, CheckCircle2, ArrowLeft, ArrowRight, Calendar, User, Stethoscope, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DepartmentPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return DEPARTMENTS.map((dept) => ({
    slug: dept.slug,
  }));
}

export function generateMetadata({ params }: DepartmentPageProps): Metadata {
  const dept = DEPARTMENTS.find((d) => d.slug === params.slug);
  if (!dept) {
    return { title: "Department Not Found | Indo States Health" };
  }
  return {
    title: `${dept.name} | Indo States Health Coimbatore`,
    description: `${dept.name} at Indo States Health. ${dept.shortDescription} Headed by ${dept.headDoctor}.`,
  };
}

export default function DepartmentDetailPage({ params }: DepartmentPageProps) {
  const dept = DEPARTMENTS.find((d) => d.slug === params.slug);
  if (!dept) {
    notFound();
  }

  const doctorsInDept = DOCTORS.filter((d) => d.departmentId === dept.id);

  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <Link href="/departments" className="text-slate-600 hover:text-hospital-800 flex items-center gap-1.5 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> All Departments
          </Link>
          <span className="text-slate-400">Clinical Center of Excellence</span>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            Specialized Care Division
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-3 text-white">
            {dept.name}
          </h1>
          <p className="text-lg text-cyan-300 font-medium mb-6">{dept.tagline}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-hospital-200">
            <span className="bg-hospital-800/60 px-3 py-1.5 rounded-lg border border-hospital-700">
              Department Lead: <strong className="text-white">{dept.headDoctor}</strong>
            </span>
            <span className="bg-hospital-800/60 px-3 py-1.5 rounded-lg border border-hospital-700">
              Available 6-7 Days a Week
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Full Overview & Services */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-slate-900 font-display mb-4">Overview & Clinical Mission</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {dept.fullDescription}
              </p>

              <h3 className="text-lg font-bold text-slate-900 font-display mb-4">Specialized Services & Procedures</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {dept.keyServices.map((service, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-cyan-50/60 border border-cyan-100 flex items-start gap-4">
                <Award className="w-6 h-6 text-cyan-700 shrink-0 mt-0.5" />
                <div className="text-xs text-cyan-950">
                  <div className="font-bold mb-1">State-of-the-Art Diagnostic Support</div>
                  All clinical evaluations within this department are backed by our in-house 1.5 Tesla MRI, 128-slice CT, and automated laboratory ensuring rapid and definitive diagnoses.
                </div>
              </div>
            </div>

            {/* Department Doctors */}
            {doctorsInDept.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-slate-900 font-display mb-6">Department Specialists</h2>
                <div className="space-y-4">
                  {doctorsInDept.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-hospital-300 transition"
                    >
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{doc.name}</h4>
                        <div className="text-xs font-mono text-hospital-700 mb-1">{doc.qualifications}</div>
                        <p className="text-xs text-slate-600 line-clamp-1">{doc.specialization}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link href={`/doctors/${doc.id}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            View Profile
                          </Button>
                        </Link>
                        <Link href={`/book-appointment?doctorId=${doc.id}`}>
                          <Button variant="primary" size="sm" className="text-xs">
                            Book Slot
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: CTA & Fast Scheduling */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-hospital-50 text-hospital-700 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display mb-2">Book a Consultation</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Directly schedule an in-person evaluation or diagnostic scan with the {dept.name} team.
              </p>
              <Link href={`/book-appointment?departmentId=${dept.id}`}>
                <Button variant="primary" size="lg" className="w-full">
                  Book Department Visit
                </Button>
              </Link>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-6">
              <h3 className="text-sm font-bold font-display text-white mb-2">Diagnostic Scans Needed?</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                If your physician has requested an MRI, CT, Mammogram, or DEXA scan, you can book diagnostic appointments directly without delays.
              </p>
              <Link href="/diagnostic-center">
                <Button variant="secondary" size="sm" className="w-full text-xs">
                  View Diagnostic Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
