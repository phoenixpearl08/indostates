import { HOSPITAL_INFO, DOCTORS, DEPARTMENTS, HEALTH_PACKAGES, DIAGNOSTIC_MODALITIES } from "@/data/hospitalData";
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
  "மாரடைப்பு",
  "பக்கவாதம்",
  "சுவாசிக்க முடியவில்லை",
  "அவசரம்",
  "நெஞ்சு வலி",
  "सीना दर्द",
  "दौरा",
  "सांस नहीं आ रही",
  "നെഞ്ചുവേദന",
  "സ്ട്രോക്ക്",
  "ഗുരുതര",
  "ఛాతీ నొప్పి",
  "స్ట్రోక్",
  "గుండెపోటు",
  "ಎದೆ ನೋವು",
  "ಪಾರ್ಶ್ವವಾಯು",
];

// Helper to detect language from query
export function detectQueryLanguage(text: string): Language {
  const t = text.toLowerCase();

  // Tamil script or Tanglish
  if (/[\u0B80-\u0BFF]/.test(text) || /\b(irukka|eppo|venum|epdi|nalaiku|maruthuvar|maruthuvamana|valikuthu|sollunga|pannalama)\b/i.test(t)) {
    return "ta";
  }

  // Malayalam script or Manglish
  if (/[\u0D00-\u0D7F]/.test(text) || /\b(undo|eppo|veanam|enganeya|naale|doctorano|aashupathri)\b/i.test(t)) {
    return "ml";
  }

  // Telugu script or Telugu keywords
  if (/[\u0C00-\u0C7F]/.test(text) || /\b(undha|eppudu|kaavali|ela|repu|dhaactaru|aaspatri)\b/i.test(t)) {
    return "te";
  }

  // Kannada script or Kannada keywords
  if (/[\u0C80-\u0CFF]/.test(text) || /\b(ideya|yaavaga|beku|hege|naale|vaidyaru|aaspatre)\b/i.test(t)) {
    return "kn";
  }

  // Hindi script or Hinglish
  if (/[\u0900-\u097F]/.test(text) || /\b(hai kya|kab|chahiye|kaise|kal|aspataal|dawa)\b/i.test(t)) {
    return "hi";
  }

  return "en";
}

