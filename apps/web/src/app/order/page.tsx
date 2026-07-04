'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, ShoppingBag, ShieldCheck, Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { formatPriceFromDollars } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';

export default function OrderPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [orderItem, setOrderItem] = useState<any>(null);
  
  // Payment States
  const [step, setStep] = useState(1);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('guardianrs_pending_order');
      if (stored) {
        setOrderItem(JSON.parse(stored));
      }
    }
  }, []);

  if (!orderItem) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center flex flex-col items-center gap-4">
        <ShoppingBag className="w-16 h-16 text-surface-500" />
        <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-surface-300">Select any skilling, bossing, quest, or minigame service first.</p>
        <Button href="/skills" variant="primary">Browse Catalogue</Button>
      </div>
    );
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSuccess(true);
    setTimeout(() => {
      // Clear pending order and redirect to orders dashboard
      localStorage.removeItem('guardianrs_pending_order');
      router.push(isAuthenticated ? '/dashboard/orders' : '/login?redirect=/dashboard/orders');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <ShoppingBag size={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-primary-400 uppercase tracking-widest font-bold">GuardianRS Checkout</span>
          <h1 className="font-display text-3xl font-extrabold text-white">Review Your Boost Order</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Details Panel */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-6">
            <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4">Selected Boosting Details</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-surface-450 uppercase font-semibold">Service Name</span>
                <span className="font-bold text-white">{orderItem.serviceName}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-surface-450 uppercase font-semibold">Account Type</span>
                <span className="font-bold text-white uppercase">{orderItem.accountType}</span>
              </div>
              {orderItem.currentLevel && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-surface-450 uppercase font-semibold">Level Range</span>
                  <span className="font-bold text-indigo-400 font-mono">{orderItem.currentLevel} → {orderItem.targetLevel}</span>
                </div>
              )}
              {orderItem.bossKillCount && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-surface-450 uppercase font-semibold">Kills Ordered</span>
                  <span className="font-bold text-indigo-400 font-mono">{orderItem.bossKillCount} Kills</span>
                </div>
              )}
              {orderItem.minigamePoints && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-surface-450 uppercase font-semibold">Hours Requested</span>
                  <span className="font-bold text-indigo-400 font-mono">{orderItem.minigamePoints} Hours</span>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-surface-450 uppercase font-semibold">Express Priority</span>
                <span className="font-bold text-white">{orderItem.expressPriority ? '⚡ Yes' : 'No'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
              <span className="text-xs text-surface-450 uppercase font-semibold">Safety Configuration</span>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success"> regional VPN: {orderItem.vpnRegion || 'Global'}</Badge>
                {orderItem.humanOnly && <Badge variant="info">Human Operated</Badge>}
                {orderItem.noAutomation && <Badge variant="gold">0% Macroing</Badge>}
              </div>
            </div>
          </GlassCard>

          {/* Secure Payment details */}
          <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-6">
            <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4">Secure Gateway Payment</h3>
            {paymentSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-4 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck size={32} />
                </div>
                <h4 className="text-xl font-bold text-white">Payment Successful</h4>
                <p className="text-sm text-surface-300">Your order has been logged. Routing you to dashboards...</p>
              </div>
            ) : (
              <form onSubmit={handlePayment} className="flex flex-col gap-4">
                <Input
                  label="Card Number"
                  placeholder="0000 0000 0000 0000"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  icon={CreditCard}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    placeholder="MM / YY"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                  <Input
                    label="CVC"
                    placeholder="123"
                    type="password"
                    required
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    icon={Lock}
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full mt-4 flex items-center gap-2">
                  <Lock size={16} />
                  <span>Authorize Secure Payment ({formatPriceFromDollars(orderItem.totalPrice)})</span>
                </Button>
              </form>
            )}
          </GlassCard>
        </div>

        {/* Side Cost Summary Card */}
        <div className="flex flex-col gap-6">
          <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-6 h-fit">
            <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4">Order Summary</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between items-center text-surface-300">
                <span>Base service rate:</span>
                <span>{formatPriceFromDollars(orderItem.totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-surface-300">
                <span>Taxes & fees:</span>
                <span className="text-emerald-400">Free</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/5 text-base font-bold text-white">
                <span>Grand Total:</span>
                <span className="text-gold-400 font-display text-2xl">{formatPriceFromDollars(orderItem.totalPrice)}</span>
              </div>
            </div>
          </GlassCard>

          {/* Trust Guarantees Card */}
          <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-6">
            <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4">Buyer Protection</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">100% Hand-Played</span>
                  <span className="text-xs text-surface-400 leading-relaxed">Every order is completed manually by a vetted professional. We never use bots or macros.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">Secure & Confidential</span>
                  <span className="text-xs text-surface-400 leading-relaxed">Your account details are fully encrypted and your booster uses a matching VPN.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gold-400 text-lg leading-none mt-0.5 shrink-0">⚡</span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">Instant Start Options</span>
                  <span className="text-xs text-surface-400 leading-relaxed">Choose Express Priority to skip the queue and have a booster assigned within 15 minutes.</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
