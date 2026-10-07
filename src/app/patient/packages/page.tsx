"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Heart,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  Info,
  Check,
  ChevronRight,
  Users,
  AlertCircle,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { HEALTH_PACKAGES, HealthPackage } from "@/data/hospitalData";
import { HMSService } from "@/lib/hmsService";

export default function PatientPackagesPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [packages, setPackages] = useState<HealthPackage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPackage, setSelectedPackage] = useState<HealthPackage | null>(null);
  
  // Booking modal state
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSlot, setBookingSlot] = useState("08:00 AM");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setSession(HospitalStore.getSession());
    setPackages(HospitalStore.getAllPackages());

    // Default booking date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  const categories = [
    { id: "all", label: "All Health Packages" },
    { id: "Cardiac", label: "Cardiac & Heart" },
    { id: "Diabetic", label: "Diabetic & Metabolic" },
    { id: "Executive", label: "Master & Executive" },
    { id: "Women", label: "Women's Wellness" },
    { id: "Senior", label: "Senior Citizens" },
  ];

  const filteredPackages = packages.filter((pkg) => {
    const allTests = pkg.testsIncluded?.flatMap((t) => t.items) || [];
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      allTests.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" ||
      pkg.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      pkg.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleBookPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !bookingDate) return;

    setIsBooking(true);
    setTimeout(() => {
      const user = session || {
        id: "usr-patient",
        name: "Patient",
        email: "patient@indostates.com",
        phone: "+91 94432 11223",
        role: "PATIENT" as const,
        uhid: "IND-UHID-000101",
      };

      const uhid = user.uhid || "IND-UHID-000101";

      const appt = HMSService.createAppointment({
        patientUhid: uhid,
        patientName: user.name,
        patientPhone: user.phone || "+91 94432 11223",
        patientEmail: user.email,
        patientAge: 45,
        patientGender: "Male",
        serviceType: "package",
        targetId: selectedPackage.id,
        targetName: selectedPackage.name,
        departmentId: "preventive-health",
        departmentName: "Preventive & Executive Health Pavillion",
        appointmentDate: bookingDate,
        timeSlot: bookingSlot,
        paymentStatus: "pay_on_arrival",
        notes: `Preventive Health Package Booking: ${selectedPackage.name}. Fasting required: ${selectedPackage.fastingRequired ? "Yes (10-12 hrs)" : "No"}.`,
      });

      // Save to client store for sync
      HospitalStore.saveAppointment({
        id: appt.appointmentId,
        referenceCode: appt.referenceCode,
        patientName: user.name,
        patientPhone: user.phone || "+91 94432 11223",
        patientEmail: user.email,
        patientAge: 45,
        patientGender: "Male",
        serviceType: "package",
        targetId: selectedPackage.id,
        targetName: selectedPackage.name,
        doctorName: "Preventive Care Team",
        date: bookingDate,
        timeSlot: bookingSlot,
        status: "confirmed",
        paymentStatus: "pay_on_arrival",
        createdAt: new Date().toISOString(),
      });

      setIsBooking(false);
      setBookingSuccess(appt.appointmentId);
      setSelectedPackage(null);
    }, 700);
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-3">
              <Package className="w-3.5 h-3.5" /> Preventive Healthcare Marketplace
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Executive Health Packages</h1>
            <p className="text-emerald-100/90 text-sm mt-1 max-w-2xl leading-relaxed">
              Comprehensive full-body health screenings and disease-prevention checkups designed by IndoStates senior clinical specialists. Includes priority pathology, radiology, and doctor review.
            </p>
          </div>
          <Link
            href="/patient/appointments"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm transition-all shadow-lg active:scale-95 shrink-0"
          >
            <Calendar className="w-4 h-4" /> My Scheduled Screenings
          </Link>
        </div>
      </div>

      {/* Booking Success Alert */}
      {bookingSuccess && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-sm">Health Package Booked Successfully!</div>
              <div className="text-xs text-emerald-700 mt-0.5">
                Reference: <strong className="font-mono">{bookingSuccess}</strong> • Your Digital QR Pass has been issued for express check-in at the Wellness Pavillion.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/patient/qr-pass"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
            >
              View QR Pass
            </Link>
            <button
              onClick={() => setBookingSuccess(null)}
              className="px-3 py-2 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search test (e.g. ECG, HbA1c, Cardiac)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            <div>
              {/* Card Header */}
              <div className="p-6 pb-4 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-transparent">
                <div className="flex items-start justify-between gap-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                    {pkg.category} Package
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900 font-mono block">
                      ₹{pkg.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-slate-600 font-medium line-through">
                      ₹{Math.round(pkg.originalPrice || pkg.price * 1.35).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2.5 group-hover:text-emerald-700 transition-colors">
                  {pkg.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-600">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-600" /> {pkg.turnaroundTime}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Info className="w-3.5 h-3.5 text-slate-600" />
                    {pkg.fastingRequired ? `${pkg.fastingHours || 10} hrs Fasting` : "No Fasting"}
                  </span>
                </div>
              </div>

              {/* Inclusions */}
              <div className="p-6 pt-4 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">
                  Included Diagnostic Parameters:
                </span>
                <div className="space-y-1.5">
                  {(pkg.testsIncluded?.flatMap((t) => t.items) || []).slice(0, 5).map((t: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{t}</span>
                    </div>
                  ))}
                  {(pkg.testsIncluded?.flatMap((t) => t.items) || []).length > 5 && (
                    <div className="text-[11px] font-semibold text-emerald-700 pl-5 pt-0.5">
                      + {(pkg.testsIncluded?.flatMap((t) => t.items) || []).length - 5} more diagnostic parameters
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-6 pt-0">
              <button
                onClick={() => setSelectedPackage(pkg)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Select &amp; Schedule Package</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Schedule Health Screening
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedPackage.name}</h3>
                <span className="text-base font-extrabold font-mono text-emerald-800">
                  ₹{selectedPackage.price.toLocaleString("en-IN")}
                </span>
              </div>
              <button
                onClick={() => setSelectedPackage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookPackage} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Screening Date *</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Arrival Time Slot *</label>
                <select
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="07:30 AM">07:30 AM (Early Fasting Window)</option>
                  <option value="08:00 AM">08:00 AM (Recommended)</option>
                  <option value="08:30 AM">08:30 AM</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="09:30 AM">09:30 AM</option>
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" /> Fasting &amp; Pre-checkup Instructions:
                </div>
                <p className="text-[11px] leading-relaxed">
                  {selectedPackage.fastingRequired
                    ? "Requires 10-12 hours of overnight water-only fasting for accurate lipid profile and fasting blood glucose evaluation. Please report to Wellness Reception Counter 12."
                    : "No strict fasting required. You may have light breakfast 2 hours before arrival."}
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPackage(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBooking}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md disabled:opacity-50"
                >
                  {isBooking ? "Confirming Booking..." : "Confirm & Issue Pass"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
