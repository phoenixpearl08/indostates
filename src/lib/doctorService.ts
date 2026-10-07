// ==============================================================================
// INDOSTATES HOSPITAL: MASTER DOCTOR & CLINICAL WORKSPACE SERVICE ENGINE
// Dedicated clinical logic for OPD queues, encounters, prescriptions, lab tests,
// diagnostic reports, follow-ups, and doctor schedule management.
// Connected directly to HMSService and Supabase sync.
// ==============================================================================

import {
  AppointmentRecord,
  AppointmentStatus,
  EncounterRecord,
  ImagingOrderRecord,
  LabOrderRecord,
  NotificationRecord,
  PatientEncounter,
  PatientProfile,
  PrescriptionItem,
  PrescriptionRecord,
  QueueEntry,
  TimelineEvent,
  UserRole,
} from "@/types/hms";
import { HMSService } from "./hmsService";
import { DOCTORS, Doctor } from "@/data/hospitalData";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";

export interface DoctorScheduleSlot {
  time: string;
  isBooked: boolean;
  appointmentRef?: string;
  patientName?: string;
  isBlocked?: boolean;
}

export interface DoctorDailySchedule {
  doctorId: string;
  doctorName: string;
  departmentId: string;
  departmentName: string;
  date: string;
  opdRoom: string;
  slotDurationMinutes: number;
  maxDailyCapacity: number;
  dailyCapacity?: number;
  isOnDuty: boolean;
  statusNotice?: string;
  slots: DoctorScheduleSlot[];
  weeklySchedule?: Array<{
    day: string;
    timing: string;
    room: string;
  }>;
  blockedSlots?: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    reason: string;
  }>;
}

export interface ConsultationSubmission {
  appointmentId: string;
  patientId: string;
  patientUhid?: string;
  patientName?: string;
  queueId?: string;
  chiefComplaint: string;
  historyOfIllness?: string;
  vitals?: {
    bloodPressure?: string;
    bpSystolic?: number | string;
    bpDiastolic?: number | string;
    pulseRate?: number;
    pulse?: number;
    respiratoryRate?: number;
    temperature?: number;
    oxygenSaturation?: number;
    spo2?: number;
    bloodGlucose?: string;
    weightKg?: number;
  };
  physicalExamination?: string;
  clinicalAssessment?: string;
  diagnosis: string;
  diagnosisCode?: string; // ICD-10 code (e.g. I63.9, E11.9)
  treatmentPlan: string;
  doctorsNotes?: string;
  medications: PrescriptionItem[];
  labTests: {
    testName: string;
    priority: "ROUTINE" | "URGENT" | "STAT";
    clinicalIndication?: string;
    instructions?: string;
  }[];
  followUpDays?: number;
  followUpDate?: string;
  followUpInstructions?: string;
  isDraft?: boolean;
}

export interface DoctorOverviewStats {
  todayAppointmentsCount: number;
  waitingPatientsCount: number;
  inConsultationCount: number;
  completedConsultationsCount: number;
  remainingPatientsCount: number;
  emergencyPriorityCount: number;
  priorityEmergencyCount?: number;
  followUpsTodayCount: number;
  pendingLabReportsCount: number;
  pendingPrescriptionsCount: number;
  opdRoom: string;
  isOnDuty: boolean;
  statusNotice: string;
  nextPatient: QueueEntry | null;
  currentPatient: QueueEntry | null;
  currentInConsultationPatient?: QueueEntry | null;
  recentQueue?: QueueEntry[];
}

export interface PatientDossier {
  id: string;
  name: string;
  uhid: string;
  age: number;
  gender: string;
  phone?: string;
  bloodGroup?: string;
  allergies?: string[];
  lastVisitDate?: string;
  activeQueueToken?: QueueEntry;
}

export interface DoctorPrescriptionRecord {
  id: string;
  rxNumber: string;
  createdAt: string;
  patientName: string;
  patientUhid: string;
  doctorName: string;
  department: string;
  diagnosis?: string;
  status: string;
  medicines: Array<{
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
    route: string;
    instructions: string;
  }>;
  followUpDate?: string;
  followUpInstructions?: string;
  notes?: string;
}

