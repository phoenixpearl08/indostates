import { Request, Response } from 'express';
import { z } from 'zod';
import { dataStore } from '../services/dataStore';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const eventSchema = z.object({
  title: z.string().min(5, 'Title is required'),
  slug: z.string().min(3, 'Slug is required'),
  category: z.enum(['Camp', 'Awareness', 'Workshop', 'Screening']).default('Camp'),
  date: z.string().min(2, 'Date is required'),
  time: z.string().min(2, 'Time is required'),
  venue: z.string().min(2, 'Venue is required'),
  departmentName: z.string().default('General Medicine'),
  shortDesc: z.string().min(5, 'Short description is required'),
  details: z.array(z.string()).default([]),
  isUpcoming: z.boolean().default(true),
  registrationOpen: z.boolean().default(true),
  status: z.enum(['UPCOMING', 'COMPLETED', 'CANCELLED']).default('UPCOMING'),
});

export const getEvents = (req: Request, res: Response): void => {
  const { category, upcoming } = req.query;
  let events = [...dataStore.events];

  if (category && typeof category === 'string' && category !== 'all') {
    events = events.filter((e) => e.category.toLowerCase() === category.toLowerCase());
  }

  if (upcoming === 'true') {
    events = events.filter((e) => e.isUpcoming);
  }

  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
};

export const getEventBySlug = (req: Request, res: Response): void => {
  const { slug } = req.params;
  const event = dataStore.events.find((e) => e.slug === slug || e.id === slug);

  if (!event) {
    res.status(404).json({ success: false, message: `Event '${slug}' not found.` });
    return;
  }

  res.status(200).json({ success: true, data: event });
};

export const createEvent = (req: AuthenticatedRequest, res: Response): void => {
  const newEvent = {
    id: `evt-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body,
  };

  dataStore.events.unshift(newEvent);

  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'CREATE', 'Event', newEvent.id, { title: newEvent.title });
  }

  res.status(201).json({
    success: true,
    message: 'Event created successfully.',
    data: newEvent,
  });
};

export const updateEvent = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const index = dataStore.events.findIndex((e) => e.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, message: 'Event not found.' });
    return;
  }

  dataStore.events[index] = {
    ...dataStore.events[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'UPDATE', 'Event', id, req.body);
  }

  res.status(200).json({
    success: true,
    message: 'Event updated successfully.',
    data: dataStore.events[index],
  });
};
