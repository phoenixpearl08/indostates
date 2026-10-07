// ==============================================================================
// INDOSTATES HOSPITAL: MASTER HMS SERVICE & STATE MACHINE ENGINE
// Connected Encounter, Queue, Prescription, Lab, Billing & Audit Layer
// Works synchronously in memory and synchronizes with Supabase when configured
// ==============================================================================

import {
  AdmissionRecord,
  AmbulanceRecord,
  AmbulanceRequest,
  AppointmentRecord,
  AppointmentStatus,
  AuditLogRecord,
  BedRecord,
  BedStatus,
  BillingInvoice,
  CaregiverConsent,
  EmergencyCase,
  HousekeepingTask,
  ImagingOrderRecord,
  LabOrderRecord,
  MaintenanceTicket,
  NurseTaskRecord,
  NotificationRecord,
  PatientEncounter,
  PatientProfile,
  PharmacyBatch,
  PharmacyInventoryItem,
  PrescriptionRecord,
  QueueEntry,
  RoomRecord,
  TimelineEvent,
  UserRole,
  WardRecord,
} from "@/types/hms";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";

// 1. UNIQUE IDENTIFIER GENERATORS
export function generateUHID(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `IND-UHID-${num}`;
}

export function generateAppointmentId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `IND-APT-${num}`;
}

export function generateEncounterId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `ENC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${num}`;
}

export function generatePrescriptionId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `RX-${num}`;
}

export function generateLabOrderId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `LAB-${num}`;
}

export function generateInvoiceId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `INV-${num}`;
}

export function generateAdmissionId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `ADM-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${num}`;
}

export function generateEmergencyCaseId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `EMG-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${num}`;
}

export function generateAmbulanceRequestId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `AMB-REQ-${num}`;
}

export function generateImagingOrderId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `IMG-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${num}`;
}

export function generateHousekeepingTaskId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `HK-${num}`;
}

export function generateMaintenanceTicketId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `MNT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${num}`;
}

export function generateConsentId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `CGC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${num}`;
}

export function generateTokenNumber(dailySequence: number): string {
  return `T-${String(dailySequence).padStart(3, "0")}`;
}

// 2. APPOINTMENT STATE MACHINE VALIDATOR
const VALID_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  BOOKED: ["CONFIRMED", "CANCELLED"],
  PENDING: ["CONFIRMED", "CANCELLED", "REJECTED"],
  CONFIRMED: ["CHECKED_IN", "CANCELLED", "NO_SHOW"],
  CHECKED_IN: ["WAITING", "CANCELLED"],
  WAITING: ["CALLED", "NO_SHOW", "CANCELLED"],
  CALLED: ["IN_CONSULTATION", "WAITING", "NO_SHOW"],
  IN_CONSULTATION: ["CONSULTATION_COMPLETED", "LAB_PENDING", "PHARMACY_PENDING", "BILLING_PENDING"],
  CONSULTATION_COMPLETED: ["LAB_PENDING", "PHARMACY_PENDING", "BILLING_PENDING", "COMPLETED"],
  LAB_PENDING: ["LAB_COMPLETED", "BILLING_PENDING", "CANCELLED"],
  LAB_COMPLETED: ["PHARMACY_PENDING", "BILLING_PENDING", "COMPLETED"],
  PHARMACY_PENDING: ["PHARMACY_COMPLETED", "BILLING_PENDING", "CANCELLED"],
  PHARMACY_COMPLETED: ["BILLING_PENDING", "COMPLETED"],
  BILLING_PENDING: ["PAYMENT_COMPLETED", "COMPLETED"],
  PAYMENT_COMPLETED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: ["CONFIRMED"], // Allow rescheduling
  REJECTED: [],
  EXPIRED: ["CONFIRMED"],
};

export function canTransitionStatus(from: AppointmentStatus, to: AppointmentStatus): boolean {
  if (from === to) return true;
  const allowed = VALID_TRANSITIONS[from];
  return Boolean(allowed && allowed.includes(to));
}

// 3. PERSISTENT GLOBAL HMS REGISTRY (Shared across API requests in Node server)
interface GlobalHMSRegistry {
  patients: PatientProfile[];
  appointments: AppointmentRecord[];
  queues: QueueEntry[];
  encounters: PatientEncounter[];
  prescriptions: PrescriptionRecord[];
  labOrders: LabOrderRecord[];
  invoices: BillingInvoice[];
  nurseTasks: NurseTaskRecord[];
  notifications: NotificationRecord[];
  auditLogs: AuditLogRecord[];
  dailyTokenSequence: number;
  wards: WardRecord[];
  rooms: RoomRecord[];
  beds: BedRecord[];
  admissions: AdmissionRecord[];
  emergencyCases: EmergencyCase[];
  ambulances: AmbulanceRecord[];
  ambulanceRequests: AmbulanceRequest[];
  imagingOrders: ImagingOrderRecord[];
  pharmacyInventory: PharmacyInventoryItem[];
  housekeepingTasks: HousekeepingTask[];
  maintenanceTickets: MaintenanceTicket[];
  caregiverConsents: CaregiverConsent[];
}

declare global {
  // eslint-disable-next-line no-var
  var __ISH_HMS_REGISTRY__: GlobalHMSRegistry | undefined;
}