export class IndoCareAIService {
  static async processMessage(userQuery: string, lang: Language = "en"): Promise<ChatMessage> {
    const detectedLang = detectQueryLanguage(userQuery);
    const effectiveLang = detectedLang !== "en" ? detectedLang : lang;
    const normalized = userQuery.toLowerCase().trim();

    // 1. EMERGENCY TRIAGE GATEWAY
    const isEmergency = EMERGENCY_KEYWORDS.some((kw) => normalized.includes(kw));
    if (isEmergency) {
      const emergencyResponses: Record<Language, string> = {
        en: `🚨 **IMMEDIATE EMERGENCY PROTOCOL:**\nIf you or a patient is experiencing acute chest pain, weakness on one side of the body, slurred speech, sudden loss of consciousness, or severe trauma, **DO NOT DELAY.**\n\n**Immediately contact Indo States Health 24/7 Hotline:**\n📞 **[0422-2111000](tel:+9104222111000)**\n\nOur Code Stroke & Acute Trauma Resuscitation Team is standing by 24/7 at Arasur, Coimbatore (NH 544).`,
        ta: `🚨 **அவசர சிகிச்சை நெறிமுறை:**\nநோயாளிக்கு கடுமையான மார்பு வலி, பக்கவாதம், திடீர் மயக்கம் அல்லது கடுமையான காயம் ஏற்பட்டால், தயவுசெய்து தாமதிக்க வேண்டாம்.\n\n**உடனடியாக அழைக்கவும் 24/7 அவசர உதவி எண்:**\n📞 **[0422-2111000](tel:+9104222111000)**\n\nஎங்கள் அவசர சிகிச்சை மற்றும் பக்கவாத மீட்புக் குழு அரசூர் மருத்துவமனையில் 24 மணி நேரமும் தயாராக உள்ளது.`,
        hi: `🚨 **आपातकालीन प्रोटोकॉल:**\nयदि मरीज सीने में तेज दर्द, स्ट्रोक, बोलने में कठिनाई या गंभीर चोट का सामना कर रहा है, तो तुरंत कॉल करें:\n📞 **[0422-2111000](tel:+9104222111000)**\n\nहमारी 24/7 आपातकालीन टीम अरासुर, कोयंबटूर में तत्काल सेवा के लिए उपलब्ध है।`,
        ml: `🚨 **അടിയന്തിര എമർജൻസി പ്രോട്ടോക്കോൾ:**\nനെഞ്ചുവേദന, സ്ട്രോക്ക് ലക്ഷണങ്ങൾ, ശ്വാസതടസ്സം അല്ലെങ്കിൽ ഗുരുതരമായ അപകടങ്ങൾ ഉണ്ടായാൽ ഉടൻ വിളിക്കുക:\n📞 **[0422-2111000](tel:+9104222111000)**\n\nഇൻഡോ സ്റ്റേറ്റ്സ് ഹെൽത്ത് എമർജൻസി ടീം അരസൂർ, കോയമ്പത്തൂരിൽ 24 മണിക്കൂറും സജ്ജമാണ്.`,
        te: `🚨 **అత్యవసర ఎమర్జెన్సీ ప్రోటోకాల్:**\nతీవ్రమైన ఛాతీ నొప్పి, పక్షవాతం లేదా శ్వాస తీసుకోవడంలో ఇబ్బంది ఉంటే వెంటనే కాల్ చేయండి:\n📞 **[0422-2111000](tel:+9104222111000)**\n\nఅరసూర్, కోయంబత్తూరు లో మా 24/7 ఎమర్జెన్సీ టీమ్ సిద్ధంగా ఉంది.`,
        kn: `🚨 **ತುರ್ತು ಚಿಕಿತ್ಸಾ ಪ್ರೋಟೋಕಾಲ್:**\nಎದೆ ನೋವು, ಪಾರ್ಶ್ವವಾಯು ಅಥವಾ ತೀವ್ರ ಗಾಯಗಳ ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ತಕ್ಷಣ ಕರೆ ಮಾಡಿ:\n📞 **[0422-2111000](tel:+9104222111000)**\n\nಅರಸೂರು, ಕೊಯಮತ್ತೂರಿನಲ್ಲಿ ನಮ್ಮ 24/7 ತುರ್ತು ವೈದ್ಯಕೀಯ ತಂಡ ಸದಾ ಸಿದ್ಧವಿದೆ.`,
      };

      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: emergencyResponses[effectiveLang] || emergencyResponses.en,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isEmergencyAlert: true,
        suggestedActions: [
          { label: "📞 Call 24/7 Emergency: 0422-2111000", url: "tel:+9104222111000" },
          { label: "📍 Get Directions (Arasur, NH 544)", url: "/find-us" },
        ],
      };
    }

