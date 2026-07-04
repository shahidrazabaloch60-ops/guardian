'use client';

import React from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatPriceFromDollars } from '../../../lib/utils';

export default function DashboardOrdersPage() {
  const mockOrders = [
    { id: 'ord_1', name: '70-99 Strength Training', type: 'SKILL', price: 129.99, status: 'IN_PROGRESS', date: 'June 30, 2026' },
    { id: 'ord_2', name: 'Fire Cape Service', type: 'MINIGAME', price: 15.0, status: 'COMPLETED', date: 'June 18, 2026' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="font-display text-3xl font-extrabold text-white">My Boosting Orders</h1>
          <p className="text-sm text-surface-300">Track current completions and view historical billing invoices.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {mockOrders.map((ord) => (
          <GlassCard key={ord.id} hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white text-lg">{ord.name}</span>
                <Badge variant={ord.status === 'COMPLETED' ? 'success' : 'info'} size="sm">
                  {ord.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                </Badge>
              </div>
              <span className="text-xs text-surface-450">
                Order ID: {ord.id} • Purchased: {ord.date}
              </span>
            </div>

            <div className="flex items-center gap-6 self-end sm:self-auto">
              <span className="text-lg font-display font-extrabold text-gold-400">
                {formatPriceFromDollars(ord.price)}
              </span>
              <Button variant="secondary" size="sm" className="whitespace-nowrap">
                Track Boost
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
