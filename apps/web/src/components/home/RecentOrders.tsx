'use client';

import React, { useState, useEffect } from 'react';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';

interface RecentOrder {
  id: string;
  user: string;
  service: string;
  price: number;
  timeAgo: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'ASSIGNED';
}

const RECENT_ORDERS: RecentOrder[] = [
  { id: '1', user: 'Al***x', service: '70-99 Strength', price: 129.99, timeAgo: '2 mins ago', status: 'COMPLETED' },
  { id: '2', user: 'Ki***g', service: 'Fire Cape Service', price: 15.0, timeAgo: '12 mins ago', status: 'COMPLETED' },
  { id: '3', user: 'P***9', service: 'Desert Treasure II Quest', price: 45.0, timeAgo: '22 mins ago', status: 'IN_PROGRESS' },
  { id: '4', user: 'Ro***r', service: '1-70 Agility Powerleveling', price: 65.0, timeAgo: '35 mins ago', status: 'COMPLETED' },
  { id: '5', user: 'Sk***r', service: 'Fighter Torso Service', price: 29.99, timeAgo: '1 hour ago', status: 'ASSIGNED' },
  { id: '6', user: 'Z***h', service: '100 Vorkath KC Boost', price: 35.0, timeAgo: '2 hours ago', status: 'COMPLETED' },
];

export default function RecentOrders() {
  const [orders, setOrders] = useState<RecentOrder[]>(RECENT_ORDERS);

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate live order updates
      const users = ['Ma***x', 'Jo***n', 'B***r', 'Ph***x', 'L***o'];
      const services = [
        { name: '1-99 Cooking', price: 45.0 },
        { name: 'Recipe for Disaster Quest', price: 95.0 },
        { name: 'Void Knight Armor Set', price: 39.99 },
        { name: '1-60 Woodcutting', price: 19.99 },
        { name: '50 Chambers of Xeric KC', price: 85.0 },
      ];
      const statuses: RecentOrder['status'][] = ['COMPLETED', 'IN_PROGRESS', 'ASSIGNED'];
      
      const newOrder: RecentOrder = {
        id: Math.random().toString(),
        user: users[Math.floor(Math.random() * users.length)],
        service: services[Math.floor(Math.random() * services.length)].name,
        price: services[Math.floor(Math.random() * services.length)].price,
        timeAgo: 'Just now',
        status: statuses[Math.floor(Math.random() * statuses.length)],
      };

      setOrders((prev) => [newOrder, ...prev.slice(0, 5)]);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4">
          Live Order <span className="gradient-text">Activity Feed</span>
        </h2>
        <p className="text-surface-300">
          See what our boosters are completing right now on customers' accounts.
        </p>
      </div>

      <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] shadow-glass p-6 md:p-8 flex flex-col gap-4">
        <div className="flex flex-col divide-y divide-white/5">
          {orders.map((ord) => (
            <div key={ord.id} className="flex justify-between items-center py-4 first:pt-0 last:pb-0 animate-fade-in">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-white text-sm sm:text-base">
                  {ord.service}
                </span>
                <span className="text-xs text-surface-450">
                  By {ord.user} • {ord.timeAgo}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gold-400 font-display">
                  ${ord.price.toFixed(2)}
                </span>
                <Badge
                  variant={ord.status === 'COMPLETED' ? 'success' : ord.status === 'IN_PROGRESS' ? 'info' : 'warning'}
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  {ord.status === 'COMPLETED' ? 'Completed' : ord.status === 'IN_PROGRESS' ? 'In Progress' : 'Assigned'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}
