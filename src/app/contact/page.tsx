"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HOSPITAL_INFO } from "@/data/hospitalData";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    department: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            Patient Relations Desk
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-4 text-white">
            Contact Indo States Health
          </h1>
          <p className="text-base sm:text-lg text-hospital-200 max-w-2xl mx-auto leading-relaxed">
            Reach our patient service coordinators for scan scheduling, health checkup inquiries, or home sample collection.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-3">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Phone Numbers</h3>
                <p className="text-xs text-slate-500 mb-2">Primary Consultation Desk:</p>
                <a href={`tel:${HOSPITAL_INFO.primaryPhoneRaw}`} className="text-sm font-bold text-hospital-800 block hover:underline">
                  {HOSPITAL_INFO.primaryPhone}
                </a>
                <p className="text-xs text-slate-500 mt-2 mb-1">24/7 Emergency Line:</p>
                <a href={`tel:${HOSPITAL_INFO.emergencyPhone}`} className="text-sm font-bold text-rose-600 block hover:underline">
                  {HOSPITAL_INFO.emergencyPhone}
                </a>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-hospital-50 text-hospital-700 flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Official Emails</h3>
                <p className="text-xs text-slate-500 mb-1">General Inquiries:</p>
                <a href={`mailto:${HOSPITAL_INFO.emails.contact}`} className="text-xs font-semibold text-hospital-800 block hover:underline">
                  {HOSPITAL_INFO.emails.contact}
                </a>
                <p className="text-xs text-slate-500 mt-2 mb-1">Support & Foundation:</p>
                <a href={`mailto:${HOSPITAL_INFO.emails.support}`} className="text-xs font-semibold text-hospital-800 block hover:underline">
                  {HOSPITAL_INFO.emails.support}
                </a>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Hospital Location</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {HOSPITAL_INFO.address}
                </p>
                <p className="text-[11px] text-cyan-800 font-medium mt-1">
                  Landmark: {HOSPITAL_INFO.landmark}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm mb-2">Connect With Us</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  <a
                    href={HOSPITAL_INFO.socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1"
                  >
                    YouTube <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={HOSPITAL_INFO.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1"
                  >
                    Instagram <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={HOSPITAL_INFO.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1"
                  >
                    Facebook <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 font-display mb-2">Send Us an Inquiry</h2>
              <p className="text-xs text-slate-600 mb-6">
                Our patient service desk responds within 2-4 business hours. For immediate medical emergencies, please call {HOSPITAL_INFO.emergencyPhone} directly.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-emerald-950 mb-1">Message Received</h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto mb-6">
                    Thank you, {formData.name}. Our patient relationship team will contact you shortly at {formData.phone}.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Service or Topic</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500 bg-white"
                      >
                        <option>General Inquiry</option>
                        <option>Master Health Checkup (₹3,500)</option>
                        <option>1.5T MRI Scan</option>
                        <option>128-Slice CT / Calcium Score</option>
                        <option>3D Mammography</option>
                        <option>DEXA Bone Density Scan</option>
                        <option>Home Sample Collection</option>
                        <option>ARDOR Care Foundation CSR</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message or Medical Query</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share any questions, preferred dates, or doctor specialization needed..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                    />
                  </div>

                  <Button variant="primary" size="lg" type="submit" className="w-full sm:w-auto" rightIcon={<Send className="w-4 h-4" />}>
                    Submit Inquiry
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
