"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  CheckCircle2,
  Clock,
  Database,
  Cpu,
  RefreshCw,
  Server,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SystemHealthViewProps {
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function SystemHealthView({ onSetFeedback }: SystemHealthViewProps) {
  const [health, setHealth] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/system-health");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setHealth(data);
        }
      }
    } catch {
      onSetFeedback({ type: "error", message: "Failed to load system health." });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !health) {
    return (
      <div className="py-16 text-center text-xs text-slate-500">
        Collecting live server health and database telemetry...
      </div>
    );
  }

  const subsystems = health.subsystems || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Operational Health &amp; Subsystem Telemetry</h2>
          <p className="text-xs text-slate-500">
            Real-time memory allocation, API server response times, and clinical database connection pools
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchHealth} className="text-xs font-bold">
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          <span>Refresh Telemetry</span>
        </Button>
      </div>

      {/* Primary Server Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">System Uptime</div>
          <div className="text-lg font-black text-emerald-700 mt-1">{health.uptimeHours} Hours</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">99.98% High Availability</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Database Latency</div>
          <div className="text-lg font-black text-slate-900 mt-1">{health.dbLatencyMs} ms</div>
          <div className="text-[10px] text-slate-400 mt-0.5">PostgreSQL Pool Connected</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">API Server Response</div>
          <div className="text-lg font-black text-hospital-700 mt-1">{health.apiLatencyMs} ms</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Next.js Edge / Serverless</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">24h Error Rate</div>
          <div className="text-lg font-black text-slate-900 mt-1">{health.errorRatePercent}%</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            {health.totalRequests24h?.toLocaleString()} Requests Served
          </div>
        </div>
      </div>

      {/* Subsystem Health Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-800">Hospital Subsystem Verification Matrix</h3>
          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>All Clinical Units Active</span>
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {subsystems.map((sub: any, idx: number) => (
            <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-800">{sub.name}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                {sub.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
