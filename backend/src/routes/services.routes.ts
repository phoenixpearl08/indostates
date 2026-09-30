import { Router } from 'express';
import { getServices, getServiceBySlug } from '../controllers/services.controller';

const router = Router();

router.get('/', getServices);
router.get('/:slug', getServiceBySlug);

export default router;
