import { Router } from 'express';
import express from 'express';
import { z } from 'zod';
import { authMiddleware as authenticate } from '../middleware/auth';
import { validateSchema as validate } from '../middleware/validate';
import {
  createStripeIntent,
  confirmPayment,
  handleStripeWebhook,
  handlePayPalWebhook,
  handleCryptoPayment,
} from '../controllers/paymentController';

const router: Router = Router();

const createIntentSchema = z.object({
  body: z.object({
    orderId: z.string().min(1, 'Order ID is required'),
  }),
});

const confirmPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().min(1, 'Order ID is required'),
    paymentIntentId: z.string().min(1, 'Payment intent ID is required'),
  }),
});

const cryptoSchema = z.object({
  body: z.object({
    orderId: z.string().min(1, 'Order ID is required'),
  }),
});

// POST /create-intent — Create a Stripe payment intent (authenticated)
router.post(
  '/create-intent',
  authenticate,
  validate(createIntentSchema),
  createStripeIntent
);

// POST /confirm — Confirm a payment (authenticated)
router.post(
  '/confirm',
  authenticate,
  validate(confirmPaymentSchema),
  confirmPayment
);

// POST /webhook/stripe — Stripe webhook (raw body required for signature verification)
router.post(
  '/webhook/stripe',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

// POST /webhook/paypal — PayPal webhook
router.post('/webhook/paypal', handlePayPalWebhook);

// POST /crypto — Initiate crypto payment (authenticated)
router.post(
  '/crypto',
  authenticate,
  validate(cryptoSchema),
  handleCryptoPayment
);

export default router;
