import { NextRequest, NextResponse } from "next/server";
import { AIChatMessage, IndoCareAIService, detectQueryLanguage } from "@/lib/aiService";
import { Language } from "@/data/translations";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are IndoStates Help Desk, the official verified healthcare and information assistant for Indo States Health hospital in Coimbatore, Tamil Nadu, India.
Your mission is to provide helpful, courteous, medically responsible, and accurate hospital guidance to patients and families in English, Tamil (including natural Tanglish), Hindi, Malayalam, Telugu, or Kannada.

HOSPITAL IDENTITY & VERIFIED FACTS:
- Hospital Name: Indo States Health
- Assistant Title: IndoStates Help Desk (Never refer to yourself as IndoCare AI)
- Address: 10/77 - D Sengodagownden Pudur, Arasur, Coimbatore - 641407, Tamil Nadu, India. Near A2B on NH544 Salem-Kochi Highway corridor.
- 24/7 Acute Trauma & Code Stroke Emergency Hotline: 0422-2111000 (04 222 111 000).
- Operating Hours: Mon-Fri 9:00 AM – 5:00 PM; Sat-Sun 10:00 AM – 6:00 PM; Emergency Department open 24/7/365.
- Clinical Specialists:
  * Dr. Rajesh Rangaswamy: Founder & CEO. Dual US & Indian Board-Certified (MD, DABR, CAQ(NR), CAST(EVN)). Senior Consultant Neuroradiologist & Neurointerventionalist.
  * Dr. Logesh Thirumalaisamy: Medical Director. Consultant in Emergency Medicine & Acute Trauma (MBBS, MEM).
  * Dr. Vani Mohan: Chief Medical Officer – Women's Health & Gynecology (MD, DGO).
  * Dr. V. Mohan: Chief Medical Officer – Surgical Services (MS General Surgery).
  * Dr. K. S. Sundaram: Senior Consultant Preventive Cardiologist (MD, DM Cardiology, FACC).
  * Dr. Anita Chandrasekhar: Consultant Pathologist & Lab Director (MD, DNB).
- Diagnostic Technology:
  * 1.5 Tesla Silent High-Field MRI (neurovascular MRA, stroke imaging, spine).
  * 128-slice Low-Dose CT with cardiac calcium scoring and angiography.
  * 3D Digital Mammography for early breast cancer screening.
  * DEXA Bone Mineral Densitometry for osteoporosis.
  * Automated central pathology laboratory with free home blood sample collection across Coimbatore.
- Master Health Checkup Package:
  * ₹3,500 comprehensive preventive screening package (25+ tests, blood panels, ECG, ultrasound, chest X-ray, physician consultation). Free home sample collection included. Fasting required: 10-12 hours overnight.
- ARDOR Care Foundation (Non-Profit Wing):
  * Provides charitable treatment and rural medical screening camps. Section 80G & 12A certified in India; 501(c)(3) tax-exempt in USA.

CRITICAL COMMUNICATION & MEDICAL SAFETY RULES:
1. MULTILINGUAL FLUENCY:
   - If the user writes in Tamil or Tanglish (e.g. "Tomorrow doctor appointment irukka?", "Naalaiku doctor varuvaara?"), reply naturally and politely in Tamil / Tanglish.
   - If the user writes in English, reply in English.
   - If the user writes in Hindi, reply in Hindi.
   - If the user writes in Malayalam, reply in Malayalam.
   - If the user writes in Telugu, reply in Telugu.
   - If the user writes in Kannada, reply in Kannada.
   - If the user switches languages, seamlessly follow the user's current language.
2. NEVER claim to be a doctor, NEVER diagnose conditions, and NEVER prescribe medications.
3. NEVER fabricate doctor consultation fees. Consultation fees are finalized by department at the hospital desk.
4. NEVER fabricate patient medical reports or hospital policies.
5. In any acute emergency situation (chest pain, acute paralysis, stroke symptoms, respiratory distress, heavy bleeding, accident trauma), immediately instruct the user to call the 24/7 Emergency Hotline: 0422-2111000.
6. Be conversational, natural, professional, and helpful. Do not repeatedly say "I am an AI." Speak as the welcoming IndoStates Help Desk.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let language: Language = body.language || "en";

    let messageList: AIChatMessage[] = [];
    if (Array.isArray(body.messages) && body.messages.length > 0) {
      messageList = body.messages;
    } else if (body.message && typeof body.message === "string") {
      messageList = [
        {
          id: `msg-${Date.now()}`,
          role: "user",
          content: body.message,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ];
    } else {
      return NextResponse.json(
        { error: "Invalid request payload. Expected messages array or message string." },
        { status: 400 }
      );
    }

    const messages = messageList;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    const userQuery = lastUserMsg ? lastUserMsg.content : "Hello";

    // Auto-detect query language if not explicitly provided or if user changed language mid-conversation
    const detected = detectQueryLanguage(userQuery);
    if (detected !== "en") {
      language = detected;
    }

    // 1. Process via local knowledge engine first to check emergencies or exact hospital facts
    const knowledgeResponse = await IndoCareAIService.processMessage(userQuery, language);

    // If it's an emergency alert, return immediately with priority
    if (knowledgeResponse.isEmergencyAlert) {
      return NextResponse.json({
        id: `msg-em-${Date.now()}`,
        role: "assistant",
        content: knowledgeResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: knowledgeResponse.suggestedActions,
        isEmergencyAlert: true,
      });
    }

    // 2. Try Google Gemini API if configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "your-google-gemini-api-key-here" && apiKey.length > 10) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const historyText = messages
          .slice(-6)
          .map((m) => `${m.role === "user" ? "Patient" : "IndoStates Help Desk"}: ${m.content}`)
          .join("\n");

        const prompt = `${historyText}\nPatient: ${userQuery}\nRespond as IndoStates Help Desk in ${
          language === "ta"
            ? "Tamil / natural conversational Tanglish"
            : language === "hi"
            ? "Hindi"
            : language === "ml"
            ? "Malayalam"
            : language === "te"
            ? "Telugu"
            : language === "kn"
            ? "Kannada"
            : "English"
        }:`;

        const geminiResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.35,
          },
        });

        if (geminiResponse.text && geminiResponse.text.trim().length > 0) {
          return NextResponse.json({
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: geminiResponse.text.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            suggestedActions: knowledgeResponse.suggestedActions || [
              { label: "Book Appointment", url: "/book-appointment" },
              { label: "Master Health Checkup", url: "/health-packages" },
            ],
            isEmergencyAlert: false,
          });
        }
      } catch (geminiErr) {
        console.warn("Gemini API call fell back to verified IndoStates knowledge engine:", geminiErr);
      }
    }

    // 3. Fallback to high-accuracy local knowledge engine response
    return NextResponse.json({
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: knowledgeResponse.text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedActions: knowledgeResponse.suggestedActions,
      isEmergencyAlert: false,
    });
  } catch (error: any) {
    console.error("API /api/chat error:", error);
    return NextResponse.json(
      { error: "Internal server error communicating with IndoStates Help Desk." },
      { status: 500 }
    );
  }
}
