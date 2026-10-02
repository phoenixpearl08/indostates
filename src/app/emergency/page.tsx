import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, Phone, Clock, MapPin, ShieldCheck, HeartPulse, Brain, Navigation, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HOSPITAL_INFO } from "@/data/hospitalData";

export const metadata: Metadata = {
  title: "24/7 Emergency & Acute Trauma Care | Indo States Health Coimbatore",
  description:
    "Direct 24/7 emergency hotline 0422-2111000. Code Stroke rapid protocol, acute chest pain triage, and 128-slice CT / 1.5T MRI emergency imaging on NH 544, Arasur.",
};

export default function EmergencyPage() {
  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* High-Alert Emergency Banner */}
      <section className="bg-rose-700 text-white py-14 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-800/80 border border-rose-500 text-rose-100 text-xs font-bold tracking-wide uppercase mb-4 animate-pulse">
            <AlertCircle className="w-4 h-4 text-white" />
            Direct Emergency Hotline
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-3 text-white">
            24/7 Emergency & Acute Care
          </h1>
          <p className="text-rose-100 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-medium">
            Immediate medical triage for acute chest pain, stroke symptoms, respiratory distress, and severe trauma.
          </p>

          {/* Huge Click-to-Call Button */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-3xl shadow-2xl">
            <a
              href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-2xl tracking-tight transition shadow-lg w-full sm:w-auto justify-center"
            >
              <Phone className="w-7 h-7 animate-bounce" />
              Call {HOSPITAL_INFO.emergencyPhone}
            </a>
            <span className="text-xs text-slate-500 font-semibold px-4 py-2">
              Ground Floor Emergency Bay • Salem-Kochi Highway
            </span>
          </div>
        </div>
      </section>

      {/* Emergency Protocols & Directions */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stroke Protocol */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
              <Brain className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display mb-2">Code Stroke Rapid Protocol</h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Time is brain. Every minute a stroke goes untreated, 1.9 million brain cells die. Under US board-certified neuro-interventionist Dr. Rajesh Rangaswamy, our team provides instant 1.5T MRI / 128-slice CT angiography triage.
            </p>
            <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-100 text-xs text-rose-950 font-medium mb-4">
              <strong>B.E. F.A.S.T. Warning Signs:</strong>
              <div className="mt-1 space-y-1 text-[11px] text-rose-900">
                <div>• <strong>B</strong>alance loss or sudden dizziness</div>
                <div>• <strong>E</strong>yes: Sudden vision blur or darkness</div>
                <div>• <strong>F</strong>ace drooping or asymmetric smile</div>
                <div>• <strong>A</strong>rms: Weakness or numbness on one side</div>
                <div>• <strong>S</strong>peech difficulty or slurred words</div>
                <div>• <strong>T</strong>ime: Call {HOSPITAL_INFO.emergencyPhone} immediately</div>
              </div>
            </div>
          </div>

          {/* Cardiac Protocol */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display mb-2">Code STEMI Chest Pain Triage</h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Sudden, crushing central chest pressure radiating to the jaw, neck, or left arm requires instant clinical intervention.
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-800 space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Door-to-ECG under 10 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Cardiac biomarker troponin stat testing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>128-slice CT coronary angiography on standby</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Arrival Guidance */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-display">How to Reach Our Emergency Bay</h3>
              <p className="text-xs text-slate-600">Ground floor barrier-free ramp directly off NH 544</p>
            </div>
            <Link href="/find-us">
              <Button variant="outline" size="sm" rightIcon={<Navigation className="w-3.5 h-3.5" />}>
                GPS & Driving Directions
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <MapPin className="w-5 h-5 text-hospital-700 mb-2" />
              <div className="font-bold text-slate-900 mb-1">Highway Access</div>
              <div>Located at Sengodagownden Pudur, Arasur on NH 544 Salem-Kochi Highway corridor near A2B.</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <Clock className="w-5 h-5 text-hospital-700 mb-2" />
              <div className="font-bold text-slate-900 mb-1">Airport Proximity</div>
              <div>Only 15 minutes drive from Coimbatore International Airport (CJB). Fast-track corridor.</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <ShieldCheck className="w-5 h-5 text-hospital-700 mb-2" />
              <div className="font-bold text-slate-900 mb-1">Direct Ambulance Bay</div>
              <div>Ground-floor emergency ramp with zero staircase obstacles. Stretcher access to CT/MRI suites.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
