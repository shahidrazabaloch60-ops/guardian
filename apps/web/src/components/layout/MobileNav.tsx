'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import { NAV_LINKS } from '../../lib/constants';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { isAuthenticated, logout, isAdmin, isStaff } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 25 } },
    exit: { opacity: 0, x: '100%', transition: { ease: 'easeInOut', duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#000000]/60 backdrop-blur-sm"
          />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-4/5 max-w-sm h-full bg-[#0a0a1a]/95 border-l border-white/10 backdrop-blur-xl p-8 shadow-glass-lg flex flex-col justify-between"
          >
            <div className="flex flex-col gap-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <Link href="/" onClick={onClose} className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-500" />
                  <span className="font-display font-extrabold text-lg text-white">GuardianRS</span>
                </Link>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/10"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-col gap-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={onClose}
                    className="text-lg font-bold text-surface-200 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Footer / Auth buttons */}
            <div className="flex flex-col gap-4">
              {isAuthenticated ? (
                <>
                  <Button
                    href={isAdmin ? '/admin' : isStaff ? '/staff' : '/dashboard'}
                    onClick={onClose}
                    variant="secondary"
                    className="w-full"
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="w-full text-red-400 hover:text-red-300 flex items-center gap-2 justify-center"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button href="/login" onClick={onClose} variant="ghost" className="w-full">
                    Log In
                  </Button>
                  <Button href="/register" onClick={onClose} variant="primary" className="w-full">
                    Register
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
