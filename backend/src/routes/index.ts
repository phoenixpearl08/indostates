import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import hospitalRoutes from './hospital.routes';
import departmentsRoutes from './departments.routes';
import doctorsRoutes from './doctors.routes';
import servicesRoutes from './services.routes';
import facilitiesRoutes from './facilities.routes';
import packagesRoutes from './packages.routes';
import articlesRoutes from './articles.routes';
import eventsRoutes from './events.routes';
import galleryRoutes from './gallery.routes';
import careersRoutes from './careers.routes';
import appointmentsRoutes from './appointments.routes';
import contactRoutes from './contact.routes';
import adminRoutes from './admin.routes';
import { dataStore } from '../services/dataStore';

const router = Router();

// Health Check Endpoint (Phase 40)
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'IndoStates Hospital API v1',
  });
});

// Unified Search Endpoint (Phase 24)
router.get('/search', (req: Request, res: Response) => {
  const q = ((req.query.q as string) || '').trim().toLowerCase();

  if (!q) {
    res.status(200).json({
      success: true,
      data: {
        doctors: [],
        departments: [],
        services: [],
        articles: [],
        events: [],
      },
    });
    return;
  }

  const doctors = dataStore.doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.department.toLowerCase().includes(q) ||
      d.specialization.toLowerCase().includes(q)
  );

  const departments = dataStore.departments.filter(
    (d) => d.name.toLowerCase().includes(q) || d.shortDesc.toLowerCase().includes(q)
  );

  const services = dataStore.services.filter(
    (s) => s.title.toLowerCase().includes(q) || s.shortDesc.toLowerCase().includes(q)
  );

  const articles = dataStore.articles.filter(
    (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
  );

  const events = dataStore.events.filter(
    (e) => e.title.toLowerCase().includes(q) || e.shortDesc.toLowerCase().includes(q)
  );

  res.status(200).json({
    success: true,
    query: q,
    data: {
      doctors,
      departments,
      services,
      articles,
      events,
    },
  });
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/hospital', hospitalRoutes);
router.use('/departments', departmentsRoutes);
router.use('/doctors', doctorsRoutes);
router.use('/services', servicesRoutes);
router.use('/facilities', facilitiesRoutes);
router.use('/health-packages', packagesRoutes);
router.use('/articles', articlesRoutes);
router.use('/events', eventsRoutes);
router.use('/gallery', galleryRoutes);
router.use('/careers', careersRoutes);
router.use('/appointments', appointmentsRoutes);
router.use('/contact', contactRoutes);
router.use('/admin', adminRoutes);

export default router;
