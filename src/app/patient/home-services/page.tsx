"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  PhoneCall,
  Activity,
  Heart,
  ChevronRight,
  Truck,
  AlertCircle,
  User,
  FlaskConical,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";

interface HomeServiceItem {
  id: string;
  name: string;
  category: "phlebotomy" | "nursing" | "physio" | "eldercare";
  price: number;
  duration: string;
  description: string;
  inclusions: string[];
  preparation: string;
}

const SERVICES: HomeServiceItem[] = [
  {
    id: "hs-01",
    name: "Doorstep Phlebotomy & Blood Collection",
    category: "phlebotomy",
    price: 150,
    duration: "20-30 mins",
    description: "NABL certified phlebotomist visits your residence with sterile vacuum collection tubes and cold-chain sample transport containers.",
    inclusions: ["Sterile single-use vacutainers", "Temperature-controlled cold-chain box", "Digital receipt", "Reports published in portal within 6 hrs"],
    preparation: "10-12 hours fasting if lipid profile or fasting glucose ordered.",
  },
  {
    id: "hs-02",
    name: "Post-Surgical Nursing & Wound Dressing",
    category: "nursing",
    price: 450,
    duration: "45 mins",
    description: "Registered hospital nurse performs aseptic surgical suture dressing, drain care, and vital signs assessment at home.",
    inclusions: ["Sterile gauze & antimicrobial dressing", "Wound healing progress photography", "Physician status transmission", "Vitals record (BP, Pulse, SpO2)"],
    preparation: "Keep your hospital discharge summary and prescribed dressing lotions accessible.",
  },
  {
    id: "hs-03",
    name: "Neuro & Ortho Home Physiotherapy",
    category: "physio",
    price: 600,
    duration: "60 mins",
    description: "Certified senior physiotherapist provides bedside stroke rehabilitation, joint mobilization, or spine posture retraining.",
    inclusions: ["Targeted muscle re-education", "Passive/active range of motion exercises", "Gait & balance retraining", "Weekly recovery chart"],
    preparation: "Wear comfortable, loose workout attire and clear a 6x6 ft floor space.",
  },
  {
    id: "hs-04",
    name: "Elderly Comprehensive Vital Care Visit",
    category: "eldercare",
    price: 350,
    duration: "40 mins",
    description: "Dedicated geriatric care nurse checks ECG (portable 12-lead), capillary blood glucose, SpO2, and medication reconciliation.",
    inclusions: ["12-Lead Portable ECG", "Random Blood Glucose (RBG)", "Blood Pressure monitoring", "Medicine organizer review"],
    preparation: "Keep previous prescription slips and pill boxes ready for verification.",
  },
];

export default function PatientHomeServicesPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedService, setSelectedService] = useState<HomeServiceItem | null>(null);
  
  // Booking Form State
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("07:00 AM - 08:00 AM");
  const [contactPhone, setContactPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const s = HospitalStore.getSession();
    setSession(s);
    setAddress("12/4 Gandhipuram 4th Cross, Coimbatore - 641012");
    setContactPhone(s?.phone || "+91 94432 11223");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  const handleBookService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !address || !bookingDate) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const orderRef = `IND-HMS-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsSubmitting(false);
      setBookingSuccess(orderRef);
      setSelectedService(null);
    }, 700);
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-400/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-3">
              <Home className="w-3.5 h-3.5" /> Hospital at Home
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Doorstep Home Healthcare</h1>
            <p className="text-indigo-100/90 text-sm mt-1 max-w-2xl leading-relaxed">
              Hospital-grade clinical care brought safely to your doorstep. Schedule professional blood sample collection, wound dressing, elderly nursing, or rehabilitation in Coimbatore &amp; surrounding districts.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+914224000108"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs transition-all shadow-lg active:scale-95"
            >
              <PhoneCall className="w-4 h-4" /> Home Care Hotline
            </a>
          </div>
        </div>
      </div>

      {/* Booking Alert */}
      {bookingSuccess && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-sm">Home Service Visit Confirmed!</div>
              <div className="text-xs text-emerald-700 mt-0.5">
                Reference ID: <strong className="font-mono">{bookingSuccess}</strong> • Assigned care coordinator will call 30 mins prior to arrival with staff verification details.
              </div>
            </div>
          </div>
          <button
            onClick={() => setBookingSuccess(null)}
            className="px-3.5 py-1.5 rounded-xl border border-emerald-300 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SERVICES.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    {s.category === "phlebotomy" && <FlaskConical className="w-6 h-6" />}
                    {s.category === "nursing" && <ShieldCheck className="w-6 h-6" />}
                    {s.category === "physio" && <Activity className="w-6 h-6" />}
                    {s.category === "eldercare" && <Heart className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{s.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <Clock className="w-3.5 h-3.5" /> {s.duration}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl font-black text-slate-900 font-mono block">
                    ₹{s.price}
                  </span>
                  <span className="text-[10px] text-slate-600 font-medium">Visiting Fee</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {s.description}
              </p>

              {/* Inclusions */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                <span className="text-[11px] font-bold text-slate-900 block">Service Inclusions:</span>
                {s.inclusions.map((inc, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-600 font-medium truncate max-w-[200px]">
                {s.preparation}
              </span>
              <button
                onClick={() => setSelectedService(s)}
                className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shrink-0 shadow-sm"
              >
                Book Home Visit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                  Home Visit Request
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedService.name}</h3>
                <span className="text-base font-extrabold font-mono text-indigo-900">
                  ₹{selectedService.price} <span className="text-xs font-normal text-slate-500">(Payable on visit)</span>
                </span>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookService} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Residence Address *</label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Door No, Street Name, Area, City, Pincode"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nearby Landmark</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Women's Polytech Junction"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Visit Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Window *</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="06:30 AM - 07:30 AM">06:30 AM - 07:30 AM (Fasting)</option>
                    <option value="07:30 AM - 08:30 AM">07:30 AM - 08:30 AM</option>
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Schedule Home Visit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