function getHMSRegistry(): GlobalHMSRegistry {
  if (!global.__ISH_HMS_REGISTRY__) {
    const today = new Date().toISOString().split("T")[0];
    const initialPatient: PatientProfile = {
      id: "pat-seed-001",
      uhid: "IND-UHID-000101",
      fullName: "Murugan Selvam",
      email: "murugan@example.com",
      phone: "+91 94432 11223",
      age: 56,
      gender: "Male",
      bloodGroup: "O+",
      address: "12/4 Gandhipuram 4th Cross, Coimbatore - 641012",
      emergencyContactName: "Selvamani Murugan",
      emergencyContactPhone: "+91 94432 11224",
      emergencyContactRelation: "Spouse",
      accountStatus: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const initialAppointment: AppointmentRecord = {
      id: "apt-seed-001",
      appointmentId: "IND-APT-100001",
      referenceCode: "ISH-552910",
      verificationToken: "tok_secure_552910_seed",
      patientId: initialPatient.id,
      patientUhid: initialPatient.uhid,
      patientName: initialPatient.fullName,
      patientPhone: initialPatient.phone,
      patientEmail: initialPatient.email,
      patientAge: initialPatient.age,
      patientGender: initialPatient.gender,
      serviceType: "doctor",
      targetId: "dr-rajesh-rangaswamy",
      targetName: "Neurovascular & Stroke Consultation",
      doctorId: "dr-rajesh-rangaswamy",
      doctorName: "Dr. Rajesh Rangaswamy",
      departmentId: "neuro-stroke",
      departmentName: "Neurovascular & Stroke Care",
      appointmentDate: today,
      timeSlot: "10:30 AM",
      tokenNumber: "T-001",
      status: "WAITING",
      paymentStatus: "pay_on_arrival",
      notes: "Transient numbness and mild speech hesitation. Code stroke evaluation requested.",
      checkInTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      qrVerified: true,
      createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const initialQueue: QueueEntry = {
      id: "q-seed-001",
      appointmentId: initialAppointment.id,
      patientId: initialPatient.id,
      patientName: initialPatient.fullName,
      patientUhid: initialPatient.uhid,
      doctorId: "dr-rajesh-rangaswamy",
      doctorName: "Dr. Rajesh Rangaswamy",
      departmentId: "neuro-stroke",
      tokenNumber: "T-001",
      status: "waiting",
      checkInTime: initialAppointment.checkInTime || new Date().toISOString(),
      priority: "urgent",
    };

    const initialAudit: AuditLogRecord = {
      id: "log-seed-001",
      actorId: "usr-reception",
      actorName: "Front Office Lead",
      actorRole: "RECEPTIONIST",
      action: "appointment.checkin",
      resource: "appointments/IND-APT-100001",
      details: { tokenNumber: "T-001", patientUhid: "IND-UHID-000101" },
      status: "success",
      createdAt: new Date().toISOString(),
    };

    // Enterprise Wards
    const initialWards: WardRecord[] = [
      {
        id: "w-nicu",
        wardNumber: "W-NICU-01",
        name: "Neuro Intensive Care Unit (NICU)",
        floor: "2nd Floor - Wing B",
        totalBeds: 8,
        departmentId: "neuro-stroke",
        active: true,
      },
      {
        id: "w-cts",
        wardNumber: "W-CTS-02",
        name: "Cardiothoracic Stepdown Ward",
        floor: "3rd Floor - Wing A",
        totalBeds: 12,
        departmentId: "cardiology",
        active: true,
      },
      {
        id: "w-gwa",
        wardNumber: "W-GWA-03",
        name: "General Medical Ward A",
        floor: "1st Floor - Wing C",
        totalBeds: 20,
        departmentId: "general-medicine",
        active: true,
      },
      {
        id: "w-er",
        wardNumber: "W-ER-00",
        name: "Emergency Triage & Trauma Bay",
        floor: "Ground Floor - East Wing",
        totalBeds: 6,
        departmentId: "emergency",
        active: true,
      },
    ];

    // Enterprise Rooms
    const initialRooms: RoomRecord[] = [
      { id: "r-101", roomNumber: "R-101", wardId: "w-gwa", roomType: "general", dailyRate: 1500 },
      { id: "r-201", roomNumber: "R-201", wardId: "w-nicu", roomType: "icu", dailyRate: 6500 },
      { id: "r-301", roomNumber: "R-301", wardId: "w-cts", roomType: "semi_private", dailyRate: 3500 },
    ];

    // Enterprise Beds
    const initialBeds: BedRecord[] = [
      {
        id: "bed-nicu-01",
        bedNumber: "BED-NICU-01",
        wardId: "w-nicu",
        wardName: "Neuro Intensive Care Unit (NICU)",
        roomId: "r-201",
        roomNumber: "R-201",
        status: "OCCUPIED",
        currentPatientUhid: "IND-UHID-000101",
        currentPatientName: "Murugan Selvam",
        currentAdmissionId: "adm-seed-001",
        lastCleanedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "bed-nicu-02",
        bedNumber: "BED-NICU-02",
        wardId: "w-nicu",
        wardName: "Neuro Intensive Care Unit (NICU)",
        roomId: "r-201",
        roomNumber: "R-201",
        status: "AVAILABLE",
        lastCleanedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "bed-nicu-03",
        bedNumber: "BED-NICU-03",
        wardId: "w-nicu",
        wardName: "Neuro Intensive Care Unit (NICU)",
        roomId: "r-201",
        roomNumber: "R-201",
        status: "CLEANING",
        updatedAt: new Date().toISOString(),
      },
      {
        id: "bed-cts-01",
        bedNumber: "BED-CTS-01",
        wardId: "w-cts",
        wardName: "Cardiothoracic Stepdown Ward",
        roomId: "r-301",
        roomNumber: "R-301",
        status: "AVAILABLE",
        lastCleanedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "bed-cts-02",
        bedNumber: "BED-CTS-02",
        wardId: "w-cts",
        wardName: "Cardiothoracic Stepdown Ward",
        roomId: "r-301",
        roomNumber: "R-301",
        status: "MAINTENANCE",
        updatedAt: new Date().toISOString(),
      },
      {
        id: "bed-gwa-01",
        bedNumber: "BED-GWA-01",
        wardId: "w-gwa",
        wardName: "General Medical Ward A",
        roomId: "r-101",
        roomNumber: "R-101",
        status: "AVAILABLE",
        lastCleanedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "bed-gwa-02",
        bedNumber: "BED-GWA-02",
        wardId: "w-gwa",
        wardName: "General Medical Ward A",
        roomId: "r-101",
        roomNumber: "R-101",
        status: "AVAILABLE",
        lastCleanedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "bed-er-01",
        bedNumber: "BED-ER-01",
        wardId: "w-er",
        wardName: "Emergency Triage & Trauma Bay",
        status: "OCCUPIED",
        currentPatientName: "Karthik Subramanian (Triage Red)",
        updatedAt: new Date().toISOString(),
      },
      {
        id: "bed-er-02",
        bedNumber: "BED-ER-02",
        wardId: "w-er",
        wardName: "Emergency Triage & Trauma Bay",
        status: "AVAILABLE",
        lastCleanedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Enterprise Inpatient Admissions
    const initialAdmissions: AdmissionRecord[] = [
      {
        id: "adm-seed-001",
        admissionNumber: "ADM-202610-001",
        patientUhid: "IND-UHID-000101",
        patientName: "Murugan Selvam",
        patientPhone: "+91 94432 11223",
        doctorId: "dr-rajesh-rangaswamy",
        doctorName: "Dr. Rajesh Rangaswamy",
        departmentId: "neuro-stroke",
        wardId: "w-nicu",
        wardName: "Neuro Intensive Care Unit (NICU)",
        bedId: "bed-nicu-01",
        bedNumber: "BED-NICU-01",
        admissionDate: today,
        admissionReason: "Acute neurovascular stroke observation & IV thrombolysis protocol",
        status: "ADMITTED",
        createdAt: new Date().toISOString(),
      },
    ];

    // Enterprise Emergency Cases
    const initialEmergencyCases: EmergencyCase[] = [
      {
        id: "emg-seed-001",
        caseNumber: "EMG-202610-001",
        patientName: "Karthik Subramanian",
        patientPhone: "+91 98401 23456",
        triagePriority: "RED",
        chiefComplaint: "Sudden crushing retrosternal chest pain radiating to left arm with diaphoresis (STEMI alert)",
        vitals: {
          bloodPressure: "90/60",
          pulseRate: 118,
          spO2: 94,
          gcs: 15,
        },
        attendingDoctorId: "dr-saravanan-subramanian",
        attendingDoctorName: "Dr. Saravanan Subramanian",
        attendingNurseName: "Nurse Sister Priya",
        bedNumber: "BED-ER-01",
        status: "IN_TREATMENT",
        arrivedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      },
    ];

    // Enterprise Ambulances
    const initialAmbulances: AmbulanceRecord[] = [
      {
        id: "amb-001",
        vehicleNumber: "TN 38 BJ 1088",
        vehicleType: "Advanced Cardiac Life Support (ACLS)",
        driverName: "K. Murugesan",
        driverPhone: "+91 98422 10881",
        status: "AVAILABLE",
        currentLocation: "IndoStates Hospital Main Bay",
        equipmentReady: true,
      },
      {
        id: "amb-002",
        vehicleNumber: "TN 38 CK 2045",
        vehicleType: "Basic Life Support (BLS)",
        driverName: "S. Manikandan",
        driverPhone: "+91 98422 20452",
        status: "EN_ROUTE",
        currentLocation: "Avinashi Road Flyover, Coimbatore",
        equipmentReady: true,
      },
      {
        id: "amb-003",
        vehicleNumber: "TN 38 DM 3319",
        vehicleType: "Patient Transport",
        driverName: "R. Velusamy",
        driverPhone: "+91 98422 33193",
        status: "AVAILABLE",
        currentLocation: "IndoStates North Campus Base",
        equipmentReady: true,
      },
    ];

    // Enterprise Ambulance Requests
    const initialAmbulanceRequests: AmbulanceRequest[] = [
      {
        id: "amb-req-001",
        requestNumber: "AMB-REQ-1001",
        patientName: "Meenakshi Sundaram",
        patientPhone: "+91 94421 99887",
        pickupAddress: "45 Gandhi Road, Near Hope College, Peelamedu, Coimbatore",
        destination: "IndoStates Hospital Emergency Department",
        ambulanceId: "amb-002",
        vehicleNumber: "TN 38 CK 2045",
        driverName: "S. Manikandan",
        driverPhone: "+91 98422 20452",
        status: "EN_ROUTE",
        priority: "EMERGENCY",
        requestedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      },
    ];

    // Enterprise Imaging Orders
    const initialImagingOrders: ImagingOrderRecord[] = [
      {
        id: "img-seed-001",
        orderId: "IMG-202610-001",
        appointmentId: initialAppointment.id,
        patientUhid: "IND-UHID-000101",
        patientName: "Murugan Selvam",
        doctorId: "dr-rajesh-rangaswamy",
        doctorName: "Dr. Rajesh Rangaswamy",
        modality: "1.5T_MRI",
        studyName: "Brain MRI + MR Angiography (Stroke Protocol)",
        preparationInstructions: "Remove all metal objects and jewelry. Fast 2 hours prior.",
        status: "REPORT_VERIFIED",
        reportSummary: "Acute ischemic infarct noted in the left MCA territory. MR Angiogram demonstrates proximal M1 stenosis. Verified and released for clinical correlation.",
        radiologistName: "Dr. K. Swaminathan (Lead Radiologist)",
        verifiedAt: new Date().toISOString(),
        isReportReleased: true,
        createdAt: new Date().toISOString(),
      },
    ];

    // Enterprise Pharmacy Catalog & Inventory
    const initialPharmacyInventory: PharmacyInventoryItem[] = [
      {
        id: "med-001",
        itemCode: "MED-001",
        medicineName: "Aspirin 75mg Gastro-Resistant",
        genericName: "Acetylsalicylic Acid",
        category: "Tablet",
        strength: "75mg",
        currentStock: 1200,
        reorderLevel: 200,
        unitPrice: 1.5,
        mrp: 2.0,
        batches: [
          { id: "b-01", batchNumber: "ASP-26A", expiryDate: "2027-12-31", quantity: 1200, purchaseRate: 1.1, mrp: 2.0 },
        ],
      },
      {
        id: "med-002",
        itemCode: "MED-002",
        medicineName: "Atorvastatin 20mg",
        genericName: "Atorvastatin Calcium",
        category: "Tablet",
        strength: "20mg",
        currentStock: 850,
        reorderLevel: 150,
        unitPrice: 8.5,
        mrp: 12.0,
        batches: [
          { id: "b-02", batchNumber: "ATV-26D", expiryDate: "2028-06-30", quantity: 850, purchaseRate: 6.5, mrp: 12.0 },
        ],
      },
      {
        id: "med-003",
        itemCode: "MED-003",
        medicineName: "Ceftriaxone 1g Injection",
        genericName: "Ceftriaxone Sodium",
        category: "Injection",
        strength: "1g",
        currentStock: 420,
        reorderLevel: 80,
        unitPrice: 45.0,
        mrp: 65.0,
        batches: [
          { id: "b-03", batchNumber: "CFX-25H", expiryDate: "2027-08-31", quantity: 420, purchaseRate: 35.0, mrp: 65.0 },
        ],
      },
      {
        id: "med-004",
        itemCode: "MED-004",
        medicineName: "Pantoprazole 40mg IV",
        genericName: "Pantoprazole Sodium",
        category: "Injection",
        strength: "40mg",
        currentStock: 530,
        reorderLevel: 100,
        unitPrice: 38.0,
        mrp: 54.0,
        batches: [
          { id: "b-04", batchNumber: "PAN-26C", expiryDate: "2028-01-31", quantity: 530, purchaseRate: 28.0, mrp: 54.0 },
        ],
      },
      {
        id: "med-005",
        itemCode: "MED-005",
        medicineName: "Normal Saline 0.9% IV Infusion 500ml",
        genericName: "Sodium Chloride 0.9% w/v",
        category: "IV Fluid",
        strength: "500ml",
        currentStock: 640,
        reorderLevel: 120,
        unitPrice: 28.0,
        mrp: 42.0,
        batches: [
          { id: "b-05", batchNumber: "NS-26E", expiryDate: "2028-09-30", quantity: 640, purchaseRate: 20.0, mrp: 42.0 },
        ],
      },
    ];

    // Enterprise Housekeeping Tasks
    const initialHousekeepingTasks: HousekeepingTask[] = [
      {
        id: "hk-001",
        taskNumber: "HK-1001",
        locationType: "BED",
        locationId: "BED-NICU-03",
        description: "Terminal disinfection and linen sanitization following patient discharge.",
        priority: "HIGH",
        status: "IN_PROGRESS",
        assignedStaffName: "R. Murugesh (Housekeeping Lead)",
        requestedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      },
      {
        id: "hk-002",
        taskNumber: "HK-1002",
        locationType: "EMERGENCY",
        locationId: "Emergency Trauma Bay 2",
        description: "Biohazard clearance and floor antiseptic spray routine.",
        priority: "URGENT",
        status: "PENDING",
        requestedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
    ];

    // Enterprise Maintenance Tickets
    const initialMaintenanceTickets: MaintenanceTicket[] = [
      {
        id: "mnt-001",
        ticketNumber: "MNT-202610-001",
        equipmentName: "1.5T MRI Cryogen Chiller Unit",
        department: "Radiology & Imaging",
        issueDescription: "Helium pressure gauge calibration and secondary chiller cycle inspection.",
        priority: "HIGH",
        status: "IN_PROGRESS",
        reportedBy: "Dr. K. Swaminathan",
        assignedTo: "Biomedical Team Alpha",
        downtimeReported: false,
        createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      },
      {
        id: "mnt-002",
        ticketNumber: "MNT-202610-002",
        equipmentName: "Bed CTS-02 Oxygen Wall Regulator",
        department: "Cardiothoracic Stepdown Ward",
        issueDescription: "Low-flow sensor alert on central medical gas pipeline regulator.",
        priority: "CRITICAL",
        status: "OPEN",
        reportedBy: "Nurse Sister Priya",
        assignedTo: "Bio-Med & Facilities",
        downtimeReported: true,
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
    ];

    // Enterprise Caregiver Consents
    const initialCaregiverConsents: CaregiverConsent[] = [
      {
        id: "cgc-seed-001",
        consentId: "CGC-202610-001",
        patientUhid: "IND-UHID-000101",
        patientName: "Murugan Selvam",
        caregiverName: "Selvamani Murugan",
        caregiverPhone: "+91 94432 11224",
        caregiverEmail: "selvamani@example.com",
        relationship: "Spouse",
        accessScope: "FULL_CARE",
        status: "ACTIVE",
        validUntil: new Date(Date.now() + 365 * 86400000).toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];

    const initialPastAppointment: AppointmentRecord = {
      id: "apt-seed-002",
      appointmentId: "IND-APT-100000",
      referenceCode: "ISH-441029",
      verificationToken: "tok_secure_441029_seed",
      patientId: initialPatient.id,
      patientUhid: initialPatient.uhid,
      patientName: initialPatient.fullName,
      patientPhone: initialPatient.phone,
      patientEmail: initialPatient.email,
      patientAge: initialPatient.age,
      patientGender: initialPatient.gender,
      serviceType: "doctor",
      targetId: "dr-rajesh-rangaswamy",
      targetName: "Neurovascular & Stroke Consultation",
      doctorId: "dr-rajesh-rangaswamy",
      doctorName: "Dr. Rajesh Rangaswamy",
      departmentId: "neuro-stroke",
      departmentName: "Neurovascular & Stroke Care",
      appointmentDate: new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0],
      timeSlot: "11:00 AM",
      tokenNumber: "T-012",
      status: "COMPLETED",
      paymentStatus: "paid_online",
      notes: "Follow-up checkup post cerebral arterial Doppler scan.",
      checkInTime: new Date(Date.now() - 14 * 86400000).toISOString(),
      qrVerified: true,
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    };

    const initialEncounter: PatientEncounter = {
      id: "enc-seed-001",
      encounterId: "ENC-202610-1001",
      appointmentId: initialPastAppointment.id,
      patientId: initialPatient.id,
      patientUhid: initialPatient.uhid,
      doctorId: "dr-rajesh-rangaswamy",
      doctorName: "Dr. Rajesh Rangaswamy",
      chiefComplaint: "Transient ischemic episode, numbness in right arm",
      vitals: {
        bloodPressure: "130/85",
        pulseRate: 76,
        oxygenSaturation: 98,
        temperature: 98.4,
      },
      clinicalFindings: "Mild right-sided sensory deficit. Normal cranial nerves, carotid bruit absent.",
      diagnosis: "Transient Ischemic Attack (TIA) / Pre-stroke Hemodynamic Evaluation",
      treatmentPlan: "Prescribed secondary stroke prophylaxis. Ordered lipid profile and glycemic status.",
      followUpDays: 14,
      followUpDate: today,
      status: "completed",
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    };

    const initialPrescription: PrescriptionRecord = {
      id: "rx-seed-001",
      prescriptionId: "RX-10042",
      encounterId: initialEncounter.id,
      appointmentId: initialPastAppointment.id,
      patientId: initialPatient.id,
      patientUhid: initialPatient.uhid,
      patientName: initialPatient.fullName,
      doctorId: "dr-rajesh-rangaswamy",
      doctorName: "Dr. Rajesh Rangaswamy",
      medications: [
        {
          id: "med-seed-1",
          medicineName: "Atorvastatin 20mg",
          dosage: "1 Tab",
          frequency: "0-0-1 (Night After Food)",
          durationDays: 30,
          instructions: "Take with water after dinner",
        },
        {
          id: "med-seed-2",
          medicineName: "Aspirin 75mg Gastro-resistant",
          dosage: "1 Tab",
          frequency: "1-0-0 (Morning After Food)",
          durationDays: 30,
          instructions: "Do not chew or crush",
        },
        {
          id: "med-seed-3",
          medicineName: "Pantoprazole 40mg",
          dosage: "1 Tab",
          frequency: "1-0-0 (Morning Before Food)",
          durationDays: 14,
          instructions: "Take 30 minutes before breakfast",
        },
      ],
      instructions: "Continue stroke prophylaxis medications regularly. Report any chest pain or severe dizziness immediately.",
      status: "dispensed",
      dispensedBy: "Selvaraj Mani (Chief Pharmacist)",
      dispensedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    };

    const initialLabOrder: LabOrderRecord = {
      id: "lab-seed-001",
      orderId: "LAB-4091",
      testCode: "LIPID-EXT",
      testName: "Complete Lipid Profile & Fasting Blood Glucose",
      sampleType: "Blood (Serum/Plasma)",
      appointmentId: initialPastAppointment.id,
      encounterId: initialEncounter.id,
      patientId: initialPatient.id,
      patientUhid: initialPatient.uhid,
      patientName: initialPatient.fullName,
      doctorId: "dr-rajesh-rangaswamy",
      doctorName: "Dr. Rajesh Rangaswamy",
      sampleStatus: "completed",
      collectedAt: new Date(Date.now() - 13 * 86400000).toISOString(),
      collectedBy: "Karthik Subramanian (Lab Tech)",
      reportUrl: "/reports/lab-4091.pdf",
      reportSummary: "Total Cholesterol: 218 mg/dL (Borderline High), LDL: 132 mg/dL, HDL: 44 mg/dL, Triglycerides: 165 mg/dL. Fasting Blood Glucose: 104 mg/dL. Renal indices within normal limits.",
      isReportReleased: true,
      releasedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      verifiedBy: "Dr. Anita Chandrasekhar (MD Pathology)",
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    };

    const initialInvoice: BillingInvoice = {
      id: "inv-seed-001",
      invoiceId: "INV-80210",
      patientId: initialPatient.id,
      patientUhid: initialPatient.uhid,
      patientName: initialPatient.fullName,
      appointmentId: initialPastAppointment.id,
      items: [
        { id: "bi-1", description: "Neurovascular Specialist OPD Consultation", quantity: 1, unitPrice: 800, total: 800, category: "consultation" },
        { id: "bi-2", description: "Comprehensive Lipid Profile & Glucose Panel", quantity: 1, unitPrice: 1200, total: 1200, category: "lab" },
        { id: "bi-3", description: "Pharmacy Dispense (Atorvastatin, Aspirin, Pantoprazole)", quantity: 1, unitPrice: 650, total: 650, category: "pharmacy" },
      ],
      subtotal: 2650,
      tax: 0,
      discount: 0,
      totalAmount: 2650,
      paymentStatus: "paid",
      paymentMethod: "upi",
      paidAmount: 2650,
      paidAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      receiptNumber: "RCP-202610-8812",
      transactionRef: "UPI-IND-994821034",
      generatedBy: "Deepa Raman (Billing Staff)",
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    };

    global.__ISH_HMS_REGISTRY__ = {
      patients: [initialPatient],
      appointments: [initialAppointment, initialPastAppointment],
      queues: [initialQueue],
      encounters: [initialEncounter],
      prescriptions: [initialPrescription],
      labOrders: [initialLabOrder],
      invoices: [initialInvoice],
      nurseTasks: [],
      notifications: [
        {
          id: "notif-001",
          userId: "pat-seed-001",
          targetRole: "PATIENT",
          title: "Appointment Confirmed",
          message: "Your appointment IND-APT-100001 with Dr. Saravanan Subramanian is scheduled for today at 10:30 AM (Room 204).",
          type: "info",
          isRead: false,
          linkUrl: "/patient/appointments",
          createdAt: new Date().toISOString(),
        },
        {
          id: "notif-002",
          userId: "pat-seed-001",
          targetRole: "PATIENT",
          title: "Lab Report Verified",
          message: "Your Comprehensive Metabolic & Lipid Profile (LAB-8001) has been verified by the Chief Pathologist and released.",
          type: "success",
          isRead: false,
          linkUrl: "/patient/lab-reports",
          createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
        },
        {
          id: "notif-003",
          userId: "pat-seed-001",
          targetRole: "PATIENT",
          title: "Prescription Dispensed",
          message: "Prescription RX-10042 has been verified and dispensed at Central Pharmacy Counter #2.",
          type: "success",
          isRead: true,
          linkUrl: "/patient/pharmacy",
          createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        },
        {
          id: "notif-004",
          userId: "all",
          title: "Hospital Health Advisory",
          message: "Free Cardiac Risk Screening Camp organized this Saturday at IndoStates Wellness Pavillion, Block A.",
          type: "info",
          isRead: false,
          linkUrl: "/patient/packages",
          createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        },
      ],
      auditLogs: [initialAudit],
      dailyTokenSequence: 1,
      wards: initialWards,
      rooms: initialRooms,
      beds: initialBeds,
      admissions: initialAdmissions,
      emergencyCases: initialEmergencyCases,
      ambulances: initialAmbulances,
      ambulanceRequests: initialAmbulanceRequests,
      imagingOrders: initialImagingOrders,
      pharmacyInventory: initialPharmacyInventory,
      housekeepingTasks: initialHousekeepingTasks,
      maintenanceTickets: initialMaintenanceTickets,
      caregiverConsents: initialCaregiverConsents,
    };
  }
  return global.__ISH_HMS_REGISTRY__;
}

// 4. HMS SERVICE METHODS
export const HMSService = {
  // --- AUDIT LOGGING ---
  recordAuditLog(
    actorId: string,
    actorName: string,
    actorRole: UserRole,
    action: string,
    resource: string,
    details: Record<string, any> = {},
    status: "success" | "failure" = "success"
  ): AuditLogRecord {
    const reg = getHMSRegistry();
    const log: AuditLogRecord = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actorId,
      actorName,
      actorRole,
      action,
      resource,
      details,
      status,
      createdAt: new Date().toISOString(),
    };
    reg.auditLogs.unshift(log);

    // Sync to Supabase if available
    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          Promise.resolve(
            admin.from("audit_logs").insert({
              actor_id: actorId,
              actor_name: actorName,
              actor_role: actorRole,
              action,
              resource,
              details,
              status,
            })
          ).catch((err: unknown) => console.warn("Supabase audit log insert notice:", err));
        }
      } catch (err) {
        console.warn("Audit log sync notice:", err);
      }
    }

    return log;
  },

  getAuditLogs(): AuditLogRecord[] {
    return getHMSRegistry().auditLogs;
  },

  // --- PATIENTS ---
  getPatients(query?: string): PatientProfile[] {
    const reg = getHMSRegistry();
    if (!query) return reg.patients;
    const q = query.toLowerCase().trim();
    return reg.patients.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.uhid.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
    );
  },

  getPatientById(id: string): PatientProfile | undefined {
    return getHMSRegistry().patients.find((p) => p.id === id || p.uhid === id);
  },

  getPatientByUhid(uhid: string): PatientProfile | undefined {
    return getHMSRegistry().patients.find((p) => p.uhid.toUpperCase() === uhid.toUpperCase());
  },

  createPatient(data: Omit<PatientProfile, "id" | "uhid" | "createdAt" | "updatedAt">): PatientProfile {
    const reg = getHMSRegistry();
    const existing = reg.patients.find(
      (p) => p.phone === data.phone || (data.email && p.email.toLowerCase() === data.email.toLowerCase())
    );
    if (existing) return existing;

    const uhid = generateUHID();
    const patient: PatientProfile = {
      ...data,
      id: `pat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      uhid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    reg.patients.unshift(patient);

    if (isSupabaseConfigured()) {
      try {
        const admin = getSupabaseAdmin();
        if (admin) {
          Promise.resolve(
            admin.from("patients").insert({
              uhid: patient.uhid,
              user_id: patient.userId || null,
              full_name: patient.fullName,
              email: patient.email,
              phone: patient.phone,
              age: patient.age,
              gender: patient.gender,
              address: patient.address,
              blood_group: patient.bloodGroup,
              emergency_contact_name: patient.emergencyContactName,
              emergency_contact_phone: patient.emergencyContactPhone,
              emergency_contact_relation: patient.emergencyContactRelation,
            })
          ).catch((err: unknown) => console.warn("Supabase patient insert notice:", err));
        }
      } catch (err) {
        console.warn("Patient sync notice:", err);
      }
    }

    return patient;
  },

  // --- APPOINTMENTS ---
  getAppointments(filters?: {
    doctorId?: string;
    patientId?: string;
    status?: AppointmentStatus | "all";
    date?: string;
  }): AppointmentRecord[] {
    let list = getHMSRegistry().appointments;
    if (!filters) return list;

    if (filters.doctorId) {
      list = list.filter((a) => a.doctorId === filters.doctorId || a.targetId === filters.doctorId);
    }
    if (filters.patientId) {
      const reg = getHMSRegistry();
      const pat = reg.patients.find(
        (p) =>
          p.id === filters.patientId ||
          p.uhid.toUpperCase() === filters.patientId?.toUpperCase() ||
          p.email.toLowerCase() === filters.patientId?.toLowerCase()
      );
      const targetUhid = pat ? pat.uhid.toUpperCase() : filters.patientId.toUpperCase();
      const targetId = pat ? pat.id : filters.patientId;
      list = list.filter(
        (a) =>
          a.patientId === targetId ||
          a.patientUhid?.toUpperCase() === targetUhid ||
          a.patientId?.toUpperCase() === targetUhid ||
          (pat && a.patientEmail?.toLowerCase() === pat.email.toLowerCase())
      );
    }
    if (filters.status && filters.status !== "all") {
      list = list.filter((a) => a.status === filters.status);
    }
    if (filters.date) {
      list = list.filter((a) => a.appointmentDate === filters.date);
    }
    return list;
  },

  getAppointmentById(idOrRef: string): AppointmentRecord | undefined {
    const list = getHMSRegistry().appointments;
    const found = list.find(
      (a) =>
        a.id === idOrRef ||
        a.appointmentId === idOrRef ||
        a.referenceCode.toUpperCase() === idOrRef.toUpperCase() ||
        a.verificationToken === idOrRef
    );
    if (found) return found;

    // Check global fallback and sync
    const globalList = (global as any).__ISH_APPOINTMENTS__ || [];
    const gFound = globalList.find(
      (a: any) =>
        a.id === idOrRef ||
        a.appointmentId === idOrRef ||
        a.referenceCode?.toUpperCase() === idOrRef.toUpperCase() ||
        a.verificationToken === idOrRef
    );
    if (gFound) {
      const converted: AppointmentRecord = {
        id: gFound.id,
        appointmentId: gFound.appointmentId || gFound.id,
        referenceCode: gFound.referenceCode,
        verificationToken: gFound.verificationToken,
        patientId: gFound.patientId || gFound.patientUhid || "PAT-GUEST",
        patientUhid: gFound.patientUhid || "IND-UHID-000000",
        patientName: gFound.patientName,
        patientPhone: gFound.patientPhone,
        patientEmail: gFound.patientEmail,
        patientAge: gFound.patientAge || 30,
        patientGender: gFound.patientGender || "Other",
        serviceType: gFound.serviceType || "consultation",
        targetId: gFound.targetId || "general",
        targetName: gFound.targetName || "Clinical Consultation",
        doctorId: gFound.doctorId,
        doctorName: gFound.doctorName,
        departmentId: gFound.departmentId || "general",
        appointmentDate: gFound.date || gFound.appointmentDate,
        timeSlot: gFound.timeSlot,
        status: gFound.status || "CONFIRMED",
        paymentStatus: gFound.paymentStatus || "pay_on_arrival",
        qrVerified: Boolean(gFound.qrVerified),
        createdAt: gFound.createdAt || new Date().toISOString(),
        updatedAt: gFound.updatedAt || new Date().toISOString(),
      };
      list.unshift(converted);
      return converted;
    }
    return undefined;
  },

  createAppointment(
    data: Partial<AppointmentRecord> & {
      patientUhid: string;
      patientName: string;
      appointmentDate: string;
      timeSlot: string;
    }
  ): AppointmentRecord {
    const reg = getHMSRegistry();
    const appointmentId = data.appointmentId || generateAppointmentId();
    const referenceCode = data.referenceCode || `ISH-${Math.floor(100000 + Math.random() * 900000)}`;
    const verificationToken = data.verificationToken || `tok_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;

    const appt: AppointmentRecord = {
      id: data.id || `apt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      appointmentId,
      referenceCode,
      verificationToken,
      patientId: data.patientId || data.patientUhid,
      patientUhid: data.patientUhid,
      patientName: data.patientName,
      patientPhone: data.patientPhone || "+91 94432 11223",
      patientEmail: data.patientEmail || "patient@indostates.com",
      patientAge: data.patientAge || 45,
      patientGender: data.patientGender || "Male",
      serviceType: data.serviceType || "consultation",
      targetId: data.targetId || "general",
      targetName: data.targetName || "Clinical Consultation",
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      departmentId: data.departmentId || "general",
      departmentName: data.departmentName,
      appointmentDate: data.appointmentDate,
      timeSlot: data.timeSlot,
      tokenNumber: data.tokenNumber,
      status: data.status || "CONFIRMED",
      paymentStatus: data.paymentStatus || "pay_on_arrival",
      notes: data.notes,
      qrVerified: Boolean(data.qrVerified),
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    reg.appointments.unshift(appt);

    this.recordAuditLog(
      appt.patientId,
      appt.patientName,
      "PATIENT",
      "appointment.create",
      `appointments/${appointmentId}`,
      { appointmentId, date: appt.appointmentDate, timeSlot: appt.timeSlot, targetName: appt.targetName }
    );

    return appt;
  },

  transitionAppointmentStatus(
    idOrRef: string,
    newStatus: AppointmentStatus,
    actor: { id: string; name: string; role: UserRole }
  ): { success: boolean; appointment?: AppointmentRecord; error?: string } {
    const appt = this.getAppointmentById(idOrRef);
    if (!appt) {
      return { success: false, error: "Appointment record not found." };
    }

    if (!canTransitionStatus(appt.status, newStatus)) {
      return {
        success: false,
        error: `Invalid status transition from ${appt.status} to ${newStatus}.`,
      };
    }

    const previousStatus = appt.status;
    appt.status = newStatus;
    appt.updatedAt = new Date().toISOString();

    if (newStatus === "CANCELLED") {
      appt.cancelledAt = new Date().toISOString();
    }

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "appointment.update_status",
      `appointments/${appt.appointmentId}`,
      { from: previousStatus, to: newStatus }
    );

    return { success: true, appointment: appt };
  },

  // --- RECEPTION CHECK-IN & QUEUE ---
  checkInAppointment(
    idOrRef: string,
    actor: { id: string; name: string; role: UserRole }
  ): { success: boolean; queueEntry?: QueueEntry; appointment?: AppointmentRecord; error?: string } {
    const reg = getHMSRegistry();
    const appt = this.getAppointmentById(idOrRef);
    if (!appt) {
      return { success: false, error: "Appointment record not found." };
    }

    if (appt.status === "CANCELLED") {
      return { success: false, error: "Cannot check in a cancelled appointment." };
    }

    reg.dailyTokenSequence += 1;
    const token = generateTokenNumber(reg.dailyTokenSequence);

    appt.status = "WAITING";
    appt.tokenNumber = token;
    appt.checkInTime = new Date().toISOString();
    appt.qrVerified = true;
    appt.updatedAt = new Date().toISOString();

    const queueEntry: QueueEntry = {
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      appointmentId: appt.id,
      patientId: appt.patientId,
      patientName: appt.patientName,
      patientUhid: appt.patientUhid,
      doctorId: appt.doctorId,
      doctorName: appt.doctorName,
      departmentId: appt.departmentId,
      tokenNumber: token,
      status: "waiting",
      checkInTime: appt.checkInTime,
      priority: "normal",
    };

    reg.queues.unshift(queueEntry);

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "appointment.checkin",
      `appointments/${appt.appointmentId}`,
      { tokenNumber: token, appointmentId: appt.appointmentId }
    );

    return { success: true, queueEntry, appointment: appt };
  },

  getQueues(doctorId?: string): QueueEntry[] {
    const list = getHMSRegistry().queues;
    if (!doctorId) return list;
    return list.filter((q) => !q.doctorId || q.doctorId === doctorId);
  },

  callQueueToken(queueId: string, actor: { id: string; name: string; role: UserRole }): QueueEntry | undefined {
    const reg = getHMSRegistry();
    const entry = reg.queues.find((q) => q.id === queueId || q.tokenNumber === queueId);
    if (!entry) return undefined;

    entry.status = "called";
    entry.calledTime = new Date().toISOString();

    const appt = reg.appointments.find((a) => a.id === entry.appointmentId);
    if (appt) {
      appt.status = "CALLED";
      appt.updatedAt = new Date().toISOString();
    }

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "queue.call_token",
      `queues/${entry.tokenNumber}`,
      { tokenNumber: entry.tokenNumber }
    );

    return entry;
  },

  startConsultationToken(
    queueId: string,
    actor: { id: string; name: string; role: UserRole }
  ): QueueEntry | undefined {
    const reg = getHMSRegistry();
    const entry = reg.queues.find((q) => q.id === queueId || q.tokenNumber === queueId);
    if (!entry) return undefined;

    entry.status = "in_consultation";

    const appt = reg.appointments.find((a) => a.id === entry.appointmentId);
    if (appt) {
      appt.status = "IN_CONSULTATION";
      appt.updatedAt = new Date().toISOString();
    }

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "queue.start_consultation",
      `queues/${entry.tokenNumber}`,
      { tokenNumber: entry.tokenNumber }
    );

    return entry;
  },

  completeQueueToken(
    queueId: string,
    actor: { id: string; name: string; role: UserRole }
  ): QueueEntry | undefined {
    const reg = getHMSRegistry();
    const entry = reg.queues.find((q) => q.id === queueId || q.tokenNumber === queueId);
    if (!entry) return undefined;

    entry.status = "completed";

    const appt = reg.appointments.find((a) => a.id === entry.appointmentId);
    if (appt && appt.status !== "CANCELLED") {
      appt.status = "CONSULTATION_COMPLETED";
      appt.updatedAt = new Date().toISOString();
    }

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "queue.complete_token",
      `queues/${entry.tokenNumber}`,
      { tokenNumber: entry.tokenNumber }
    );

    return entry;
  },

  // --- CLINICAL ENCOUNTERS ---
  createEncounter(
    data: Omit<PatientEncounter, "id" | "encounterId" | "createdAt">,
    actor: { id: string; name: string; role: UserRole }
  ): PatientEncounter {
    const reg = getHMSRegistry();
    const encounter: PatientEncounter = {
      ...data,
      id: `enc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      encounterId: generateEncounterId(),
      createdAt: new Date().toISOString(),
    };

    reg.encounters.unshift(encounter);

    // Update appointment status to IN_CONSULTATION or CONSULTATION_COMPLETED
    const appt = reg.appointments.find((a) => a.id === data.appointmentId);
    if (appt) {
      appt.status = data.status === "completed" ? "CONSULTATION_COMPLETED" : "IN_CONSULTATION";
      appt.updatedAt = new Date().toISOString();
    }

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "clinical.create_encounter",
      `encounters/${encounter.encounterId}`,
      { encounterId: encounter.encounterId, patientId: data.patientId }
    );

    return encounter;
  },

  getEncounters(patientId?: string): PatientEncounter[] {
    const list = getHMSRegistry().encounters;
    if (!patientId) return list;
    const reg = getHMSRegistry();
    const pat = reg.patients.find(
      (p) =>
        p.id === patientId ||
        p.uhid.toUpperCase() === patientId.toUpperCase() ||
        p.email.toLowerCase() === patientId.toLowerCase()
    );
    const targetUhid = pat ? pat.uhid.toUpperCase() : patientId.toUpperCase();
    const targetId = pat ? pat.id : patientId;
    return list.filter(
      (e) =>
        e.patientId === targetId ||
        e.patientId === targetUhid ||
        e.patientUhid?.toUpperCase() === targetUhid
    );
  },

  // --- PRESCRIPTIONS ---
  createPrescription(
    data: Omit<PrescriptionRecord, "id" | "prescriptionId" | "createdAt">,
    actor: { id: string; name: string; role: UserRole }
  ): PrescriptionRecord {
    const reg = getHMSRegistry();
    const pat = reg.patients.find(
      (p) => p.id === data.patientId || p.uhid.toUpperCase() === data.patientId.toUpperCase()
    );
    const prescription: PrescriptionRecord = {
      ...data,
      patientUhid: data.patientUhid || pat?.uhid || data.patientId,
      id: `rx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      prescriptionId: generatePrescriptionId(),
      createdAt: new Date().toISOString(),
    };

    reg.prescriptions.unshift(prescription);

    // Update appointment status to PHARMACY_PENDING if applicable
    const appt = reg.appointments.find((a) => a.id === data.appointmentId);
    if (appt && appt.status !== "COMPLETED") {
      appt.status = "PHARMACY_PENDING";
      appt.updatedAt = new Date().toISOString();
    }

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "prescription.create",
      `prescriptions/${prescription.prescriptionId}`,
      { prescriptionId: prescription.prescriptionId, patientId: data.patientId }
    );

    return prescription;
  },

  getPrescriptions(patientId?: string): PrescriptionRecord[] {
    const list = getHMSRegistry().prescriptions;
    if (!patientId) return list;
    const reg = getHMSRegistry();
    const pat = reg.patients.find(
      (p) =>
        p.id === patientId ||
        p.uhid.toUpperCase() === patientId.toUpperCase() ||
        p.email.toLowerCase() === patientId.toLowerCase()
    );
    const targetUhid = pat ? pat.uhid.toUpperCase() : patientId.toUpperCase();
    const targetId = pat ? pat.id : patientId;
    return list.filter(
      (r) =>
        r.patientId === targetId ||
        r.patientId === targetUhid ||
        r.patientUhid?.toUpperCase() === targetUhid
    );
  },

  dispensePrescription(
    id: string,
    pharmacistName: string,
    actor: { id: string; name: string; role: UserRole }
  ): PrescriptionRecord | undefined {
    const reg = getHMSRegistry();
    const target = reg.prescriptions.find((p) => p.id === id || p.prescriptionId === id);
    if (!target) return undefined;

    target.status = "dispensed";
    target.dispensedBy = pharmacistName;
    target.dispensedAt = new Date().toISOString();

    const appt = reg.appointments.find((a) => a.id === target.appointmentId);
    if (appt && appt.status === "PHARMACY_PENDING") {
      appt.status = "PHARMACY_COMPLETED";
      appt.updatedAt = new Date().toISOString();
    }

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "prescription.dispense",
      `prescriptions/${target.prescriptionId}`,
      { prescriptionId: target.prescriptionId }
    );

    return target;
  },

  // --- LAB ORDERS & REPORTS ---
  createLabOrder(
    data: Omit<LabOrderRecord, "id" | "orderId" | "createdAt">,
    actor: { id: string; name: string; role: UserRole }
  ): LabOrderRecord {
    const reg = getHMSRegistry();
    const pat = reg.patients.find(
      (p) => p.id === data.patientId || p.uhid.toUpperCase() === data.patientId.toUpperCase()
    );
    const order: LabOrderRecord = {
      ...data,
      patientUhid: data.patientUhid || pat?.uhid || data.patientId,
      id: `lab-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      orderId: generateLabOrderId(),
      createdAt: new Date().toISOString(),
    };

    reg.labOrders.unshift(order);

    const appt = reg.appointments.find((a) => a.id === data.appointmentId);
    if (appt && appt.status !== "COMPLETED") {
      appt.status = "LAB_PENDING";
      appt.updatedAt = new Date().toISOString();
    }

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "lab.create_order",
      `lab/${order.orderId}`,
      { orderId: order.orderId, testName: order.testName }
    );

    return order;
  },

  getLabOrders(patientId?: string): LabOrderRecord[] {
    const list = getHMSRegistry().labOrders;
    if (!patientId) return list;
    const reg = getHMSRegistry();
    const pat = reg.patients.find(
      (p) =>
        p.id === patientId ||
        p.uhid.toUpperCase() === patientId.toUpperCase() ||
        p.email.toLowerCase() === patientId.toLowerCase()
    );
    const targetUhid = pat ? pat.uhid.toUpperCase() : patientId.toUpperCase();
    const targetId = pat ? pat.id : patientId;
    return list.filter(
      (l) =>
        l.patientId === targetId ||
        l.patientId === targetUhid ||
        l.patientUhid?.toUpperCase() === targetUhid
    );
  },

  updateLabOrderStatus(
    orderId: string,
    sampleStatus: "ordered" | "collected" | "processing" | "completed",
    actor: { id: string; name: string; role: UserRole }
  ): LabOrderRecord | undefined {
    const reg = getHMSRegistry();
    const target = reg.labOrders.find((l) => l.id === orderId || l.orderId === orderId);
    if (!target) return undefined;

    target.sampleStatus = sampleStatus;
    if (sampleStatus === "collected") {
      target.collectedAt = new Date().toISOString();
      target.collectedBy = actor.name;
    }

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "lab.update_status",
      `lab/${target.orderId}`,
      { orderId: target.orderId, sampleStatus }
    );

    return target;
  },

  releaseLabReport(
    orderId: string,
    reportUrl: string,
    reportSummary: string,
    verifiedBy: string,
    actor: { id: string; name: string; role: UserRole }
  ): LabOrderRecord | undefined {
    const reg = getHMSRegistry();
    const target = reg.labOrders.find((l) => l.id === orderId || l.orderId === orderId);
    if (!target) return undefined;

    target.sampleStatus = "completed";
    target.reportUrl = reportUrl;
    target.reportSummary = reportSummary;
    target.isReportReleased = true;
    target.releasedAt = new Date().toISOString();
    target.verifiedBy = verifiedBy;

    const appt = reg.appointments.find((a) => a.id === target.appointmentId);
    if (appt && appt.status === "LAB_PENDING") {
      appt.status = "LAB_COMPLETED";
      appt.updatedAt = new Date().toISOString();
    }

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "lab.release_report",
      `lab/${target.orderId}`,
      { orderId: target.orderId, verifiedBy }
    );

    return target;
  },

  // --- BILLING & INVOICES ---
  createInvoice(
    data: Omit<BillingInvoice, "id" | "invoiceId" | "createdAt">,
    actor: { id: string; name: string; role: UserRole }
  ): BillingInvoice {
    const reg = getHMSRegistry();
    const pat = reg.patients.find(
      (p) => p.id === data.patientId || p.uhid.toUpperCase() === data.patientId.toUpperCase()
    );
    const invoice: BillingInvoice = {
      ...data,
      patientUhid: data.patientUhid || pat?.uhid || data.patientId,
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      invoiceId: generateInvoiceId(),
      createdAt: new Date().toISOString(),
    };

    reg.invoices.unshift(invoice);

    const appt = reg.appointments.find((a) => a.id === data.appointmentId);
    if (appt && appt.status !== "COMPLETED") {
      appt.status = "BILLING_PENDING";
      appt.updatedAt = new Date().toISOString();
    }

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "billing.create_invoice",
      `billing/${invoice.invoiceId}`,
      { invoiceId: invoice.invoiceId, total: invoice.totalAmount }
    );

    return invoice;
  },

  getInvoices(patientId?: string): BillingInvoice[] {
    const list = getHMSRegistry().invoices;
    if (!patientId) return list;
    const reg = getHMSRegistry();
    const pat = reg.patients.find(
      (p) =>
        p.id === patientId ||
        p.uhid.toUpperCase() === patientId.toUpperCase() ||
        p.email.toLowerCase() === patientId.toLowerCase()
    );
    const targetUhid = pat ? pat.uhid.toUpperCase() : patientId.toUpperCase();
    const targetId = pat ? pat.id : patientId;
    return list.filter(
      (i) =>
        i.patientId === targetId ||
        i.patientUhid.toUpperCase() === targetUhid ||
        i.patientId === targetUhid
    );
  },

  recordInvoicePayment(
    invoiceId: string,
    paymentMethod: "cash" | "upi" | "card" | "insurance" | "online",
    transactionRef: string,
    actor: { id: string; name: string; role: UserRole }
  ): BillingInvoice | undefined {
    const reg = getHMSRegistry();
    const inv = reg.invoices.find((i) => i.id === invoiceId || i.invoiceId === invoiceId);
    if (!inv) return undefined;

    inv.paymentStatus = "paid";
    inv.paidAmount = inv.totalAmount;
    inv.paymentMethod = paymentMethod;
    inv.transactionRef = transactionRef;
    inv.receiptNumber = `RCP-${Math.floor(100000 + Math.random() * 900000)}`;
    inv.paidAt = new Date().toISOString();

    const appt = reg.appointments.find((a) => a.id === inv.appointmentId);
    if (appt) {
      appt.status = "PAYMENT_COMPLETED";
      appt.paymentStatus = "paid_online";
      appt.updatedAt = new Date().toISOString();
    }

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "billing.record_payment",
      `billing/${inv.invoiceId}`,
      { receiptNumber: inv.receiptNumber, amount: inv.paidAmount }
    );

    return inv;
  },

  // --- NURSE TASKS ---
  createNurseTask(
    data: Omit<NurseTaskRecord, "id" | "taskId" | "createdAt">,
    actor: { id: string; name: string; role: UserRole }
  ): NurseTaskRecord {
    const reg = getHMSRegistry();
    const task: NurseTaskRecord = {
      ...data,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      taskId: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };

    reg.nurseTasks.unshift(task);

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "nurse.create_task",
      `nurse/${task.taskId}`,
      { taskId: task.taskId, type: task.taskType }
    );

    return task;
  },

  getNurseTasks(): NurseTaskRecord[] {
    return getHMSRegistry().nurseTasks;
  },

  completeNurseTask(
    taskId: string,
    notes: string,
    actor: { id: string; name: string; role: UserRole }
  ): NurseTaskRecord | undefined {
    const reg = getHMSRegistry();
    const task = reg.nurseTasks.find((t) => t.id === taskId || t.taskId === taskId);
    if (!task) return undefined;

    task.status = "completed";
    task.completedAt = new Date().toISOString();
    task.notes = notes;

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "nurse.complete_task",
      `nurse/${task.taskId}`,
      { taskId: task.taskId }
    );

    return task;
  },

  // --- WARDS & BEDS ---
  getWards(): WardRecord[] {
    return getHMSRegistry().wards;
  },

  getRooms(): RoomRecord[] {
    return getHMSRegistry().rooms;
  },

  getBeds(wardId?: string, status?: BedStatus): BedRecord[] {
    let list = getHMSRegistry().beds;
    if (wardId) list = list.filter((b) => b.wardId === wardId);
    if (status) list = list.filter((b) => b.status === status);
    return list;
  },

  allocateBed(
    bedId: string,
    patientUhid: string,
    patientName: string,
    admissionId: string,
    actor: { id: string; name: string; role: UserRole }
  ): BedRecord | undefined {
    const reg = getHMSRegistry();
    const bed = reg.beds.find((b) => b.id === bedId || b.bedNumber === bedId);
    if (!bed) return undefined;

    bed.status = "OCCUPIED";
    bed.currentPatientUhid = patientUhid;
    bed.currentPatientName = patientName;
    bed.currentAdmissionId = admissionId;
    bed.updatedAt = new Date().toISOString();

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "bed.allocate",
      `beds/${bed.bedNumber}`,
      { bedNumber: bed.bedNumber, patientUhid, admissionId }
    );

    return bed;
  },

  releaseBed(
    bedId: string,
    actor: { id: string; name: string; role: UserRole }
  ): BedRecord | undefined {
    const reg = getHMSRegistry();
    const bed = reg.beds.find((b) => b.id === bedId || b.bedNumber === bedId);
    if (!bed) return undefined;

    const prevPatient = bed.currentPatientUhid;
    bed.status = "CLEANING"; // Ready for housekeeping disinfection
    bed.currentPatientUhid = undefined;
    bed.currentPatientName = undefined;
    bed.currentAdmissionId = undefined;
    bed.updatedAt = new Date().toISOString();

    // Auto-create a housekeeping cleaning task
    this.createHousekeepingTask(
      {
        locationType: "BED",
        locationId: bed.bedNumber,
        description: `Disinfection and sanitization after discharge of patient (${prevPatient || "N/A"})`,
        priority: "HIGH",
      },
      actor
    );

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "bed.release",
      `beds/${bed.bedNumber}`,
      { bedNumber: bed.bedNumber, previousPatient: prevPatient }
    );

    return bed;
  },

  updateBedStatus(
    bedId: string,
    status: BedStatus,
    actor: { id: string; name: string; role: UserRole }
  ): BedRecord | undefined {
    const reg = getHMSRegistry();
    const bed = reg.beds.find((b) => b.id === bedId || b.bedNumber === bedId);
    if (!bed) return undefined;

    bed.status = status;
    if (status === "AVAILABLE") {
      bed.lastCleanedAt = new Date().toISOString();
    }
    bed.updatedAt = new Date().toISOString();

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "bed.update_status",
      `beds/${bed.bedNumber}`,
      { bedNumber: bed.bedNumber, newStatus: status }
    );

    return bed;
  },

  // --- INPATIENT ADMISSIONS (IPD) ---
  createAdmission(
    data: Omit<AdmissionRecord, "id" | "admissionNumber" | "status" | "createdAt">,
    actor: { id: string; name: string; role: UserRole }
  ): AdmissionRecord {
    const reg = getHMSRegistry();
    const admissionNumber = generateAdmissionId();
    const admission: AdmissionRecord = {
      ...data,
      id: `adm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      admissionNumber,
      status: "ADMITTED",
      createdAt: new Date().toISOString(),
    };

    reg.admissions.unshift(admission);

    // Auto-occupy bed
    this.allocateBed(data.bedId, data.patientUhid, data.patientName, admissionNumber, actor);

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "ipd.admit_patient",
      `admissions/${admissionNumber}`,
      { admissionNumber, patientUhid: data.patientUhid, bedNumber: data.bedNumber }
    );

    return admission;
  },

  dischargePatient(
    admissionId: string,
    summary: string,
    actor: { id: string; name: string; role: UserRole }
  ): AdmissionRecord | undefined {
    const reg = getHMSRegistry();
    const adm = reg.admissions.find((a) => a.id === admissionId || a.admissionNumber === admissionId);
    if (!adm) return undefined;

    adm.status = "DISCHARGED";
    adm.dischargeDate = new Date().toISOString();
    adm.dischargeSummary = summary;

    // Release bed to cleaning
    this.releaseBed(adm.bedId, actor);

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "ipd.discharge_patient",
      `admissions/${adm.admissionNumber}`,
      { admissionNumber: adm.admissionNumber, patientUhid: adm.patientUhid }
    );

    return adm;
  },

  getAdmissions(
    status?: "ADMITTED" | "DISCHARGED" | "TRANSFERRED",
    patientUhid?: string
  ): AdmissionRecord[] {
    let list = getHMSRegistry().admissions;
    if (status) list = list.filter((a) => a.status === status);
    if (patientUhid) list = list.filter((a) => a.patientUhid.toUpperCase() === patientUhid.toUpperCase());
    return list;
  },

  // --- EMERGENCY MANAGEMENT ---
  createEmergencyCase(
    data: Omit<EmergencyCase, "id" | "caseNumber" | "arrivedAt">,
    actor: { id: string; name: string; role: UserRole }
  ): EmergencyCase {
    const reg = getHMSRegistry();
    const caseNumber = generateEmergencyCaseId();
    const emg: EmergencyCase = {
      ...data,
      id: `emg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      caseNumber,
      arrivedAt: new Date().toISOString(),
    };

    reg.emergencyCases.unshift(emg);

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "emergency.triage_register",
      `emergency/${caseNumber}`,
      { caseNumber, priority: emg.triagePriority, complaint: emg.chiefComplaint }
    );

    return emg;
  },

  updateEmergencyCase(
    caseId: string,
    updates: Partial<EmergencyCase>,
    actor: { id: string; name: string; role: UserRole }
  ): EmergencyCase | undefined {
    const reg = getHMSRegistry();
    const target = reg.emergencyCases.find((e) => e.id === caseId || e.caseNumber === caseId);
    if (!target) return undefined;

    Object.assign(target, updates);

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "emergency.update_case",
      `emergency/${target.caseNumber}`,
      { caseNumber: target.caseNumber, status: target.status }
    );

    return target;
  },

  getEmergencyCases(status?: string): EmergencyCase[] {
    const list = getHMSRegistry().emergencyCases;
    if (!status) return list;
    return list.filter((e) => e.status === status);
  },

  // --- AMBULANCE FLEET & DISPATCH ---
  getAmbulances(): AmbulanceRecord[] {
    return getHMSRegistry().ambulances;
  },

  updateAmbulanceStatus(
    ambulanceId: string,
    status: AmbulanceRecord["status"],
    location: string,
    actor: { id: string; name: string; role: UserRole }
  ): AmbulanceRecord | undefined {
    const reg = getHMSRegistry();
    const amb = reg.ambulances.find((a) => a.id === ambulanceId || a.vehicleNumber === ambulanceId);
    if (!amb) return undefined;

    amb.status = status;
    amb.currentLocation = location;

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "ambulance.update_status",
      `ambulance/${amb.vehicleNumber}`,
      { vehicleNumber: amb.vehicleNumber, status, location }
    );

    return amb;
  },

  requestAmbulance(
    data: Omit<AmbulanceRequest, "id" | "requestNumber" | "status" | "requestedAt">,
    actor?: { id: string; name: string; role: UserRole }
  ): AmbulanceRequest {
    const reg = getHMSRegistry();
    const requestNumber = generateAmbulanceRequestId();
    const req: AmbulanceRequest = {
      ...data,
      id: `amb-req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      requestNumber,
      status: "REQUESTED",
      requestedAt: new Date().toISOString(),
    };

    reg.ambulanceRequests.unshift(req);

    if (actor) {
      this.recordAuditLog(
        actor.id,
        actor.name,
        actor.role,
        "ambulance.request",
        `ambulance_requests/${requestNumber}`,
        { requestNumber, priority: req.priority, pickup: req.pickupAddress }
      );
    }

    return req;
  },

  dispatchAmbulance(
    requestId: string,
    ambulanceId: string,
    actor: { id: string; name: string; role: UserRole }
  ): AmbulanceRequest | undefined {
    const reg = getHMSRegistry();
    const req = reg.ambulanceRequests.find((r) => r.id === requestId || r.requestNumber === requestId);
    const amb = reg.ambulances.find((a) => a.id === ambulanceId || a.vehicleNumber === ambulanceId);
    if (!req || !amb) return undefined;

    req.status = "DISPATCHED";
    req.ambulanceId = amb.id;
    req.vehicleNumber = amb.vehicleNumber;
    req.driverName = amb.driverName;
    req.driverPhone = amb.driverPhone;

    amb.status = "ASSIGNED";

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "ambulance.dispatch",
      `ambulance_requests/${req.requestNumber}`,
      { requestNumber: req.requestNumber, vehicleNumber: amb.vehicleNumber, driver: amb.driverName }
    );

    return req;
  },

  getAmbulanceRequests(): AmbulanceRequest[] {
    return getHMSRegistry().ambulanceRequests;
  },

  // --- IMAGING & RADIOLOGY ---
  createImagingOrder(
    data: Omit<ImagingOrderRecord, "id" | "orderId" | "status" | "isReportReleased" | "createdAt">,
    actor: { id: string; name: string; role: UserRole }
  ): ImagingOrderRecord {
    const reg = getHMSRegistry();
    const orderId = generateImagingOrderId();
    const order: ImagingOrderRecord = {
      ...data,
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      orderId,
      status: "SCHEDULED",
      isReportReleased: false,
      createdAt: new Date().toISOString(),
    };

    reg.imagingOrders.unshift(order);

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "imaging.order_study",
      `imaging/${orderId}`,
      { orderId, modality: order.modality, studyName: order.studyName, patientUhid: order.patientUhid }
    );

    return order;
  },

  verifyImagingReport(
    orderId: string,
    reportSummary: string,
    radiologistName: string,
    actor: { id: string; name: string; role: UserRole }
  ): ImagingOrderRecord | undefined {
    const reg = getHMSRegistry();
    const order = reg.imagingOrders.find((o) => o.id === orderId || o.orderId === orderId);
    if (!order) return undefined;

    order.reportSummary = reportSummary;
    order.radiologistName = radiologistName;
    order.verifiedAt = new Date().toISOString();
    order.status = "REPORT_VERIFIED";
    order.isReportReleased = true;

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "imaging.verify_release_report",
      `imaging/${order.orderId}`,
      { orderId: order.orderId, radiologistName }
    );

    return order;
  },

  getImagingOrders(patientUhid?: string): ImagingOrderRecord[] {
    const list = getHMSRegistry().imagingOrders;
    if (!patientUhid) return list;
    return list.filter((o) => o.patientUhid.toUpperCase() === patientUhid.toUpperCase());
  },

  // --- PHARMACY INVENTORY & STOCK ---
  getPharmacyInventory(): PharmacyInventoryItem[] {
    return getHMSRegistry().pharmacyInventory;
  },

  adjustPharmacyStock(
    itemCode: string,
    quantityChange: number,
    reason: string,
    actor: { id: string; name: string; role: UserRole }
  ): PharmacyInventoryItem | undefined {
    const reg = getHMSRegistry();
    const item = reg.pharmacyInventory.find((p) => p.itemCode === itemCode || p.id === itemCode);
    if (!item) return undefined;

    item.currentStock = Math.max(0, item.currentStock + quantityChange);

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "pharmacy.adjust_stock",
      `pharmacy/${item.itemCode}`,
      { itemCode: item.itemCode, quantityChange, newStock: item.currentStock, reason }
    );

    return item;
  },

  // --- HOUSEKEEPING TASKS ---
  createHousekeepingTask(
    data: Omit<HousekeepingTask, "id" | "taskNumber" | "status" | "requestedAt">,
    actor: { id: string; name: string; role: UserRole }
  ): HousekeepingTask {
    const reg = getHMSRegistry();
    const taskNumber = generateHousekeepingTaskId();
    const task: HousekeepingTask = {
      ...data,
      id: `hk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      taskNumber,
      status: "PENDING",
      requestedAt: new Date().toISOString(),
    };

    reg.housekeepingTasks.unshift(task);

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "housekeeping.create_task",
      `housekeeping/${taskNumber}`,
      { taskNumber, locationType: task.locationType, locationId: task.locationId }
    );

    return task;
  },

  updateHousekeepingStatus(
    taskId: string,
    status: HousekeepingTask["status"],
    actor: { id: string; name: string; role: UserRole }
  ): HousekeepingTask | undefined {
    const reg = getHMSRegistry();
    const task = reg.housekeepingTasks.find((t) => t.id === taskId || t.taskNumber === taskId);
    if (!task) return undefined;

    task.status = status;
    if (status === "COMPLETED") {
      task.completedAt = new Date().toISOString();

      // If location was a BED, automatically mark bed as AVAILABLE
      if (task.locationType === "BED") {
        const bed = reg.beds.find((b) => b.bedNumber === task.locationId || b.id === task.locationId);
        if (bed && bed.status === "CLEANING") {
          bed.status = "AVAILABLE";
          bed.lastCleanedAt = new Date().toISOString();
          bed.updatedAt = new Date().toISOString();
        }
      }
    }

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "housekeeping.update_status",
      `housekeeping/${task.taskNumber}`,
      { taskNumber: task.taskNumber, status }
    );

    return task;
  },

  getHousekeepingTasks(): HousekeepingTask[] {
    return getHMSRegistry().housekeepingTasks;
  },

  // --- MAINTENANCE TICKETS ---
  createMaintenanceTicket(
    data: Omit<MaintenanceTicket, "id" | "ticketNumber" | "status" | "createdAt">,
    actor: { id: string; name: string; role: UserRole }
  ): MaintenanceTicket {
    const reg = getHMSRegistry();
    const ticketNumber = generateMaintenanceTicketId();
    const ticket: MaintenanceTicket = {
      ...data,
      id: `mnt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ticketNumber,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };

    reg.maintenanceTickets.unshift(ticket);

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "maintenance.create_ticket",
      `maintenance/${ticketNumber}`,
      { ticketNumber, equipment: ticket.equipmentName, priority: ticket.priority }
    );

    return ticket;
  },

  resolveMaintenanceTicket(
    ticketId: string,
    actor: { id: string; name: string; role: UserRole }
  ): MaintenanceTicket | undefined {
    const reg = getHMSRegistry();
    const ticket = reg.maintenanceTickets.find((t) => t.id === ticketId || t.ticketNumber === ticketId);
    if (!ticket) return undefined;

    ticket.status = "RESOLVED";
    ticket.resolvedAt = new Date().toISOString();

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "maintenance.resolve_ticket",
      `maintenance/${ticket.ticketNumber}`,
      { ticketNumber: ticket.ticketNumber }
    );

    return ticket;
  },

  getMaintenanceTickets(): MaintenanceTicket[] {
    return getHMSRegistry().maintenanceTickets;
  },

  // --- CAREGIVER CONSENTS ---
  createCaregiverConsent(
    data: Omit<CaregiverConsent, "id" | "consentId" | "status" | "createdAt">,
    actor: { id: string; name: string; role: UserRole }
  ): CaregiverConsent {
    const reg = getHMSRegistry();
    const consentId = generateConsentId();
    const consent: CaregiverConsent = {
      ...data,
      id: `cgc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      consentId,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };

    reg.caregiverConsents.unshift(consent);

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "caregiver.grant_consent",
      `consents/${consentId}`,
      { consentId, patientUhid: consent.patientUhid, caregiver: consent.caregiverName, scope: consent.accessScope }
    );

    return consent;
  },

  revokeCaregiverConsent(
    consentId: string,
    actor: { id: string; name: string; role: UserRole }
  ): CaregiverConsent | undefined {
    const reg = getHMSRegistry();
    const target = reg.caregiverConsents.find((c) => c.id === consentId || c.consentId === consentId);
    if (!target) return undefined;

    target.status = "REVOKED";

    this.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "caregiver.revoke_consent",
      `consents/${target.consentId}`,
      { consentId: target.consentId, patientUhid: target.patientUhid }
    );

    return target;
  },

  getCaregiverConsents(patientUhid?: string, caregiverEmail?: string): CaregiverConsent[] {
    let list = getHMSRegistry().caregiverConsents;
    if (patientUhid) {
      list = list.filter((c) => c.patientUhid.toUpperCase() === patientUhid.toUpperCase());
    }
    if (caregiverEmail) {
      list = list.filter((c) => c.caregiverEmail.toLowerCase() === caregiverEmail.toLowerCase());
    }
    return list;
  },

  // --- UNIFIED PATIENT TIMELINE ENGINE ---
  getPatientTimeline(patientUhid: string, forPatientView: boolean = true): TimelineEvent[] {
    const reg = getHMSRegistry();
    const uhid = patientUhid.toUpperCase();
    const events: TimelineEvent[] = [];

    // 1. Patient Registration
    const patient = reg.patients.find((p) => p.uhid.toUpperCase() === uhid);
    if (patient) {
      events.push({
        id: `tl-reg-${patient.id}`,
        timestamp: patient.createdAt,
        eventType: "REGISTRATION",
        title: "Hospital Registration Completed",
        description: `Registered with permanent IndoStates UHID: ${patient.uhid}`,
        actorName: "Registration Desk",
        actorRole: "RECEPTIONIST",
        isPublicToPatient: true,
        metadata: { uhid: patient.uhid, bloodGroup: patient.bloodGroup },
      });
    }

    // 2. Appointments & Check-ins
    const appts = reg.appointments.filter((a) => a.patientUhid.toUpperCase() === uhid);
    for (const a of appts) {
      events.push({
        id: `tl-apt-${a.id}`,
        timestamp: a.createdAt,
        eventType: "BOOKING",
        title: `Appointment Confirmed: ${a.doctorName}`,
        description: `Scheduled for ${a.appointmentDate} at ${a.timeSlot} (${a.departmentName})`,
        actorName: "Patient Scheduling",
        actorRole: "PATIENT",
        isPublicToPatient: true,
        metadata: { appointmentId: a.appointmentId, target: a.targetName },
      });

      if (a.checkInTime) {
        events.push({
          id: `tl-checkin-${a.id}`,
          timestamp: a.checkInTime,
          eventType: "CHECK_IN",
          title: "Front Desk Check-In & Queue Token Assigned",
          description: `Checked in at reception. Token ${a.tokenNumber || "T-001"} assigned.`,
          actorName: "Front Desk Officer",
          actorRole: "RECEPTIONIST",
          isPublicToPatient: true,
          metadata: { tokenNumber: a.tokenNumber, appointmentId: a.appointmentId },
        });
      }
    }

    // 3. Clinical Encounters
    const encs = reg.encounters.filter((e) => {
      const matchAppt = appts.some((a) => a.id === e.appointmentId);
      return matchAppt || e.patientId === patient?.id;
    });

    for (const e of encs) {
      events.push({
        id: `tl-enc-start-${e.id}`,
        timestamp: e.startedAt || e.createdAt || new Date().toISOString(),
        eventType: "CONSULTATION_STARTED",
        title: `Consultation with ${e.doctorName}`,
        description: `Encounter opened for chief complaint: ${e.chiefComplaint}`,
        actorName: e.doctorName,
        actorRole: "DOCTOR",
        isPublicToPatient: true,
        metadata: { encounterId: e.encounterId },
      });

      if (e.diagnosis) {
        events.push({
          id: `tl-enc-diag-${e.id}`,
          timestamp: e.completedAt || e.startedAt || e.createdAt || new Date().toISOString(),
          eventType: "DIAGNOSIS",
          title: "Clinical Diagnosis & Findings Recorded",
          description: `Diagnosis: ${e.diagnosis}. Plan: ${e.treatmentPlan || "Standard therapeutic care"}`,
          actorName: e.doctorName,
          actorRole: "DOCTOR",
          isPublicToPatient: true,
          metadata: { followUpDays: e.followUpDays, vitals: e.vitals },
        });
      }
    }

    // 4. Prescriptions
    const rxs = reg.prescriptions.filter((rx) => rx.patientId === patient?.id || appts.some((a) => a.id === rx.appointmentId));
    for (const rx of rxs) {
      events.push({
        id: `tl-rx-${rx.id}`,
        timestamp: rx.createdAt,
        eventType: "PRESCRIPTION",
        title: `Electronic Prescription Issued (${rx.prescriptionId})`,
        description: `${rx.medications.length} medication(s) prescribed by ${rx.doctorName}`,
        actorName: rx.doctorName,
        actorRole: "DOCTOR",
        isPublicToPatient: true,
        metadata: { prescriptionId: rx.prescriptionId, status: rx.status },
      });

      if (rx.status === "completed" && rx.dispensedAt) {
        events.push({
          id: `tl-disp-${rx.id}`,
          timestamp: rx.dispensedAt,
          eventType: "MEDICATION_DISPENSED",
          title: "Pharmacy Medication Dispensed",
          description: `All items verified and dispensed by ${rx.dispensedBy || "Pharmacy Staff"}.`,
          actorName: rx.dispensedBy || "Central Pharmacy",
          actorRole: "PHARMACY_STAFF",
          isPublicToPatient: true,
          metadata: { prescriptionId: rx.prescriptionId },
        });
      }
    }

    // 5. Lab Orders
    const labs = reg.labOrders.filter((l) => l.patientId === patient?.id || appts.some((a) => a.id === l.appointmentId));
    for (const lab of labs) {
      events.push({
        id: `tl-lab-ord-${lab.id}`,
        timestamp: lab.createdAt,
        eventType: "LAB_ORDER",
        title: `Diagnostic Lab Ordered: ${lab.testName}`,
        description: `Sample type: ${lab.sampleType}. Status: ${lab.sampleStatus.toUpperCase()}`,
        actorName: lab.doctorName,
        actorRole: "DOCTOR",
        isPublicToPatient: true,
        metadata: { orderId: lab.orderId, testCode: lab.testCode },
      });

      if (lab.isReportReleased && lab.releasedAt) {
        events.push({
          id: `tl-lab-res-${lab.id}`,
          timestamp: lab.releasedAt,
          eventType: "LAB_RESULT",
          title: `Verified Lab Report Released: ${lab.testName}`,
          description: lab.reportSummary || "Diagnostic test verified by pathologist and released.",
          actorName: lab.verifiedBy || "Laboratory Verifier",
          actorRole: "LAB_VERIFIER",
          isPublicToPatient: true,
          metadata: { orderId: lab.orderId, verifiedBy: lab.verifiedBy },
        });
      }
    }

    // 6. Imaging Orders
    const imgs = reg.imagingOrders.filter((img) => img.patientUhid.toUpperCase() === uhid);
    for (const img of imgs) {
      events.push({
        id: `tl-img-ord-${img.id}`,
        timestamp: img.createdAt,
        eventType: "IMAGING_ORDER",
        title: `Radiology Scheduled: ${img.studyName}`,
        description: `Modality: ${img.modality}. Instructions: ${img.preparationInstructions}`,
        actorName: img.doctorName,
        actorRole: "DOCTOR",
        isPublicToPatient: true,
        metadata: { orderId: img.orderId, modality: img.modality },
      });

      if (img.isReportReleased && img.verifiedAt) {
        events.push({
          id: `tl-img-res-${img.id}`,
          timestamp: img.verifiedAt,
          eventType: "IMAGING_REPORT",
          title: `Radiology Report Verified: ${img.studyName}`,
          description: img.reportSummary || "Radiological assessment verified and released.",
          actorName: img.radiologistName || "Lead Radiologist",
          actorRole: "IMAGING_STAFF",
          isPublicToPatient: true,
          metadata: { orderId: img.orderId, radiologistName: img.radiologistName },
        });
      }
    }

    // 7. Inpatient Admissions & Discharges
    const admissions = reg.admissions.filter((adm) => adm.patientUhid.toUpperCase() === uhid);
    for (const adm of admissions) {
      events.push({
        id: `tl-adm-${adm.id}`,
        timestamp: adm.createdAt,
        eventType: "IPD_ADMISSION",
        title: `Inpatient Admission: ${adm.wardName}`,
        description: `Admitted to Bed ${adm.bedNumber}. Reason: ${adm.admissionReason}`,
        actorName: adm.doctorName,
        actorRole: "DOCTOR",
        isPublicToPatient: true,
        metadata: { admissionNumber: adm.admissionNumber, bedNumber: adm.bedNumber },
      });

      if (adm.status === "DISCHARGED" && adm.dischargeDate) {
        events.push({
          id: `tl-disch-${adm.id}`,
          timestamp: adm.dischargeDate,
          eventType: "IPD_DISCHARGE",
          title: "Inpatient Discharge Completed",
          description: adm.dischargeSummary || "Patient discharged in stable hemodynamic condition.",
          actorName: adm.doctorName,
          actorRole: "DOCTOR",
          isPublicToPatient: true,
          metadata: { admissionNumber: adm.admissionNumber },
        });
      }
    }

    // 8. Billing & Payments
    const invoices = reg.invoices.filter((inv) => inv.patientUhid.toUpperCase() === uhid || inv.patientId === patient?.id);
    for (const inv of invoices) {
      events.push({
        id: `tl-inv-${inv.id}`,
        timestamp: inv.createdAt,
        eventType: "INVOICE_GENERATED",
        title: `Billing Invoice Generated (${inv.invoiceId})`,
        description: `Total Amount: ₹${inv.totalAmount.toLocaleString("en-IN")}. Status: ${inv.paymentStatus.toUpperCase()}`,
        actorName: inv.generatedBy,
        actorRole: "BILLING_STAFF",
        isPublicToPatient: true,
        metadata: { invoiceId: inv.invoiceId, total: inv.totalAmount },
      });

      if (inv.paymentStatus === "paid" && inv.paidAt) {
        events.push({
          id: `tl-pay-${inv.id}`,
          timestamp: inv.paidAt,
          eventType: "PAYMENT_SETTLED",
          title: `Payment Receipt Issued (${inv.receiptNumber || "N/A"})`,
          description: `₹${inv.paidAmount.toLocaleString("en-IN")} settled via ${inv.paymentMethod?.toUpperCase() || "ONLINE"}.`,
          actorName: "Accounts & Billing",
          actorRole: "BILLING_STAFF",
          isPublicToPatient: true,
          metadata: { receiptNumber: inv.receiptNumber, ref: inv.transactionRef },
        });
      }
    }

    // Sort chronologically descending (latest first)
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (forPatientView) {
      return events.filter((e) => e.isPublicToPatient);
    }
    return events;
  },

  // --- NOTIFICATIONS ---
  getNotifications: (userIdOrUhid?: string, targetRole?: UserRole): NotificationRecord[] => {
    const reg = getHMSRegistry();
    return reg.notifications.filter((n) => {
      if (targetRole && n.targetRole === targetRole) return true;
      if (userIdOrUhid && (n.userId === userIdOrUhid || n.userId === "all" || n.userId === "patient")) return true;
      if (!userIdOrUhid && !targetRole) return true;
      return false;
    });
  },

  createNotification: (notif: Omit<NotificationRecord, "id" | "createdAt">): NotificationRecord => {
    const reg = getHMSRegistry();
    const newNotif: NotificationRecord = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    reg.notifications.unshift(newNotif);
    return newNotif;
  },

  markNotificationAsRead: (id: string): boolean => {
    const reg = getHMSRegistry();
    const n = reg.notifications.find((item) => item.id === id);
    if (!n) return false;
    n.isRead = true;
    return true;
  },

  markAllNotificationsAsRead: (userIdOrUhid?: string): boolean => {
    const reg = getHMSRegistry();
    reg.notifications.forEach((n) => {
      if (!userIdOrUhid || n.userId === userIdOrUhid || n.userId === "all" || n.userId === "patient") {
        n.isRead = true;
      }
    });
    return true;
  },
};

