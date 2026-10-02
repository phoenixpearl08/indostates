export interface Doctor {
  id: string;
  name: string;
  role: string;
  qualifications: string;
  departmentId: string;
  specialization: string;
  experienceYears: number;
  biography: string;
  avatarUrl: string;
  availableDays: string[];
  timing: string;
  languages: string[];
}

export interface Department {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  headDoctor: string;
  keyServices: string[];
}

export interface HealthPackage {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  price: number;
  originalPrice: number;
  description: string;
  category: "Preventive" | "Cardiac" | "Neuro" | "Women" | "Comprehensive";
  isFeatured: boolean;
  fastingRequired: boolean;
  fastingHours: number;
  turnaroundTime: string;
  testsIncluded: {
    category: string;
    items: string[];
  }[];
  clinicalEvaluation: string[];
}

export interface DiagnosticModality {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  specification: string;
  description: string;
  procedures: string[];
  clinicalSignificance: string;
  preparation: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Appointments" | "Tests" | "Master Checkup" | "Emergency" | "Insurance";
}

// ==========================================
// 1. HOSPITAL METADATA & VERIFIED CONTACTS
// ==========================================
export const HOSPITAL_INFO = {
  name: "Indo States Health",
  shortName: "ISH",
  tagline: "Prevent | Screen | Treat",
  subTagline: "The state-of-the-art healthcare to the people of India.",
  address: "10/77 - D Sengodagownden Pudur, Arasur, Coimbatore - 641407, Tamil Nadu, India",
  landmark: "Near A2B / NH544 Salem-Kochi Highway corridor",
  coordinates: {
    lat: 11.0542,
    lng: 77.1085,
  },
  emergencyPhone: "0422-2111000",
  primaryPhone: "04 222 111 000",
  primaryPhoneRaw: "+914222111000",
  emails: {
    contact: "contact@indostates.com",
    support: "contact@indostates.org",
  },
  hours: {
    weekdays: "Monday – Friday: 9:00 AM – 5:00 PM",
    weekends: "Saturday – Sunday: 10:00 AM – 6:00 PM",
    emergency: "24/7 Emergency & Acute Trauma Response",
  },
  socials: {
    youtube: "https://youtube.com/@indostateshealth?si=U0tqj3wChL2ntUOR",
    instagram: "https://www.instagram.com/indo_states_health/",
    facebook: "https://www.facebook.com/profile.php?id=61572280662292",
    twitter: "https://x.com/Indo_States_Cbe",
  },
  charity: {
    name: "ARDOR Care Foundation",
    taxExempt: "Section 12A & 80G (India Tax Exempt)",
    usEntity: "Ardor Corporation (US 501(c)(3) Public Charity)",
    website: "https://ardoronline.com/",
  },
};

// ==========================================
// 2. LEADERSHIP & VERIFIED DOCTORS
// ==========================================
export const LEADERSHIP_TEAM = [
  {
    id: "dr-rajesh-rangaswamy",
    name: "Dr. Rajesh Rangaswamy",
    role: "Founder & Chief Executive Officer",
    qualifications: "MD, DABR, CAQ(NR), CAST(EVN)",
    specialization: "Neuroradiology & Neurointerventional Surgery",
    details:
      "Dual board-certified specialist in the United States and India. Certified by the American Board of Radiology (DABR) with Certificate of Added Qualification in Neuroradiology CAQ(NR) and Committee on Advanced Subspecialty Training in Endovascular Neurosurgery CAST(EVN). Dedicated to bringing world-class stroke and neurovascular intervention to India.",
    avatarUrl: "/images/avatars/doctor-rajesh.svg",
  },
  {
    id: "dr-nithya-mohan",
    name: "Dr. Nithya P. Mohan",
    role: "Founder",
    qualifications: "PhD",
    specialization: "Healthcare Innovation & Research",
    details:
      "Visionary co-founder leading patient education programs, scientific research methodologies, and compassionate outreach across underprivileged sectors.",
    avatarUrl: "/images/avatars/doctor-vani.svg",
  },
  {
    id: "dr-logesh-thirumalaisamy",
    name: "Dr. Logesh Thirumalaisamy",
    role: "Medical Director",
    qualifications: "MBBS, MEM",
    specialization: "Emergency Medicine & Acute Care",
    details:
      "Oversees clinical operations, emergency care protocols, code stroke pathways, and comprehensive patient safety systems throughout the medical center.",
    avatarUrl: "/images/avatars/doctor-logesh.svg",
  },
  {
    id: "dr-vani-mohan",
    name: "Dr. Vani Mohan",
    role: "Chief Medical Officer – Medical Services",
    qualifications: "MD, DGO",
    specialization: "Obstetrics & Gynecology / Preventive Health",
    details:
      "Pioneering women's wellness, cervical & breast cancer early screening programs, and holistic maternal and reproductive healthcare.",
    avatarUrl: "/images/avatars/doctor-vani.svg",
  },
  {
    id: "dr-v-mohan",
    name: "Dr. V. Mohan",
    role: "Chief Medical Officer – Surgical Services",
    qualifications: "MS",
    specialization: "General & Advanced Surgery",
    details:
      "Veteran surgical leader spearheading high-precision surgical diagnostics, minimally invasive techniques, and quality assurance.",
    avatarUrl: "/images/avatars/doctor-mohan.svg",
  },
  {
    id: "mr-k-rangaswamy",
    name: "Mr. K. Rangaswamy",
    role: "President",
    qualifications: "MCom",
    specialization: "Institutional Governance & Strategy",
    details: "Guides institutional ethics, long-term infrastructure development, and community hospital stewardship.",
    avatarUrl: "/images/avatars/leader-rangaswamy.svg",
  },
  {
    id: "mrs-r-vijayalakshmi",
    name: "Mrs. R. Vijayalakshmi",
    role: "Managing Director",
    qualifications: "Hospital Administration",
    specialization: "Operational Excellence & Patient Experience",
    details: "Directs hospital operations, ensuring patient-first hospitality, dignity of care, and streamlined diagnostic delivery.",
    avatarUrl: "/images/avatars/leader-vijayalakshmi.svg",
  },
  {
    id: "mr-ayyappan",
    name: "Mr. Ayyappan",
    role: "Hospital Operations Manager",
    qualifications: "MBA",
    specialization: "Healthcare Administration",
    details: "Coordinates diagnostic laboratory scheduling, home sample collection logistics, and patient service desks.",
    avatarUrl: "/images/avatars/leader-ayyappan.svg",
  },
];

