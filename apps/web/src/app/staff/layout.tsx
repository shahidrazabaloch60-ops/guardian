'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Calendar, ClipboardCheck, ArrowLeftSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import GlassCard from '../../components/ui/GlassCard';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const links = [
    { label: 'Staff Dashboard', href: '/staff', icon: ShieldCheck },
    { label: 'Assigned Tasks', href: '/staff/tasks', icon: ClipboardCheck },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 shrink-0">
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-6 sticky top-28">
          <div className="flex flex-col gap-1 pb-4 border-b border-white/5">
            <span className="font-bold text-white text-base">{user?.username || 'Staff Member'}</span>
            <span className="text-xs text-primary-400 uppercase font-semibold tracking-wider">
              Staff / Booster
            </span>
          </div>

          <nav className="flex flex-col gap-1">
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
