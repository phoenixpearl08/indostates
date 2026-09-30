import { Router } from 'express';
import {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  articleSchema,
} from '../controllers/articles.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

// Public
router.get('/', getArticles);
router.get('/:slug', getArticleBySlug);

// Admin
router.post(
  '/',
  authenticate,
  requirePermission('CONTENT_CREATE'),
  validateBody(articleSchema),
  createArticle
);

router.put(
  '/:id',
  authenticate,
  requirePermission('CONTENT_UPDATE'),
  updateArticle
);

export default router;
