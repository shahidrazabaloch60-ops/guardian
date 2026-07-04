import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

/**
 * GET /users/me
 * Get the authenticated user's profile.
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        role: true,
        isVerified: true,
        isBanned: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /users/me
 * Update the authenticated user's profile (username, avatar).
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { username, avatar } = req.body;

    // Check username uniqueness if provided
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          id: { not: userId },
        },
      });

      if (existingUser) {
        throw new AppError('Username is already taken', 409);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username !== undefined && { username }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /users/change-password
 * Change the authenticated user's password.
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, passwordHash: true },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 401);
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /users/notifications
 * Get paginated notifications for the authenticated user.
 */
export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
    ]);

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /users/notifications/:id/read
 * Mark a single notification as read.
 */
export const markNotificationRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    if (notification.userId !== userId) {
      throw new AppError('Not authorized to update this notification', 403);
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.json({
      success: true,
      data: updated,
      message: 'Notification marked as read',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /users/notifications/read-all
 * Mark all notifications as read for the authenticated user.
 */
export const markAllNotificationsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;

    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    res.json({
      success: true,
      message: `${result.count} notification(s) marked as read`,
    });
  } catch (error) {
    next(error);
  }
};
