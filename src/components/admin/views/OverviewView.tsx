"use client";

import React from "react";
import {
  Users,
  Calendar,
  Stethoscope,
  Building2,
  Bed,
  Siren,
  FlaskConical,
  Pill,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";

interface OverviewViewProps {
  overviewData: any;
  onNavigateTab: (tab: any) => void;
}

export function OverviewView({ overviewData, onNavigateTab }: OverviewViewProps) {
  const stats = overviewData?.stats || {};
  const alerts = overviewData?.alerts || [];
  const recentActivity = overviewData?.recentActivity || [];
  const trends = overviewData?.trends || {};

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if any critical alert exists */}
      {alerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-800 font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{alerts[0].title}:</strong> {alerts[0].message}
            </span>
          </div>
          <button
            onClick={() => onNavigateTab("security")}
            className="text-amber-900 font-bold hover:underline shrink-0 text-xs inline-flex items-center gap-1"
          >
            <span>Investigate Alerts ({alerts.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Row 1: Executive Key Performance Indicators (6 Primary Cards) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Executive Command KPIs
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Live Database Telemetry</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <StatCard
            title="Total Patients"
            value={stats.totalPatients ?? 0}
            subtitle={stats.todayNewPatients ? `+${stats.todayNewPatients} Today` : "Real DB records"}
            variant="primary"
            icon={<Users className="w-5 h-5 text-hospital-600" />}
          />
          <StatCard
            title="Active Doctors"
            value={`${stats.activeDoctors ?? 0} / ${stats.totalDoctors ?? 0}`}
            subtitle={stats.doctorsOnLeave ? `${stats.doctorsOnLeave} on leave` : "All on duty"}
            variant="default"
            icon={<Stethoscope className="w-5 h-5 text-slate-600" />}
          />
          <StatCard
            title="Today's Bookings"
            value={stats.todayAppointments ?? 0}
            subtitle={`${stats.completedAppointments ?? 0} completed`}
            variant="success"
            icon={<Calendar className="w-5 h-5 text-emerald-600" />}
          />
          <StatCard
            title="Bed Occupancy"
            value={stats.bedOccupancyRate ?? "0%"}
            subtitle={`${stats.occupiedBeds ?? 0} of ${stats.totalBeds ?? 0} beds`}
            variant="default"
            icon={<Bed className="w-5 h-5 text-slate-600" />}
          />
          <StatCard
            title="Active ER Trauma"
            value={stats.emergencyPatients ?? 0}
            subtitle={stats.emergencyCapacity || "12 Bays"}
            variant="danger"
            icon={<Siren className="w-5 h-5 text-red-600" />}
          />
          <StatCard
            title="Today's Revenue"
            value={stats.todayRevenueFormatted || "₹ 0"}
            subtitle={stats.monthlyRevenueFormatted ? `MTD: ${stats.monthlyRevenueFormatted}` : "Collected"}
            variant="success"
            icon={<CreditCard className="w-5 h-5 text-emerald-600" />}
          />
        </div>
      </div>

      {/* Row 2: Secondary Operational Metrics (6 Micro Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => onNavigateTab("staff")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-slate-400 transition"
        >
          <div className="text-[11px] font-semibold text-slate-500">Total HMS Staff</div>
          <div className="text-lg font-black text-slate-800 mt-1">{stats.totalStaff ?? 0}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">10 Clinical Wings</div>
        </div>

        <div
          onClick={() => onNavigateTab("beds")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-slate-400 transition"
        >
          <div className="text-[11px] font-semibold text-slate-500">ICU Occupancy</div>
          <div className="text-lg font-black text-slate-800 mt-1">
            {stats.occupiedIcuBeds ?? 0} / {stats.totalIcuBeds ?? 0}
          </div>
          <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Critical Care Unit</div>
        </div>

        <div
          onClick={() => onNavigateTab("laboratory")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-slate-400 transition"
        >
          <div className="text-[11px] font-semibold text-slate-500">Pending Lab Tests</div>
          <div className="text-lg font-black text-slate-800 mt-1">{stats.pendingLabOrders ?? 0}</div>
          <div className="text-[10px] text-sky-600 font-semibold mt-0.5">
            {stats.releasedLabReports ?? 0} Released Today
          </div>
        </div>

        <div
          onClick={() => onNavigateTab("pharmacy")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-slate-400 transition"
        >
          <div className="text-[11px] font-semibold text-slate-500">Low Stock Meds</div>
          <div className="text-lg font-black text-slate-800 mt-1">{stats.lowStockMedicines ?? 0}</div>
          <div className="text-[10px] text-rose-600 font-semibold mt-0.5">Reorder Threshold</div>
        </div>

        <div
          onClick={() => onNavigateTab("billing")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-slate-400 transition"
        >
          <div className="text-[11px] font-semibold text-slate-500">Pending Receivables</div>
          <div className="text-lg font-black text-slate-800 mt-1">
            {stats.pendingReceivablesFormatted || "₹ 0"}
          </div>
          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
            {stats.pendingBillsCount ?? 0} unpaid invoices
          </div>
        </div>

        <div
          onClick={() => onNavigateTab("emergency")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-slate-400 transition"
        >
          <div className="text-[11px] font-semibold text-slate-500">Active Ambulances</div>
          <div className="text-lg font-black text-slate-800 mt-1">{stats.activeAmbulances ?? 0}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Ready for Dispatch</div>
        </div>
      </div>

      {/* Row 3: Interactive SVG Trend Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Trend Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs text-slate-800">Weekly OPD Appointment Volume</h3>
              <p className="text-[11px] text-slate-400">Consultations scheduled by weekday</p>
            </div>
            <span className="text-xs font-bold text-hospital-700 bg-hospital-50 px-2 py-0.5 rounded-md">
              7-Day Trend
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
            {(trends.appointments || []).map((t: any) => {
              const maxVal = 90;
              const heightPct = Math.round((t.count / maxVal) * 100);
              return (
                <div key={t.day} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition">
                    {t.count}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-lg h-32 flex items-end">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-gradient-to-t from-hospital-800 to-hospital-600 rounded-t-lg group-hover:from-hospital-700 group-hover:to-cyan-500 transition-all duration-300"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">{t.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Trajectory Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs text-slate-800">Daily Inpatient &amp; OPD Revenue</h3>
              <p className="text-[11px] text-slate-400">Total collections across all departments</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Revenue (INR)
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
            {(trends.revenue || []).map((r: any) => {
              const maxRev = 280000;
              const heightPct = Math.round((r.amount / maxRev) * 100);
              return (
                <div key={r.day} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[9px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition">
                    ₹{Math.round(r.amount / 1000)}k
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-lg h-32 flex items-end">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-gradient-to-t from-emerald-700 to-emerald-500 rounded-t-lg group-hover:from-emerald-600 group-hover:to-teal-400 transition-all duration-300"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">{r.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 4: Department Activity Distribution & Live Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Volume Split */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-800">Department Clinical Load</h3>
            <button
              onClick={() => onNavigateTab("departments")}
              className="text-[11px] text-hospital-700 font-bold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {(trends.departmentActivity || []).slice(0, 5).map((d: any) => (
              <div key={d.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 truncate pr-2">{d.name}</span>
                  <span className="font-mono text-slate-500 text-[11px] shrink-0">
                    {d.patientCount} patients • {d.doctorCount} docs
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, (d.patientCount / 30) * 100)}%` }}
                    className="h-full bg-hospital-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Clinical Audit Trail Stream */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-xs text-slate-800">Live Hospital Activity Stream</h3>
            </div>
            <button
              onClick={() => onNavigateTab("audit")}
              className="text-[11px] text-hospital-700 font-bold hover:underline"
            >
              Full Audit Trail
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
            {recentActivity.length > 0 ? (
              recentActivity.map((log: any) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {log.action.slice(0, 3).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 truncate">{log.action}</div>
                      <div className="text-[11px] text-slate-500 truncate">
                        By <span className="font-semibold text-slate-700">{log.actor}</span> ({log.role}) on{" "}
                        <span className="font-mono text-slate-600">{log.resource}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        log.status === "success"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {log.status}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No recent activity events recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
