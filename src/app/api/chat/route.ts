import { NextRequest, NextResponse } from "next/server";
import { generateIndoCareResponse, AIChatMessage, IndoCareAIService } from "@/lib/aiService";
import { Language } from "@/data/translations";
import { HOSPITAL_INFO, DOCTORS, DEPARTMENTS, HEALTH_PACKAGES } from "@/data/hospitalData";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are IndoCare AI, the official verified healthcare assistant for Indo States Health hospital in Coimbatore, Tamil Nadu, India.
Your mission is to provide helpful, courteous, and accurate hospital information to patients and families in English or Tamil.

CRITICAL HOSPITAL FACTS (ONLY USE THESE VERIFIED FACTS):
- Hospital Name: Indo States Health
- Address: 10/77 - D Sengodagownden Pudur, Arasur, Coimbatore - 641407, Tamil Nadu, India. Near A2B on NH544 Salem-Kochi Highway corridor.
- 24/7 Acute Trauma & Code Stroke Emergency Hotline: 0422-2111000 (04 222 111 000).
- Operating Hours: Mon-Fri 9:00 AM – 5:00 PM; Sat-Sun 10:00 AM – 6:00 PM; 24/7 Emergency.
- Clinical Leadership:
  * Dr. Rajesh Rangaswamy: Founder & CEO. Dual Board-Certified in USA & India (MD, DABR, CAQ(NR), CAST(EVN)). Senior Consultant Neuroradiologist & Neurointerventionalist.
  * Dr. Logesh Thirumalaisamy: Medical Director. Consultant in Emergency Medicine & Acute Trauma (MBBS, MEM).
  * Dr. Vani Mohan: Chief Medical Officer – Women's Health & Gynecology (MD, DGO).
  * Dr. V. Mohan: Chief Medical Officer – Surgical Services (MS General Surgery).
  * Dr. K. S. Sundaram: Senior Consultant Preventive Cardiologist (MD, DM Cardiology, FACC).
  * Dr. Anita Chandrasekhar: Consultant Pathologist & Lab Director (MD, DNB).
- Diagnostic Technology:
  * High-field 1.5 Tesla MRI with silent scan technology and neurovascular MRA.
  * 128-slice Low-Dose CT with cardiac angiography and coronary calcium scoring.
  * 3D Digital Mammography for early breast cancer screening.
  * DEXA Bone Mineral Densitometry for osteoporosis assessment.
  * Automated central clinical laboratory with free home sample collection.
- Master Health Checkup Package:
  * ₹3,500 comprehensive preventive screening package (includes blood investigations, ECG, ultrasound, chest X-ray, physician consultation). Fasting required: 10-12 hours overnight.
- ARDOR Care Foundation (Non-Profit Wing):
  * Provides charitable treatment and rural medical screening camps. Section 80G & 12A certified in India; 501(c)(3) tax-exempt in USA via Ardor Corporation (ardoronline.com).

SAFETY RULES:
1. NEVER fabricate doctor consultation fees. Consultation fees vary by clinical department and are finalized at hospital registration; do NOT quote arbitrary prices.
2. NEVER diagnose diseases, prescribe medication, or claim to replace a doctor.
3. For any emergency symptoms (chest pain, acute weakness, face drooping, slurred speech, heavy bleeding, accident trauma), immediately instruct the user to call the 24/7 emergency hotline: 0422-2111000.
4. Support English and Tamil gracefully.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const language: Language = body.language || "en";

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

    // 1. Check for Acute Emergency Keywords first
    const emergencyKeywords = ["chest pain", "stroke", "slurred speech", "paralysis", "cannot breathe", "ambulance", "மாரடைப்பு", "பக்கவாதம்", "அவசரம்"];
    const isEmergency = emergencyKeywords.some((kw) => userQuery.toLowerCase().includes(kw));

    if (isEmergency) {
      const emergencyRes = await IndoCareAIService.processMessage(userQuery, language);
      return NextResponse.json({
        id: `msg-em-${Date.now()}`,
        role: "assistant",
        content: emergencyRes.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: emergencyRes.suggestedActions,
        isEmergencyAlert: true,
      });
    }

    // 2. Try Google Gemini API if GEMINI_API_KEY is configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "your-google-gemini-api-key-here" && apiKey.length > 10) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        
        // Build conversation history for Gemini
        const historyText = messages.slice(-5).map((m) => `${m.role === "user" ? "Patient" : "IndoCare"}: ${m.content}`).join("\n");
        const prompt = `${historyText}\nPatient: ${userQuery}\nRespond in ${language === "ta" ? "Tamil" : "English"}:`;

        const geminiResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.3,
            maxOutputTokens: 600,
          },
        });

        if (geminiResponse.text) {
          return NextResponse.json({
            id: `msg-gemini-${Date.now()}`,
            role: "assistant",
            content: geminiResponse.text,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            suggestedActions: [
              { label: "Book Appointment", url: "/book-appointment" },
              { label: "View Doctors", url: "/doctors" },
              { label: "Master Health Checkup (₹3,500)", url: "/health-packages/master-health-checkup" },
            ],
          });
        }
      } catch (geminiError: any) {
        console.warn("Gemini API call notice, falling back to hospital grounded model:", geminiError?.message || geminiError);
      }
    }

    // 3. Fallback: High-precision retrieval-grounded hospital intelligence
    const groundedResult = await generateIndoCareResponse(messages, language);
    return NextResponse.json(groundedResult);
  } catch (error: any) {
    console.error("API /api/chat error:", error);
    return NextResponse.json(
      {
        id: "err-server",
        role: "assistant",
        content:
          "Thank you for contacting Indo States Health. For immediate assistance with doctor appointments or diagnostic scans, please call our 24/7 reception desk at 0422-2111000.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      { status: 500 }
    );
  }
}
