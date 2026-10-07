"use client";

import React, { useState } from "react";
import {
  Megaphone,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  X,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AnnouncementsViewProps {
  announcements: any[];
  onRefresh: () => void;
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function AnnouncementsView({ announcements, onRefresh, onSetFeedback }: AnnouncementsViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [targetAudience, setTargetAudience] = useState("All");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, priority, targetAudience, isPublished: true }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        setShowAddModal(false);
        setTitle("");
        setContent("");
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to create announcement." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error creating announcement." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (ann: any) => {
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ann.id, isPublished: !ann.isPublished }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: `Announcement "${ann.title}" publication status updated.` });
        onRefresh();
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error updating publication status." });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/announcements?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: "Announcement removed." });
        onRefresh();
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error deleting announcement." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Hospital Announcements &amp; Public Notices</h2>
          <p className="text-xs text-slate-500">
            Publish clinical service bulletins, accreditation notices, and community health camp schedules
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="text-xs font-bold"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>New Hospital Notice</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition"
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                    ann.priority === "High"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-hospital-50 text-hospital-700 border border-hospital-200"
                  }`}
                >
                  {ann.priority} Priority
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Audience: <strong className="text-slate-700">{ann.targetAudience}</strong>
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 mt-2.5 leading-snug">{ann.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">{ann.content}</p>

              <div className="text-[10px] text-slate-400 mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span>By {ann.createdBy || "Admin"}</span>
                <span>{new Date(ann.publishedAt || ann.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleTogglePublish(ann)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition ${
                  ann.isPublished
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {ann.isPublished ? "PUBLISHED" : "DRAFT (HIDDEN)"}
              </button>

              <button
                type="button"
                onClick={() => handleDelete(ann.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Delete Announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Create Hospital Notice</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Notice Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free Cardiac Screening Camp This Saturday"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                  >
                    <option value="Normal">Normal Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent Alert</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                  >
                    <option value="All">All Hospital Users</option>
                    <option value="Public">Public Website Visitors</option>
                    <option value="Patients">Registered Patients</option>
                    <option value="Doctors">Physicians &amp; Consultants</option>
                    <option value="Staff">Hospital Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Message Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the clinical notice or service update in full..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Publishing..." : "Publish Announcement"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
