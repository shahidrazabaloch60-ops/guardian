import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware as authenticate } from '../middleware/auth';
import { validateSchema as validate } from '../middleware/validate';
import {
  getProfile,
  updateProfile,
  changePassword,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../controllers/userController';

const router: Router = Router();

// All routes require authentication
router.use(authenticate);

// GET /me — Get current user profile
router.get('/me', getProfile);

const updateProfileSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(32).optional(),
    avatar: z.string().url().optional(),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }),
});

const getNotificationsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(v => v ? parseInt(v) : undefined),
    limit: z.string().optional().transform(v => v ? parseInt(v) : undefined),
  }),
});

const markNotificationReadSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

// PATCH /me — Update current user profile
router.patch(
  '/me',
  validate(updateProfileSchema),
  updateProfile
);

// PATCH /change-password — Change password
router.patch(
  '/change-password',
  validate(changePasswordSchema),
  changePassword
);

// GET /notifications — Get paginated notifications
router.get(
  '/notifications',
  validate(getNotificationsSchema),
  getNotifications
);

// PATCH /notifications/:id/read — Mark single notification as read
router.patch(
  '/notifications/:id/read',
  validate(markNotificationReadSchema),
  markNotificationRead
);

// PATCH /notifications/read-all — Mark all notifications as read
router.patch('/notifications/read-all', markAllNotificationsRead);

export default router;
