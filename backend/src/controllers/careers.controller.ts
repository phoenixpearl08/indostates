import { Request, Response } from 'express';
import { z } from 'zod';
import { dataStore } from '../services/dataStore';

export const jobApplicationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(8, 'Phone number is required'),
  message: z.string().optional(),
});

export const getCareers = (req: Request, res: Response): void => {
  const activeCareers = dataStore.careers.filter((c) => c.status === 'ACTIVE');
  res.status(200).json({
    success: true,
    count: activeCareers.length,
    data: activeCareers,
  });
};

export const getCareerBySlug = (req: Request, res: Response): void => {
  const { slug } = req.params;
  const career = dataStore.careers.find((c) => c.slug === slug || c.id === slug);

  if (!career) {
    res.status(404).json({ success: false, message: `Career position '${slug}' not found.` });
    return;
  }

  res.status(200).json({ success: true, data: career });
};

export const applyCareer = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { name, email, phone, message } = req.body;

  const career = dataStore.careers.find((c) => c.id === id || c.slug === id);
  if (!career) {
    res.status(404).json({ success: false, message: 'Career position not found.' });
    return;
  }

  const application = {
    id: `app-${Date.now()}`,
    careerId: career.id,
    name,
    email,
    phone,
    message,
    status: 'PENDING' as const,
    createdAt: new Date().toISOString(),
  };

  dataStore.jobApplications.unshift(application);

  res.status(201).json({
    success: true,
    message: 'Your job application has been successfully submitted to IndoStates Hospital HR.',
    data: application,
  });
};
