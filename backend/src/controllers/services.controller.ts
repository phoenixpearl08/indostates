import { Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

export const getServices = (req: Request, res: Response): void => {
  const { category, search } = req.query;
  let services = [...dataStore.services];

  if (category && typeof category === 'string' && category !== 'all') {
    services = services.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    services = services.filter((s) => s.title.toLowerCase().includes(q) || s.shortDesc.toLowerCase().includes(q));
  }

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
};

export const getServiceBySlug = (req: Request, res: Response): void => {
  const { slug } = req.params;
  const srv = dataStore.services.find((s) => s.slug === slug || s.id === slug);

  if (!srv) {
    res.status(404).json({ success: false, message: `Service '${slug}' was not found.` });
    return;
  }

  res.status(200).json({ success: true, data: srv });
};
