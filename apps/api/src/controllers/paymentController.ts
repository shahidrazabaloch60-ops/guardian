import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import * as stripeService from '../services/stripeService';

/**
 * POST /payments/create-intent
 * Create a Stripe payment intent for an order.
 */
export const createStripeIntent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.userId !== userId) {
      throw new AppError('Not authorized to pay for this order', 403);
    }

    if (order.status !== 'PENDING') {
      throw new AppError('Order is not in a payable state', 400);
    }

    // Create Stripe payment intent
    const paymentIntent = await stripeService.createPaymentIntent(
      Math.round(order.totalPrice * 100), // Convert to cents
      'usd',
      {
        orderId: order.id,
        userId,
      }
    );

    // Create or update payment record
    await prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        amount: order.totalPrice,
        method: 'STRIPE',
        status: 'PENDING',
        paymentIntentId: paymentIntent.id,
      },
      update: {
        paymentIntentId: paymentIntent.id,
        status: 'PENDING',
      },
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /payments/confirm
 * Confirm a payment after client-side Stripe confirmation.
 */
export const confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { orderId, paymentIntentId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.userId !== userId) {
      throw new AppError('Not authorized to confirm this payment', 403);
    }

    if (!order.payment) {
      throw new AppError('No payment record found for this order', 404);
    }

    if (order.payment.paymentIntentId !== paymentIntentId) {
      throw new AppError('Payment intent ID mismatch', 400);
    }

    // Update payment to completed
    await prisma.payment.update({
      where: { id: order.payment.id },
      data: {
        status: 'COMPLETED',
        paidAt: new Date(),
      },
    });

    // Update order status to PAID
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
      include: { payment: true },
    });

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Payment confirmed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /payments/webhook/stripe
 * Handle incoming Stripe webhook events.
 */
export const handleStripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      throw new AppError('Missing Stripe signature', 400);
    }

    const event = await stripeService.constructWebhookEvent(req.body, signature);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          // Update payment status
          await prisma.payment.updateMany({
            where: { paymentIntentId: paymentIntent.id },
            data: {
              status: 'COMPLETED',
              paidAt: new Date(),
            },
          });

          // Update order status
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'PAID' },
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any;

        await prisma.payment.updateMany({
          where: { paymentIntentId: paymentIntent.id },
          data: { status: 'FAILED' },
        });
        break;
      }

      default:
        // Unhandled event type — log and acknowledge
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    // Always return 200 to acknowledge receipt
    res.json({ success: true, message: 'Webhook received' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /payments/webhook/paypal
 * Handle incoming PayPal webhook events.
 */
export const handlePayPalWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = req.body;

    // Log the PayPal event for processing
    console.log('PayPal webhook event received:', JSON.stringify(event, null, 2));

    // TODO: Implement PayPal event handling

    res.status(200).json({
      success: true,
      message: 'PayPal webhook received',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /payments/crypto
 * Initiate a crypto payment for an order.
 */
export const handleCryptoPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.userId !== userId) {
      throw new AppError('Not authorized to pay for this order', 403);
    }

    if (order.status !== 'PENDING') {
      throw new AppError('Order is not in a payable state', 400);
    }

    // Create or update payment record for crypto
    const payment = await prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        amount: order.totalPrice,
        method: 'CRYPTO',
        status: 'PENDING',
      },
      update: {
        method: 'CRYPTO',
        status: 'PENDING',
      },
    });

    res.json({
      success: true,
      data: payment,
      message: 'Crypto payment initiated',
    });
  } catch (error) {
    next(error);
  }
};
