"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  Send,
  User,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Phone,
  RefreshCw,
  Languages,
  ArrowRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AIChatMessage } from "@/lib/aiService";
import { HospitalStore } from "@/lib/store";
import { Language } from "@/data/translations";
import { HOSPITAL_INFO } from "@/data/hospitalData";
import { Button } from "@/components/ui/Button";
import { formatTime } from "@/lib/utils";

export default function AssistantPage() {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "init-welcome",
      role: "assistant",
      content:
        "Hello! I am IndoStates Help Desk, your official virtual healthcare and hospital assistant for Indo States Health. How may I assist you today? You can type or speak in English, Tamil (தமிழ்), Hindi (हिंदी), Malayalam (മലയാളം), Telugu (తెలుగు), or Kannada (ಕನ್ನಡ) about our specialist doctors, diagnostic scans (1.5T MRI / 128-slice CT), or the ₹3,500 Master Health Checkup.",
      timestamp: "10:00 AM",
      suggestedActions: [
        { label: "Book Master Health Checkup (₹3,500)", action: "navigate", url: "/book-appointment" },
        { label: "1.5T MRI Scan Information", action: "navigate", url: "/diagnostic-center/mri" },
        { label: "Find Specialist Physicians", action: "navigate", url: "/doctors" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lang, setLang] = useState<Language>("en");

  // Voice Assistant States
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isVoiceAutoRead, setIsVoiceAutoRead] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setLang(HospitalStore.getLanguage());
    const handleLang = () => setLang(HospitalStore.getLanguage());
    window.addEventListener("ish_language_change", handleLang);
    return () => window.removeEventListener("ish_language_change", handleLang);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Voice Recognition Handler
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    setSpeechError(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError("Speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;

      // Set recognition dialect for supported languages
      if (lang === "ta") recognition.lang = "ta-IN";
      else if (lang === "hi") recognition.lang = "hi-IN";
      else if (lang === "ml") recognition.lang = "ml-IN";
      else if (lang === "te") recognition.lang = "te-IN";
      else if (lang === "kn") recognition.lang = "kn-IN";
      else recognition.lang = "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSend(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn("Voice assistant error:", event.error);
        if (event.error === "not-allowed") {
          setSpeechError("Microphone permission denied. Please allow microphone permissions or type below.");
        } else {
          setSpeechError("Could not recognize voice. Please try speaking closer or type your query.");
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setSpeechError("Speech recognition service failed to initialize.");
      setIsListening(false);
    }
  };

  // Text to Speech
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/[*_#`]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (lang === "ta") utterance.lang = "ta-IN";
    else if (lang === "hi") utterance.lang = "hi-IN";
    else if (lang === "ml") utterance.lang = "ml-IN";
    else if (lang === "te") utterance.lang = "te-IN";
    else if (lang === "kn") utterance.lang = "kn-IN";
    else utterance.lang = "en-IN";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSend = async (customQuery?: string) => {
    const textToSend = (customQuery || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: formatTime(new Date().toISOString()),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          language: lang,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: AIChatMessage = {
          id: data.id || `msg-${Date.now()}`,
          role: "assistant",
          content: data.content,
          timestamp: data.timestamp || formatTime(new Date().toISOString()),
          suggestedActions: data.suggestedActions,
          isEmergencyAlert: data.isEmergencyAlert,
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (isVoiceAutoRead && data.content) {
          speakText(data.content);
        }
      } else {
        const errorMsg: AIChatMessage = {
          id: `msg-err-${Date.now()}`,
          role: "assistant",
          content: "I apologize, our help desk service experienced a momentary delay. Please ask again or dial 0422-2111000 for direct hospital support.",
          timestamp: formatTime(new Date().toISOString()),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch {
      const networkErrorMsg: AIChatMessage = {
        id: `msg-net-err-${Date.now()}`,
        role: "assistant",
        content: "Network communication error. Please check your internet connection or call our hospital desk at 0422-2111000.",
        timestamp: formatTime(new Date().toISOString()),
      };
      setMessages((prev) => [...prev, networkErrorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    stopSpeaking();
    setMessages([
      {
        id: `msg-init-${Date.now()}`,
        role: "assistant",
        content:
          "Welcome to IndoStates Help Desk. How can I assist you with appointments, doctors, or diagnostic services today?",
        timestamp: formatTime(new Date().toISOString()),
        suggestedActions: [
          { label: "Book Master Health Checkup", action: "navigate", url: "/book-appointment" },
          { label: "1.5T MRI Scan Information", action: "navigate", url: "/diagnostic-center/mri" },
          { label: "Find Specialist Physicians", action: "navigate", url: "/doctors" },
        ],
      },
    ]);
  };

  const quickPrompts = [
    "Tomorrow doctor appointment irukka?",
    "Master health checkup details & price?",
    "1.5T MRI scan timings & preparation?",
    "Where is Indo States Health located?",
    "How to reach 24/7 Stroke Emergency?",
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16 flex flex-col">
      {/* Top Header */}
      <section className="bg-gradient-to-r from-hospital-950 via-hospital-900 to-cyan-950 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-hospital-800">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-md">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-900/60 border border-cyan-700 text-cyan-300 text-[11px] font-semibold tracking-wide uppercase mb-1">
                <Sparkles className="w-3 h-3" />
                Multilingual AI &amp; Information Assistant
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
                IndoStates Help Desk
              </h1>
              <p className="text-xs text-hospital-200">
                Grounded strictly in verified hospital services, doctor credentials, and scheduling rules.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto Read Toggle */}
            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                setIsVoiceAutoRead(!isVoiceAutoRead);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                isVoiceAutoRead
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
                  : "bg-hospital-900/80 border-hospital-700 text-slate-300 hover:text-white"
              }`}
              title="Toggle automatic spoken responses"
            >
              {isVoiceAutoRead ? <Volume2 className="w-3.5 h-3.5 text-cyan-300" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{isVoiceAutoRead ? "Auto-Speak ON" : "Auto-Speak OFF"}</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-2 bg-hospital-900/80 p-1.5 rounded-xl border border-hospital-700">
              <Languages className="w-4 h-4 text-cyan-300 ml-2" />
              <select
                value={lang}
                onChange={(e) => {
                  const newLang = e.target.value as Language;
                  setLang(newLang);
                  HospitalStore.setLanguage(newLang);
                }}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none pr-2 cursor-pointer"
              >
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
                <option value="hi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
                <option value="ml" className="bg-slate-900 text-white">മലയാളം (Malayalam)</option>
                <option value="te" className="bg-slate-900 text-white">తెలుగు (Telugu)</option>
                <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Window */}
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex-1 flex flex-col">
        {/* Safety Disclaimer Banner */}
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 mb-3 shadow-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Medical Notice:</strong> IndoStates Help Desk provides hospital information and scheduling assistance. It does not provide medical diagnoses or prescriptions. For acute emergencies, call <strong>{HOSPITAL_INFO.emergencyPhone}</strong> immediately.
          </div>
        </div>

        {/* Live Listening Banner */}
        {isListening && (
          <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-300 text-cyan-950 text-xs flex items-center justify-between mb-3 shadow-sm animate-pulse">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
              <span className="font-bold">
                Listening to your microphone in {lang === "ta" ? "Tamil (தமிழ்)" : lang === "hi" ? "Hindi (हिंदी)" : "English"}... Speak now!
              </span>
            </div>
            <button
              onClick={toggleListening}
              className="px-3 py-1 rounded-xl bg-white border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 transition"
            >
              Stop Listening
            </button>
          </div>
        )}

        {/* Voice Error Fallback */}
        {speechError && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between mb-3 shadow-sm">
            <span>{speechError}</span>
            <button onClick={() => setSpeechError(null)} className="text-xs font-bold text-red-700 ml-2">
              ✕
            </button>
          </div>
        )}

        {/* Messages Card */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 overflow-y-auto space-y-4 min-h-[420px] max-h-[620px]">
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isUser
                      ? "bg-slate-900 text-white font-bold text-xs"
                      : "bg-cyan-100 text-cyan-800 border border-cyan-200"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-cyan-700" />}
                </div>

                <div className={`space-y-2 max-w-[85%] sm:max-w-[75%]`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "bg-hospital-700 text-white rounded-tr-none"
                        : m.isEmergencyAlert
                        ? "bg-red-50 border border-red-300 text-red-950 rounded-tl-none font-medium"
                        : "bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none"
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.content}</div>

                    <div className={`text-[10px] mt-1.5 flex items-center justify-between gap-4 ${isUser ? "text-hospital-200" : "text-slate-400"}`}>
                      <span>{m.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => speakText(m.content)}
                          className="hover:text-cyan-700 transition flex items-center gap-1"
                          title="Read this answer aloud"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Speak</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Suggested Quick Navigation CTAs */}
                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {m.suggestedActions.map((action, idx) => (
                        <Link
                          key={idx}
                          href={action.url}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 text-xs font-semibold transition shadow-2xs"
                        >
                          <span>{action.label}</span>
                          <ArrowRight className="w-3 h-3 text-cyan-700" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan-700 animate-spin" />
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px] font-medium text-slate-600">
                  IndoStates Help Desk is reviewing clinical records...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Questions Bar */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-cyan-800 hover:bg-cyan-50 text-xs font-medium transition shrink-0 whitespace-nowrap shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="mt-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl transition ${
              isListening
                ? "bg-red-600 text-white animate-pulse"
                : "bg-slate-100 hover:bg-cyan-100 text-slate-600 hover:text-cyan-800"
            }`}
            title={isListening ? "Listening... Click to stop" : "Speak your message via microphone"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            placeholder={
              lang === "ta"
                ? "மருத்துவ சந்திப்பு, பரிசோதனைகள், மருத்துவர்கள் பற்றி கேட்கவும்..."
                : lang === "hi"
                ? "अपॉइंटमेंट, डॉक्टरों या परीक्षणों के बारे में पूछें..."
                : "Ask about appointments, specialists, 1.5T MRI, or packages..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none placeholder:text-slate-400"
          />

          <Button
            variant="primary"
            size="sm"
            disabled={isLoading || !input.trim()}
            onClick={() => handleSend()}
            className="bg-hospital-700 hover:bg-hospital-800 text-white px-3 sm:px-4 shrink-0 font-semibold"
          >
            <Send className="w-3.5 h-3.5 mr-1" />
            <span className="hidden sm:inline">Ask</span>
          </Button>
        </div>

        {/* Footer Ribbon */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Hospital Help Desk Session</span>
          </div>

          <button
            onClick={handleRestart}
            className="hover:text-slate-700 transition flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Conversation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
