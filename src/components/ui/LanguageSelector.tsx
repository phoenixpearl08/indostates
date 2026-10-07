"use client";

import React, { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { Language } from "@/data/translations";
import { HospitalStore } from "@/lib/store";

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [currentLang, setCurrentLang] = useState<Language>("en");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentLang(HospitalStore.getLanguage());

    const handleLangChange = () => {
      setCurrentLang(HospitalStore.getLanguage());
    };

    window.addEventListener("ish_language_change", handleLangChange);
    return () => window.removeEventListener("ish_language_change", handleLangChange);
  }, []);

  const languages: { code: Language; label: string; native: string }[] = [
    { code: "en", label: "English", native: "English" },
    { code: "ta", label: "Tamil", native: "தமிழ்" },
    { code: "hi", label: "Hindi", native: "हिंदी" },
    { code: "ml", label: "Malayalam", native: "മലയാളം" },
    { code: "te", label: "Telugu", native: "తెలుగు" },
    { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  ];

  const handleSelect = (code: Language) => {
    HospitalStore.setLanguage(code);
    setIsOpen(false);
  };

  const activeLang = isMounted ? currentLang : "en";
  const active = languages.find((l) => l.code === activeLang) || languages[0];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-xs"
      >
        <Globe className="w-3.5 h-3.5 text-hospital-600" />
        <span>{compact ? active.code.toUpperCase() : active.native}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white shadow-card border border-slate-200/80 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => handleSelect(l.code)}
                className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors flex items-center justify-between ${
                  currentLang === l.code ? "bg-hospital-50 text-hospital-700 font-semibold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{l.native}</span>
                <span className="text-[10px] text-slate-400 uppercase">{l.code}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
