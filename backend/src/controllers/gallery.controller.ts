import { Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

export const getGallery = (req: Request, res: Response): void => {
  const { category } = req.query;
  let items = [...dataStore.gallery];

  if (category && typeof category === 'string' && category !== 'All') {
    items = items.filter((g) => g.category.toLowerCase() === category.toLowerCase());
  }

  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
};
