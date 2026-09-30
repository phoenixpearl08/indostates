import { Router } from 'express';
import {
  getEvents,
  getEventBySlug,
  createEvent,
  updateEvent,
  eventSchema,
} from '../controllers/events.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

// Public
router.get('/', getEvents);
router.get('/:slug', getEventBySlug);

// Admin
router.post(
  '/',
  authenticate,
  requirePermission('CONTENT_CREATE'),
  validateBody(eventSchema),
  createEvent
);

router.put(
  '/:id',
  authenticate,
  requirePermission('CONTENT_UPDATE'),
  updateEvent
);

export default router;