export interface DoctorLabOrderRecord {
  id: string;
  createdAt: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  priority: string;
  status: string;
  clinicalIndication?: string;
  tests: Array<{
    testName: string;
    priority?: string;
    clinicalIndication?: string;
  }>;
}

export interface DoctorReportRecord {
  id: string;
  testName: string;
  category: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  createdAt: string;
  status: string;
  isCritical?: boolean;
  findings?: string;
}

export interface DoctorFollowUpRecord {
  id: string;
  followUpDate: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  clinicalReason: string;
  instructions?: string;
  status: string;
}

export interface DoctorNotificationRecord {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface DoctorScheduleData {
  isOnDuty: boolean;
  opdRoom: string;
  dailyCapacity: number;
  statusNotice: string;
  weeklySchedule: Array<{
    day: string;
    timing: string;
    room: string;
  }>;
  blockedSlots: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    reason: string;
  }>;
}

export interface ConsultationRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  doctorId: string;
  doctorName: string;
  department: string;
  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  physicalExamination?: string;
  clinicalAssessment?: string;
  diagnosis: string;
  icd10Code?: string;
  treatmentPlan?: string;
  doctorNotes?: string;
  prescriptions?: Array<{
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
    route: string;
    instructions: string;
  }>;
  labOrders?: Array<{
    testName: string;
    priority: "routine" | "urgent" | "stat";
    clinicalIndication?: string;
  }>;
  vitals?: any;
  prescriptionId?: string;
  followUpDate?: string;
  followUpInstructions?: string;
  status: "completed" | "draft";
  createdAt: string;
}

// In-memory runtime state for doctor availability overrides
interface DoctorAvailabilityOverride {
  isOnDuty: boolean;
  opdRoom: string;
  dailyCapacity: number;
  statusNotice: string;
  blockedSlots: string[];
}

let doctorAvailabilityMap: Record<string, DoctorAvailabilityOverride> = {
  "dr-logesh-thirumalaisamy": {
    isOnDuty: true,
    opdRoom: "OPD Room 204 (Level 2)",
    dailyCapacity: 25,
    statusNotice: "On Duty — OPD Consultation Active",
    blockedSlots: [],
  },
  "dr-rajesh-rangaswamy": {
    isOnDuty: true,
    opdRoom: "Neurovascular Suite 101 (Level 1)",
    dailyCapacity: 20,
    statusNotice: "On Duty — Specialized Stroke Clinic",
    blockedSlots: [],
  },
};

// In-memory consultation drafts for uninterrupted doctor workflow
let consultationDraftsMap: Record<string, ConsultationSubmission> = {};

