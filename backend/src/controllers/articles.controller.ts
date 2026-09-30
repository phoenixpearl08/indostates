import { Request, Response } from 'express';
import { z } from 'zod';
import { dataStore } from '../services/dataStore';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const articleSchema = z.object({
  title: z.string().min(5, 'Title is required'),
  slug: z.string().min(3, 'Slug is required'),
  excerpt: z.string().min(10, 'Excerpt is required'),
  content: z.array(z.string()).min(1, 'Content paragraphs required'),
  category: z.string().min(2, 'Category is required'),
  authorName: z.string().default('IndoStates Medical Editorial Team'),
  authorRole: z.string().default('Clinical Review Board'),
  readTime: z.string().default('4 min read'),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'UNPUBLISHED']).default('PUBLISHED'),
});

export const getArticles = (req: Request, res: Response): void => {
  const { category, search, featured } = req.query;
  let articles = [...dataStore.articles];

  // For public visitors, show only PUBLISHED
  articles = articles.filter((a) => a.status === 'PUBLISHED');

  if (category && typeof category === 'string' && category !== 'All') {
    articles = articles.filter((a) => a.category.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    articles = articles.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q)));
  }

  if (featured === 'true') {
    articles = articles.filter((a) => a.isFeatured);
  }

  res.status(200).json({
    success: true,
    count: articles.length,
    data: articles,
  });
};

export const getArticleBySlug = (req: Request, res: Response): void => {
  const { slug } = req.params;
  const article = dataStore.articles.find((a) => a.slug === slug || a.id === slug);

  if (!article) {
    res.status(404).json({ success: false, message: `Article '${slug}' not found.` });
    return;
  }

  res.status(200).json({ success: true, data: article });
};

export const createArticle = (req: AuthenticatedRequest, res: Response): void => {
  const newArticle = {
    id: `art-${Date.now()}`,
    publishedDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body,
  };

  dataStore.articles.unshift(newArticle);

  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'CREATE', 'Article', newArticle.id, { title: newArticle.title });
  }

  res.status(201).json({
    success: true,
    message: 'Article created successfully.',
    data: newArticle,
  });
};

export const updateArticle = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const index = dataStore.articles.findIndex((a) => a.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, message: 'Article not found.' });
    return;
  }

  dataStore.articles[index] = {
    ...dataStore.articles[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'UPDATE', 'Article', id, req.body);
  }

  res.status(200).json({
    success: true,
    message: 'Article updated successfully.',
    data: dataStore.articles[index],
  });
};
