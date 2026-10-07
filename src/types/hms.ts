// ==============================================================================
// INDOSTATES HOSPITAL: COMPLETE ENTERPRISE HMS TYPE DEFINITIONS
// Role-Based Access Control, Clinical Encounters, Queues, Lab, Imaging,
// Pharmacy, Billing, IPD, Wards, Emergency, Ambulance, Operations & Audit
// ==============================================================================

export type UserRole =
  | "SUPER_ADMIN"
  | "HOSPITAL_ADMIN"
  | "MEDICAL_DIRECTOR"
  | "OPERATIONS_MANAGER"
  | "HR_MANAGER"
  | "DEPARTMENT_HEAD"
  | "DOCTOR"
  | "NURSE"
  | "RECEPTIONIST"
  | "LAB_TECHNICIAN"
  | "LAB_VERIFIER"
  | "IMAGING_STAFF"
  | "PHARMACY_STAFF"
  | "PHARMACY_MANAGER"
  | "BILLING_STAFF"
  | "FINANCE_MANAGER"
  | "HOUSEKEEPING_STAFF"
  | "MAINTENANCE_STAFF"
  | "SECURITY_STAFF"
  | "AMBULANCE_STAFF"
  | "PATIENT"
  | "ATTENDER"
  | "ATTENDER_CAREGIVER";

export type Permission =
  | "appointment.read"
  | "appointment.create"
  | "appointment.update"
  | "appointment.cancel"
  | "appointment.checkin"
  | "patient.read"
  | "patient.update"
  | "clinical.read"
  | "clinical.write"
  | "prescription.read"
  | "prescription.write"
  | "prescription.dispense"
  | "lab.read"
  | "lab.write"
  | "lab.verify"
  | "imaging.read"
  | "imaging.write"
  | "imaging.verify"
  | "pharmacy.stock"
  | "pharmacy.purchase"
  | "billing.read"
  | "billing.write"
  | "finance.refund"
  | "finance.reconcile"
  | "ipd.read"
  | "ipd.write"
  | "ipd.discharge"
  | "bed.manage"
  | "emergency.read"
  | "emergency.triage"
  | "emergency.write"
  | "ambulance.read"
  | "ambulance.dispatch"
  | "housekeeping.manage"
  | "housekeeping.complete"
  | "maintenance.manage"
  | "maintenance.resolve"
  | "caregiver.consent"
  | "staff.manage"
  | "doctor.manage"
  | "department.manage"
  | "audit.read"
  | "system.manage"
  | "queue.manage"
  | "nurse.manage"
  | "security.manage";

export type AppointmentStatus =
  | "BOOKED"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "WAITING"
  | "CALLED"
  | "IN_CONSULTATION"
  | "CONSULTATION_COMPLETED"
  | "LAB_PENDING"
  | "LAB_COMPLETED"
  | "PHARMACY_PENDING"
  | "PHARMACY_COMPLETED"
  | "BILLING_PENDING"
  | "PAYMENT_COMPLETED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "PENDING"
  | "REJECTED"
  | "EXPIRED";

