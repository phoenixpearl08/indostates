import { Router } from 'express';
import {
  getDashboardStats,
  getAuditLogs,
  uploadFile,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getRoles,
  assignRole,
  getSettings,
  updateSettings,
  getReports,
} from '../controllers/admin.controller';
import {
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  updateAppointmentStatusSchema,
} from '../controllers/appointments.controller';
import { getEnquiries, updateEnquiryStatus } from '../controllers/contact.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { upload } from '../middleware/upload.middleware';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

// Protect all admin endpoints with authoritative JWT authentication
router.use(authenticate);

// 1. Dashboard Overview
router.get('/dashboard', requirePermission('DASHBOARD_VIEW'), getDashboardStats);

// 2. Security Audit Trail
router.get('/audit-logs', requirePermission('AUDIT_LOG_VIEW'), getAuditLogs);

// 3. User Administration
router.get('/users', requirePermission('USER_VIEW'), getUsers);
router.post('/users', requirePermission('USER_CREATE'), createUser);
router.put('/users/:id', requirePermission('USER_UPDATE'), updateUser);
router.delete('/users/:id', requirePermission('USER_DELETE'), deleteUser);

// 4. Role Administration
router.get('/roles', requirePermission('ROLE_VIEW'), getRoles);
router.post('/roles/assign', requirePermission('ROLE_ASSIGN'), assignRole);

// 5. System Settings
router.get('/settings', requirePermission('SETTINGS_VIEW'), getSettings);
router.put('/settings', requirePermission('SETTINGS_UPDATE'), updateSettings);

// 6. Reports & Aggregations
router.get('/reports', requirePermission('REPORT_VIEW'), getReports);

// 7. Secure File Upload
router.post('/upload', requirePermission(['CONTENT_CREATE', 'HOSPITAL_UPDATE']), upload.single('file'), uploadFile);

// 8. Appointment Management
router.get('/appointments', requirePermission('APPOINTMENT_VIEW'), getAppointments);
router.get('/appointments/:id', requirePermission('APPOINTMENT_VIEW'), getAppointmentById);
router.patch(
  '/appointments/:id/status',
  requirePermission('APPOINTMENT_UPDATE'),
  validateBody(updateAppointmentStatusSchema),
  updateAppointmentStatus
);

// 9. Public Inquiries Management
router.get('/enquiries', requirePermission(['CONTENT_VIEW', 'HOSPITAL_VIEW']), getEnquiries);
router.patch(
  '/enquiries/:id/status',
  requirePermission(['CONTENT_UPDATE', 'HOSPITAL_UPDATE']),
  updateEnquiryStatus
);

export default router;
