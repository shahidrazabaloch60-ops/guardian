import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import {
  calculateOrderPrice,
  applyCoupon,
} from '../services/priceCalculator';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const orderInclude = {
  service: {
    include: {
      category: true,
      skill: true,
      boss: true,
      quest: true,
      minigame: true,
    },
  },
  payment: true,
  review: true,
};

// GET /orders
export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const page = Math.max(1, parseInt(req.query.page as string) || DEFAULT_PAGE);
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit as string) || DEFAULT_LIMIT));
    const { status } = req.query;

    const where: any = {
      userId,
    };

    if (status) {
      where.status = status as string;
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: orderInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /orders
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const {
      serviceId,
      rsn,
      accountType,
      currentLevel,
      targetLevel,
      killCount,
      expressDelivery,
      couponCode,
      notes,
    } = req.body;

    // Find the service with all relations
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        skill: true,
        boss: true,
        quest: true,
        minigame: true,
        category: true,
      },
    });

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    if (!service.active) {
      throw new AppError('This service is currently unavailable', 400);
    }

    // Calculate price based on service type
    let price: number;

    const priceParams: any = {
      basePrice: service.basePrice || service.price || 0,
      accountType: accountType || 'MAIN',
      expressPriority: expressDelivery || false,
    };

    if (service.skill && currentLevel !== undefined && targetLevel !== undefined) {
      priceParams.serviceType = 'SKILL';
      priceParams.currentLevel = currentLevel;
      priceParams.targetLevel = targetLevel;
    } else if (service.boss && killCount !== undefined) {
      priceParams.serviceType = 'BOSS';
      priceParams.bossKillCount = killCount;
    } else if (service.quest) {
      priceParams.serviceType = 'QUEST';
    } else if (service.minigame) {
      priceParams.serviceType = 'MINIGAME';
    } else {
      priceParams.serviceType = 'OTHER';
    }

    if (priceParams.serviceType !== 'OTHER') {
      price = calculateOrderPrice(priceParams);
    } else {
      price = priceParams.basePrice;
    }

    // Apply express delivery multiplier
    if (expressDelivery) {
      price = Math.round(price * 1.5 * 100) / 100;
    }

    // Apply coupon if provided
    let coupon = null;
    let discountAmount = 0;

    if (couponCode) {
      coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (!coupon) {
        throw new AppError('Invalid coupon code', 400);
      }

      if (!coupon.isActive) {
        throw new AppError('This coupon is no longer active', 400);
      }

      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw new AppError('This coupon has expired', 400);
      }

      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        throw new AppError('This coupon has reached its usage limit', 400);
      }

      if (coupon.minOrder && price < coupon.minOrder) {
        throw new AppError(`Minimum order amount for this coupon is $${coupon.minOrder}`, 400);
      }

      const couponResult = applyCoupon(price, coupon);
      discountAmount = couponResult.discount;
      price = couponResult.finalPrice;
    }

    // Create order and payment in a transaction
    const order = await prisma.$transaction(async (tx: any) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          serviceId,
          rsn,
          accountType: accountType || 'MAIN',
          currentLevel,
          targetLevel,
          killCount,
          expressDelivery: expressDelivery || false,
          couponId: coupon?.id,
          discountAmount,
          totalPrice: price,
          notes,
          status: 'PENDING',
        },
        include: orderInclude,
      });

      // Create payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          userId,
          amount: price,
          currency: 'USD',
          status: 'PENDING',
        },
      });

      // Increment coupon usage
      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: {
            usedCount: { increment: 1 },
          },
        });
      }

      return newOrder;
    });

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// GET /orders/:id
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Verify ownership or admin/staff access
    if (order.userId !== userId && role !== 'ADMIN' && role !== 'STAFF') {
      throw new AppError('You do not have permission to view this order', 403);
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.user!;
    const { id } = req.params;
    const { status } = req.body;

    // Verify admin/staff role (also enforced by route middleware)
    if (role !== 'ADMIN' && role !== 'STAFF') {
      throw new AppError('Only administrators and staff can update order status', 403);
    }

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Build update data with status transition timestamps
    const updateData: any = { status };

    if (status === 'IN_PROGRESS' && !order.startedAt) {
      updateData.startedAt = new Date();
    }

    if (status === 'COMPLETED' && !order.completedAt) {
      updateData.completedAt = new Date();
    }

    const updatedOrder = await prisma.$transaction(async (tx: any) => {
      const updated = await tx.order.update({
        where: { id },
        data: updateData,
        include: orderInclude,
      });

      // Create notification for the user
      await tx.notification.create({
        data: {
          userId: order.userId,
          type: 'ORDER_STATUS',
          title: `Order Status Updated`,
          message: `Your order #${order.orderNumber || id.slice(0, 8)} has been updated to ${status}`,
          data: JSON.stringify({
            orderId: id,
            oldStatus: order.status,
            newStatus: status,
          }),
        },
      });

      return updated;
    });

    res.json({
      success: true,
      data: updatedOrder,
      message: `Order status updated to ${status}`,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /orders/:id/cancel
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { id } = req.params;

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Verify ownership
    if (order.userId !== userId) {
      throw new AppError('You do not have permission to cancel this order', 403);
    }

    // Only PENDING or PAID orders can be cancelled
    if (!['PENDING', 'PAID'].includes(order.status)) {
      throw new AppError(`Cannot cancel an order with status ${order.status}. Only PENDING or PAID orders can be cancelled.`, 400);
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
      include: orderInclude,
    });

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};
