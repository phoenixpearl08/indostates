export interface HospitalInfo {
  name: string;
  logo: string | null;
  tagline: string;
  subtagline: string;
  address: string;
  phone: string;
  emergencyNumber: string;
  emergencyPhone: string;
  ambulancePhone: string;
  generalPhone: string;
  appointmentHelpline: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  workingHours: string;
  opdHours: string;
  opdTimings: string;
  visitingHours: string;
  emergencyAvailability: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  demoNotice?: string;
  claimsNotice?: string;
}

export interface Department {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  category: 'clinical' | 'surgical' | 'diagnostic' | 'critical';
  shortDesc: string;
  overview: string;
  keyServices: string[];
  commonTreatments: string[];
  facilitiesAvailable: string[];
  opdTimings: string;
  faqs: { question: string; answer: string }[];
  featuredDoctorIds: string[];
  isVerifiedByHospital?: boolean;
}

export interface Doctor {
  id: string;
  slug: string;
  name: string; // e.g. "Dr. Demo Doctor 1 (Cardiology)"
  designation: string; // e.g. "Senior Consultant [HOSPITAL TO PROVIDE TITLE]"
  title: string; // alias for designation
  qualification: string; // "[QUALIFICATION TO BE PROVIDED]"
  specialization: string; // "[SPECIALIZATION TO BE PROVIDED]"
  department: string; // e.g. "Cardiology & Vascular Sciences"
  departmentId: string;
  departmentName: string; // alias for department
  experience: string; // "[EXPERIENCE TO BE PROVIDED: e.g. 15+ Years]"
  experienceYears: number | string; // alias for experience
  expertise: string[]; // areas of clinical expertise
  areasOfExpertise: string[]; // alias for expertise
  biography: string; // clinical biography
  about: string; // alias for biography
  detailedProfile?: string; // extended clinical profile
  consultationTimings: string; // "[HOSPITAL TO PROVIDE CONSULTATION TIMINGS]"
  opdTimings: string; // alias for consultationTimings
  consultationLocation: string; // "[HOSPITAL TO PROVIDE OPD ROOM / LOCATION]"
  opdRoom: string; // alias for consultationLocation
  location: string;
  languages: string[]; // "[HOSPITAL TO PROVIDE LANGUAGES]"
  profileImage: string | null; // e.g. '/assets/doctors/dr-demo-doctor-cardiology.webp' or null
  profilePhoto: string | null; // alias for profileImage
  photoPlaceholderText?: string; // "[DOCTOR PHOTO TO BE PROVIDED]"
  subSpecialization?: string;
  education: string[];
  appointmentAvailability: string; // "[HOSPITAL TO CONFIRM APPOINTMENT SCHEDULE]"
  isFeatured?: boolean;
  isDemoPlaceholder?: boolean;
  avatarSeed?: string;
}

export interface MedicalService {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  overview: string;
  whoItIsFor: string[];
  keyFeatures: string[];
  relatedDepartmentIds: string[];
  availability: string;
  isVerifiedByHospital?: boolean;
}

export interface Facility {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  description: string;
  highlights: string[];
  timings: string;
  floor: string;
  badge?: string;
  isVerifiedByHospital?: boolean;
}

export interface HealthPackage {
  id: string;
  slug: string;
  title: string;
  targetGroup: string;
  shortDesc: string;
  priceDisplay: string; // editable placeholder e.g. "[Contact Hospital for Pricing]"
  testsIncluded: string[];
  preparationInstructions: string[];
  recommendedFrequency: string;
  badge?: string;
  isVerifiedByHospital?: boolean;
}

export interface HealthArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  authorName: string;
  authorRole: string;
  publishedDate: string;
  readTime: string;
  tags: string[];
  isFeatured?: boolean;
}

export interface HealthEvent {
  id: string;
  slug: string;
  title: string;
  category: 'Camp' | 'Awareness' | 'Workshop' | 'Screening';
  date: string;
  time: string;
  venue: string;
  departmentName: string;
  shortDesc: string;
  details: string[];
  isUpcoming: boolean;
  registrationOpen: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Hospital' | 'Facilities' | 'Events' | 'Health camps' | 'Doctors' | 'Departments' | 'Equipment' | 'Campus';
  caption: string;
  accentColor: string;
  icon: string;
}

export interface PatientTestimonial {
  id: string;
  patientName: string;
  location: string;
  departmentName: string;
  treatmentType: string;
  date: string;
  feedback: string;
  rating: number;
  isDemoNotice: boolean;
}

export interface CareerPosition {
  id: string;
  slug: string;
  title: string;
  department: string;
  employmentType: 'Full-time' | 'Part-time' | 'Rotational' | 'Consultant';
  location: string;
  experienceRequired: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  postedDate: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'Appointments' | 'Admission' | 'Insurance' | 'Reports' | 'General';
}

export interface AppointmentFormData {
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  preferredDate: string;
  preferredTimeSlot: string;
  patientFullName: string;
  patientPhone: string;
  patientEmail: string;
  patientGender: string;
  patientDob: string;
  visitReason: string;
  patientType: 'new' | 'existing';
  agreedToTerms: boolean;
}

export interface AppointmentSubmissionResult {
  requestId: string;
  data: AppointmentFormData;
  submittedAt: string;
  status: 'Received - Pending Hospital Confirmation';
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  subject: string;
  message: string;
}
