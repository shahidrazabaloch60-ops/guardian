import { ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function formatPriceFromDollars(dollars: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(dollars);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${diffDays}d ago`;
}

export function calculateXP(level: number): number {
  if (level <= 1) return 0;
  let xp = 0;
  for (let i = 1; i < level; i++) {
    xp += Math.floor(i + 300 * Math.pow(2, i / 7));
  }
  return Math.floor(xp / 4);
}

export function calculateLevelFromXP(xp: number): number {
  if (xp <= 0) return 1;
  let low = 1;
  let high = 126; // Support virtual levels up to 126
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midXp = calculateXP(mid);
    if (midXp === xp) return mid;
    if (midXp < xp) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return high;
}

export function getAccountTypeMultiplier(type: string): number {
  const multipliers: Record<string, number> = {
    REGULAR: 1.0,
    IRONMAN: 1.2,
    HARDCORE_IRONMAN: 1.5,
    ULTIMATE_IRONMAN: 1.8,
    GROUP_IRONMAN: 1.3,
    FRESH_START: 1.1,
  };
  return multipliers[type] || 1.0;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
    PAID: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    ASSIGNED: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    IN_PROGRESS: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    PAUSED: 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
    COMPLETED: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
    CANCELLED: 'bg-red-500/10 text-red-500 border border-red-500/20',
    REFUNDED: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  };
  return colors[status] || 'bg-white/10 text-white';
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    novice: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    intermediate: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    experienced: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
    master: 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
    grandmaster: 'bg-red-500/10 text-red-500 border border-red-500/20',
    beginner: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    advanced: 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
    expert: 'bg-red-500/10 text-red-500 border border-red-500/20',
  };
  return colors[difficulty.toLowerCase()] || 'bg-white/10 text-white';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}
