'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  ShoppingCart,
  Wrench,
  Users,
  Briefcase,
  Ticket,
  Percent,
  Star,
  FileCode,
  Settings,
  ArrowLeftSquare,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import GlassCard from '../../components/ui/GlassCard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const links = [
    { label: 'Admin Dashboard', href: '/admin', icon: ShieldAlert },
    { label: 'Live Chat', href: '/admin/live-chat', icon: MessageSquare },
    { label: 'Active Visitors', href: '/admin/visitors', icon: Users },
    { label: 'Sales Leads', href: '/admin/leads', icon: Briefcase },
    { label: 'Orders Logs', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Service Catalog', href: '/admin/services', icon: Wrench },
    { label: 'Knowledge Base', href: '/admin/knowledge-base', icon: FileCode },
    { label: 'Customers Database', href: '/admin/customers', icon: Users },
    { label: 'Booster Staff', href: '/admin/staff', icon: Briefcase },
    { label: 'Support Tickets', href: '/admin/tickets', icon: Ticket },
    { label: 'Promo Coupons', href: '/admin/coupons', icon: Percent },
    { label: 'Customer Reviews', href: '/admin/reviews', icon: Star },
    { label: 'CMS Content', href: '/admin/cms', icon: FileCode },
    { label: 'Global Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
      {/* Sidebar navigation */}
      <aside className="w-full lg:w-64 shrink-0">
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-6 sticky top-28">
          <div className="flex flex-col gap-1 pb-4 border-b border-white/5">
            <span className="font-bold text-white text-base">{user?.username || 'Super Admin'}</span>
            <span className="text-xs text-red-400 uppercase font-semibold tracking-wider">
              System Admin
            </span>
          </div>

          <nav className="flex flex-col gap-1 max-h-[70vh] overflow-y-auto pr-1">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    active
                      ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                      : 'text-surface-300 hover:bg-white/5 hover:text-white border border-transparent'
                  )}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-surface-300 hover:bg-white/5 border border-transparent mt-8"
            >
              <ArrowLeftSquare size={18} />
              <span>Back to Client View</span>
            </Link>
          </nav>
        </GlassCard>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-grow flex flex-col gap-8">
        {children}
      </div>
    </div>
  );
}
