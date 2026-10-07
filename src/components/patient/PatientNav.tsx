"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  UserCheck,
  Building2,
  QrCode,
  ClipboardCheck,
  Footprints,
  Clock,
  FileText,
  FlaskConical,
  Scan,
  Pill,
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  Video,
  Users,
  Package,
  Home,
  Bell,
  Bot,
  Mic,
  Compass,
  MessageSquare,
  CalendarClock,
  Star,
  AlertTriangle,
  HelpCircle,
  User,
  Lock,
  LogOut,
  Menu,
  X,
  Search,
  ChevronRight,
  Copy,
  Check,
  PhoneCall,
  ChevronDown,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { HOSPITAL_INFO } from "@/data/hospitalData";

interface NavCategory {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const NAV_CATEGORIES: NavCategory[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Visits & Appointments",
    items: [
      { label: "My Appointments", href: "/patient/appointments", icon: Calendar },
      { label: "Find a Doctor", href: "/patient/doctors", icon: UserCheck },
      { label: "Find Department", href: "/patient/departments", icon: Building2 },
      { label: "Digital QR Pass", href: "/patient/qr-pass", icon: QrCode, badge: "Verified" },
      { label: "Pre-Check-In", href: "/patient/pre-check-in", icon: ClipboardCheck },
      { label: "Live Visit Journey", href: "/patient/visit-tracking", icon: Footprints },
      { label: "Live Queue / Token", href: "/patient/queue", icon: Clock },
    ],
  },
  {
    title: "Clinical Records",
    items: [
      { label: "Medical Records", href: "/patient/records", icon: FileText },
      { label: "Lab Reports", href: "/patient/lab-reports", icon: FlaskConical },
      { label: "Diagnostic Scans", href: "/patient/diagnostics", icon: Scan },
      { label: "Prescriptions", href: "/patient/prescriptions", icon: Pill },
      { label: "Pharmacy & Medicines", href: "/patient/pharmacy", icon: ShoppingBag },
      { label: "Teleconsultation", href: "/patient/teleconsultation", icon: Video },
      { label: "Follow-up Care", href: "/patient/follow-ups", icon: CalendarClock },
    ],
  },
  {
    title: "Finance & Care",
    items: [
      { label: "Bills & Payments", href: "/patient/billing", icon: CreditCard },
      { label: "Insurance & TPA", href: "/patient/insurance", icon: ShieldCheck },
      { label: "Family Members", href: "/patient/family", icon: Users },
      { label: "Health Packages", href: "/patient/packages", icon: Package },
      { label: "Home Healthcare", href: "/patient/home-services", icon: Home },
    ],
  },
  {
    title: "Assistance & Support",
    items: [
      { label: "IndoCare AI Assistant", href: "/patient/assistant", icon: Bot, badge: "AI" },
      { label: "Voice Assistant", href: "/patient/voice-assistant", icon: Mic },
      { label: "Hospital Navigation", href: "/patient/navigation", icon: Compass },
      { label: "Care Team Chat", href: "/patient/messages", icon: MessageSquare },
      { label: "Notifications", href: "/patient/notifications", icon: Bell },
      { label: "Patient Feedback", href: "/patient/feedback", icon: Star },
      { label: "Emergency 24/7", href: "/patient/emergency", icon: AlertTriangle },
      { label: "Help & Support", href: "/patient/support", icon: HelpCircle },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Patient Profile", href: "/patient/profile", icon: User },
      { label: "Privacy & Security", href: "/patient/security", icon: Lock },
    ],
  },
];

