import { HOSPITAL_INFO, DOCTORS, DEPARTMENTS, HEALTH_PACKAGES, DIAGNOSTIC_MODALITIES, FAQS } from "@/data/hospitalData";
import { Language } from "@/data/translations";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; url?: string; action?: string }[];
  isEmergencyAlert?: boolean;
}

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; action?: string; url: string }[];
  isEmergencyAlert?: boolean;
}


// Emergency Keyword Triaging Pattern
const EMERGENCY_KEYWORDS = [
  "chest pain",
  "heart attack",
  "stroke",
  "slurred speech",
  "facial drooping",
  "paralysis",
  "cannot breathe",
  "shortness of breath",
  "heavy bleeding",
  "unconscious",
  "severe trauma",
  "accident",
  "ambulance",
  "மார்பு வலி",
  "பக்கவாதம்",
  "சுவாசிக்க முடியவில்லை",
  "सीना दर्द",
  "दौरा",
  "सांस नहीं आ रही",
];

export class IndoCareAIService {
  static async processMessage(userQuery: string, lang: Language = "en"): Promise<ChatMessage> {
    const normalized = userQuery.toLowerCase().trim();

    // 1. EMERGENCY TRIAGE GATEWAY
    const isEmergency = EMERGENCY_KEYWORDS.some((kw) => normalized.includes(kw));
    if (isEmergency) {
      const emergencyResponses: Record<Language, string> = {
        en: `🚨 **IMMEDIATE EMERGENCY PROTOCOL:**\nIf you or a patient is experiencing acute chest pain, weakness on one side of the body, slurred speech, sudden loss of consciousness, or severe trauma, **DO NOT WAIT.**\n\n**Immediately contact Indo States Health Emergency Hotline:**\n📞 **[0422-2111000](tel:+9104222111000)**\n\nOur Code Stroke & Acute Trauma Team is on standby 24/7 at 10/77 - D Sengodagownden Pudur, Arasur, Coimbatore (NH 544).`,
        ta: `🚨 **அவசர எச்சரிக்கை நெறிமுறை:**\nநீங்கள் அல்லது நோயாளி மார்பு வலி, பக்கவாதம், முகம் அல்லது கை பலவீனம், பேச்சு குழப்பம் அல்லது கடுமையான காயத்தை உணர்ந்தால், **தயவுசெய்து உடனடியாக அழைக்கவும்:**\n📞 **[0422-2111000](tel:+9104222111000)**\n\nஎங்கள் அவசர சிகிச்சை மற்றும் பக்கவாத மீட்புக் குழு அரசூர் மருத்துவமனையில் 24 மணி நேரமும் தயாராக உள்ளது.`,
        hi: `🚨 **आपातकालीन प्रोटोकॉल:**\nयदि आप या कोई मरीज सीने में तेज दर्द, लकवा/स्ट्रोक के लक्षण, बोलने में कठिनाई या गंभीर आघात का सामना कर रहे हैं, तो तुरंत कॉल करें:\n📞 **[0422-2111000](tel:+9104222111000)**\n\nहमारी 24/7 आपातकालीन टीम अरासुर, कोयंबटूर में तत्काल सेवा के लिए उपलब्ध है।`,
      };

      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: emergencyResponses[lang] || emergencyResponses.en,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isEmergencyAlert: true,
        suggestedActions: [
          { label: "📞 Call Emergency: 0422-2111000", url: "tel:+9104222111000" },
          { label: "📍 Get Directions (Google Maps)", url: "/find-us" },
        ],
      };
    }

    // 2. RETRIEVAL GROUNDING SEARCH
    // Query against verified doctors
    const matchedDoctor = DOCTORS.find(
      (d) =>
        normalized.includes(d.name.toLowerCase()) ||
        normalized.includes(d.specialization.toLowerCase()) ||
        (normalized.includes("rajesh") && d.id.includes("rajesh"))
    );

