import { Request, Response } from 'express';
import { z } from 'zod';
import { dataStore } from '../services/dataStore';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const updateHospitalSchema = z.object({
  name: z.string().optional(),
  tagline: z.string().optional(),
  subtagline: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  emergencyPhone: z.string().optional(),
  email: z.string().email().optional(),
  workingHours: z.string().optional(),
  opdHours: z.string().optional(),
  visitingHours: z.string().optional(),
  googleMapsUrl: z.string().optional(),
  socialLinks: z.record(z.string()).optional(),
});

export const getHospital = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: dataStore.hospital,
  });
};

export const updateHospital = (req: AuthenticatedRequest, res: Response): void => {
  dataStore.hospital = {
    ...dataStore.hospital,
    ...req.body,
  };

  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'UPDATE', 'Hospital', dataStore.hospital.id, req.body);
  }

  res.status(200).json({
    success: true,
    message: 'Hospital information updated successfully.',
    data: dataStore.hospital,
  });
};
