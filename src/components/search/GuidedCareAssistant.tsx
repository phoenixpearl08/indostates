"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Activity,
  Heart,
  Brain,
  Sparkles,
  Stethoscope,
  FlaskConical,
  ArrowRight,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

export const GuidedCareAssistant: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const carePaths = [
    {
      id: "master-checkup",
      icon: <Activity className="w-5 h-5 text-hospital-600" />,
      title: "Routine Full-Body Checkup",
      desc: "I want a proactive preventive checkup for myself or my parents.",
      recommendation: {
        title: "Master Health Check-up (₹3,500)",
        summary:
          "Comprehensive preventive screening covering 25+ blood tests, tumor markers, 12-lead ECG, physician consultation, and free home sample collection.",
        linkUrl: "/health-packages",
        linkText: "View Master Health Checkup Details",
        secondaryUrl: "/book-appointment?package=master-health-checkup",
        secondaryText: "Book Appointment Now",
      },
    },
    {
      id: "stroke-headache",
      icon: <Brain className="w-5 h-5 text-hospital-600" />,
      title: "Brain, Stroke & Headache",
      desc: "Concerned about stroke risks, memory issues, numbness, or persistent headaches.",
      recommendation: {
        title: "Neurovascular & 1.5T MRI Brain Evaluation",
        summary:
          "Consult with Dr. Rajesh Rangaswamy (US & Indian Dual Board-Certified Neuroradiologist) or explore our 1.5 Tesla MRI protocol and Carotid Doppler scans.",
        linkUrl: "/diagnostic-center/mri",
        linkText: "Explore 1.5T MRI Neuro Protocols",
        secondaryUrl: "/doctors/dr-rajesh-rangaswamy",
        secondaryText: "Meet Dr. Rajesh Rangaswamy",
      },
    },
    {
      id: "heart-chest",
      icon: <Heart className="w-5 h-5 text-hospital-600" />,
      title: "Heart & Cardiovascular Risk",
      desc: "Family history of heart attacks, cholesterol, or seeking non-invasive calcium scoring.",
      recommendation: {
        title: "128-Slice CT Coronary Calcium Score & Angiogram",
        summary:
          "Detect calcified arterial plaque in 10 minutes with our low-radiation 128-slice CT scanner. Also includes rest ECG and extended cardiac lipid profile.",
        linkUrl: "/diagnostic-center/ct",
        linkText: "Learn about 128-Slice CT Scans",
        secondaryUrl: "/departments/cardiovascular-health",
        secondaryText: "Cardiovascular Care Center",
      },
    },
    {
      id: "womens-health",
      icon: <Sparkles className="w-5 h-5 text-hospital-600" />,
      title: "Women's Wellness & Screening",
      desc: "Breast screening, bone density DEXA scan, Pap smear, or menopausal care.",
      recommendation: {
        title: "Women's Health & 3D Digital Mammography",
        summary:
          "High-definition 3D digital mammograms, bone mineral density (DEXA BMD), and CA-125 ovarian markers led by Chief Medical Officer Dr. Vani Mohan.",
        linkUrl: "/diagnostic-center/mammography",
        linkText: "Explore 3D Mammography Services",
        secondaryUrl: "/health-packages",
        secondaryText: "Women's Wellness Package",
      },
    },
    {
      id: "lab-home-sample",
      icon: <FlaskConical className="w-5 h-5 text-hospital-600" />,
      title: "Blood Tests & Home Sample Collection",
      desc: "Doctor prescribed routine blood work, diabetes panel, or thyroid testing at home.",
      recommendation: {
        title: "Pathology Laboratory & Free Home Sample Collection",
        summary:
          "Automated biochemistry, hematology, and tumor markers. Free sample collection at your doorstep anywhere in Coimbatore at no added charge.",
        linkUrl: "/diagnostic-center/laboratory",
        linkText: "Explore Laboratory Services",
        secondaryUrl: "/contact",
        secondaryText: "Schedule Home Collection",
      },
    },
    {
      id: "charity-aid",
      icon: <Stethoscope className="w-5 h-5 text-hospital-600" />,
      title: "Financial Aid & Charity Healthcare",
      desc: "Need subsidized healthcare assistance for underprivileged patients.",
      recommendation: {
        title: "ARDOR Care Foundation (Section 12A & 80G)",
        summary:
          "Our non-profit charity program ensuring no human being is denied medical treatment due to financial hardship.",
        linkUrl: "/charity",
        linkText: "Learn About ARDOR Care Foundation",
        secondaryUrl: "/contact",
        secondaryText: "Contact Charity Office",
      },
    },
  ];

  const activePath = carePaths.find((p) => p.id === selectedGoal);

  return (
    <div className="bg-gradient-to-br from-hospital-50/60 via-white to-slate-50 border border-hospital-100 rounded-3xl p-6 sm:p-8 shadow-soft">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-hospital-100 text-hospital-800 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>&quot;I Need Help&quot; Navigation Guide</span>
          </div>
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-navy-950">
            Find the Exact Care or Service You Need
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose your care objective below to receive verified hospital guidance. This service is informational and does not diagnose conditions.
          </p>
        </div>

        {selectedGoal && (
          <button
            onClick={() => setSelectedGoal(null)}
            className="text-xs font-semibold text-hospital-700 hover:text-hospital-900 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Choose Another Need</span>
          </button>
        )}
      </div>

      {/* Path Cards Grid */}
      {!selectedGoal ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {carePaths.map((path) => (
            <button
              key={path.id}
              onClick={() => setSelectedGoal(path.id)}
              className="text-left p-5 rounded-2xl bg-white hover:bg-hospital-50/50 border border-slate-200/80 hover:border-hospital-300 transition-all duration-200 shadow-xs hover:shadow-soft group"
            >
              <div className="w-10 h-10 rounded-xl bg-hospital-50 group-hover:bg-hospital-100 flex items-center justify-center mb-3 transition-colors">
                {path.icon}
              </div>
              <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-hospital-700 transition-colors">
                {path.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {path.desc}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-hospital-700 group-hover:translate-x-0.5 transition-transform">
                <span>View Options</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Selected Path Detail Card */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-hospital-200 shadow-card animate-in fade-in duration-200 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-hospital-50 text-hospital-700">
              {activePath?.icon}
            </div>
            <div>
              <span className="text-xs font-semibold text-hospital-600 uppercase tracking-wider">
                Recommended Service
              </span>
              <h4 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                {activePath?.recommendation.title}
              </h4>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            {activePath?.recommendation.summary}
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Link
              href={activePath?.recommendation.secondaryUrl || "#"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
            >
              <span>{activePath?.recommendation.secondaryText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href={activePath?.recommendation.linkUrl || "#"}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-hospital-50 hover:bg-hospital-100 text-hospital-800 border border-hospital-200 text-xs sm:text-sm font-medium transition-all"
            >
              <span>{activePath?.recommendation.linkText}</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Need direct assistance? Call our reception at 0422-2111000.</span>
          </div>
        </div>
      )}
    </div>
  );
};
