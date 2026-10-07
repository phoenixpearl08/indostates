"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Phone,
  Mail,
  Search,
  Calendar,
  Menu,
  X,
  ChevronDown,
  User,
  HeartHandshake,
  Clock,
  MapPin,
  Sparkles,
  Stethoscope,
  Building2,
  LogOut,
  ShieldCheck,
  FileText,
  FlaskConical,
  Pill,
  Users,
  Settings,
  Activity,
} from "lucide-react";
import { HOSPITAL_INFO } from "@/data/hospitalData";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { TRANSLATIONS, Language } from "@/data/translations";
import { HospitalStore, UserSession } from "@/lib/store";

export const Header: React.FC<{ onOpenSearch?: () => void }> = ({ onOpenSearch }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [lang, setLang] = useState<Language>("en");
  const [session, setSession] = useState<UserSession | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setLang(HospitalStore.getLanguage());
    setSession(HospitalStore.getSession());

    const handleLangChange = () => setLang(HospitalStore.getLanguage());
    const handleSessionChange = () => setSession(HospitalStore.getSession());

    window.addEventListener("ish_language_change", handleLangChange);
    window.addEventListener("ish_session_change", handleSessionChange);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("ish_language_change", handleLangChange);
      window.removeEventListener("ish_session_change", handleSessionChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const activeLang = isMounted ? lang : "en";
  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;
  const activeSession = isMounted ? session : null;

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleLogout = async () => {
    await HospitalStore.logout();
    setSession(null);
    closeMenu();
    window.location.href = "/login";
  };

  const userRole = (activeSession?.role || "").toUpperCase();
  const isPatient = userRole === "PATIENT" || userRole === "ATTENDER" || userRole === "ATTENDER_CAREGIVER";
  const isDoctor = userRole === "DOCTOR" || userRole === "DEPARTMENT_HEAD";
  const isAdmin = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR", "OPERATIONS_MANAGER", "HR_MANAGER", "FINANCE_MANAGER"].includes(userRole);

  return (
    <header className="w-full sticky top-0 z-40 bg-white transition-shadow duration-200 shadow-sm">
      {/* 1. TOP UTILITY RIBBON */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-5 xl:gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-hospital-400" />
              <span>{HOSPITAL_INFO.hours.weekdays}</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-hospital-400" />
              <span>Arasur, Coimbatore - 641407</span>
            </span>
            <a
              href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
              className="flex items-center gap-1 text-rose-400 font-bold hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>24/7 Hotline: 0422-2111000</span>
            </a>
          </div>

          <div className="flex items-center gap-3.5 xl:gap-4">
            <Link
              href="/charity"
              className="hidden xl:flex items-center gap-1 hover:text-hospital-300 transition-colors"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
              <span>ARDOR Foundation (80G)</span>
            </Link>

            <span className="hidden xl:inline text-slate-700">|</span>

            {/* Role-Aware Authenticated Session Ribbon */}
            {activeSession ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-white font-medium">
                  {isDoctor ? (
                    <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                  ) : isAdmin ? (
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span className="text-slate-200">
                    {activeSession.name}
                    {activeSession.uhid ? ` (${activeSession.uhid})` : ""}
                  </span>
                </span>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors font-medium ml-2"
                  title="Sign out of hospital session"
                >
                  <LogOut className="w-3 h-3" />
                  <span>{t.nav.logout}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login?portal=patient"
                  className="flex items-center gap-1 hover:text-white transition-colors text-slate-300"
                >
                  <User className="w-3.5 h-3.5 text-hospital-400" />
                  <span>{t.nav.patientPortal}</span>
                </Link>
                <Link
                  href="/staff/login"
                  className="hover:text-white transition-colors text-slate-400"
                >
                  {t.nav.doctorPortal}
                </Link>
                <Link
                  href="/staff/login"
                  className="hover:text-white transition-colors text-slate-400"
                >
                  {t.nav.adminPortal}
                </Link>
              </div>
            )}

            <span className="text-slate-700">|</span>

            {/* Language Switcher */}
            <LanguageSelector compact />
          </div>
        </div>
      </div>

      {/* 2. ROLE-SPECIFIC CONSOLE BAR (Visible ONLY when logged in) */}
      {activeSession && (
        <div className={`text-xs border-b py-2 px-4 sm:px-6 lg:px-8 ${
          isDoctor
            ? "bg-cyan-50/70 border-cyan-200 text-cyan-950"
            : isAdmin
            ? "bg-amber-50/70 border-amber-200 text-amber-950"
            : "bg-emerald-50/70 border-emerald-200 text-emerald-950"
        }`}>
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                isDoctor
                  ? "bg-cyan-600 text-white"
                  : isAdmin
                  ? "bg-amber-600 text-white"
                  : "bg-emerald-600 text-white"
              }`}>
                {isDoctor ? "Doctor Session" : isAdmin ? "Admin Console" : "Patient Portal"}
              </span>
              <span className="font-semibold text-slate-800">
                {activeSession.name}
              </span>
            </div>

            {/* Role-Specific Navigation Links */}
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto text-[11px] font-bold">
              {isPatient && (
                <>
                  <Link
                    href="/patient/dashboard"
                    className="hover:text-emerald-700 transition-colors flex items-center gap-1"
                  >
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/book-appointment"
                    className="hover:text-emerald-700 transition-colors flex items-center gap-1"
                  >
                    <span>{t.nav.bookAppointment}</span>
                  </Link>
                  <Link
                    href="/patient/dashboard?tab=upcoming"
                    className="hover:text-emerald-700 transition-colors"
                  >
                    Appointments
                  </Link>
                  <Link
                    href="/patient/dashboard?tab=prescriptions"
                    className="hover:text-emerald-700 transition-colors"
                  >
                    Prescriptions
                  </Link>
                  <Link
                    href="/patient/dashboard?tab=reports"
                    className="hover:text-emerald-700 transition-colors"
                  >
                    Lab Reports
                  </Link>
                  <Link
                    href="/patient/dashboard?tab=timeline"
                    className="hover:text-emerald-700 transition-colors"
                  >
                    Timeline
                  </Link>
                  <Link
                    href="/patient/dashboard?tab=family"
                    className="hover:text-emerald-700 transition-colors"
                  >
                    Family
                  </Link>
                  <Link
                    href="/patient/dashboard?tab=profile"
                    className="hover:text-emerald-700 transition-colors"
                  >
                    Profile
                  </Link>
                </>
              )}

              {isDoctor && (
                <Link
                  href="/doctor/dashboard"
                  className="hover:text-cyan-800 transition-colors font-bold flex items-center gap-1.5"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Open Doctor OPD Console</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="hover:text-amber-800 transition-colors font-bold flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Open Admin Center</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN PUBLIC WEBSITE NAVIGATION BAR */}
      <div className={`w-full transition-all duration-200 ${isScrolled ? "py-2 shadow-md" : "py-2 sm:py-2.5"}`}>
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between gap-1.5 sm:gap-3 w-full">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 group" onClick={closeMenu}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-hospital-700 to-navy-900 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform shrink-0">
              <span className="font-heading font-black text-sm sm:text-base tracking-tight text-cyan-300">IS</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 whitespace-nowrap">
                <span className="font-heading font-black text-xs sm:text-base lg:text-lg tracking-tight text-navy-950">
                  INDO STATES
                </span>
                <span className="font-heading font-extrabold text-xs sm:text-base lg:text-lg tracking-tight text-hospital-600">
                  HEALTH
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] tracking-wider uppercase text-slate-500 font-semibold -mt-0.5 hidden sm:block">
                Prevent • Screen • Treat
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-1.5 text-xs 2xl:text-[13px] font-medium text-slate-700">
            <Link
              href="/"
              className={`px-2 py-1.5 rounded-lg transition-colors ${
                pathname === "/" ? "text-hospital-700 font-semibold bg-hospital-50" : "hover:text-hospital-700 hover:bg-slate-50"
              }`}
            >
              {t.nav.home}
            </Link>

            {/* About Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("about")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors ${
                  pathname.startsWith("/about") || pathname.startsWith("/vision") || pathname.startsWith("/leadership") || pathname.startsWith("/charity") || pathname.startsWith("/career") || pathname.startsWith("/facilities")
                    ? "text-hospital-700 font-semibold bg-hospital-50"
                    : "hover:text-hospital-700 hover:bg-slate-50"
                }`}
              >
                <span>{t.nav.about}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {activeDropdown === "about" && (
                <div className="absolute top-full left-0 w-56 py-2 bg-white rounded-xl shadow-card border border-slate-200/80 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-hospital-50 hover:text-hospital-700"
                  >
                    Hospital Overview
                  </Link>
                  <Link
                    href="/vision-mission"
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-hospital-50 hover:text-hospital-700"
                  >
                    Vision, Mission & Values
                  </Link>
                  <Link
                    href="/leadership"
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-hospital-50 hover:text-hospital-700"
                  >
                    Leadership & Founders
                  </Link>
                  <Link
                    href="/facilities"
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-hospital-50 hover:text-hospital-700"
                  >
                    Facilities & Infrastructure
                  </Link>
                  <Link
                    href="/charity"
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-hospital-50 hover:text-hospital-700"
                  >
                    ARDOR Foundation (80G)
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/doctors"
              className={`px-2 py-1.5 rounded-lg transition-colors ${
                pathname.startsWith("/doctors") ? "text-hospital-700 font-semibold bg-hospital-50" : "hover:text-hospital-700 hover:bg-slate-50"
              }`}
            >
              {t.nav.doctors}
            </Link>

            <Link
              href="/departments"
              className={`px-2 py-1.5 rounded-lg transition-colors ${
                pathname.startsWith("/departments") ? "text-hospital-700 font-semibold bg-hospital-50" : "hover:text-hospital-700 hover:bg-slate-50"
              }`}
            >
              {t.nav.departments}
            </Link>

            {/* Diagnostic Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("diag")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors ${
                  pathname.startsWith("/diagnostic-center")
                    ? "text-hospital-700 font-semibold bg-hospital-50"
                    : "hover:text-hospital-700 hover:bg-slate-50"
                }`}
              >
                <span>Diagnostics</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {activeDropdown === "diag" && (
                <div className="absolute top-full left-0 w-60 py-2 bg-white rounded-xl shadow-card border border-slate-200/80 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <Link
                    href="/diagnostic-center"
                    className="block px-4 py-2 text-xs font-semibold text-hospital-700 bg-hospital-50/50"
                  >
                    Diagnostic Modalities Hub
                  </Link>
                  <Link
                    href="/diagnostic-center/mri"
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-hospital-50 hover:text-hospital-700"
                  >
                    1.5 Tesla MRI (Neuro & Spine)
                  </Link>
                  <Link
                    href="/diagnostic-center/ct"
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-hospital-50 hover:text-hospital-700"
                  >
                    128-Slice CT & Calcium Score
                  </Link>
                  <Link
                    href="/diagnostic-center/dexa"
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-hospital-50 hover:text-hospital-700"
                  >
                    DEXA Bone Density Scan
                  </Link>
                  <Link
                    href="/diagnostic-center/mammography"
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-hospital-50 hover:text-hospital-700"
                  >
                    3D Digital Mammography
                  </Link>
                  <Link
                    href="/diagnostic-center/laboratory"
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-hospital-50 hover:text-hospital-700"
                  >
                    Automated Pathology Lab
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/preventive-health"
              className={`px-2 py-1.5 rounded-lg transition-colors ${
                pathname === "/preventive-health" ? "text-hospital-700 font-semibold bg-hospital-50" : "hover:text-hospital-700 hover:bg-slate-50"
              }`}
            >
              Preventive Care
            </Link>

            <Link
              href="/health-packages"
              className={`px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === "/health-packages"
                  ? "text-hospital-700 font-semibold bg-hospital-50"
                  : "text-slate-800 font-medium hover:text-hospital-700 hover:bg-hospital-50/50"
              }`}
            >
              <span>Packages</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full border border-emerald-200">
                ₹3,500
              </span>
            </Link>

            <Link
              href="/contact"
              className={`px-2 py-1.5 rounded-lg transition-colors ${
                pathname === "/contact" ? "text-hospital-700 font-semibold bg-hospital-50" : "hover:text-hospital-700 hover:bg-slate-50"
              }`}
            >
              {t.nav.contact}
            </Link>
          </nav>

          {/* Action CTAs: Search, IndoStates Help Desk, Book Appointment */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="h-9 w-9 sm:h-10 sm:w-10 2xl:w-auto 2xl:px-3 rounded-lg sm:rounded-xl border border-slate-200 text-slate-600 hover:text-hospital-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 text-xs font-medium shadow-2xs shrink-0"
              aria-label="Open Omni Search"
              title="Search website (Cmd+K)"
            >
              <Search className="w-4 h-4 text-hospital-600 shrink-0" />
              <span className="hidden 2xl:inline">Search</span>
              <kbd className="hidden 2xl:inline text-[10px] bg-slate-100 text-slate-400 px-1 py-0.5 rounded border border-slate-200">
                ⌘K
              </kbd>
            </button>

            {/* IndoStates Help Desk Quick Link */}
            <Link
              href="/assistant"
              className="hidden lg:inline-flex items-center gap-1.5 h-10 px-2.5 2xl:px-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold hover:bg-teal-100 transition-colors shadow-2xs shrink-0"
              title="IndoStates Multilingual AI Help Desk"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>{t.nav.helpDesk}</span>
            </Link>

            {/* Primary Book Appointment Button (Visible on sm+; mobile uses bottom nav) */}
            <Link
              href="/book-appointment"
              className="hidden sm:inline-flex h-10 px-3.5 2xl:px-4 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white text-xs 2xl:text-sm font-semibold transition-all shadow-sm hover:shadow-soft active:scale-95 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{t.nav.bookAppointment}</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-lg sm:rounded-xl text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Toggle Mobile Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-full bottom-0 bg-white z-50 overflow-y-auto border-t border-slate-200 animate-in slide-in-from-top-4 duration-150 shadow-2xl max-w-full">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                Language / மொழி
              </span>
              <LanguageSelector />
            </div>

            {/* Mobile Authenticated Role Section */}
            {activeSession && (
              <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                isDoctor
                  ? "bg-cyan-50 border-cyan-200"
                  : isAdmin
                  ? "bg-amber-50 border-amber-200"
                  : "bg-emerald-50 border-emerald-200"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{activeSession.name}</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-white">
                    {activeSession.role}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 pt-1">
                  {isPatient && (
                    <>
                      <Link href="/patient/dashboard" onClick={closeMenu} className="font-semibold text-emerald-800">
                        → Open Patient Dashboard
                      </Link>
                      <Link href="/book-appointment" onClick={closeMenu} className="text-slate-600">
                        Book New Appointment
                      </Link>
                      <Link href="/patient/dashboard?tab=prescriptions" onClick={closeMenu} className="text-slate-600">
                        View Digital Prescriptions
                      </Link>
                    </>
                  )}
                  {isDoctor && (
                    <>
                      <Link href="/doctor/dashboard" onClick={closeMenu} className="font-semibold text-cyan-800">
                        → Open Doctor OPD Console
                      </Link>
                      <Link href="/doctor/dashboard?tab=queue" onClick={closeMenu} className="text-slate-600">
                        Today's OPD Queue
                      </Link>
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <Link href="/admin/dashboard" onClick={closeMenu} className="font-semibold text-amber-800">
                        → Open Hospital Admin Center
                      </Link>
                      <Link href="/admin/dashboard?tab=monitoring" onClick={closeMenu} className="text-slate-600">
                        HMS Operations Monitor
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left text-rose-600 font-bold pt-2 flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.nav.logout}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Public Links */}
            <div className="space-y-1">
              <Link
                href="/"
                onClick={closeMenu}
                className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-hospital-50 hover:text-hospital-700 rounded-lg"
              >
                {t.nav.home}
              </Link>
              <Link
                href="/about"
                onClick={closeMenu}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-hospital-50 hover:text-hospital-700 rounded-lg"
              >
                {t.nav.about} & Leadership
              </Link>
              <Link
                href="/doctors"
                onClick={closeMenu}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-hospital-50 hover:text-hospital-700 rounded-lg"
              >
                {t.nav.doctors}
              </Link>
              <Link
                href="/departments"
                onClick={closeMenu}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-hospital-50 hover:text-hospital-700 rounded-lg"
              >
                {t.nav.departments}
              </Link>
              <Link
                href="/diagnostic-center"
                onClick={closeMenu}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-hospital-50 hover:text-hospital-700 rounded-lg"
              >
                Diagnostic Center (MRI/CT)
              </Link>
              <Link
                href="/preventive-health"
                onClick={closeMenu}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-hospital-50 hover:text-hospital-700 rounded-lg"
              >
                Preventive Health
              </Link>
              <Link
                href="/health-packages"
                onClick={closeMenu}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-hospital-50 hover:text-hospital-700 rounded-lg"
              >
                Master Health Packages (₹3,500)
              </Link>
              <Link
                href="/assistant"
                onClick={closeMenu}
                className="block px-3 py-2 text-sm font-medium text-teal-700 bg-teal-50/50 rounded-lg"
              >
                {t.nav.helpDesk} (Multilingual AI)
              </Link>
              <Link
                href="/contact"
                onClick={closeMenu}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-hospital-50 hover:text-hospital-700 rounded-lg"
              >
                {t.nav.contact}
              </Link>
            </div>

            {!activeSession && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Link
                  href="/login?portal=patient"
                  onClick={closeMenu}
                  className="block w-full py-2.5 text-center text-xs font-bold text-hospital-700 bg-hospital-50 rounded-xl"
                >
                  {t.nav.patientPortal}
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/staff/login"
                    onClick={closeMenu}
                    className="block py-2 text-center text-[11px] font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                  >
                    {t.nav.doctorPortal}
                  </Link>
                  <Link
                    href="/staff/login"
                    onClick={closeMenu}
                    className="block py-2 text-center text-[11px] font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                  >
                    {t.nav.adminPortal}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
