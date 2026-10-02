export type Language = "en" | "ta" | "hi";

export interface Translations {
  nav: {
    home: string;
    about: string;
    visionMission: string;
    leadership: string;
    doctors: string;
    departments: string;
    preventiveHealth: string;
    diagnosticCenter: string;
    masterCheckup: string;
    emergency: string;
    contact: string;
    charity: string;
    career: string;
    faq: string;
    patientPortal: string;
    doctorPortal: string;
    adminPortal: string;
    bookAppointment: string;
  };
  hero: {
    welcome: string;
    title: string;
    subtitle: string;
    ctaBook: string;
    ctaDoctors: string;
    ctaEmergency: string;
    ctaServices: string;
  };
  emergency: {
    banner: string;
    callNow: string;
    hotline: string;
    hours: string;
    address: string;
  };
  masterHealth: {
    title: string;
    tagline: string;
    price: string;
    testsCount: string;
    bookNow: string;
    homeCollection: string;
  };
  assistant: {
    name: string;
    badge: string;
    greeting: string;
    placeholder: string;
    disclaimer: string;
  };
  common: {
    knowMore: string;
    learnMore: string;
    viewAll: string;
    searchPlaceholder: string;
    close: string;
    confirmed: string;
    cancel: string;
    back: string;
    next: string;
    submit: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      visionMission: "Vision & Mission",
      leadership: "Leadership",
      doctors: "Doctors",
      departments: "Departments",
      preventiveHealth: "Preventive Health",
      diagnosticCenter: "Diagnostic Center",
      masterCheckup: "Master Health Checkup",
      emergency: "Emergency",
      contact: "Contact",
      charity: "Charity (ARDOR)",
      career: "Careers",
      faq: "FAQ",
      patientPortal: "Patient Portal",
      doctorPortal: "Doctor Login",
      adminPortal: "Admin Portal",
      bookAppointment: "Book Appointment",
    },
    hero: {
      welcome: "Welcome to Indo States Health",
      title: "State-of-the-Art Healthcare for the People of India",
      subtitle:
        "Founded by dual US and Indian board-certified specialists. Advanced 1.5T MRI, 128-slice CT, and holistic preventive medicine to eliminate health disparities.",
      ctaBook: "Book Appointment",
      ctaDoctors: "Find a Doctor",
      ctaEmergency: "Emergency Care",
      ctaServices: "Explore Services",
    },
    emergency: {
      banner: "24/7 Rapid Emergency & Code Stroke Care Hotline",
      callNow: "Call 0422-2111000",
      hotline: "0422-2111000",
      hours: "Available 24 Hours / 7 Days",
      address: "10/77 - D Sengodagownden Pudur, Arasur, Coimbatore - 641407",
    },
    masterHealth: {
      title: "Master Health Check-up",
      tagline: "A Complete Preventive Screening — All in One Visit",
      price: "₹ 3,500",
      testsCount: "25+ Diagnostic Parameters & Panels",
      bookNow: "Book Master Checkup",
      homeCollection: "Free Home Blood Sample Collection Included",
    },
    assistant: {
      name: "IndoCare AI",
      badge: "Hospital Assistant",
      greeting:
        "Hello! I am IndoCare AI, your official guide to Indo States Health. How can I assist you with appointment booking, doctor schedules, diagnostic tests, or hospital services today?",
      placeholder: "Ask about appointments, packages, doctors, or hospital services...",
      disclaimer:
        "IndoCare AI provides general informational assistance only. For medical emergencies, immediately dial 0422-2111000.",
    },
    common: {
      knowMore: "Know more",
      learnMore: "Learn more",
      viewAll: "View all",
      searchPlaceholder: "Search doctors, departments, tests, health packages...",
      close: "Close",
      confirmed: "Confirmed",
      cancel: "Cancel",
      back: "Back",
      next: "Next",
      submit: "Submit",
    },
  },
  ta: {
    nav: {
      home: "முகப்பு",
      about: "எங்களைப் பற்றி",
      visionMission: "நோக்கம் & தொலைநோக்கு",
      leadership: "நிர்வாகக் குழு",
      doctors: "மருத்துவர்கள்",
      departments: "துறைகள்",
      preventiveHealth: "தடுப்பு நல்வாழ்வு மையம்",
      diagnosticCenter: "பரிசோதனை மையம்",
      masterCheckup: "மாஸ்டர் ஹெல்த் செக்கப்",
      emergency: "அவசர சிகிச்சை",
      contact: "தொடர்புக்கு",
      charity: "அறக்கட்டளை (ஆர்டோர்)",
      career: "வேலைவாய்ப்புகள்",
      faq: "கேள்வி-பதில்கள்",
      patientPortal: "நோயாளி தளம்",
      doctorPortal: "மருத்துவர் உள்நுழைவு",
      adminPortal: "நிர்வாக தளம்",
      bookAppointment: "முன்பதிவு செய்க",
    },
    hero: {
      welcome: "இண்டோ ஸ்டேட்ஸ் ஹெல்த்திற்கு நல்வரவு",
      title: "இந்திய மக்களுக்கு அதிநவீன சர்வதேச தரத்திலான மருத்துவ சேவை",
      subtitle:
        "அமெரிக்க மற்றும் இந்திய தகுதிபெற்ற மருத்துவ நிபுணர்களால் தொடங்கப்பட்டது. 1.5T MRI, 128-ஸ்லைஸ் CT மற்றும் தடுப்பு மருத்துவ வசதிகள்.",
      ctaBook: "முன்பதிவு செய்க",
      ctaDoctors: "மருத்துவரை கண்டறிய",
      ctaEmergency: "அவசர சிகிச்சை",
      ctaServices: "சேவைகள்",
    },
    emergency: {
      banner: "24/7 அவசர சிகிச்சை மற்றும் பக்கவாத உதவி எண்",
      callNow: "அழைக்க: 0422-2111000",
      hotline: "0422-2111000",
      hours: "24 மணி நேரமும் செயல்படுகிறது",
      address: "10/77 - D செங்கோடகவுண்டன்புதூர், அரசூர், கோவை - 641407",
    },
    masterHealth: {
      title: "மாஸ்டர் ஹெல்த் செக்கப்",
      tagline: "முழுமையான உடல் நலப் பரிசோதனை — ஒரே நாளில்",
      price: "₹ 3,500",
      testsCount: "25+ முக்கியமான உடல் பரிசோதனைகள்",
      bookNow: "இப்போதே பதிவு செய்க",
      homeCollection: "வீட்டிற்கே வந்து இலவச ரத்த மாதிரி எடுக்கும் வசதி",
    },
    assistant: {
      name: "இண்டோகேர் AI",
      badge: "மருத்துவமனை வழிகாட்டி",
      greeting:
        "வணக்கம்! நான் இண்டோகேர் AI, இண்டோ ஸ்டேட்ஸ் ஹெல்த்தின் தகவல் வழிகாட்டி. மருத்துவ சந்திப்பு, மருத்துவர்கள் மற்றும் பரிசோதனைகள் குறித்து நான் எவ்வாறு உதவலாம்?",
      placeholder: "முன்பதிவு, மருத்துவர்கள், பரிசோதனைகள் பற்றி கேட்கவும்...",
      disclaimer: "இண்டோகேர் AI தகவல் வழிகாட்டுதலுக்கு மட்டுமே. அவசர நிலைக்கு 0422-2111000 என்ற எண்ணை அழைக்கவும்.",
    },
    common: {
      knowMore: "மேலும் அறிய",
      learnMore: "விவரங்கள்",
      viewAll: "அனைத்தையும் காண்க",
      searchPlaceholder: "மருத்துவர்கள், துறைகள், பரிசோதனைகள் தேடவும்...",
      close: "மூடு",
      confirmed: "உறுதியானது",
      cancel: "ரத்து செய்",
      back: "பின்னால்",
      next: "அடுத்து",
      submit: "சமர்ப்பி",
    },
  },
  hi: {
    nav: {
      home: "होम",
      about: "हमारे बारे में",
      visionMission: "विजन एवं मिशन",
      leadership: "नेतृत्व टीम",
      doctors: "डॉक्टर्स",
      departments: "विभाग",
      preventiveHealth: "निवारक स्वास्थ्य केंद्र",
      diagnosticCenter: "डायग्नोस्टिक सेंटर",
      masterCheckup: "मास्टर हेल्थ चेकअप",
      emergency: "इमरजेंसी",
      contact: "संपर्क करें",
      charity: "चैरिटी (आर्डोर)",
      career: "कैरियर",
      faq: "अक्सर पूछे जाने वाले सवाल",
      patientPortal: "रोगी पोर्टल",
      doctorPortal: "डॉक्टर लॉगिन",
      adminPortal: "एडमिन पोर्टल",
      bookAppointment: "अपॉइंटमेंट बुक करें",
    },
    hero: {
      welcome: "इंडो स्टेट्स हेल्थ में आपका स्वागत है",
      title: "भारत के लोगों के लिए विश्वस्तरीय और अत्याधुनिक स्वास्थ्य सेवा",
      subtitle:
        "अमेरिका और भारत के बोर्ड-प्रमाणित विशेषज्ञों द्वारा स्थापित। 1.5T MRI, 128-स्लाइस CT और निवारक चिकित्सा का आधुनिक केंद्र।",
      ctaBook: "अपॉइंटमेंट बुक करें",
      ctaDoctors: "डॉक्टर खोजें",
      ctaEmergency: "इमरजेंसी सहायता",
      ctaServices: "सेवाएं देखें",
    },
    emergency: {
      banner: "24/7 आपातकालीन एवं स्ट्रोक केयर हेल्पलाइन",
      callNow: "कॉल करें 0422-2111000",
      hotline: "0422-2111000",
      hours: "24 घंटे उपलब्ध",
      address: "10/77 - D सेनगोडागौंडर पुदूर, अरासुर, कोयंबटूर - 641407",
    },
    masterHealth: {
      title: "मास्टर हेल्थ चेक-अप",
      tagline: "एक ही यात्रा में संपूर्ण निवारक स्वास्थ्य जांच",
      price: "₹ 3,500",
      testsCount: "25+ महत्वपूर्ण लैब परीक्षण व स्कैन",
      bookNow: "अभी बुक करें",
      homeCollection: "निःशुल्क होम सैंपल कलेक्शन सुविधा उपलब्ध",
    },
    assistant: {
      name: "इंडोकेयर AI",
      badge: "डिजिटल सहायक",
      greeting:
        "नमस्ते! मैं इंडोकेयर AI हूँ, इंडो स्टेट्स हेल्थ का आधिकारिक सहायक। मैं अपॉइंटमेंट, डॉक्टरों और परीक्षणों से संबंधित आपकी क्या सहायता कर सकता हूँ?",
      placeholder: "अपॉइंटमेंट, डॉक्टर या टेस्ट के बारे में पूछें...",
      disclaimer: "इंडोकेयर AI केवल जानकारी के लिए है। आपात स्थिति में तुरंत 0422-2111000 पर संपर्क करें।",
    },
    common: {
      knowMore: "अधिक जानें",
      learnMore: "विवरण",
      viewAll: "सभी देखें",
      searchPlaceholder: "डॉक्टर, विभाग, टेस्ट या पैकेज खोजें...",
      close: "बंद करें",
      confirmed: "पुष्टीकृत",
      cancel: "रद्द करें",
      back: "पीछे",
      next: "आगे",
      submit: "जमा करें",
    },
  },
};
