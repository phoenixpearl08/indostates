"use client";

import React, { useState } from "react";
import {
  Bell,
  Send,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NotificationsViewProps {
  notifications: any[];
  onRefresh: () => void;
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function NotificationsView({ notifications, onRefresh, onSetFeedback }: NotificationsViewProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("ANNOUNCEMENT");
  const [targetAudience, setTargetAudience] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, type, targetAudience }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        setTitle("");
        setMessage("");
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to broadcast notification." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error sending notification." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-bold text-slate-800">Hospital Notification &amp; Alert Dispatch Center</h2>
        <p className="text-xs text-slate-500">
          Broadcast real-time push alerts to patients, doctors, nursing units, or specific hospital roles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Broadcast Form */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Send className="w-4 h-4 text-hospital-700" />
            <h3 className="font-bold text-xs text-slate-800">Broadcast Alert / Push Message</h3>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Message Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Critical Cath Lab Pathway Alert"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                >
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="SYSTEM">System Alert</option>
                  <option value="EMERGENCY">Emergency Notice</option>
                  <option value="APPOINTMENT">Clinical Token</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                >
                  <option value="all">All Hospital Users</option>
                  <option value="patients">Registered Patients</option>
                  <option value="doctors">Physicians &amp; Consultants</option>
                  <option value="staff">Clinical Staff Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Notification Body *</label>
              <textarea
                rows={3}
                required
                placeholder="Write message content delivered to notification trays..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
              />
            </div>

            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isSubmitting}
              className="w-full font-bold text-xs"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              <span>{isSubmitting ? "Broadcasting..." : "Dispatch Broadcast"}</span>
            </Button>
          </form>
        </div>

        {/* Delivery History Log */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden lg:col-span-2">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-800">Broadcast Delivery Log</h3>
            <span className="text-[11px] font-bold text-slate-500">{notifications.length} Sent</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
            {notifications.map((n) => (
              <div key={n.id} className="p-4 space-y-1 hover:bg-slate-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        n.type === "EMERGENCY"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-sky-50 text-sky-700 border border-sky-200"
                      }`}
                    >
                      {n.type}
                    </span>
                    <span className="font-bold text-xs text-slate-900">{n.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                <div className="text-[10px] text-slate-400 pt-1">
                  Recipient Audience: <strong className="text-slate-600 uppercase">{n.userId}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
