'use client';

import React, { useState } from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import { Plus } from 'lucide-react';

interface CouponItem {
  id: string;
  code: string;
  type: string;
  value: number;
  status: 'ACTIVE' | 'DISABLED';
}

export default function AdminCouponsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [value, setValue] = useState('');
  const [coupons, setCoupons] = useState<CouponItem[]>([
    { id: 'cpn_1', code: 'GUARDIAN10', type: 'FIXED', value: 10.0, status: 'ACTIVE' },
  ]);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !value) return;

    const newCoupon: CouponItem = {
      id: `cpn_${Math.random().toString(36).substr(2, 9)}`,
      code: code.toUpperCase().trim(),
      type: 'FIXED',
      value: parseFloat(value),
      status: 'ACTIVE',
    };

    setCoupons((prev) => [newCoupon, ...prev]);
    setModalOpen(false);
    setCode('');
    setValue('');
  };

  const handleToggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' } : c
      )
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="font-display text-3xl font-extrabold text-white">Promo Codes Config</h1>
          <p className="text-sm text-surface-300">Configure promotional discount codes and active limits.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} variant="primary" size="sm" className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Coupon</span>
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {coupons.map((cpn) => (
          <GlassCard key={cpn.id} hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white text-lg font-mono">{cpn.code}</span>
                <Badge variant={cpn.status === 'ACTIVE' ? 'success' : 'default'} size="sm">
                  {cpn.status}
                </Badge>
              </div>
              <span className="text-xs text-surface-450">
                Coupon ID: {cpn.id} • Discount type: {cpn.type}
              </span>
            </div>

            <div className="flex items-center gap-6 self-end sm:self-auto">
              <span className="text-xl font-display font-extrabold text-gold-400">
                ${cpn.value.toFixed(2)} Off
              </span>
              <Button
                variant={cpn.status === 'ACTIVE' ? 'ghost' : 'secondary'}
                size="sm"
                onClick={() => handleToggleCoupon(cpn.id)}
                className={cpn.status === 'ACTIVE' ? 'text-red-400 hover:text-red-300' : ''}
              >
                {cpn.status === 'ACTIVE' ? 'Disable Coupon' : 'Enable Coupon'}
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Create Coupon Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Promo Coupon">
        <form onSubmit={handleCreateCoupon} className="flex flex-col gap-4">
          <Input
            label="Promo Code String"
            placeholder="e.g. SUMMER15"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Input
            label="Discount Value ($ USD)"
            type="number"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button type="submit" variant="primary" className="w-full mt-2">
            Create Promo Coupon
          </Button>
        </form>
      </Modal>
    </div>
  );
}
