'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, CreditCard, Gift } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import { ACCOUNT_TYPES } from '../../lib/constants';
import { formatPriceFromDollars, getAccountTypeMultiplier } from '../../lib/utils';

interface OrderBuilderProps {
  basePrice: number;
  serviceType: 'SKILL' | 'BOSS' | 'QUEST' | 'MINIGAME';
  serviceName: string;
  calculatedPrice: number;
  currentLevel?: number;
  targetLevel?: number;
  bossKillCount?: number;
  minigamePoints?: number;
  onCheckout: (formData: any) => void;
}

export default function OrderBuilder({
  basePrice,
  serviceType,
  serviceName,
  calculatedPrice,
  currentLevel,
  targetLevel,
  bossKillCount,
  minigamePoints,
  onCheckout,
}: OrderBuilderProps) {
  const [accountType, setAccountType] = useState('REGULAR');
  const [expressPriority, setExpressPriority] = useState(false);
  
  // Safety Options
  const [vpnRegion, setVpnRegion] = useState('');
  const [humanOnly, setHumanOnly] = useState(true);
  const [noAutomation, setNoAutomation] = useState(true);
  const [progressScreenshots, setProgressScreenshots] = useState(true);
  const [schedulePref, setSchedulePref] = useState('');
  const [notes, setNotes] = useState('');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  // Totals calculations
  const [totalPrice, setTotalPrice] = useState(calculatedPrice);

  useEffect(() => {
    let final = calculatedPrice;
    
    // Account type multiplier
    final *= getAccountTypeMultiplier(accountType);

    // Express priority (+20%)
    if (expressPriority) {
      final += calculatedPrice * 0.2;
    }

    // Apply Coupon discount
    if (discountAmount > 0) {
      final = Math.max(0, final - discountAmount);
    }

    setTotalPrice(final);
  }, [calculatedPrice, accountType, expressPriority, discountAmount]);

  const applyCoupon = () => {
    setCouponError('');
    if (couponCode.toUpperCase() === 'GUARDIAN10') {
      setDiscountAmount(10); // $10 off
      setCouponApplied(true);
    } else {
      setCouponError('Invalid or expired coupon code.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckout({
      serviceName,
      serviceType,
      accountType,
      expressPriority,
      vpnRegion,
      humanOnly,
      noAutomation,
      progressScreenshots,
      schedulePref,
      notes,
      couponCode: couponApplied ? couponCode : undefined,
      totalPrice,
      currentLevel,
      targetLevel,
      bossKillCount,
      minigamePoints,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      {/* Account Type Selection */}
      <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-4">
        <h3 className="font-display font-bold text-lg text-white">1. Select Account Type</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ACCOUNT_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setAccountType(type.value)}
              className={`p-4 rounded-xl border text-center flex flex-col gap-1 transition-all ${
                accountType === type.value
                  ? 'border-primary-500 bg-primary-500/10 text-white shadow-glow-primary'
                  : 'border-white/5 bg-white/[0.02] text-surface-300 hover:bg-white/5'
              }`}
            >
              <span className="font-bold text-sm block">{type.label}</span>
              <span className="text-[10px] text-surface-450">({type.multiplier}x price)</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Safety & Preferences Selection */}
      <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-6">
        <h3 className="font-display font-bold text-lg text-white">2. Safety Options & Preferences</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="VPN Region Matching (Your country/state)"
            placeholder="e.g. United States, California"
            value={vpnRegion}
            onChange={(e) => setVpnRegion(e.target.value)}
          />
          <Input
            label="Schedule preferences (Times we can play)"
            placeholder="e.g. 10 PM to 6 AM UTC"
            value={schedulePref}
            onChange={(e) => setSchedulePref(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={humanOnly}
              onChange={(e) => setHumanOnly(e.target.checked)}
              className="accent-primary-500"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Human Only</span>
              <span className="text-[10px] text-surface-450">Vetted manual play</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={noAutomation}
              onChange={(e) => setNoAutomation(e.target.checked)}
              className="accent-primary-500"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">No Automation</span>
              <span className="text-[10px] text-surface-450">Zero scripts/bots</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={progressScreenshots}
              onChange={(e) => setProgressScreenshots(e.target.checked)}
              className="accent-primary-500"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Screenshots</span>
              <span className="text-[10px] text-surface-450">Active progress photo updates</span>
            </div>
          </label>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-surface-400">Order Notes / Custom Requests</label>
          <textarea
            rows={3}
            className="glass-input w-full p-4 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-surface-500 focus:outline-none focus:border-primary-500"
            placeholder="List any details, unlocked items, or quests completed that could help our booster."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </GlassCard>

      {/* Checkout and Coupon */}
      <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-6">
        <h3 className="font-display font-bold text-lg text-white">3. Checkout & Promo Codes</h3>
        
        {/* Express Priority Switch */}
        <div className="flex justify-between items-center p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Express Delivery Priority</span>
              <span className="text-xs text-surface-400">Pushed to top of boosters queues (+20% price)</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={expressPriority}
            onChange={(e) => setExpressPriority(e.target.checked)}
            className="w-5 h-5 accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Promo code block */}
        <div className="flex gap-3">
          <Input
            placeholder="Enter promo code (e.g. GUARDIAN10)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            error={couponError}
            className="flex-grow"
          />
          <Button type="button" variant="secondary" onClick={applyCoupon} className="whitespace-nowrap h-fit self-end py-3">
            Apply Code
          </Button>
        </div>
        {couponApplied && (
          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <Gift size={14} />
            <span>Promo Applied: $10.00 Off discount</span>
          </div>
        )}

        {/* Total Summary */}
        <div className="flex justify-between items-center pt-6 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-sm text-surface-300 font-semibold">Total Price:</span>
            <span className="text-xs text-surface-450">Est. Taxes/Gateways included</span>
          </div>
          <span className="text-3xl font-display font-extrabold text-gold-400">
            {formatPriceFromDollars(totalPrice)}
          </span>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full flex items-center gap-2">
          <CreditCard size={18} />
          <span>Pay and Start Boost</span>
        </Button>

        <div className="flex flex-col gap-3 mt-2 border-t border-white/5 pt-4">
          <div className="flex items-center gap-2 text-xs text-surface-300">
            <ShieldAlert size={14} className="text-emerald-400" />
            <span>100% Hand-Played Guarantee (No Bots)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-300">
            <CreditCard size={14} className="text-primary-400" />
            <span>Secure 256-bit Encrypted Payments</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-300">
            <span className="text-gold-400 text-[14px]">⚡</span>
            <span>Instant Start Available via Express</span>
          </div>
        </div>
      </GlassCard>
    </form>
  );
}
