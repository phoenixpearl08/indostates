import { Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

export const getHealthPackages = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    count: dataStore.healthPackages.length,
    data: dataStore.healthPackages,
  });
};

export const getHealthPackageBySlug = (req: Request, res: Response): void => {
  const { slug } = req.params;
  const pkg = dataStore.healthPackages.find((p) => p.slug === slug || p.id === slug);

  if (!pkg) {
    res.status(404).json({ success: false, message: `Health Package '${slug}' not found.` });
    return;
  }

  res.status(200).json({ success: true, data: pkg });
};
