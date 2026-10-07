"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  Heart,
  MessageSquare,
  ShieldCheck,
  Send,
  AlertCircle,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";

export default function PatientFeedbackPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Rating states (1 - 5)
  const [overallRating, setOverallRating] = useState(5);
  const [doctorRating, setDoctorRating] = useState(5);
  const [nurseRating, setNurseRating] = useState(5);
  const [waitTimeRating, setWaitTimeRating] = useState(4);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);

  const [visitType, setVisitType] = useState("OPD Specialist Consultation");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setSession(HospitalStore.getSession());
  }, []);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const ticketId = `FBK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setIsSubmitting(false);
      setSubmitSuccess(ticketId);
      setFeedbackText("");
    }, 700);
  };

  const renderStars = (currentVal: number, setVal: (v: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setVal(star)}
            className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none transition-colors"
          >
            <Star
              className={`w-6 h-6 ${
                star <= currentVal
                  ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                  : "text-slate-300"
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-bold text-slate-700 ml-2 font-mono">{currentVal} / 5</span>
      </div>
    );
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-200 text-xs font-semibold mb-3">
          <Star className="w-3.5 h-3.5" /> Patient Experience &amp; Quality
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Patient Experience &amp; Feedback</h1>
        <p className="text-amber-100/90 text-xs sm:text-sm mt-1 max-w-xl mx-auto leading-relaxed">
          Your feedback directly drives IndoStates clinical governance, wait-time reductions, and patient care improvements.
        </p>
      </div>

      {submitSuccess && (
        <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 shadow-sm space-y-3 animate-fadeIn text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold">Thank You For Your Feedback!</h3>
          <p className="text-xs text-emerald-800 max-w-md mx-auto">
            Your evaluation has been logged under Quality Tracking ID: <strong className="font-mono">{submitSuccess}</strong>. Our Patient Relations Quality Committee reviews all submissions weekly.
          </p>
          <button
            onClick={() => setSubmitSuccess(null)}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-colors"
          >
            Submit Another Feedback
          </button>
        </div>
      )}

      {/* Main Feedback Form */}
      {!submitSuccess && (
        <form
          onSubmit={handleSubmitFeedback}
          className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
        >
          {/* Encounter Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Service / Encounter Experienced *
            </label>
            <select
              value={visitType}
              onChange={(e) => setVisitType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="OPD Specialist Consultation">OPD Specialist Doctor Consultation</option>
              <option value="Laboratory & Blood Collection">Laboratory &amp; Diagnostic Pathology</option>
              <option value="Radiology & Scan Center">Radiology (MRI, CT, X-Ray, USG)</option>
              <option value="Emergency & Trauma Visit">24/7 Emergency &amp; Trauma Bay</option>
              <option value="Pharmacy Counter Experience">Pharmacy Counter &amp; Medicine Dispensing</option>
              <option value="Executive Health Package">Preventive Health Package Screening</option>
            </select>
          </div>

          {/* Rating Matrix */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Please Rate Your Experience:</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="text-xs font-bold text-slate-800 block">Overall Experience</span>
                {renderStars(overallRating, setOverallRating)}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="text-xs font-bold text-slate-800 block">Doctor Communication &amp; Care</span>
                {renderStars(doctorRating, setDoctorRating)}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="text-xs font-bold text-slate-800 block">Nursing Compassion &amp; Help</span>
                {renderStars(nurseRating, setNurseRating)}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="text-xs font-bold text-slate-800 block">Wait Time &amp; Queue Flow</span>
                {renderStars(waitTimeRating, setWaitTimeRating)}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 sm:col-span-2">
                <span className="text-xs font-bold text-slate-800 block">Cleanliness, Hygiene &amp; Facilities</span>
                {renderStars(cleanlinessRating, setCleanlinessRating)}
              </div>
            </div>
          </div>

          {/* Written Feedback */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Additional Comments, Praises, or Grievances
            </label>
            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tell us what went well or what we can do better for your next hospital visit..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified IndoStates Patient Submission</span>
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs transition-all shadow-md disabled:opacity-50 flex items-center gap-2 active:scale-95"
            >
              <span>{isSubmitting ? "Submitting..." : "Submit Patient Feedback"}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
