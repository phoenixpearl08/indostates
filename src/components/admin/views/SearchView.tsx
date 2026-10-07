"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  Database,
  BarChart,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SearchViewProps {
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function SearchView({ onSetFeedback }: SearchViewProps) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReindexing, setIsReindexing] = useState(false);

  useEffect(() => {
    fetchSearchAnalytics();
  }, []);

  const fetchSearchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/search");
      if (res.ok) {
        const resData = await res.json();
        if (resData.success) {
          setData(resData);
        }
      }
    } catch {
      onSetFeedback({ type: "error", message: "Failed to load search analytics." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReindex = async () => {
    setIsReindexing(true);
    try {
      const res = await fetch("/api/admin/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reindex" }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        onSetFeedback({ type: "success", message: resData.message });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Failed to reindex search catalog." });
    } finally {
      setIsReindexing(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="py-16 text-center text-xs text-slate-500">
        Loading website and portal search queries analytics...
      </div>
    );
  }

  const queries = data.queries || [];
  const topQueries = data.topQueries || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Website &amp; Clinical Search Analytics</h2>
          <p className="text-xs text-slate-500">
            Monitor patient search queries, top requested medical services, and rebuild full-text search indexes
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReindex}
          disabled={isReindexing}
          className="text-xs font-bold"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isReindexing ? "animate-spin" : ""}`} />
          <span>{isReindexing ? "Reindexing..." : "Rebuild Search Catalog"}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Queries Leaderboard */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <TrendingUp className="w-4 h-4 text-hospital-700" />
            <h3 className="font-bold text-xs text-slate-800">Most Popular Search Queries</h3>
          </div>

          <div className="space-y-2.5">
            {topQueries.map((tq: any, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-lg bg-hospital-100 text-hospital-800 font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-800">{tq.query}</span>
                </div>
                <span className="font-mono text-slate-500 font-bold text-[11px]">{tq.count} searches</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Search Stream */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden lg:col-span-2">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-800">Recent User Search Logs</h3>
            <span className="text-[11px] font-bold text-slate-500">{queries.length} Logged Queries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Search Term</th>
                  <th className="py-2.5 px-4">Target Category</th>
                  <th className="py-2.5 px-4">Matched Items</th>
                  <th className="py-2.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queries.map((q: any) => (
                  <tr key={q.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-800">{q.query}</td>
                    <td className="py-2.5 px-4 uppercase text-[10px] font-mono text-hospital-700">
                      {q.category}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{q.resultsCount} results</td>
                    <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(q.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
