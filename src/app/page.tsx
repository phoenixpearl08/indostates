import React from "react";
import Link from "next/link";
import {
  Calendar,
  User,
  ShieldCheck,
  PhoneCall,
  Activity,
  ArrowRight,
  CheckCircle,
  Scan,
  Brain,
  Heart,
  Sparkles,
  MapPin,
  Clock,
  HeartHandshake,
  Award,
  ChevronRight,
  Bot,
  Compass,
  Stethoscope,
  Microscope,
  Layers,
  Phone,
  HelpCircle,
  Building2,
  Navigation,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  HOSPITAL_INFO,
  DOCTORS,
  DEPARTMENTS,
  HEALTH_PACKAGES,
} from "@/data/hospitalData";
import { DoctorAvatar } from "@/components/ui/DoctorAvatar";

export default function HomePage() {
  const mhc = HEALTH_PACKAGES[0];
  const featuredDoctors = DOCTORS.slice(0, 4);
  const featuredDepts = DEPARTMENTS.slice(0, 4);

  return (
    <div className="w-full bg-white text-slate-800 space-y-16 sm:space-y-24 pb-20 overflow-x-clip">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO SECTION WITH FLOATING MEDICAL GRAPHICS & VERIFIED HOSPITAL IMAGERY */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-hospital-50/80 via-white to-slate-50/50 pt-8 sm:pt-14 pb-14 sm:pb-20 border-b border-slate-200/80">
        {/* Subtle Animated Background Blobs & Floating Graphics */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute top-32 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-hospital-600/10 rounded-full blur-2xl pointer-events-none animate-float-reverse" />

        {/* Floating Decorative Medical Symbols (Non-obtrusive, pointer-events: none) */}
        <div className="absolute top-20 left-8 text-hospital-300/40 font-mono text-3xl font-black select-none pointer-events-none hidden lg:block animate-float-slow">
          +
        </div>
        <div className="absolute bottom-24 right-16 text-cyan-400/30 font-mono text-4xl font-black select-none pointer-events-none hidden lg:block animate-float-reverse">
          +
        </div>
        <div className="absolute top-48 right-1/3 text-teal-400/25 font-mono text-2xl font-black select-none pointer-events-none hidden xl:block animate-float-slow">
          +
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headlines, Actions, and Aligned Statistics */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-hospital-100/90 text-hospital-800 border border-hospital-200/80 text-xs font-semibold shadow-2xs self-center lg:self-start">
                <Sparkles className="w-3.5 h-3.5 text-hospital-600 shrink-0" />
                <span>US &amp; Indian Dual Board-Certified Clinical Leadership</span>
              </div>

              {/* Main Heading with Balanced Line Wrap */}
              <h1 className="font-heading font-black text-2xl sm:text-4xl lg:text-[42px] xl:text-[46px] tracking-tight text-navy-950 leading-[1.18] max-w-2xl mx-auto lg:mx-0 break-words">
                State-of-the-Art Healthcare to the People of India.
              </h1>

              {/* Sub-headline */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Pioneering comprehensive neurovascular stroke interventions, high-precision 1.5 Tesla MRI, 128-slice low-dose CT scans, and proactive preventive screening in Arasur, Coimbatore.
              </p>

              {/* Action Buttons: Unified Heights, Consistent Borders, Balanced Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-1 w-full">
                <Link
                  href="/book-appointment"
                  className="w-full lg:w-auto h-11 px-5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs sm:text-sm shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2 shrink-0"
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Book Appointment</span>
                </Link>

                <Link
                  href="/doctors"
                  className="w-full lg:w-auto h-11 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-300 shadow-2xs hover:border-hospital-300 transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
                >
                  <User className="w-4 h-4 text-hospital-600 shrink-0" />
                  <span>Find a Doctor</span>
                </Link>

                <Link
                  href="/departments"
                  className="w-full lg:w-auto h-11 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-300 shadow-2xs hover:border-hospital-300 transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Specialties</span>
                  <ArrowRight className="w-3.5 h-3.5 text-hospital-600 shrink-0" />
                </Link>

                <a
                  href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
                  className="w-full lg:w-auto h-11 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs sm:text-sm transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
                >
                  <PhoneCall className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{HOSPITAL_INFO.emergencyPhone}</span>
                </a>
              </div>

              {/* Statistics Grid: Fully Aligned to Left Content Column */}
              <div className="pt-6 border-t border-slate-200/90">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-left">
                  <div className="p-3.5 rounded-xl bg-white/95 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-hospital-300 transition-colors">
                    <span className="text-xl sm:text-2xl font-heading font-black text-hospital-800 tracking-tight">1.5T MRI</span>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 leading-snug">Neuro &amp; Spine Resolution</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/95 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-hospital-300 transition-colors">
                    <span className="text-xl sm:text-2xl font-heading font-black text-hospital-800 tracking-tight">128 Slice</span>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 leading-snug">Sub-Second Low-Dose CT</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/95 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-hospital-300 transition-colors">
                    <span className="text-xl sm:text-2xl font-heading font-black text-hospital-800 tracking-tight">₹3,500</span>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 leading-snug">Master Health Package</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/95 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-hospital-300 transition-colors">
                    <span className="text-xl sm:text-2xl font-heading font-black text-hospital-800 tracking-tight">24/7 Desk</span>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 leading-snug">Emergency &amp; Trauma</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Genuine Hospital Exterior Photograph Presentation & Floating Verified Card */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="w-full max-w-lg lg:max-w-none mx-auto space-y-3 sm:space-y-4">
                
                {/* Hospital Photo Container with Refined Frame */}
                <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-card bg-white relative group">
                  <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://indostates.com/wp-content/uploads/2025/04/Hos-01-1024x548.png"
                      alt="Indo States Health Hospital Facility, Arasur, Coimbatore"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent" />
                    
                    <div className="absolute bottom-3.5 left-4 right-4 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 block">
                        Main Medical Center
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-white drop-shadow-sm">
                        Sengodagownden Pudur, Arasur, Coimbatore
                      </p>
                    </div>
                  </div>

                  {/* Micro Quick-Action below photo */}
                  <div className="px-4 py-3 bg-white flex items-center justify-between gap-3 text-xs border-t border-slate-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <ShieldCheck className="w-4 h-4 text-hospital-600 shrink-0" />
                      <span className="font-semibold text-slate-700 truncate">Quiet, low-stress healing environment</span>
                    </div>
                    <Link
                      href="/facilities"
                      className="font-bold text-hospital-700 hover:text-hospital-900 shrink-0 text-xs flex items-center gap-1"
                    >
                      <span>Tour Suites</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Certification & Accreditation Card */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-soft flex items-center gap-3.5 transition-all hover:border-hospital-300">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-hospital-50 border border-hospital-100 text-hospital-800 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-hospital-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-xs sm:text-sm text-slate-900 block truncate">
                        American &amp; Indian Board-Certified
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        Verified
                      </span>
                    </div>
                    <span className="text-[11px] sm:text-xs text-slate-500 block truncate mt-0.5">
                      Founder Dr. Rajesh Rangaswamy, MD (USA &amp; India)
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: ABOUT INDOSTATES HEALTH (HOSPITAL INTRODUCTION & PHILOSOPHY) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-hospital-50/50 via-white to-slate-50/80 rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-100 text-hospital-800 text-xs font-bold border border-hospital-200">
                <Building2 className="w-3.5 h-3.5 text-hospital-700" />
                <span>About Indo States Health</span>
              </div>

              <h2 className="font-heading font-black text-2xl sm:text-3xl text-navy-950 tracking-tight">
                Pioneering Advanced Care on the Coimbatore Corridor
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Founded by internationally trained clinical leaders, Indo States Health was established to bridge the gap between global medical standards and community accessibility in Tamil Nadu.
              </p>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We combine non-invasive preventive screening with advanced neuro-interventional capabilities, rapid acute trauma care, and state-of-the-art diagnostic imaging — all housed in a peaceful, patient-first facility designed for dignified recovery.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-xs font-bold text-hospital-800 block">Our Clinical Mission</span>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Prevent disease early, diagnose accurately, and treat with compassionate precision.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-xs font-bold text-hospital-800 block">Philanthropic Wing</span>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Supported by ARDOR Foundation with 80G tax exemptions for rural outreach.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-hospital-700 hover:text-hospital-900 hover:underline"
                >
                  <span>Read our full hospital story &amp; leadership</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft hover:shadow-card transition-all space-y-2">
                <div className="w-10 h-10 rounded-xl bg-hospital-100 text-hospital-700 flex items-center justify-center font-bold">
                  <Brain className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Neurovascular Care</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Specialized stroke intervention team with dual US/Indian board certifications.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft hover:shadow-card transition-all space-y-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                  <Scan className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Precision Imaging</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  1.5 Tesla MRI and 128-slice sub-second low-dose CT scanner on-site.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft hover:shadow-card transition-all space-y-2">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Preventive Health</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Flagship Master Health Checkup and non-invasive cardiovascular risk screening.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft hover:shadow-card transition-all space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">24/7 Emergency</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Continuous acute trauma, stroke code, and computerized registration.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: QUICK ACTIONS GRID (6 ESSENTIAL PATHWAYS) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <Link
            href="/book-appointment"
            className="group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-hospital-400 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all text-center flex flex-col items-center justify-center space-y-2"
          >
            <div className="w-11 h-11 rounded-xl bg-hospital-50 text-hospital-700 group-hover:bg-hospital-700 group-hover:text-white flex items-center justify-center transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xs sm:text-sm text-slate-900 group-hover:text-hospital-800">
              Book Appointment
            </span>
          </Link>

          <Link
            href="/doctors"
            className="group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-hospital-400 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all text-center flex flex-col items-center justify-center space-y-2"
          >
            <div className="w-11 h-11 rounded-xl bg-hospital-50 text-hospital-700 group-hover:bg-hospital-700 group-hover:text-white flex items-center justify-center transition-colors">
              <User className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xs sm:text-sm text-slate-900 group-hover:text-hospital-800">
              Find a Doctor
            </span>
          </Link>

          <Link
            href="/departments"
            className="group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-hospital-400 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all text-center flex flex-col items-center justify-center space-y-2"
          >
            <div className="w-11 h-11 rounded-xl bg-hospital-50 text-hospital-700 group-hover:bg-hospital-700 group-hover:text-white flex items-center justify-center transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xs sm:text-sm text-slate-900 group-hover:text-hospital-800">
              Departments
            </span>
          </Link>

          <Link
            href="/assistant"
            className="group p-4 sm:p-5 rounded-2xl bg-white border border-teal-200/80 hover:border-teal-400 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all text-center flex flex-col items-center justify-center space-y-2 bg-gradient-to-b from-teal-50/40 to-white"
          >
            <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-700 group-hover:bg-teal-700 group-hover:text-white flex items-center justify-center transition-colors">
              <Bot className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xs sm:text-sm text-slate-900 group-hover:text-teal-800">
              Ask AI Assistant
            </span>
          </Link>

          <Link
            href="/facilities"
            className="group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-hospital-400 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all text-center flex flex-col items-center justify-center space-y-2"
          >
            <div className="w-11 h-11 rounded-xl bg-hospital-50 text-hospital-700 group-hover:bg-hospital-700 group-hover:text-white flex items-center justify-center transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xs sm:text-sm text-slate-900 group-hover:text-hospital-800">
              Facilities
            </span>
          </Link>

          <Link
            href="/find-us"
            className="group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-hospital-400 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all text-center flex flex-col items-center justify-center space-y-2"
          >
            <div className="w-11 h-11 rounded-xl bg-hospital-50 text-hospital-700 group-hover:bg-hospital-700 group-hover:text-white flex items-center justify-center transition-colors">
              <Navigation className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xs sm:text-sm text-slate-900 group-hover:text-hospital-800">
              Get Directions
            </span>
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: FEATURED DEPARTMENTS (FOCUSED & CLEAR) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-hospital-700 block">
              Centers of Excellence
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-navy-950 tracking-tight">
              Featured Departments &amp; Specialties
            </h2>
            <p className="text-sm text-slate-500 max-w-xl">
              Specialized clinical teams focused on preventive detection, high-resolution diagnostic imaging, and acute interventions.
            </p>
          </div>

          <Link
            href="/departments"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-hospital-700 hover:text-hospital-900"
          >
            <span>View All 8 Departments</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDepts.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-hospital-50 border border-hospital-100 flex items-center justify-center text-hospital-700">
                  {dept.iconName === "Brain" && <Brain className="w-6 h-6" />}
                  {dept.iconName === "Scan" && <Scan className="w-6 h-6" />}
                  {dept.iconName === "ShieldCheck" && <ShieldCheck className="w-6 h-6" />}
                  {dept.iconName === "Heart" && <Heart className="w-6 h-6" />}
                  {!["Brain", "Scan", "ShieldCheck", "Heart"].includes(dept.iconName) && (
                    <Stethoscope className="w-6 h-6" />
                  )}
                </div>

                <h3 className="font-heading font-bold text-lg text-slate-900 leading-snug">
                  {dept.name}
                </h3>
                
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {dept.shortDescription}
                </p>

                <div className="pt-1">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Specialist Lead:
                  </span>
                  <span className="text-xs font-bold text-hospital-800 block">
                    {dept.headDoctor}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-5">
                <Link
                  href={`/departments/${dept.slug}`}
                  className="text-xs font-bold text-hospital-700 hover:text-hospital-900 inline-flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: FEATURED DOCTORS (OFFICIAL DATA & VECTOR SVG AVATARS - NO FEES) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-hospital-700 block">
              Medical Leadership
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-navy-950 tracking-tight">
              Featured Doctors &amp; Clinical Specialists
            </h2>
            <p className="text-sm text-slate-500 max-w-xl">
              Authentic physician profiles with verified qualifications, board certifications, and direct booking availability.
            </p>
          </div>

          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-hospital-700 hover:text-hospital-900"
          >
            <span>View Full Medical Roster</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Doctor Vector SVG Avatar Display */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-hospital-50 to-slate-100 flex items-center justify-center p-4">
                  <DoctorAvatar
                    avatarUrl={doc.avatarUrl}
                    name={doc.name}
                    size="xl"
                    className="w-28 h-28 drop-shadow-md"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-1 rounded-md bg-white/95 text-[10px] font-bold text-hospital-800 shadow-xs border border-slate-200">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5 space-y-2">
                  <h3 className="font-heading font-bold text-base text-slate-900 leading-tight">
                    {doc.name}
                  </h3>
                  <span className="text-xs font-semibold text-hospital-700 block">
                    {doc.qualifications}
                  </span>
                  <p className="text-xs text-slate-500 font-medium line-clamp-2">
                    {doc.specialization}
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <Link
                  href={`/doctors/${doc.id}`}
                  className="text-xs font-semibold text-slate-700 hover:text-hospital-700"
                >
                  View Profile
                </Link>

                <Link
                  href={`/book-appointment?doctor=${doc.id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-hospital-700 hover:bg-hospital-800 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: HOSPITAL FACILITIES (VERIFIED INFRASTRUCTURE) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-hospital-700 block">
              Advanced Infrastructure
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-navy-950 tracking-tight">
              Hospital Facilities &amp; Diagnostic Suites
            </h2>
            <p className="text-sm text-slate-500 max-w-xl">
              Equipped with high-precision diagnostic and clinical modalities designed for rapid turnaround and patient comfort.
            </p>
          </div>

          <Link
            href="/facilities"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-hospital-700 hover:text-hospital-900"
          >
            <span>Explore All Facilities</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              <Scan className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
              High Resolution
            </span>
            <h3 className="font-heading font-bold text-lg text-slate-900">
              1.5 Tesla MRI Suite
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Equipped for neurovascular diffusion, non-contrast stroke evaluation, high-definition brain angiography, and comprehensive spinal imaging.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-hospital-50 text-hospital-700 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-hospital-700 bg-hospital-50 px-2 py-0.5 rounded">
              Sub-Second Speed
            </span>
            <h3 className="font-heading font-bold text-lg text-slate-900">
              128-Slice Low-Dose CT
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides coronary calcium scoring, rapid whole-body trauma imaging, and lung nodule screening with up to 80% radiation dose reduction.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Microscope className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              24/7 Operations
            </span>
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Automated Clinical Laboratory
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fully automated biochemistry, hematology, and tumor marker analyzers with free home phlebotomy collection across the Coimbatore corridor.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: HEALTH PACKAGES (FLAGSHIP MASTER HEALTH CHECKUP) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-hospital-900 via-navy-900 to-navy-950 rounded-3xl text-white p-8 sm:p-12 shadow-floating relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Featured Preventive Care Package</span>
              </div>

              <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight">
                {mhc.name} — Comprehensive Care at ₹3,500
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                25+ essential diagnostic parameters, complete lipid, liver, renal, and thyroid profiles, cancer marker screening (CA-125 / PSA), 12-lead ECG, and senior doctor consultation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Full Organ Biochemistry &amp; Blood Count</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Bone, Electrolytes &amp; Fasting Blood Sugar</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>CA-125 (Females) &amp; PSA (Males) Tumor Markers</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-cyan-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Complimentary Home Sample Collection in Coimbatore</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center gap-3">
              <div className="text-center lg:text-right bg-white/10 p-6 rounded-2xl border border-white/15 w-full sm:w-auto">
                <span className="text-xs text-slate-300 uppercase tracking-widest block font-medium">
                  Verified Price
                </span>
                <span className="font-heading font-black text-4xl text-white">₹3,500</span>
                <span className="text-xs text-slate-400 block line-through mt-0.5">₹6,500 standard cost</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link
                  href="/book-appointment?package=master-health-checkup"
                  className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-navy-950 font-bold text-sm text-center shadow-md transition-all"
                >
                  Book Package Now
                </Link>
                <Link
                  href="/health-packages"
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm text-center border border-white/20 transition-all"
                >
                  View Packages
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: HEALTH KNOWLEDGE & CLINICAL EDUCATION CENTRE */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-hospital-700 block">
              Patient Education
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-navy-950 tracking-tight">
              Health Knowledge &amp; Preventive Guides
            </h2>
            <p className="text-sm text-slate-500 max-w-xl">
              Doctor-reviewed medical insights to recognize clinical warning signs early and preserve lasting health.
            </p>
          </div>

          <Link
            href="/preventive-health"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-hospital-700 hover:text-hospital-900"
          >
            <span>Explore All Guides</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">
              Emergency Protocol
            </span>
            <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">
              Recognizing Stroke Symptoms: The F.A.S.T. Rule
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Face drooping, Arm weakness, Speech difficulty, Time to call 0422-2111000. Every second counts in saving brain tissue.
            </p>
            <Link href="/departments/neurovascular-stroke" className="text-xs font-bold text-hospital-700 hover:underline block pt-2">
              Learn stroke protocols →
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-hospital-50 text-hospital-700 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-hospital-700 bg-hospital-50 px-2 py-0.5 rounded">
              Cardiology
            </span>
            <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">
              Coronary Calcium Scoring: Early Heart Screening
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              How low-dose 128-slice CT detects silent arterial calcification years before symptoms occur.
            </p>
            <Link href="/diagnostic-center/ct" className="text-xs font-bold text-hospital-700 hover:underline block pt-2">
              Explore CT cardiology scans →
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              Women&apos;s Health
            </span>
            <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">
              Annual 3D Mammography &amp; DEXA Bone Density
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Comprehensive guidelines for osteoporosis prevention and early breast cancer screening.
            </p>
            <Link href="/diagnostic-center/mammography" className="text-xs font-bold text-hospital-700 hover:underline block pt-2">
              View women&apos;s diagnostics →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: PATIENT SUPPORT (SERVICES & ASSISTANCE) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-hospital-100 text-hospital-800 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-hospital-700" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Fast Appointment Booking
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Self-schedule doctor visits or diagnostic slots in under two minutes with instant digital pass issuance.
              </p>
              <Link href="/book-appointment" className="text-xs font-bold text-hospital-700 hover:underline inline-block pt-1">
                Book now →
              </Link>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-hospital-100 text-hospital-800 flex items-center justify-center">
                <User className="w-5 h-5 text-hospital-700" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Patient Portal Access
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                View your upcoming appointments, reschedule visits, and download lab test reports with secure login.
              </p>
              <Link href="/portal/patient" className="text-xs font-bold text-hospital-700 hover:underline inline-block pt-1">
                Access portal →
              </Link>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <Bot className="w-5 h-5 text-teal-700" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                IndoCare AI Assistant
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ask questions in English, Tamil, or Hindi about doctors, schedules, packages, and emergency protocols.
              </p>
              <Link href="/assistant" className="text-xs font-bold text-teal-700 hover:underline inline-block pt-1">
                Launch assistant →
              </Link>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center">
                <PhoneCall className="w-5 h-5 text-red-700" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                24/7 Hospital Helpline
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Immediate response for acute stroke triage, trauma transport, and patient care guidance.
              </p>
              <a href={`tel:${HOSPITAL_INFO.emergencyPhone}`} className="text-xs font-bold text-red-700 hover:underline inline-block pt-1">
                Call {HOSPITAL_INFO.emergencyPhone} →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 10: LOCATION & INTERACTIVE GOOGLE MAPS */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-100 text-hospital-800 text-xs font-bold border border-hospital-200">
                <MapPin className="w-3.5 h-3.5" />
                <span>Hospital Location &amp; Contact</span>
              </div>

              <h2 className="font-heading font-black text-2xl sm:text-3xl text-navy-950">
                Convenient Highway Access in Coimbatore
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Indo States Health is situated in Arasur, Coimbatore on the Salem-Kochi Highway corridor (NH 544), minutes from Coimbatore International Airport.
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-hospital-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Address:</strong> {HOSPITAL_INFO.address} (Near A2B / NH544).
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-hospital-600 shrink-0" />
                  <span>
                    <strong>Emergency Hotline:</strong> {HOSPITAL_INFO.emergencyPhone}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-hospital-600 shrink-0" />
                  <span>
                    <strong>Hours:</strong> Mon–Fri 9:00 AM – 5:00 PM | Sat–Sun 10:00 AM – 6:00 PM
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/find-us"
                  className="px-5 py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
                >
                  Get Directions
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-xs sm:text-sm shadow-xs transition-all"
                >
                  Contact Desk
                </Link>
              </div>
            </div>

            {/* Right: Map Embed */}
            <div className="lg:col-span-7">
              <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-soft">
                <iframe
                  loading="lazy"
                  src="https://maps.google.com/maps?q=10%2F77%2C%20D%20Sengodagowndenpudur%2C%20Arasur%2C%20Tamil%20Nadu%20641407&t=m&z=14&output=embed&iwloc=near"
                  title="Indo States Health Location Map"
                  aria-label="Indo States Health Google Map"
                  className="w-full h-full border-0"
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
