import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

const serviceInclude = {
  category: true,
  skill: true,
  boss: true,
  quest: true,
  minigame: true,
};

// GET /services
export const getAllServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || DEFAULT_PAGE);
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit as string) || DEFAULT_LIMIT));
    const { category, search, sortBy, sortOrder } = req.query;

    const where: any = {
      active: true,
    };

    // Filter by category slug
    if (category) {
      where.category = {
        slug: category as string,
      };
    }

    // Search by name
    if (search) {
      where.name = {
        contains: search as string,
        mode: 'insensitive',
      };
    }

    // Allow admin to see inactive services
    if (req.user?.role === 'ADMIN') {
      delete where.active;
    }

    // Sorting
    const orderBy: any = {};
    const validSortFields = ['name', 'price', 'basePrice', 'createdAt', 'popular'];
    const sortField = validSortFields.includes(sortBy as string) ? (sortBy as string) : 'createdAt';
    const order = sortOrder === 'asc' ? 'asc' : 'desc';
    orderBy[sortField] = order;

    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: serviceInclude,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.service.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        services,
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

// GET /services/:slug
export const getServiceBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug as string;

    const service = await prisma.service.findUnique({
      where: { slug },
      include: serviceInclude,
    });

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// GET /services/category/:categorySlug
export const getServicesByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categorySlug } = req.params;
    const page = Math.max(1, parseInt(req.query.page as string) || DEFAULT_PAGE);
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit as string) || DEFAULT_LIMIT));

    const category = await prisma.serviceCategory.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const skip = (page - 1) * limit;

    const where: any = {
      categoryId: category.id,
      active: true,
    };

    // Allow admin to see inactive
    if (req.user?.role === 'ADMIN') {
      delete where.active;
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: serviceInclude,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.service.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        category,
        services,
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