export const DOCTORS: Doctor[] = [
  {
    id: "dr-rajesh-rangaswamy",
    name: "Dr. Rajesh Rangaswamy",
    role: "Senior Consultant Neuroradiologist & Neurointerventionalist",
    qualifications: "MD, DABR (USA), CAQ(NR), CAST(EVN)",
    departmentId: "neuro-stroke",
    specialization: "Neuroradiology, Stroke Intervention & Endovascular Neurosurgery",
    experienceYears: 20,
    biography:
      "Dr. Rajesh Rangaswamy is an internationally acclaimed physician dual board-certified in the USA and India. Trained in elite neurovascular institutions in the United States, Dr. Rajesh specializes in ultra-early acute stroke triage, 1.5 Tesla neuro-imaging characterization, carotid artery stenting, aneurysm coiling, and cerebral vascular screening. He established Indo States Health to democratize state-of-the-art preventive medicine.",
    avatarUrl: "/images/avatars/doctor-rajesh.svg",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    timing: "10:00 AM – 4:00 PM",
    languages: ["English", "Tamil"],
  },
  {
    id: "dr-logesh-thirumalaisamy",
    name: "Dr. Logesh Thirumalaisamy",
    role: "Consultant Emergency & Acute Care Physician",
    qualifications: "MBBS, MEM (Masters in Emergency Medicine)",
    departmentId: "emergency",
    specialization: "Emergency Medicine, Acute Trauma & Triage",
    experienceYears: 12,
    biography:
      "Dr. Logesh serves as the Medical Director of Indo States Health. With rigorous training in emergency medicine, critical care stabilization, and rapid chest pain/stroke triage, he leads the hospital's clinical protocols and immediate diagnostic pathways.",
    avatarUrl: "/images/avatars/doctor-logesh.svg",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    timing: "9:00 AM – 5:00 PM",
    languages: ["English", "Tamil", "Hindi"],
  },
  {
    id: "dr-vani-mohan",
    name: "Dr. Vani Mohan",
    role: "Chief Medical Officer – Women's Health & Gynecology",
    qualifications: "MD, DGO",
    departmentId: "womens-health",
    specialization: "Obstetrics, Gynecology & Women's Preventive Screening",
    experienceYears: 24,
    biography:
      "Dr. Vani Mohan has spent over two decades championing women's health. She specializes in 3D digital mammogram correlation, Pap smear interpretation, osteoporosis prevention via DEXA BMD, and comprehensive reproductive wellness.",
    avatarUrl: "/images/avatars/doctor-vani.svg",
    availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
    timing: "10:00 AM – 3:00 PM",
    languages: ["English", "Tamil"],
  },
  {
    id: "dr-v-mohan",
    name: "Dr. V. Mohan",
    role: "Chief Medical Officer – Surgical Services",
    qualifications: "MS (General Surgery)",
    departmentId: "surgery",
    specialization: "General, Abdominal & Minimally Invasive Surgery",
    experienceYears: 28,
    biography:
      "Dr. V. Mohan brings immense clinical wisdom to the surgical team, with special focus on preventive GI diagnostics, virtual colonography evaluation, and surgical consultation for complex thoracic and abdominal conditions.",
    avatarUrl: "/images/avatars/doctor-mohan.svg",
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    timing: "11:00 AM – 4:00 PM",
    languages: ["English", "Tamil"],
  },
  {
    id: "dr-cardiac-consultant",
    name: "Dr. K. S. Sundaram",
    role: "Senior Consultant Preventive Cardiologist",
    qualifications: "MD, DM (Cardiology), FACC",
    departmentId: "cardiology",
    specialization: "Preventive Cardiology, CCTA & Coronary Calcium Scoring",
    experienceYears: 18,
    biography:
      "Consultant cardiologist specializing in non-invasive coronary plaque assessment, CT Coronary Angiogram analysis, hyperlipidemia management, and early detection of silent ischemic heart disease.",
    avatarUrl: "/images/avatars/doctor-sundaram.svg",
    availableDays: ["Monday", "Wednesday", "Friday"],
    timing: "9:30 AM – 2:00 PM",
    languages: ["English", "Tamil", "Hindi"],
  },
  {
    id: "dr-pathology-head",
    name: "Dr. Anita Chandrasekhar",
    role: "Consultant Pathologist & Lab Director",
    qualifications: "MD (Pathology), DNB",
    departmentId: "pathology",
    specialization: "Clinical Biochemistry, Hematology & Oncology Markers",
    experienceYears: 15,
    biography:
      "Expert diagnostic pathologist directing the Indo States Health fully automated central laboratory. Directs tumor marker quality checks (CA125, PSA), endocrine profiles, and swift report delivery.",
    avatarUrl: "/images/avatars/doctor-kavitha.svg",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    timing: "8:30 AM – 4:30 PM",
    languages: ["English", "Tamil"],
  },
];

