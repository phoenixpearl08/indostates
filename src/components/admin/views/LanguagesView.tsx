"use client";

import React, { useState, useEffect } from "react";
import {
  Languages,
  CheckCircle2,
  Save,
  Search,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LanguagesViewProps {
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

function flattenTranslations(dict: Record<string, any>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  if (!dict || typeof dict !== "object") return result;

  for (const [key, value] of Object.entries(dict)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenTranslations(value, fullPath));
    } else if (typeof value === "string" || typeof value === "number") {
      result[fullPath] = String(value);
    }
  }
  return result;
}

export function LanguagesView({ onSetFeedback }: LanguagesViewProps) {
  const [data, setData] = useState<any | null>(null);
  const [selectedLang, setSelectedLang] = useState("ta");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLanguagesData();
  }, []);

  const fetchLanguagesData = async () => {
    try {
      const res = await fetch("/api/admin/languages");
      if (res.ok) {
        const resData = await res.json();
        if (resData.success) {
          setData(resData);
        }
      }
    } catch {
      onSetFeedback({ type: "error", message: "Failed to fetch multilingual configuration." });
    }
  };

  const handleSaveTranslation = async (key: string, value: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ langCode: selectedLang, key, value }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        onSetFeedback({ type: "success", message: resData.message });
      } else {
        onSetFeedback({ type: "error", message: resData.error || "Failed to save translation." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error saving translation." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!data) {
    return (
      <div className="py-16 text-center text-xs text-slate-500">
        Loading multilingual translation dictionary...
      </div>
    );
  }

  const languages = data.languages || [];
  const translations = data.translations || {};
  const currentDict = flattenTranslations(translations[selectedLang] || {});
  const enDict = flattenTranslations(translations.en || {});

  const allKeys = Object.keys(enDict).filter((k) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const keyMatch = k.toLowerCase().includes(term);
    const enValMatch = (enDict[k] || "").toLowerCase().includes(term);
    const curValMatch = (currentDict[k] || "").toLowerCase().includes(term);
    return keyMatch || enValMatch || curValMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Multilingual Management &amp; Localization</h2>
          <p className="text-xs text-slate-500">
            Audit translation key coverage across English, Tamil, Hindi, Malayalam, Telugu, and Kannada
          </p>
        </div>
      </div>

      {/* Language Coverage Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {languages.map((l: any) => (
          <div
            key={l.code}
            onClick={() => setSelectedLang(l.code)}
            className={`p-3.5 rounded-2xl border transition cursor-pointer shadow-xs ${
              selectedLang === l.code
                ? "bg-slate-900 text-white border-slate-800"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="text-[10px] font-mono font-bold uppercase">{l.code}</div>
            <div className="font-bold text-xs mt-1">{l.name}</div>
            <div className="text-[10px] font-semibold text-emerald-400 mt-0.5">
              {l.coverage} Translated
            </div>
          </div>
        ))}
      </div>

      {/* Translation Dictionary Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search translation keys or text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none bg-white"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">{allKeys.length} Keys Indexed</span>
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 border-b border-slate-200 sticky top-0">
              <tr>
                <th className="py-2.5 px-4 w-1/4">Key Identifier</th>
                <th className="py-2.5 px-4 w-1/3">English Source (Fallback)</th>
                <th className="py-2.5 px-4 w-1/3">Localized Value ({selectedLang.toUpperCase()})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allKeys.slice(0, 100).map((k) => (
                <tr key={`${selectedLang}-${k}`} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-slate-700 text-[11px]">{k}</td>
                  <td className="py-2.5 px-4 text-slate-600 text-xs font-medium">{enDict[k]}</td>
                  <td className="py-2.5 px-4">
                    <input
                      type="text"
                      key={`${selectedLang}-${k}`}
                      defaultValue={currentDict[k] || enDict[k]}
                      onBlur={(e) => handleSaveTranslation(k, e.target.value)}
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500 font-medium text-slate-900"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
