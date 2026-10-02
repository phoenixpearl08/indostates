import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, FileText, ArrowLeft, Mail } from "lucide-react";
import { HOSPITAL_INFO } from "@/data/hospitalData";

export const metadata: Metadata = {
  title: "Privacy Policy | Indo States Health",
  description:
    "Privacy policy and health data protection standards at Indo States Health, compliant with the Digital Personal Data Protection Act 2023.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <Link href="/" className="text-slate-600 hover:text-hospital-800 flex items-center gap-1.5 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span className="text-slate-400">Compliance & Trust</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Data Protection & Confidentiality
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-display mb-2">Privacy Policy</h1>
            <p className="text-xs text-slate-500">Effective Date: October 2026 • Version 2.4</p>
          </div>

          <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Institutional Commitment</h2>
              <p>
                Indo States Health (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;hospital&rdquo;) treats patient confidentiality and medical data integrity with the highest level of rigor. This policy governs how we collect, store, process, and protect personal identifying information (PII) and electronic health records (EHR) across our website and clinical facilities in compliance with India&rsquo;s Digital Personal Data Protection Act (DPDP Act 2023) and international healthcare data privacy standards.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. Information We Collect</h2>
              <p className="mb-2">We collect only necessary information required to schedule and render healthcare services:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Identity & Contact:</strong> Full name, age, gender, phone number, and email address.</li>
                <li><strong>Appointment Data:</strong> Chosen department, preferred specialist, date/time slot, and symptom category.</li>
                <li><strong>Diagnostic & Clinical Metadata:</strong> Laboratory sample IDs, imaging study modality records (MRI/CT/DEXA/Mammogram), and verified doctor consultation notes.</li>
                <li><strong>Technical Telemetry:</strong> Anonymized browser information, language preferences, and accessibility settings. We do not store sensitive payment card details on our servers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. Purpose and Legal Basis for Processing</h2>
              <p>
                Patient data is processed solely for scheduling consultations, communicating critical lab results, organizing free home blood collection, providing emergency clinical care, and issuing computerized diagnostic billing statements. We never sell, rent, or trade patient records to third-party advertisers or insurance brokers.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. AI Interaction Privacy (IndoCare AI)</h2>
              <p>
                Conversations with IndoCare AI are processed statelessly or with temporary session tokens. We do not store identifiable medical histories in AI prompt training sets. The AI engine is strictly informational and operates with strict guardrails against unauthorized data leakage.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">5. Data Security & Storage</h2>
              <p>
                Diagnostic scans and electronic reports are archived within encrypted databases (AES-256) with strict Row Level Security (RLS) policies. Role-based access ensures that only authorized medical staff directly assigned to your care have permission to review your clinical records.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">6. Your Rights</h2>
              <p>
                You retain the right to inspect your archived diagnostic records, request report copies via the patient portal, update contact details, or request account erasure where not prohibited by statutory medical record retention mandates.
              </p>
            </section>

            <section className="pt-4 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-2">7. Privacy Grievance Officer</h2>
              <p className="mb-2">
                For questions regarding patient data protection or to exercise your privacy rights:
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-semibold text-slate-900">Privacy & Data Governance Officer</div>
                <div>Indo States Health, 10/77 - D Sengodagownden Pudur, Arasur, Coimbatore - 641407</div>
                <div>Email: <a href={`mailto:${HOSPITAL_INFO.emails.support}`} className="text-hospital-700 underline">{HOSPITAL_INFO.emails.support}</a></div>
                <div>Phone: {HOSPITAL_INFO.primaryPhone}</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
