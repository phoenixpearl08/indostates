"use client";

import React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  HeartHandshake,
  ShieldCheck,
  ExternalLink,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { HOSPITAL_INFO } from "@/data/hospitalData";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Hospital Brand & Socials */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hospital-500 to-cyan-400 flex items-center justify-center text-navy-950 font-heading font-black text-xl">
                IS
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-lg text-white tracking-tight">
                  INDO STATES HEALTH
                </span>
                <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold">
                  Prevent • Screen • Treat
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed">
              The state-of-the-art healthcare to the people of India. Pioneering preventive wellness,
              high-field 1.5 Tesla MRI, 128-slice CT, and early disease detection founded by US & Indian dual board-certified physicians.
            </p>

            <div className="pt-2">
              <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider block mb-2.5">
                Official Channels
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={HOSPITAL_INFO.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Channel"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href={HOSPITAL_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Profile"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={HOSPITAL_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Page"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={HOSPITAL_INFO.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X Twitter"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Patient Care & Diagnostics
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/health-packages" className="hover:text-cyan-400 transition-colors flex items-center justify-between">
                  <span>Master Health Checkup</span>
                  <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-700/50">
                    ₹3,500
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/preventive-health" className="hover:text-cyan-400 transition-colors">
                  Preventive Health (10 Pillars)
                </Link>
              </li>
              <li>
                <Link href="/diagnostic-center/mri" className="hover:text-cyan-400 transition-colors">
                  1.5 Tesla MRI Services
                </Link>
              </li>
              <li>
                <Link href="/diagnostic-center/ct" className="hover:text-cyan-400 transition-colors">
                  128-Slice CT & Calcium Score
                </Link>
              </li>
              <li>
                <Link href="/diagnostic-center/dexa" className="hover:text-cyan-400 transition-colors">
                  DEXA Bone Density Scan (BMD)
                </Link>
              </li>
              <li>
                <Link href="/diagnostic-center/mammography" className="hover:text-cyan-400 transition-colors">
                  3D Digital Mammography
                </Link>
              </li>
              <li>
                <Link href="/diagnostic-center/laboratory" className="hover:text-cyan-400 transition-colors">
                  Pathology Lab & Free Home Sample
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-cyan-400 transition-colors">
                  Hospital Facilities & Tech
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-cyan-400 transition-colors">
                  Specialist Doctors Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals & Charitable Initiatives */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Portals & ARDOR Charity
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/portal/patient" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Patient Dashboard</span>
                  <span className="text-[10px] text-cyan-400 font-semibold">• Manage Passes</span>
                </Link>
              </li>
              <li>
                <Link href="/login?portal=doctor" className="hover:text-white transition-colors">
                  Doctor Login &amp; Console
                </Link>
              </li>
              <li>
                <Link href="/login?portal=admin" className="hover:text-white transition-colors">
                  Hospital Admin Login
                </Link>
              </li>
              <li>
                <a
                  href="https://indo.provalan.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1 text-slate-500 hover:text-slate-300"
                >
                  <span>Provalan EHR Portal (Legacy)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>

            <div className="pt-2 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 text-white font-semibold text-xs mb-1">
                <HeartHandshake className="w-4 h-4 text-rose-400" />
                <span>ARDOR Care Foundation</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-2">
                Non-profit charitable healthcare & educational aid. Donations tax-deductible under Section 12A & 80G in India and US 501(c)(3).
              </p>
              <Link href="/charity" className="text-xs text-cyan-400 hover:underline font-semibold">
                Explore Charity Programs →
              </Link>
            </div>
          </div>

          {/* Column 4: Contact & Emergency Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Hospital Contact & Address
            </h3>

            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {HOSPITAL_INFO.address}
                  <br />
                  <span className="text-slate-500">{HOSPITAL_INFO.landmark}</span>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`tel:${HOSPITAL_INFO.primaryPhoneRaw}`} className="text-white font-semibold hover:underline">
                  {HOSPITAL_INFO.primaryPhone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="mailto:contact@indostates.com" className="hover:text-white transition-colors">
                  {HOSPITAL_INFO.emails.contact}
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p>{HOSPITAL_INFO.hours.weekdays}</p>
                  <p>{HOSPITAL_INFO.hours.weekends}</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/50">
              <span className="text-[11px] font-bold text-red-400 uppercase tracking-wide block mb-1">
                24/7 Emergency Helpline
              </span>
              <a href="tel:04222111000" className="text-base font-extrabold text-white hover:text-red-300">
                0422-2111000
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Indo States Health. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/accessibility" className="hover:text-slate-300 transition-colors">
              Accessibility Statement
            </Link>
            <Link href="/faq" className="hover:text-slate-300 transition-colors">
              FAQ
            </Link>
            <Link href="/find-us" className="hover:text-slate-300 transition-colors">
              Directions & Campus
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