export const PatientNav: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [session, setSession] = useState<UserSession | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [navSearch, setNavSearch] = useState("");
  const [copiedUhid, setCopiedUhid] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const s = HospitalStore.getSession();
    if (!s) {
      window.location.href = `/login?portal=patient&redirect=${encodeURIComponent(pathname)}`;
      return;
    }
    const role = (s.role || "").toUpperCase();
    if (role === "DOCTOR" || role === "DEPARTMENT_HEAD") {
      window.location.href = "/doctor/dashboard";
      return;
    }
    if (["SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR", "OPERATIONS_MANAGER", "HR_MANAGER"].includes(role)) {
      window.location.href = "/admin/dashboard";
      return;
    }
    setSession(s);

    const handleSessionChange = () => setSession(HospitalStore.getSession());
    window.addEventListener("ish_session_change", handleSessionChange);
    return () => window.removeEventListener("ish_session_change", handleSessionChange);
  }, [pathname]);

  const handleCopyUhid = () => {
    const uhid = session?.uhid || "IND-UHID-000101";
    navigator.clipboard.writeText(uhid);
    setCopiedUhid(true);
    setTimeout(() => setCopiedUhid(false), 2000);
  };

  const handleLogout = async () => {
    await HospitalStore.logout();
    window.location.href = "/login?portal=patient";
  };

  const closeDrawer = () => {
    setIsMobileDrawerOpen(false);
    setNavSearch("");
  };

  const filteredCategories = navSearch.trim()
    ? NAV_CATEGORIES.map((cat) => ({
        ...cat,
        items: cat.items.filter((item) =>
          item.label.toLowerCase().includes(navSearch.toLowerCase())
        ),
      })).filter((cat) => cat.items.length > 0)
    : NAV_CATEGORIES;

  const currentUhid = session?.uhid || "IND-UHID-000101";
  const currentName = session?.name || "Patient Member";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. TOP GLOBAL PATIENT HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-hospital-700 via-hospital-800 to-navy-950 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
                <span className="font-heading font-black text-sm text-cyan-300">IS</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-heading font-black text-base tracking-tight text-navy-950 block leading-tight">
                  INDO STATES <span className="text-hospital-600">HEALTH</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">
                  Patient Health Gateway
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search & Quick Links */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-4">
            <Link
              href="/patient/appointments"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-hospital-700 hover:bg-hospital-50/60 transition"
            >
              Appointments
            </Link>
            <Link
              href="/patient/qr-pass"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-hospital-700 hover:bg-hospital-50/60 transition"
            >
              QR Pass
            </Link>
            <Link
              href="/patient/lab-reports"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-hospital-700 hover:bg-hospital-50/60 transition"
            >
              Lab Reports
            </Link>
            <Link
              href="/patient/assistant"
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-700 bg-cyan-50/70 hover:bg-cyan-100/70 transition flex items-center gap-1"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-600" />
              <span>IndoCare AI</span>
            </Link>
          </div>

          {/* Right Utilities: UHID, Emergency, Notification, Profile */}
          <div className="flex items-center gap-2.5">
            {/* UHID Badge */}
            <button
              type="button"
              onClick={handleCopyUhid}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-hospital-50 border border-hospital-200 text-hospital-800 text-xs font-mono font-bold hover:bg-hospital-100 transition shadow-xs"
              title="Click to copy permanent UHID"
            >
              <span>UHID: {currentUhid}</span>
              {copiedUhid ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-hospital-500" />
              )}
            </button>

            {/* Emergency Hotline Button */}
            <Link
              href="/patient/emergency"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition flex items-center gap-1.5 shrink-0"
              title="24/7 Trauma Emergency Services"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Emergency</span>
            </Link>

            {/* Notifications Bell */}
            <Link
              href="/patient/notifications"
              className="relative p-2 rounded-xl text-slate-600 hover:text-hospital-700 hover:bg-slate-100 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-600 ring-2 ring-white" />
            </Link>

            {/* Patient Profile Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-hospital-700 to-navy-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden xl:block text-left">
                  <span className="block text-xs font-bold text-slate-900 leading-none truncate max-w-[120px]">
                    {currentName}
                  </span>
                  <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                    {currentUhid}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentName}</p>
                    <p className="text-[11px] font-mono text-hospital-700">{currentUhid}</p>
                  </div>

                  <Link
                    href="/patient/profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-hospital-700 transition"
                  >
                    <User className="w-4 h-4" />
                    <span>View Profile</span>
                  </Link>

                  <Link
                    href="/patient/security"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-hospital-700 transition"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Security &amp; Password</span>
                  </Link>

                  <Link
                    href="/book-appointment"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-hospital-700 transition"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book New Appointment</span>
                  </Link>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. BODY WITH PERSISTENT DESKTOP SIDEBAR + MAIN WORKSPACE */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Desktop Sidebar (Left) */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          {/* Patient ID Card Pill */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-hospital-900 via-hospital-850 to-navy-950 text-white shadow-soft space-y-2 border border-hospital-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300">
                Hospital UHID
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-sm text-white tracking-wide">
                {currentUhid}
              </span>
              <button
                type="button"
                onClick={handleCopyUhid}
                className="text-cyan-300 hover:text-white transition p-1"
                title="Copy UHID"
              >
                {copiedUhid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[11px] text-hospital-200">
              <span className="truncate">{currentName}</span>
              <span className="text-[10px] text-emerald-300 font-bold">Verified</span>
            </div>
          </div>

          {/* Sidebar Nav Categories */}
          <nav className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin">
            {NAV_CATEGORIES.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {cat.title}
                </span>
                {cat.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition group ${
                        isActive
                          ? "bg-hospital-700 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-cyan-300" : "text-slate-400 group-hover:text-hospital-600"}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-cyan-50 text-cyan-700 border border-cyan-200"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* Workspace Content Area */}
        <main className="flex-1 min-w-0 pb-16 lg:pb-0">{children}</main>
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION DOCK (Phones & Small Tablets) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 shadow-lg">
        <div className="grid grid-cols-5 items-center gap-1 text-center">
          <Link
            href="/patient/dashboard"
            className={`flex flex-col items-center py-1 rounded-xl text-[10px] font-bold transition ${
              pathname === "/patient/dashboard"
                ? "text-hospital-700"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>Home</span>
          </Link>

          <Link
            href="/patient/appointments"
            className={`flex flex-col items-center py-1 rounded-xl text-[10px] font-bold transition ${
              pathname === "/patient/appointments"
                ? "text-hospital-700"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Calendar className="w-5 h-5 mb-0.5" />
            <span>Visits</span>
          </Link>

          <Link
            href="/patient/qr-pass"
            className={`flex flex-col items-center py-1 rounded-xl text-[10px] font-bold transition ${
              pathname === "/patient/qr-pass"
                ? "text-cyan-700"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <div className="w-7 h-7 rounded-xl bg-hospital-700 text-white flex items-center justify-center -mt-2 shadow-md">
              <QrCode className="w-4 h-4" />
            </div>
            <span>QR Pass</span>
          </Link>

          <Link
            href="/patient/queue"
            className={`flex flex-col items-center py-1 rounded-xl text-[10px] font-bold transition ${
              pathname === "/patient/queue"
                ? "text-hospital-700"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Clock className="w-5 h-5 mb-0.5" />
            <span>Queue</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex flex-col items-center py-1 rounded-xl text-[10px] font-bold text-slate-500 hover:text-slate-800"
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* 4. MOBILE SLIDE-OVER NAVIGATION DRAWER */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-start">
          <div className="w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white font-bold flex items-center justify-center text-xs">
                  IS
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Patient Portal Menu</h3>
                  <p className="text-[10px] text-cyan-300 font-mono">UHID: {currentUhid}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Search Filter */}
            <div className="p-3 border-b border-slate-100 bg-slate-50">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Quick find page..."
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none bg-white"
                />
              </div>
            </div>

            {/* Drawer Links List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {filteredCategories.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {cat.title}
                  </span>
                  {cat.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeDrawer}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                          isActive
                            ? "bg-hospital-700 text-white"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? "text-cyan-300" : "text-slate-400"}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-cyan-100 text-cyan-800">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Drawer Footer with Logout */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
              <Link
                href="/book-appointment"
                onClick={closeDrawer}
                className="w-full py-2.5 rounded-xl bg-hospital-700 text-white font-bold text-xs text-center block hover:bg-hospital-800 transition"
              >
                + Book New Appointment
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2 rounded-xl text-rose-600 font-bold text-xs hover:bg-rose-50 transition flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
