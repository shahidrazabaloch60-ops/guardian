import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

function generateAccessToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
}

function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN as any });
}

function sanitizeUser(user: any) {
  const { passwordHash, twoFactorSecret, ...sanitized } = user;
  return sanitized;
}

// POST /auth/register
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new AppError(existingUser.email === email ? 'Email already in use' : 'Username already taken', 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
      },
    });

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshTokenValue = generateRefreshToken(user.id);

    res.cookie('refreshToken', refreshTokenValue, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      data: {
        user: sanitizeUser(user),
        accessToken,
      },
      message: 'Registration successful',
    });
  } catch (error) {
    next(error);
  }
};

// POST /auth/login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.passwordHash) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      return res.json({
        success: true,
        data: {
          requiresTwoFactor: true,
          userId: user.id,
        },
      });
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshTokenValue = generateRefreshToken(user.id);

    // Update last login info
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: req.ip,
      },
    });

    res.cookie('refreshToken', refreshTokenValue, COOKIE_OPTIONS);

    res.json({
      success: true,
      data: {
        user: sanitizeUser(user),
        accessToken,
      },
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
};

// POST /auth/refresh-token
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: token } = req.body;

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      throw new AppError('User not found', 401);
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);

    res.json({
      success: true,
      data: {
        accessToken,
      },
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// POST /auth/logout
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    });

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// POST /auth/google
export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new AppError('Google authentication is not yet implemented', 501);
  } catch (error) {
    next(error);
  }
};

// POST /auth/discord
export const discordAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new AppError('Discord authentication is not yet implemented', 501);
  } catch (error) {
    next(error);
  }
};

// POST /auth/verify-email
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;

    // Stub: In production, look up the token in a verification tokens table
    // For now, find a user with this token stored somewhere or just acknowledge
    const user = await prisma.user.findFirst({
      where: { emailVerifyToken: token },
    });

    if (!user) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
      },
    });

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

// POST /auth/forgot-password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const resetToken = uuidv4();

      // Store token — in production save hashed token with expiry
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: resetToken,
          passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });

      // Log token for development (replace with sendPasswordResetEmail in production)
      console.log(`[Password Reset] Token for ${email}: ${resetToken}`);

      // TODO: sendPasswordResetEmail(email, resetToken);
    }

    // Always return the same response to prevent email enumeration
    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset email has been sent',
    });
  } catch (error) {
    next(error);
  }
};

// POST /auth/reset-password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

// POST /auth/enable-2fa
export const enableTwoFactor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;

    const secret = speakeasy.generateSecret({
      name: `GuardianRS:${userId}`,
      issuer: 'GuardianRS',
    });

    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: `GuardianRS:${userId}`,
      issuer: 'GuardianRS',
    });

    const qrCode = await QRCode.toDataURL(otpauthUrl);

    // Save the secret (not yet enabled until verified)
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret.base32,
      },
    });

    res.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode,
      },
      message: 'Scan the QR code with your authenticator app, then verify with /verify-2fa',
    });
  } catch (error) {
    next(error);
  }
};

// POST /auth/verify-2fa
export const verifyTwoFactor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { token } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.twoFactorSecret) {
      throw new AppError('Two-factor authentication has not been set up', 400);
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (!isValid) {
      throw new AppError('Invalid verification code', 400);
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
      },
    });

    res.json({
      success: true,
      message: 'Two-factor authentication enabled successfully',
    });
  } catch (error) {
    next(error);
  }
};

// POST /auth/disable-2fa
export const disableTwoFactor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { token } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.twoFactorSecret) {
      throw new AppError('Two-factor authentication is not enabled', 400);
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (!isValid) {
      throw new AppError('Invalid verification code', 400);
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    res.json({
      success: true,
      message: 'Two-factor authentication disabled successfully',
    });
  } catch (error) {
    next(error);
  }
};
