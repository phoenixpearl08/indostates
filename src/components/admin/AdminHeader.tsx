"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Bell,
  RefreshCw,
  LogOut,
  AlertTriangle,
  UserCheck,
  Plus,
  Shield,
  Siren,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AdminHeaderProps {
  userRole?: string;
  userName?: string;
  alerts?: { id: string; type: "warning" | "danger" | "info"; title: string; message: string; timestamp: string }[];
  onRefresh?: () => void;
  onLogout: () => void;
  onQuickAction?: (action: "add_patient" | "broadcast_alert" | "emergency") => void;
  isRefreshing?: boolean;
}

export function AdminHeader({
  userRole = "ADMIN",
  userName = "Administrator",
  alerts = [],
  onRefresh,
  onLogout,
  onQuickAction,
  isRefreshing = false,
}: AdminHeaderProps) {
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);

  return (
    <header className="bg-slate-900 text-white px-4 sm:px-6 py-3 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-[1680px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Hospital Badge & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black flex items-center justify-center shadow-md shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base leading-tight tracking-tight text-white">
                IndoStates Hospital Command Center
              </h1>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                {userRole}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Centralized Enterprise HMS Administration &amp; Clinical Governance
            </p>
          </div>
        </div>

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Refresh Action */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh Hospital Data"
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition"
              aria-label="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-amber-400" : ""}`} />
            </button>
          )}

          {/* Alerts Bell */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsMenu(!showAlertsMenu)}
              className="relative p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition"
              aria-label="System Alerts"
            >
              <Bell className="w-4 h-4" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {alerts.length}
                </span>
              )}
            </button>

            {showAlertsMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Real-time Clinical Alerts</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{alerts.length} active</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                  {alerts.length > 0 ? (
                    alerts.map((alt) => (
                      <div key={alt.id} className="py-2.5 space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span
                            className={
                              alt.type === "danger"
                                ? "text-rose-600 font-bold"
                                : alt.type === "warning"
                                ? "text-amber-600 font-bold"
                                : "text-sky-600 font-bold"
                            }
                          >
                            {alt.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{alt.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{alt.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-500">
                      All clinical systems operating within normal parameters.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Action: New Patient */}
          {onQuickAction && (
            <button
              onClick={() => onQuickAction("add_patient")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Patient</span>
            </button>
          )}

          {/* Quick Action: Emergency Bay */}
          {onQuickAction && (
            <button
              onClick={() => onQuickAction("emergency")}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold hover:bg-rose-600 hover:text-white transition"
            >
              <Siren className="w-3.5 h-3.5 text-rose-400" />
              <span>ER Trauma Bay</span>
            </button>
          )}

          {/* Profile Name Chip */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
            <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 font-bold flex items-center justify-center border border-slate-700">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-slate-200 text-xs leading-none">{userName}</span>
              <span className="text-[10px] text-slate-400">Authenticated Admin</span>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs ml-1"
          >
            <LogOut className="w-3.5 h-3.5 sm:mr-1" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
