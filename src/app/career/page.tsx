import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, CheckCircle2, HeartHandshake, GraduationCap, Clock, MapPin, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HOSPITAL_INFO } from "@/data/hospitalData";

export const metadata: Metadata = {
  title: "Careers & Opportunities | Indo States Health Coimbatore",
  description:
    "Join the clinical and operational team at Indo States Health in Arasur, Coimbatore. Explore openings for radiographers, phlebotomists, nurses, and medical officers.",
};

export default function CareerPage() {
  const openings = [
    {
      title: "Senior MRI / CT Radiologic Technologist",
      department: "Diagnostic Imaging Center",
      type: "Full-Time",
      experience: "3-6 Years",
      location: "Arasur, Coimbatore",
      requirements:
        "B.Sc / Diploma in Medical Imaging Technology (DRT). Hands-on experience with 1.5 Tesla MRI and 128-slice CT scan acquisition and contrast protocols.",
    },
    {
      title: "Certified Medical Phlebotomist / Home Collection Executive",
      department: "Clinical Laboratory Services",
      type: "Full-Time",
      experience: "1-3 Years",
      location: "Coimbatore City & Surrounds",
      requirements:
        "DMLT / B.Sc MLT with valid two-wheeler driving license. Skill in pediatric & geriatric venipuncture, cold-chain sample preservation, and courteous communication.",
    },
    {
      title: "Emergency & ICU Staff Nurse (GNM / B.Sc)",
      department: "Emergency & Acute Care",
      type: "Full-Time / Rotational",
      experience: "2-5 Years",
      location: "Arasur, Coimbatore",
      requirements:
        "B.Sc Nursing / GNM with Tamil Nadu Nursing Council registration. BLS / ACLS certification preferred. Rapid triage and emergency response acumen.",
    },
    {
      title: "Patient Relations & Reception Officer",
      department: "Hospital Administration",
      type: "Full-Time",
      experience: "1-3 Years",
      location: "Arasur, Coimbatore",
      requirements:
        "Graduate with outstanding verbal fluency in Tamil and English. Experience with hospital front-desk management, patient welcoming, and digital scheduling.",
    },
  ];

  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            Join Our Clinical Team
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-4 text-white">
            Careers at Indo States Health
          </h1>
          <p className="text-base sm:text-lg text-hospital-200 max-w-2xl mx-auto leading-relaxed">
            Be part of a visionary healthcare institution raising the bar of diagnostic precision and patient care in South India.
          </p>
        </div>
      </section>

      {/* Values & Perks */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <GraduationCap className="w-8 h-8 text-hospital-700 mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">Global Mentorship</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct clinical mentoring from US board-certified radiologists, standardizing advanced imaging acquisition and acute stroke management.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <HeartHandshake className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">Respectful Work Culture</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              A supportive environment prioritizing employee well-being, transparent communication, competitive compensation, and health benefits.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Clock className="w-8 h-8 text-cyan-600 mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">Modern Technology</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Work directly with cutting-edge 1.5T MRI systems, 128-slice volumetric CT scanners, 3D digital mammography, and barcoded lab automation.
            </p>
          </div>
        </div>

        {/* Current Openings */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 font-display mb-2">Current Openings</h2>
          <p className="text-xs text-slate-600 mb-6">
            Review the positions below. To apply, email your resume with the job title in the subject line.
          </p>

          <div className="space-y-4">
            {openings.map((job, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-hospital-300 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-hospital-600 bg-hospital-50 px-2.5 py-0.5 rounded-full">
                      {job.department}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1.5">{job.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {job.requirements}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">Experience: {job.experience}</span>
                  <a
                    href={`mailto:${HOSPITAL_INFO.emails.contact}?subject=Application for ${encodeURIComponent(job.title)}`}
                  >
                    <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Apply via Email
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Application */}
        <div className="bg-hospital-900 text-white rounded-3xl p-8 text-center max-w-3xl mx-auto">
          <Mail className="w-10 h-10 text-cyan-300 mx-auto mb-3" />
          <h3 className="text-xl font-bold font-display mb-2">Don&apos;t see your profile listed?</h3>
          <p className="text-xs text-hospital-200 max-w-md mx-auto mb-6 leading-relaxed">
            We are always looking for compassionate doctors, nursing professionals, radiographers, and administrative leaders. Send your resume for future consideration.
          </p>
          <a href={`mailto:${HOSPITAL_INFO.emails.contact}?subject=General Career Inquiry`}>
            <Button variant="secondary" size="md">
              Send Resume to {HOSPITAL_INFO.emails.contact}
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
