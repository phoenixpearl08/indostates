"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  CheckCircle2,
  ArrowRight,
  Bot,
  User,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";

interface VoiceFlowStep {
  step: number;
  prompt: string;
  recognized?: string;
  actionHref?: string;
  actionText?: string;
}

export default function PatientVoiceAssistantPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [language, setLanguage] = useState<"en-IN" | "ta-IN" | "hi-IN">("en-IN");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [assistantReply, setAssistantReply] = useState("");
  const [suggestedRoute, setSuggestedRoute] = useState<{ label: string; href: string } | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    setSession(HospitalStore.getSession());

    if (typeof window !== "undefined") {
      const hasSpeech = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
      setSpeechSupported(hasSpeech);
    }
  }, []);

  const languageConfig = {
    "en-IN": {
      label: "English (India)",
      greeting: "Tap the microphone and tell me what you need, for example: 'Book an appointment with a Cardiologist'.",
      sample: "Cardiology doctor appointment book please",
    },
    "ta-IN": {
      label: "தமிழ் (Tamil)",
      greeting: "மைக்ரோஃபோனைத் தொட்டு நீங்கள் விரும்புவதைக் கூறுங்கள்: 'கார்டியாலஜி டாக்டரிடம் அப்பாயின்ட்மென்ட் புக் பண்ணனும்'.",
      sample: "Cardiology doctor appointment book pannanum",
    },
    "hi-IN": {
      label: "हिन्दी (Hindi)",
      greeting: "माइक्रोफ़ोन दबाएं और कहें: 'कार्डियोलॉजिस्ट डॉक्टर से अपॉइंटमेंट बुक करना है'.",
      sample: "Cardiologist doctor se appointment book karna hai",
    },
  };

  const handleStartListening = () => {
    if (!speechSupported) {
      alert("Speech recognition is not supported in this browser. Please use the text input below.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    setTranscript("Listening for your voice command...");
    setAssistantReply("");
    setSuggestedRoute(null);

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      processVoiceCommand(speechToText);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setTranscript("Could not capture speech. Please check microphone permissions or speak again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const processVoiceCommand = (text: string) => {
    const t = text.toLowerCase();

    if (t.includes("cardio") || t.includes("இதயம்") || t.includes("cardiology")) {
      setAssistantReply(
        "Cardiology Department selected. Dr. Saravanan Subramanian (Senior Interventional Cardiologist) is available today in OPD Room 102."
      );
      setSuggestedRoute({
        label: "Book Cardiology Consultation",
        href: "/patient/appointments?deptId=dept-cardiology",
      });
      speakText("Cardiology Department selected. Showing available appointments with Dr. Saravanan.");
    } else if (t.includes("neuro") || t.includes("brain") || t.includes("rajesh")) {
      setAssistantReply(
        "Neurology Department recognized. Dr. Rajesh Rangaswamy is available Mon-Sat, 9:00 AM to 1:00 PM."
      );
      setSuggestedRoute({
        label: "Book Neurology Specialist",
        href: "/patient/appointments?doctorId=dr-rajesh-rangaswamy",
      });
      speakText("Neurology specialist Dr. Rajesh Rangaswamy is available.");
    } else if (t.includes("report") || t.includes("blood") || t.includes("ரிப்போர்ட்")) {
      setAssistantReply(
        "Opening your verified Pathology and Laboratory Diagnostic reports ledger."
      );
      setSuggestedRoute({
        label: "View Lab Reports",
        href: "/patient/lab-reports",
      });
      speakText("Opening your verified laboratory diagnostic reports.");
    } else if (t.includes("pass") || t.includes("qr") || t.includes("டோக்கன்")) {
      setAssistantReply(
        "Displaying your digital QR appointment pass with live check-in token."
      );
      setSuggestedRoute({
        label: "Open Digital QR Pass",
        href: "/patient/qr-pass",
      });
      speakText("Opening your digital appointment pass.");
    } else {
      setAssistantReply(
        `Command received: "${text}". Navigating you to the appointment discovery directory.`
      );
      setSuggestedRoute({
        label: "Find Doctors & Departments",
        href: "/patient/doctors",
      });
    }
  };

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-violet-950 via-purple-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-400/20 border border-purple-400/30 text-purple-200 text-xs font-semibold mb-3">
          <Languages className="w-3.5 h-3.5" /> Multi-Lingual Speech Navigation
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Voice Assistant (குரல் உதவி)</h1>
        <p className="text-purple-100/90 text-xs sm:text-sm mt-1 max-w-xl mx-auto leading-relaxed">
          Speak in English, Tamil, or Hindi to seamlessly find doctors, schedule OPD visits, or view lab reports hands-free.
        </p>

        {/* Language Switcher */}
        <div className="flex justify-center gap-2 mt-5">
          {(["en-IN", "ta-IN", "hi-IN"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                language === lang
                  ? "bg-white text-purple-950 shadow-md"
                  : "bg-purple-900/60 hover:bg-purple-800 text-purple-200"
              }`}
            >
              {languageConfig[lang].label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Microphone Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm space-y-6">
        <div>
          <button
            onClick={isListening ? () => setIsListening(false) : handleStartListening}
            className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto transition-all shadow-xl active:scale-95 ${
              isListening
                ? "bg-red-500 text-white animate-pulse ring-8 ring-red-100 shadow-red-500/30"
                : "bg-gradient-to-tr from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white shadow-purple-600/30"
            }`}
          >
            {isListening ? <Mic className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
          </button>
          <span className="text-xs font-bold text-slate-700 mt-4 block">
            {isListening ? "Listening... Speak now" : "Tap Microphone to Speak"}
          </span>
        </div>

        {/* Dynamic Transcript Box */}
        {transcript && (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-800 max-w-lg mx-auto">
            <span className="text-[10px] font-bold uppercase text-slate-600 block mb-1">
              You Said:
            </span>
            <p className="font-medium text-sm text-slate-900">&ldquo;{transcript}&rdquo;</p>
          </div>
        )}

        {/* Assistant Reply */}
        {assistantReply && (
          <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-5 text-left max-w-lg mx-auto space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-700" />
              <span className="font-bold text-xs text-purple-900">IndoCare Voice Response:</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">{assistantReply}</p>

            {suggestedRoute && (
              <div className="pt-2">
                <Link
                  href={suggestedRoute.href}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  <span>{suggestedRoute.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Sample Voice Prompts */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-600 block mb-2">Try saying:</span>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Cardiology doctor appointment book pannanum",
              "Check my blood test reports",
              "Show my digital appointment QR pass",
              "Dr. Rajesh neurology schedule",
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(p);
                  processVoiceCommand(p);
                }}
                className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-purple-300 bg-slate-50 hover:bg-purple-50/50 text-slate-600 hover:text-purple-900 text-xs transition-all"
              >
                &ldquo;{p}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