// ==========================================
// 3. CLINICAL DEPARTMENTS
// ==========================================
export const DEPARTMENTS: Department[] = [
  {
    id: "neuro-stroke",
    slug: "neurovascular-stroke",
    name: "Neurovascular & Stroke Care",
    tagline: "Ultra-fast stroke detection and advanced brain imaging",
    shortDescription:
      "Specialized in acute stroke triage, 1.5 Tesla MR brain and vascular angiography, intracranial stenosis, and cognitive screening.",
    fullDescription:
      "Our Neurovascular Center of Excellence concentrates specialized resources on reducing death and long-term disability from strokes and neurodegenerative diseases. Equipped with high-resolution 1.5 Tesla MRI protocols and 128-slice CT angiography, our dual board-certified neuro-specialists accurately pinpoint silent aneurysms, carotid stenosis, and early cognitive impairment.",
    iconName: "Brain",
    headDoctor: "Dr. Rajesh Rangaswamy",
    keyServices: [
      "Acute Stroke Rapid Protocol",
      "MR Brain with & without Contrast",
      "Carotid Angiogram (MRA/CTA/USG)",
      "Carotid Intima-Media Thickness (CIMT)",
      "Cognitive Impairment Screening (Mini-COG)",
      "MR Brain & Cranial Nerves / IAC / Pituitary",
    ],
  },
  {
    id: "diagnostic-imaging",
    slug: "diagnostic-center",
    name: "Advanced Diagnostic Center",
    tagline: "High-resolution 1.5T MRI, 128-Slice CT, 3D Mammogram & DEXA",
    shortDescription:
      "State-of-the-art diagnostic imaging center ensuring precise, fast, and patient-friendly cross-sectional imaging.",
    fullDescription:
      "Accurate diagnosis is the cornerstone of effective healthcare. Our Diagnostic Center features cutting-edge 1.5 Tesla MRI with contrast capability, 128-Slice sub-second CT scanner, DEXA bone mineral densitometry, and 3D digital mammography operated by senior subspecialty radiologists.",
    iconName: "Scan",
    headDoctor: "Dr. Rajesh Rangaswamy",
    keyServices: [
      "1.5 Tesla High-Field MRI (14+ Specialized Scans)",
      "128-Slice Low-Dose CT Scanning",
      "CT Coronary Angiogram & Calcium Score",
      "DEXA Bone Mineral Densitometry (BMD)",
      "3D Full-Field Digital Mammography",
      "Virtual CT Colonography",
    ],
  },
  {
    id: "preventive-health",
    slug: "preventive-health-center",
    name: "Preventive Health Center",
    tagline: "Proactive screening across 10 vital health pillars",
    shortDescription:
      "Empowering lifelong wellness through primary, secondary, tertiary, and quaternary prevention strategies.",
    fullDescription:
      "Rather than waiting for life-threatening diseases to strike, our Preventive Health Center stops them in their tracks. We employ multi-tiered prevention across 10 essential body systems to catch silent risks—such as arterial calcification, pre-diabetes, early tumor markers, and fatty liver disease—decades before symptoms emerge.",
    iconName: "ShieldCheck",
    headDoctor: "Dr. Logesh Thirumalaisamy",
    keyServices: [
      "Primary & Secondary Disease Prevention",
      "Master Health Checkup (Comprehensive ₹3,500 Package)",
      "Cardiovascular Plaque Risk Stratification",
      "Cancer Early Detection Markers (CA125, PSA)",
      "Metabolic, Liver & Kidney Functional Panels",
      "Nutritional & Lifestyle Prescription",
    ],
  },
  {
    id: "cardiology",
    slug: "cardiovascular-health",
    name: "Cardiovascular Health Center",
    tagline: "Non-invasive coronary evaluation and heart attack prevention",
    shortDescription:
      "Pioneering coronary calcium scoring, CT coronary angiography, 12-lead ECG, and lipid sub-fraction testing.",
    fullDescription:
      "Heart attacks remain the leading cause of premature mortality. Our dedicated Cardiovascular Center focuses on identifying vulnerable, soft, and calcified arterial plaques before they cause a blockage. Using our 128-slice CT scanner, patients undergo non-invasive coronary calcium scoring in just 10 minutes.",
    iconName: "HeartPulse",
    headDoctor: "Dr. K. S. Sundaram",
    keyServices: [
      "Coronary Calcium Score (Agatston Score)",
      "CT Coronary Angiogram (128 Slice)",
      "12-Lead Electrocardiogram (ECG)",
      "Ankle-Brachial Index (ABI) for Peripheral Vascular Disease",
      "Advanced Lipid & Apolipoprotein Panels",
      "Chest Pain Fast-Track Triage",
    ],
  },
  {
    id: "womens-health",
    slug: "womens-wellness",
    name: "Women's Health & Wellness",
    tagline: "Compassionate breast, cervical, and reproductive care",
    shortDescription:
      "Dedicated women's wing with 3D digital mammography, Pap smear cytology, bone health DEXA scans, and wellness packages.",
    fullDescription:
      "Designed with privacy, warmth, and dignity in mind, our Women's Wellness Center provides early detection for breast cancer, ovarian conditions, osteopenia, and hormonal imbalances. Every study is reviewed by experienced lady physicians.",
    iconName: "UserCheck",
    headDoctor: "Dr. Vani Mohan",
    keyServices: [
      "3D Digital Breast Mammography",
      "Pap Smear & Liquid-Based Cytology",
      "DEXA Bone Density Scan (Osteoporosis Screen)",
      "CA125 Ovarian Tumor Marker",
      "Thyroid & Endocrine Function Panels",
      "Pre & Post-Menopausal Health Screening",
    ],
  },
  {
    id: "pathology",
    slug: "pathology-laboratory",
    name: "Clinical Pathology & Biochemistry",
    tagline: "Automated precision testing with zero-cost home sample collection",
    shortDescription:
      "Fully accredited clinical lab equipped with state-of-the-art analyzers delivering accurate same-day results.",
    fullDescription:
      "Our hospital-grade central laboratory delivers highly accurate hematology, biochemistry, immunology, infectious disease, and oncology marker profiles. We proudly provide free home sample collection within Coimbatore to ensure accessible care for seniors and busy families.",
    iconName: "FlaskConical",
    headDoctor: "Dr. Anita Chandrasekhar",
    keyServices: [
      "Complete Blood Count (CBC) with 5-part diff",
      "Lipid, Liver & Kidney Function Panels",
      "Glycated Hemoglobin (HbA1c) & Fasting Glucose",
      "Tumor Markers (PSA, CA125, CEA)",
      "Vitamins (Vit D3, Vit B12) & Electrolytes",
      "Complimentary Home Sample Collection",
    ],
  },
  {
    id: "emergency",
    slug: "emergency-trauma",
    name: "Emergency & Acute Care",
    tagline: "Rapid response medical team on standby 24/7",
    shortDescription:
      "Equipped for rapid resuscitation, stroke code activation, cardiac emergencies, and immediate diagnostic workups.",
    fullDescription:
      "The Emergency Department at Indo States Health is strategically located on the ground floor with immediate, barrier-free ambulance drop-off. Integrated directly with our 128-slice CT scanner and 1.5T MRI, critical patients receive life-saving imaging without delay.",
    iconName: "AlertTriangle",
    headDoctor: "Dr. Logesh Thirumalaisamy",
    keyServices: [
      "24/7 Emergency Medical Response",
      "Code Stroke & Code STEMI Triage",
      "Immediate CT/MRI Trauma Scans",
      "Advanced Cardiac Life Support (ACLS)",
      "Acute Medical Stabilization",
      "Direct Ambulance Coordination Desk",
    ],
  },
  {
    id: "surgery",
    slug: "surgical-services",
    name: "Surgical Services & Consultation",
    tagline: "Senior surgical specialists and second-opinion clinics",
    shortDescription:
      "Comprehensive pre-operative evaluations, second-opinion surgical panels, and minimally invasive management.",
    fullDescription:
      "Our surgical division provides meticulous surgical consultations, diagnostic virtual colonoscopies, minor procedure support, and international panel reviews for complex surgical cases.",
    iconName: "Stethoscope",
    headDoctor: "Dr. V. Mohan",
    keyServices: [
      "Surgical Second Opinion Clinics",
      "Virtual CT Colonography for Colorectal Health",
      "Pre-Operative Comprehensive Health Clearance",
      "Post-Surgical Follow-up Care",
      "Soft Tissue Diagnostic Evaluations",
    ],
  },
];

