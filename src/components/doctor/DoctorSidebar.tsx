"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  Users,
  Search,
  History,
  Calendar,
  Clock,
  CheckCircle2,
  Stethoscope,
  Pill,
  FlaskConical,
  FileText,
  CalendarClock,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type DoctorTabId =
  | "overview"
  | "queue"
  | "search"
  | "consultation-history"
  | "appointments"
  | "schedule"
  | "consultation"
  | "prescriptions"
  | "lab-orders"
  | "reports"
  | "follow-ups"
  | "notifications"
  | "profile"
  | "settings";

interface DoctorSidebarProps {
  activeTab: DoctorTabId;
  onSelectTab: (tab: DoctorTabId) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  waitingCount?: number;
  pendingReportsCount?: number;
  unreadNotifsCount?: number;
}

export interface DoctorNavItem {
  id: DoctorTabId;
  label: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

export interface DoctorNavSection {
  title: string | null;
  items: DoctorNavItem[];
}

export function DoctorSidebar({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  onLogout,
  waitingCount = 0,
  pendingReportsCount = 0,
  unreadNotifsCount = 0,
}: DoctorSidebarProps) {
  const navSections: DoctorNavSection[] = [
    {
      title: null,
      items: [
        { id: "overview" as DoctorTabId, label: "Clinical Dashboard", icon: Activity },
      ],
    },
    {
      title: "Patients",
      items: [
        {
          id: "queue" as DoctorTabId,
          label: "Today's Queue",
          icon: Users,
          badge: waitingCount > 0 ? `${waitingCount} waiting` : undefined,
          badgeColor: "bg-hospital-100 text-hospital-800",
        },
        { id: "search" as DoctorTabId, label: "Patient Search", icon: Search },
        { id: "consultation-history" as DoctorTabId, label: "Consultation History", icon: History },
      ],
    },
    {
      title: "Appointments",
      items: [
        { id: "appointments" as DoctorTabId, label: "All Appointments", icon: Calendar },
        { id: "schedule" as DoctorTabId, label: "OPD Schedule & Duty", icon: Clock },
      ],
    },
    {
      title: "Clinical Orders",
      items: [
        { id: "consultation" as DoctorTabId, label: "Consultation Workspace", icon: Stethoscope },
        { id: "prescriptions" as DoctorTabId, label: "Digital Prescriptions", icon: Pill },
        { id: "lab-orders" as DoctorTabId, label: "Diagnostic Lab Orders", icon: FlaskConical },
        {
          id: "reports" as DoctorTabId,
          label: "Verified Reports",
          icon: FileText,
          badge: pendingReportsCount > 0 ? `${pendingReportsCount}` : undefined,
          badgeColor: "bg-amber-100 text-amber-800",
        },
      ],
    },
    {
      title: "Follow-ups & Alerts",
      items: [
        { id: "follow-ups" as DoctorTabId, label: "Follow-ups Due", icon: CalendarClock },
        {
          id: "notifications" as DoctorTabId,
          label: "Clinical Notifications",
          icon: Bell,
          badge: unreadNotifsCount > 0 ? `${unreadNotifsCount}` : undefined,
          badgeColor: "bg-rose-100 text-rose-800",
        },
      ],
    },
    {
      title: "Account",
      items: [
        { id: "profile" as DoctorTabId, label: "Doctor Profile", icon: User },
        { id: "settings" as DoctorTabId, label: "Preferences & Settings", icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out shadow-sm lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-hospital-50/60 to-white">
          <Link href="/doctor/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-hospital-700 flex items-center justify-center text-white shadow-sm">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 leading-tight">INDOSTATES HEALTH</div>
              <div className="text-[11px] font-semibold text-hospital-700 uppercase tracking-wider flex items-center gap-1">
                <span>Doctor OPD Console</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Item List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {sec.title && (
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {sec.title}
                </div>
              )}
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onClose();
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group",
                      isActive
                        ? "bg-hospital-700 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight",
                          isActive ? "bg-white/20 text-white" : item.badgeColor || "bg-slate-100 text-slate-600"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer info & Logout button */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
          <div className="px-3 py-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-hospital-600 shrink-0" />
            <span className="truncate font-medium">HIPAA & NABH Clinical Workspace</span>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Sign Out Clinical Console</span>
          </button>
        </div>
      </aside>
    </>
  );
}
