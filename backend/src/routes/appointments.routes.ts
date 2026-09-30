import { Router } from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  createAppointmentSchema,
  updateAppointmentStatusSchema,
} from '../controllers/appointments.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { rateLimit } from '../middleware/rateLimit.middleware';

const router = Router();

// Public: Submit appointment request with rate limiting
router.post('/', rateLimit(15, 60 * 1000), validateBody(createAppointmentSchema), createAppointment);

// Admin: View and manage appointments
router.get(
  '/admin',
  authenticate,
  requirePermission('APPOINTMENT_VIEW'),
  getAppointments
);

router.get(
  '/admin/:id',
  authenticate,
  requirePermission('APPOINTMENT_VIEW'),
  getAppointmentById
);

router.patch(
  '/admin/:id/status',
  authenticate,
  requirePermission('APPOINTMENT_UPDATE'),
  validateBody(updateAppointmentStatusSchema),
  updateAppointmentStatus
);

export default router;