// ==========================================
// 4. DIAGNOSTIC MODALITIES DETAIL
// ==========================================
export const DIAGNOSTIC_MODALITIES: DiagnosticModality[] = [
  {
    id: "mri-15t",
    slug: "mri",
    name: "MRI (1.5 Tesla)",
    subtitle: "High-Resolution Magnetic Resonance Imaging With & Without Contrast",
    specification: "1.5 Tesla Wide-Bore System with Dedicated High-Density Matrix Coils",
    description:
      "Our cutting-edge 1.5 Tesla MRI scanner provides unparalleled soft-tissue resolution, enabling detailed visualization of the brain, spinal cord, cranial nerves, vascular pathways, joints, and internal organs without ionizing radiation.",
    procedures: [
      "MR Brain (With & Without Contrast)",
      "MR Brain & Internal Auditory Canal (IAC)",
      "MR Brain & Orbit (Optic Nerve & Ocular Evaluation)",
      "MR Brain & Pituitary Sella (Microadenoma Protocol)",
      "MR Brain & Cranial Nerves (Trigeminal, Facial, etc.)",
      "MR Cervical Spine (With & Without Contrast)",
      "MR Thoracic Spine (With & Without Contrast)",
      "MR Lumbar Spine & Sacrum (With & Without Contrast)",
      "MR Brachial Plexus (Nerve Root Imaging)",
      "MR Lumbosacral Plexus (Pelvic & Sciatic Nerves)",
      "MR Skull Base & Craniocervical Junction",
      "MR Soft Tissue Neck (Pharynx, Larynx, Salivary Glands)",
      "MR Angiography (MRA Head & Neck Vessels)",
      "MR Venography (MRV Cerebral Venous Sinuses)",
    ],
    clinicalSignificance:
      "Crucial for identifying acute stroke within minutes (DWI sequence), multiple sclerosis plaques, brain tumors, acoustic neuromas, disc herniations, spinal cord compression, and deep plexus nerve entrapments.",
    preparation:
      "Remove all metallic objects, jewelry, and watches. Inform our staff if you have cardiac pacemakers, cochlear implants, or metallic clips. Fasting of 4 hours is recommended for contrast-enhanced studies.",
  },
  {
    id: "ct-128-slice",
    slug: "ct",
    name: "CT (128 Slice)",
    subtitle: "Ultra-Fast Volumetric Multidetector Computed Tomography",
    specification: "128-Slice Scanner with Low-Dose Iterative Reconstruction Technology",
    description:
      "Capable of scanning entire organ volumes in a fraction of a second, our 128-slice CT delivers sub-millimeter isotropic resolution with up to 80% lower radiation exposure compared to older scanners.",
    procedures: [
      "Low Dose Chest CT (Lung Cancer & Pulmonary Screening)",
      "Coronary Calcium Scoring (Agatston Heart Attack Risk Score)",
      "CT Coronary Angiogram (Non-invasive Coronary Artery Assessment)",
      "CT Colonography (Virtual Colonoscopy for Colorectal Polyps)",
      "Carotid CT Angiogram (Neck Arteries & Stroke Risk)",
      "Aortic Angiogram (Thoracic & Abdominal Aorta Aneurysm Screen)",
      "High-Resolution CT Chest (HRCT for Interstitial Lung Disease)",
      "CT Abdomen & Pelvis (Triple-Phase Contrast Evaluation)",
      "CT Brain for Acute Stroke & Intracranial Hemorrhage",
      "Digital X-Ray High-Frequency Skeletal Imaging",
    ],
    clinicalSignificance:
      "Detects microscopic pulmonary nodules in early lung cancer, quantifies calcified coronary plaques before heart attacks occur, and maps acute vascular blockages for emergency thrombectomy.",
    preparation:
      "For contrast CT or coronary angiograms, 4-6 hours fasting is required. Serum creatinine levels must be verified. Wear loose, comfortable clothing without metallic zippers.",
  },
  {
    id: "dexa-scan",
    slug: "dexa",
    name: "DEXA Bone Mineral Densitometry",
    subtitle: "Dual-Energy X-ray Absorptiometry & Total Body Composition",
    specification: "State-of-the-Art Lunar DEXA Fan-Beam System",
    description:
      "The gold standard for measuring bone mineral density (BMD) and determining exact percentages of skeletal bone, visceral fat, and muscle mass.",
    procedures: [
      "Lumbar Spine & Hip Bone Mineral Density (BMD)",
      "Forearm Bone Densitometry",
      "Total Body Composition & Visceral Fat Analysis",
      "Fracture Risk Assessment (FRAX Calculation)",
      "Serial Osteopenia & Osteoporosis Monitoring",
    ],
    clinicalSignificance:
      "Detects silent bone thinning (osteopenia and osteoporosis) years before debilitating hip or spinal compression fractures occur. Crucial for menopausal women, seniors, and patients on steroid medication.",
    preparation:
      "No special fasting needed. Avoid calcium supplements for 24 hours prior to the scan. Dress in clothing without metal buttons or zippers around the hips and spine.",
  },
  {
    id: "mammography",
    slug: "mammography",
    name: "3D Digital Mammography",
    subtitle: "High-Definition Breast Cancer Screening",
    specification: "Full-Field Digital Mammogram with Ergonomic Comfort Paddles",
    description:
      "Provides crystal-clear, low-radiation breast tissue visualization capable of detecting microcalcifications smaller than 0.1 mm long before they are palpable as a lump.",
    procedures: [
      "Bilateral Screening Digital Mammogram",
      "Diagnostic Mammography with Spot Compression",
      "Breast Microcalcification Profiling",
      "Complementary Breast Ultrasound Correlation",
    ],
    clinicalSignificance:
      "Recommended annually for women aged 40 and older. Early detection of stage 0/1 breast cancer improves 5-year survival rates to over 98%.",
    preparation:
      "Do not apply deodorant, talcum powder, perfumes, or lotions under the arms or on breasts on the day of the exam. Schedule the exam 1 week after your menstrual period when breast tissue is least tender.",
  },
  {
    id: "laboratory",
    slug: "laboratory",
    name: "Comprehensive Laboratory Services",
    subtitle: "Fully Automated Pathology, Biochemistry & Molecular Diagnostics",
    specification: "Bi-Directional Barcoded Automation with Strict Internal/External Quality Controls",
    description:
      "Indo States Health Central Lab operates clinical analyzers ensuring precision, rapid turnaround, and direct physician access to diagnostic data.",
    procedures: [
      "Complete Blood Count (CBC) with Automated Hemogram",
      "Complete Lipid Profile (Total, LDL, HDL, Triglycerides, VLDL)",
      "Liver Function Tests (SGOT, SGPT, Bilirubin, Alkaline Phos)",
      "Kidney Function Tests (Creatinine, Urea, Uric Acid, BUN)",
      "Thyroid Function Tests (Free T3, Free T4, TSH)",
      "Diabetic Evaluation (Fasting Glucose, Postprandial, HbA1c)",
      "Tumor Markers: Serum PSA (Male) & CA125 (Female)",
      "Electrolytes Panel (Sodium, Potassium, Chloride, Bicarbonate)",
      "Iron Deficiency Profile (Iron, TIBC, Ferritin)",
      "Vitamins Assessment (Serum 25-OH Vitamin D3, Vitamin B12)",
      "Urine Complete Routine & Microscopic Examination",
      "Free Home-Based Sample Collection Facility",
    ],
    clinicalSignificance:
      "Delivers the foundational biological markers needed for primary preventive triage, organ health tracking, and medication monitoring.",
    preparation:
      "Fasting of 10 to 12 hours is required for Lipid Profile and Fasting Blood Sugar tests. Water may be consumed freely.",
  },
];

