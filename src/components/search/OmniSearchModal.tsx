"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  X,
  User,
  Building,
  Package,
  Scan,
  HelpCircle,
  ArrowRight,
  Shield,
} from "lucide-react";
import { DOCTORS, DEPARTMENTS, HEALTH_PACKAGES, DIAGNOSTIC_MODALITIES, FAQS } from "@/data/hospitalData";

export interface OmniSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OmniSearchModal: React.FC<OmniSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger handled from outside if listener is active
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search over doctors
  const doctors = q
    ? DOCTORS.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialization.toLowerCase().includes(q) ||
          d.qualifications.toLowerCase().includes(q)
      )
    : [];

  // Search over departments
  const departments = q
    ? DEPARTMENTS.filter(
        (dept) =>
          dept.name.toLowerCase().includes(q) ||
          dept.shortDescription.toLowerCase().includes(q) ||
          dept.keyServices.some((s) => s.toLowerCase().includes(q))
      )
    : [];

  // Search over health packages
  const packages = q
    ? HEALTH_PACKAGES.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.testsIncluded.some((t) => t.items.some((item) => item.toLowerCase().includes(q)))
      )
    : [];

  // Search over diagnostic modalities
  const diagnostics = q
    ? DIAGNOSTIC_MODALITIES.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.subtitle.toLowerCase().includes(q) ||
          m.procedures.some((proc) => proc.toLowerCase().includes(q))
      )
    : [];

  // Search over FAQs
  const faqs = q
    ? FAQS.filter(
        (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
      )
    : [];

  const totalResults =
    doctors.length + departments.length + packages.length + diagnostics.length + faqs.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative mx-auto max-w-2xl bg-white rounded-2xl shadow-floating border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200">
          <Search className="w-5 h-5 text-hospital-600 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search doctors, MRI, CT scans, Master Health checkup, symptoms..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-1 hover:text-slate-700 text-slate-400 mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {!q && (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-hospital-50 text-hospital-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-700">Quick Search Suggestions</h4>
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto pt-1">
                {[
                  "Master Health Checkup",
                  "Dr. Rajesh Rangaswamy",
                  "1.5 Tesla MRI",
                  "128 Slice CT Calcium Score",
                  "3D Mammogram",
                  "Emergency 0422-2111000",
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-hospital-100 text-slate-700 hover:text-hospital-800 transition-colors font-medium"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && totalResults === 0 && (
            <div className="py-10 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">No exact matches for &quot;{query}&quot;</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for broader medical terms like &apos;MRI&apos;, &apos;Checkup&apos;, &apos;Cardiac&apos;, or call our hospital desk directly at 0422-2111000.
              </p>
            </div>
          )}

          {/* Group: Doctors */}
          {doctors.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Specialist Doctors ({doctors.length})</span>
              </div>
              <div className="space-y-1.5">
                {doctors.map((d) => (
                  <Link
                    key={d.id}
                    href={`/doctors/${d.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-hospital-50 transition-colors border border-transparent hover:border-hospital-200 group"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-hospital-700">
                        {d.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {d.specialization} • {d.qualifications}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-hospital-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Group: Packages */}
          {packages.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>Health Packages ({packages.length})</span>
              </div>
              <div className="space-y-1.5">
                {packages.map((pkg) => (
                  <Link
                    key={pkg.id}
                    href="/health-packages"
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-hospital-50 transition-colors border border-transparent hover:border-hospital-200 group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-hospital-700">
                          {pkg.name}
                        </h4>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          ₹{pkg.price}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{pkg.tagline}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-hospital-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Group: Diagnostic Modalities */}
          {diagnostics.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Scan className="w-3.5 h-3.5" />
                <span>Diagnostic Services & Scans ({diagnostics.length})</span>
              </div>
              <div className="space-y-1.5">
                {diagnostics.map((m) => (
                  <Link
                    key={m.id}
                    href={`/diagnostic-center/${m.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-hospital-50 transition-colors border border-transparent hover:border-hospital-200 group"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-hospital-700">
                        {m.name} – {m.subtitle}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{m.specification}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-hospital-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Group: Departments */}
          {departments.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                <span>Departments ({departments.length})</span>
              </div>
              <div className="space-y-1.5">
                {departments.map((dept) => (
                  <Link
                    key={dept.id}
                    href={`/departments/${dept.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-hospital-50 transition-colors border border-transparent hover:border-hospital-200 group"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-hospital-700">
                        {dept.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{dept.tagline}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-hospital-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Group: FAQs */}
          {faqs.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>FAQs & Hospital Information ({faqs.length})</span>
              </div>
              <div className="space-y-1.5">
                {faqs.map((faq) => (
                  <Link
                    key={faq.id}
                    href="/faq"
                    onClick={onClose}
                    className="block p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100"
                  >
                    <h4 className="text-xs font-semibold text-slate-800 mb-1">{faq.question}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{faq.answer}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-hospital-600" />
            <span>Indo States Health Verified Directory</span>
          </span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
