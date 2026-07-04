'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  { q: 'Is my OSRS account safe during the boost?', a: 'Yes. We enforce strict security protocols, including regional VPN matching to mimic your local logging IP, manual work guarantees (absolutely zero macroing or botting), and end-to-end data encryption.' },
  { q: 'How long will my service take to complete?', a: 'Each service lists an estimated completion time (e.g. 2-4 hours for minigames, up to 14 days for virtual skill caps). If you select Express priority, we assign your order to the next available specialist instantly.' },
  { q: 'Can I log into my account while the boost is active?', a: 'We highly recommend pausing your order from the dashboard before logging in to prevent account lockouts due to concurrent sessions. Always coordinates with your booster in the support chat.' },
  { q: 'Do you offer services for Ironmen accounts?', a: 'Yes. We support all accounts: Regular, Ironman, Hardcore Ironman, Ultimate Ironman, Group Ironman, and Fresh Start servers. Custom multipliers apply based on difficulty.' },
  { q: 'How can I pay for my services?', a: 'We support secure payment methods including Stripe Checkout (Visa/Mastercard), PayPal, and popular Cryptocurrencies via direct gateways.' },
  { q: 'How do you assign staff to my order?', a: 'Our system automatically routes orders to specialized workers based on their performance scores, current task queue, and OSRS accounts certifications.' },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h2>
        <p className="text-surface-300">
          Get answers to common queries regarding security, pricing, order builders, and delivery schedules.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <GlassCard
              key={idx}
              hover={false}
              className={`p-6 border border-white/5 bg-white/[0.01] transition-all duration-300 cursor-pointer ${
                isOpen ? 'border-primary-500/20 bg-white/[0.03]' : ''
              }`}
              onClick={() => toggle(idx)}
            >
              <div className="flex justify-between items-center gap-4">
                <span className="font-display font-bold text-white text-base sm:text-lg">
                  {faq.q}
                </span>
                <span className="text-primary-400 shrink-0">
                  {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </div>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm sm:text-base text-surface-300 leading-relaxed pt-2 border-t border-white/5">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