    if (matchedDoctor) {
      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: `**${matchedDoctor.name}**\n*${matchedDoctor.role}*\n\n**Qualifications:** ${matchedDoctor.qualifications}\n**Specialization:** ${matchedDoctor.specialization}\n**Consultation Days:** ${matchedDoctor.availableDays.join(", ")} (${matchedDoctor.timing})\n\n${matchedDoctor.biography}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: [
          { label: `Book with ${matchedDoctor.name}`, url: `/book-appointment?doctor=${matchedDoctor.id}` },
          { label: "View All Doctors", url: "/doctors" },
        ],
      };
    }

    // Query against Master Health Checkup & Packages
    if (
      normalized.includes("package") ||
      normalized.includes("master health") ||
      normalized.includes("checkup") ||
      normalized.includes("check up") ||
      normalized.includes("3500") ||
      normalized.includes("price") ||
      normalized.includes("cost")
    ) {
      const mhc = HEALTH_PACKAGES[0];
      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: `**${mhc.name} (Special All-in-One Preventive Package)**\n**Official Price:** **₹${mhc.price}** *(Discounted from ₹${mhc.originalPrice})*\n\n**Included in this package:**\n• **Complete Laboratory:** CBC, Blood Sugar, Lipid Profile, Liver Function (LFT), Kidney Function (KFT), Thyroid (TSH), Urine Routine\n• **Tumor Markers:** CA-125 (for women) / PSA (for men)\n• **Advanced Panels:** Bone Health, Electrolytes, Pancreas Profile, Iron Profile, Vitamin Levels\n• **Cardiac:** 12-Lead ECG & Cardiac Plaque Risk Assessment\n• **Clinical:** Full Physical Exam & Senior Physician Consultation\n• **Zero-Cost Bonus:** **Free Home Sample Collection** anywhere in Coimbatore.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: [
          { label: "Book Master Checkup (₹3,500)", url: "/book-appointment?package=master-health-checkup" },
          { label: "Explore All Packages", url: "/health-packages" },
        ],
      };
    }

    // Query against Diagnostics (MRI, CT, DEXA, Mammography, Lab)
    if (normalized.includes("mri") || normalized.includes("scan") || normalized.includes("1.5")) {
      const mri = DIAGNOSTIC_MODALITIES.find((d) => d.slug === "mri")!;
      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: `**${mri.name} – ${mri.subtitle}**\n\n**Technology:** ${mri.specification}\n\nOur 1.5 Tesla MRI provides dedicated high-contrast soft tissue scans for the brain, spine, cranial nerves, joints, and vascular systems. We conduct contrast-enhanced studies for detailed vessel and tumor characterization under US dual board-certified neuroradiology oversight.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: [
          { label: "View MRI Services", url: "/diagnostic-center/mri" },
          { label: "Book Scan Appointment", url: "/book-appointment?dept=diagnostic-imaging" },
        ],
      };
    }

    if (normalized.includes("ct") || normalized.includes("128") || normalized.includes("calcium")) {
      const ct = DIAGNOSTIC_MODALITIES.find((d) => d.slug === "ct")!;
      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: `**${ct.name} – ${ct.subtitle}**\n\n**Key Modalities:**\n• **Low Dose Chest CT** for early lung cancer detection\n• **Coronary Calcium Score (Agatston Score)** for silent heart attack screening\n• **CT Coronary Angiogram** (Non-invasive arterial check)\n• **CT Colonography** (Virtual colonoscopy)\n\nScans take only seconds with up to 80% reduced radiation compared to standard CTs.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: [
          { label: "View CT Services", url: "/diagnostic-center/ct" },
          { label: "Book CT / Calcium Score", url: "/book-appointment?dept=diagnostic-imaging" },
        ],
      };
    }

    if (normalized.includes("mammogram") || normalized.includes("breast") || normalized.includes("dexa") || normalized.includes("bone")) {
      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: `**Women's Health & Bone Diagnostics:**\n• **3D Full-Field Digital Mammography:** High-definition breast cancer detection capable of spotting microcalcifications long before lumps appear.\n• **DEXA Bone Mineral Densitometry (BMD):** Precise measurement of bone density for osteoporosis and whole-body fat/muscle composition.\n\nAll procedures are guided by lady specialists in a comfortable, private environment.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: [
          { label: "Women's Wellness Package", url: "/health-packages" },
          { label: "Book Appointment", url: "/book-appointment" },
        ],
      };
    }

    // Query against Location / Address / Directions
    if (
      normalized.includes("where") ||
      normalized.includes("location") ||
      normalized.includes("address") ||
      normalized.includes("directions") ||
      normalized.includes("map") ||
      normalized.includes("reach")
    ) {
      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: `**Indo States Health Location & Directions:**\n\n📍 **Address:**\n${HOSPITAL_INFO.address}\n*(Near A2B on the Salem-Kochi NH 544 Highway corridor)*\n\n🚗 **Travel Times:**\n• ~15 minutes from Coimbatore International Airport (CJB)\n• ~30 minutes from Coimbatore Junction Railway Station\n• Direct access with ample ground-level patient parking and barrier-free wheelchair access.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: [
          { label: "View Campus Map & Driving Route", url: "/find-us" },
          { label: "Call Reception: 0422-2111000", url: "tel:+9104222111000" },
        ],
      };
    }

    // Query against Booking Instructions
    if (normalized.includes("book") || normalized.includes("appointment") || normalized.includes("register")) {
      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: `**How to Book an Appointment in 4 Easy Steps:**\n\n1. Go to our **[Appointment Booking Engine](/book-appointment)**.\n2. Choose either a **Health Package** (e.g. Master Health Checkup) or a **Specialist Doctor**.\n3. Select your preferred date and time slot.\n4. Enter patient contact details to receive your **Instant Digital Appointment Pass & QR Code**.\n\n*Payment can be completed online or upon arrival at the hospital registration desk.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: [
          { label: "Start Booking Now", url: "/book-appointment" },
          { label: "Check Available Doctors", url: "/doctors" },
        ],
      };
    }

    // Query against ARDOR Charity
    if (normalized.includes("charity") || normalized.includes("ardor") || normalized.includes("donation") || normalized.includes("poor") || normalized.includes("scholarship")) {
      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: `**ARDOR Care Foundation (Non-Profit Wing):**\nIndo States Health founded the ARDOR Care Foundation to provide:\n• Subsidized medical treatment and life-saving interventions for underprivileged patients\n• Free community medical screening camps across rural Coimbatore\n• Educational aid and scholarships for deserving students\n• **Tax Deductibility:** Section 12A & 80G compliant in India, and 501(c)(3) tax-exempt in the USA (Ardor Corporation at ardoronline.com).`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: [
          { label: "Learn About ARDOR Care Foundation", url: "/charity" },
          { label: "Visit ardoronline.com", url: "https://ardoronline.com/" },
        ],
      };
    }

    // Matching general FAQ
    const matchedFaq = FAQS.find(
      (f) =>
        normalized.includes(f.question.toLowerCase().slice(0, 15)) ||
        normalized.split(" ").some((word) => word.length > 4 && f.question.toLowerCase().includes(word))
    );

    if (matchedFaq) {
      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: `**${matchedFaq.question}**\n\n${matchedFaq.answer}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: [
          { label: "Book Appointment", url: "/book-appointment" },
          { label: "View All FAQs", url: "/faq" },
        ],
      };
    }

    // Default Informative Response with Safety Warning
    const defaultResponses: Record<Language, string> = {
      en: `Thank you for contacting Indo States Health. I can assist you with:\n\n• **Master Health Check-up (₹3,500)** details and inclusions\n• Finding dual board-certified doctors like **Dr. Rajesh Rangaswamy**\n• Booking slots for **1.5T MRI, 128-slice CT, DEXA Scan, or 3D Mammograms**\n• Hospital location, operating hours, and free home sample collection\n• **ARDOR Care Foundation** charitable medical aid\n\n*Please note: I am an informational assistant and cannot provide medical diagnosis. How may I guide you today?*`,
      ta: `இண்டோ ஸ்டேட்ஸ் ஹெல்த்திற்கு நன்றி. நான் உங்களுக்கு உதவக்கூடியவை:\n• **மாஸ்டர் ஹெல்த் செக்கப் (₹3,500)** தகவல்கள்\n• மருத்துவர்கள் மற்றும் சிறப்பு நிபுணர்கள் விபரம்\n• **MRI, CT, மேமோகிராம்** பரிசோதனை முன்பதிவு\n• மருத்துவமனை முகவரி மற்றும் இலவச மாதிரி எடுக்கும் வசதி\n\nநான் எவ்வாறு உதவலாம்?`,
      hi: `इंडो स्टेट्स हेल्थ में आपका स्वागत है। मैं निम्न विषयों में आपकी सहायता कर सकता हूँ:\n• **मास्टर हेल्थ चेक-अप (₹3,500)** के विवरण\n• विशेषज्ञ डॉक्टरों की जानकारी\n• **MRI, CT स्कैन, मैमोग्राफी** बुकिंग\n• अस्पताल का पता और निःशुल्क होम सैंपल कलेक्शन\n\nमैं आपकी क्या मदद कर सकता हूँ?`,
    };

    return {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      text: defaultResponses[lang] || defaultResponses.en,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedActions: [
        { label: "Book Master Checkup (₹3,500)", url: "/book-appointment?package=master-health-checkup" },
        { label: "Find a Doctor", url: "/doctors" },
        { label: "Hospital Location & Directions", url: "/find-us" },
        { label: "Frequently Asked Questions", url: "/faq" },
      ],
    };
  }
}

export async function generateIndoCareResponse(
  messages: AIChatMessage[],
  lang: Language = "en"
): Promise<AIChatMessage> {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  const query = lastUserMsg ? lastUserMsg.content : "Hello";
  const result = await IndoCareAIService.processMessage(query, lang);
  return {
    id: result.id,
    role: "assistant",
    content: result.text,
    timestamp: result.timestamp,
    suggestedActions: result.suggestedActions?.map((a) => ({
      label: a.label,
      action: a.action || "navigate",
      url: a.url || "#",
    })),
    isEmergencyAlert: result.isEmergencyAlert,
  };
}

