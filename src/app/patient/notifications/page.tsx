"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  FlaskConical,
  Pill,
  CreditCard,
  ArrowRight,
  CheckCheck,
  Filter,
  Trash2,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { HMSService } from "@/lib/hmsService";
import { NotificationRecord } from "@/types/hms";

export default function PatientNotificationsPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [filterType, setFilterType] = useState<"all" | "unread" | "appointment" | "clinical">("all");

  useEffect(() => {
    setIsMounted(true);
    const s = HospitalStore.getSession();
    setSession(s);
    refreshNotifications(s);
  }, []);

  const refreshNotifications = (user: UserSession | null) => {
    const list = HMSService.getNotifications(user?.id || "pat-seed-001", "PATIENT");
    setNotifications(list);
  };

  const handleMarkAsRead = (id: string) => {
    HMSService.markNotificationAsRead(id);
    refreshNotifications(session);
  };

  const handleMarkAllAsRead = () => {
    HMSService.markAllNotificationsAsRead(session?.id || "pat-seed-001");
    refreshNotifications(session);
  };

  const filteredList = notifications.filter((n) => {
    if (filterType === "unread") return !n.isRead;
    if (filterType === "appointment") return n.title.toLowerCase().includes("appointment");
    if (filterType === "clinical")
      return (
        n.title.toLowerCase().includes("report") ||
        n.title.toLowerCase().includes("lab") ||
        n.title.toLowerCase().includes("prescription")
      );
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!isMounted) return null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-200 text-xs font-semibold mb-3">
              <Bell className="w-3.5 h-3.5" /> Real-Time Care Alerts
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Notification Center</h1>
            <p className="text-cyan-100/90 text-sm mt-1 max-w-2xl leading-relaxed">
              Real-time updates regarding appointment confirmations, live OPD queue token calls, verified pathology reports, and pharmacy dispensing statuses.
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shrink-0 active:scale-95"
            >
              <CheckCheck className="w-4 h-4" /> Mark All as Read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setFilterType("all")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            filterType === "all" ? "border-cyan-600 text-cyan-700" : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType("unread")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            filterType === "unread" ? "border-cyan-600 text-cyan-700" : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Unread Alerts ({unreadCount})
        </button>
        <button
          onClick={() => setFilterType("appointment")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            filterType === "appointment" ? "border-cyan-600 text-cyan-700" : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Appointments
        </button>
        <button
          onClick={() => setFilterType("clinical")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            filterType === "clinical" ? "border-cyan-600 text-cyan-700" : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Reports &amp; Medications
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No notifications found</h3>
            <p className="text-xs text-slate-600 mt-1">You are all caught up with your clinical alerts.</p>
          </div>
        ) : (
          filteredList.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !n.isRead
                  ? "bg-cyan-50/40 border-cyan-200/80 shadow-xs"
                  : "bg-white border-slate-200/80 hover:bg-slate-50/80"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    n.type === "success"
                      ? "bg-emerald-100 text-emerald-700"
                      : n.type === "warning"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-cyan-100 text-cyan-700"
                  }`}
                >
                  {n.title.toLowerCase().includes("appointment") && <Calendar className="w-5 h-5" />}
                  {n.title.toLowerCase().includes("report") && <FlaskConical className="w-5 h-5" />}
                  {n.title.toLowerCase().includes("prescription") && <Pill className="w-5 h-5" />}
                  {!n.title.toLowerCase().includes("appointment") &&
                    !n.title.toLowerCase().includes("report") &&
                    !n.title.toLowerCase().includes("prescription") && <Info className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">{n.message}</p>
                  <span className="text-[11px] text-slate-600 mt-2 block">
                    {new Date(n.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                {n.linkUrl && (
                  <Link
                    href={n.linkUrl}
                    onClick={() => handleMarkAsRead(n.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="p-1.5 text-slate-400 hover:text-cyan-700 transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
