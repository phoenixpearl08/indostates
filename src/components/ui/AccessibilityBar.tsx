"use client";

import React, { useEffect, useState } from "react";
import { Eye, Type, Pause, RotateCcw } from "lucide-react";
import { HospitalStore } from "@/lib/store";

export const AccessibilityBar: React.FC = () => {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeFont: false,
    reducedMotion: false,
  });

  useEffect(() => {
    const current = HospitalStore.getA11ySettings();
    setSettings(current);
    applyA11yClasses(current);

    const handleA11yChange = () => {
      const updated = HospitalStore.getA11ySettings();
      setSettings(updated);
      applyA11yClasses(updated);
    };

    window.addEventListener("ish_a11y_change", handleA11yChange);
    return () => window.removeEventListener("ish_a11y_change", handleA11yChange);
  }, []);

  const applyA11yClasses = (cfg: typeof settings) => {
    const root = document.documentElement;
    if (cfg.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    if (cfg.largeFont) {
      root.classList.add("text-large");
    } else {
      root.classList.remove("text-large");
    }

    if (cfg.reducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    HospitalStore.setA11ySettings(next);
  };

  const resetAll = () => {
    const def = { highContrast: false, largeFont: false, reducedMotion: false };
    setSettings(def);
    HospitalStore.setA11ySettings(def);
  };

  return (
    <div
      role="region"
      aria-label="Accessibility options"
      className="w-full bg-slate-900 text-slate-300 text-xs py-1.5 border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="hidden sm:inline font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
            Accessibility:
          </span>
          <button
            onClick={() => toggleSetting("highContrast")}
            aria-pressed={settings.highContrast}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
              settings.highContrast
                ? "bg-amber-400 text-slate-950 font-bold"
                : "hover:bg-slate-800 text-slate-300 border border-slate-700/60"
            }`}
            title="Toggle high contrast mode"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Contrast</span>
          </button>

          <button
            onClick={() => toggleSetting("largeFont")}
            aria-pressed={settings.largeFont}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
              settings.largeFont
                ? "bg-hospital-400 text-slate-950 font-bold"
                : "hover:bg-slate-800 text-slate-300 border border-slate-700/60"
            }`}
            title="Toggle larger typography"
          >
            <Type className="w-3.5 h-3.5" />
            <span>Text +</span>
          </button>

          <button
            onClick={() => toggleSetting("reducedMotion")}
            aria-pressed={settings.reducedMotion}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
              settings.reducedMotion
                ? "bg-emerald-400 text-slate-950 font-bold"
                : "hover:bg-slate-800 text-slate-300 border border-slate-700/60"
            }`}
            title="Stop dynamic animations"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>No Motion</span>
          </button>

          {(settings.highContrast || settings.largeFont || settings.reducedMotion) && (
            <button
              onClick={resetAll}
              className="text-[11px] text-slate-400 hover:text-white underline ml-1 flex items-center gap-1"
              title="Reset accessibility overrides"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-400 shrink-0">
          <span>NABH &amp; WCAG 2.2 AA Aligned</span>
          <span>•</span>
          <a href="/accessibility" className="hover:text-white underline">
            A11y Statement
          </a>
        </div>
      </div>
    </div>
  );
};