// ==========================================
// 5. HEALTH PACKAGES & MASTER CHECKUP
// ==========================================
export const HEALTH_PACKAGES: HealthPackage[] = [
  {
    id: "master-health-checkup",
    name: "Master Health Check-up",
    slug: "master-health-checkup",
    tagline: "A Complete Preventive Screening — All in One Visit",
    price: 3500,
    originalPrice: 6500,
    description:
      "The flagship Indo States Health comprehensive checkup. Covers every vital organ system through extensive laboratory testing, tumor markers, 12-lead ECG, physician consultation, and complimentary home sample collection.",
    category: "Comprehensive",
    isFeatured: true,
    fastingRequired: true,
    fastingHours: 10,
    turnaroundTime: "Same Day Consultation & Digital Pass",
    testsIncluded: [
      {
        category: "Laboratory Tests",
        items: [
          "Complete Blood Count (CBC)",
          "Blood Sugar & Diabetes Screening (Fasting / Postprandial)",
          "Lipid Profile (Total Cholesterol, HDL, LDL, VLDL, Triglycerides)",
          "Liver Function Tests (Total Bilirubin, SGOT, SGPT, Alk Phos)",
          "Kidney Function Tests (Serum Creatinine, Blood Urea, Uric Acid)",
          "Thyroid Function Test (TSH)",
          "Urine Routine Analysis",
        ],
      },
      {
        category: "Advanced Diagnostic Panels",
        items: [
          "Bone Health Profile (Calcium, Phosphorus)",
          "Electrolytes Panel (Sodium, Potassium, Chloride)",
          "Pancreas Profile",
          "Iron Profile (Serum Iron, TIBC)",
          "Cardiac Risk Panel",
          "Vitamin D & B12 Screening",
        ],
      },
      {
        category: "Tumor Early Detection Markers",
        items: [
          "CA-125 (Ovarian cancer marker for Females)",
          "PSA (Prostate specific antigen for Males)",
        ],
      },
      {
        category: "Cardiac & Bio-Physical Screening",
        items: [
          "12-Lead Electrocardiogram (ECG)",
          "Blood Pressure & Body Mass Index Profiling",
          "Cardiac Plaque Risk Assessment",
        ],
      },
    ],
    clinicalEvaluation: [
      "Comprehensive Physical Examination",
      "Detailed In-Person Physician Consultation",
      "Personalized Health Report Review",
      "Tailored Diet & Lifestyle Prescription",
      "Complimentary Home-Based Blood Collection",
    ],
  },
  {
    id: "stroke-prevention-panel",
    name: "Comprehensive Stroke Prevention Panel",
    slug: "stroke-prevention-panel",
    tagline: "Engineered by Dual Board-Certified Neurointerventional Specialists",
    price: 6500,
    originalPrice: 11000,
    description:
      "Advanced neurovascular screening combining 1.5 Tesla MR Brain, Carotid Intima-Media Thickness (CIMT) Doppler, vascular risk biomarkers, and neurologist consultation.",
    category: "Neuro",
    isFeatured: false,
    fastingRequired: true,
    fastingHours: 8,
    turnaroundTime: "Within 24 Hours",
    testsIncluded: [
      {
        category: "Imaging & Vascular Studies",
        items: [
          "1.5T MR Brain (Non-contrast stroke & white matter scan)",
          "Carotid Intima-Media Thickness (CIMT) Ultrasound Doppler",
          "Ankle-Brachial Index (ABI) Arterial Evaluation",
        ],
      },
      {
        category: "Biochemical Biomarkers",
        items: [
          "Complete Lipid & Atherosclerosis Panel",
          "Serum Homocysteine (Vascular Inflammation Marker)",
          "High-Sensitivity CRP (hs-CRP)",
          "HbA1c & Microalbuminuria",
        ],
      },
    ],
    clinicalEvaluation: [
      "Consultation with Dr. Rajesh Rangaswamy / Senior Neurologist",
      "Cognitive Assessment & Stroke Warning Signs Review",
      "Long-term Carotid Plaque Management Plan",
    ],
  },
  {
    id: "cardiac-protection-checkup",
    name: "Executive Heart & Calcium Score Checkup",
    slug: "executive-heart-checkup",
    tagline: "Know Your Heart's True Biological Age in Minutes",
    price: 4900,
    originalPrice: 8500,
    description:
      "Direct visualization of coronary artery calcification utilizing 128-slice CT technology alongside cardiac biomarkers and ECG analysis.",
    category: "Cardiac",
    isFeatured: false,
    fastingRequired: true,
    fastingHours: 6,
    turnaroundTime: "Same Day",
    testsIncluded: [
      {
        category: "Cardiac Imaging",
        items: [
          "128-Slice Low-Dose CT Coronary Calcium Scoring (Agatston Score)",
          "12-Lead Rest ECG",
          "Arterial Pulse Wave & Blood Pressure Profile",
        ],
      },
      {
        category: "Blood & Laboratory",
        items: [
          "Extended Lipid Subfractions (Non-HDL, Triglycerides/HDL Ratio)",
          "Cardiac Troponin & hs-CRP",
          "Renal & Fasting Blood Sugar Evaluation",
        ],
      },
    ],
    clinicalEvaluation: [
      "Preventive Cardiologist Consultation",
      "Agatston Calcium Score Stratification (0 to 400+)",
      "Custom Preventive Cardiovascular Strategy",
    ],
  },
  {
    id: "womens-wellness-mammography",
    name: "Women's Wellness & 3D Mammogram",
    slug: "womens-wellness-mammography",
    tagline: "Dedicated Breast, Bone & Hormonal Preventive Care",
    price: 4200,
    originalPrice: 7500,
    description:
      "Holistic screening addressing breast health, osteoporosis risk, and gynecological markers guided by Chief Medical Officer Dr. Vani Mohan.",
    category: "Women",
    isFeatured: false,
    fastingRequired: false,
    fastingHours: 0,
    turnaroundTime: "Same Day",
    testsIncluded: [
      {
        category: "Imaging Modalities",
        items: [
          "3D Full-Field Digital Screening Mammography",
          "DEXA Bone Mineral Densitometry (BMD Hip & Spine)",
        ],
      },
      {
        category: "Gynecological & Tumor Tests",
        items: [
          "Cervical Pap Smear Cytology",
          "CA-125 Ovarian Tumor Marker",
          "Serum TSH, Vitamin D3 & Calcium",
          "CBC & Complete Hemogram",
        ],
      },
    ],
    clinicalEvaluation: [
      "Consultation with Dr. Vani Mohan (MD, DGO)",
      "Breast Health & Self-Examination Guidance",
      "Bone Density FRAX Score & Osteoporosis Prevention Plan",
    ],
  },
];

