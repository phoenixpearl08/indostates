"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bot,
  Send,
  Sparkles,
  User,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Building2,
  FileText,
  Clock,
  PhoneCall,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  actions?: { label: string; href: string }[];
}

export default function PatientAssistantPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const s = HospitalStore.getSession();
    setSession(s);

    const initialGreeting: ChatMessage = {
      id: "msg-0",
      sender: "assistant",
      text: `Hello ${s?.name ? s.name.split(" ")[0] : "there"}! I am **IndoCare AI**, your IndoStates Hospital navigator.\n\nI can assist you with finding specialized doctors, scheduling consultations, understanding pre-test fasting instructions, or navigating hospital departments. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      actions: [
        { label: "Book Appointment", href: "/patient/appointments" },
        { label: "Find Specialist Doctor", href: "/patient/doctors" },
        { label: "View Lab Reports", href: "/patient/lab-reports" },
      ],
    };
    setMessages([initialGreeting]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const quickQuestions = [
    "Book an appointment with Dr. Rajesh Rangaswamy",
    "What are the fasting guidelines for Lipid Profile?",
    "Where is the CT / MRI scan department located?",
    "How do I share my medical records with a family member?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsThinking(true);

    try {
      // Send to server API if available, or generate verified hospital AI response
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, userUhid: session?.uhid || "IND-UHID-000101" }),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        const aiText = data.reply || data.message || "I am here to help you navigate IndoStates Hospital.";
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            sender: "assistant",
            text: aiText,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        // Fallback intelligent hospital router
        setTimeout(() => {
          let reply = "Thank you for reaching out. IndoStates Hospital operates OPD services Monday through Saturday (8:00 AM - 8:00 PM).";
          let suggestedActions: { label: string; href: string }[] | undefined = undefined;

          const lower = q.toLowerCase();
          if (lower.includes("rajesh") || lower.includes("neuro") || lower.includes("doctor")) {
            reply = "Dr. Rajesh Rangaswamy (MBBS, MD, DM Neurology) is available for Neurovascular consultations Mon-Sat, 9:00 AM to 1:00 PM at OPD Room 204, 2nd Floor Block A.";
            suggestedActions = [
              { label: "Book Dr. Rajesh", href: "/patient/appointments?doctorId=dr-rajesh-rangaswamy" },
              { label: "All Doctors", href: "/patient/doctors" },
            ];
          } else if (lower.includes("fasting") || lower.includes("lipid") || lower.includes("blood") || lower.includes("lab")) {
            reply = "For Comprehensive Lipid Profile or Fasting Blood Glucose, 10 to 12 hours of overnight water-only fasting is required. Our Central Phlebotomy opens at 7:00 AM daily in Block B Ground Floor.";
            suggestedActions = [
              { label: "View Lab Reports", href: "/patient/lab-reports" },
              { label: "Book Home Collection", href: "/patient/home-services" },
            ];
          } else if (lower.includes("mri") || lower.includes("scan") || lower.includes("location") || lower.includes("where")) {
            reply = "The Advanced Imaging Center (1.5T MRI and 128-Slice CT) is located on the Ground Floor of Diagnostic Block C, adjacent to the Trauma Center.";
            suggestedActions = [
              { label: "Hospital Navigation", href: "/patient/navigation" },
              { label: "Diagnostic Reports", href: "/patient/diagnostics" },
            ];
          } else if (lower.includes("emergency") || lower.includes("chest pain") || lower.includes("urgent")) {
            reply = "⚠️ If you or a loved one is experiencing severe chest pain, shortness of breath, acute stroke signs, or trauma, please contact our 24/7 Emergency Center immediately at **+91 422 4000108** or report to Emergency Bay Ground Floor.";
            suggestedActions = [
              { label: "Emergency Center", href: "/patient/emergency" },
            ];
          }

          setMessages((prev) => [
            ...prev,
            {
              id: `msg-${Date.now() + 1}`,
              sender: "assistant",
              text: reply,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              actions: suggestedActions,
            },
          ]);
        }, 600);
      }
    } finally {
      setIsThinking(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "msg-reset",
        sender: "assistant",
        text: "Conversation refreshed. How can I assist you with IndoStates Hospital services today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-cyan-400/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base text-white">IndoCare AI Assistant</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400/20 text-cyan-200 border border-cyan-400/30">
                Verified Health AI
              </span>
            </div>
            <p className="text-xs text-cyan-100/80">
              Hospital Navigation • Doctor Scheduling • Diagnostic Inquiries
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="p-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2 shrink-0">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          IndoCare AI provides hospital navigation and appointment guidance. It does not provide medical diagnoses or replace physician consultations. For life-threatening emergencies, call <strong>+91 422 4000108</strong>.
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 overflow-y-auto space-y-4 shadow-inner">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === "user" ? "bg-slate-900 text-white" : "bg-cyan-100 text-cyan-900"
              }`}
            >
              {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-slate-900 text-white rounded-tr-none shadow-sm"
                  : "bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none shadow-xs"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>

              {m.actions && m.actions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-wrap gap-2">
                  {m.actions.map((act, idx) => (
                    <Link
                      key={idx}
                      href={act.href}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-cyan-500 hover:text-cyan-800 text-slate-800 font-bold text-[11px] transition-colors shadow-xs"
                    >
                      {act.label} →
                    </Link>
                  ))}
                </div>
              )}

              <span
                className={`text-[10px] block mt-1.5 ${
                  m.sender === "user" ? "text-slate-400 text-right" : "text-slate-600"
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-900 flex items-center justify-center text-xs font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600 animate-spin" />
              <span>IndoCare AI is searching hospital records...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none shrink-0">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-cyan-400 bg-white hover:bg-cyan-50/50 text-slate-600 hover:text-cyan-900 text-[11px] font-medium transition-all shrink-0 shadow-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 shrink-0 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask IndoCare AI anything (doctor availability, department, test rules)..."
          className="flex-1 px-3 py-2 text-xs focus:outline-none text-slate-900"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isThinking}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-40 flex items-center gap-1.5"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
