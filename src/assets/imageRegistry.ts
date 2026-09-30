/**
 * CENTRALIZED HOSPITAL IMAGE REGISTRY — INDOSTATES HOSPITAL
 * 
 * Single authoritative registry mapping all image assets used across the website.
 * When official hospital photographs and logos are provided, update their file paths here.
 * Components render the official image if present, or automatically fall back to the
 * standardized institutional placeholder: "Official hospital image to be provided".
 */

export interface RegisteredAsset {
  id: string;
  category: 'hospital' | 'doctor' | 'department' | 'facility' | 'service' | 'event' | 'gallery' | 'article' | 'logo';
  src: string | null;
  alt: string;
  aspectRatio?: '16/9' | '4/3' | '3/2' | '3/4' | '1/1';
  placeholderLabel?: string;
  isOfficialProvided: boolean;
}

export const hospitalImageRegistry: Record<string, RegisteredAsset> = {
  // Brand Logo
  'brand-logo-primary': {
    id: 'brand-logo-primary',
    category: 'logo',
    src: null, // e.g. '/assets/logo/logo-primary.svg'
    alt: 'IndoStates Hospital Official Logomark',
    aspectRatio: '1/1',
    placeholderLabel: 'Official Hospital Logo to be Provided',
    isOfficialProvided: false
  },

  // Hospital Campus
  'hospital-campus-hero': {
    id: 'hospital-campus-hero',
    category: 'hospital',
    src: null, // e.g. '/assets/hospital/campus-exterior.webp'
    alt: 'IndoStates Hospital Main Campus and Multi-Specialty Facility',
    aspectRatio: '16/9',
    placeholderLabel: 'Official Hospital Campus Photograph to be Provided',
    isOfficialProvided: false
  },

  'hospital-reception-atrium': {
    id: 'hospital-reception-atrium',
    category: 'hospital',
    src: null,
    alt: 'IndoStates Hospital Patient Reception and Registration Concourse',
    aspectRatio: '16/9',
    placeholderLabel: 'Official Hospital Concourse Photograph to be Provided',
    isOfficialProvided: false
  },

  'hospital-emergency-bay': {
    id: 'hospital-emergency-bay',
    category: 'hospital',
    src: null,
    alt: 'IndoStates Hospital Emergency and Ambulance Triage Bay',
    aspectRatio: '16/9',
    placeholderLabel: 'Official Emergency Bay Photograph to be Provided',
    isOfficialProvided: false
  },

  // Doctors (Demonstration faculty placeholders - awaiting official hospital roster)
  'doctor-cardiology': {
    id: 'doctor-cardiology',
    category: 'doctor',
    src: null, // e.g. '/assets/doctors/dr-demo-doctor-cardiology.webp'
    alt: 'Dr. Demo Doctor 1 (Cardiology) - Consultant Cardiologist',
    aspectRatio: '3/4',
    placeholderLabel: 'Official Doctor Portrait to be Provided',
    isOfficialProvided: false
  },

  'doctor-neurology': {
    id: 'doctor-neurology',
    category: 'doctor',
    src: null,
    alt: 'Dr. Demo Doctor 2 (Neurology) - Consultant Neurologist',
    aspectRatio: '3/4',
    placeholderLabel: 'Official Doctor Portrait to be Provided',
    isOfficialProvided: false
  },

  'doctor-orthopedics': {
    id: 'doctor-orthopedics',
    category: 'doctor',
    src: null,
    alt: 'Dr. Demo Doctor 3 (Orthopedics) - Consultant Orthopedic Surgeon',
    aspectRatio: '3/4',
    placeholderLabel: 'Official Doctor Portrait to be Provided',
    isOfficialProvided: false
  },

  'doctor-pediatrics': {
    id: 'doctor-pediatrics',
    category: 'doctor',
    src: null,
    alt: 'Dr. Demo Doctor 4 (Pediatrics) - Consultant Pediatrician',
    aspectRatio: '3/4',
    placeholderLabel: 'Official Doctor Portrait to be Provided',
    isOfficialProvided: false
  },

  'doctor-general-surgery': {
    id: 'doctor-general-surgery',
    category: 'doctor',
    src: null,
    alt: 'Dr. Demo Doctor 5 (General Surgery) - Consultant General & Laparoscopic Surgeon',
    aspectRatio: '3/4',
    placeholderLabel: 'Official Doctor Portrait to be Provided',
    isOfficialProvided: false
  },

  'doctor-oncology': {
    id: 'doctor-oncology',
    category: 'doctor',
    src: null,
    alt: 'Dr. Demo Doctor 6 (Oncology) - Consultant Medical Oncologist',
    aspectRatio: '3/4',
    placeholderLabel: 'Official Doctor Portrait to be Provided',
    isOfficialProvided: false
  },

  'doctor-obgyn': {
    id: 'doctor-obgyn',
    category: 'doctor',
    src: null,
    alt: 'Dr. Demo Doctor 7 (Obstetrics & Gynecology) - Consultant Obstetrician & Gynecologist',
    aspectRatio: '3/4',
    placeholderLabel: 'Official Doctor Portrait to be Provided',
    isOfficialProvided: false
  },

  'doctor-gastroenterology': {
    id: 'doctor-gastroenterology',
    category: 'doctor',
    src: null,
    alt: 'Dr. Demo Doctor 8 (Gastroenterology) - Consultant Gastroenterologist',
    aspectRatio: '3/4',
    placeholderLabel: 'Official Doctor Portrait to be Provided',
    isOfficialProvided: false
  },

  'doctor-pulmonology': {
    id: 'doctor-pulmonology',
    category: 'doctor',
    src: null,
    alt: 'Dr. Demo Doctor 9 (Pulmonology) - Consultant Pulmonologist',
    aspectRatio: '3/4',
    placeholderLabel: 'Official Doctor Portrait to be Provided',
    isOfficialProvided: false
  },

  'doctor-nephrology': {
    id: 'doctor-nephrology',
    category: 'doctor',
    src: null,
    alt: 'Dr. Demo Doctor 10 (Nephrology) - Consultant Nephrologist',
    aspectRatio: '3/4',
    placeholderLabel: 'Official Doctor Portrait to be Provided',
    isOfficialProvided: false
  }
};

/**
 * Helper to retrieve registered asset or return neutral default configuration
 */
export function getRegisteredAsset(assetKey: string, fallbackCategory: RegisteredAsset['category'] = 'hospital'): RegisteredAsset {
  if (hospitalImageRegistry[assetKey]) {
    return hospitalImageRegistry[assetKey];
  }

  return {
    id: assetKey,
    category: fallbackCategory,
    src: null,
    alt: 'IndoStates Hospital Official Medical Record',
    aspectRatio: '16/9',
    placeholderLabel: 'Official hospital image to be provided',
    isOfficialProvided: false
  };
}
