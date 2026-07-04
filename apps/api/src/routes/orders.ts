import { Router } from 'express';
import { z } from 'zod';
import { validateSchema as validate } from '../middleware/validate';
import { authMiddleware as authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import {
  getUserOrders,
  createOrder,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController';

const router: Router = Router();

// All order routes require authentication
router.use(authenticate);

// Validation schemas
const createOrderSchema = z.object({
  body: z.object({
    serviceId: z.string().min(1, 'Service ID is required'),
    rsn: z.string().min(1, 'RuneScape name is required'),
    accountType: z.string().optional(),
    currentLevel: z.number().int().min(1).max(99).optional(),
    targetLevel: z.number().int().min(1).max(99).optional(),
    killCount: z.number().int().min(1).optional(),
    expressDelivery: z.boolean().optional(),
    couponCode: z.string().optional(),
    notes: z.string().max(1000).optional(),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      'PENDING',
      'PAID',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED',
      'REFUNDED',
    ]),
  }),
});

// GET /orders?page=1&limit=10&status=PENDING
router.get('/', getUserOrders);

// POST /orders
router.post('/', validate(createOrderSchema), createOrder);

// GET /orders/:id
router.get('/:id', getOrderById);

// PATCH /orders/:id/status — admin/staff only
router.patch('/:id/status', authorize('ADMIN', 'STAFF'), validate(updateStatusSchema), updateOrderStatus);

// PATCH /orders/:id/cancel
router.patch('/:id/cancel', cancelOrder);

export default router;
