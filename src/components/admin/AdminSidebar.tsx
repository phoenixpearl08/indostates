"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  Calendar,
  Bed,
  Siren,
  FlaskConical,
  Pill,
  CreditCard,
  ShieldAlert,
  Bell,
  Megaphone,
  BarChart3,
  Globe,
  Bot,
  Shield,
  FileText,
  Languages,
  Search,
  Cpu,
  Activity,
  Settings,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

export type AdminTabId =
  | "overview"
  | "patients"
  | "doctors"
  | "staff"
  | "departments"
  | "appointments"
  | "beds"
  | "emergency"
  | "laboratory"
  | "pharmacy"
  | "billing"
  | "roles"
  | "notifications"
  | "announcements"
  | "reports"
  | "website"
  | "helpdesk"
  | "languages"
  | "search"
  | "security"
  | "audit"
  | "integrations"
  | "health"
  | "settings"
  | "profile";

interface AdminSidebarProps {
  activeTab: AdminTabId;
  onSelectTab: (tab: AdminTabId) => void;
  onLogout: () => void;
  userRole?: string;
  counts?: {
    patients?: number;
    appointments?: number;
    emergency?: number;
    lab?: number;
    pharmacy?: number;
    alerts?: number;
  };
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  onLogout,
  userRole = "ADMIN",
  counts = {},
}: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navSections = [
    {
      title: "DASHBOARD",
      items: [
        { id: "overview" as AdminTabId, label: "Executive Overview", icon: LayoutDashboard },
      ],
    },
    {
      title: "OPERATIONS",
      items: [
        { id: "patients" as AdminTabId, label: "Patients", icon: User, count: counts.patients },
        { id: "doctors" as AdminTabId, label: "Doctors", icon: Stethoscope },
        { id: "staff" as AdminTabId, label: "Staff Directory", icon: Users },
        { id: "departments" as AdminTabId, label: "Departments", icon: Building2 },
        { id: "appointments" as AdminTabId, label: "Appointments", icon: Calendar, count: counts.appointments },
        { id: "beds" as AdminTabId, label: "Admissions & Beds", icon: Bed },
        { id: "emergency" as AdminTabId, label: "Emergency & Trauma", icon: Siren, count: counts.emergency, countColor: "bg-rose-500" },
        { id: "laboratory" as AdminTabId, label: "Laboratory", icon: FlaskConical, count: counts.lab },
        { id: "pharmacy" as AdminTabId, label: "Pharmacy & Formulary", icon: Pill, count: counts.pharmacy, countColor: "bg-amber-500" },
        { id: "billing" as AdminTabId, label: "Billing & Finance", icon: CreditCard },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        { id: "roles" as AdminTabId, label: "Roles & Permissions", icon: Shield },
        { id: "notifications" as AdminTabId, label: "Notification Center", icon: Bell },
        { id: "announcements" as AdminTabId, label: "Announcements CMS", icon: Megaphone },
        { id: "reports" as AdminTabId, label: "Reports & Analytics", icon: BarChart3 },
      ],
    },
    {
      title: "WEBSITE CMS",
      items: [
        { id: "website" as AdminTabId, label: "Website Content", icon: Globe },
        { id: "search" as AdminTabId, label: "Search Management", icon: Search },
      ],
    },
    {
      title: "AI GOVERNANCE",
      items: [
        { id: "helpdesk" as AdminTabId, label: "IndoStates Help Desk", icon: Bot },
      ],
    },
    {
      title: "SYSTEM & AUDIT",
      items: [
        { id: "security" as AdminTabId, label: "Security Center", icon: ShieldAlert },
        { id: "audit" as AdminTabId, label: "Audit Logs", icon: FileText },
        { id: "languages" as AdminTabId, label: "Multilingual CMS", icon: Languages },
        { id: "integrations" as AdminTabId, label: "Integration Center", icon: Cpu },
        { id: "health" as AdminTabId, label: "System Health", icon: Activity },
        { id: "settings" as AdminTabId, label: "System Settings", icon: Settings },
      ],
    },
    {
      title: "ACCOUNT",
      items: [
        { id: "profile" as AdminTabId, label: "Admin Profile", icon: User },
      ],
    },
  ];

  const handleItemClick = (id: AdminTabId) => {
    onSelectTab(id);
    setIsMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-md">
            IS
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-tight text-white leading-tight">
              Hospital Admin
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-slate-300 font-medium">Control Center</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
        {navSections.map((sec) => (
          <div key={sec.title} className="space-y-1">
            <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase px-2.5 block">
              {sec.title}
            </span>
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    type="button"
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm font-bold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? "text-amber-400" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full text-white shrink-0 ml-1 ${
                          (item as any).countColor || (isActive ? "bg-amber-500 text-slate-950" : "bg-slate-500")
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Quick Portal Switch Links */}
        <div className="pt-2 border-t border-slate-100 space-y-1">
          <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase px-2.5 block">
            HMS CLINICAL VIEWS
          </span>
          <Link
            href="/doctor/dashboard"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-hospital-700 transition"
          >
            <div className="flex items-center gap-2">
              <Stethoscope className="w-3.5 h-3.5 text-cyan-600" />
              <span>Doctor OPD Station</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
          <Link
            href="/reception/dashboard"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-hospital-700 transition"
          >
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Reception Desk</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
          <Link
            href="/nurse/dashboard"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-hospital-700 transition"
          >
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-violet-600" />
              <span>Nursing Station</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Logout Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <button
          onClick={onLogout}
          type="button"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Admin Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          type="button"
          className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-xl hover:bg-slate-800 flex items-center gap-2 text-xs font-bold border border-slate-700"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="w-5 h-5 text-amber-400" />
          <span>Admin Menu</span>
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-slate-200 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] shadow-xs">
        {sidebarContent}
      </aside>
    </>
  );
}
