import { Router } from 'express';
import { getHospital, updateHospital, updateHospitalSchema } from '../controllers/hospital.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

router.get('/', getHospital);
router.put('/', authenticate, requirePermission('HOSPITAL_UPDATE'), validateBody(updateHospitalSchema), updateHospital);

export default router;
