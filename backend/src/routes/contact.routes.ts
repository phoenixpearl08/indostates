import { Router } from 'express';
import {
  submitContact,
  getEnquiries,
  updateEnquiryStatus,
  contactEnquirySchema,
} from '../controllers/contact.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { rateLimit } from '../middleware/rateLimit.middleware';

const router = Router();

// Public: Submit enquiry with rate limiting
router.post('/', rateLimit(10, 60 * 1000), validateBody(contactEnquirySchema), submitContact);

// Admin: View and update enquiries
router.get(
  '/admin',
  authenticate,
  authorize(['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'CONTENT_MANAGER']),
  getEnquiries
);

router.patch(
  '/admin/:id/status',
  authenticate,
  authorize(['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'CONTENT_MANAGER']),
  updateEnquiryStatus
);

export default router;
