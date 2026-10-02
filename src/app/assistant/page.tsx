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
import { generateIndoCareResponse, AIChatMessage } from "@/lib/aiService";
import { HospitalStore } from "@/lib/store";
import { Language } from "@/data/translations";
import { HOSPITAL_INFO } from "@/data/hospitalData";
import { Button } from "@/components/ui/Button";

export default function AssistantPage() {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "init-welcome",
      role: "assistant",
      content:
        "Hello! I am IndoCare AI, the virtual healthcare and voice assistant for Indo States Health. How may I assist you today? You can speak to me or type your questions about our doctors, diagnostic scans (1.5T MRI / 128-slice CT), or the ₹3,500 Master Health Checkup.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedActions: [
        { label: "Book Master Health Checkup", action: "navigate", url: "/book-appointment" },
        { label: "1.5T MRI Details", action: "navigate", url: "/diagnostic-center/mri" },
        { label: "Find a Specialist", action: "navigate", url: "/doctors" },
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

      // Set recognition dialect
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
        console.warn("Voice assistant error:", event.error);
        if (event.error === "not-allowed") {
          setSpeechError("Microphone permission denied. Please allow microphone permissions or type below.");
        } else {
          setSpeechError("Voice could not be recognized clearly. Please try speaking closer or type your query.");
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error("SpeechRecognition start error:", err);
      setSpeechError("Microphone could not be activated. Please type your query.");
      setIsListening(false);
    }
  };

  // Text-to-Speech Output
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

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: AIChatMessage = {
      id: "u-" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateIndoCareResponse([...messages, userMsg], lang);
      setMessages((prev) => [...prev, response]);
      if (isVoiceAutoRead) {
        speakText(response.content);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "assistant",
          content: "I apologize, but I encountered a momentary connection glitch. Please try again or call our hospital desk directly at 0422-2111000.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    "What is included in the ₹3,500 Master Health Checkup?",
    "Tell me about Dr. Rajesh Rangaswamy's qualifications.",
    "Do you offer free home blood sample collection in Coimbatore?",
    "How does the 128-slice CT coronary calcium score work?",
    "Where is Indo States Health located?",
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
                Multilingual Voice & Information Assistant
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
                IndoCare AI Voice Assistant
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
            <strong>Medical Notice:</strong> IndoCare AI provides hospital information and scheduling assistance. It does not provide medical diagnoses or prescriptions. For acute emergencies, call <strong>{HOSPITAL_INFO.emergencyPhone}</strong> immediately.
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

        {/* Conversation Area */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden h-[620px]">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-hospital-900 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4 text-cyan-300" />
                  </div>
                )}

                <div className="max-w-[85%] sm:max-w-[75%] space-y-2">
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                      msg.role === "user"
                        ? "bg-hospital-900 text-white rounded-tr-none"
                        : "bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Read Aloud Button for Assistant Messages */}
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 pl-1">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => speakText(msg.content)}
                        className="inline-flex items-center gap-1 text-cyan-700 hover:text-hospital-900 font-semibold transition"
                        title="Read this message aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen Aloud</span>
                      </button>
                    </div>
                  )}

                  {/* Suggested actions if present */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.suggestedActions.map((action, aIdx) => (
                        <Link key={aIdx} href={action.url}>
                          <button className="px-3 py-1.5 rounded-xl bg-hospital-50 border border-hospital-200 text-hospital-800 text-xs font-semibold hover:bg-hospital-100 transition flex items-center gap-1.5 shadow-sm">
                            <span>{action.label}</span>
                            <ArrowRight className="w-3 h-3 text-cyan-700" />
                          </button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-hospital-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4 text-cyan-300" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-hospital-600" />
                  <span className="text-slate-500 font-medium">IndoCare AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sample Prompts Tray */}
          <div className="px-4 sm:px-6 py-2 border-t border-slate-100 bg-slate-50/70 overflow-x-auto scrollbar-none flex gap-2">
            {samplePrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-hospital-300 text-slate-700 text-[11px] whitespace-nowrap transition disabled:opacity-50 shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box with Microphone Voice Control */}
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleListening}
                className={`p-3 rounded-2xl transition-all shadow-sm active:scale-95 shrink-0 ${
                  isListening
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-hospital-50 hover:bg-hospital-100 text-hospital-700 border border-hospital-200"
                }`}
                title={isListening ? "Listening... Click to stop" : "Speak to IndoCare AI (Microphone)"}
                aria-label="Voice input"
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening to your voice... Speak now..." : "Ask IndoCare AI anything or click the microphone to speak..."}
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-hospital-500 shadow-inner"
                disabled={isLoading}
              />

              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={!input.trim() || isLoading}
                className="rounded-2xl shrink-0"
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
