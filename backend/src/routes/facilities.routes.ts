import { Router } from 'express';
import { getFacilities } from '../controllers/facilities.controller';

const router = Router();

router.get('/', getFacilities);

export default router;
