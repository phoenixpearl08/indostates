import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Info, Clock, FileText, ShieldCheck, Heart, ExternalLink, ArrowRight, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HOSPITAL_INFO } from "@/data/hospitalData";

export const metadata: Metadata = {
  title: "Patient & Visitor Information | Indo States Health",
  description:
    "Essential information for patients and visitors: appointments, fasting guidelines, visiting hours, insurance reimbursement, patient rights, and digital report access.",
};

export default function PatientInfoPage() {
  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            Patient Experience Desk
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-4 text-white">
            Patient & Visitor Information
          </h1>
          <p className="text-base sm:text-lg text-hospital-200 max-w-2xl mx-auto leading-relaxed">
            Everything you need for a comfortable, transparent, and seamless visit to Indo States Health.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-8">
        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <Clock className="w-8 h-8 text-cyan-600 mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">Hospital Hours</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {HOSPITAL_INFO.hours.weekdays}<br />
              {HOSPITAL_INFO.hours.weekends}
            </p>
            <div className="text-xs font-semibold text-rose-600">
              Emergency: 24/7 Standby
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <CreditCard className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">Transparent Billing</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              No hidden surcharges. All scans and packages are priced clearly. Computerized diagnostic receipts for insurance reimbursement.
            </p>
            <Link href="/health-packages" className="text-xs font-semibold text-hospital-700 hover:underline">
              View Fixed Package Rates &rarr;
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <FileText className="w-8 h-8 text-hospital-700 mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">Digital Lab Reports</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Reports are automatically archived to your patient portal. Also accessible via legacy EHR portal for registered patients.
            </p>
            <a
              href="https://indo.provalan.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-hospital-700 hover:underline flex items-center gap-1"
            >
              Legacy Portal Access <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* First Time Visitor Guide */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 font-display mb-4">First-Time Visitor Guide</h2>
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              <strong>1. Prior to Arrival:</strong> If your appointment includes blood work or contrast-enhanced scans (MRI/CT), ensure you adhere to fasting instructions (usually 10-12 hours for lipid/sugar tests; 4 hours for contrast imaging). Drink plain water as needed.
            </p>
            <p>
              <strong>2. What to Bring:</strong> Government Photo ID (Aadhaar / Voter ID / Passport), list of current medications with dosages, prior doctor prescriptions, and any historical imaging disks or film jackets.
            </p>
            <p>
              <strong>3. Registration Desk:</strong> Present your digital appointment pass or reference code at the main reception lobby. First-time registration takes under 3 minutes.
            </p>
            <p>
              <strong>4. Free Home Sample Collection:</strong> If you prefer to have fasting blood samples drawn at home before coming in for physician consultation, call our desk at {HOSPITAL_INFO.primaryPhone} 24 hours prior.
            </p>
          </div>
        </div>

        {/* Patient Rights & Responsibilities */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 font-display mb-4">Patient Rights & Responsibilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-2 text-hospital-800">Your Rights</h4>
              <ul className="space-y-2 list-disc pl-4">
                <li>To receive respectful, dignified, and non-discriminatory care.</li>
                <li>To obtain full explanation of your medical condition, diagnostic findings, and treatment alternatives in your preferred language (Tamil, English, or Hindi).</li>
                <li>To complete confidentiality and privacy regarding your diagnostic records.</li>
                <li>To review an itemized bill before payment.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-2 text-hospital-800">Your Responsibilities</h4>
              <ul className="space-y-2 list-disc pl-4">
                <li>To provide accurate medical history, past allergies, and current medications.</li>
                <li>To adhere strictly to pre-scan safety guidelines (e.g. removing metals before entering the MRI room).</li>
                <li>To respect the comfort and privacy of fellow patients.</li>
                <li>To arrive on time or notify our desk if you need to reschedule.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-6">
          <Link href="/book-appointment">
            <Button variant="primary" size="lg">
              Book Your Appointment Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
