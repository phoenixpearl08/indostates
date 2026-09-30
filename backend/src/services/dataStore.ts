import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger';

// Types matching the Prisma and Frontend models
export interface HospitalData {
  id: string;
  name: string;
  logo: string | null;
  tagline: string;
  subtagline: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  emergencyPhone: string;
  ambulancePhone: string;
  generalPhone: string;
  appointmentHelpline: string;
  email: string;
  website: string;
  workingHours: string;
  opdHours: string;
  visitingHours: string;
  emergencyAvailability: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface DepartmentData {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  icon: string;
  category: 'clinical' | 'surgical' | 'diagnostic' | 'critical';
  shortDesc: string;
  overview: string;
  keyServices: string[];
  commonTreatments: string[];
  facilitiesAvailable: string[];
  opdTimings: string;
  featuredDoctorIds: string[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface DoctorData {
  id: string;
  name: string;
  slug: string;
  designation: string;
  title: string;
  qualification: string;
  specialization: string;
  subSpecialization?: string;
  department: string;
  departmentId: string;
  departmentName: string;
  experience: string;
  experienceYears: number | string;
  expertise: string[];
  areasOfExpertise: string[];
  biography: string;
  about: string;
  detailedProfile?: string;
  consultationTimings: string;
  opdTimings: string;
  consultationLocation: string;
  opdRoom: string;
  location: string;
  languages: string[];
  profileImage: string | null;
  profilePhoto: string | null;
  appointmentAvailability: string;
  isFeatured?: boolean;
  isDemoPlaceholder?: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface ServiceData {
  id: string;
  slug: string;
  title: string;
  name: string;
  category: string;
  shortDesc: string;
  overview: string;
  whoItIsFor: string[];
  keyFeatures: string[];
  relatedDepartmentIds: string[];
  availability: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface FacilityData {
  id: string;
  slug: string;
  title: string;
  name: string;
  category: string;
  shortDesc: string;
  description: string;
  highlights: string[];
  timings: string;
  floor: string;
  badge?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface HealthPackageData {
  id: string;
  slug: string;
  title: string;
  name: string;
  targetGroup: string;
  shortDesc: string;
  description: string;
  priceDisplay: string;
  testsIncluded: string[];
  preparationInstructions: string[];
  recommendedFrequency: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ArticleData {
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
  status: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED';
  createdAt: string;
  updatedAt: string;
}

export interface EventData {
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
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItemData {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  aspectRatio: string;
  caption: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface CareerData {
  id: string;
  slug: string;
  title: string;
  jobTitle: string;
  department: string;
  employmentType: 'Full-time' | 'Part-time' | 'Rotational' | 'Consultant';
  location: string;
  experienceRequired: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  postedDate: string;
  status: 'ACTIVE' | 'CLOSED';
}

export interface JobApplicationData {
  id: string;
  careerId: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  message?: string;
  status: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED';
  createdAt: string;
}

export interface AppointmentData {
  id: string;
  appointmentNumber: string;
  patientName: string;
  phone: string;
  email: string;
  patientGender?: string;
  patientDob?: string;
  patientType?: string;
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  preferredDate: string;
  preferredTimeSlot: string;
  reason: string;
  status: 'PENDING' | 'CONFIRMED' | 'RESCHEDULED' | 'CANCELLED' | 'COMPLETED';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactEnquiryData {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
}

export interface AdminUserData {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'SUPER_ADMIN' | 'HOSPITAL_ADMIN' | 'CONTENT_MANAGER' | 'APPOINTMENT_MANAGER';
  status: 'ACTIVE' | 'INACTIVE';
  lastLoginAt?: string;
  createdAt: string;
}

export interface AuditLogData {
  id: string;
  adminUserId: string;
  adminUserName: string;
  action: string;
  entity: string;
  entityId: string;
  metadata?: any;
  timestamp: string;
}

class ResilientDataStore {
  public hospital: HospitalData;
  public departments: DepartmentData[] = [];
  public doctors: DoctorData[] = [];
  public services: ServiceData[] = [];
  public facilities: FacilityData[] = [];
  public healthPackages: HealthPackageData[] = [];
  public articles: ArticleData[] = [];
  public events: EventData[] = [];
  public gallery: GalleryItemData[] = [];
  public careers: CareerData[] = [];
  public jobApplications: JobApplicationData[] = [];
  public appointments: AppointmentData[] = [];
  public enquiries: ContactEnquiryData[] = [];
  public adminUsers: AdminUserData[] = [];
  public auditLogs: AuditLogData[] = [];

  constructor() {
    // 1. Initial Hospital Data
    this.hospital = {
      id: 'hosp-main',
      name: 'IndoStates Hospital',
      logo: null,
      tagline: 'Compassionate Care. Advanced Healthcare.',
      subtagline: 'Comprehensive healthcare delivered with expertise, modern technology, and patient-centered clinical care.',
      description: 'IndoStates Hospital provides multi-specialty clinical care, 24x7 emergency resuscitation, advanced diagnostics, and dedicated specialist consultations.',
      address: '[HOSPITAL TO PROVIDE STREET ADDRESS], [HOSPITAL TO PROVIDE AREA / LANDMARK], [HOSPITAL TO PROVIDE CITY] - [PINCODE], [HOSPITAL TO PROVIDE STATE], India',
      city: '[HOSPITAL TO PROVIDE CITY]',
      state: '[HOSPITAL TO PROVIDE STATE]',
      country: 'India',
      pincode: '[PINCODE]',
      phone: '+91 [HOSPITAL TO PROVIDE GENERAL PHONE]',
      emergencyPhone: '+91 [HOSPITAL TO PROVIDE EMERGENCY NUMBER]',
      ambulancePhone: '+91 [HOSPITAL TO PROVIDE AMBULANCE NUMBER]',
      generalPhone: '+91 [HOSPITAL TO PROVIDE GENERAL PHONE]',
      appointmentHelpline: '+91 [HOSPITAL TO PROVIDE APPOINTMENT HELPLINE]',
      email: '[HOSPITAL TO PROVIDE OFFICIAL EMAIL]',
      website: 'https://indostateshospital.example.com',
      workingHours: '[HOSPITAL TO CONFIRM: Mon–Sat 08:00 AM – 08:00 PM | Emergency 24/7]',
      opdHours: '[HOSPITAL TO CONFIRM OPD HOURS: Mon–Sat 08:00 AM – 08:00 PM]',
      visitingHours: '[HOSPITAL TO CONFIRM VISITING HOURS: Daily 04:30 PM – 07:00 PM]',
      emergencyAvailability: '[HOSPITAL TO CONFIRM EMERGENCY SERVICE SCHEDULE: 24 Hours / 7 Days]',
      googleMapsUrl: 'https://maps.google.com/?q=IndoStates+Hospital',
      googleMapsEmbedUrl: '',
      socialLinks: {
        facebook: '[HOSPITAL TO PROVIDE FACEBOOK URL]',
        instagram: '[HOSPITAL TO PROVIDE INSTAGRAM URL]',
        linkedin: '[HOSPITAL TO PROVIDE LINKEDIN URL]',
        youtube: '[HOSPITAL TO PROVIDE YOUTUBE URL]',
      },
    };

    // 2. Initialize 12 Departments
    this.initDepartments();

    // 3. Initialize 12 Doctors
    this.initDoctors();

    // 4. Initialize Services, Facilities, Packages, Articles, Events, Gallery, Careers
    this.initContent();

    // 5. Initialize Seed Admin Users
    this.initAdminUsers();

    logger.info('ResilientDataStore initialized with complete IndoStates Hospital master records.');
  }

  private initDepartments() {
    const depts = [
      { id: 'dept-cardiology', slug: 'cardiology', name: 'Cardiology & Vascular Sciences', category: 'clinical', icon: 'HeartPulse', shortDesc: 'Clinical cardiac evaluations, ECG, echocardiography, hypertension monitoring and coronary assessment.' },
      { id: 'dept-neurology', slug: 'neurology', name: 'Neurology & Neurosciences', category: 'clinical', icon: 'Brain', shortDesc: 'Comprehensive care for neurological disorders, stroke rehabilitation, headaches, and peripheral neuropathy.' },
      { id: 'dept-orthopedics', slug: 'orthopedics', name: 'Orthopaedics & Joint Reconstruction', category: 'surgical', icon: 'Bone', shortDesc: 'Joint replacements, arthroscopy, fracture trauma management, and sports rehabilitation.' },
      { id: 'dept-pediatrics', slug: 'pediatrics', name: 'Paediatrics & Neonatal Care', category: 'clinical', icon: 'Baby', shortDesc: 'Comprehensive child healthcare, immunization programs, developmental milestones, and neonatal monitoring.' },
      { id: 'dept-gynecology', slug: 'gynecology', name: 'Obstetrics & Gynaecology', category: 'clinical', icon: 'HeartHandshake', shortDesc: 'Maternal health, antenatal care, laparoscopic gynaecological procedures, and preventive screenings.' },
      { id: 'dept-gastroenterology', slug: 'gastroenterology', name: 'Medical & Surgical Gastroenterology', category: 'clinical', icon: 'Activity', shortDesc: 'Digestive tract health, diagnostic endoscopies, liver and gallbladder disorder management.' },
      { id: 'dept-pulmonology', slug: 'pulmonology', name: 'Pulmonology & Respiratory Medicine', category: 'clinical', icon: 'Lungs', shortDesc: 'Asthma, chronic bronchitis, allergy diagnostics, sleep evaluations, and pulmonary rehabilitation.' },
      { id: 'dept-emergency', slug: 'emergency-medicine', name: 'Emergency & Critical Care Medicine', category: 'critical', icon: 'ShieldAlert', shortDesc: '24x7 acute trauma management, cardiac resuscitation, and emergency clinical triage.' },
      { id: 'dept-ent', slug: 'ent', name: 'Otolaryngology (ENT)', category: 'surgical', icon: 'Ear', shortDesc: 'Diagnostic otoscopy, sinus management, hearing assessments, and throat disorder care.' },
      { id: 'dept-ophthalmology', slug: 'ophthalmology', name: 'Ophthalmology (Eye Care)', category: 'surgical', icon: 'Eye', shortDesc: 'Comprehensive visual acuity evaluations, diabetic retinopathy screening, and cataract diagnostics.' },
      { id: 'dept-dermatology', slug: 'dermatology', name: 'Dermatology & Cosmetology', category: 'clinical', icon: 'Sparkles', shortDesc: 'Clinical management of chronic skin dermatoses, allergies, fungal conditions, and aesthetic care.' },
      { id: 'dept-urology', slug: 'urology', name: 'Urology & Andrology', category: 'surgical', icon: 'Stethoscope', shortDesc: 'Evaluation of renal and urinary tract disorders, prostate health screening, and uroflowmetry.' },
    ];

    this.departments = depts.map((d) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      tagline: `Clinical Scope: ${d.name} Care`,
      icon: d.icon,
      category: d.category as any,
      shortDesc: d.shortDesc,
      overview: `The Department of ${d.name} at IndoStates Hospital delivers expert diagnostics and compassionate therapeutic management. [Hospital to provide detailed clinical scope].`,
      keyServices: ['Diagnostic evaluations [HOSPITAL TO CONFIRM]', 'Specialist Outpatient Consultations', 'Preventive screenings and follow-ups'],
      commonTreatments: ['Comprehensive clinical assessments', 'Evidence-based medical management'],
      facilitiesAvailable: ['Outpatient consultation suites [HOSPITAL TO CONFIRM]'],
      opdTimings: '[HOSPITAL TO PROVIDE OPD SCHEDULE: e.g. Mon–Sat 09:00 AM – 05:00 PM]',
      featuredDoctorIds: [],
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  private initDoctors() {
    this.doctors = this.departments.map((dept, index) => {
      const docNum = index + 1;
      return {
        id: `doc-${docNum}`,
        name: `Dr. Demo Doctor ${docNum} (${dept.name.split(' ')[0]})`,
        slug: `dr-demo-doctor-${dept.slug}`,
        designation: `Consultant [HOSPITAL TO PROVIDE TITLE: e.g. Senior Consultant in ${dept.name.split(' ')[0]}]`,
        title: `Consultant [HOSPITAL TO PROVIDE TITLE]`,
        qualification: 'MBBS, MD / MS [QUALIFICATION TO BE PROVIDED]',
        specialization: `${dept.name.split(' ')[0]} [SPECIALIZATION TO BE PROVIDED]`,
        subSpecialization: `Sub-specialty in ${dept.name.split(' ')[0]} [HOSPITAL TO PROVIDE]`,
        department: dept.name,
        departmentId: dept.id,
        departmentName: dept.name,
        experience: '[EXPERIENCE TO BE PROVIDED: e.g. 10+ Years]',
        experienceYears: '[EXPERIENCE TO BE PROVIDED: e.g. 10+ Years]',
        expertise: ['Clinical Consultation [HOSPITAL TO CONFIRM]', 'Preventive Diagnosis', 'Therapeutic Care'],
        areasOfExpertise: ['Clinical Consultation [HOSPITAL TO CONFIRM]', 'Preventive Diagnosis', 'Therapeutic Care'],
        biography: `Representative doctor profile placeholder for ${dept.name}. [Hospital medical registry credentials to be updated prior to public launch].`,
        about: `Representative doctor profile placeholder for ${dept.name}. [Hospital medical registry credentials to be updated prior to public launch].`,
        detailedProfile: `Detailed clinical biography and sub-specialization credentials to be provided by IndoStates Hospital medical directorate.`,
        consultationTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS: e.g. Mon–Fri 10:00 AM – 02:00 PM]',
        opdTimings: '[HOSPITAL TO PROVIDE CONSULTATION TIMINGS: e.g. Mon–Fri 10:00 AM – 02:00 PM]',
        consultationLocation: 'IndoStates Hospital Main Campus, [HOSPITAL TO PROVIDE OPD ROOM: e.g. Suite 204]',
        opdRoom: '[HOSPITAL TO PROVIDE OPD ROOM / LOCATION: e.g. OPD Suite 204]',
        location: 'IndoStates Hospital Main Campus',
        languages: ['[HOSPITAL TO PROVIDE LANGUAGES: e.g. English, Regional Language]'],
        profileImage: null,
        profilePhoto: null,
        appointmentAvailability: '[HOSPITAL TO CONFIRM APPOINTMENT SCHEDULE: Mon–Sat Availability]',
        isFeatured: index < 4,
        isDemoPlaceholder: true,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
  }

  private initContent() {
    // Services
    this.services = [
      { id: 'srv-1', slug: 'outpatient-consultations', title: 'Outpatient Consultations (OPD)', name: 'Outpatient Consultations (OPD)', category: 'Clinical Care', shortDesc: 'Multi-specialty outpatient clinics with experienced consultants.', overview: 'OPD services operate daily across clinical specialties.', whoItIsFor: ['Patients requiring primary or specialist consultation'], keyFeatures: ['Flexible scheduling', 'Multi-disciplinary referrals'], relatedDepartmentIds: ['dept-cardiology', 'dept-neurology'], availability: 'Mon-Sat 08:00 AM - 08:00 PM', status: 'ACTIVE' },
      { id: 'srv-2', slug: 'emergency-trauma', title: '24×7 Emergency & Critical Care', name: '24×7 Emergency & Critical Care', category: 'Critical Care', shortDesc: 'Round-the-clock acute medical trauma, stroke, and cardiac life support.', overview: 'Emergency medicine department staffed 24/7.', whoItIsFor: ['Acute medical trauma', 'Chest pain', 'Accidents'], keyFeatures: ['Level-1 triage', 'Dedicated resuscitation bay'], relatedDepartmentIds: ['dept-emergency'], availability: '24 Hours / 7 Days', status: 'ACTIVE' },
      { id: 'srv-3', slug: 'modular-operating-theatres', title: 'Surgical Suites & Modular OTs', name: 'Surgical Suites & Modular OTs', category: 'Surgical Services', shortDesc: 'Advanced sterile modular operating rooms equipped with HEPA laminar air filtration.', overview: 'Sterile surgical environment supporting open and laparoscopic surgeries.', whoItIsFor: ['Surgical candidates'], keyFeatures: ['Laminar flow', 'Infection control'], relatedDepartmentIds: ['dept-orthopedics', 'dept-gynecology'], availability: 'Scheduled & Emergency', status: 'ACTIVE' },
      { id: 'srv-4', slug: 'clinical-laboratory', title: 'Automated Diagnostic Laboratory', name: 'Automated Diagnostic Laboratory', category: 'Diagnostics', shortDesc: '24x7 central clinical pathology, biochemistry, hematology, and microbiology testing.', overview: 'High-throughput automated analyzers.', whoItIsFor: ['Inpatients and Outpatients requiring diagnostics'], keyFeatures: ['Same-day reporting', 'Quality controls'], relatedDepartmentIds: ['dept-emergency'], availability: '24 Hours / 7 Days', status: 'ACTIVE' },
    ];

    // Facilities
    this.facilities = [
      { id: 'fac-1', slug: 'modular-operating-theatre', title: 'Modular Operating Theatres', name: 'Modular Operating Theatres', category: 'Surgical Infrastructure', shortDesc: 'Sterile surgical rooms with laminar flow and central medical gas integration.', description: 'Laminar air-flow theatres designed for infection-free surgical interventions.', highlights: ['HEPA filtration', 'Central gas manifolds', 'LED scialytic surgical lights'], timings: '24 Hours Preparedness', floor: 'Level 2, Surgical Wing', badge: 'Sterile Zone', status: 'ACTIVE' },
      { id: 'fac-2', slug: 'intensive-care-unit', title: 'Intensive Care Unit (ICU)', name: 'Intensive Care Unit (ICU)', category: 'Critical Care Infrastructure', shortDesc: 'Level-3 intensive care beds with central telemetry and mechanical ventilation.', description: 'Advanced critical care unit staffed with intensivists and 1:1 nursing.', highlights: ['Invasive cardiac monitors', 'High-end ventilators', 'Isolation negative-pressure rooms'], timings: '24 Hours / 7 Days', floor: 'Level 3, Critical Care Tower', badge: '24x7 Critical Care', status: 'ACTIVE' },
      { id: 'fac-3', slug: 'diagnostic-laboratory', title: 'Clinical Laboratory Suite', name: 'Clinical Laboratory Suite', category: 'Diagnostic Infrastructure', shortDesc: 'Automated analyzers for biochemistry, hematology, serology, and microbiology.', description: 'Rapid STAT testing for emergency cases alongside routine outpatient investigations.', highlights: ['Automated chemistry analyzers', 'Coagulation monitors', 'Barcoded sample tracking'], timings: '07:00 AM – 08:00 PM (Emergency 24/7)', floor: 'Ground Floor', badge: 'Quality Assured', status: 'ACTIVE' },
    ];

    // Health Packages
    this.healthPackages = [
      { id: 'pkg-1', slug: 'basic-wellness-checkup', title: 'Essential Health Checkup', name: 'Essential Health Checkup', targetGroup: 'Adults aged 18–40 seeking routine health monitoring', shortDesc: 'Baseline screening for diabetes, cholesterol, kidney, and liver function.', description: 'Standard preventive health profile.', priceDisplay: '[Contact Hospital for Pricing]', testsIncluded: ['Complete Blood Count (CBC)', 'Fasting Blood Sugar (FBS)', 'Lipid Profile', 'Liver Function Test (LFT)', 'Kidney Function Test (KFT)', 'Urine Routine', 'Doctor Consultation'], preparationInstructions: ['10–12 hours overnight fasting required. Water permitted.'], recommendedFrequency: 'Annually', status: 'ACTIVE' },
      { id: 'pkg-2', slug: 'comprehensive-cardiac-checkup', title: 'Comprehensive Heart Checkup', name: 'Comprehensive Heart Checkup', targetGroup: 'Individuals with hypertension, family history of cardiac disease', shortDesc: 'In-depth cardiovascular assessment with ECG, ECHO, and lipid profile.', description: 'Cardiac health screening package.', priceDisplay: '[Contact Hospital for Pricing]', testsIncluded: ['12-Lead ECG', '2D Echocardiography', 'Lipid Profile', 'HbA1c & Fasting Glucose', 'Cardiac Consultation'], preparationInstructions: ['Fasting required for blood tests. Avoid caffeine.'], recommendedFrequency: 'Annually or as advised', status: 'ACTIVE' },
    ];

    // Articles
    this.articles = [
      { id: 'art-1', slug: 'understanding-hypertension-risks', title: 'Managing High Blood Pressure: Essential Daily Habits', excerpt: 'Hypertension is often called the silent killer. Learn why monitoring and lifestyle moderation matter.', content: ['High blood pressure rarely presents overt symptoms in early stages.', 'Regular checkups and reduced sodium intake are proven first-line safeguards.', 'Always consult a doctor before starting or adjusting medication.'], category: 'Heart Health', authorName: 'IndoStates Medical Editorial Team', authorRole: 'Clinical Review Board', publishedDate: '2026-02-15', readTime: '4 min read', tags: ['Cardiology', 'Hypertension', 'Wellness'], isFeatured: true, status: 'PUBLISHED', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'art-2', slug: 'preventive-health-importance', title: 'The Power of Preventive Health Screening in Modern Living', excerpt: 'Early detection transforms healthcare outcomes. Discover key checkups recommended by age.', content: ['Preventive checkups identify metabolic changes before they develop into chronic diseases.', 'Routine screening reduces acute hospitalizations significantly.'], category: 'Preventive Health', authorName: 'IndoStates Medical Editorial Team', authorRole: 'Clinical Review Board', publishedDate: '2026-03-01', readTime: '5 min read', tags: ['Preventive Care', 'Screening', 'Lifestyle'], isFeatured: false, status: 'PUBLISHED', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];

    // Events
    this.events = [
      { id: 'evt-1', slug: 'community-cardiac-camp', title: 'Free Community Heart Health & BP Screening Camp', category: 'Camp', date: 'Upcoming Saturday', time: '09:00 AM – 01:00 PM', venue: 'IndoStates Hospital Ground Floor Outpatient Atrium', departmentName: 'Cardiology', shortDesc: 'Free blood pressure, random blood sugar, and basic cardiac clinical checkups.', details: ['Free BP and Glucose checks', 'Consultant physician guidance', 'Complimentary dietary advice'], isUpcoming: true, registrationOpen: true, status: 'UPCOMING', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];

    // Gallery
    this.gallery = [
      { id: 'gal-1', title: 'Main Campus Facade & Entrance', category: 'Hospital', description: 'Architectural view of IndoStates Hospital campus and main arrival canopy.', imageUrl: '', thumbnailUrl: '', aspectRatio: '16/9', caption: 'Hospital Main Entrance [Photo to be provided by hospital]', status: 'ACTIVE' },
      { id: 'gal-2', title: 'Modular Operating Theatre Suite', category: 'Facilities', description: 'Advanced sterile surgical theatre with laminar flow ventilation.', imageUrl: '', thumbnailUrl: '', aspectRatio: '3/2', caption: 'Modular Surgical Room [Photo to be provided by hospital]', status: 'ACTIVE' },
    ];

    // Careers
    this.careers = [
      { id: 'car-1', slug: 'consultant-cardiologist', title: 'Consultant Cardiologist', jobTitle: 'Consultant Cardiologist', department: 'Cardiology & Vascular Sciences', employmentType: 'Full-time', location: 'IndoStates Hospital Main Campus', experienceRequired: '5+ years post DM / DNB', summary: 'Seeking a full-time clinical and non-invasive consultant cardiologist.', responsibilities: ['Conduct outpatient cardiac consultations', 'Interpret ECG, ECHO, and TMT diagnostics', 'Participate in critical care multidisciplinary rounds'], requirements: ['MD in General Medicine, DM/DNB in Cardiology', 'Registration with State Medical Council'], postedDate: '2026-03-01', status: 'ACTIVE' },
      { id: 'car-2', slug: 'senior-staff-nurse-icu', title: 'Senior Staff Nurse (ICU & Critical Care)', jobTitle: 'Senior Staff Nurse (ICU & Critical Care)', department: 'Critical Care & Emergency', employmentType: 'Rotational', location: 'IndoStates Hospital Main Campus', experienceRequired: '3–6 years in ICU / CCU', summary: 'Seeking compassionate ICU nurses certified in BLS/ACLS for our critical care unit.', responsibilities: ['Manage bedside telemetry and hemodynamic parameters', 'Administer emergency medications per physician protocols', 'Coordinate infection control workflows'], requirements: ['B.Sc Nursing or GNM with active State Nursing Council registration', 'Valid BLS/ACLS certification preferred'], postedDate: '2026-03-05', status: 'ACTIVE' },
    ];

    // Initial Demo Appointment
    this.appointments.push({
      id: 'appt-1',
      appointmentNumber: 'IND-2026-0001',
      patientName: 'Demo Patient 1',
      phone: '+91 98765 43210',
      email: 'patient.demo@example.com',
      patientGender: 'Male',
      patientType: 'new',
      departmentId: 'dept-cardiology',
      departmentName: 'Cardiology & Vascular Sciences',
      doctorId: 'doc-1',
      doctorName: 'Dr. Demo Doctor 1 (Cardiology)',
      preferredDate: '2026-10-05',
      preferredTimeSlot: '10:00 AM - 11:00 AM',
      reason: 'Routine cardiac health review and blood pressure checkup [Demo submission].',
      status: 'PENDING',
      adminNotes: 'Initial demo appointment record to demonstrate admin verification workflow.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Initial Demo Enquiry
    this.enquiries.push({
      id: 'enq-1',
      name: 'Demo Visitor',
      email: 'visitor.demo@example.com',
      phone: '+91 98765 00000',
      subject: 'Inquiry regarding OPD consultation hours',
      message: 'Hello, could you please confirm the cardiology consultation timings on Saturday mornings? Thank you.',
      status: 'NEW',
      createdAt: new Date().toISOString(),
    });
  }

  private async initAdminUsers() {
    const defaultPasswordHash = await bcrypt.hash('AdminPassword@2026', 10);
    const apptPasswordHash = await bcrypt.hash('ApptPassword@2026', 10);
    const contentPasswordHash = await bcrypt.hash('ContentPassword@2026', 10);

    this.adminUsers = [
      {
        id: 'admin-super',
        name: 'Super Administrator',
        email: 'admin@indostates.example',
        passwordHash: defaultPasswordHash,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'admin-appt',
        name: 'Appointment Coordinator',
        email: 'appointments@indostates.example',
        passwordHash: apptPasswordHash,
        role: 'APPOINTMENT_MANAGER',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'admin-content',
        name: 'Content Manager',
        email: 'content@indostates.example',
        passwordHash: contentPasswordHash,
        role: 'CONTENT_MANAGER',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  // --- Helper Methods ---

  public getDashboardStats() {
    return {
      totalDoctors: this.doctors.filter((d) => d.status === 'ACTIVE').length,
      totalDepartments: this.departments.filter((d) => d.status === 'ACTIVE').length,
      pendingAppointments: this.appointments.filter((a) => a.status === 'PENDING').length,
      totalAppointments: this.appointments.length,
      newEnquiries: this.enquiries.filter((e) => e.status === 'NEW').length,
      publishedArticles: this.articles.filter((a) => a.status === 'PUBLISHED').length,
      upcomingEvents: this.events.filter((e) => e.status === 'UPCOMING').length,
      activeCareers: this.careers.filter((c) => c.status === 'ACTIVE').length,
    };
  }

  public recordAuditLog(adminUserId: string, adminUserName: string, action: string, entity: string, entityId: string, metadata?: any) {
    const log: AuditLogData = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      adminUserId,
      adminUserName,
      action,
      entity,
      entityId,
      metadata,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    logger.audit(adminUserName, action, entity, entityId, metadata);
    return log;
  }
}

export const dataStore = new ResilientDataStore();
