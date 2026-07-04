'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Menu, X, ChevronDown, User, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import { NAV_LINKS, SERVICE_CATEGORIES } from '../../lib/constants';
import { cn } from '../../lib/utils';
import MobileNav from './MobileNav';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isAdmin, isStaff } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent',
          isScrolled
            ? 'bg-[#0a0a1a]/85 backdrop-blur-md border-white/5 py-4 shadow-lg'
            : 'bg-transparent py-6'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-500 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-all duration-300">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-tight text-white leading-none">
                GUARDIAN<span className="text-primary-400">RS</span>
              </span>
              <span className="text-[10px] text-surface-400 uppercase tracking-widest font-semibold mt-0.5">
                OSRS Boosting
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={cn(
                'text-sm font-medium transition-colors hover:text-white',
                pathname === '/' ? 'text-white' : 'text-surface-300'
              )}
            >
              Home
            </Link>
            
            {/* Mega Menu Toggle */}
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button
                className={cn(
                  'text-sm font-medium flex items-center gap-1 transition-colors hover:text-white focus:outline-none py-2',
                  pathname.startsWith('/skills') ||
                  pathname.startsWith('/bossing') ||
                  pathname.startsWith('/quests') ||
                  pathname.startsWith('/minigames')
                    ? 'text-white'
                    : 'text-surface-300'
                )}
              >
                Services <ChevronDown size={14} className={cn('transition-transform duration-200', isMegaMenuOpen && 'rotate-180')} />
              </button>

              {/* Mega Menu Dropdown */}
              {isMegaMenuOpen && (
                <div className="absolute top-full -left-48 w-[500px] p-6 rounded-2xl glass-card border border-white/10 bg-[#0a0a1a]/95 shadow-glass-lg grid grid-cols-2 gap-4 z-50 mt-1 animate-scale-in">
                  {SERVICE_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}`}
                      className="flex gap-4 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:border-primary-500/30 transition-all">
                        {cat.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-primary-400 transition-colors">
                          {cat.name}
                        </span>
                        <span className="text-xs text-surface-400 mt-0.5">
                          Explore {cat.count}+ premium services
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={cn(
                'text-sm font-medium transition-colors hover:text-white',
                pathname === '/about' ? 'text-white' : 'text-surface-300'
              )}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={cn(
                'text-sm font-medium transition-colors hover:text-white',
                pathname === '/contact' ? 'text-white' : 'text-surface-300'
              )}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Right Panel */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Button
                  href={isAdmin ? '/admin' : isStaff ? '/staff' : '/dashboard'}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <User size={16} />
                  <span>Dashboard</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2 text-surface-400 hover:text-white"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <>
                <Button href="/login" variant="ghost" size="sm">
                  Log In
                </Button>
                <Button href="/register" variant="primary" size="sm">
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile Hamburguer */}
          <div className="flex md:hidden items-center gap-3">
            {isAuthenticated && (
              <Button
                href={isAdmin ? '/admin' : isStaff ? '/staff' : '/dashboard'}
                variant="secondary"
                size="sm"
                className="!p-2.5 rounded-xl"
              >
                <User size={18} />
              </Button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
