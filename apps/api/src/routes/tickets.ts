import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware as authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { validateSchema as validate } from '../middleware/validate';
import {
  createTicket,
  getTickets,
  getTicketById,
  replyToTicket,
  assignTicket,
  closeTicket,
} from '../controllers/ticketController';

const router: Router = Router();

// All routes require authentication
router.use(authenticate);

const createTicketSchema = z.object({
  body: z.object({
    subject: z.string().min(1, 'Subject is required').max(200),
    message: z.string().min(1, 'Message is required'),
    orderId: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  }),
});

const getTicketsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(v => v ? parseInt(v) : undefined),
    limit: z.string().optional().transform(v => v ? parseInt(v) : undefined),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'PENDING_REPLY', 'CLOSED']).optional(),
  }),
});

const getTicketByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

const replyToTicketSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    message: z.string().min(1, 'Message is required'),
  }),
});

const assignTicketSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    staffId: z.string().min(1, 'Staff ID is required'),
  }),
});

// POST / — Create a new support ticket
router.post(
  '/',
  validate(createTicketSchema),
  createTicket
);

// GET / — List tickets (paginated, filterable)
router.get(
  '/',
  validate(getTicketsSchema),
  getTickets
);

// GET /:id — Get ticket details
router.get(
  '/:id',
  validate(getTicketByIdSchema),
  getTicketById
);

// POST /:id/reply — Reply to a ticket
router.post(
  '/:id/reply',
  validate(replyToTicketSchema),
  replyToTicket
);

// PATCH /:id/assign — Assign ticket to staff (admin only)
router.patch(
  '/:id/assign',
  authorize('ADMIN'),
  validate(assignTicketSchema),
  assignTicket
);

// PATCH /:id/close — Close a ticket
router.patch(
  '/:id/close',
  validate(getTicketByIdSchema),
  closeTicket
);

export default router;
