import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware as authenticate } from '../middleware/auth';
import { validateSchema as validate } from '../middleware/validate';
import {
  getSessions,
  getMessages,
  createSession,
  visitorInit,
  visitorSend,
  visitorPoll,
  adminTakeover,
  adminSend,
} from '../controllers/chatController';

const router: Router = Router();

// Public visitor routes
router.post('/visitor/init', visitorInit);
router.post('/visitor/send', visitorSend);
router.get('/visitor/poll', visitorPoll);

// All routes below require authentication
router.use(authenticate);

// GET /sessions — Get all chat sessions for the current user
router.get('/sessions', getSessions);

// POST /sessions/:id/takeover — Admin takeover session
router.post('/sessions/:id/takeover', adminTakeover);

// POST /sessions/:id/send — Admin send message
router.post('/sessions/:id/send', adminSend);

// Validation schemas
const getMessagesSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({
    page: z.string().optional().transform(v => v ? parseInt(v) : undefined),
    limit: z.string().optional().transform(v => v ? parseInt(v) : undefined),
  }),
});

const createSessionSchema = z.object({
  body: z.object({
    staffId: z.string().optional(),
  }),
});

// GET /sessions/:id/messages — Get paginated messages for a session
router.get(
  '/sessions/:id/messages',
  validate(getMessagesSchema),
  getMessages
);

// POST /sessions — Create a new chat session
router.post(
  '/sessions',
  validate(createSessionSchema),
  createSession
);

export default router;
