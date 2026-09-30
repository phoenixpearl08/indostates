import { Request, Response } from 'express';
import { z } from 'zod';
import { dataStore } from '../services/dataStore';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const doctorSchema = z.object({
  name: z.string().min(2, 'Doctor name is required'),
  slug: z.string().min(2, 'Slug is required'),
  designation: z.string().min(2, 'Designation is required'),
  qualification: z.string().min(2, 'Qualification is required'),
  specialization: z.string().min(2, 'Specialization is required'),
  subSpecialization: z.string().optional(),
  department: z.string().min(2, 'Department is required'),
  departmentId: z.string().min(2, 'Department ID is required'),
  experience: z.string().min(1, 'Experience is required'),
  biography: z.string().min(5, 'Biography is required'),
  expertise: z.array(z.string()).default([]),
  consultationTimings: z.string().min(2, 'Consultation timings required'),
  consultationLocation: z.string().optional(),
  languages: z.array(z.string()).default([]),
  profileImage: z.string().nullable().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const getDoctors = (req: Request, res: Response): void => {
  const { department, specialization, search, page = '1', limit = '50' } = req.query;

  let docs = [...dataStore.doctors];

  if (department && typeof department === 'string' && department !== 'all') {
    docs = docs.filter(
      (d) => d.departmentId === department || d.department.toLowerCase() === department.toLowerCase()
    );
  }

  if (specialization && typeof specialization === 'string' && specialization !== 'all') {
    docs = docs.filter((d) => d.specialization.toLowerCase().includes(specialization.toLowerCase()));
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    docs = docs.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.department.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.expertise?.some((e) => e.toLowerCase().includes(q))
    );
  }

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 50;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = docs.slice(startIndex, startIndex + limitNum);

  res.status(200).json({
    success: true,
    total: docs.length,
    page: pageNum,
    limit: limitNum,
    data: paginated,
  });
};

export const getDoctorBySlug = (req: Request, res: Response): void => {
  const { slug } = req.params;
  const doc = dataStore.doctors.find((d) => d.slug === slug || d.id === slug);

  if (!doc) {
    res.status(404).json({
      success: false,
      message: `Doctor record for '${slug}' was not found.`,
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: doc,
  });
};

export const createDoctor = (req: AuthenticatedRequest, res: Response): void => {
  const body = req.body;
  const newDoctor = {
    id: `doc-${Date.now()}`,
    title: body.designation,
    departmentName: body.department,
    experienceYears: body.experience,
    areasOfExpertise: body.expertise || [],
    about: body.biography,
    opdTimings: body.consultationTimings,
    opdRoom: body.consultationLocation || '[HOSPITAL TO PROVIDE OPD ROOM]',
    location: body.consultationLocation || 'IndoStates Hospital Main Campus',
    profilePhoto: body.profileImage || null,
    appointmentAvailability: '[HOSPITAL TO CONFIRM APPOINTMENT SCHEDULE]',
    isDemoPlaceholder: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...body,
  };

  dataStore.doctors.push(newDoctor);

  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'CREATE', 'Doctor', newDoctor.id, { name: newDoctor.name });
  }

  res.status(201).json({
    success: true,
    message: 'Doctor record created successfully.',
    data: newDoctor,
  });
};

export const updateDoctor = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const index = dataStore.doctors.findIndex((d) => d.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, message: 'Doctor not found.' });
    return;
  }

  dataStore.doctors[index] = {
    ...dataStore.doctors[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'UPDATE', 'Doctor', id, req.body);
  }

  res.status(200).json({
    success: true,
    message: 'Doctor record updated successfully.',
    data: dataStore.doctors[index],
  });
};

export const deleteDoctor = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const index = dataStore.doctors.findIndex((d) => d.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, message: 'Doctor not found.' });
    return;
  }

  dataStore.doctors[index].status = 'INACTIVE';

  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'DEACTIVATE', 'Doctor', id);
  }

  res.status(200).json({
    success: true,
    message: 'Doctor deactivated successfully.',
  });
};
