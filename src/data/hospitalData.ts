import { 
  HospitalInfo, 
  Department, 
  Doctor, 
  MedicalService, 
  Facility, 
  HealthPackage, 
  HealthArticle, 
  HealthEvent, 
  GalleryItem, 
  PatientTestimonial, 
  CareerPosition, 
  FAQItem 
} from '../types';

/**
 * ==============================================================================
 * CENTRALIZED MASTER DATA STRUCTURE — INDOSTATES HOSPITAL
 * ==============================================================================
 * This is the SINGLE AUTHORITATIVE DATA ARCHITECTURE for IndoStates Hospital.
 *
 * RULES:
 * 1. Do NOT invent real hospital information.
 * 2. Every missing real value is explicitly marked: [HOSPITAL TO PROVIDE]
 * 3. No fake doctor identities, fake phone numbers, fake awards, or fake accreditations.
 * 4. All hospital-specific data can be populated here directly without modifying components.
 * ==============================================================================
 */

export interface MasterHospitalData {
  hospitalInfo: HospitalInfo;
  address: {
    campusName: string;
    street: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    directionsUrl: string;
    embedMapUrl: string;
  };
  contact: {
    emergencyNumber: string;
    ambulanceNumber: string;
    generalBoard: string;
    appointmentDesk: string;
    email: string;
    tpaDeskEmail: string;
  };
  workingHours: {
    opdConsultation: string;
    emergencyServices: string;
    visitingHoursGeneral: string;
    visitingHoursICU: string;
    pharmacyHours: string;
    labSampleCollectionHours: string;
  };
  departments: Department[];
  doctors: Doctor[];
  services: MedicalService[];
  facilities: Facility[];
  appointmentInformation: {
    bookingPolicy: string;
    timings: string;
    helpline: string;
    confirmationDisclaimer: string;
  };
  insurance: {
    tpaDeskHours: string;
    contactExtension: string;
    directEmail: string;
    disclaimer: string;
    requiredDocuments: string[];
  };
  pharmacy: {
    location: string;
    timings: string;
    phoneExtension: string;
    policyNote: string;
  };
  diagnostics: {
    labTimings: string;
    emergencyLabTimings: string;
    reportCollectionDesk: string;
  };
  healthPackages: HealthPackage[];
  articles: HealthArticle[];
  events: HealthEvent[];
  gallery: GalleryItem[];
  careers: CareerPosition[];
  testimonials: PatientTestimonial[];
  faqs: FAQItem[];
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  claimsAuditNotice: string;
}

