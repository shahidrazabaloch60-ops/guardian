import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

/**
 * GET /chat/sessions
 * Get all chat sessions where the current user is a participant (userId or staffId).
 */
export const getSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;

    const sessions = await prisma.chatSession.findMany({
      where: {
        OR: [
          { userId },
          { staffId: userId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
        staff: {
          select: { id: true, username: true, avatar: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            senderId: true,
            createdAt: true,
            isRead: true,
          },
        },
      },
    });

    // Transform to include lastMessage at top level
    const transformed = sessions.map((session: any) => {
      const { messages, ...rest } = session;
      return {
        ...rest,
        lastMessage: messages[0] || null,
      };
    });

    res.json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /chat/sessions/:id/messages
 * Get paginated messages for a chat session. Marks unread messages as read.
 */
export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { id } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Find session and verify access
    const session = await prisma.chatSession.findUnique({
      where: { id },
    });

    if (!session) {
      throw new AppError('Chat session not found', 404);
    }

    if (session.userId !== userId && session.staffId !== userId) {
      throw new AppError('Not authorized to access this chat session', 403);
    }

    const [messages, total] = await Promise.all([
      prisma.chatMessage.findMany({
        where: { sessionId: id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          sender: {
            select: { id: true, username: true, avatar: true },
          },
        },
      }),
      prisma.chatMessage.count({ where: { sessionId: id } }),
    ]);

    // Mark unread messages from the other user as read
    await prisma.chatMessage.updateMany({
      where: {
        sessionId: id,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    res.json({
      success: true,
      data: {
        messages,
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
 * POST /chat/sessions
 * Create a new chat session with an optional staff member.
 */
export const createSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { staffId } = req.body;

    // If staffId is provided, verify the staff user exists
    if (staffId) {
      const staffUser = await prisma.user.findUnique({
        where: { id: staffId },
        select: { id: true, role: true },
      });

      if (!staffUser) {
        throw new AppError('Staff user not found', 404);
      }
    }

    const session = await prisma.chatSession.create({
      data: {
        userId,
        ...(staffId && { staffId }),
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
        staff: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: session,
      message: 'Chat session created',
    });
  } catch (error) {
    next(error);
  }
};
