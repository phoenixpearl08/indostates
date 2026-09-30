import { Request, Response } from 'express';
import { z } from 'zod';
import { dataStore } from '../services/dataStore';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const departmentSchema = z.object({
  name: z.string().min(2, 'Department name is required'),
  slug: z.string().min(2, 'Slug is required'),
  category: z.enum(['clinical', 'surgical', 'diagnostic', 'critical']).default('clinical'),
  shortDesc: z.string().min(5, 'Short description is required'),
  overview: z.string().optional(),
  icon: z.string().optional(),
  opdTimings: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const getDepartments = (req: Request, res: Response): void => {
  const { category, search } = req.query;

  let depts = [...dataStore.departments];

  if (category && typeof category === 'string' && category !== 'all') {
    depts = depts.filter((d) => d.category.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    depts = depts.filter((d) => d.name.toLowerCase().includes(q) || d.shortDesc.toLowerCase().includes(q));
  }

  res.status(200).json({
    success: true,
    count: depts.length,
    data: depts,
  });
};

export const getDepartmentBySlug = (req: Request, res: Response): void => {
  const { slug } = req.params;
  const dept = dataStore.departments.find((d) => d.slug === slug);

  if (!dept) {
    res.status(404).json({
      success: false,
      message: `Department with slug '${slug}' was not found.`,
    });
    return;
  }

  // Also include assigned doctors and services
  const doctors = dataStore.doctors.filter((doc) => doc.departmentId === dept.id);
  const services = dataStore.services.filter((srv) => srv.relatedDepartmentIds?.includes(dept.id));

  res.status(200).json({
    success: true,
    data: {
      ...dept,
      doctors,
      services,
    },
  });
};

export const createDepartment = (req: AuthenticatedRequest, res: Response): void => {
  const newDept = {
    id: `dept-${Date.now()}`,
    tagline: `Clinical Scope: ${req.body.name}`,
    keyServices: [],
    commonTreatments: [],
    facilitiesAvailable: [],
    featuredDoctorIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body,
  };

  dataStore.departments.push(newDept);

  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'CREATE', 'Department', newDept.id, { name: newDept.name });
  }

  res.status(201).json({
    success: true,
    message: 'Department created successfully.',
    data: newDept,
  });
};

export const updateDepartment = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const index = dataStore.departments.findIndex((d) => d.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, message: 'Department not found.' });
    return;
  }

  dataStore.departments[index] = {
    ...dataStore.departments[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'UPDATE', 'Department', id, req.body);
  }

  res.status(200).json({
    success: true,
    message: 'Department updated successfully.',
    data: dataStore.departments[index],
  });
};

export const deleteDepartment = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const index = dataStore.departments.findIndex((d) => d.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, message: 'Department not found.' });
    return;
  }

  // Soft delete by setting status INACTIVE
  dataStore.departments[index].status = 'INACTIVE';

  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'DEACTIVATE', 'Department', id);
  }

  res.status(200).json({
    success: true,
    message: 'Department deactivated successfully.',
  });
};
