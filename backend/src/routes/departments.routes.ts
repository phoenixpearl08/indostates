import { Router } from 'express';
import {
  getDepartments,
  getDepartmentBySlug,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  departmentSchema,
} from '../controllers/departments.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

// Public
router.get('/', getDepartments);
router.get('/:slug', getDepartmentBySlug);

// Admin
router.post(
  '/',
  authenticate,
  requirePermission('HOSPITAL_UPDATE'),
  validateBody(departmentSchema),
  createDepartment
);

router.put(
  '/:id',
  authenticate,
  requirePermission('HOSPITAL_UPDATE'),
  updateDepartment
);

router.delete(
  '/:id',
  authenticate,
  requirePermission('HOSPITAL_DELETE'),
  deleteDepartment
);

export default router;
