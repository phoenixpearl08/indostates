import { Request, Response } from 'express';
import { z } from 'zod';
import { dataStore } from '../services/dataStore';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const createAppointmentSchema = z.object({
  departmentId: z.string().optional(),
  departmentName: z.string().optional(),
  doctorId: z.string().optional(),
  doctorName: z.string().optional(),
  preferredDate: z.string().min(1, 'Please select a consultation date'),
  preferredTimeSlot: z.string().optional(),
  preferredTime: z.string().optional(),
  patientFullName: z.string().optional(),
  patientName: z.string().optional(),
  patientPhone: z.string().optional(),
  phone: z.string().optional(),
  patientEmail: z.string().optional(),
  email: z.string().optional(),
  patientGender: z.string().optional(),
  patientDob: z.string().optional(),
  patientType: z.enum(['new', 'existing']).default('new'),
  visitReason: z.string().optional(),
  reason: z.string().optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'RESCHEDULED', 'CANCELLED', 'COMPLETED']),
  adminNotes: z.string().optional(),
});

export const createAppointment = (req: Request, res: Response): void => {
  const body = req.body;

  const patientName = body.patientFullName || body.patientName || 'Hospital Patient';
  const patientPhone = body.patientPhone || body.phone || '[HOSPITAL TO CONTACT]';
  const patientEmail = body.patientEmail || body.email || '';
  const preferredTime = body.preferredTimeSlot || body.preferredTime || '10:00 AM - 11:00 AM';
  const reason = body.visitReason || body.reason || 'Consultation review';
  const departmentId = body.departmentId || 'dept-cardiology';
  const doctorId = body.doctorId || 'doc-cardio-1';

  // Resolve department & doctor names
  const dept = dataStore.departments.find((d) => d.id === departmentId);
  const doc = dataStore.doctors.find((d) => d.id === doctorId);

  const deptName = dept ? dept.name : body.departmentName || 'Cardiology & Vascular Sciences';
  const docName = doc ? doc.name : body.doctorName || 'Senior Consultant';

  // Generate unique appointment number
  const serial = (dataStore.appointments.length + 1).toString().padStart(4, '0');
  const appointmentNumber = `IND-2026-${serial}`;
  const requestId = `REQ-${Date.now().toString().slice(-6)}`;

  const newAppointment = {
    id: `appt-${Date.now()}`,
    appointmentNumber,
    patientName,
    phone: patientPhone,
    email: patientEmail,
    patientGender: body.patientGender || 'Not Specified',
    patientDob: body.patientDob,
    patientType: body.patientType || 'new',
    departmentId,
    departmentName: deptName,
    doctorId,
    doctorName: docName,
    preferredDate: body.preferredDate,
    preferredTimeSlot: preferredTime,
    reason,
    status: 'PENDING' as const,
    adminNotes: undefined, // Never expose admin notes publicly
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dataStore.appointments.unshift(newAppointment);

  // Return public receipt
  res.status(201).json({
    success: true,
    message: 'Appointment request received. Hospital confirmation will be provided through the official communication channel.',
    data: {
      requestId,
      appointmentNumber,
      status: 'Pending Verification',
      data: {
        ...newAppointment,
        patientFullName: newAppointment.patientName,
        patientPhone: newAppointment.phone,
        patientEmail: newAppointment.email,
        visitReason: newAppointment.reason,
      },
    },
  });
};

export const getAppointments = (req: AuthenticatedRequest, res: Response): void => {
  const { status, search, departmentId, doctorId, page = '1', limit = '50' } = req.query;

  let appts = [...dataStore.appointments];

  if (status && typeof status === 'string' && status !== 'all') {
    appts = appts.filter((a) => a.status === status);
  }

  if (departmentId && typeof departmentId === 'string' && departmentId !== 'all') {
    appts = appts.filter((a) => a.departmentId === departmentId);
  }

  if (doctorId && typeof doctorId === 'string' && doctorId !== 'all') {
    appts = appts.filter((a) => a.doctorId === doctorId);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    appts = appts.filter(
      (a) =>
        a.appointmentNumber.toLowerCase().includes(q) ||
        a.patientName.toLowerCase().includes(q) ||
        a.phone.includes(q) ||
        a.doctorName.toLowerCase().includes(q)
    );
  }

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 50;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = appts.slice(startIndex, startIndex + limitNum);

  res.status(200).json({
    success: true,
    total: appts.length,
    page: pageNum,
    limit: limitNum,
    data: paginated,
  });
};

export const getAppointmentById = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const appt = dataStore.appointments.find((a) => a.id === id || a.appointmentNumber === id);

  if (!appt) {
    res.status(404).json({ success: false, message: 'Appointment record not found.' });
    return;
  }

  res.status(200).json({ success: true, data: appt });
};

export const updateAppointmentStatus = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const appt = dataStore.appointments.find((a) => a.id === id || a.appointmentNumber === id);

  if (!appt) {
    res.status(404).json({ success: false, message: 'Appointment record not found.' });
    return;
  }

  const prevStatus = appt.status;
  appt.status = status;
  if (adminNotes !== undefined) {
    appt.adminNotes = adminNotes;
  }
  appt.updatedAt = new Date().toISOString();

  if (req.user) {
    dataStore.recordAuditLog(
      req.user.userId,
      req.user.name,
      'APPOINTMENT_STATUS_UPDATE',
      'Appointment',
      appt.id,
      { prevStatus, newStatus: status, appointmentNumber: appt.appointmentNumber }
    );
  }

  res.status(200).json({
    success: true,
    message: `Appointment status updated from ${prevStatus} to ${status}.`,
    data: appt,
  });
};
