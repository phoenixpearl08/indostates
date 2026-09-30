import { Request, Response } from 'express';
import { z } from 'zod';
import { dataStore } from '../services/dataStore';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const contactEnquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(8, 'Phone number is required'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(5, 'Message is required'),
});

export const submitContact = (req: Request, res: Response): void => {
  const { name, email, phone, subject, message } = req.body;

  const newEnquiry = {
    id: `enq-${Date.now()}`,
    name,
    email,
    phone,
    subject,
    message,
    status: 'NEW' as const,
    createdAt: new Date().toISOString(),
  };

  dataStore.enquiries.unshift(newEnquiry);

  res.status(201).json({
    success: true,
    message: 'Thank you. Your message has been received by IndoStates Hospital reception.',
    data: newEnquiry,
  });
};

export const getEnquiries = (req: AuthenticatedRequest, res: Response): void => {
  const { status } = req.query;
  let enquiries = [...dataStore.enquiries];

  if (status && typeof status === 'string' && status !== 'all') {
    enquiries = enquiries.filter((e) => e.status === status);
  }

  res.status(200).json({
    success: true,
    count: enquiries.length,
    data: enquiries,
  });
};

export const updateEnquiryStatus = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body;

  const enquiry = dataStore.enquiries.find((e) => e.id === id);

  if (!enquiry) {
    res.status(404).json({ success: false, message: 'Contact enquiry record not found.' });
    return;
  }

  enquiry.status = status;

  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'ENQUIRY_STATUS_UPDATE', 'ContactEnquiry', id, { status });
  }

  res.status(200).json({
    success: true,
    message: `Enquiry status updated to ${status}.`,
    data: enquiry,
  });
};
