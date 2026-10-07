"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Paperclip,
  Check,
  CheckCheck,
  AlertCircle,
  HelpCircle,
  UserCheck,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";

interface CareMessage {
  id: string;
  sender: "patient" | "doctor" | "care_team";
  doctorName?: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export default function PatientMessagesPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [activeDoctor, setActiveDoctor] = useState("Dr. Rajesh Rangaswamy");
  const [messages, setMessages] = useState<CareMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [inquiryCategory, setInquiryCategory] = useState("Follow-up Clarification");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const s = HospitalStore.getSession();
    setSession(s);

    const initialThreads: CareMessage[] = [
      {
        id: "msg-1",
        sender: "doctor",
        doctorName: "Dr. Rajesh Rangaswamy (Neurology)",
        text: "Mr. Murugan, I have reviewed your carotid Doppler ultrasound report. Arterial flow velocities are within acceptable limits. Please continue the Atorvastatin 20mg at bedtime as advised.",
        timestamp: "Yesterday, 4:30 PM",
        isRead: true,
      },
      {
        id: "msg-2",
        sender: "patient",
        text: "Thank you doctor. Should I repeat the fasting lipid profile in 4 weeks or 8 weeks?",
        timestamp: "Yesterday, 5:15 PM",
        isRead: true,
      },
      {
        id: "msg-3",
        sender: "doctor",
        doctorName: "Dr. Rajesh Rangaswamy (Neurology)",
        text: "Repeat the lipid profile at 6 weeks. If you experience any persistent muscular ache or weakness, report it immediately to the OPD coordinator.",
        timestamp: "Today, 10:15 AM",
        isRead: true,
      },
    ];
    setMessages(initialThreads);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const userMsg: CareMessage = {
      id: `msg-${Date.now()}`,
      sender: "patient",
      text: newMessage.trim(),
      timestamp: "Just now",
      isRead: false,
    };

    setMessages((prev) => [...prev, userMsg]);
    setNewMessage("");

    setTimeout(() => {
      setIsSending(false);
      // Simulate doctor team response
      const reply: CareMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "care_team",
        doctorName: "Neuro OPD Care Team",
        text: "Your message has been queued for Dr. Rajesh Rangaswamy's clinical review. Routine inquiries are addressed during non-OPD hours (between 2:00 PM - 4:00 PM).",
        timestamp: "Just now",
        isRead: true,
      };
      setMessages((prev) => [...prev, reply]);
    }, 800);
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-blue-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/20 border border-teal-400/30 text-teal-200 text-xs font-semibold mb-3">
              <MessageSquare className="w-3.5 h-3.5" /> Care Team Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Secure Doctor Communication</h1>
            <p className="text-teal-100/90 text-sm mt-1 max-w-2xl leading-relaxed">
              Communicate non-emergent medication queries, report interpretations, and post-consultation advice directly with your primary attending physician and clinical nursing team.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs shrink-0">
            <ShieldCheck className="w-4 h-4 text-teal-300" />
            <span>Encrypted HIPAA/DISHA Compliant</span>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          This communication channel is strictly for non-urgent post-consultation follow-up questions. For acute symptoms, chest pain, or emergencies, call the 24/7 hotline at <strong>+91 422 4000108</strong>.
        </span>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Thread Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{activeDoctor}</h2>
              <span className="text-[11px] text-teal-700 font-semibold block">Attending Consultant • Neurovascular Sciences</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
            Active Encounter Thread
          </span>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "patient" ? "items-end" : "items-start"}`}
            >
              {m.sender !== "patient" && (
                <span className="text-[10px] font-bold text-slate-600 mb-1 pl-1">
                  {m.doctorName}
                </span>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                  m.sender === "patient"
                    ? "bg-slate-900 text-white rounded-tr-none"
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
                <div
                  className={`flex items-center justify-end gap-1 text-[10px] mt-2 ${
                    m.sender === "patient" ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {m.sender === "patient" && <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Box */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-600">Query Category:</span>
            {["Medication Clarification", "Report Explanation", "General Advice"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setInquiryCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                  inquiryCategory === cat
                    ? "bg-teal-100 text-teal-800 border border-teal-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Type your query to ${activeDoctor}...`}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
