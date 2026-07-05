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
      include: { payments: true },
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
    const existingPayment = await prisma.payment.findFirst({
      where: { orderId: order.id }
    });

    if (existingPayment) {
      await prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          transactionId: paymentIntent.id,
          status: 'PENDING',
        },
      });
    } else {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          userId,
          amount: order.totalPrice,
          method: 'STRIPE',
          status: 'PENDING',
          transactionId: paymentIntent.id,
        },
      });
    }

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
      include: { payments: true },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.userId !== userId) {
      throw new AppError('Not authorized to confirm this payment', 403);
    }

    const payment = order.payments?.[0];

    if (!payment) {
      throw new AppError('No payment record found for this order', 404);
    }

    if (payment.transactionId !== paymentIntentId) {
      throw new AppError('Payment intent ID mismatch', 400);
    }

    // Update payment to completed
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
      },
    });

    // Update order status to PAID
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
      include: { payments: true },
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
          // Update payment status using transactionId index
          await prisma.payment.updateMany({
            where: { transactionId: paymentIntent.id },
            data: {
              status: 'COMPLETED',
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
          where: { transactionId: paymentIntent.id },
          data: { status: 'FAILED' },
        });
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

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
    console.log('PayPal webhook event received:', JSON.stringify(event, null, 2));

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

    const existingPayment = await prisma.payment.findFirst({
      where: { orderId: order.id }
    });

    let payment;
    if (existingPayment) {
      payment = await prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          method: 'CRYPTO',
          status: 'PENDING',
        },
      });
    } else {
      payment = await prisma.payment.create({
        data: {
          orderId: order.id,
          userId,
          amount: order.totalPrice,
          method: 'CRYPTO',
          status: 'PENDING',
        },
      });
    }

    res.json({
      success: true,
      data: payment,
      message: 'Crypto payment initiated',
    });
  } catch (error) {
    next(error);
  }
};
