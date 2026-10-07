"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FlaskConical,
  Calendar,
  AlertCircle,
  RefreshCw,
  CheckCheck,
} from "lucide-react";
import { Doctor } from "@/data/hospitalData";
import { DoctorNotificationRecord } from "@/lib/doctorService";

interface DoctorNotificationsViewProps {
  doctor: Doctor;
  onSelectNotificationAction?: (actionUrl?: string) => void;
}

export function DoctorNotificationsView({
  doctor,
  onSelectNotificationAction,
}: DoctorNotificationsViewProps) {
  const [notifications, setNotifications] = useState<DoctorNotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "unread" | "critical">("all");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/doctor/notifications");
      if (!res.ok) throw new Error("Failed to load notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err: any) {
      console.error("Notifications error:", err);
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch("/api/doctor/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_read", notificationId: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error("Failed to mark read:", e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/doctor/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read" }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error("Failed to mark all read:", e);
    }
  };

  const filtered = notifications.filter((n) => {
    if (filterType === "unread") return !n.isRead;
    if (filterType === "critical") return n.type === "critical_lab" || n.type === "emergency";
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "critical_lab":
      case "emergency":
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case "lab_report":
        return <FlaskConical className="w-4 h-4 text-sky-600" />;
      case "check_in":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "appointment":
        return <Calendar className="w-4 h-4 text-hospital-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <Bell className="w-5 h-5 text-hospital-600" />
              Doctor Clinical Notifications & Alerts
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Real-time clinical updates on patient check-ins, released lab values, and department communications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Mark All as Read</span>
            </button>

            <button
              onClick={loadNotifications}
              disabled={loading}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Refresh notifications"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-4 flex gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterType === "all"
                ? "bg-hospital-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Alerts ({notifications.length})
          </button>

          <button
            onClick={() => setFilterType("unread")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterType === "unread"
                ? "bg-hospital-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Unread ({notifications.filter((n) => !n.isRead).length})
          </button>

          <button
            onClick={() => setFilterType("critical")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterType === "critical"
                ? "bg-rose-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Critical Only
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-hospital-600 mb-2" />
            <span>Loading notifications...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No Notifications</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              You are completely caught up. All patient check-ins, lab updates, and schedule notifications are clear.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`p-4 flex items-start justify-between gap-3 hover:bg-slate-50/80 transition-colors ${
                  !n.isRead ? "bg-hospital-50/20" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      n.type === "critical_lab" || n.type === "emergency"
                        ? "bg-rose-100"
                        : n.type === "lab_report"
                        ? "bg-sky-100"
                        : n.type === "check_in"
                        ? "bg-emerald-100"
                        : "bg-slate-100"
                    }`}
                  >
                    {getIcon(n.type)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-hospital-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      <span>•</span>
                      <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-hospital-600 hover:bg-hospital-50 text-xs shrink-0 transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
