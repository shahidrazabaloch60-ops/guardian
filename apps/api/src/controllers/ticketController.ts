import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

/**
 * POST /tickets
 * Create a new support ticket with an initial message.
 */
export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { subject, message, orderId, priority } = req.body;

    const ticket = await prisma.ticket.create({
      data: {
        subject,
        userId,
        ...(orderId && { orderId }),
        ...(priority && { priority }),
        status: 'OPEN',
        messages: {
          create: {
            message,
            userId,
            isStaff: false,
          },
        },
      },
      include: {
        messages: {
          include: {
            user: {
              select: { id: true, username: true, avatar: true },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: ticket,
      message: 'Ticket created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /tickets
 * List tickets with pagination. Admins/staff see all; users see only their own.
 */
export const getTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status as string | undefined;

    const isPrivileged = role === 'ADMIN' || role === 'STAFF';

    const where: any = {};

    // Non-privileged users can only see their own tickets
    if (!isPrivileged) {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, username: true, avatar: true },
          },
          _count: {
            select: { messages: true },
          },
        },
      }),
      prisma.ticket.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        tickets,
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
 * GET /tickets/:id
 * Get a single ticket with all messages. Verifies access.
 */
export const getTicketById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;
    const { id } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: { id: true, username: true, avatar: true },
            },
          },
        },
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });

    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    const isPrivileged = role === 'ADMIN' || role === 'STAFF';
    if (!isPrivileged && ticket.userId !== userId) {
      throw new AppError('Not authorized to view this ticket', 403);
    }

    res.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /tickets/:id/reply
 * Add a reply message to a ticket. Updates ticket status based on role.
 */
export const replyToTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;
    const { id } = req.params;
    const { message } = req.body;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    const isPrivileged = role === 'ADMIN' || role === 'STAFF';
    if (!isPrivileged && ticket.userId !== userId) {
      throw new AppError('Not authorized to reply to this ticket', 403);
    }

    if (ticket.status === 'CLOSED') {
      throw new AppError('Cannot reply to a closed ticket', 400);
    }

    // Determine new status based on who is replying
    const newStatus = isPrivileged ? 'PENDING_REPLY' : 'IN_PROGRESS';

    const [ticketMessage] = await Promise.all([
      prisma.ticketMessage.create({
        data: {
          ticketId: id,
          userId,
          message,
          isStaff: isPrivileged,
        },
        include: {
          user: {
            select: { id: true, username: true, avatar: true },
          },
        },
      }),
      prisma.ticket.update({
        where: { id },
        data: { status: newStatus },
      }),
    ]);

    res.status(201).json({
      success: true,
      data: ticketMessage,
      message: 'Reply sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /tickets/:id/assign
 * Assign a ticket to a staff member. Admin only.
 */
export const assignTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { staffId } = req.body;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    // Verify the staff member exists and has staff/admin role
    const staffUser = await prisma.user.findUnique({
      where: { id: staffId },
      select: { id: true, role: true },
    });

    if (!staffUser) {
      throw new AppError('Staff member not found', 404);
    }

    if (staffUser.role !== 'STAFF' && staffUser.role !== 'ADMIN') {
      throw new AppError('Assigned user must be a staff member or admin', 400);
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: { assignedToId: staffId },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });

    res.json({
      success: true,
      data: updatedTicket,
      message: 'Ticket assigned successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /tickets/:id/close
 * Close a ticket. Accessible by ticket owner or admin.
 */
export const closeTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;
    const { id } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    const isAdmin = role === 'ADMIN';
    if (!isAdmin && ticket.userId !== userId) {
      throw new AppError('Not authorized to close this ticket', 403);
    }

    if (ticket.status === 'CLOSED') {
      throw new AppError('Ticket is already closed', 400);
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: { status: 'CLOSED' },
    });

    res.json({
      success: true,
      data: updatedTicket,
      message: 'Ticket closed successfully',
    });
  } catch (error) {
    next(error);
  }
};
