import { Router } from 'express';
import { getHealthPackages, getHealthPackageBySlug } from '../controllers/packages.controller';

const router = Router();

router.get('/', getHealthPackages);
router.get('/:slug', getHealthPackageBySlug);

export default router;
