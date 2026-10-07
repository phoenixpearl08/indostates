"use client";

import React, { useState, useEffect } from "react";
import {
  Globe,
  Save,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface WebsiteViewProps {
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function WebsiteView({ onSetFeedback }: WebsiteViewProps) {
  const [content, setContent] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "contact">("hero");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWebsiteContent();
  }, []);

  const fetchWebsiteContent = async () => {
    try {
      const res = await fetch("/api/admin/website");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setContent(data.content);
        }
      }
    } catch {
      onSetFeedback({ type: "error", message: "Failed to fetch website CMS content." });
    }
  };

  const handleSaveSection = async (section: string, data: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/website", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        onSetFeedback({ type: "success", message: resData.message });
        setContent(resData.content);
      } else {
        onSetFeedback({ type: "error", message: resData.error || "Failed to update website content." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error updating website content." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!content) {
    return (
      <div className="py-16 text-center text-xs text-slate-500">
        Loading public website CMS content...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Public Website CMS &amp; Content Management</h2>
          <p className="text-xs text-slate-500">
            Edit homepage hero copy, emergency notice banners, institutional story, and official contact details
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("hero")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === "hero"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          Homepage Hero &amp; Banners
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === "about"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          About, Mission &amp; Vision
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === "contact"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          Official Contact &amp; Hours
        </button>
      </div>

      {/* Hero Tab */}
      {activeTab === "hero" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveSection("hero", content.hero);
          }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-xs text-slate-800">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Homepage Hero Banner &amp; Tagline</span>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Top Badge Label</label>
            <input
              type="text"
              value={content.hero?.badge || ""}
              onChange={(e) =>
                setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Main Headline *</label>
            <input
              type="text"
              required
              value={content.hero?.title || ""}
              onChange={(e) =>
                setContent({ ...content, hero: { ...content.hero, title: e.target.value } })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Hero Subtitle Copy *</label>
            <textarea
              rows={3}
              required
              value={content.hero?.subtitle || ""}
              onChange={(e) =>
                setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Emergency Ribbon Banner</label>
            <input
              type="text"
              value={content.hero?.emergencyBanner || ""}
              onChange={(e) =>
                setContent({ ...content, hero: { ...content.hero, emergencyBanner: e.target.value } })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
              <Save className="w-3.5 h-3.5 mr-1" />
              <span>{isSubmitting ? "Saving..." : "Save Hero Content"}</span>
            </Button>
          </div>
        </form>
      )}

      {/* About Tab */}
      {activeTab === "about" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveSection("about", content.about);
          }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-xs text-slate-800">
            <Globe className="w-4 h-4 text-hospital-700" />
            <span>Institutional Vision, Mission &amp; Story</span>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Vision Statement</label>
            <textarea
              rows={3}
              value={content.about?.vision || ""}
              onChange={(e) =>
                setContent({ ...content, about: { ...content.about, vision: e.target.value } })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Mission Statement</label>
            <textarea
              rows={3}
              value={content.about?.mission || ""}
              onChange={(e) =>
                setContent({ ...content, about: { ...content.about, mission: e.target.value } })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
              <Save className="w-3.5 h-3.5 mr-1" />
              <span>{isSubmitting ? "Saving..." : "Save About Content"}</span>
            </Button>
          </div>
        </form>
      )}

      {/* Contact Tab */}
      {activeTab === "contact" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveSection("contact", content.contact);
          }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-xs text-slate-800">
            <Phone className="w-4 h-4 text-hospital-700" />
            <span>Official Hospital Contact Channels &amp; Hours</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Emergency 24/7 Hotline</label>
              <input
                type="text"
                value={content.contact?.emergencyHotline || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, emergencyHotline: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs font-bold text-rose-700"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">General Inquiries Phone</label>
              <input
                type="text"
                value={content.contact?.generalPhone || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, generalPhone: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Official Support Email</label>
            <input
              type="email"
              value={content.contact?.email || ""}
              onChange={(e) =>
                setContent({
                  ...content,
                  contact: { ...content.contact, email: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Physical Address</label>
            <input
              type="text"
              value={content.contact?.address || ""}
              onChange={(e) =>
                setContent({
                  ...content,
                  contact: { ...content.contact, address: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
              <Save className="w-3.5 h-3.5 mr-1" />
              <span>{isSubmitting ? "Saving..." : "Save Contact Info"}</span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