export const DoctorService = {
  // --- DOCTOR RESOLUTION ---
  resolveDoctor(session?: { id?: string; name?: string; role?: string } | null): Doctor {
    if (!session) return DOCTORS[0];

    // Find by exact ID
    const byId = DOCTORS.find((d) => d.id === session.id);
    if (byId) return byId;

    // Find by matching name
    if (session.name) {
      const sName = session.name.toLowerCase();
      const byName = DOCTORS.find(
        (d) => d.name.toLowerCase() === sName || d.name.toLowerCase().includes(sName) || sName.includes(d.name.toLowerCase())
      );
      if (byName) return byName;
    }

    // Default to Dr. Logesh or first doctor
    return DOCTORS.find((d) => d.id === "dr-logesh-thirumalaisamy") || DOCTORS[0];
  },

  // --- OVERVIEW / CLINICAL KPIS ---
  getDoctorOverview(doctorId: string): DoctorOverviewStats {
    const doctor = DOCTORS.find((d) => d.id === doctorId) || DOCTORS[0];
    const todayStr = new Date().toISOString().split("T")[0];

    // 1. Fetch appointments for this doctor today
    const allAppointments = HMSService.getAppointments();
    const docAppointments = allAppointments.filter(
      (a) => (a.doctorId === doctor.id || a.targetId === doctor.id) && a.appointmentDate === todayStr
    );

    // 2. Fetch queues for this doctor
    const queues = HMSService.getQueues(doctor.id);

    const waitingPatients = queues.filter((q) => q.status === "waiting");
    const inConsultation = queues.find((q) => q.status === "in_consultation") || null;
    const completedConsultations = queues.filter((q) => q.status === "completed").length;
    const remainingPatients = waitingPatients.length + (inConsultation ? 1 : 0);

    // 3. Next patient is first waiting or called
    const nextPatient =
      queues.find((q) => q.status === "called") ||
      queues.find((q) => q.status === "waiting") ||
      null;

    // 4. Emergency / Priority Cases (Urgent queues + RED triage cases in emergency)
    const priorityQueues = queues.filter((q) => q.priority === "urgent" || q.priority === "senior");
    const emergencyCases = HMSService.getEmergencyCases().filter(
      (e) => e.triagePriority === "RED" || e.attendingDoctorId === doctor.id
    );
    const emergencyPriorityCount = priorityQueues.length + emergencyCases.length;

    // 5. Encounters / Follow-ups today
    const encounters = HMSService.getEncounters().filter((e) => e.doctorId === doctor.id);
    const followUpsToday = encounters.filter((e) => e.followUpDate === todayStr);

    // 6. Pending Lab reports ordered by this doctor
    const labOrders = HMSService.getLabOrders().filter((l) => l.doctorId === doctor.id);
    const pendingLabReportsCount = labOrders.filter((l) => !l.isReportReleased).length;

    // 7. Pending prescriptions
    const prescriptions = HMSService.getPrescriptions().filter((p) => p.doctorId === doctor.id);
    const pendingPrescriptionsCount = prescriptions.filter(
      (p) => p.status === "pending_dispense" || p.status === "partially_dispensed"
    ).length;

    // 8. Doctor availability
    const override = doctorAvailabilityMap[doctor.id] || {
      isOnDuty: true,
      opdRoom: "OPD Room 204",
      dailyCapacity: 25,
      statusNotice: "On Duty — Active OPD",
      blockedSlots: [],
    };

    return {
      todayAppointmentsCount: docAppointments.length > 0 ? docAppointments.length : queues.length,
      waitingPatientsCount: waitingPatients.length,
      inConsultationCount: inConsultation ? 1 : 0,
      completedConsultationsCount: completedConsultations,
      remainingPatientsCount: remainingPatients,
      emergencyPriorityCount,
      priorityEmergencyCount: emergencyPriorityCount,
      followUpsTodayCount: followUpsToday.length,
      pendingLabReportsCount,
      pendingPrescriptionsCount,
      opdRoom: override.opdRoom,
      isOnDuty: override.isOnDuty,
      statusNotice: override.statusNotice,
      nextPatient,
      currentPatient: inConsultation,
      currentInConsultationPatient: inConsultation,
      recentQueue: queues.slice(0, 5),
    };
  },

  // --- OPD QUEUE OPERATIONS ---
  getDoctorQueue(doctorId: string): QueueEntry[] {
    const doctor = DOCTORS.find((d) => d.id === doctorId) || DOCTORS[0];
    const queues = HMSService.getQueues(doctor.id);

    // Also include any unassigned queue in the same department
    if (queues.length === 0) {
      return HMSService.getQueues();
    }
    return queues;
  },

  callPatient(
    queueId: string,
    actor: { id: string; name: string; role: UserRole }
  ): QueueEntry | undefined {
    return HMSService.callQueueToken(queueId, actor);
  },

  startConsultation(
    queueId: string,
    actor: { id: string; name: string; role: UserRole }
  ): QueueEntry | undefined {
    return HMSService.startConsultationToken(queueId, actor);
  },

  // --- DRAFT MANAGEMENT ---
  getConsultationDraft(appointmentId: string): ConsultationSubmission | null {
    return consultationDraftsMap[appointmentId] || null;
  },

  saveConsultationDraft(data: ConsultationSubmission): { success: boolean; message: string } {
    consultationDraftsMap[data.appointmentId] = {
      ...data,
      isDraft: true,
    };
    return { success: true, message: "Consultation draft saved successfully." };
  },

  clearConsultationDraft(appointmentId: string): void {
    delete consultationDraftsMap[appointmentId];
  },

  // --- FINALIZE CONSULTATION WORKFLOW ---
  finalizeConsultation(
    data: ConsultationSubmission,
    actor: { id: string; name: string; role: UserRole }
  ): {
    success: boolean;
    encounter: PatientEncounter;
    prescription?: PrescriptionRecord;
    labOrders: LabOrderRecord[];
    message: string;
  } {
    const {
      appointmentId,
      patientId,
      patientUhid,
      patientName,
      queueId,
      chiefComplaint,
      historyOfIllness,
      vitals,
      physicalExamination,
      clinicalAssessment,
      diagnosis,
      diagnosisCode,
      treatmentPlan,
      doctorsNotes,
      medications,
      labTests,
      followUpDays,
      followUpDate,
      followUpInstructions,
    } = data;

    // Normalize medications from medications or prescriptions
    const rawMeds = (data as any).medications || (data as any).prescriptions || [];
    const normalizedMeds: PrescriptionItem[] = rawMeds.map((m: any, idx: number) => ({
      id: m.id || `rx-item-${idx + 1}`,
      medicineName: m.medicineName || m.medicine || "Medication",
      dosage: m.dosage || "1 Tab",
      frequency: m.frequency || "1-0-1",
      durationDays: typeof m.durationDays === "number" ? m.durationDays : parseInt(m.duration) || 5,
      instructions: m.instructions || "As directed",
    }));

    // Normalize lab tests from labTests or labOrders
    const rawLabs = (data as any).labTests || (data as any).labOrders || [];
    const normalizedLabs = rawLabs.map((l: any) => ({
      testName: l.testName || l.name || "Lab Investigation",
      priority: ((l.priority || "routine").toUpperCase()) as "ROUTINE" | "URGENT" | "STAT",
      clinicalIndication: l.clinicalIndication || l.indication || "",
      instructions: l.instructions || "",
    }));

    // Calculate follow-up date if days provided
    let calculatedFollowUpDate = followUpDate;
    if (!calculatedFollowUpDate && followUpDays && followUpDays > 0) {
      const d = new Date();
      d.setDate(d.getDate() + Number(followUpDays));
      calculatedFollowUpDate = d.toISOString().split("T")[0];
    }

    const safeVitals = vitals
      ? {
          bloodPressure:
            vitals.bloodPressure ||
            (vitals.bpSystolic ? `${vitals.bpSystolic}/${vitals.bpDiastolic}` : "120/80"),
          pulseRate: Number(vitals.pulseRate || vitals.pulse) || 72,
          respiratoryRate: Number(vitals.respiratoryRate) || 16,
          temperature: Number(vitals.temperature) || 98.4,
          oxygenSaturation: Number(vitals.oxygenSaturation || vitals.spo2) || 99,
          bloodGlucose: vitals.bloodGlucose || "105 mg/dL",
          recordedAt: new Date().toISOString(),
          recordedBy: actor.name,
        }
      : {
          bloodPressure: "120/80",
          pulseRate: 72,
          respiratoryRate: 16,
          temperature: 98.4,
          oxygenSaturation: 99,
          bloodGlucose: "105 mg/dL",
          recordedAt: new Date().toISOString(),
          recordedBy: actor.name,
        };

    // 1. Create PatientEncounter record
    const encounter = HMSService.createEncounter(
      {
        appointmentId,
        patientId,
        patientUhid,
        doctorId: actor.id,
        doctorName: actor.name,
        startedAt: new Date(Date.now() - 15 * 60000).toISOString(),
        completedAt: new Date().toISOString(),
        chiefComplaint: chiefComplaint || "Specialist Clinical Consultation",
        vitals: safeVitals,
        clinicalFindings: [
          historyOfIllness ? `History: ${historyOfIllness}` : null,
          physicalExamination ? `Exam: ${physicalExamination}` : null,
          clinicalAssessment ? `Assessment: ${clinicalAssessment}` : null,
          doctorsNotes ? `Notes: ${doctorsNotes}` : null,
        ]
          .filter(Boolean)
          .join(" | "),
        diagnosis: diagnosisCode ? `${diagnosis} (${diagnosisCode})` : diagnosis,
        treatmentPlan,
        followUpDays: Number(followUpDays) || 7,
        followUpDate: calculatedFollowUpDate,
        status: "completed",
      },
      actor
    );

    // 2. Create Digital Prescription if medications are present
    let prescription: PrescriptionRecord | undefined = undefined;
    if (normalizedMeds.length > 0) {
      prescription = HMSService.createPrescription(
        {
          encounterId: encounter.id,
          appointmentId,
          patientId,
          patientUhid,
          patientName: patientName || "Consultation Patient",
          doctorId: actor.id,
          doctorName: actor.name,
          medications: normalizedMeds,
          instructions: [
            treatmentPlan,
            followUpInstructions ? `Follow-up: ${followUpInstructions}` : null,
          ]
            .filter(Boolean)
            .join(" • "),
          status: "pending_dispense",
        },
        actor
      );
    }

    // 3. Create Diagnostic Lab Orders if lab tests are present
    const createdLabOrders: LabOrderRecord[] = [];
    if (normalizedLabs.length > 0) {
      for (const t of normalizedLabs) {
        const order = HMSService.createLabOrder(
          {
            encounterId: encounter.id,
            appointmentId,
            patientId,
            patientUhid,
            patientName: patientName || "Consultation Patient",
            doctorId: actor.id,
            doctorName: actor.name,
            testCode: `TEST-${Math.floor(100 + Math.random() * 900)}`,
            testName: t.testName,
            sampleType: "Blood / Serum",
            sampleStatus: "ordered",
            isReportReleased: false,
          },
          actor
        );
        createdLabOrders.push(order);
      }
    }

    // 4. Complete queue token if queueId provided
    if (queueId) {
      HMSService.completeQueueToken(queueId, actor);
    } else {
      // Find queue entry by appointmentId
      const q = HMSService.getQueues().find((item) => item.appointmentId === appointmentId);
      if (q) {
        HMSService.completeQueueToken(q.id, actor);
      }
    }

    // 5. Update appointment status
    const appt = HMSService.getAppointmentById(appointmentId);
    if (appt && appt.status !== "COMPLETED") {
      appt.status = "CONSULTATION_COMPLETED";
      appt.updatedAt = new Date().toISOString();
    }

    // 6. Record audit log for encounter completion
    HMSService.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "CONSULTATION_COMPLETED",
      "Encounter",
      {
        appointmentId,
        encounterId: encounter.encounterId,
        diagnosis: encounter.diagnosis,
        hasPrescription: Boolean(prescription),
        labTestsCount: createdLabOrders.length,
        followUpDate: calculatedFollowUpDate,
      },
      "success"
    );

    // 7. Clear draft
    this.clearConsultationDraft(appointmentId);

    return {
      success: true,
      encounter,
      prescription,
      labOrders: createdLabOrders,
      message: `Consultation completed for ${patientName || "Patient"}. Rx and lab orders dispatched to respective departments.`,
    };
  },

  // --- PATIENT SEARCH & CLINICAL PROFILE ---
  searchAuthorizedPatients(query: string, doctorId: string): PatientProfile[] {
    return HMSService.getPatients(query);
  },

  getPatientClinicalSummary(patientIdOrUhid: string) {
    const pat =
      HMSService.getPatientByUhid(patientIdOrUhid) ||
      HMSService.getPatientById(patientIdOrUhid);

    if (!pat) return null;

    const appointments = HMSService.getAppointments({ patientId: pat.id });
    const encounters = HMSService.getEncounters(pat.id);
    const prescriptions = HMSService.getPrescriptions(pat.id);
    const labOrders = HMSService.getLabOrders(pat.id);
    const timeline = HMSService.getPatientTimeline(pat.uhid, true);
    const consents = HMSService.getCaregiverConsents(pat.uhid);
    const admissions = HMSService.getAdmissions().filter((a) => a.patientUhid === pat.uhid);

    return {
      patient: pat,
      appointments,
      encounters,
      prescriptions,
      labOrders,
      timeline,
      consents,
      admissions,
    };
  },

  // --- CONSULTATIONS LIST FOR DOCTOR ---
  getDoctorConsultations(doctorId: string): PatientEncounter[] {
    const list = HMSService.getEncounters();
    return list.filter((e) => e.doctorId === doctorId);
  },

  // --- PRESCRIPTIONS LIST FOR DOCTOR ---
  getDoctorPrescriptions(doctorId: string): PrescriptionRecord[] {
    const list = HMSService.getPrescriptions();
    return list.filter((p) => p.doctorId === doctorId);
  },

  // --- LAB ORDERS & REPORTS ---
  getDoctorLabOrders(doctorId: string): LabOrderRecord[] {
    const list = HMSService.getLabOrders();
    return list.filter((l) => l.doctorId === doctorId);
  },

  getDoctorReports(doctorId: string) {
    const labOrders = HMSService.getLabOrders().filter(
      (l) => l.doctorId === doctorId && l.isReportReleased
    );
    const imagingOrders = HMSService.getImagingOrders().filter(
      (img) => img.doctorId === doctorId && img.isReportReleased
    );
    return {
      labReports: labOrders,
      imagingReports: imagingOrders,
    };
  },

  // --- SCHEDULE & AVAILABILITY ---
  getDoctorSchedule(doctorId: string): DoctorDailySchedule {
    const doctor = DOCTORS.find((d) => d.id === doctorId) || DOCTORS[0];
    const todayStr = new Date().toISOString().split("T")[0];
    const appointments = HMSService.getAppointments({ doctorId: doctor.id, date: todayStr });

    const override = doctorAvailabilityMap[doctor.id] || {
      isOnDuty: true,
      opdRoom: "OPD Room 204",
      dailyCapacity: 25,
      statusNotice: "On Duty",
      blockedSlots: [],
    };

    const slots: DoctorScheduleSlot[] = [
      { time: "09:00 AM", isBooked: false },
      { time: "09:30 AM", isBooked: false },
      { time: "10:00 AM", isBooked: false },
      { time: "10:30 AM", isBooked: false },
      { time: "11:00 AM", isBooked: false },
      { time: "11:30 AM", isBooked: false },
      { time: "12:00 PM", isBooked: false },
      { time: "12:30 PM", isBooked: false },
      { time: "02:00 PM", isBooked: false },
      { time: "02:30 PM", isBooked: false },
      { time: "03:00 PM", isBooked: false },
      { time: "03:30 PM", isBooked: false },
      { time: "04:00 PM", isBooked: false },
      { time: "04:30 PM", isBooked: false },
    ];

    // Map booked slots
    appointments.forEach((a) => {
      const match = slots.find((s) => s.time.toLowerCase() === a.timeSlot.toLowerCase());
      if (match) {
        match.isBooked = true;
        match.appointmentRef = a.referenceCode;
        match.patientName = a.patientName;
      }
    });

    // Mark blocked slots
    override.blockedSlots.forEach((blockedTime) => {
      const match = slots.find((s) => s.time.toLowerCase() === blockedTime.toLowerCase());
      if (match) {
        match.isBlocked = true;
      }
    });

    return {
      doctorId: doctor.id,
      doctorName: doctor.name,
      departmentId: doctor.departmentId,
      departmentName: doctor.specialization,
      date: todayStr,
      opdRoom: override.opdRoom,
      slotDurationMinutes: 20,
      maxDailyCapacity: override.dailyCapacity,
      dailyCapacity: override.dailyCapacity,
      isOnDuty: override.isOnDuty,
      statusNotice: override.statusNotice,
      slots,
      weeklySchedule: [
        { day: "Monday", timing: "09:00 AM - 01:00 PM (Morning OPD)", room: override.opdRoom },
        { day: "Tuesday", timing: "09:00 AM - 01:00 PM (Morning OPD)", room: override.opdRoom },
        { day: "Wednesday", timing: "09:00 AM - 01:00 PM (Morning OPD)", room: override.opdRoom },
        { day: "Thursday", timing: "02:00 PM - 06:00 PM (Evening OPD)", room: override.opdRoom },
        { day: "Friday", timing: "09:00 AM - 01:00 PM (Morning OPD)", room: override.opdRoom },
        { day: "Saturday", timing: "10:00 AM - 02:00 PM (Speciality OPD)", room: override.opdRoom },
      ],
      blockedSlots: override.blockedSlots.map((b, i) => ({
        id: `blk-${i}`,
        date: todayStr,
        startTime: b,
        endTime: b,
        reason: "Clinical Block",
      })),
    };
  },

  updateDoctorAvailability(
    doctorId: string,
    updates: Partial<DoctorAvailabilityOverride>,
    actor: { id: string; name: string; role: UserRole }
  ): DoctorAvailabilityOverride {
    if (!doctorAvailabilityMap[doctorId]) {
      doctorAvailabilityMap[doctorId] = {
        isOnDuty: true,
        opdRoom: "OPD Room 204",
        dailyCapacity: 25,
        statusNotice: "On Duty",
        blockedSlots: [],
      };
    }

    Object.assign(doctorAvailabilityMap[doctorId], updates);

    HMSService.recordAuditLog(
      actor.id,
      actor.name,
      actor.role,
      "doctor.update_availability",
      `doctors/${doctorId}`,
      { doctorId, updates }
    );

    return doctorAvailabilityMap[doctorId];
  },

  // --- FOLLOW-UPS ---
  getDoctorFollowUps(doctorId: string) {
    const todayStr = new Date().toISOString().split("T")[0];
    const encounters = HMSService.getEncounters().filter(
      (e) => e.doctorId === doctorId && e.followUpDate
    );

    const todayFollowUps = encounters.filter((e) => e.followUpDate === todayStr);
    const upcomingFollowUps = encounters.filter((e) => (e.followUpDate || "") > todayStr);

    return {
      todayFollowUps,
      upcomingFollowUps,
      totalCount: encounters.length,
    };
  },

  // --- NOTIFICATIONS ---
  getDoctorNotifications(doctorId: string): NotificationRecord[] {
    const doctor = DOCTORS.find((d) => d.id === doctorId) || DOCTORS[0];
    const queues = HMSService.getQueues(doctor.id);
    const waitingCount = queues.filter((q) => q.status === "waiting").length;
    const releasedReports = HMSService.getLabOrders().filter(
      (l) => l.doctorId === doctor.id && l.isReportReleased
    );

    const notifications: NotificationRecord[] = [
      {
        id: "dnotif-1",
        userId: doctor.id,
        targetRole: "DOCTOR",
        title: "OPD Queue Active",
        message: `${waitingCount} patients are currently checked in and waiting in reception for consultation.`,
        type: "info",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: "dnotif-2",
        userId: doctor.id,
        targetRole: "DOCTOR",
        title: "Verified Pathology Report Released",
        message:
          releasedReports.length > 0
            ? `Report for ${releasedReports[0].testName} (${releasedReports[0].patientName}) has been verified and released.`
            : "All diagnostic reports for your patients are up to date.",
        type: "success",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: "dnotif-3",
        userId: doctor.id,
        targetRole: "DOCTOR",
        title: "Code Stroke Emergency Protocols",
        message: "Dedicated biplane neurovascular suite is on active standby with 128-slice CT ready.",
        type: "warning",
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      },
    ];

    return notifications;
  },
};