// ==========================================
// 6. FREQUENTLY ASKED QUESTIONS
// ==========================================
export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "Where is Indo States Health located in Coimbatore?",
    answer:
      "Indo States Health is located at 10/77 - D Sengodagownden Pudur, Arasur, Coimbatore - 641407, Tamil Nadu. We are conveniently situated along the Salem-Kochi Highway (NH 544) corridor near A2B. It is approximately 15 minutes from Coimbatore International Airport.",
    category: "General",
  },
  {
    id: "faq-2",
    question: "What is included in the Master Health Check-up for ₹3,500?",
    answer:
      "Our Master Health Check-up includes over 25 vital diagnostic tests: Complete Blood Count (CBC), Fasting Blood Sugar, Lipid Profile, Liver & Kidney Function Tests, Thyroid (TSH), Urine Routine, Bone Health Profile, Electrolytes, Pancreas Profile, Iron Profile, Vitamin Levels, CA125 (for women) or PSA (for men), 12-lead ECG, physical examination, physician consultation, and free home blood sample collection.",
    category: "Master Checkup",
  },
  {
    id: "faq-3",
    question: "How do I prepare for my morning appointment and blood tests?",
    answer:
      "For packages including Lipid Profile and Fasting Glucose (such as the Master Health Checkup), you should fast for 10 to 12 hours prior to sample collection. You may drink plain water freely. Please bring any current medications and past medical records to your appointment.",
    category: "Tests",
  },
  {
    id: "faq-4",
    question: "How do I book an appointment online?",
    answer:
      "Click 'Book Appointment' in the top menu or on our homepage. You can select your desired department or health package, pick your preferred specialist, select an available date and time slot, and enter your details. You will instantly receive a unique reference code and a digital appointment pass with a QR code.",
    category: "Appointments",
  },
  {
    id: "faq-5",
    question: "Do you offer free home sample collection for blood tests?",
    answer:
      "Yes! Indo States Health offers complimentary home sample collection at zero additional cost within Coimbatore. Our certified phlebotomist visits your home with cold-chain sample transport containers at your chosen morning time.",
    category: "Tests",
  },
  {
    id: "faq-6",
    question: "What is the emergency hotline number for urgent cases?",
    answer:
      "Our direct 24/7 Emergency & Acute Care hotline is 0422-2111000 (+91 422 211 1000). For acute stroke, severe chest pain, or trauma, call immediately so our emergency and imaging teams can be on standby prior to your arrival.",
    category: "Emergency",
  },
  {
    id: "faq-7",
    question: "What makes your 1.5 Tesla MRI and 128-Slice CT scanner unique?",
    answer:
      "Our 1.5 Tesla MRI provides dedicated high-resolution neurovascular, spinal, and contrast imaging under the guidance of US dual board-certified neuroradiologist Dr. Rajesh Rangaswamy. Our 128-slice CT scanner captures cardiac and full-body scans in seconds with up to 80% reduced radiation exposure, offering non-invasive coronary calcium scores and CT colonography.",
    category: "Tests",
  },
  {
    id: "faq-8",
    question: "What is ARDOR Care Foundation?",
    answer:
      "ARDOR Care Foundation is the non-profit charity initiative of Indo States Health. Registered under Section 12A and 80G in India (and 501(c)(3) Ardor Corporation in the US), it provides subsidized medical aid, free screening camps, medical device donations, and educational scholarships for underprivileged individuals.",
    category: "General",
  },
  {
    id: "faq-9",
    question: "What languages does Indo States Health support?",
    answer:
      "Our medical staff and IndoCare AI assistant fluently assist patients in English, தமிழ் (Tamil), and हिंदी (Hindi).",
    category: "General",
  },
  {
    id: "faq-10",
    question: "Are health insurance and corporate health cards accepted?",
    answer:
      "Yes, we provide detailed, computerized diagnostic bills, clinical summaries, and reports compatible with all major private and public health insurance providers for reimbursement. Check with our reception desk on arrival for empanelment queries.",
    category: "Insurance",
  },
];
