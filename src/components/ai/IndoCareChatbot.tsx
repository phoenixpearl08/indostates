"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
} from "lucide-react";
import { IndoCareAIService, ChatMessage } from "@/lib/aiService";
import { HospitalStore } from "@/lib/store";
import { Language, TRANSLATIONS } from "@/data/translations";
import { formatTime } from "@/lib/utils";

export const IndoCareChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState<Language>("en");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Voice Assistant States
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isVoiceAutoRead, setIsVoiceAutoRead] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition when requested
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

      // Set recognition language
      if (lang === "ta") recognition.lang = "ta-IN";
      else if (lang === "hi") recognition.lang = "hi-IN";
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
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setSpeechError("Microphone access denied. Please allow microphone permissions or type below.");
        } else {
          setSpeechError("Could not recognize voice. Please try speaking closer or type your query.");
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error("SpeechRecognition start error:", err);
      setSpeechError("Microphone could not be activated. Please type your inquiry.");
      setIsListening(false);
    }
  };

  // Text to Speech
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    // Clean markdown stars/bullets for clean reading
    const cleanText = text
      .replace(/[*_#`]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (lang === "ta") utterance.lang = "ta-IN";
    else if (lang === "hi") utterance.lang = "hi-IN";
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


  useEffect(() => {
    setLang(HospitalStore.getLanguage());
    const handleLangChange = () => setLang(HospitalStore.getLanguage());
    window.addEventListener("ish_language_change", handleLangChange);

    // Initial greeting
    const t = TRANSLATIONS[HospitalStore.getLanguage()] || TRANSLATIONS.en;
    setMessages([
      {
        id: "msg-init",
        sender: "assistant",
        text: t.assistant.greeting,
        timestamp: formatTime(new Date().toISOString()),
        suggestedActions: [
          { label: "Book Master Health Checkup", url: "/book-appointment?package=master-health-checkup" },
          { label: "Find a Doctor", url: "/doctors" },
          { label: "Where is the Hospital?", url: "/find-us" },
          { label: "Emergency Hotline", url: "/emergency" },
        ],
      },
    ]);

    return () => window.removeEventListener("ish_language_change", handleLangChange);
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: formatTime(new Date().toISOString()),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({
              id: m.id,
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text,
              timestamp: m.timestamp,
            })),
            {
              id: userMsg.id,
              role: "user",
              content: userMsg.text,
              timestamp: userMsg.timestamp,
            },
          ],
          language: lang,
        }),
      });

      if (res.ok) {
        const aiData = await res.json();
        const aiMsg: ChatMessage = {
          id: aiData.id || `msg-${Date.now()}`,
          sender: "assistant",
          text: aiData.content || aiData.text,
          timestamp: aiData.timestamp || formatTime(new Date().toISOString()),
          suggestedActions: aiData.suggestedActions,
          isEmergencyAlert: aiData.isEmergencyAlert,
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (isVoiceAutoRead || isListening) {
          speakText(aiMsg.text);
        }
      } else {
        // Fallback to grounded local model
        const fallback = await IndoCareAIService.processMessage(query, lang);
        setMessages((prev) => [...prev, fallback]);
        if (isVoiceAutoRead) speakText(fallback.text);
      }
    } catch {
      try {
        const fallback = await IndoCareAIService.processMessage(query, lang);
        setMessages((prev) => [...prev, fallback]);
        if (isVoiceAutoRead) speakText(fallback.text);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "assistant",
            text: "I am temporarily experiencing network connectivity delays. Please contact our 24/7 reception desk at 0422-2111000 for immediate assistance.",
            timestamp: formatTime(new Date().toISOString()),
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: "assistant",
        text: t.assistant.greeting,
        timestamp: formatTime(new Date().toISOString()),
        suggestedActions: [
          { label: "Book Master Checkup (₹3,500)", url: "/book-appointment?package=master-health-checkup" },
          { label: "Meet Dr. Rajesh Rangaswamy", url: "/doctors/dr-rajesh-rangaswamy" },
          { label: "Free Home Sample Collection", url: "/diagnostic-center/laboratory" },
        ],
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 p-3 sm:px-4 sm:py-3.5 rounded-full bg-gradient-to-r from-hospital-700 to-navy-900 text-white shadow-floating hover:shadow-card hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 group border border-cyan-400/30"
          aria-label="Open IndoStates Help Desk Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white" />
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-wide hidden sm:inline">
            Help Desk
          </span>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white border border-slate-200/90 shadow-floating rounded-2xl overflow-hidden ${
            isMinimized
              ? "bottom-20 right-4 sm:bottom-6 sm:right-6 w-80 h-16 max-w-[calc(100vw-32px)]"
              : "bottom-20 right-2 sm:bottom-6 sm:right-6 w-[calc(100vw-16px)] sm:w-[420px] max-w-lg h-[75vh] sm:h-[620px]"
          }`}
          role="dialog"
          aria-label="IndoStates Help Desk Chat Window"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-navy-950 via-hospital-900 to-navy-950 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-hospital-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-hospital-500 to-cyan-400 text-navy-950 font-black text-sm flex items-center justify-center font-heading">
                HD
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-sm tracking-wide">
                    IndoStates Help Desk
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.2 rounded border border-emerald-400/30">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-cyan-300/80 -mt-0.5">
                  Hospital Multilingual Assistant &amp; Guide
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setIsVoiceAutoRead(!isVoiceAutoRead);
                }}
                className={`p-1.5 rounded-md transition-colors ${
                  isVoiceAutoRead ? "text-cyan-300 bg-white/20" : "text-slate-400 hover:text-white hover:bg-white/10"
                }`}
                title={isVoiceAutoRead ? "Spoken AI voice responses: ON" : "Spoken AI voice responses: OFF"}
              >
                {isVoiceAutoRead ? <Volume2 className="w-3.5 h-3.5 text-cyan-300" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={resetChat}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                title="Restart conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-md transition-colors hidden sm:inline"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  stopSpeaking();
                  if (isListening && recognitionRef.current) recognitionRef.current.stop();
                  setIsOpen(false);
                }}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Clinical Safety Disclaimer Banner */}
              <div className="bg-amber-50 border-b border-amber-200/80 px-3 py-1.5 text-[11px] text-amber-900 flex items-start gap-1.5 shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Informational guide only. For medical emergencies (chest pain, stroke, trauma), dial <strong>0422-2111000</strong> immediately.
                </span>
              </div>

              {/* Voice Listening Banner */}
              {isListening && (
                <div className="bg-cyan-50 border-b border-cyan-200 px-3 py-2 text-xs text-cyan-950 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                    <span className="font-semibold text-[11px]">
                      Listening in {lang === "ta" ? "Tamil (தமிழ்)" : lang === "hi" ? "Hindi (हिंदी)" : "English"}... Speak your question.
                    </span>
                  </div>
                  <button
                    onClick={toggleListening}
                    className="text-[11px] font-bold text-red-600 hover:underline px-2 py-0.5 rounded bg-white border border-red-200"
                  >
                    Stop
                  </button>
                </div>
              )}

              {/* Voice Speaking Banner */}
              {isSpeaking && (
                <div className="bg-emerald-50 border-b border-emerald-200 px-3 py-2 text-xs text-emerald-950 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                    <span className="font-semibold text-[11px]">
                      Assistant is speaking aloud...
                    </span>
                  </div>
                  <button
                    onClick={stopSpeaking}
                    className="text-[11px] font-bold text-emerald-800 hover:underline px-2 py-0.5 rounded bg-white border border-emerald-300"
                  >
                    Stop Audio
                  </button>
                </div>
              )}

              {/* Voice Error Fallback Banner */}
              {speechError && (
                <div className="bg-red-50 border-b border-red-200 px-3 py-1.5 text-[11px] text-red-800 flex items-center justify-between shrink-0">
                  <span>{speechError}</span>
                  <button onClick={() => setSpeechError(null)} className="text-xs font-bold text-red-700 ml-2">
                    ✕
                  </button>
                </div>
              )}

              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 text-xs sm:text-sm">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "assistant" && (
                      <div className="w-7 h-7 rounded-lg bg-hospital-100 border border-hospital-200 text-hospital-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div className="max-w-[84%] space-y-1.5">
                      <div
                        className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-xs ${
                          msg.sender === "user"
                            ? "bg-hospital-700 text-white rounded-br-none"
                            : msg.isEmergencyAlert
                            ? "bg-red-50 text-red-950 border border-red-200 rounded-bl-none font-medium"
                            : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Read Aloud Button for Assistant Messages */}
                      {msg.sender === "assistant" && (
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 pl-1">
                          <span>{msg.timestamp}</span>
                          <button
                            onClick={() => speakText(msg.text)}
                            className="inline-flex items-center gap-1 hover:text-hospital-700 transition"
                            title="Read this message aloud"
                          >
                            <Volume2 className="w-3 h-3 text-cyan-600" />
                            <span>Listen</span>
                          </button>
                        </div>
                      )}


                      {/* Clickable Actions & Deep Links */}
                      {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.suggestedActions.map((action, i) =>
                            action.url?.startsWith("tel:") ? (
                              <a
                                key={i}
                                href={action.url}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-xs"
                              >
                                {action.label}
                              </a>
                            ) : (
                              <Link
                                key={i}
                                href={action.url || "#"}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-hospital-50 text-hospital-700 border border-slate-200 hover:border-hospital-300 text-xs font-medium transition-colors shadow-xs"
                              >
                                <span>{action.label}</span>
                                <ArrowRight className="w-3 h-3 opacity-60" />
                              </Link>
                            )
                          )}
                        </div>
                      )}

                      <span className="text-[10px] text-slate-400 block px-1">
                        {msg.timestamp}
                      </span>
                    </div>

                    {msg.sender === "user" && (
                      <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2.5 items-center text-xs text-slate-500">
                    <div className="w-7 h-7 rounded-lg bg-hospital-100 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-hospital-700 animate-pulse" />
                    </div>
                    <div className="p-3 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-hospital-600 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-hospital-600 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-hospital-600 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Preset Quick Prompts */}
              <div className="p-2 bg-slate-50 border-t border-slate-200/80 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
                <button
                  type="button"
                  onClick={() => handleSend("How do I book an appointment?")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-hospital-400 hover:text-hospital-700 whitespace-nowrap text-slate-700 font-medium transition-colors shadow-2xs"
                >
                  Book an Appointment
                </button>
                <button
                  type="button"
                  onClick={() => handleSend("Tell me about available doctors and specialists")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-hospital-400 hover:text-hospital-700 whitespace-nowrap text-slate-700 font-medium transition-colors shadow-2xs"
                >
                  Find a Doctor
                </button>
                <button
                  type="button"
                  onClick={() => handleSend("What clinical departments and specialties do you offer?")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-hospital-400 hover:text-hospital-700 whitespace-nowrap text-slate-700 font-medium transition-colors shadow-2xs"
                >
                  Find a Department
                </button>
                <button
                  type="button"
                  onClick={() => handleSend("What are the hospital services, MRI, CT, and packages?")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-hospital-400 hover:text-hospital-700 whitespace-nowrap text-slate-700 font-medium transition-colors shadow-2xs"
                >
                  Hospital Services
                </button>
                <button
                  type="button"
                  onClick={() => handleSend("Can you help me check or reschedule my appointment?")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-hospital-400 hover:text-hospital-700 whitespace-nowrap text-slate-700 font-medium transition-colors shadow-2xs"
                >
                  Appointment Help
                </button>
                <button
                  type="button"
                  onClick={() => handleSend("How can I download or view my lab reports?")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-hospital-400 hover:text-hospital-700 whitespace-nowrap text-slate-700 font-medium transition-colors shadow-2xs"
                >
                  Lab Reports
                </button>
                <button
                  type="button"
                  onClick={() => handleSend("How does the Patient Portal and digital pass work?")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-hospital-400 hover:text-hospital-700 whitespace-nowrap text-slate-700 font-medium transition-colors shadow-2xs"
                >
                  Patient Portal Help
                </button>
                <button
                  type="button"
                  onClick={() => handleSend("Where is the hospital located and what is the emergency phone number?")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-hospital-400 hover:text-hospital-700 whitespace-nowrap text-slate-700 font-medium transition-colors shadow-2xs"
                >
                  Contact Hospital
                </button>
              </div>

              {/* Input Box with Voice Assistant Integration */}
              <div className="p-3 bg-white border-t border-slate-200 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-2.5 rounded-xl transition-all shadow-xs active:scale-95 shrink-0 ${
                      isListening
                        ? "bg-red-600 text-white animate-pulse"
                        : "bg-hospital-50 hover:bg-hospital-100 text-hospital-700 border border-hospital-200"
                    }`}
                    title={isListening ? "Listening... Click to stop" : "Speak to IndoStates Help Desk (Microphone)"}
                    aria-label="Voice input"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isListening ? "Listening... Speak now..." : "Ask IndoStates Help Desk anything or speak..."}
                    className="flex-1 py-2.5 px-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hospital-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="p-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 disabled:opacity-40 text-white transition-all shadow-sm active:scale-95 shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </>
          )}
        </div>
      )}
    </>
  );
};
