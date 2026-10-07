"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Database,
  Key,
  MapPin,
  MessageSquare,
  Mail,
  QrCode,
  Bot,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface IntegrationsViewProps {
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function IntegrationsView({ onSetFeedback }: IntegrationsViewProps) {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/integrations");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setIntegrations(data.integrations);
        }
      }
    } catch {
      onSetFeedback({ type: "error", message: "Failed to load integrations status." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestPing = async (id: string) => {
    setTestingId(id);
    try {
      const res = await fetch("/api/admin/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ integrationId: id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        fetchIntegrations();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Integration test failed." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error pinging integration." });
    } finally {
      setTestingId(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "database":
        return Database;
      case "auth":
        return Key;
      case "maps":
        return MapPin;
      case "sms":
        return MessageSquare;
      case "email":
        return Mail;
      case "qr":
        return QrCode;
      case "ai":
        return Bot;
      case "payment":
        return CreditCard;
      default:
        return Cpu;
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center text-xs text-slate-500">
        Querying third-party API gateways and database health...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Hospital Subsystem Integrations &amp; API Gateways</h2>
          <p className="text-xs text-slate-500">
            Monitor live ping latencies, PostgreSQL connections, SMS/OTP gateways, and AI endpoints
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchIntegrations}
          className="text-xs font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          <span>Refresh Integrations</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item) => {
          const Icon = getIcon(item.type);
          const isConnected = item.status === "connected";

          return (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                      <Icon className="w-4 h-4 text-hospital-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900 leading-tight">{item.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">{item.type}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                      isConnected
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isConnected ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    {isConnected ? "CONNECTED" : "OFFLINE"}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.details}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-[11px] font-mono text-slate-500">
                  Latency: <strong className="text-slate-800">{item.latencyMs} ms</strong> •{" "}
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.lastChecked).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestPing(item.id)}
                  disabled={testingId === item.id}
                  className="text-[11px] h-7 px-2.5"
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${testingId === item.id ? "animate-spin" : ""}`} />
                  <span>{testingId === item.id ? "Testing..." : "Test Ping"}</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
