"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { FAQS, FAQItem } from "@/data/hospitalData";
import { HospitalStore } from "@/lib/store";
import { HelpCircle, Search, ChevronDown, ChevronUp, Bot, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openIds, setOpenIds] = useState<string[]>(["faq-1", "faq-2"]);

  const allFaqs = useMemo(() => {
    return HospitalStore.getAllFAQs();
  }, []);

  const categories = ["All", "General", "Appointments", "Tests", "Master Checkup", "Emergency", "Insurance"];

  const filteredFaqs = useMemo(() => {
    return allFaqs.filter((faq) => {
      const matchSearch =
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === "All" || faq.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [allFaqs, searchTerm, selectedCategory]);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            Verified Patient Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-4 text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-hospital-200 max-w-2xl mx-auto leading-relaxed">
            Clear, doctor-approved answers regarding appointment booking, scan preparations, packages, and emergency protocols.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions (e.g. fasting, Master Checkup, MRI, home collection)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 text-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-slate-200"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition shadow-sm ${
                selectedCategory === cat
                  ? "bg-hospital-900 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3 mt-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                  >
                    <span className="font-bold text-slate-900 text-sm sm:text-base pr-2">
                      {faq.question}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      <div className="mb-2">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-hospital-700 bg-hospital-100/60 px-2 py-0.5 rounded">
                          {faq.category}
                        </span>
                      </div>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">No Matching Questions</h3>
              <p className="text-xs text-slate-500 mb-6">
                Try typing different keywords or ask our AI assistant directly.
              </p>
              <Link href="/assistant">
                <Button variant="primary" size="sm" leftIcon={<Bot className="w-4 h-4" />}>
                  Ask IndoStates Help Desk
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* AI Callout Banner */}
        <div className="mt-12 bg-gradient-to-r from-hospital-900 to-cyan-900 text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
              <Bot className="w-7 h-7 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">Have a specific question?</h3>
              <p className="text-xs text-hospital-200">
                Ask IndoStates Help Desk for instant answers grounded strictly in verified hospital facts.
              </p>
            </div>
          </div>
          <Link href="/assistant">
            <Button variant="secondary" size="md" className="shrink-0" leftIcon={<Sparkles className="w-4 h-4" />}>
              Open Help Desk
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
