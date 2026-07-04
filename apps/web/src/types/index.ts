export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum AccountType {
  REGULAR = 'REGULAR',
  IRONMAN = 'IRONMAN',
  HARDCORE_IRONMAN = 'HARDCORE_IRONMAN',
  ULTIMATE_IRONMAN = 'ULTIMATE_IRONMAN',
  GROUP_IRONMAN = 'GROUP_IRONMAN',
  FRESH_START = 'FRESH_START',
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum PaymentMethod {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  CRYPTO = 'CRYPTO',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum Difficulty {
  NOVICE = 'NOVICE',
  INTERMEDIATE = 'INTERMEDIATE',
  EXPERIENCED = 'EXPERIENCED',
  MASTER = 'MASTER',
  GRANDMASTER = 'GRANDMASTER',
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  avatar?: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  serviceType: 'SKILL' | 'BOSS' | 'QUEST' | 'MINIGAME';
  accountType: AccountType;
  currentLevel?: number;
  targetLevel?: number;
  currentXp?: number;
  targetXp?: number;
  bossKillCount?: number;
  minigamePoints?: number;
  status: OrderStatus;
  totalPrice: number;
  expressPriority: boolean;
  notes?: string;
  vpnRegion?: string;
  humanOnly: boolean;
  noAutomation: boolean;
  progressScreenshots: boolean;
  schedulePref?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  couponId?: string;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  image?: string;
  basePrice: number;
  pricePerLevel?: number;
  pricePerKc?: number;
  pricePerHour?: number;
  estimatedTime: string;
  isActive: boolean;
}

export interface Skill {
  slug: string;
  name: string;
  icon: string;
  description: string;
  basePrice: number;
  maxLevel: number;
  category: 'combat' | 'gathering' | 'artisan' | 'support';
  estimatedTime: string;
}

export interface Boss {
  slug: string;
  name: string;
  icon: string;
  description: string;
  pricePerKc: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
  image: string;
  minCombatLevel: number;
  drops: string[];
}

export interface Quest {
  slug: string;
  name: string;
  difficulty: 'novice' | 'intermediate' | 'experienced' | 'master' | 'grandmaster';
  questPoints: number;
  members: boolean;
  requirements: string[];
  price: number;
  estimatedTime: string;
  description: string;
}

export interface Minigame {
  slug: string;
  name: string;
  icon: string;
  description: string;
  pricePerHour: number;
  rewards: string[];
  estimatedTime: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  username: string;
  role: UserRole;
  message: string;
  isInternal: boolean;
  attachments?: string[];
  createdAt: string;
}

export interface Ticket {
  id: string;
  userId: string;
  userEmail: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  department: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  attachments?: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  service: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrder: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface OrderFormData {
  serviceId: string;
  serviceName: string;
  serviceType: 'SKILL' | 'BOSS' | 'QUEST' | 'MINIGAME';
  accountType: AccountType;
  currentLevel?: number;
  targetLevel?: number;
  bossKillCount?: number;
  minigamePoints?: number;
  expressPriority: boolean;
  vpnRegion?: string;
  humanOnly: boolean;
  noAutomation: boolean;
  progressScreenshots: boolean;
  schedulePref?: string;
  notes?: string;
}

export interface PriceCalculation {
  basePrice: number;
  multiplier: number;
  expressPrice: number;
  safetyOptionsPrice: number;
  discount: number;
  totalPrice: number;
}
