import { Router } from 'express';
import {
  getDoctors,
  getDoctorBySlug,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  doctorSchema,
} from '../controllers/doctors.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

// Public
router.get('/', getDoctors);
router.get('/:slug', getDoctorBySlug);

// Admin
router.post(
  '/',
  authenticate,
  requirePermission('HOSPITAL_UPDATE'),
  validateBody(doctorSchema),
  createDoctor
);

router.put(
  '/:id',
  authenticate,
  requirePermission('HOSPITAL_UPDATE'),
  updateDoctor
);

router.delete(
  '/:id',
  authenticate,
  requirePermission('HOSPITAL_DELETE'),
  deleteDoctor
);

export default router;
