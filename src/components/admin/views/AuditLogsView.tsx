"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Eye,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AuditLogsViewProps {
  auditLogs: any[];
  onRefresh: () => void;
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function AuditLogsView({ auditLogs, onRefresh, onSetFeedback }: AuditLogsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      log.action?.toLowerCase().includes(q) ||
      log.actorName?.toLowerCase().includes(q) ||
      log.resource?.toLowerCase().includes(q) ||
      log.id?.toLowerCase().includes(q);
    const matchRole = roleFilter === "ALL" || log.actorRole === roleFilter;
    return matchSearch && matchRole;
  });

  const handleDownloadCsv = () => {
    window.open("/api/admin/audit?format=csv", "_blank");
  };

  const roles = Array.from(new Set(auditLogs.map((l) => l.actorRole))).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Immutable Administrative &amp; Clinical Audit Trail</h2>
          <p className="text-xs text-slate-500">
            Cryptographically timestamped audit log of all clinical transitions, role updates, and transactions
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadCsv}
          className="text-xs font-bold"
        >
          <Download className="w-3.5 h-3.5 mr-1 text-hospital-700" />
          <span>Export Audit Trail (CSV)</span>
        </Button>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail by action, actor, resource or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs font-semibold text-slate-700 py-1.5 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            {roles.map((r: any) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <span className="text-xs font-bold text-slate-500 px-2">{filteredLogs.length} Events</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Event ID</th>
                <th className="py-2.5 px-4">Actor &amp; Role</th>
                <th className="py-2.5 px-4">Action Performed</th>
                <th className="py-2.5 px-4">Target Resource</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-600 text-[11px]">{log.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{log.actorName}</div>
                      <div className="text-[10px] font-mono text-hospital-700 font-bold">{log.actorRole}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{log.action}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 text-[11px] truncate max-w-[180px]">
                      {log.resource}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          log.status === "success"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                        className="text-[11px] h-7 px-2"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        <span>Inspect</span>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                    No audit records match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Audit Event Details</h3>
                <span className="text-xs text-amber-400 font-mono">{selectedLog.id}</span>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Action:</span>
                  <span className="font-bold text-slate-800">{selectedLog.action}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Actor:</span>
                  <span className="font-bold text-slate-800">
                    {selectedLog.actorName} ({selectedLog.actorRole})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Resource:</span>
                  <span className="font-mono text-hospital-800">{selectedLog.resource}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="font-mono text-slate-600">{selectedLog.createdAt}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Raw Event Payload (JSON):</span>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setSelectedLog(null)}>
                  Close Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
