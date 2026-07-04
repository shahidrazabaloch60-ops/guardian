import React from 'react';
import Link from 'next/link';
import { Shield, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import { TRUST_BADGES, SOCIAL_LINKS, SITE_NAME } from '../../lib/constants';

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5 bg-[#050510]/80 backdrop-blur-md pt-20 pb-8 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-650/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-500 flex items-center justify-center border border-white/10">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-white leading-none">
              GUARDIAN<span className="text-primary-400">RS</span>
            </span>
          </Link>
          <p className="text-sm text-surface-400 leading-relaxed">
            GuardianRS provides top-tier, manually operated OSRS powerleveling and combat assistance services. Security and speed guaranteed.
          </p>
          <div className="flex gap-4">
            {SOCIAL_LINKS.map((soc) => (
              <a
                key={soc.name}
                href={soc.url}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 flex items-center justify-center text-xl transition-all hover:scale-105"
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Services */}
        <div className="flex flex-col gap-6">
          <h4 className="font-display font-bold text-sm uppercase tracking-wider text-surface-450">Services</h4>
          <ul className="flex flex-col gap-3 text-sm text-surface-400">
            <li>
              <Link href="/skills" className="hover:text-white flex items-center gap-1 transition-colors group">
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> Skill Leveling
              </Link>
            </li>
            <li>
              <Link href="/bossing" className="hover:text-white flex items-center gap-1 transition-colors group">
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> Bossing & Raids
              </Link>
            </li>
            <li>
              <Link href="/quests" className="hover:text-white flex items-center gap-1 transition-colors group">
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> Quest Helper
              </Link>
            </li>
            <li>
              <Link href="/minigames" className="hover:text-white flex items-center gap-1 transition-colors group">
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> Minigames & Calculators
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="flex flex-col gap-6">
          <h4 className="font-display font-bold text-sm uppercase tracking-wider text-surface-450">Company</h4>
          <ul className="flex flex-col gap-3 text-sm text-surface-400">
            <li>
              <Link href="/about" className="hover:text-white flex items-center gap-1 transition-colors group">
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white flex items-center gap-1 transition-colors group">
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> Contact Support
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-white flex items-center gap-1 transition-colors group">
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> F.A.Q
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Trust / Badges */}
        <div className="flex flex-col gap-6">
          <h4 className="font-display font-bold text-sm uppercase tracking-wider text-surface-450">Trust & Security</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
              <span className="text-2xl mb-1.5">🛡️</span>
              <span className="text-xs font-bold text-white block">VPN Protection</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
              <span className="text-2xl mb-1.5">💪</span>
              <span className="text-xs font-bold text-white block">Hand-Done</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-surface-450">
        <span>© 2026 {SITE_NAME}. Frictional, fan-made helper. We are not affiliated with Jagex Ltd.</span>
        <div className="flex gap-6">
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
