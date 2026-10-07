export type Language = "en" | "ta" | "hi" | "ml" | "te" | "kn";

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
    helpDesk: string;
    myDashboard: string;
    logout: string;
    profile: string;
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
    status: string;
    action: string;
    save: string;
    edit: string;
    delete: string;
    loading: string;
  };
  dashboard: {
    patient: string;
    doctor: string;
    admin: string;
    appointments: string;
    prescriptions: string;
    labReports: string;
    timeline: string;
    family: string;
    profile: string;
    settings: string;
    notifications: string;
    opdQueue: string;
    vitals: string;
    diagnosis: string;
    overview: string;
    staffManagement: string;
    doctorManagement: string;
    deptManagement: string;
    auditLogs: string;
    hmsMonitor: string;
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
      helpDesk: "IndoStates Help Desk",
      myDashboard: "My Dashboard",
      logout: "Log Out",
      profile: "My Profile",
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
      name: "IndoStates Help Desk",
      badge: "Hospital Assistant",
      greeting:
        "Hello! I am IndoStates Help Desk, your official guide to Indo States Health. How can I assist you with appointment booking, doctor schedules, diagnostic tests, or hospital services today?",
      placeholder: "Ask about appointments, packages, doctors, or hospital services...",
      disclaimer:
        "IndoStates Help Desk provides general informational assistance only. For medical emergencies, immediately dial 0422-2111000.",
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
      status: "Status",
      action: "Action",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      loading: "Loading...",
    },
    dashboard: {
      patient: "Patient Portal",
      doctor: "Doctor OPD Console",
      admin: "Hospital Administration Center",
      appointments: "Appointments",
      prescriptions: "Digital Prescriptions",
      labReports: "Lab Reports",
      timeline: "Medical Timeline",
      family: "Family Members",
      profile: "My Profile",
      settings: "Settings",
      notifications: "Notifications",
      opdQueue: "OPD Queue",
      vitals: "Vitals",
      diagnosis: "Diagnosis & Notes",
      overview: "Overview",
      staffManagement: "Staff Management",
      doctorManagement: "Doctor Directory",
      deptManagement: "Departments",
      auditLogs: "Audit Logs",
      hmsMonitor: "HMS Monitoring",
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
      helpDesk: "இண்டோஸ்டேட்ஸ் உதவி மையம்",
      myDashboard: "எனது தளம்",
      logout: "வெளியேறு",
      profile: "சுயவிவரம்",
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
      name: "இண்டோஸ்டேட்ஸ் உதவி மையம்",
      badge: "மருத்துவமனை வழிகாட்டி",
      greeting:
        "வணக்கம்! நான் இண்டோஸ்டேட்ஸ் உதவி மையம், மருத்துவமனை வழிகாட்டி. முன்பதிவு, மருத்துவர்கள் மற்றும் பரிசோதனைகள் குறித்து நான் எவ்வாறு உதவலாம்?",
      placeholder: "முன்பதிவு, மருத்துவர்கள், பரிசோதனைகள் பற்றி கேட்கவும்...",
      disclaimer: "இண்டோஸ்டேட்ஸ் உதவி மையம் தகவல் வழிகாட்டுதலுக்கு மட்டுமே. அவசர நிலைக்கு 0422-2111000 என்ற எண்ணை அழைக்கவும்.",
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
      status: "நிலை",
      action: "செயல்",
      save: "சேமி",
      edit: "திருத்து",
      delete: "நீக்கு",
      loading: "ஏற்றப்படுகிறது...",
    },
    dashboard: {
      patient: "நோயாளி தளம்",
      doctor: "மருத்துவர் புறநோயாளி தளம்",
      admin: "மருத்துவமனை நிர்வாக மையம்",
      appointments: "சந்திப்புகள்",
      prescriptions: "மருந்துச் சீட்டுகள்",
      labReports: "பரிசோதனை அறிக்கைகள்",
      timeline: "மருத்துவ வரலாறு",
      family: "குடும்ப உறுப்பினர்கள்",
      profile: "சுயவிவரம்",
      settings: "அமைப்புகள்",
      notifications: "அறிவிப்புகள்",
      opdQueue: "புறநோயாளி வரிசை",
      vitals: "உடல்நிலைக் குறியீடுகள்",
      diagnosis: "பரிசோதனை & குறிப்புகள்",
      overview: "கண்ணோட்டம்",
      staffManagement: "பணியாளர் நிர்வாகம்",
      doctorManagement: "மருத்துவர் பட்டியல்",
      deptManagement: "துறைகள்",
      auditLogs: "தணிக்கை பதிவுகள்",
      hmsMonitor: "மருத்துவமனை கண்காணிப்பு",
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
      helpDesk: "इंडोस्टेट्स हेल्प डेस्क",
      myDashboard: "मेरा डैशबोर्ड",
      logout: "लॉग आउट",
      profile: "मेरी प्रोफाइल",
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
      name: "इंडोस्टेट्स हेल्प डेस्क",
      badge: "डिजिटल सहायक",
      greeting:
        "नमस्ते! मैं इंडोस्टेट्स हेल्प डेस्क हूँ, इंडो स्टेट्स हेल्थ का आधिकारिक सहायक। मैं अपॉइंटमेंट, डॉक्टरों और परीक्षणों से संबंधित आपकी क्या सहायता कर सकता हूँ?",
      placeholder: "अपॉइंटमेंट, डॉक्टर या टेस्ट के बारे में पूछें...",
      disclaimer: "इंडोस्टेट्स हेल्प डेस्क केवल जानकारी के लिए है। आपात स्थिति में तुरंत 0422-2111000 पर संपर्क करें।",
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
      status: "स्थिति",
      action: "कार्रवाई",
      save: "सहेजें",
      edit: "संपादित करें",
      delete: "हटाएं",
      loading: "लोड हो रहा है...",
    },
    dashboard: {
      patient: "रोगी पोर्टल",
      doctor: "डॉक्टर ओपीडी कंसोल",
      admin: "अस्पताल प्रशासन केंद्र",
      appointments: "अपॉइंटमेंट्स",
      prescriptions: "डिजिटल नुस्खे",
      labReports: "लैब रिपोर्ट्स",
      timeline: "मेडिकल टाइमलाइन",
      family: "परिवार के सदस्य",
      profile: "प्रोफाइल",
      settings: "सेटिंग्स",
      notifications: "सूचनाएं",
      opdQueue: "ओपीडी कतार",
      vitals: "शारीरिक संकेत (वाइटल्स)",
      diagnosis: "निदान एवं टिप्पणियां",
      overview: "सिंहावलोकन",
      staffManagement: "कर्मचारी प्रबंधन",
      doctorManagement: "डॉक्टर सूची",
      deptManagement: "विभाग",
      auditLogs: "ऑडिट लॉग्स",
      hmsMonitor: "एचएमएस निगरानी",
    },
  },
  ml: {
    nav: {
      home: "ഹോം",
      about: "ഞങ്ങളെക്കുറിച്ച്",
      visionMission: "ലക്ഷ്യം & ദർശനം",
      leadership: "നേതൃത്വം",
      doctors: "ഡോക്ടർമാർ",
      departments: "ഡിപ്പാർട്ട്മെന്റുകൾ",
      preventiveHealth: "പ്രിവന്റീവ് ഹെൽത്ത്",
      diagnosticCenter: "ഡയഗ്നോസ്റ്റിക് സെന്റർ",
      masterCheckup: "മാസ്റ്റർ ഹെൽത്ത് ചെക്കപ്പ്",
      emergency: "അടിയന്തിര വിഭാഗം",
      contact: "ബന്ധപ്പെടുക",
      charity: "ആർഡോർ ഫൗണ്ടേഷൻ",
      career: "കരിയർ",
      faq: "പതിവുചോദ്യങ്ങൾ",
      patientPortal: "പേഷ്യന്റ് പോർട്ടൽ",
      doctorPortal: "ഡോക്ടർ ലോഗിൻ",
      adminPortal: "അഡ്മിൻ പോർട്ടൽ",
      bookAppointment: "അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക",
      helpDesk: "ഇൻഡോസ്റ്റേറ്റ്സ് ഹെൽപ്പ് ഡെസ്ക്",
      myDashboard: "എന്റെ ഡാഷ്‌ബോർഡ്",
      logout: "ലോഗ് ഔട്ട്",
      profile: "എന്റെ പ്രൊഫൈൽ",
    },
    hero: {
      welcome: "ഇൻഡോ സ്റ്റേറ്റ്സ് ഹെൽത്തിലേക്ക് സ്വാഗതം",
      title: "ഇന്ത്യയിലെ ജനങ്ങൾക്കായി അത്യാധുനിക ആരോഗ്യ സംരക്ഷണം",
      subtitle:
        "യുഎസ്, ഇന്ത്യൻ ബോർഡ് അംഗീകൃത വിദഗ്ദ്ധർ സ്ഥാപിച്ചത്. 1.5T MRI, 128-സ്ലൈസ് CT, സമഗ്ര പ്രിവന്റീവ് മെഡിസിൻ.",
      ctaBook: "അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക",
      ctaDoctors: "ഡോക്ടറെ കണ്ടെത്തുക",
      ctaEmergency: "അടിയന്തിര പരിചരണം",
      ctaServices: "സേവനങ്ങൾ കാണുക",
    },
    emergency: {
      banner: "24/7 എമർജൻസി & സ്ട്രോക്ക് കെയർ ഹെൽപ്പ് ലൈൻ",
      callNow: "വിളിക്കുക: 0422-2111000",
      hotline: "0422-2111000",
      hours: "24 മണിക്കൂറും പ്രവർത്തിക്കുന്നു",
      address: "10/77 - D സെങ്കോടഗൗണ്ടൻ പുതൂർ, അരസൂർ, കോയമ്പത്തൂർ - 641407",
    },
    masterHealth: {
      title: "മാസ്റ്റർ ഹെൽത്ത് ചെക്കപ്പ്",
      tagline: "സമ്പൂർണ്ണ ആരോഗ്യ പരിശോധന — ഒരൊറ്റ സന്ദർശനത്തിൽ",
      price: "₹ 3,500",
      testsCount: "25+ പ്രധാന ലാബ് പരിശോധനകൾ",
      bookNow: "ഇപ്പോൾ ബുക്ക് ചെയ്യുക",
      homeCollection: "സൗജന്യ ഭവന സാമ്പിൾ ശേഖരണം",
    },
    assistant: {
      name: "ഇൻഡോസ്റ്റേറ്റ്സ് ഹെൽപ്പ് ഡെസ്ക്",
      badge: "ആശുപത്രി അസിസ്റ്റന്റ്",
      greeting:
        "നമസ്കാരം! ഞാൻ ഇൻഡോസ്റ്റേറ്റ്സ് ഹെൽപ്പ് ഡെസ്ക് ആണ്. അപ്പോയിന്റ്മെന്റുകൾ, ഡോക്ടർമാർ, പരിശോധനകൾ എന്നിവയിൽ ഞാൻ എങ്ങനെ സഹായിക്കണം?",
      placeholder: "അപ്പോയിന്റ്മെന്റുകൾ, ഡോക്ടർമാർ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക...",
      disclaimer: "ഇൻഡോസ്റ്റേറ്റ്സ് ഹെൽപ്പ് ഡെസ്ക് വിവരങ്ങൾക്ക് മാത്രമുള്ളതാണ്. അടിയന്തിര സാഹചര്യങ്ങളിൽ 0422-2111000 വിളിക്കുക.",
    },
    common: {
      knowMore: "കൂടുതലറിയാൻ",
      learnMore: "വിശദാംശങ്ങൾ",
      viewAll: "എല്ലാം കാണുക",
      searchPlaceholder: "ഡോക്ടർമാർ, പരിശോധനകൾ തിരയുക...",
      close: "അടയ്ക്കുക",
      confirmed: "സ്ഥിരീകരിച്ചു",
      cancel: "റദ്ദാക്കുക",
      back: "പിന്നോട്ട്",
      next: "അടുത്തത്",
      submit: "സമർപ്പിക്കുക",
      status: "നില",
      action: "പ്രവർത്തനം",
      save: "സംരക്ഷിക്കുക",
      edit: "മാറ്റുക",
      delete: "നീക്കം ചെയ്യുക",
      loading: "ലോഡുചെയ്യുന്നു...",
    },
    dashboard: {
      patient: "പേഷ്യന്റ് പോർട്ടൽ",
      doctor: "ഡോക്ടർ ഒപിഡി കൺസോൾ",
      admin: "അഡ്മിനിസ്ട്രേഷൻ സെന്റർ",
      appointments: "അപ്പോയിന്റ്മെന്റുകൾ",
      prescriptions: "ഡിജിറ്റൽ കുറിപ്പടികൾ",
      labReports: "ലാബ് റിപ്പോർട്ടുകൾ",
      timeline: "മെഡിക്കൽ ചരിത്രം",
      family: "കുടുംബാംഗങ്ങൾ",
      profile: "പ്രൊഫൈൽ",
      settings: "ക്രമീകരണങ്ങൾ",
      notifications: "അറിയിപ്പുകൾ",
      opdQueue: "ഒപിഡി ക്യൂ",
      vitals: "വൈറ്റൽസ്",
      diagnosis: "രോഗനിർണയം",
      overview: "അവലോകനം",
      staffManagement: "ജീവനക്കാരുടെ മാനേജ്മെന്റ്",
      doctorManagement: "ഡോക്ടർ ഡയറക്ടറി",
      deptManagement: "വിഭാഗങ്ങൾ",
      auditLogs: "ഓഡിറ്റ് ലോഗുകൾ",
      hmsMonitor: "എച്ച്എംഎസ് നിരീക്ഷണം",
    },
  },
  te: {
    nav: {
      home: "హోమ్",
      about: "మా గురించి",
      visionMission: "లక్ష్యం & విజన్",
      leadership: "నాయకత్వ బృందం",
      doctors: "వైద్యులు",
      departments: "విభాగాలు",
      preventiveHealth: "నివారణ ఆరోగ్య కేంద్రం",
      diagnosticCenter: "డయాగ్నస్టిక్ సెంటర్",
      masterCheckup: "మాస్టర్ హెల్త్ చెకప్",
      emergency: "ఎమర్జెన్సీ",
      contact: "సంప్రదించండి",
      charity: "ఆర్డోర్ ఫౌండేషన్",
      career: "కెరీర్స్",
      faq: "తరచుగా అడిగే ప్రశ్నలు",
      patientPortal: "పేషెంట్ పోర్టల్",
      doctorPortal: "డాక్టర్ లాగిన్",
      adminPortal: "అడ్మిన్ పోర్టల్",
      bookAppointment: "అపాయింట్‌మెంట్ బుక్ చేయండి",
      helpDesk: "ఇండోస్టేట్స్ హెల్ప్ డెస్క్",
      myDashboard: "నా డాష్‌బోర్డ్",
      logout: "లాగ్ అవుట్",
      profile: "నా ప్రొఫైల్",
    },
    hero: {
      welcome: "ఇండో స్టేట్స్ హెల్త్‌కు స్వాగతం",
      title: "భారత ప్రజల కోసం అత్యాధునిక ప్రపంచ స్థాయి ఆరోగ్య సంరక్షణ",
      subtitle:
        "యుఎస్ మరియు ఇండియన్ బోర్డ్ సర్టిఫైడ్ నిపుణులచే స్థాపించబడింది. 1.5T MRI, 128-స్లైస్ CT మరియు సమగ్ర నివారణ వైద్యం.",
      ctaBook: "అపాయింట్‌మెంట్ బుక్ చేయండి",
      ctaDoctors: "వైద్యుడిని కనుగొనండి",
      ctaEmergency: "ఎమర్జెన్సీ కేర్",
      ctaServices: "సేవలను చూడండి",
    },
    emergency: {
      banner: "24/7 ఎమర్జెన్సీ & స్ట్రోక్ కేర్ హెల్ప్‌లైన్",
      callNow: "కాల్ చేయండి: 0422-2111000",
      hotline: "0422-2111000",
      hours: "24 గంటలూ అందుబాటులో ఉంది",
      address: "10/77 - D సెంగోడగౌండన్ పుదూర్, అరసూర్, కోయంబత్తూర్ - 641407",
    },
    masterHealth: {
      title: "మాస్టర్ హెల్త్ చెకప్",
      tagline: "పూర్తి నివారణ ఆరోగ్య పరీక్ష — ఒకే సందర్శనలో",
      price: "₹ 3,500",
      testsCount: "25+ కీలకమైన ల్యాబ్ పరీక్షలు",
      bookNow: "ఇప్పుడే బుక్ చేయండి",
      homeCollection: "ఉచిత హోమ్ శాంపిల్ కలెక్షన్ అందుబాటులో ఉంది",
    },
    assistant: {
      name: "ఇండోస్టేట్స్ హెల్ప్ డెస్క్",
      badge: "హాస్పిటల్ అసిస్టెంట్",
      greeting:
        "నమస్కారం! నేను ఇండోస్టేట్స్ హెల్ప్ డెస్క్. అపాయింట్‌మెంట్లు, వైద్యులు మరియు పరీక్షల వివరాలపై నేను మీకు ఎలా సహాయపడగలను?",
      placeholder: "అపాయింట్‌మెంట్లు, వైద్యుల వివరాలు అడగండి...",
      disclaimer: "ఇండోస్టేట్స్ హెల్ప్ డెస్క్ సమాచారం కోసం మాత్రమే. అత్యవసర పరిస్థితుల్లో 0422-2111000 కు కాల్ చేయండి.",
    },
    common: {
      knowMore: "మరింత తెలుసుకోండి",
      learnMore: "వివరాలు",
      viewAll: "అన్నీ చూడండి",
      searchPlaceholder: "వైద్యులు, పరీక్షలను శోధించండి...",
      close: "మూసివేయి",
      confirmed: "ధృవీకరించబడింది",
      cancel: "రద్దు చేయండి",
      back: "వెనుకకు",
      next: "తదుపరి",
      submit: "సమర్పించండి",
      status: "స్థితి",
      action: "చర్య",
      save: "సేవ్ చేయండి",
      edit: "సవరించండి",
      delete: "తొలగించండి",
      loading: "లోడ్ అవుతోంది...",
    },
    dashboard: {
      patient: "పేషెంట్ పోర్టల్",
      doctor: "డాక్టర్ ఓపీడీ కన్సోల్",
      admin: "హాస్పిటల్ అడ్మినిస్ట్రేషన్ సెంటర్",
      appointments: "అపాయింట్‌మెంట్లు",
      prescriptions: "డిజిటల్ ప్రిస్క్రిప్షన్లు",
      labReports: "ల్యాబ్ రిపోర్టులు",
      timeline: "వైద్య చరిత్ర",
      family: "కుటుంబ సభ్యులు",
      profile: "ప్రొఫైల్",
      settings: "సెట్టింగ్‌లు",
      notifications: "నోటిఫికేషన్‌లు",
      opdQueue: "ఓపీడీ క్యూ",
      vitals: "వైటల్స్",
      diagnosis: "రోగ నిర్ధారణ & నోట్స్",
      overview: "సమీక్ష",
      staffManagement: "సిబ్బంది నిర్వహణ",
      doctorManagement: "వైద్యుల డైరెక్టరీ",
      deptManagement: "విభాగాలు",
      auditLogs: "ఆడిట్ లాగ్స్",
      hmsMonitor: "హెచ్‌ఎమ్‌ఎస్ మానిటరింగ్",
    },
  },
  kn: {
    nav: {
      home: "ಮುಖಪುಟ",
      about: "ನಮ್ಮ ಬಗ್ಗೆ",
      visionMission: "ಗುರಿ ಮತ್ತು ದೃಷ್ಟಿಕೋನ",
      leadership: "ನಾಯಕತ್ವ ತಂಡ",
      doctors: "ವೈದ್ಯರು",
      departments: "ವಿಭಾಗಗಳು",
      preventiveHealth: "ಮುನ್ನೆಚ್ಚರಿಕೆ ಆರೋಗ್ಯ ಕೇಂದ್ರ",
      diagnosticCenter: "ರೋಗನಿರ್ಣಯ ಕೇಂದ್ರ",
      masterCheckup: "ಮಾಸ್ಟರ್ ಹೆಲ್ತ್ ಚೆಕಪ್",
      emergency: "ತುರ್ತು ಚಿಕಿತ್ಸೆ",
      contact: "ಸಂಪರ್ಕಿಸಿ",
      charity: "ಆರ್ಡೋರ್ ಫೌಂಡೇಶನ್",
      career: "ಉದ್ಯೋಗಾವಕಾಶ",
      faq: "ಪ್ರಶ್ನೋತ್ತರಗಳು",
      patientPortal: "ರೋಗಿ ಪೋರ್ಟಲ್",
      doctorPortal: "ವೈದ್ಯರ ಲಾಗಿನ್",
      adminPortal: "ಆಡಳಿತ ಪೋರ್ಟಲ್",
      bookAppointment: "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಕಾಯ್ದಿರಿಸಿ",
      helpDesk: "ಇಂಡೋಸ್ಟೇಟ್ಸ್ ಸಹಾಯ ಕೇಂದ್ರ",
      myDashboard: "ನನ್ನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      logout: "ಲಾಗ್ ಔಟ್",
      profile: "ನನ್ನ ಪ್ರೊಫೈಲ್",
    },
    hero: {
      welcome: "ಇಂಡೋ ಸ್ಟೇಟ್ಸ್ ಹೆಲ್ತ್‌ಗೆ ಸುಸ್ವಾಗತ",
      title: "ಭಾರತದ ಜನರಿಗಾಗಿ ಅತ್ಯಾಧುನಿಕ ಜಾಗತಿಕ ಗುಣಮಟ್ಟದ ಆರೋಗ್ಯ ಸೇವೆ",
      subtitle:
        "ಯುಎಸ್ ಮತ್ತು ಭಾರತೀಯ ತಜ್ಞ ವೈದ್ಯರಿಂದ ಸ್ಥಾಪಿತ. 1.5T MRI, 128-ಸ್ಲೈಸ್ CT ಮತ್ತು ಸಮಗ್ರ ರೋಗ ತಡೆಗಟ್ಟುವಿಕೆ ಚಿಕಿತ್ಸೆ.",
      ctaBook: "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಕಾಯ್ದಿರಿಸಿ",
      ctaDoctors: "ವೈದ್ಯರನ್ನು ಹುಡುಕಿ",
      ctaEmergency: "ತುರ್ತು ಚಿಕಿತ್ಸೆ",
      ctaServices: "ಸೇವೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    },
    emergency: {
      banner: "24/7 ತುರ್ತು ಚಿಕಿತ್ಸೆ ಮತ್ತು ಸ್ಟ್ರೋಕ್ ಕೇರ್ ಸಹಾಯವಾಣಿ",
      callNow: "ಕರೆ ಮಾಡಿ: 0422-2111000",
      hotline: "0422-2111000",
      hours: "24 ಗಂಟೆಗಳ ಕಾಲ ಲಭ್ಯವಿದೆ",
      address: "10/77 - D ಸೆಂಗೋಡಗೌಂಡನ್ ಪುದೂರ್, ಅರಸೂರು, ಕೊಯಮತ್ತೂರು - 641407",
    },
    masterHealth: {
      title: "ಮಾಸ್ಟರ್ ಹೆಲ್ತ್ ಚೆಕಪ್",
      tagline: "ಸಂಪೂರ್ಣ ಆರೋಗ್ಯ ತಪಾಸಣೆ — ಒಂದೇ ಭೇಟಿಯಲ್ಲಿ",
      price: "₹ 3,500",
      testsCount: "25+ ಪ್ರಮುಖ ಲ್ಯಾಬ್ ಪರೀಕ್ಷೆಗಳು",
      bookNow: "ಈಗಲೇ ಕಾಯ್ದಿರಿಸಿ",
      homeCollection: "ಉಚಿತ ಮನೆ ರಕ್ತದ ಮಾದರಿ ಸಂಗ್ರಹಣೆ ಲಭ್ಯ",
    },
    assistant: {
      name: "ಇಂಡೋಸ್ಟೇಟ್ಸ್ ಸಹಾಯ ಕೇಂದ್ರ",
      badge: "ಆಸ್ಪತ್ರೆ ಸಹಾಯಕ",
      greeting:
        "ನಮಸ್ಕಾರ! ನಾನು ಇಂಡೋಸ್ಟೇಟ್ಸ್ ಸಹಾಯ ಕೇಂದ್ರ. ಅಪಾಯಿಂಟ್ಮೆಂಟ್, ವೈದ್ಯರು ಮತ್ತು ಪರೀಕ್ಷೆಗಳ ಬಗ್ಗೆ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
      placeholder: "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಅಥವಾ ವೈದ್ಯರ ಬಗ್ಗೆ ಕೇಳಿ...",
      disclaimer: "ಇಂಡೋಸ್ಟೇಟ್ಸ್ ಸಹಾಯ ಕೇಂದ್ರ ಮಾಹಿತಿಗಾಗಿ ಮಾತ್ರ. ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ 0422-2111000 ಗೆ ಕರೆ ಮಾಡಿ.",
    },
    common: {
      knowMore: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
      learnMore: "ವಿವರಗಳು",
      viewAll: "ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ",
      searchPlaceholder: "ವೈದ್ಯರು, ಪರೀಕ್ಷೆಗಳನ್ನು ಹುಡುಕಿ...",
      close: "ಮುಚ್ಚಿ",
      confirmed: "ಖಚಿತಪಡಿಸಲಾಗಿದೆ",
      cancel: "ರದ್ದುಮಾಡಿ",
      back: "ಹಿಂದೆ",
      next: "ಮುಂದೆ",
      submit: "ಸಲ್ಲಿಸಿ",
      status: "ಸ್ಥಿತಿ",
      action: "ಕ್ರಮ",
      save: "ಉಳಿಸಿ",
      edit: "ತಿದ್ದಿ",
      delete: "ಅಳಿಸಿ",
      loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    },
    dashboard: {
      patient: "ರೋಗಿ ಪೋರ್ಟಲ್",
      doctor: "ವೈದ್ಯರ ಒಪಿಡಿ ಕನ್ಸೋಲ್",
      admin: "ಆಸ್ಪತ್ರೆ ಆಡಳಿತ ಕೇಂದ್ರ",
      appointments: "ಅಪಾಯಿಂಟ್ಮೆಂಟ್‌ಗಳು",
      prescriptions: "ಡಿಜಿಟಲ್ ಔಷಧಿ ಚೀಟಿ",
      labReports: "ಲ್ಯಾಬ್ ವರದಿಗಳು",
      timeline: "ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ",
      family: "ಕುಟುಂಬದ ಸದಸ್ಯರು",
      profile: "ಪ್ರೊಫೈಲ್",
      settings: "ಸೆಟ್ಟಿಂಗ್ಸ್",
      notifications: "ಸೂಚನೆಗಳು",
      opdQueue: "ಒಪಿಡಿ ಸರತಿ ಸಾಲು",
      vitals: "ವೈಟಲ್ಸ್",
      diagnosis: "ರೋಗನಿರ್ಣಯ & ಟಿಪ್ಪಣಿಗಳು",
      overview: "ಅವಲೋಕನ",
      staffManagement: "ಸಿಬ್ಬಂದಿ ನಿರ್ವಹಣೆ",
      doctorManagement: "ವೈದ್ಯರ ಡೈರೆಕ್ಟರಿ",
      deptManagement: "ವಿಭಾಗಗಳು",
      auditLogs: "ಆಡಿಟ್ ಲಾಗ್‌ಗಳು",
      hmsMonitor: "ಎಚ್‌ಎಂಎಸ್ ಮೇಲ್ವಿಚಾರಣೆ",
    },
  },
};
