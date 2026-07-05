import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

/**
 * Helper utility to safely narrow parameters that might be arrays to a single string value.
 * If the value is an array, it returns the first element; otherwise returns the value as-is.
 */
function toSingleString(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

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
            message: true,
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
    const id = toSingleString(req.params.id);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    if (!id) {
      throw new AppError('Invalid session ID query parameter', 400);
    }

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

/**
 * POST /chat/visitor/init
 * Initialize visitor chat session publicly.
 */
export const visitorInit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { visitorId, url, browser, os } = req.body;
    let visitor;

    if (visitorId) {
      visitor = await prisma.visitor.findUnique({ where: { id: visitorId } });
    }

    if (!visitor) {
      visitor = await prisma.visitor.create({
        data: {
          ipAddress: req.ip || 'Unknown',
          browser: browser || 'Unknown',
          os: os || 'Unknown',
          currentPage: url || 'Unknown',
        }
      });
    } else {
      visitor = await prisma.visitor.update({
        where: { id: visitor.id },
        data: { currentPage: url, updatedAt: new Date() }
      });
    }

    let session = await prisma.chatSession.findFirst({
      where: { visitorId: visitor.id, status: { not: 'CLOSED' } },
      include: { staff: true }
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          visitorId: visitor.id,
          status: 'WAITING_FOR_AGENT'
        },
        include: { staff: true }
      });

      const welcomeSetting = await prisma.siteSetting.findUnique({
        where: { key: 'chat_welcome_message' }
      });
      const welcomeMsgText = welcomeSetting?.value || "👋 Hi! Welcome to our OSRS boosting service. How can I help you today?";

      await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          senderType: 'AI',
          message: welcomeMsgText
        }
      });
    }

    const history = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: 'asc' }
    });

    res.json({
      success: true,
      data: {
        visitorId: visitor.id,
        sessionId: session.id,
        history,
        adminName: session.staff ? session.staff.username : null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /chat/visitor/send
 * Public visitor send message.
 */
export const visitorSend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { visitorId, sessionId, message } = req.body;

    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId, visitorId, status: { not: 'CLOSED' } }
    });

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    const newMsg = await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        senderType: 'VISITOR',
        message
      }
    });

    res.json({
      success: true,
      data: newMsg
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /chat/visitor/poll
 * Public visitor poll messages.
 */
export const visitorPoll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { visitorId, sessionId } = req.query;

    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId as string, visitorId: visitorId as string, status: { not: 'CLOSED' } },
      include: { staff: true }
    });

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: 'asc' }
    });

    res.json({
      success: true,
      data: {
        messages,
        adminName: session.staff ? session.staff.username : null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /chat/admin/active-sessions
 * Get all active sessions for admin.
 */
export const getActiveSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: { status: { not: 'CLOSED' } },
      include: {
        visitor: true,
        user: { select: { username: true, email: true, avatar: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /chat/admin/sessions/:sessionId/messages
 * Get all messages for a session.
 */
export const getSessionMessages = async (req: Request, res: Response, next: NextFunction) => {
  const sessionId = req.params.sessionId as string;
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { username: true, avatar: true, role: true } }
      }
    });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /chat/admin/visitors
 * Get active visitors.
 */
export const getActiveVisitors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const visitors = await prisma.visitor.findMany({
      where: { updatedAt: { gte: thirtyMinutesAgo } },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(visitors);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /chat/admin/leads
 * Get leads.
 */
export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: { visitor: true }
    });
    res.json(leads);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /chat/admin/sessions/:sessionId
 * Delete chat session.
 */
export const deleteSession = async (req: Request, res: Response, next: NextFunction) => {
  const sessionId = req.params.sessionId as string;
  try {
    await prisma.chatMessage.deleteMany({
      where: { sessionId }
    });
    await prisma.chatSession.delete({
      where: { id: sessionId }
    });
    res.json({ success: true, message: 'Chat session deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /chat/admin/sessions/:id/takeover
 * Admin takeover session.
 */
export const adminTakeover = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;

    const session = await prisma.chatSession.findUnique({
      where: { id }
    });

    if (!session) {
      throw new AppError('Chat session not found', 404);
    }

    await prisma.chatSession.update({
      where: { id },
      data: {
        status: 'ADMIN_HANDLING',
        staffId: userId
      }
    });

    const adminUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true }
    });
    const username = adminUser?.username || 'Admin';

    const sysMsg = await prisma.chatMessage.create({
      data: {
        sessionId: id,
        senderType: 'SYSTEM',
        message: `${username} joined the conversation.`
      }
    });

    res.json({
      success: true,
      data: sysMsg
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /chat/admin/sessions/:id/send
 * Admin send message.
 */
export const adminSend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const id = req.params.id as string;
    const { message } = req.body;

    const session = await prisma.chatSession.findUnique({
      where: { id }
    });

    if (!session) {
      throw new AppError('Chat session not found', 404);
    }

    const newMsg = await prisma.chatMessage.create({
      data: {
        sessionId: id,
        senderType: 'ADMIN',
        senderId: userId,
        message
      }
    });

    res.json({
      success: true,
      data: newMsg
    });
  } catch (error) {
    next(error);
  }
};
