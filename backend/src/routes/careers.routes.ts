import { Router } from 'express';
import {
  getCareers,
  getCareerBySlug,
  applyCareer,
  jobApplicationSchema,
} from '../controllers/careers.controller';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

router.get('/', getCareers);
router.get('/:slug', getCareerBySlug);
router.post('/:id/apply', validateBody(jobApplicationSchema), applyCareer);

export default router;
