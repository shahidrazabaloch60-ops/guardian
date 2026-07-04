'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ShieldCheck, Clock, ShieldAlert, BadgeDollarSign, HeartHandshake } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface ServiceFAQProps {
  serviceName: string;
}

export default function ServiceFAQ({ serviceName }: ServiceFAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const FAQS = [
    {
      q: `Is it safe to use your OSRS ${serviceName} service?`,
      a: `Absolutely. We use strict security protocols including localized VPNs that match your usual login location. For highly sensitive orders, we also offer a Parsec approach where the booster plays remotely via your own PC's IP address.`,
    },
    {
      q: `How long does the ${serviceName} service take?`,
      a: `Completion times vary depending on the size of the order and your current account setup. However, once a booster is assigned (usually within 15 minutes for Express orders), they will work continuously until the boost is finished.`,
    },
    {
      q: `What happens if the player fails the ${serviceName} attempt?`,
      a: `Our boosters are elite OSRS veterans with thousands of hours of experience. If a rare failure or wipe occurs, the booster will cover any lost supplies/fees out of their own pocket and immediately re-attempt until successful.`,
    },
    {
      q: `Do I need specific gear or stats?`,
      a: `Generally, yes. We highly recommend equipping your best-in-slot gear for the activity. If your account lacks the necessary gear or minimum stats for efficient completion, we may contact you to adjust the order or suggest a gear rental.`,
    },
    {
      q: `How do you access my account securely?`,
      a: `When you place an order, your credentials are encrypted and only revealed to your assigned, fully vetted booster. They will use a matching VPN location to log in. Once the service is complete, we highly encourage you to change your password for complete peace of mind.`,
    },
  ];

  return (
    <div className="mt-12 flex flex-col gap-8 animate-fade-in">
      {/* FAQ Section */}
      <div className="flex flex-col gap-4">
        <h3 className="font-display font-extrabold text-2xl text-white mb-2">FAQ's: OSRS {serviceName} Service</h3>
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-300 ${
                isOpen ? 'border-primary-500/20 bg-white/[0.04]' : ''
              }`}
            >
              <button
                type="button"
                className="w-full px-6 py-5 flex justify-between items-center text-left"
                onClick={() => toggle(idx)}
              >
                <span className="font-display font-bold text-white text-base">
                  {faq.q}
                </span>
                <span className="text-primary-400 shrink-0 ml-4">
                  {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-5">
                      <p className="text-sm text-surface-300 leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Banner */}
      <GlassCard hover={false} className="border border-white/10 bg-gradient-to-br from-indigo-900/20 to-transparent p-6 sm:p-8 flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">
            We're the #1 choice for Old School RuneScape {serviceName} services:
          </h3>
          <ul className="flex flex-col gap-3 text-surface-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="shrink-0 text-emerald-400">✅</span>
              <span><strong>100% safe, Parsec-first approach</strong> (no risky account sharing, completed on your own IP address)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 text-gold-400">⚡</span>
              <span><strong>Fast completion</strong>, even for unique builds like zerkers or pures</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 text-indigo-400">💬</span>
              <span><strong>24/7 live chat</strong> and instant notifications on your order status</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 text-green-400">💰</span>
              <span><strong>Best price guaranteed</strong> – we'll beat any competitor quote</span>
            </li>
          </ul>
        </div>

        <div className="mt-4 pt-6 border-t border-white/10">
          <h4 className="text-xs uppercase tracking-widest text-surface-450 font-bold mb-4 text-center">Our Guarantees</h4>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-2 text-surface-300 text-sm font-semibold">
              <ShieldCheck size={16} className="text-primary-400" />
              <span>Top Level Security</span>
            </div>
            <div className="flex items-center gap-2 text-surface-300 text-sm font-semibold">
              <Clock size={16} className="text-primary-400" />
              <span>Fast Turnaround</span>
            </div>
            <div className="flex items-center gap-2 text-surface-300 text-sm font-semibold">
              <BadgeDollarSign size={16} className="text-primary-400" />
              <span>Fair Prices</span>
            </div>
            <div className="flex items-center gap-2 text-surface-300 text-sm font-semibold">
              <HeartHandshake size={16} className="text-primary-400" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 text-surface-300 text-sm font-semibold">
              <ShieldAlert size={16} className="text-primary-400" />
              <span>Hand-Done Services</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
