import { Router } from 'express';
import { z } from 'zod';
import { validateSchema as validate } from '../middleware/validate';
import { authMiddleware as authenticate } from '../middleware/auth';
import { authLimiter, authLimiter as strictLimiter } from '../middleware/rateLimiter';
import {
  register,
  login,
  refreshToken,
  logout,
  googleAuth,
  discordAuth,
  verifyEmail,
  forgotPassword,
  resetPassword,
  enableTwoFactor,
  verifyTwoFactor,
  disableTwoFactor,
} from '../controllers/authController';

const router: Router = Router();

// Validation schemas
const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters').max(32),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Verification token is required'),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

const twoFactorTokenSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
  }),
});

// Public auth routes
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh-token', validate(refreshTokenSchema), refreshToken);
router.post('/logout', authenticate, logout);

// OAuth stubs
router.post('/google', googleAuth);
router.post('/discord', discordAuth);

// Email verification
router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);

// Password reset
router.post('/forgot-password', strictLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', strictLimiter, validate(resetPasswordSchema), resetPassword);

// Two-factor authentication
router.post('/enable-2fa', authenticate, enableTwoFactor);
router.post('/verify-2fa', authenticate, validate(twoFactorTokenSchema), verifyTwoFactor);
router.post('/disable-2fa', authenticate, validate(twoFactorTokenSchema), disableTwoFactor);

export default router;