    // 2. APPOINTMENT AVAILABILITY / SCHEDULE QUERY (e.g. "Tomorrow doctor appointment irukka?")
    if (
      normalized.includes("appointment") ||
      normalized.includes("irukka") ||
      normalized.includes("booking") ||
      normalized.includes("slot") ||
      normalized.includes("book") ||
      normalized.includes("schedule") ||
      normalized.includes("tomorrow") ||
      normalized.includes("nalaiku") ||
      normalized.includes("timing") ||
      normalized.includes("hours")
    ) {
      const scheduleReplies: Record<Language, string> = {
        en: `Yes, doctor appointments and diagnostic slots are available! Our outpatient consultations run **Monday to Friday from 9:00 AM to 5:00 PM** and **Saturday to Sunday from 10:00 AM to 6:00 PM** (Emergency is 24/7).\n\nYou can select your preferred specialist (such as Dr. Rajesh Rangaswamy for Neurovascular / Stroke or Dr. Logesh for Emergency & Acute Care) and instantly book with confirmed digital QR pass.`,
        ta: `ஆம், மருத்துவ சந்திப்புகள் மற்றும் பரிசோதனை முன்பதிவு ஸ்லாட்டுகள் உள்ளன! புறநோயாளி ஆலோசனை நேரம் **திங்கள் முதல் வெள்ளி வரை காலை 9:00 மணி முதல் மாலை 5:00 மணி வரையிலும்**, **சனி-ஞாயிறுகளில் காலை 10:00 மணி முதல் மாலை 6:00 மணி வரையிலும்** செயல்படுகிறது (அவசர சிகிச்சை 24/7).\n\nநீங்கள் விரும்பும் மருத்துவரைத் தேர்ந்தெடுத்து டிஜிட்டல் பாஸுடன் உடனே முன்பதிவு செய்து கொள்ளலாம்.`,
        hi: `हाँ, डॉक्टर अपॉइंटमेंट और जांच स्लॉट उपलब्ध हैं! ओपीडी का समय **सोमवार से शुक्रवार सुबह 9:00 बजे से शाम 5:00 बजे तक** और **शनिवार-रविवार सुबह 10:00 बजे से शाम 6:00 बजे तक** है (इमरजेंसी 24/7 चालू है)।\n\nआप अपनी पसंद के विशेषज्ञ को चुनकर तुरंत कन्फर्म डिजिटल पास के साथ अपॉइंटमेंट बुक कर सकते हैं।`,
        ml: `അതെ, ഡോക്ടർ അപ്പോയിന്റ്മെന്റുകൾ ലഭ്യമാണ്! ഒപിഡി സമയം **തിങ്കൾ മുതൽ വെള്ളി വരെ രാവിലെ 9:00 മുതൽ വൈകുന്നേരം 5:00 വരെയും**, **ശനി-ഞായർ ദിവസങ്ങളിൽ രാവിലെ 10:00 മുതൽ വൈകുന്നേരം 6:00 വരെയും** ആണ് (അടിയന്തിര പരിചരണം 24/7 ലഭ്യമാണ്).\n\nതാങ്കൾക്ക് വിദഗ്ദ്ധ ഡോക്ടറെ തിരഞ്ഞെടുത്ത് തത്സമയം ബുക്ക് ചെയ്യാവുന്നതാണ്.`,
        te: `అవును, డాక్టర్ అపాయింట్‌మెంట్లు అందుబాటులో ఉన్నాయి! ఓపీడీ వేళలు **సోమవారం నుండి శుక్రవారం ఉదయం 9:00 నుండి సాయంత్రం 5:00 వరకు**, **శని-ఆదివారాల్లో ఉదయం 10:00 నుండి సాయంత్రం 6:00 వరకు** (ఎమర్జెన్సీ 24/7 అందుబాటులో ఉంటుంది).\n\nమీరు మీకు నచ్చిన స్పెషలిస్ట్‌ను ఎంచుకుని వెంటనే డిజిటల్ పాస్‌తో బుక్ చేసుకోవచ్చు.`,
        kn: `ಹೌದು, ವೈದ್ಯರ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಲಭ್ಯವಿದೆ! ಒಪಿಡಿ ಸಮಯ **ಸೋಮವಾರದಿಂದ ಶುಕ್ರವಾರದವರೆಗೆ ಬೆಳಿಗ್ಗೆ 9:00 ರಿಂದ ಸಂಜೆ 5:00 ರವರೆಗೆ** ಮತ್ತು **ಶನಿ-ಭಾನುವಾರ ಬೆಳಿಗ್ಗೆ 10:00 ರಿಂದ ಸಂಜೆ 6:00 ರವರೆಗೆ** (ತುರ್ತು ಸೇವೆ 24/7 ಲಭ್ಯವಿದೆ).\n\nನೀವು ತಜ್ಞ ವೈದ್ಯರನ್ನು ಆಯ್ಕೆಮಾಡಿ ಡಿಜಿಟಲ್ ಪಾಸ್‌ನೊಂದಿಗೆ ತಕ್ಷಣ ಬುಕ್ ಮಾಡಬಹುದು.`,
      };

      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: scheduleReplies[effectiveLang] || scheduleReplies.en,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: [
          { label: "📅 Book Doctor Appointment Now", url: "/book-appointment" },
          { label: "👨‍⚕️ View Specialists Directory", url: "/doctors" },
          { label: "📞 Reception Desk: 0422-2111000", url: "tel:+9104222111000" },
        ],
      };
    }

    // 3. MASTER HEALTH CHECKUP & PREVENTIVE PACKAGES (₹3,500)
    if (
      normalized.includes("package") ||
      normalized.includes("master health") ||
      normalized.includes("checkup") ||
      normalized.includes("check up") ||
      normalized.includes("3500") ||
      normalized.includes("price") ||
      normalized.includes("cost") ||
      normalized.includes("kattanam")
    ) {
      const mhc = HEALTH_PACKAGES[0];
      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: `**${mhc.name} (Complete Preventive Screening)**\n**Special Hospital Fee:** **₹${mhc.price}** *(Full value ₹${mhc.originalPrice})*\n\n**Included investigations:**\n• **Comprehensive Laboratory:** CBC, Fasting Blood Sugar, HbA1c, Lipid Profile, Liver Function (LFT), Kidney Function (KFT), Thyroid (TSH), Urine Analysis\n• **Cardiovascular:** 12-Lead ECG & Coronary Risk Factor Review\n• **Radiology & Diagnostics:** Ultrasound Abdomen & Chest X-Ray\n• **Physician Consultation:** Full review with senior physician\n• **Home Sample Pickup:** **Free Home Blood Collection** included across Coimbatore.\n\n*Preparation:* 10 to 12 hours overnight fasting recommended.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: [
          { label: "Book Master Health Checkup (₹3,500)", url: "/book-appointment?package=master-health-checkup" },
          { label: "View All Preventive Health Packages", url: "/health-packages" },
        ],
      };
    }

    // 4. DIAGNOSTIC SCANS (MRI, CT, DEXA, Mammography, Lab)
    if (normalized.includes("mri") || normalized.includes("scan") || normalized.includes("ct") || normalized.includes("dexa") || normalized.includes("mammography")) {
      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: `**IndoStates Advanced Diagnostic Center Modalities:**\n\n• **1.5 Tesla Silent High-Field MRI:** Neurovascular MRA, stroke imaging, and spine scans.\n• **128-Slice Low-Dose CT:** Cardiac CT coronary angiography & calcium score.\n• **3D Digital Mammography:** High-definition early breast lesion detection with minimal radiation.\n• **DEXA Bone Mineral Densitometry:** Fast osteoporosis and fracture risk evaluation.\n• **Automated Central Pathology Lab:** Fast sample turnaround with free home collection.\n\nReports are released with verified pathologist signatures directly to your patient portal.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: [
          { label: "1.5T MRI Details", url: "/diagnostic-center/mri" },
          { label: "128-Slice CT Details", url: "/diagnostic-center/ct" },
          { label: "Book Diagnostic Appointment", url: "/book-appointment" },
        ],
      };
    }

    // 5. DOCTOR MATCHING QUERY
    const matchedDoctor = DOCTORS.find(
      (d) =>
        normalized.includes(d.name.toLowerCase()) ||
        normalized.includes(d.specialization.toLowerCase()) ||
        (normalized.includes("rajesh") && d.id.includes("rajesh")) ||
        (normalized.includes("logesh") && d.id.includes("logesh")) ||
        (normalized.includes("vani") && d.id.includes("vani"))
    );

    if (matchedDoctor) {
      const matchedDept = DEPARTMENTS.find((dept) => dept.id === matchedDoctor.departmentId);
      const deptName = matchedDept ? matchedDept.name : matchedDoctor.specialization;
      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: `**${matchedDoctor.name}**\n*${matchedDoctor.role}*\n\n• **Department:** ${deptName}\n• **Qualifications:** ${matchedDoctor.qualifications}\n• **Specialty:** ${matchedDoctor.specialization}\n• **Consultation Days:** ${matchedDoctor.availableDays.join(", ")} (${matchedDoctor.timing})\n\n${matchedDoctor.biography}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: [
          { label: `Book Appointment with ${matchedDoctor.name}`, url: `/book-appointment?doctor=${matchedDoctor.id}` },
          { label: "View All Doctors", url: "/doctors" },
        ],
      };
    }

    // 6. DEFAULT GENERAL WELCOME / ASSISTANCE
    const defaultReplies: Record<Language, string> = {
      en: `Welcome to **IndoStates Help Desk**! I am here to assist you with verified information regarding our hospital in Arasur, Coimbatore.\n\nHow may I help you today? You can ask about:\n• Booking an appointment with our specialist physicians\n• ₹3,500 Master Health Checkup & free home sample collection\n• 1.5 Tesla MRI & 128-slice CT scan schedules\n• Emergency 24/7 acute trauma & code stroke helpline`,
      ta: `**இண்டோஸ்டேட்ஸ் உதவி மையத்திற்கு** நல்வரவு! அரசூர், கோவை மருத்துவமனை பற்றிய தகவல்களை வழங்க நான் தயாராக உள்ளேன்.\n\n• மருத்துவர் சந்திப்பு முன்பதிவு\n• ₹3,500 மாஸ்டர் ஹெல்த் செக்கப் & இலவச ரத்த மாதிரி எடுக்கும் வசதி\n• 1.5T MRI மற்றும் 128-ஸ்லைஸ் CT பரிசோதனைகள்\n• 24/7 அவசர சிகிச்சை மற்றும் பக்கவாத உதவி எண் (0422-2111000) குறித்து கேட்கலாம்.`,
      hi: `**इंडोस्टेट्स हेल्प डेस्क** में आपका स्वागत है! मैं कोयंबटूर स्थित हमारे अस्पताल के बारे में आधिकारिक जानकारी देने के लिए उपलब्ध हूँ।\n\nआप पूछ सकते हैं:\n• विशेषज्ञ डॉक्टरों के साथ अपॉइंटमेंट बुकिंग\n• ₹3,500 मास्टर हेल्थ चेकअप एवं फ्री होम सैंपल कलेक्शन\n• 1.5T MRI व 128-स्लाइस CT स्कैन की जानकारी\n• 24/7 आपातकालीन सहायता (0422-2111000)`,
      ml: `**ഇൻഡോസ്റ്റേറ്റ്സ് ഹെൽപ്പ് ഡെസ്കിലേക്ക്** സ്വാഗതം! കോയമ്പത്തൂരിലെ ഞങ്ങളുടെ ആശുപത്രി വിവരങ്ങളിൽ ഞാൻ താങ്കളെ സഹായിക്കാം.\n\nഡോക്ടർ അപ്പോയിന്റ്മെന്റുകൾ, ₹3,500 മാസ്റ്റർ ഹെൽത്ത് ചെക്കപ്പ്, 1.5T MRI, 24/7 എമർജൻസി സഹായം എന്നിവയെക്കുറിച്ച് ചോദിക്കാവുന്നതാണ്.`,
      te: `**ఇండోస్టేట్స్ హెల్ప్ డెస్క్** కు స్వాగతం! కోయంబత్తూర్ ఆసుపత్రి వివరాలపై మీకు సహాయం చేయడానికి నేను సిద్ధంగా ఉన్నాను.\n\nవైద్యుల అపాయింట్‌మెంట్లు, ₹3,500 మాస్టర్ హెల్త్ చెకప్, 1.5T MRI, 24/7 ఎమర్జెన్సీ సేవల గురించి మీరు అడగవచ్చు.`,
      kn: `**ಇಂಡೋಸ್ಟೇಟ್ಸ್ ಸಹಾಯ ಕೇಂದ್ರಕ್ಕೆ** ಸುಸ್ವಾಗತ! ಕೊಯಮತ್ತೂರಿನ ನಮ್ಮ ಆಸ್ಪತ್ರೆಯ ಅಧಿಕೃತ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ.\n\nವೈದ್ಯರ ಅಪಾಯಿಂಟ್ಮೆಂಟ್, ₹3,500 ಮಾಸ್ಟರ್ ಹೆಲ್ತ್ ಚೆಕಪ್, 1.5T MRI, 24/7 ತುರ್ತು ಸೇವೆಗಳ ಬಗ್ಗೆ ವಿಚಾರಿಸಬಹುದು.`,
    };

    return {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      text: defaultReplies[effectiveLang] || defaultReplies.en,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedActions: [
        { label: "Book Doctor Appointment", url: "/book-appointment" },
        { label: "Master Health Checkup (₹3,500)", url: "/health-packages" },
        { label: "Find Doctors by Specialty", url: "/doctors" },
      ],
    };
  }
}

export async function generateIndoCareResponse(
  userQuery: string,
  lang: Language = "en"
): Promise<ChatMessage> {
  return IndoCareAIService.processMessage(userQuery, lang);
}