export const masterHospitalData: MasterHospitalData = {
  hospitalInfo: {
    name: 'IndoStates Hospital',
    logo: null, // [HOSPITAL TO PROVIDE LOGO: e.g. src/assets/logo/logo-primary.svg]
    tagline: 'Compassionate Care. Advanced Healthcare.',
    subtagline: 'Comprehensive healthcare delivered with expertise, modern technology, and patient-centered clinical care.',
    address: '[HOSPITAL TO PROVIDE STREET ADDRESS], [HOSPITAL TO PROVIDE AREA / LANDMARK], [HOSPITAL TO PROVIDE CITY] - [PINCODE], [HOSPITAL TO PROVIDE STATE], India',
    phone: '+91 [HOSPITAL TO PROVIDE GENERAL PHONE]',
    emergencyNumber: '+91 [HOSPITAL TO PROVIDE EMERGENCY NUMBER]',
    emergencyPhone: '+91 [HOSPITAL TO PROVIDE EMERGENCY NUMBER]',
    ambulancePhone: '+91 [HOSPITAL TO PROVIDE AMBULANCE NUMBER]',
    generalPhone: '+91 [HOSPITAL TO PROVIDE GENERAL PHONE]',
    appointmentHelpline: '+91 [HOSPITAL TO PROVIDE APPOINTMENT HELPLINE]',
    email: '[HOSPITAL TO PROVIDE OFFICIAL EMAIL]',
    addressLine1: '[HOSPITAL TO PROVIDE STREET ADDRESS]',
    addressLine2: '[HOSPITAL TO PROVIDE AREA / LANDMARK]',
    city: '[HOSPITAL TO PROVIDE CITY]',
    state: '[HOSPITAL TO PROVIDE STATE]',
    pincode: '[PINCODE]',
    country: 'India',
    workingHours: '[HOSPITAL TO CONFIRM OPD & EMERGENCY HOURS: e.g. Mon–Sat 08:00 AM – 08:00 PM | Emergency 24 Hours]',
    opdHours: '[HOSPITAL TO CONFIRM OPD HOURS: e.g. Mon–Sat 08:00 AM – 08:00 PM]',
    opdTimings: '[HOSPITAL TO CONFIRM OPD HOURS: e.g. Mon–Sat 08:00 AM – 08:00 PM]',
    visitingHours: '[HOSPITAL TO CONFIRM VISITING HOURS: e.g. Daily 04:30 PM – 07:00 PM]',
    emergencyAvailability: '[HOSPITAL TO CONFIRM EMERGENCY SERVICE SCHEDULE]',
    googleMapsUrl: 'https://maps.google.com/?q=IndoStates+Hospital',
    googleMapsEmbedUrl: '', // [HOSPITAL TO PROVIDE GOOGLE MAPS EMBED URL]
    googleMapsDirectionsUrl: 'https://maps.google.com/?q=IndoStates+Hospital',
    socialLinks: {
      facebook: '[HOSPITAL TO PROVIDE FACEBOOK URL]',
      instagram: '[HOSPITAL TO PROVIDE INSTAGRAM URL]',
      linkedin: '[HOSPITAL TO PROVIDE LINKEDIN URL]',
      youtube: '[HOSPITAL TO PROVIDE YOUTUBE URL]'
    },
    demoNotice: 'DEMO NOTICE: All clinical names, telephone placeholders, timings, and staff credentials on this preview site are demonstration placeholders. Official hospital data will be populated upon institutional sign-off.',
    claimsNotice: 'CLAIMS AUDIT NOTICE: Specific service accreditations, emergency triage capabilities, doctor registries, and facilities are subject to institutional confirmation by IndoStates Hospital management.'
  },

  address: {
    campusName: 'IndoStates Hospital',
    street: '[HOSPITAL TO PROVIDE STREET ADDRESS]',
    area: '[HOSPITAL TO PROVIDE AREA / LANDMARK]',
    city: '[HOSPITAL TO PROVIDE CITY]',
    state: '[HOSPITAL TO PROVIDE STATE]',
    pincode: '[PINCODE]',
    country: 'India',
    directionsUrl: 'https://maps.google.com/?q=IndoStates+Hospital',
    embedMapUrl: ''
  },

  contact: {
    emergencyNumber: '+91 [HOSPITAL TO PROVIDE EMERGENCY NUMBER]',
    ambulanceNumber: '+91 [HOSPITAL TO PROVIDE AMBULANCE NUMBER]',
    generalBoard: '+91 [HOSPITAL TO PROVIDE GENERAL PHONE]',
    appointmentDesk: '+91 [HOSPITAL TO PROVIDE APPOINTMENT HELPLINE]',
    email: '[HOSPITAL TO PROVIDE OFFICIAL EMAIL]',
    tpaDeskEmail: '[HOSPITAL TO PROVIDE INSURANCE DESK EMAIL]'
  },

  workingHours: {
    opdConsultation: '[HOSPITAL TO CONFIRM: Mon–Sat 08:00 AM – 08:00 PM]',
    emergencyServices: '[HOSPITAL TO CONFIRM EMERGENCY SCHEDULE: e.g. 24 Hours / 7 Days]',
    visitingHoursGeneral: '[HOSPITAL TO CONFIRM: 04:30 PM – 07:00 PM]',
    visitingHoursICU: '[HOSPITAL TO CONFIRM: 05:00 PM – 06:00 PM]',
    pharmacyHours: '[HOSPITAL TO CONFIRM: 24 Hours / 7 Days]',
    labSampleCollectionHours: '[HOSPITAL TO CONFIRM: 07:00 AM – 08:00 PM]'
  },

  appointmentInformation: {
    bookingPolicy: 'Online appointment submissions constitute consultation requests. Formal tokens are scheduled after hospital desk verification of doctor availability.',
    timings: '[HOSPITAL TO CONFIRM: Mon–Sat 08:00 AM – 08:00 PM]',
    helpline: '+91 [HOSPITAL TO PROVIDE APPOINTMENT HELPLINE]',
    confirmationDisclaimer: 'Submission of an appointment request does not guarantee a slot until confirmed by hospital administration.'
  },

  insurance: {
    tpaDeskHours: '[HOSPITAL TO CONFIRM TPA DESK HOURS]',
    contactExtension: '[HOSPITAL TO PROVIDE TPA EXTENSION]',
    directEmail: '[HOSPITAL TO PROVIDE TPA EMAIL]',
    disclaimer: 'Cashless hospitalisation is subject to individual policy terms, pre-authorization approval, and empanelment confirmation by IndoStates Hospital and respective insurance TPAs. [HOSPITAL TO PROVIDE EMPANELED TPA LIST].',
    requiredDocuments: [
      'Original Health Insurance Card or Policy Certificate [HOSPITAL TO CONFIRM DOCUMENT REQUIREMENTS]',
      'Government Photo ID of Patient (Aadhaar / Voter ID / Passport)',
      'Treating Consultant Admission Advice Note',
      'Recent diagnostic reports and medical history',
      'Signed Pre-Authorization Form (available at TPA Desk)'
    ]
  },

  pharmacy: {
    location: '[HOSPITAL TO CONFIRM: Ground Floor, Main Entrance]',
    timings: '[HOSPITAL TO CONFIRM: 24 Hours / 7 Days]',
    phoneExtension: '[HOSPITAL TO PROVIDE PHARMACY EXTENSION]',
    policyNote: 'Prescription drugs are dispensed strictly against authorized, valid doctor prescriptions in compliance with healthcare regulations.'
  },

  diagnostics: {
    labTimings: '[HOSPITAL TO CONFIRM: 07:00 AM – 08:00 PM]',
    emergencyLabTimings: '[HOSPITAL TO CONFIRM EMERGENCY LAB SCHEDULE]',
    reportCollectionDesk: '[HOSPITAL TO CONFIRM: Ground Floor Diagnostics Counter]'
  },

  socialLinks: {
    facebook: '',
    instagram: '',
    linkedin: '',
    youtube: ''
  },

  claimsAuditNotice: 'All statements concerning medical infrastructure, bed counts, emergency response, and clinical specialties are subject to official verification by IndoStates Hospital management.',

  // 12 DEPARTMENTS (Structured for replacement with hospital's verified list)
  departments: [
    {
      id: 'dept-cardiology',
      slug: 'cardiology',
      name: 'Cardiology & Vascular Sciences',
      tagline: '[HOSPITAL TO CONFIRM CLINICAL SCOPE: Heart care, diagnostics & cardiovascular consultation]',
      icon: 'HeartPulse',
      category: 'clinical',
      shortDesc: '[Clinical scope to be confirmed by hospital: Diagnostic cardiology, preventive heart screening, and physician consultations.]',
      overview: 'The Department of Cardiology & Vascular Sciences at IndoStates Hospital is structured to deliver clinical evaluations, cardiac diagnostic testing, and preventive heart health management. [Detailed clinical services to be authorized by hospital medical director].',
      keyServices: [
        'Echocardiography (2D & Doppler) [HOSPITAL TO CONFIRM]',
        'Treadmill Stress Testing (TMT) [HOSPITAL TO CONFIRM]',
        'Electrocardiography (ECG) [HOSPITAL TO CONFIRM]',
        'Preventive Cardiac Risk Consultations [HOSPITAL TO CONFIRM]',
        'Hypertension & Heart Failure Management [HOSPITAL TO CONFIRM]'
      ],
      commonTreatments: [
        'Coronary Artery Disease Evaluation',
        'Hypertension Assessment',
        'Arrhythmia Follow-up',
        'Preventive Lifestyle Counseling'
      ],
      facilitiesAvailable: [
        'Non-Invasive Cardiac Diagnostic Room [HOSPITAL TO CONFIRM]',
        'Cardiac Inpatient Care Beds [HOSPITAL TO CONFIRM]',
        'Outpatient Consultation Suites [HOSPITAL TO CONFIRM]'
      ],
      opdTimings: '[HOSPITAL TO PROVIDE OPD SCHEDULE: e.g. Mon–Sat 09:00 AM – 05:00 PM]',
      faqs: [
        {
          question: 'How do I schedule a cardiology consultation?',
          answer: 'You may request an appointment online or call the hospital appointment desk. [HOSPITAL TO PROVIDE CONTACT].'
        }
      ],
      featuredDoctorIds: ['doc-1'],
      isVerifiedByHospital: false
    },
    {
      id: 'dept-neurology',
      slug: 'neurology',
      name: 'Neurology & Neurosciences',
      tagline: '[HOSPITAL TO CONFIRM CLINICAL SCOPE: Diagnosis and management of neurological conditions]',
      icon: 'Brain',
      category: 'clinical',
      shortDesc: '[Clinical scope to be confirmed by hospital: Neurological assessments, headache evaluation, stroke care, and nerve disorder management.]',
      overview: 'The Department of Neurology provides diagnostic and medical management for disorders of the brain, spinal cord, and nervous system. [Detailed departmental scope to be provided by hospital].',
      keyServices: [
        'Clinical Neurological Examinations [HOSPITAL TO CONFIRM]',
        'Electroencephalography (EEG) [HOSPITAL TO CONFIRM]',
        'Headache & Migraine Management [HOSPITAL TO CONFIRM]',
        'Neuropathy & Movement Assessments [HOSPITAL TO CONFIRM]'
      ],
      commonTreatments: [
        'Stroke Evaluation & Rehabilitation Follow-up',
        'Chronic Migraine Management',
        'Peripheral Neuropathy Care'
      ],
      facilitiesAvailable: [
        'Neuro-diagnostic Testing Suite [HOSPITAL TO CONFIRM]',
        'Outpatient Consultation Rooms [HOSPITAL TO CONFIRM]'
      ],
      opdTimings: '[HOSPITAL TO PROVIDE OPD SCHEDULE]',
      faqs: [
        {
          question: 'When should I consult a neurologist?',
          answer: 'Consult a neurologist for persistent severe headaches, unexplained seizures, numbness, dizziness, or movement tremors.'
        }
      ],
      featuredDoctorIds: ['doc-2'],
      isVerifiedByHospital: false
    },
    {
      id: 'dept-orthopedics',
      slug: 'orthopedics',
      name: 'Orthopedics & Joint Care',
      tagline: '[HOSPITAL TO CONFIRM CLINICAL SCOPE: Bone, joint, fracture & musculoskeletal care]',
      icon: 'Bone',
      category: 'surgical',
      shortDesc: '[Clinical scope to be confirmed by hospital: Joint care, trauma fracture treatment, arthroscopy, and spine care.]',
      overview: 'The Department of Orthopedics offers clinical evaluation and surgical solutions for musculoskeletal ailments, fractures, arthritis, and sports injuries. [Hospital to provide full orthopedic profile].',
      keyServices: [
        'Joint Replacement Consultations [HOSPITAL TO CONFIRM]',
        'Fracture & Trauma Management [HOSPITAL TO CONFIRM]',
        'Arthroscopic Joint Evaluation [HOSPITAL TO CONFIRM]',
        'Spine & Back Pain Clinic [HOSPITAL TO CONFIRM]'
      ],
      commonTreatments: [
        'Knee & Hip Osteoarthritis Care',
        'Fracture Fixation & Plaster Care',
        'Ligament & Tendon Strain Management'
      ],
      facilitiesAvailable: [
        'Orthopedic Procedure Room [HOSPITAL TO CONFIRM]',
        'Digital X-Ray Diagnostic Unit [HOSPITAL TO CONFIRM]',
        'Physiotherapy Unit [HOSPITAL TO CONFIRM]'
      ],
      opdTimings: '[HOSPITAL TO PROVIDE OPD SCHEDULE]',
      faqs: [
        {
          question: 'Are physiotherapy services available for orthopedic patients?',
          answer: 'Yes, physical therapy protocols support joint recovery. [HOSPITAL TO CONFIRM PHYSIOTHERAPY UNIT AVAILABILITY].'
        }
      ],
      featuredDoctorIds: ['doc-3'],
      isVerifiedByHospital: false
    },
    {
      id: 'dept-pediatrics',
      slug: 'pediatrics',
      name: 'Pediatrics & Child Health',
      tagline: '[HOSPITAL TO CONFIRM CLINICAL SCOPE: Medical care for infants, children & adolescents]',
      icon: 'Baby',
      category: 'clinical',
      shortDesc: '[Clinical scope to be confirmed by hospital: General pediatric OPD, immunization clinics, growth assessment, and infant wellness.]',
      overview: 'IndoStates Hospital Pediatrics provides compassionate outpatient and inpatient care for children from infancy through adolescence. [Hospital to confirm pediatric specialties].',
      keyServices: [
        'Routine Childhood Immunizations [HOSPITAL TO CONFIRM]',
        'Growth & Developmental Milestone Screening [HOSPITAL TO CONFIRM]',
        'Pediatric Respiratory & Allergy Care [HOSPITAL TO CONFIRM]',
        'General Pediatric Infections Management [HOSPITAL TO CONFIRM]'
      ],
      commonTreatments: [
        'Childhood Viral Illnesses & Fevers',
        'Pediatric Asthma & Wheezing',
        'Nutritional & Growth Consultations'
      ],
      facilitiesAvailable: [
        'Pediatric Waiting Area [HOSPITAL TO CONFIRM]',
        'Child Examination Suite [HOSPITAL TO CONFIRM]'
      ],
      opdTimings: '[HOSPITAL TO PROVIDE OPD SCHEDULE]',
      faqs: [
        {
          question: 'Should I bring previous immunization records?',
          answer: 'Yes, please carry previous vaccine records for accurate milestone tracking.'
        }
      ],
      featuredDoctorIds: ['doc-4'],
      isVerifiedByHospital: false
    },
    {
      id: 'dept-general-medicine',
      slug: 'general-medicine',
      name: 'General Medicine & Diabetology',
      tagline: '[HOSPITAL TO CONFIRM CLINICAL SCOPE: Internal medicine, chronic disease & diabetes care]',
      icon: 'Stethoscope',
      category: 'clinical',
      shortDesc: '[Clinical scope to be confirmed by hospital: Primary medical consultations, chronic disease management, diabetes, and fevers.]',
      overview: 'The Department of General Medicine handles broad-spectrum adult medical conditions, acute fevers, metabolic disorders, and chronic hypertension. [Hospital to provide details].',
      keyServices: [
        'Comprehensive Diabetes Management [HOSPITAL TO CONFIRM]',
        'Hypertension & Metabolic Health Review [HOSPITAL TO CONFIRM]',
        'Acute Fever & Infection Care [HOSPITAL TO CONFIRM]',
        'Geriatric Healthcare Consultations [HOSPITAL TO CONFIRM]'
      ],
      commonTreatments: [
        'Type 2 & Type 1 Diabetes',
        'Hypertension & Cholesterol',
        'Seasonal Fevers & Infections'
      ],
      facilitiesAvailable: [
        'Inpatient Medical Wards [HOSPITAL TO CONFIRM]',
        'OPD Consulting Suites [HOSPITAL TO CONFIRM]'
      ],
      opdTimings: '[HOSPITAL TO PROVIDE OPD SCHEDULE]',
      faqs: [
        {
          question: 'What conditions does an internal medicine doctor treat?',
          answer: 'General physicians diagnose undiagnosed symptoms, manage chronic illnesses, and coordinate multi-specialty referrals.'
        }
      ],
      featuredDoctorIds: ['doc-5'],
      isVerifiedByHospital: false
    },
    {
      id: 'dept-general-surgery',
      slug: 'general-surgery',
      name: 'General & Laparoscopic Surgery',
      tagline: '[HOSPITAL TO CONFIRM CLINICAL SCOPE: Minimal access & general surgical care]',
      icon: 'Scissors',
      category: 'surgical',
      shortDesc: '[Clinical scope to be confirmed by hospital: Laparoscopic abdominal surgeries, hernia repair, gallbladder, and minor procedures.]',
      overview: 'The Department of General Surgery provides elective and emergency surgical procedures utilizing modern operative equipment. [Hospital to confirm surgical lists].',
      keyServices: [
        'Laparoscopic Cholecystectomy (Gallbladder) [HOSPITAL TO CONFIRM]',
        'Laparoscopic Hernia Repair [HOSPITAL TO CONFIRM]',
        'Laparoscopic Appendectomy [HOSPITAL TO CONFIRM]',
        'Minor Day-Care Surgical Procedures [HOSPITAL TO CONFIRM]'
      ],
      commonTreatments: [
        'Gallstones & Hernias',
        'Appendicitis',
        'Soft Tissue Cysts & Lipomas'
      ],
      facilitiesAvailable: [
        'Operating Theatres [HOSPITAL TO CONFIRM]',
        'Post-Operative Recovery Ward [HOSPITAL TO CONFIRM]'
      ],
      opdTimings: '[HOSPITAL TO PROVIDE OPD SCHEDULE]',
      faqs: [
        {
          question: 'What is laparoscopic surgery?',
          answer: 'Laparoscopic surgery uses small keyhole incisions and a miniature camera for reduced tissue trauma and quicker recovery.'
        }
      ],
      featuredDoctorIds: ['doc-6'],
      isVerifiedByHospital: false
    },
    {
      id: 'dept-obgyn',
      slug: 'obstetrics-gynecology',
      name: 'Obstetrics & Gynecology',
      tagline: '[HOSPITAL TO CONFIRM CLINICAL SCOPE: Women’s health, maternity & gynecological care]',
      icon: 'HeartHandshake',
      category: 'clinical',
      shortDesc: '[Clinical scope to be confirmed by hospital: Antenatal care, maternity deliveries, women’s wellness, and gynecological consultations.]',
      overview: 'IndoStates Hospital OB/GYN provides medical care across every phase of womanhood, including pregnancy monitoring, delivery support, and reproductive health. [Hospital to provide details].',
      keyServices: [
        'Antenatal Care & Fetal Monitoring [HOSPITAL TO CONFIRM]',
        'Normal Delivery & Cesarean Services [HOSPITAL TO CONFIRM]',
        'Gynecological Consultations & Screening [HOSPITAL TO CONFIRM]',
        'Pap Smears & Women’s Health Packages [HOSPITAL TO CONFIRM]'
      ],
      commonTreatments: [
        'Pregnancy Health & Antenatal Checkups',
        'PCOS & Menstrual Disorders',
        'Gynecological Health Screening'
      ],
      facilitiesAvailable: [
        'Labor & Delivery Room [HOSPITAL TO CONFIRM]',
        'Women’s Health Consulting Suite [HOSPITAL TO CONFIRM]'
      ],
      opdTimings: '[HOSPITAL TO PROVIDE OPD SCHEDULE]',
      faqs: [
        {
          question: 'Are maternity delivery packages available?',
          answer: 'Please contact the hospital admission desk for current maternity package details. [HOSPITAL TO PROVIDE DETAILS].'
        }
      ],
      featuredDoctorIds: ['doc-7'],
      isVerifiedByHospital: false
    },
    {
      id: 'dept-gastroenterology',
      slug: 'gastroenterology',
      name: 'Gastroenterology & Hepatology',
      tagline: '[HOSPITAL TO CONFIRM CLINICAL SCOPE: Digestive system and liver health]',
      icon: 'Activity',
      category: 'clinical',
      shortDesc: '[Clinical scope to be confirmed by hospital: Endoscopy, digestive health, liver evaluations, and acid reflux management.]',
      overview: 'The Gastroenterology service manages conditions of the esophagus, stomach, intestines, and liver. [Hospital to confirm diagnostic capabilities].',
      keyServices: [
        'Diagnostic Upper GI Endoscopy [HOSPITAL TO CONFIRM]',
        'Colonoscopy Screening [HOSPITAL TO CONFIRM]',
        'Liver Function & Hepatitis Evaluations [HOSPITAL TO CONFIRM]',
        'Acid Reflux & Peptic Ulcer Management [HOSPITAL TO CONFIRM]'
      ],
      commonTreatments: [
        'GERD & Acidity Disorders',
        'Fatty Liver Disease Monitoring',
        'Irritable Bowel Syndrome (IBS)'
      ],
      facilitiesAvailable: [
        'Endoscopy Procedure Suite [HOSPITAL TO CONFIRM]'
      ],
      opdTimings: '[HOSPITAL TO PROVIDE OPD SCHEDULE]',
      faqs: [
        {
          question: 'How do I prepare for an endoscopy?',
          answer: 'Endoscopic evaluations usually require 6 to 8 hours of prior fasting. [HOSPITAL TO CONFIRM PREPARATION GUIDELINES].'
        }
      ],
      featuredDoctorIds: ['doc-8'],
      isVerifiedByHospital: false
    },
    {
      id: 'dept-ophthalmology',
      slug: 'ophthalmology',
      name: 'Ophthalmology (Eye Care)',
      tagline: '[HOSPITAL TO CONFIRM CLINICAL SCOPE: Comprehensive eye examinations and vision health]',
      icon: 'Eye',
      category: 'clinical',
      shortDesc: '[Clinical scope to be confirmed by hospital: Vision testing, cataract screening, glaucoma checks, and refractive examinations.]',
      overview: 'Our eye care services provide vision assessments, eye pressure testing, and consultations for ocular health. [Hospital to confirm ophthalmology services].',
      keyServices: [
        'Computerized Refractive Eye Exam [HOSPITAL TO CONFIRM]',
        'Cataract Evaluation [HOSPITAL TO CONFIRM]',
        'Diabetic Retinopathy Screening [HOSPITAL TO CONFIRM]',
        'Glaucoma Pressure Testing [HOSPITAL TO CONFIRM]'
      ],
      commonTreatments: [
        'Refractive Errors & Eye Strain',
        'Cataract Assessment',
        'Dry Eye & Conjunctivitis'
      ],
      facilitiesAvailable: [
        'Eye Examination Clinic [HOSPITAL TO CONFIRM]'
      ],
      opdTimings: '[HOSPITAL TO PROVIDE OPD SCHEDULE]',
      faqs: [
        {
          question: 'How often should adults undergo eye checkups?',
          answer: 'An annual vision and retinal exam is recommended, especially for individuals with diabetes or high blood pressure.'
        }
      ],
      featuredDoctorIds: ['doc-9'],
      isVerifiedByHospital: false
    },
    {
      id: 'dept-ent',
      slug: 'ent',
      name: 'Ear, Nose & Throat (ENT)',
      tagline: '[HOSPITAL TO CONFIRM CLINICAL SCOPE: Diagnosis of ear, nose, throat and hearing conditions]',
      icon: 'Headphones',
      category: 'clinical',
      shortDesc: '[Clinical scope to be confirmed by hospital: Sinusitis, hearing evaluations, tonsils, throat care, and vertigo consultations.]',
      overview: 'The ENT Department evaluates disorders of hearing, balance, breathing, and swallowing. [Hospital to confirm ENT services].',
      keyServices: [
        'Nasal & Sinus Consultations [HOSPITAL TO CONFIRM]',
        'Hearing & Audiometry Screening [HOSPITAL TO CONFIRM]',
        'Tonsillitis & Adenoid Care [HOSPITAL TO CONFIRM]',
        'Vertigo & Balance Evaluations [HOSPITAL TO CONFIRM]'
      ],
      commonTreatments: [
        'Chronic Sinusitis & Allergies',
        'Ear Infections & Hearing Loss',
        'Throat Irritation & Tonsillitis'
      ],
      facilitiesAvailable: [
        'ENT Diagnostic Suite [HOSPITAL TO CONFIRM]'
      ],
      opdTimings: '[HOSPITAL TO PROVIDE OPD SCHEDULE]',
      faqs: [
        {
          question: 'When should I see an ENT specialist?',
          answer: 'Consult an ENT specialist for persistent ear discharge, hearing difficulties, chronic nasal blockage, or recurrent sore throat.'
        }
      ],
      featuredDoctorIds: ['doc-10'],
      isVerifiedByHospital: false
    },
    {
      id: 'dept-dermatology',
      slug: 'dermatology',
      name: 'Dermatology & Skin Care',
      tagline: '[HOSPITAL TO CONFIRM CLINICAL SCOPE: Clinical skin, hair and nail care]',
      icon: 'Sparkles',
      category: 'clinical',
      shortDesc: '[Clinical scope to be confirmed by hospital: Eczema, psoriasis, acne management, allergies, and dermatological care.]',
      overview: 'Our clinical dermatology consultations evaluate inflammatory, allergic, and infectious skin conditions. [Hospital to confirm dermatology scope].',
      keyServices: [
        'Acne & Skin Condition Management [HOSPITAL TO CONFIRM]',
        'Psoriasis & Eczema Consultations [HOSPITAL TO CONFIRM]',
        'Skin Allergy Evaluations [HOSPITAL TO CONFIRM]',
        'Hair Loss & Scalp Health Assessment [HOSPITAL TO CONFIRM]'
      ],
      commonTreatments: [
        'Acne & Rosacea',
        'Skin Allergies & Dermatitis',
        'Fungal & Bacterial Infections'
      ],
      facilitiesAvailable: [
        'Dermatology Clinic [HOSPITAL TO CONFIRM]'
      ],
      opdTimings: '[HOSPITAL TO PROVIDE OPD SCHEDULE]',
      faqs: [
        {
          question: 'Are skin allergy tests performed?',
          answer: 'Please contact the dermatology clinic for available testing options. [HOSPITAL TO CONFIRM].'
        }
      ],
      featuredDoctorIds: ['doc-11'],
      isVerifiedByHospital: false
    },
    {
      id: 'dept-urology',
      slug: 'urology',
      name: 'Urology & Kidney Care',
      tagline: '[HOSPITAL TO CONFIRM CLINICAL SCOPE: Urinary tract and kidney stone consultations]',
      icon: 'ShieldAlert',
      category: 'surgical',
      shortDesc: '[Clinical scope to be confirmed by hospital: Kidney stones, urinary infections, prostate health, and urological care.]',
      overview: 'The Urology Department provides consultations and surgical management for the urinary tract and male reproductive organs. [Hospital to provide details].',
      keyServices: [
        'Kidney Stone Evaluation [HOSPITAL TO CONFIRM]',
        'Prostate Health Screening [HOSPITAL TO CONFIRM]',
        'Urinary Tract Infection Clinic [HOSPITAL TO CONFIRM]',
        'Uroflowmetry Assessment [HOSPITAL TO CONFIRM]'
      ],
      commonTreatments: [
        'Renal & Ureteric Calculi (Stones)',
        'Benign Prostatic Hyperplasia (BPH)',
        'Recurrent Urinary Tract Infections'
      ],
      facilitiesAvailable: [
        'Urology Outpatient Clinic [HOSPITAL TO CONFIRM]'
      ],
      opdTimings: '[HOSPITAL TO PROVIDE OPD SCHEDULE]',
      faqs: [
        {
          question: 'How are kidney stones evaluated?',
          answer: 'Evaluations typically involve clinical examination, ultrasound or CT imaging, and urine/blood tests.'
        }
      ],
      featuredDoctorIds: ['doc-12'],
      isVerifiedByHospital: false
    }
  ],

  // DOCTOR DIRECTORY (Complies with Task 3 & 4: Clearly marked demo placeholders)
  doctors: [
    {
      id: 'doc-1',
      slug: 'dr-demo-doctor-cardiology',
      name: 'Dr. Demo Doctor 1 (Cardiology)',
      designation: 'Consultant Cardiologist [HOSPITAL TO PROVIDE TITLE]',
      title: 'Consultant Cardiologist [HOSPITAL TO PROVIDE TITLE]',
      profileImage: null,
      profilePhoto: null,
      photoPlaceholderText: '[DOCTOR PHOTO TO BE PROVIDED]',
      qualification: 'MBBS, MD, DM [QUALIFICATION TO BE PROVIDED]',
      department: 'Cardiology & Vascular Sciences',
      departmentId: 'dept-cardiology',
      departmentName: 'Cardiology & Vascular Sciences',
      specialization: 'Cardiology [SPECIALIZATION TO BE PROVIDED]',
      subSpecialization: 'Interventional Cardiology [HOSPITAL TO PROVIDE]',
      experience: '[EXPERIENCE TO BE PROVIDED: e.g. 15+ Years]',
      experienceYears: '[EXPERIENCE TO BE PROVIDED: e.g. 15+ Years]',
      consultationTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS: e.g. Mon–Fri 10:00 AM – 02:00 PM]',
      opdTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS: e.g. Mon–Fri 10:00 AM – 02:00 PM]',
      consultationLocation: 'IndoStates Hospital Main Campus, [HOSPITAL TO PROVIDE OPD ROOM: e.g. Suite 204]',
      opdRoom: '[HOSPITAL TO PROVIDE OPD ROOM / LOCATION: e.g. OPD Suite 204]',
      location: 'IndoStates Hospital Main Campus',
      languages: ['[HOSPITAL TO PROVIDE LANGUAGES: e.g. English, Regional Language]'],
      biography: 'Representative doctor profile placeholder for Cardiology Department. [Hospital medical registry credentials to be updated prior to public launch].',
      about: 'Representative doctor profile placeholder for Cardiology Department. [Hospital medical registry credentials to be updated prior to public launch].',
      detailedProfile: 'Detailed professional biography, research papers, clinical fellowship credentials, and institutional achievements to be provided by hospital administration for this consultant.',
      expertise: [
        'Coronary Artery Disease Evaluation [HOSPITAL TO CONFIRM]',
        'Clinical Echocardiography [HOSPITAL TO CONFIRM]',
        'Hypertension Management [HOSPITAL TO CONFIRM]',
        'Preventive Cardiac Risk Stratification [HOSPITAL TO CONFIRM]'
      ],
      areasOfExpertise: [
        'Coronary Artery Disease Evaluation [HOSPITAL TO CONFIRM]',
        'Clinical Echocardiography [HOSPITAL TO CONFIRM]',
        'Hypertension Management [HOSPITAL TO CONFIRM]',
        'Preventive Cardiac Risk Stratification [HOSPITAL TO CONFIRM]'
      ],
      education: [
        '[MEDICAL DEGREE TO BE PROVIDED BY HOSPITAL]',
        '[POST-GRADUATION CREDENTIAL TO BE PROVIDED]',
        '[SUPER-SPECIALTY / FELLOWSHIP TO BE PROVIDED]'
      ],
      appointmentAvailability: '[HOSPITAL TO CONFIRM APPOINTMENT SCHEDULE]',
      isFeatured: true,
      isDemoPlaceholder: true
    },
    {
      id: 'doc-2',
      slug: 'dr-demo-doctor-neurology',
      name: 'Dr. Demo Doctor 2 (Neurology)',
      designation: 'Consultant Neurologist [HOSPITAL TO PROVIDE TITLE]',
      title: 'Consultant Neurologist [HOSPITAL TO PROVIDE TITLE]',
      profileImage: null,
      profilePhoto: null,
      photoPlaceholderText: '[DOCTOR PHOTO TO BE PROVIDED]',
      qualification: 'MBBS, MD, DM [QUALIFICATION TO BE PROVIDED]',
      department: 'Neurology & Neurosciences',
      departmentId: 'dept-neurology',
      departmentName: 'Neurology & Neurosciences',
      specialization: 'Neurology [SPECIALIZATION TO BE PROVIDED]',
      subSpecialization: 'Stroke & Epilepsy Care [HOSPITAL TO PROVIDE]',
      experience: '[EXPERIENCE TO BE PROVIDED]',
      experienceYears: '[EXPERIENCE TO BE PROVIDED]',
      consultationTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      opdTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      consultationLocation: 'IndoStates Hospital Main Campus, [HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      opdRoom: '[HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      location: 'IndoStates Hospital Main Campus',
      languages: ['[HOSPITAL TO PROVIDE LANGUAGES]'],
      biography: 'Representative doctor profile placeholder for Neurology Department. [Hospital medical registry credentials to be updated].',
      about: 'Representative doctor profile placeholder for Neurology Department. [Hospital medical registry credentials to be updated].',
      detailedProfile: 'Detailed clinical background, certifications, and neurology practice profile to be provided by hospital administration.',
      expertise: [
        'Neurological Clinical Evaluations [HOSPITAL TO CONFIRM]',
        'Chronic Migraine Management [HOSPITAL TO CONFIRM]',
        'Seizure & Epilepsy Care [HOSPITAL TO CONFIRM]'
      ],
      areasOfExpertise: [
        'Neurological Clinical Evaluations [HOSPITAL TO CONFIRM]',
        'Chronic Migraine Management [HOSPITAL TO CONFIRM]',
        'Seizure & Epilepsy Care [HOSPITAL TO CONFIRM]'
      ],
      education: [
        '[MEDICAL DEGREE TO BE PROVIDED BY HOSPITAL]',
        '[POST-GRADUATION TO BE PROVIDED]'
      ],
      appointmentAvailability: '[HOSPITAL TO CONFIRM APPOINTMENT SCHEDULE]',
      isFeatured: true,
      isDemoPlaceholder: true
    },
    {
      id: 'doc-3',
      slug: 'dr-demo-doctor-orthopedics',
      name: 'Dr. Demo Doctor 3 (Orthopedics)',
      designation: 'Consultant Orthopedic Surgeon [HOSPITAL TO PROVIDE TITLE]',
      title: 'Consultant Orthopedic Surgeon [HOSPITAL TO PROVIDE TITLE]',
      profileImage: null,
      profilePhoto: null,
      photoPlaceholderText: '[DOCTOR PHOTO TO BE PROVIDED]',
      qualification: 'MBBS, MS (Ortho) [QUALIFICATION TO BE PROVIDED]',
      department: 'Orthopedics & Joint Care',
      departmentId: 'dept-orthopedics',
      departmentName: 'Orthopedics & Joint Care',
      specialization: 'Orthopedic Surgery [SPECIALIZATION TO BE PROVIDED]',
      subSpecialization: 'Joint Replacement & Trauma [HOSPITAL TO PROVIDE]',
      experience: '[EXPERIENCE TO BE PROVIDED]',
      experienceYears: '[EXPERIENCE TO BE PROVIDED]',
      consultationTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      opdTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      consultationLocation: 'IndoStates Hospital Main Campus, [HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      opdRoom: '[HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      location: 'IndoStates Hospital Main Campus',
      languages: ['[HOSPITAL TO PROVIDE LANGUAGES]'],
      biography: 'Representative doctor profile placeholder for Orthopedics Department. [Hospital medical registry credentials to be updated].',
      about: 'Representative doctor profile placeholder for Orthopedics Department. [Hospital medical registry credentials to be updated].',
      detailedProfile: 'Detailed orthopedic surgical background, joint arthroplasty training, and fracture care experience to be provided by hospital.',
      expertise: [
        'Joint Reconstruction & Arthritis Care [HOSPITAL TO CONFIRM]',
        'Trauma Fracture Management [HOSPITAL TO CONFIRM]',
        'Arthroscopic Evaluation [HOSPITAL TO CONFIRM]'
      ],
      areasOfExpertise: [
        'Joint Reconstruction & Arthritis Care [HOSPITAL TO CONFIRM]',
        'Trauma Fracture Management [HOSPITAL TO CONFIRM]',
        'Arthroscopic Evaluation [HOSPITAL TO CONFIRM]'
      ],
      education: [
        '[MEDICAL DEGREE TO BE PROVIDED BY HOSPITAL]',
        '[MS ORTHOPEDICS CREDENTIAL TO BE PROVIDED]'
      ],
      appointmentAvailability: '[HOSPITAL TO CONFIRM APPOINTMENT SCHEDULE]',
      isFeatured: true,
      isDemoPlaceholder: true
    },
    {
      id: 'doc-4',
      slug: 'dr-demo-doctor-pediatrics',
      name: 'Dr. Demo Doctor 4 (Pediatrics)',
      designation: 'Consultant Pediatrician [HOSPITAL TO PROVIDE TITLE]',
      title: 'Consultant Pediatrician [HOSPITAL TO PROVIDE TITLE]',
      profileImage: null,
      profilePhoto: null,
      photoPlaceholderText: '[DOCTOR PHOTO TO BE PROVIDED]',
      qualification: 'MBBS, MD (Pediatrics) [QUALIFICATION TO BE PROVIDED]',
      department: 'Pediatrics & Child Health',
      departmentId: 'dept-pediatrics',
      departmentName: 'Pediatrics & Child Health',
      specialization: 'Pediatrics [SPECIALIZATION TO BE PROVIDED]',
      subSpecialization: 'General Pediatrics & Immunization [HOSPITAL TO PROVIDE]',
      experience: '[EXPERIENCE TO BE PROVIDED]',
      experienceYears: '[EXPERIENCE TO BE PROVIDED]',
      consultationTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      opdTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      consultationLocation: 'IndoStates Hospital Main Campus, [HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      opdRoom: '[HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      location: 'IndoStates Hospital Main Campus',
      languages: ['[HOSPITAL TO PROVIDE LANGUAGES]'],
      biography: 'Representative doctor profile placeholder for Pediatrics Department. [Hospital medical registry credentials to be updated].',
      about: 'Representative doctor profile placeholder for Pediatrics Department. [Hospital medical registry credentials to be updated].',
      detailedProfile: 'Detailed pediatric clinical credentials and child wellness experience to be provided by hospital administration.',
      expertise: [
        'Infant & Child Health Consultations [HOSPITAL TO CONFIRM]',
        'Routine Immunization Guidance [HOSPITAL TO CONFIRM]',
        'Childhood Nutrition & Growth Tracking [HOSPITAL TO CONFIRM]'
      ],
      areasOfExpertise: [
        'Infant & Child Health Consultations [HOSPITAL TO CONFIRM]',
        'Routine Immunization Guidance [HOSPITAL TO CONFIRM]',
        'Childhood Nutrition & Growth Tracking [HOSPITAL TO CONFIRM]'
      ],
      education: [
        '[MEDICAL DEGREE TO BE PROVIDED BY HOSPITAL]',
        '[PEDIATRIC QUALIFICATION TO BE PROVIDED]'
      ],
      appointmentAvailability: '[HOSPITAL TO CONFIRM APPOINTMENT SCHEDULE]',
      isFeatured: false,
      isDemoPlaceholder: true
    },
    {
      id: 'doc-5',
      slug: 'dr-demo-doctor-general-medicine',
      name: 'Dr. Demo Doctor 5 (General Medicine)',
      designation: 'Senior Consultant Physician [HOSPITAL TO PROVIDE TITLE]',
      title: 'Senior Consultant Physician [HOSPITAL TO PROVIDE TITLE]',
      profileImage: null,
      profilePhoto: null,
      photoPlaceholderText: '[DOCTOR PHOTO TO BE PROVIDED]',
      qualification: 'MBBS, MD (Gen Med) [QUALIFICATION TO BE PROVIDED]',
      department: 'General Medicine & Diabetology',
      departmentId: 'dept-general-medicine',
      departmentName: 'General Medicine & Diabetology',
      specialization: 'Internal Medicine [SPECIALIZATION TO BE PROVIDED]',
      subSpecialization: 'Diabetology & Metabolic Care [HOSPITAL TO PROVIDE]',
      experience: '[EXPERIENCE TO BE PROVIDED]',
      experienceYears: '[EXPERIENCE TO BE PROVIDED]',
      consultationTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      opdTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      consultationLocation: 'IndoStates Hospital Main Campus, [HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      opdRoom: '[HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      location: 'IndoStates Hospital Main Campus',
      languages: ['[HOSPITAL TO PROVIDE LANGUAGES]'],
      biography: 'Representative doctor profile placeholder for General Medicine Department. [Hospital medical registry credentials to be updated].',
      about: 'Representative doctor profile placeholder for General Medicine Department. [Hospital medical registry credentials to be updated].',
      detailedProfile: 'Detailed internal medicine background and chronic disease management credentials to be provided by hospital.',
      expertise: [
        'Diabetes & Metabolic Syndrome [HOSPITAL TO CONFIRM]',
        'Hypertension Assessment [HOSPITAL TO CONFIRM]',
        'Acute Medical Illness Evaluation [HOSPITAL TO CONFIRM]'
      ],
      areasOfExpertise: [
        'Diabetes & Metabolic Syndrome [HOSPITAL TO CONFIRM]',
        'Hypertension Assessment [HOSPITAL TO CONFIRM]',
        'Acute Medical Illness Evaluation [HOSPITAL TO CONFIRM]'
      ],
      education: [
        '[MEDICAL DEGREE TO BE PROVIDED BY HOSPITAL]',
        '[MD INTERNAL MEDICINE TO BE PROVIDED]'
      ],
      appointmentAvailability: '[HOSPITAL TO CONFIRM APPOINTMENT SCHEDULE]',
      isFeatured: true,
      isDemoPlaceholder: true
    },
    {
      id: 'doc-6',
      slug: 'dr-demo-doctor-general-surgery',
      name: 'Dr. Demo Doctor 6 (General Surgery)',
      designation: 'Consultant General & Laparoscopic Surgeon [HOSPITAL TO PROVIDE TITLE]',
      title: 'Consultant General & Laparoscopic Surgeon [HOSPITAL TO PROVIDE TITLE]',
      profileImage: null,
      profilePhoto: null,
      photoPlaceholderText: '[DOCTOR PHOTO TO BE PROVIDED]',
      qualification: 'MBBS, MS (Gen Surg) [QUALIFICATION TO BE PROVIDED]',
      department: 'General & Laparoscopic Surgery',
      departmentId: 'dept-general-surgery',
      departmentName: 'General & Laparoscopic Surgery',
      specialization: 'General Surgery [SPECIALIZATION TO BE PROVIDED]',
      subSpecialization: 'Laparoscopic Surgery [HOSPITAL TO PROVIDE]',
      experience: '[EXPERIENCE TO BE PROVIDED]',
      experienceYears: '[EXPERIENCE TO BE PROVIDED]',
      consultationTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      opdTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      consultationLocation: 'IndoStates Hospital Main Campus, [HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      opdRoom: '[HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      location: 'IndoStates Hospital Main Campus',
      languages: ['[HOSPITAL TO PROVIDE LANGUAGES]'],
      biography: 'Representative doctor profile placeholder for General Surgery Department. [Hospital medical registry credentials to be updated].',
      about: 'Representative doctor profile placeholder for General Surgery Department. [Hospital medical registry credentials to be updated].',
      detailedProfile: 'Detailed surgical credentials and minimal access experience to be provided by hospital administration.',
      expertise: [
        'Laparoscopic Hernia & Gallbladder Surgeries [HOSPITAL TO CONFIRM]',
        'Appendectomy [HOSPITAL TO CONFIRM]',
        'General Surgical Consultations [HOSPITAL TO CONFIRM]'
      ],
      areasOfExpertise: [
        'Laparoscopic Hernia & Gallbladder Surgeries [HOSPITAL TO CONFIRM]',
        'Appendectomy [HOSPITAL TO CONFIRM]',
        'General Surgical Consultations [HOSPITAL TO CONFIRM]'
      ],
      education: [
        '[MEDICAL DEGREE TO BE PROVIDED BY HOSPITAL]',
        '[SURGICAL CREDENTIALS TO BE PROVIDED]'
      ],
      appointmentAvailability: '[HOSPITAL TO CONFIRM APPOINTMENT SCHEDULE]',
      isFeatured: false,
      isDemoPlaceholder: true
    },
    {
      id: 'doc-7',
      slug: 'dr-demo-doctor-obgyn',
      name: 'Dr. Demo Doctor 7 (Obstetrics & Gynecology)',
      designation: 'Consultant Obstetrician & Gynecologist [HOSPITAL TO PROVIDE TITLE]',
      title: 'Consultant Obstetrician & Gynecologist [HOSPITAL TO PROVIDE TITLE]',
      profileImage: null,
      profilePhoto: null,
      photoPlaceholderText: '[DOCTOR PHOTO TO BE PROVIDED]',
      qualification: 'MBBS, MS (OBG) [QUALIFICATION TO BE PROVIDED]',
      department: 'Obstetrics & Gynecology',
      departmentId: 'dept-obgyn',
      departmentName: 'Obstetrics & Gynecology',
      specialization: 'Obstetrics & Gynecology [SPECIALIZATION TO BE PROVIDED]',
      subSpecialization: 'Maternal & Women’s Health [HOSPITAL TO PROVIDE]',
      experience: '[EXPERIENCE TO BE PROVIDED]',
      experienceYears: '[EXPERIENCE TO BE PROVIDED]',
      consultationTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      opdTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      consultationLocation: 'IndoStates Hospital Main Campus, [HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      opdRoom: '[HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      location: 'IndoStates Hospital Main Campus',
      languages: ['[HOSPITAL TO PROVIDE LANGUAGES]'],
      biography: 'Representative doctor profile placeholder for Obstetrics & Gynecology Department. [Hospital medical registry credentials to be updated].',
      about: 'Representative doctor profile placeholder for Obstetrics & Gynecology Department. [Hospital medical registry credentials to be updated].',
      detailedProfile: 'Detailed obstetric credentials and women’s health background to be provided by hospital administration.',
      expertise: [
        'Antenatal Care & Deliveries [HOSPITAL TO CONFIRM]',
        'Women’s Health Screening [HOSPITAL TO CONFIRM]',
        'PCOS & Menstrual Health Consultations [HOSPITAL TO CONFIRM]'
      ],
      areasOfExpertise: [
        'Antenatal Care & Deliveries [HOSPITAL TO CONFIRM]',
        'Women’s Health Screening [HOSPITAL TO CONFIRM]',
        'PCOS & Menstrual Health Consultations [HOSPITAL TO CONFIRM]'
      ],
      education: [
        '[MEDICAL DEGREE TO BE PROVIDED BY HOSPITAL]',
        '[OBG POST-GRADUATION TO BE PROVIDED]'
      ],
      appointmentAvailability: '[HOSPITAL TO CONFIRM APPOINTMENT SCHEDULE]',
      isFeatured: true,
      isDemoPlaceholder: true
    },
    {
      id: 'doc-8',
      slug: 'dr-demo-doctor-gastroenterology',
      name: 'Dr. Demo Doctor 8 (Gastroenterology)',
      designation: 'Consultant Gastroenterologist [HOSPITAL TO PROVIDE TITLE]',
      title: 'Consultant Gastroenterologist [HOSPITAL TO PROVIDE TITLE]',
      profileImage: null,
      profilePhoto: null,
      photoPlaceholderText: '[DOCTOR PHOTO TO BE PROVIDED]',
      qualification: 'MBBS, MD, DM [QUALIFICATION TO BE PROVIDED]',
      department: 'Gastroenterology & Hepatology',
      departmentId: 'dept-gastroenterology',
      departmentName: 'Gastroenterology & Hepatology',
      specialization: 'Medical Gastroenterology [SPECIALIZATION TO BE PROVIDED]',
      subSpecialization: 'Digestive & Liver Care [HOSPITAL TO PROVIDE]',
      experience: '[EXPERIENCE TO BE PROVIDED]',
      experienceYears: '[EXPERIENCE TO BE PROVIDED]',
      consultationTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      opdTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      consultationLocation: 'IndoStates Hospital Main Campus, [HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      opdRoom: '[HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      location: 'IndoStates Hospital Main Campus',
      languages: ['[HOSPITAL TO PROVIDE LANGUAGES]'],
      biography: 'Representative doctor profile placeholder for Gastroenterology Department. [Hospital medical registry credentials to be updated].',
      about: 'Representative doctor profile placeholder for Gastroenterology Department. [Hospital medical registry credentials to be updated].',
      detailedProfile: 'Detailed clinical gastroenterology background to be provided by hospital administration.',
      expertise: [
        'Diagnostic Endoscopy Evaluations [HOSPITAL TO CONFIRM]',
        'Liver Function Management [HOSPITAL TO CONFIRM]',
        'Chronic GERD & Acidity [HOSPITAL TO CONFIRM]'
      ],
      areasOfExpertise: [
        'Diagnostic Endoscopy Evaluations [HOSPITAL TO CONFIRM]',
        'Liver Function Management [HOSPITAL TO CONFIRM]',
        'Chronic GERD & Acidity [HOSPITAL TO CONFIRM]'
      ],
      education: [
        '[MEDICAL DEGREE TO BE PROVIDED BY HOSPITAL]',
        '[GASTROENTEROLOGY DM TO BE PROVIDED]'
      ],
      appointmentAvailability: '[HOSPITAL TO CONFIRM APPOINTMENT SCHEDULE]',
      isFeatured: false,
      isDemoPlaceholder: true
    },
    {
      id: 'doc-9',
      slug: 'dr-demo-doctor-ophthalmology',
      name: 'Dr. Demo Doctor 9 (Ophthalmology)',
      designation: 'Consultant Ophthalmologist [HOSPITAL TO PROVIDE TITLE]',
      title: 'Consultant Ophthalmologist [HOSPITAL TO PROVIDE TITLE]',
      profileImage: null,
      profilePhoto: null,
      photoPlaceholderText: '[DOCTOR PHOTO TO BE PROVIDED]',
      qualification: 'MBBS, MS (Ophth) [QUALIFICATION TO BE PROVIDED]',
      department: 'Ophthalmology (Eye Care)',
      departmentId: 'dept-ophthalmology',
      departmentName: 'Ophthalmology (Eye Care)',
      specialization: 'Ophthalmology [SPECIALIZATION TO BE PROVIDED]',
      subSpecialization: 'Cataract & Vision Care [HOSPITAL TO PROVIDE]',
      experience: '[EXPERIENCE TO BE PROVIDED]',
      experienceYears: '[EXPERIENCE TO BE PROVIDED]',
      consultationTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      opdTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      consultationLocation: 'IndoStates Hospital Main Campus, [HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      opdRoom: '[HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      location: 'IndoStates Hospital Main Campus',
      languages: ['[HOSPITAL TO PROVIDE LANGUAGES]'],
      biography: 'Representative doctor profile placeholder for Ophthalmology Department. [Hospital medical registry credentials to be updated].',
      about: 'Representative doctor profile placeholder for Ophthalmology Department. [Hospital medical registry credentials to be updated].',
      detailedProfile: 'Detailed ophthalmic background to be provided by hospital administration.',
      expertise: [
        'Vision & Refraction Testing [HOSPITAL TO CONFIRM]',
        'Cataract Evaluation [HOSPITAL TO CONFIRM]',
        'Diabetic Eye Screening [HOSPITAL TO CONFIRM]'
      ],
      areasOfExpertise: [
        'Vision & Refraction Testing [HOSPITAL TO CONFIRM]',
        'Cataract Evaluation [HOSPITAL TO CONFIRM]',
        'Diabetic Eye Screening [HOSPITAL TO CONFIRM]'
      ],
      education: [
        '[MEDICAL DEGREE TO BE PROVIDED BY HOSPITAL]',
        '[MS OPHTHALMOLOGY TO BE PROVIDED]'
      ],
      appointmentAvailability: '[HOSPITAL TO CONFIRM APPOINTMENT SCHEDULE]',
      isFeatured: false,
      isDemoPlaceholder: true
    },
    {
      id: 'doc-10',
      slug: 'dr-demo-doctor-ent',
      name: 'Dr. Demo Doctor 10 (ENT)',
      designation: 'Consultant ENT Specialist [HOSPITAL TO PROVIDE TITLE]',
      title: 'Consultant ENT Specialist [HOSPITAL TO PROVIDE TITLE]',
      profileImage: null,
      profilePhoto: null,
      photoPlaceholderText: '[DOCTOR PHOTO TO BE PROVIDED]',
      qualification: 'MBBS, MS (ENT) [QUALIFICATION TO BE PROVIDED]',
      department: 'Ear, Nose & Throat (ENT)',
      departmentId: 'dept-ent',
      departmentName: 'Ear, Nose & Throat (ENT)',
      specialization: 'Otorhinolaryngology (ENT) [SPECIALIZATION TO BE PROVIDED]',
      subSpecialization: 'Sinus & Hearing Care [HOSPITAL TO PROVIDE]',
      experience: '[EXPERIENCE TO BE PROVIDED]',
      experienceYears: '[EXPERIENCE TO BE PROVIDED]',
      consultationTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      opdTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      consultationLocation: 'IndoStates Hospital Main Campus, [HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      opdRoom: '[HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      location: 'IndoStates Hospital Main Campus',
      languages: ['[HOSPITAL TO PROVIDE LANGUAGES]'],
      biography: 'Representative doctor profile placeholder for ENT Department. [Hospital medical registry credentials to be updated].',
      about: 'Representative doctor profile placeholder for ENT Department. [Hospital medical registry credentials to be updated].',
      detailedProfile: 'Detailed ENT background to be provided by hospital administration.',
      expertise: [
        'Sinusitis & Allergy Evaluation [HOSPITAL TO CONFIRM]',
        'Hearing Assessments [HOSPITAL TO CONFIRM]',
        'Throat & Voice Care [HOSPITAL TO CONFIRM]'
      ],
      areasOfExpertise: [
        'Sinusitis & Allergy Evaluation [HOSPITAL TO CONFIRM]',
        'Hearing Assessments [HOSPITAL TO CONFIRM]',
        'Throat & Voice Care [HOSPITAL TO CONFIRM]'
      ],
      education: [
        '[MEDICAL DEGREE TO BE PROVIDED BY HOSPITAL]',
        '[MS ENT CREDENTIAL TO BE PROVIDED]'
      ],
      appointmentAvailability: '[HOSPITAL TO CONFIRM APPOINTMENT SCHEDULE]',
      isFeatured: false,
      isDemoPlaceholder: true
    },
    {
      id: 'doc-11',
      slug: 'dr-demo-doctor-dermatology',
      name: 'Dr. Demo Doctor 11 (Dermatology)',
      designation: 'Consultant Dermatologist [HOSPITAL TO PROVIDE TITLE]',
      title: 'Consultant Dermatologist [HOSPITAL TO PROVIDE TITLE]',
      profileImage: null,
      profilePhoto: null,
      photoPlaceholderText: '[DOCTOR PHOTO TO BE PROVIDED]',
      qualification: 'MBBS, MD (DVL) [QUALIFICATION TO BE PROVIDED]',
      department: 'Dermatology & Skin Care',
      departmentId: 'dept-dermatology',
      departmentName: 'Dermatology & Skin Care',
      specialization: 'Clinical Dermatology [SPECIALIZATION TO BE PROVIDED]',
      subSpecialization: 'Skin & Trichology [HOSPITAL TO PROVIDE]',
      experience: '[EXPERIENCE TO BE PROVIDED]',
      experienceYears: '[EXPERIENCE TO BE PROVIDED]',
      consultationTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      opdTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      consultationLocation: 'IndoStates Hospital Main Campus, [HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      opdRoom: '[HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      location: 'IndoStates Hospital Main Campus',
      languages: ['[HOSPITAL TO PROVIDE LANGUAGES]'],
      biography: 'Representative doctor profile placeholder for Dermatology Department. [Hospital medical registry credentials to be updated].',
      about: 'Representative doctor profile placeholder for Dermatology Department. [Hospital medical registry credentials to be updated].',
      detailedProfile: 'Detailed dermatology background to be provided by hospital administration.',
      expertise: [
        'Acne & Skin Inflammation [HOSPITAL TO CONFIRM]',
        'Eczema & Allergy Care [HOSPITAL TO CONFIRM]',
        'Hair & Scalp Health [HOSPITAL TO CONFIRM]'
      ],
      areasOfExpertise: [
        'Acne & Skin Inflammation [HOSPITAL TO CONFIRM]',
        'Eczema & Allergy Care [HOSPITAL TO CONFIRM]',
        'Hair & Scalp Health [HOSPITAL TO CONFIRM]'
      ],
      education: [
        '[MEDICAL DEGREE TO BE PROVIDED BY HOSPITAL]',
        '[MD DERMATOLOGY TO BE PROVIDED]'
      ],
      appointmentAvailability: '[HOSPITAL TO CONFIRM APPOINTMENT SCHEDULE]',
      isFeatured: false,
      isDemoPlaceholder: true
    },
    {
      id: 'doc-12',
      slug: 'dr-demo-doctor-urology',
      name: 'Dr. Demo Doctor 12 (Urology)',
      designation: 'Consultant Urologist [HOSPITAL TO PROVIDE TITLE]',
      title: 'Consultant Urologist [HOSPITAL TO PROVIDE TITLE]',
      profileImage: null,
      profilePhoto: null,
      photoPlaceholderText: '[DOCTOR PHOTO TO BE PROVIDED]',
      qualification: 'MBBS, MS, MCh (Uro) [QUALIFICATION TO BE PROVIDED]',
      department: 'Urology & Kidney Care',
      departmentId: 'dept-urology',
      departmentName: 'Urology & Kidney Care',
      specialization: 'Urology [SPECIALIZATION TO BE PROVIDED]',
      subSpecialization: 'Endo-Urology & Kidney Stones [HOSPITAL TO PROVIDE]',
      experience: '[EXPERIENCE TO BE PROVIDED]',
      experienceYears: '[EXPERIENCE TO BE PROVIDED]',
      consultationTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      opdTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]',
      consultationLocation: 'IndoStates Hospital Main Campus, [HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      opdRoom: '[HOSPITAL TO PROVIDE OPD ROOM / LOCATION]',
      location: 'IndoStates Hospital Main Campus',
      languages: ['[HOSPITAL TO PROVIDE LANGUAGES]'],
      biography: 'Representative doctor profile placeholder for Urology Department. [Hospital medical registry credentials to be updated].',
      about: 'Representative doctor profile placeholder for Urology Department. [Hospital medical registry credentials to be updated].',
      detailedProfile: 'Detailed urological surgical credentials to be provided by hospital administration.',
      expertise: [
        'Kidney Stone Evaluation [HOSPITAL TO CONFIRM]',
        'Prostate Health Assessment [HOSPITAL TO CONFIRM]',
        'Urinary Infection Clinic [HOSPITAL TO CONFIRM]'
      ],
      areasOfExpertise: [
        'Kidney Stone Evaluation [HOSPITAL TO CONFIRM]',
        'Prostate Health Assessment [HOSPITAL TO CONFIRM]',
        'Urinary Infection Clinic [HOSPITAL TO CONFIRM]'
      ],
      education: [
        '[MEDICAL DEGREE TO BE PROVIDED BY HOSPITAL]',
        '[MCh UROLOGY TO BE PROVIDED]'
      ],
      appointmentAvailability: '[HOSPITAL TO CONFIRM APPOINTMENT SCHEDULE]',
      isFeatured: true,
      isDemoPlaceholder: true
    }
  ],

  // HEALTHCARE SERVICES (Neutral wording, pending hospital verification)
  services: [
    {
      id: 'srv-emergency',
      slug: 'emergency-care',
      title: 'Emergency Care Services',
      category: 'Emergency Services',
      shortDesc: '[Clinical scope to be confirmed by hospital: Emergency resuscitation and medical triage services.]',
      overview: 'IndoStates Hospital emergency services are designed to provide immediate medical stabilization for acute conditions. [Emergency service schedule, ambulance availability, and triage levels to be verified by hospital].',
      whoItIsFor: [
        'Acute chest discomfort or symptoms requiring clinical review',
        'Acute neurological changes or breathing difficulty',
        'Physical trauma and acute injuries',
        'Sudden medical crises'
      ],
      keyFeatures: [
        'Resuscitation Area [HOSPITAL TO CONFIRM]',
        'Emergency Medical Triage [HOSPITAL TO CONFIRM]',
        'Direct Access to Diagnostics [HOSPITAL TO CONFIRM]',
        'On-call Specialist Support [HOSPITAL TO CONFIRM]'
      ],
      relatedDepartmentIds: ['dept-cardiology', 'dept-neurology', 'dept-orthopedics', 'dept-general-surgery'],
      availability: '[HOSPITAL TO CONFIRM EMERGENCY SCHEDULE]',
      isVerifiedByHospital: false
    },
    {
      id: 'srv-opd',
      slug: 'outpatient-consultation',
      title: 'Outpatient Specialty Consultations',
      category: 'Clinical Care',
      shortDesc: '[Structured outpatient consultations across clinical disciplines by appointment.]',
      overview: 'Our Outpatient Department (OPD) facilitates consultations with medical and surgical specialists. [Timings and consulting rooms subject to hospital scheduling].',
      whoItIsFor: [
        'Patients requiring specialist diagnosis and review',
        'Routine follow-up consultations for chronic disease management',
        'Second medical opinions before elective procedures',
        'Preventive health consultations'
      ],
      keyFeatures: [
        'Appointment-Based Consultations',
        'Adjacent Diagnostic Services [HOSPITAL TO CONFIRM]',
        'Wheelchair Assistance Desks [HOSPITAL TO CONFIRM]',
        'Patient Registration Counters'
      ],
      relatedDepartmentIds: ['dept-cardiology', 'dept-general-medicine', 'dept-pediatrics', 'dept-obgyn'],
      availability: '[HOSPITAL TO CONFIRM: Mon–Sat 08:00 AM – 08:00 PM]',
      isVerifiedByHospital: false
    },
    {
      id: 'srv-inpatient',
      slug: 'inpatient-care',
      title: 'Inpatient Hospital Care',
      category: 'Hospitalization',
      shortDesc: '[Inpatient admission services across ward categories for medical observation and recovery.]',
      overview: 'Our inpatient care is structured to provide medical vigilance, nursing support, and comfortable recovery environments. [Ward categories and amenities subject to hospital confirmation].',
      whoItIsFor: [
        'Patients undergoing elective or surgical procedures',
        'Individuals requiring medical observation or IV therapies',
        'Post-procedural monitoring',
        'Multi-day medical treatment plans'
      ],
      keyFeatures: [
        'Adjustable Hospital Beds [HOSPITAL TO CONFIRM]',
        'Nursing Support [HOSPITAL TO CONFIRM]',
        'Dietary Consultation Support [HOSPITAL TO CONFIRM]',
        'Visitor Guidelines Compliance'
      ],
      relatedDepartmentIds: ['dept-general-medicine', 'dept-general-surgery', 'dept-orthopedics'],
      availability: '[HOSPITAL TO CONFIRM ADMISSION HOURS]',
      isVerifiedByHospital: false
    },
    {
      id: 'srv-surgery',
      slug: 'surgery',
      title: 'Surgical Services',
      category: 'Surgical Services',
      shortDesc: '[Operating suites supporting general, orthopedic, and minimal access procedures.]',
      overview: 'IndoStates Hospital features surgical suites designed for elective and emergency procedures. [Surgical equipment and room specifications to be verified by hospital].',
      whoItIsFor: [
        'Patients recommended for surgical intervention',
        'Minimally invasive laparoscopic procedures',
        'Orthopedic fracture fixation and joint procedures'
      ],
      keyFeatures: [
        'Operating Theatre Complex [HOSPITAL TO CONFIRM]',
        'Post-Anesthesia Recovery Area [HOSPITAL TO CONFIRM]',
        'Sterilization Support Protocols [HOSPITAL TO CONFIRM]'
      ],
      relatedDepartmentIds: ['dept-general-surgery', 'dept-orthopedics', 'dept-obgyn', 'dept-urology'],
      availability: '[HOSPITAL TO CONFIRM SURGICAL SCHEDULE]',
      isVerifiedByHospital: false
    },
    {
      id: 'srv-diagnostics',
      slug: 'diagnostics-laboratory',
      title: 'Laboratory Medicine & Pathology',
      category: 'Diagnostics',
      shortDesc: '[Clinical biochemistry, hematology, and diagnostic laboratory testing.]',
      overview: 'Our diagnostic laboratory performs clinical testing to support patient evaluations. [Test menus and accreditation details to be confirmed by hospital].',
      whoItIsFor: [
        'Routine diagnostic blood and urine investigations',
        'Metabolic and organ function panels',
        'Pre-operative investigations'
      ],
      keyFeatures: [
        'Automated Laboratory Analyzers [HOSPITAL TO CONFIRM]',
        'Outpatient Sample Collection [HOSPITAL TO CONFIRM]',
        'Barcoded Sample Verification [HOSPITAL TO CONFIRM]'
      ],
      relatedDepartmentIds: ['dept-general-medicine', 'dept-cardiology'],
      availability: '[HOSPITAL TO CONFIRM LAB TIMINGS: e.g. 07:00 AM – 08:00 PM]',
      isVerifiedByHospital: false
    },
    {
      id: 'srv-imaging',
      slug: 'imaging-radiology',
      title: 'Diagnostic Imaging & Radiology',
      category: 'Diagnostics',
      shortDesc: '[Digital radiography, ultrasound, and non-invasive anatomical imaging.]',
      overview: 'Radiology services provide diagnostic imaging assistance for clinical evaluations. [Imaging equipment models to be confirmed by hospital].',
      whoItIsFor: [
        'Patients with trauma or bone fractures',
        'Abdominal and pelvic ultrasound scans',
        'Chest radiography'
      ],
      keyFeatures: [
        'Digital Radiography (X-Ray) [HOSPITAL TO CONFIRM]',
        'Ultrasound Diagnostic Systems [HOSPITAL TO CONFIRM]',
        'Radiation Safety Protocols'
      ],
      relatedDepartmentIds: ['dept-orthopedics', 'dept-obgyn', 'dept-general-medicine'],
      availability: '[HOSPITAL TO CONFIRM IMAGING TIMINGS]',
      isVerifiedByHospital: false
    },
    {
      id: 'srv-pharmacy',
      slug: 'pharmacy-services',
      title: 'Hospital Pharmacy Services',
      category: 'Pharmacy',
      shortDesc: '[Licensed hospital pharmacy stocking pharmaceuticals and consumables.]',
      overview: 'The IndoStates Hospital Pharmacy dispenses authorized medications and medical supplies directly managed by qualified pharmacists. [Operating hours to be confirmed by hospital].',
      whoItIsFor: [
        'Inpatients requiring prescribed medications',
        'Outpatients fulfilling doctor prescriptions',
        'Emergency prescription needs'
      ],
      keyFeatures: [
        'Registered Pharmacist Dispensing',
        'Cold Chain Storage [HOSPITAL TO CONFIRM]',
        'Prescription Verification Protocol'
      ],
      relatedDepartmentIds: ['dept-general-medicine', 'dept-cardiology'],
      availability: '[HOSPITAL TO CONFIRM PHARMACY SCHEDULE: e.g. 24 Hours]',
      isVerifiedByHospital: false
    },
    {
      id: 'srv-rehab',
      slug: 'rehabilitation-physiotherapy',
      title: 'Physical Therapy & Rehabilitation',
      category: 'Rehabilitation',
      shortDesc: '[Physical therapy for post-surgical recovery, joint mobility, and rehabilitation.]',
      overview: 'Our physiotherapy services assist patients in restoring functional mobility and musculoskeletal strength following injury or surgery. [Hospital to confirm rehabilitation scope].',
      whoItIsFor: [
        'Post-operative joint surgery patients',
        'Individuals recovering from fractures or sports strains',
        'Chronic musculoskeletal back and neck discomfort'
      ],
      keyFeatures: [
        'Therapeutic Exercises Support [HOSPITAL TO CONFIRM]',
        'Inpatient Bedside Mobilization [HOSPITAL TO CONFIRM]',
        'Ergonomic Counseling'
      ],
      relatedDepartmentIds: ['dept-orthopedics', 'dept-neurology'],
      availability: '[HOSPITAL TO CONFIRM PHYSIOTHERAPY TIMINGS]',
      isVerifiedByHospital: false
    },
    {
      id: 'srv-preventive',
      slug: 'preventive-health',
      title: 'Preventive Health Checkups',
      category: 'Preventive Health',
      shortDesc: '[Tailored health screening checkup packages for early risk identification.]',
      overview: 'Structured health screening packages combining laboratory investigations and physician consultations. [Package pricing and components to be confirmed by hospital].',
      whoItIsFor: [
        'Adults seeking periodic health assessments',
        'Executives managing sedentary schedules',
        'Individuals with family history of lifestyle conditions'
      ],
      keyFeatures: [
        'Consolidated Blood & Imaging Tests',
        'Doctor Review Consultation',
        'Lifestyle & Nutrition Guidance'
      ],
      relatedDepartmentIds: ['dept-general-medicine', 'dept-cardiology'],
      availability: '[HOSPITAL TO CONFIRM CHECKUP TIMINGS]',
      isVerifiedByHospital: false
    },
    {
      id: 'srv-ambulance',
      slug: 'ambulance-services',
      title: 'Ambulance Services',
      category: 'Emergency Services',
      shortDesc: '[Emergency transport ambulance service. Schedule & availability to be confirmed by hospital.]',
      overview: 'Ambulance transport for patient transfers and emergency hospital transit. [Hospital to confirm fleet specifications, ambulance emergency number, and service areas].',
      whoItIsFor: [
        'Emergency transport to hospital',
        'Inter-facility transfers',
        'Non-ambulatory patient transportation'
      ],
      keyFeatures: [
        'Emergency Transport Equipment [HOSPITAL TO CONFIRM]',
        'Trained Paramedic / EMT on board [HOSPITAL TO CONFIRM]',
        'Emergency Direct Helpline [HOSPITAL TO CONFIRM NUMBER]'
      ],
      relatedDepartmentIds: ['dept-cardiology', 'dept-neurology'],
      availability: '[HOSPITAL TO CONFIRM AMBULANCE SCHEDULE & HELPLINE]',
      isVerifiedByHospital: false
    }
  ],

  // CORE FACILITIES (Neutral wording, pending hospital verification)
  facilities: [
    {
      id: 'fac-icu',
      slug: 'intensive-care-units',
      title: 'Intensive Care Unit (ICU)',
      category: 'Critical Care Infrastructure',
      shortDesc: '[Hospital to confirm: ICU bed count, ventilator specifications, and critical care infrastructure.]',
      description: 'The Intensive Care Unit is designed for close physiological monitoring and critical care stabilization. [Bed count, monitoring console models, and visiting rules to be confirmed by hospital management].',
      highlights: [
        'Bedside Multi-Parameter Monitors [HOSPITAL TO CONFIRM]',
        'Mechanical Ventilators [HOSPITAL TO CONFIRM]',
        'Duty Critical Care Staff [HOSPITAL TO CONFIRM]'
      ],
      timings: '[HOSPITAL TO CONFIRM ICU VISITING HOURS]',
      floor: '[HOSPITAL TO PROVIDE FLOOR / WING]',
      badge: 'Critical Care',
      isVerifiedByHospital: false
    },
    {
      id: 'fac-ot',
      slug: 'modular-operation-theatres',
      title: 'Operation Theatres',
      category: 'Surgical Infrastructure',
      shortDesc: '[Hospital to confirm: Operation theatre specifications, air filtration, and surgical consoles.]',
      description: 'Our surgical suites are built for elective and emergency operations with infection control protocols. [Hospital to provide equipment details and OT count].',
      highlights: [
        'Surgical Display Monitors [HOSPITAL TO CONFIRM]',
        'Positive Pressure Airflow [HOSPITAL TO CONFIRM]',
        'Recovery Area [HOSPITAL TO CONFIRM]'
      ],
      timings: '[HOSPITAL TO CONFIRM SURGICAL HOURS]',
      floor: '[HOSPITAL TO PROVIDE FLOOR / WING]',
      badge: 'Surgical Complex',
      isVerifiedByHospital: false
    },
    {
      id: 'fac-emergency',
      slug: 'emergency-trauma-center',
      title: 'Emergency Medical Area',
      category: 'Emergency Infrastructure',
      shortDesc: '[Hospital to confirm: Emergency entrance, triage area, and emergency bed capacity.]',
      description: 'The Emergency department provides immediate access for medical stabilization and trauma reception. [Hospital to confirm infrastructure and triage layout].',
      highlights: [
        'Ground Floor Access [HOSPITAL TO CONFIRM]',
        'Resuscitation Equipment [HOSPITAL TO CONFIRM]',
        'Triage Station [HOSPITAL TO CONFIRM]'
      ],
      timings: '[HOSPITAL TO CONFIRM EMERGENCY SCHEDULE]',
      floor: 'Ground Floor [HOSPITAL TO CONFIRM WING]',
      badge: 'Emergency Area',
      isVerifiedByHospital: false
    },
    {
      id: 'fac-rooms',
      slug: 'patient-rooms-suites',
      title: 'Patient Rooms & Wards',
      category: 'Accommodation',
      shortDesc: '[Hospital to confirm: Inpatient room types, amenities, and bed categories.]',
      description: 'Inpatient rooms are structured for patient recovery with dedicated nurse call stations and hygiene protocols. [Hospital to confirm room configurations and pricing].',
      highlights: [
        'General & Private Room Options [HOSPITAL TO CONFIRM]',
        'Attendant Seating [HOSPITAL TO CONFIRM]',
        'Daily Sanitization Protocols'
      ],
      timings: '[HOSPITAL TO CONFIRM VISITING HOURS]',
      floor: '[HOSPITAL TO PROVIDE INPATIENT FLOORS]',
      badge: 'Inpatient Rooms',
      isVerifiedByHospital: false
    },
    {
      id: 'fac-diagnostics',
      slug: 'automated-pathology-laboratory',
      title: 'Central Diagnostic Laboratory',
      category: 'Diagnostic Infrastructure',
      shortDesc: '[Hospital to confirm: Diagnostic laboratory analyzers, specimen booths, and test capabilities.]',
      description: 'The central laboratory handles clinical pathology, biochemistry, and hematology investigations. [Hospital to provide equipment inventory and accreditation status].',
      highlights: [
        'Clinical Chemistry Testing [HOSPITAL TO CONFIRM]',
        'Automated Hematology [HOSPITAL TO CONFIRM]',
        'Specimen Collection Desks [HOSPITAL TO CONFIRM]'
      ],
      timings: '[HOSPITAL TO CONFIRM COLLECTION HOURS]',
      floor: 'Ground Floor [HOSPITAL TO CONFIRM WING]',
      badge: 'Diagnostics',
      isVerifiedByHospital: false
    },
    {
      id: 'fac-pharmacy',
      slug: 'hospital-pharmacy',
      title: 'In-House Pharmacy',
      category: 'Support Infrastructure',
      shortDesc: '[Hospital to confirm: Pharmacy counter location, stock range, and operating schedule.]',
      description: 'In-house pharmacy supplying prescribed medications, surgical disposables, and cold-chain pharmaceuticals. [Hospital to confirm operating schedule].',
      highlights: [
        'Prescription Medication Dispensing',
        'Cold-Chain Refrigerators [HOSPITAL TO CONFIRM]',
        'Registered Pharmacists on Duty'
      ],
      timings: '[HOSPITAL TO CONFIRM PHARMACY HOURS]',
      floor: 'Ground Floor [HOSPITAL TO CONFIRM LOCATION]',
      badge: 'Pharmacy',
      isVerifiedByHospital: false
    },
    {
      id: 'fac-cafeteria',
      slug: 'cafeteria-nutrition',
      title: 'Cafeteria & Patient Dining',
      category: 'Amenities',
      shortDesc: '[Hospital to confirm: Cafeteria location, visitor meal services, and dietary consultations.]',
      description: 'Hospital cafeteria providing wholesome meals for visitors and patient families. [Operating hours and meal options to be verified by hospital].',
      highlights: [
        'Hygienic Dining Area [HOSPITAL TO CONFIRM]',
        'Dietary Guidance for Inpatients [HOSPITAL TO CONFIRM]'
      ],
      timings: '[HOSPITAL TO CONFIRM DINING HOURS]',
      floor: '[HOSPITAL TO PROVIDE LOCATION]',
      badge: 'Dining',
      isVerifiedByHospital: false
    },
    {
      id: 'fac-accessibility',
      slug: 'accessibility-campus',
      title: 'Campus Accessibility & Transit',
      category: 'Amenities',
      shortDesc: '[Barrier-free access: Wheelchair ramps, elevators, and accessible parking.]',
      description: 'The hospital campus is designed for accessible movement, with ground-floor ramps, wide corridors, and designated accessible parking. [Hospital to confirm accessibility features].',
      highlights: [
        'Wheelchair Ramps at Main Entrances [HOSPITAL TO CONFIRM]',
        'Stretcher-Sized Elevators [HOSPITAL TO CONFIRM]',
        'Accessible Parking Bays [HOSPITAL TO CONFIRM]'
      ],
      timings: 'Accessible during hospital hours',
      floor: 'Entire Campus',
      badge: 'Accessible',
      isVerifiedByHospital: false
    }
  ],

  // HEALTH PACKAGES (Editable placeholder pricing)
  healthPackages: [
    {
      id: 'pkg-master',
      slug: 'master-health-checkup',
      title: 'Comprehensive Health Checkup',
      targetGroup: 'Adults seeking an annual baseline screening [HOSPITAL TO CONFIRM TARGET AUDIENCE]',
      shortDesc: '[Package components to be confirmed by hospital: Baseline health evaluation covering vital organs, blood profile, and physician review.]',
      priceDisplay: '[Contact Hospital for Verified Package Rates]',
      testsIncluded: [
        'Complete Blood Count (CBC) [HOSPITAL TO CONFIRM]',
        'Fasting & Post-Prandial Blood Sugar [HOSPITAL TO CONFIRM]',
        'Lipid Profile [HOSPITAL TO CONFIRM]',
        'Liver Function Tests [HOSPITAL TO CONFIRM]',
        'Kidney Function Tests [HOSPITAL TO CONFIRM]',
        'Urine Routine Analysis [HOSPITAL TO CONFIRM]',
        '12-Lead ECG [HOSPITAL TO CONFIRM]',
        'Digital Chest X-Ray [HOSPITAL TO CONFIRM]',
        'Physician Review Consultation [HOSPITAL TO CONFIRM]'
      ],
      preparationInstructions: [
        '10 to 12 hours overnight fasting is typically required.',
        'Water is permitted during fasting.',
        'Please bring prior medical records or current medications.'
      ],
      recommendedFrequency: 'Annual [HOSPITAL TO CONFIRM]',
      badge: 'Screening Package',
      isVerifiedByHospital: false
    },
    {
      id: 'pkg-cardiac',
      slug: 'executive-cardiac-screening',
      title: 'Cardiac Wellness Screening',
      targetGroup: 'Individuals seeking cardiovascular evaluation [HOSPITAL TO CONFIRM]',
      shortDesc: '[Package components to be confirmed by hospital: Cardiac health assessment focusing on lipid risk, heart function, and physician review.]',
      priceDisplay: '[Contact Hospital for Verified Package Rates]',
      testsIncluded: [
        'Complete Lipid Profile [HOSPITAL TO CONFIRM]',
        'Fasting Blood Sugar & HbA1c [HOSPITAL TO CONFIRM]',
        '12-Lead Resting ECG [HOSPITAL TO CONFIRM]',
        'Treadmill Stress Test (TMT) or 2D Echo [HOSPITAL TO CONFIRM]',
        'Cardiology Review Consultation [HOSPITAL TO CONFIRM]'
      ],
      preparationInstructions: [
        '10 to 12 hours fasting required for blood tests.',
        'Wear comfortable clothing and shoes for treadmill evaluation.'
      ],
      recommendedFrequency: 'As advised by doctor [HOSPITAL TO CONFIRM]',
      badge: 'Cardiac Screening',
      isVerifiedByHospital: false
    },
    {
      id: 'pkg-senior',
      slug: 'senior-citizen-health-package',
      title: 'Senior Citizen Health Package',
      targetGroup: 'Men and women aged 60 and above [HOSPITAL TO CONFIRM]',
      shortDesc: '[Package components to be confirmed by hospital: Geriatric health review focusing on vital organs, metabolic balance, and physician review.]',
      priceDisplay: '[Contact Hospital for Verified Package Rates]',
      testsIncluded: [
        'Complete Hemogram & ESR [HOSPITAL TO CONFIRM]',
        'Kidney & Liver Function Panels [HOSPITAL TO CONFIRM]',
        'Blood Glucose & Lipid Markers [HOSPITAL TO CONFIRM]',
        '12-Lead ECG & Chest X-Ray [HOSPITAL TO CONFIRM]',
        'Physician Comprehensive Review [HOSPITAL TO CONFIRM]'
      ],
      preparationInstructions: [
        'Fasting for 10-12 hours required.',
        'Carry current medications and past medical records.'
      ],
      recommendedFrequency: 'Every 6 to 12 Months [HOSPITAL TO CONFIRM]',
      badge: 'Senior Care',
      isVerifiedByHospital: false
    },
    {
      id: 'pkg-women',
      slug: 'womens-wellness-assessment',
      title: 'Women’s Wellness Assessment',
      targetGroup: 'Adult women seeking preventative screening [HOSPITAL TO CONFIRM]',
      shortDesc: '[Package components to be confirmed by hospital: Women’s health checkup addressing metabolic health, blood profile, and gynecologist review.]',
      priceDisplay: '[Contact Hospital for Verified Package Rates]',
      testsIncluded: [
        'Complete Blood Count (Screening for Anemia) [HOSPITAL TO CONFIRM]',
        'Fasting Blood Sugar & Thyroid Profile [HOSPITAL TO CONFIRM]',
        'Serum Calcium Markers [HOSPITAL TO CONFIRM]',
        'Ultrasound Pelvis Screening [HOSPITAL TO CONFIRM]',
        'Gynecologist Consultation [HOSPITAL TO CONFIRM]'
      ],
      preparationInstructions: [
        'Fasting for 10-12 hours for metabolic blood tests.',
        'Drink water prior to pelvic ultrasound as advised.'
      ],
      recommendedFrequency: 'Annual [HOSPITAL TO CONFIRM]',
      badge: 'Women’s Health',
      isVerifiedByHospital: false
    },
    {
      id: 'pkg-basic',
      slug: 'basic-preventive-screening',
      title: 'Essential Health Screening',
      targetGroup: 'Adults seeking basic health check [HOSPITAL TO CONFIRM]',
      shortDesc: '[Package components to be confirmed by hospital: Essential tests to review baseline blood sugar, kidney, and liver parameters.]',
      priceDisplay: '[Contact Hospital for Verified Package Rates]',
      testsIncluded: [
        'Complete Blood Count [HOSPITAL TO CONFIRM]',
        'Fasting Blood Sugar [HOSPITAL TO CONFIRM]',
        'Lipid Profile Screen [HOSPITAL TO CONFIRM]',
        'Serum Creatinine [HOSPITAL TO CONFIRM]',
        'Physician Physical Exam [HOSPITAL TO CONFIRM]'
      ],
      preparationInstructions: [
        'Overnight fasting of 8-10 hours is recommended.'
      ],
      recommendedFrequency: 'Annual [HOSPITAL TO CONFIRM]',
      badge: 'Essential',
      isVerifiedByHospital: false
    }
  ],

  // HEALTH ARTICLES (Educational guidance with medical review notes)
  articles: [
    {
      id: 'art-1',
      slug: 'recognizing-early-warning-signs-heart-attack',
      title: 'Recognizing Early Warning Signs of a Heart Attack',
      excerpt: 'Educational guide on recognizing cardiac symptoms and understanding when to seek emergency medical evaluation.',
      content: [
        'Heart conditions can present in varied ways. While severe chest tightness is widely recognized, other symptoms such as discomfort radiating to the arm, jaw, neck, or back, shortness of breath, and unexplained cold sweats can also occur.',
        'In some individuals, particularly women, older adults, or people with diabetes, symptoms may be subtle or present as nausea, lightheadedness, or sudden unexplained fatigue.',
        'Prompt emergency evaluation is critical when cardiac symptoms appear. Never drive yourself if a heart attack is suspected; seek immediate emergency transport.'
      ],
      category: 'Heart Health',
      authorName: '[Hospital Clinical Advisory Panel]',
      authorRole: '[Medical Review Panel]',
      publishedDate: 'September 2026',
      readTime: '4 min read',
      tags: ['Cardiology', 'Emergency', 'Heart Health', 'Education'],
      isFeatured: true
    },
    {
      id: 'art-2',
      slug: 'understanding-hba1c-and-diabetes-management',
      title: 'Understanding HbA1c in Diabetes Management',
      excerpt: 'How the 3-month blood sugar average test helps individuals and physicians track long-term glycemic control.',
      content: [
        'The HbA1c test measures the percentage of blood sugar attached to hemoglobin in red blood cells, reflecting average blood glucose levels over the prior 2 to 3 months.',
        'Maintaining HbA1c within target ranges established by treating doctors reduces the risk of long-term diabetes-related complications affecting the kidneys, eyes, and nerves.',
        'Management involves a balanced diet, regular physical exercise, and consistent adherence to doctor-prescribed medications.'
      ],
      category: 'Preventive Health',
      authorName: '[Hospital Clinical Advisory Panel]',
      authorRole: '[Internal Medicine Advisory]',
      publishedDate: 'September 2026',
      readTime: '4 min read',
      tags: ['Diabetes', 'Metabolic Health', 'Blood Tests'],
      isFeatured: false
    },
    {
      id: 'art-3',
      slug: 'childhood-vaccination-timeline-guide',
      title: 'Important Milestones in Childhood Immunization',
      excerpt: 'Essential information on following routine vaccination schedules to protect infant and child health.',
      content: [
        'Immunization protects infants and children against infectious illnesses. Following routine schedules ensures timely antibody protection.',
        'Parents should maintain an updated immunization record and bring it to all pediatric visits.',
        'Consult your pediatrician regarding vaccination milestones and any missed doses.'
      ],
      category: 'Children’s Health',
      authorName: '[Hospital Clinical Advisory Panel]',
      authorRole: '[Pediatric Advisory]',
      publishedDate: 'August 2026',
      readTime: '5 min read',
      tags: ['Pediatrics', 'Vaccines', 'Parenting'],
      isFeatured: false
    }
  ],

  // HEALTH EVENTS & CAMPS
  events: [
    {
      id: 'evt-1',
      slug: 'community-heart-health-screening',
      title: 'Community Heart Health Screening Camp [SAMPLE EVENT]',
      category: 'Camp',
      date: '[HOSPITAL TO CONFIRM EVENT DATE]',
      time: '[HOSPITAL TO CONFIRM EVENT TIME]',
      venue: 'IndoStates Hospital Campus [HOSPITAL TO CONFIRM VENUE]',
      departmentName: 'Cardiology & Vascular Sciences',
      shortDesc: '[Sample Event Placeholder: Community screening camp providing blood pressure, glucose check, and lifestyle counseling.]',
      details: [
        'Blood Pressure & Blood Sugar Screening [HOSPITAL TO CONFIRM]',
        'Doctor Consultation [HOSPITAL TO CONFIRM]',
        'Diet & Lifestyle Guidance [HOSPITAL TO CONFIRM]'
      ],
      isUpcoming: true,
      registrationOpen: true
    },
    {
      id: 'evt-2',
      slug: 'diabetes-awareness-workshop',
      title: 'Diabetes Awareness & Lifestyle Workshop [SAMPLE EVENT]',
      category: 'Awareness',
      date: '[HOSPITAL TO CONFIRM EVENT DATE]',
      time: '[HOSPITAL TO CONFIRM EVENT TIME]',
      venue: 'IndoStates Hospital Auditorium [HOSPITAL TO CONFIRM VENUE]',
      departmentName: 'General Medicine & Diabetology',
      shortDesc: '[Sample Event Placeholder: Interactive awareness session on managing blood sugar through nutrition and exercise.]',
      details: [
        'Panel Discussion with Doctors [HOSPITAL TO CONFIRM]',
        'Dietary Guidance Session [HOSPITAL TO CONFIRM]',
        'Informational Booklet Distribution [HOSPITAL TO CONFIRM]'
      ],
      isUpcoming: true,
      registrationOpen: true
    }
  ],

  // CAMPUS GALLERY
  gallery: [
    {
      id: 'gal-1',
      title: 'Hospital Main Entrance & Patient Atrium',
      category: 'Hospital',
      caption: '[Hospital photo to be provided: Spacious, well-lit reception and registration concourse.]',
      accentColor: '#0284c7',
      icon: 'Building2'
    },
    {
      id: 'gal-2',
      title: 'Hospital Multi-Specialty Outpatient Concourse',
      category: 'Hospital',
      caption: '[Hospital photo to be provided: Modern outpatient wing connecting specialized consultation suites.]',
      accentColor: '#0369a1',
      icon: 'Building2'
    },
    {
      id: 'gal-3',
      title: 'Class 10,000 Modular Operating Theatre',
      category: 'Facilities',
      caption: '[Hospital facility photo to be provided: Laminar airflow surgical suite with 4K laparoscopy towers.]',
      accentColor: '#0d9488',
      icon: 'Scissors'
    },
    {
      id: 'gal-4',
      title: 'Advanced Intensive Care Unit (ICU)',
      category: 'Facilities',
      caption: '[Hospital facility photo to be provided: Multi-parameter central telemetry consoles and ventilators.]',
      accentColor: '#2563eb',
      icon: 'Activity'
    },
    {
      id: 'gal-5',
      title: 'Executive Deluxe Inpatient Suite',
      category: 'Facilities',
      caption: '[Hospital facility photo to be provided: Private patient suite featuring motorized adjustable bed.]',
      accentColor: '#0891b2',
      icon: 'Bed'
    },
    {
      id: 'gal-6',
      title: '24x7 Emergency & Trauma Stabilization Bay',
      category: 'Facilities',
      caption: '[Hospital facility photo to be provided: Dedicated triage bays with immediate resuscitation access.]',
      accentColor: '#dc2626',
      icon: 'ShieldAlert'
    },
    {
      id: 'gal-7',
      title: 'Annual Clinical Excellence Symposium',
      category: 'Events',
      caption: '[Hospital event photo to be provided: Medical seminar reviewing emerging clinical protocols.]',
      accentColor: '#7c3aed',
      icon: 'Users'
    },
    {
      id: 'gal-8',
      title: 'Hospital Quality & Patient Safety Workshop',
      category: 'Events',
      caption: '[Hospital event photo to be provided: Interactive training sessions on international infection control standards.]',
      accentColor: '#6366f1',
      icon: 'Users'
    },
    {
      id: 'gal-9',
      title: 'Community Cardiac & Preventive Screening Camp',
      category: 'Health camps',
      caption: '[Hospital camp photo to be provided: Community outreach initiative providing blood pressure and ECG assessments.]',
      accentColor: '#ea580c',
      icon: 'HeartPulse'
    },
    {
      id: 'gal-10',
      title: 'Elderly Wellness & Bone Health Camp',
      category: 'Health camps',
      caption: '[Hospital camp photo to be provided: Public awareness and bone mineral density screening program.]',
      accentColor: '#d97706',
      icon: 'Users'
    },
    {
      id: 'gal-11',
      title: 'Multidisciplinary Clinical Board Review',
      category: 'Doctors',
      caption: '[Hospital faculty photo to be provided: Medical specialists and surgical teams conferring on clinical pathways.]',
      accentColor: '#059669',
      icon: 'Stethoscope'
    },
    {
      id: 'gal-12',
      title: 'Department Grand Rounds Discussion',
      category: 'Doctors',
      caption: '[Hospital faculty photo to be provided: Academic clinical case rounds uniting consultants and care coordinators.]',
      accentColor: '#0284c7',
      icon: 'Stethoscope'
    }
  ],

  // CAREERS (Sample job positions)
  careers: [
    {
      id: 'car-1',
      slug: 'staff-nurse-critical-care',
      title: 'Staff Nurse – Critical Care [SAMPLE POSITION]',
      department: 'Nursing & Critical Care',
      employmentType: 'Full-time',
      location: 'IndoStates Hospital Main Campus',
      experienceRequired: '[EXPERIENCE REQUIRED: e.g. 2+ Years in ICU]',
      summary: '[Hospital to provide job summary: Bedside nursing care in intensive care units under clinical supervision.]',
      responsibilities: [
        'Bedside patient monitoring and recording vital parameters [HOSPITAL TO CONFIRM]',
        'Administering prescribed medications under physician orders [HOSPITAL TO CONFIRM]',
        'Maintaining infection prevention protocols [HOSPITAL TO CONFIRM]'
      ],
      requirements: [
        'B.Sc Nursing / GNM from recognized institution [HOSPITAL TO CONFIRM]',
        'Nursing Council Registration [HOSPITAL TO CONFIRM]'
      ],
      postedDate: 'September 2026'
    },
    {
      id: 'car-2',
      slug: 'medical-lab-technologist',
      title: 'Medical Laboratory Technologist [SAMPLE POSITION]',
      department: 'Laboratory Medicine',
      employmentType: 'Full-time',
      location: 'IndoStates Hospital Main Campus',
      experienceRequired: '[EXPERIENCE REQUIRED: e.g. 1-3 Years in Lab]',
      summary: '[Hospital to provide job summary: Operating diagnostic analyzers and performing routine clinical tests.]',
      responsibilities: [
        'Sample processing and operating automated laboratory instruments [HOSPITAL TO CONFIRM]',
        'Performing quality control checks [HOSPITAL TO CONFIRM]',
        'Maintaining laboratory documentation [HOSPITAL TO CONFIRM]'
      ],
      requirements: [
        'B.Sc / Diploma in Medical Laboratory Technology (MLT) [HOSPITAL TO CONFIRM]'
      ],
      postedDate: 'September 2026'
    }
  ],

  // TESTIMONIALS (Sample placeholders)
  testimonials: [
    {
      id: 'test-1',
      patientName: '[Patient Feedback Placeholder 1]',
      location: '[Location to be provided]',
      departmentName: 'Cardiology & Vascular Sciences',
      treatmentType: '[Clinical Care Experience]',
      date: 'September 2026',
      feedback: 'Sample demonstration feedback placeholder. Verified patient testimonials will be published with formal consent. [HOSPITAL TO PROVIDE AUTHORIZED TESTIMONIALS].',
      rating: 5,
      isDemoNotice: true
    },
    {
      id: 'test-2',
      patientName: '[Patient Feedback Placeholder 2]',
      location: '[Location to be provided]',
      departmentName: 'Orthopedics & Joint Care',
      treatmentType: '[Orthopedic Consultation Experience]',
      date: 'August 2026',
      feedback: 'Sample demonstration feedback placeholder. Verified patient testimonials will be published with formal consent. [HOSPITAL TO PROVIDE AUTHORIZED TESTIMONIALS].',
      rating: 5,
      isDemoNotice: true
    }
  ],

  // FAQS
  faqs: [
    {
      category: 'Appointments',
      question: 'How do I book an outpatient consultation at IndoStates Hospital?',
      answer: 'You can submit an online appointment request through this website, or call our appointment desk at +91 [HOSPITAL TO PROVIDE APPOINTMENT HELPLINE]. Our staff will verify doctor availability and confirm your slot.'
    },
    {
      category: 'Appointments',
      question: 'Can I choose a specific doctor for consultation?',
      answer: 'Yes, our online doctor directory lists consulting doctors by specialty. You can select your preferred doctor during the appointment request.'
    },
    {
      category: 'Admission',
      question: 'What documents should I carry during hospital admission?',
      answer: 'Please carry government-issued photo ID (Aadhaar/Voter ID/Passport), the doctor’s admission advice note, insurance card (if claiming cashless), and all recent medical records. [HOSPITAL TO CONFIRM REQUIRED DOCUMENT LIST].'
    },
    {
      category: 'Admission',
      question: 'What are the visiting hours for hospital inpatients?',
      answer: 'General Wards: [HOSPITAL TO CONFIRM VISITING HOURS: e.g. 04:30 PM – 07:00 PM]. ICU visits are restricted to designated attendant windows to ensure patient safety and infection control.'
    },
    {
      category: 'Insurance',
      question: 'Does IndoStates Hospital facilitate cashless health insurance?',
      answer: 'Yes, our dedicated Insurance / TPA Desk assists patients with cashless hospitalisation requests. Pre-authorization depends on insurer approval. [HOSPITAL TO PROVIDE EMPANELED TPA LIST].'
    },
    {
      category: 'General',
      question: 'Where is IndoStates Hospital located?',
      answer: 'IndoStates Hospital is located at [HOSPITAL TO PROVIDE STREET ADDRESS], [HOSPITAL TO PROVIDE CITY] - [PINCODE]. Turn-by-turn directions can be opened in Google Maps.'
    }
  ]
};

// Re-export individual data subsets for backward compatibility
export const hospitalInfo = masterHospitalData.hospitalInfo;
export const departmentsData = masterHospitalData.departments;
export const doctorsData = masterHospitalData.doctors;
export const servicesData = masterHospitalData.services;
export const facilitiesData = masterHospitalData.facilities;
export const healthPackagesData = masterHospitalData.healthPackages;
export const healthArticlesData = masterHospitalData.articles;
export const healthEventsData = masterHospitalData.events;
export const galleryData = masterHospitalData.gallery;
export const testimonialsData = masterHospitalData.testimonials;
export const careersData = masterHospitalData.careers;
export const faqsData = masterHospitalData.faqs;
