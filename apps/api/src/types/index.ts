import { Request } from 'express';

export interface JwtPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse {
  data?: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  newCustomersThisMonth: number;
  ordersByStatus: Record<string, number>;
  revenueByMonth: { month: string; revenue: number }[];
  topServices: { name: string; orders: number }[];
  recentOrders: any[];
  growth: {
    revenue: number;
    orders: number;
    customers: number;
  };
}

export interface PriceBreakdown {
  baseCost: number;
  levelCost?: number;
  kcCost?: number;
  pointCost?: number;
  accountMultiplier: number;
  expressMultiplier: number;
  subtotal: number;
  discount: number;
  total: number;
}
