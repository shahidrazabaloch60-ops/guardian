export const SITE_NAME = 'GuardianRS';
export const SITE_DESCRIPTION = 'Premium OSRS boosting and powerleveling services by verified professionals. Hand-done, safe, and secure.';
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Skills', href: '/skills' },
  { label: 'Bossing', href: '/bossing' },
  { label: 'Quests', href: '/quests' },
  { label: 'Minigames', href: '/minigames' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const ACCOUNT_TYPES = [
  { label: 'Regular Account', value: 'REGULAR', multiplier: 1.0, description: 'Standard OSRS account' },
  { label: 'Ironman', value: 'IRONMAN', multiplier: 1.2, description: 'No trading, self-sufficient' },
  { label: 'Hardcore Ironman', value: 'HARDCORE_IRONMAN', multiplier: 1.5, description: 'One life challenge' },
  { label: 'Ultimate Ironman', value: 'ULTIMATE_IRONMAN', multiplier: 1.8, description: 'No bank storage allowed' },
  { label: 'Group Ironman', value: 'GROUP_IRONMAN', multiplier: 1.3, description: 'Self-sufficient group account' },
  { label: 'Fresh Start', value: 'FRESH_START', multiplier: 1.1, description: 'Brand new server account' },
];

export const ORDER_STATUSES = [
  { label: 'Pending Payment', value: 'PENDING', color: 'text-yellow-500' },
  { label: 'Paid', value: 'PAID', color: 'text-indigo-400' },
  { label: 'Assigned to Staff', value: 'ASSIGNED', color: 'text-blue-400' },
  { label: 'In Progress', value: 'IN_PROGRESS', color: 'text-emerald-400' },
  { label: 'Paused', value: 'PAUSED', color: 'text-orange-500' },
  { label: 'Completed', value: 'COMPLETED', color: 'text-teal-400' },
  { label: 'Cancelled', value: 'CANCELLED', color: 'text-red-500' },
  { label: 'Refunded', value: 'REFUNDED', color: 'text-purple-400' },
];

export const SERVICE_CATEGORIES = [
  { name: 'Skills', slug: 'skills', icon: '⚔️', count: 23, image: '' },
  { name: 'Bossing', slug: 'bossing', icon: '🐉', count: 35, image: '' },
  { name: 'Quests', slug: 'quests', icon: '📜', count: 30, image: '' },
  { name: 'Minigames', slug: 'minigames', icon: '🎮', count: 20, image: '' },
];

export const SOCIAL_LINKS = [
  { name: 'Discord', url: 'https://discord.gg/guardianrs', icon: '🎮' },
  { name: 'Twitter', url: 'https://twitter.com/guardianrs', icon: '🐦' },
  { name: 'YouTube', url: 'https://youtube.com/c/guardianrs', icon: '📺' },
];

export const TRUST_BADGES = [
  { title: 'VPN Regional Protection', icon: '🛡️', desc: 'We match your local region IP' },
  { title: '100% Hand Done', icon: '💪', desc: 'No bots or macro automation ever' },
  { title: 'Professional Boosters', icon: '⭐', desc: 'Fully vetted elite OSRS players' },
  { title: '24/7 Live Support', icon: '💬', desc: 'Here to help you anytime' },
];
