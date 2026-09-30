import { Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

export const getFacilities = (req: Request, res: Response): void => {
  const { category } = req.query;
  let facilities = [...dataStore.facilities];

  if (category && typeof category === 'string' && category !== 'all') {
    facilities = facilities.filter((f) => f.category.toLowerCase() === category.toLowerCase());
  }

  res.status(200).json({
    success: true,
    count: facilities.length,
    data: facilities,
  });
};