export interface PatientProfile {
  id: string; // Internal UUID
  uhid: string; // e.g. IND-UHID-000001
  userId?: string; // Supabase auth.users(id)
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  address?: string;
  bloodGroup?: string;
  allergies?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  accountStatus: "active" | "suspended";
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentRecord {
  id: string;
  appointmentId: string; // e.g. IND-APT-100001
  referenceCode: string; // e.g. ISH-552910
  verificationToken: string; // Secure token for QR verification
  patientId: string;
  patientUhid: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: number;
  patientGender: string;
  serviceType: "package" | "department" | "doctor" | "consultation";
  targetId: string;
  targetName: string;
  doctorId?: string;
  doctorName?: string;
  departmentId: string;
  departmentName?: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string;
  tokenNumber?: string; // e.g. T-005
  status: AppointmentStatus;
  paymentStatus: "pay_on_arrival" | "paid_online";
  notes?: string;
  checkInTime?: string;
  qrVerified: boolean;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientEncounter {
  id: string;
  encounterId: string; // e.g. ENC-202610-001
  appointmentId: string;
  patientId: string;
  patientUhid?: string;
  doctorId: string;
  doctorName: string;
  startedAt?: string;
  completedAt?: string;
  chiefComplaint: string;
  vitals?: {
    bloodPressure?: string;
    pulseRate?: number;
    respiratoryRate?: number;
    temperature?: number;
    oxygenSaturation?: number;
    bloodGlucose?: string;
    recordedAt?: string;
    recordedBy?: string;
  };
  clinicalFindings?: string;
  diagnosis: string;
  treatmentPlan?: string;
  followUpDays?: number;
  followUpDate?: string;
  status: "in_progress" | "completed";
  createdAt: string;
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  instructions: string;
  quantity?: number;
}

export interface PrescriptionRecord {
  id: string;
  prescriptionId: string; // e.g. RX-10042
  encounterId: string;
  appointmentId: string;
  patientId: string;
  patientUhid?: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  medications: PrescriptionItem[];
  instructions?: string;
  status: "pending_dispense" | "partially_dispensed" | "completed" | "dispensed";
  dispensedBy?: string;
  dispensedAt?: string;
  createdAt: string;
}

export interface LabOrderRecord {
  id: string;
  orderId: string; // e.g. LAB-8001
  encounterId?: string;
  appointmentId: string;
  patientId: string;
  patientUhid?: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  testCode: string;
  testName: string;
  sampleType: string;
  sampleStatus: "ordered" | "collected" | "processing" | "completed";
  collectedAt?: string;
  collectedBy?: string;
  reportUrl?: string;
  reportSummary?: string;
  isReportReleased: boolean;
  releasedAt?: string;
  verifiedBy?: string;
  createdAt: string;
}

export interface BillingItem {
  id: string;
  description: string;
  category: "consultation" | "lab" | "radiology" | "pharmacy" | "nursing" | "package" | "ipd_room" | "bed_charge";
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface BillingInvoice {
  id: string;
  invoiceId: string; // e.g. INV-90021
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  items: BillingItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: "unpaid" | "partially_paid" | "paid" | "refunded";
  paymentMethod?: "cash" | "upi" | "card" | "insurance" | "online" | "Cash" | "UPI" | "Card";
  transactionRef?: string;
  receiptNumber?: string;
  paidAt?: string;
  generatedBy: string;
  createdAt: string;
}

export interface NurseTaskRecord {
  id: string;
  taskId: string;
  encounterId?: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  taskType: "vitals_check" | "medication_admin" | "iv_infusion" | "wound_dressing" | "observation";
  description: string;
  assignedNurseName?: string;
  status: "pending" | "in_progress" | "completed";
  completedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface QueueEntry {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  doctorId?: string;
  doctorName?: string;
  departmentId: string;
  tokenNumber: string; // e.g. T-001
  status: "waiting" | "called" | "in_consultation" | "completed" | "skipped";
  checkInTime: string;
  calledTime?: string;
  priority: "normal" | "urgent" | "senior";
  patientAge?: number;
  patientGender?: string;
  appointmentType?: string;
  appointmentTime?: string;
  triageNotes?: string;
  vitals?: {
    bpSystolic?: number;
    bpDiastolic?: number;
    pulse?: number;
    temperature?: number;
    spo2?: number;
    weight?: number;
  };
}

// ==============================================================================
// ENTERPRISE EXTENSIONS: Wards, Beds, IPD, Emergency, Ambulance, Imaging & Operations
// ==============================================================================

export type BedStatus = "AVAILABLE" | "RESERVED" | "OCCUPIED" | "CLEANING" | "MAINTENANCE" | "BLOCKED";

export interface WardRecord {
  id: string;
  wardNumber: string; // e.g. W-ICU-01, W-GW-02
  name: string; // e.g. "Neuro Intensive Care Unit (NICU)", "General Ward A"
  floor: string; // e.g. "Ground Floor", "1st Floor"
  totalBeds: number;
  departmentId: string;
  active: boolean;
}

export interface RoomRecord {
  id: string;
  roomNumber: string; // e.g. R-101
  wardId: string;
  roomType: "general" | "semi_private" | "deluxe" | "icu";
  dailyRate: number;
}

export interface BedRecord {
  id: string;
  bedNumber: string; // e.g. BED-ICU-01
  wardId: string;
  wardName: string;
  roomId?: string;
  roomNumber?: string;
  status: BedStatus;
  currentPatientUhid?: string;
  currentPatientName?: string;
  currentAdmissionId?: string;
  lastCleanedAt?: string;
  updatedAt: string;
}

export interface AdmissionRecord {
  id: string;
  admissionNumber: string; // e.g. ADM-202610-001
  patientUhid: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  wardId: string;
  wardName: string;
  bedId: string;
  bedNumber: string;
  admissionDate: string;
  dischargeDate?: string;
  admissionReason: string;
  status: "ADMITTED" | "DISCHARGED" | "TRANSFERRED";
  dischargeSummary?: string;
  createdAt: string;
}

export interface EmergencyCase {
  id: string;
  caseNumber: string; // e.g. EMG-202610-001
  patientName: string;
  patientPhone?: string;
  patientUhid?: string;
  triagePriority: "RED" | "YELLOW" | "GREEN"; // Red: Immediate, Yellow: Urgent, Green: Standard
  chiefComplaint: string;
  vitals?: {
    bloodPressure?: string;
    pulseRate?: number;
    spO2?: number;
    gcs?: number; // Glasgow Coma Scale
  };
  attendingDoctorId?: string;
  attendingDoctorName?: string;
  attendingNurseName?: string;
  bedNumber?: string;
  status: "TRIAGE" | "IN_TREATMENT" | "ADMITTED_IPD" | "DISCHARGED" | "DECEASED";
  arrivedAt: string;
}

export interface AmbulanceRecord {
  id: string;
  vehicleNumber: string; // e.g. TN 38 BJ 1088
  vehicleType: "Basic Life Support (BLS)" | "Advanced Cardiac Life Support (ACLS)" | "Patient Transport";
  driverName: string;
  driverPhone: string;
  status: "AVAILABLE" | "ASSIGNED" | "EN_ROUTE" | "ARRIVED" | "PATIENT_PICKED" | "AT_HOSPITAL" | "COMPLETED" | "MAINTENANCE";
  currentLocation: string;
  equipmentReady: boolean;
}

export interface AmbulanceRequest {
  id: string;
  requestNumber: string; // e.g. AMB-REQ-1002
  patientName: string;
  patientPhone: string;
  pickupAddress: string;
  destination: string;
  ambulanceId?: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  status: "REQUESTED" | "DISPATCHED" | "EN_ROUTE" | "AT_SCENE" | "TRANSPORTING" | "ARRIVED_HOSPITAL" | "CANCELLED";
  priority: "EMERGENCY" | "NON_EMERGENCY";
  requestedAt: string;
  completedAt?: string;
}

export interface ImagingOrderRecord {
  id: string;
  orderId: string; // e.g. IMG-202610-001
  appointmentId: string;
  patientUhid: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  modality: "1.5T_MRI" | "128_SLICE_CT" | "3D_MAMMOGRAPHY" | "DEXA" | "DIGITAL_XRAY" | "ULTRASOUND";
  studyName: string; // e.g. "Brain MRI + Stroke Protocol", "Coronary Calcium Score CT"
  preparationInstructions: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "REPORT_VERIFIED";
  reportUrl?: string;
  reportSummary?: string;
  radiologistName?: string;
  verifiedAt?: string;
  isReportReleased: boolean;
  createdAt: string;
}

export interface PharmacyBatch {
  id: string;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  quantity: number;
  purchaseRate: number;
  mrp: number;
}

export interface PharmacyInventoryItem {
  id: string;
  itemCode: string; // e.g. MED-001
  medicineName: string;
  genericName: string;
  category: "Tablet" | "Capsule" | "Injection" | "Syrup" | "IV Fluid" | "Topical";
  strength: string;
  currentStock: number;
  reorderLevel: number;
  unitPrice: number;
  mrp: number;
  batches: PharmacyBatch[];
}

export interface HousekeepingTask {
  id: string;
  taskNumber: string; // e.g. HK-1001
  locationType: "BED" | "ROOM" | "WARD" | "OPD" | "EMERGENCY";
  locationId: string; // e.g. "BED-ICU-01", "OPD Room 3"
  description: string;
  priority: "HIGH" | "NORMAL" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  assignedStaffName?: string;
  requestedAt: string;
  completedAt?: string;
}

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string; // e.g. MNT-202610-001
  equipmentName: string; // e.g. "1.5T MRI Cryogen Chiller", "Bed 4 Oxygen Port"
  department: string;
  issueDescription: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  reportedBy: string;
  assignedTo?: string;
  downtimeReported: boolean;
  resolvedAt?: string;
  createdAt: string;
}

export interface CaregiverConsent {
  id: string;
  consentId: string; // e.g. CGC-202610-001
  patientUhid: string;
  patientName: string;
  caregiverName: string;
  caregiverPhone: string;
  caregiverEmail: string;
  relationship: "Spouse" | "Child" | "Parent" | "Sibling" | "Guardian" | "Other";
  accessScope: "APPOINTMENTS_ONLY" | "FULL_CARE" | "BILLING_ONLY";
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  validUntil: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  eventType:
    | "REGISTRATION"
    | "BOOKING"
    | "CHECK_IN"
    | "QUEUE_TOKEN"
    | "CONSULTATION_STARTED"
    | "DIAGNOSIS"
    | "PRESCRIPTION"
    | "LAB_ORDER"
    | "LAB_RESULT"
    | "IMAGING_ORDER"
    | "IMAGING_REPORT"
    | "MEDICATION_DISPENSED"
    | "INVOICE_GENERATED"
    | "PAYMENT_SETTLED"
    | "IPD_ADMISSION"
    | "IPD_DISCHARGE"
    | "EMERGENCY_TRIAGE"
    | "AMBULANCE_DISPATCH";
  title: string;
  description: string;
  actorName: string;
  actorRole: UserRole;
  isPublicToPatient: boolean;
  metadata?: Record<string, any>;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  targetRole?: UserRole;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "alert";
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface AuditLogRecord {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  resource: string;
  details: Record<string, any>;
  ipAddress?: string;
  status: "success" | "failure";
  createdAt: string;
}

export type EncounterRecord = PatientEncounter;
