import { Router } from 'express';
import { login, getMe, logout, loginSchema } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { rateLimit } from '../middleware/rateLimit.middleware';

const router = Router();

// Strict rate limit for auth login endpoint (max 10 requests/minute)
router.post('/login', rateLimit(10, 60 * 1000), validateBody(loginSchema), login);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

export default router;
