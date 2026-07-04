'use client';

import React, { useState, useEffect } from 'react';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { Pencil, Check } from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [metrics, setMetrics] = useState({
    revenue: '$45,820.00',
    orders: '2,847',
    customers: '1,290',
    conversion: '4.92%',
  });

  useEffect(() => {
    setMetrics({
      revenue: localStorage.getItem('admin_stat_revenue') || '$45,820.00',
      orders: localStorage.getItem('admin_stat_orders') || '2,847',
      customers: localStorage.getItem('admin_stat_customers') || '1,290',
      conversion: localStorage.getItem('admin_stat_conversion') || '4.92%',
    });
  }, []);

  const handleSave = () => {
    localStorage.setItem('admin_stat_revenue', metrics.revenue);
    localStorage.setItem('admin_stat_orders', metrics.orders);
    localStorage.setItem('admin_stat_customers', metrics.customers);
    localStorage.setItem('admin_stat_conversion', metrics.conversion);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl font-extrabold text-white">Admin Console</h1>
          <p className="text-sm text-surface-300">Welcome, Admin {user?.username || ''}! Overview sales logs, profits, and staff work orders.</p>
        </div>
        <Button 
          variant={isEditing ? "primary" : "secondary"} 
          size="sm" 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="flex items-center gap-2"
        >
          {isEditing ? (
            <><Check size={16} /> Save Data</>
          ) : (
            <><Pencil size={16} /> Edit Data</>
          )}
        </Button>
      </div>

      {/* Analytics widgets row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs text-surface-450 uppercase font-semibold">Total Revenue</span>
          {isEditing ? (
            <Input value={metrics.revenue} onChange={(e) => setMetrics({...metrics, revenue: e.target.value})} className="mt-2" />
          ) : (
            <span className="text-3xl font-display font-extrabold text-white">{metrics.revenue}</span>
          )}
        </GlassCard>
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs text-surface-450 uppercase font-semibold">Orders Completed</span>
          {isEditing ? (
            <Input value={metrics.orders} onChange={(e) => setMetrics({...metrics, orders: e.target.value})} className="mt-2" />
          ) : (
            <span className="text-3xl font-display font-extrabold text-primary-450">{metrics.orders}</span>
          )}
        </GlassCard>
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs text-surface-450 uppercase font-semibold">Active Customers</span>
          {isEditing ? (
            <Input value={metrics.customers} onChange={(e) => setMetrics({...metrics, customers: e.target.value})} className="mt-2" />
          ) : (
            <span className="text-3xl font-display font-extrabold text-emerald-450">{metrics.customers}</span>
          )}
        </GlassCard>
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs text-surface-450 uppercase font-semibold">Conversion Rate</span>
          {isEditing ? (
            <Input value={metrics.conversion} onChange={(e) => setMetrics({...metrics, conversion: e.target.value})} className="mt-2" />
          ) : (
            <span className="text-3xl font-display font-extrabold text-gold-400">{metrics.conversion}</span>
          )}
        </GlassCard>
      </div>

      {/* Staff assignments & sales performance log charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-8 shadow-glass flex flex-col gap-6">
          <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4">Revenue Chart (Last 5 Months)</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-surface-450 w-16">July (Est)</span>
              <div className="flex-grow h-4 bg-white/5 border border-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-600 to-indigo-500 rounded-full" style={{ width: '85%' }} />
              </div>
              <span className="text-xs text-white font-semibold font-mono">$12,400</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-surface-450 w-16">June</span>
              <div className="flex-grow h-4 bg-white/5 border border-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-600 to-indigo-500 rounded-full" style={{ width: '75%' }} />
              </div>
              <span className="text-xs text-white font-semibold font-mono">$10,950</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-surface-450 w-16">May</span>
              <div className="flex-grow h-4 bg-white/5 border border-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-600 to-indigo-500 rounded-full" style={{ width: '60%' }} />
              </div>
              <span className="text-xs text-white font-semibold font-mono">$8,700</span>
            </div>
          </div>
        </GlassCard>

        {/* Action center lists */}
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-8 shadow-glass flex flex-col gap-6">
          <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4">System Alerts & Tasks</h3>
          <div className="flex flex-col gap-4 divide-y divide-white/5">
            <div className="flex justify-between items-center py-2 first:pt-0">
              <span className="text-sm text-surface-300">Verify new coupon code config</span>
              <Badge variant="warning">Action Needed</Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-surface-300">Authorize pending booster payout</span>
              <Badge variant="info">Pending review</Badge>
            </div>
          </div>
          <Button variant="secondary" className="mt-4">View All Tasks</Button>
        </GlassCard>
      </div>

      {/* Live Chat & Visitors Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-8 shadow-glass flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4 mb-4">Live Chat Inbox</h3>
            <p className="text-sm text-surface-300">Take over active AI chats, answer visitor questions, and close sales in real time.</p>
          </div>
          <Button variant="primary" className="mt-6" onClick={() => window.location.href = '/admin/live-chat'}>Open Inbox</Button>
        </GlassCard>
        
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-8 shadow-glass flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4 mb-4">Active Visitors</h3>
            <p className="text-sm text-surface-300">Track who is currently browsing the website and view captured sales leads.</p>
          </div>
          <div className="flex gap-4 mt-6">
            <Button variant="secondary" onClick={() => window.location.href = '/admin/visitors'}>View Visitors</Button>
            <Button variant="outline" onClick={() => window.location.href = '/admin/leads'}>View Leads</Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
