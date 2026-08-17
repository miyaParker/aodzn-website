'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { createRipple } from '../lib/animations';
const logo = '/assets/logo.svg';

interface NavbarProps {
  onOpenContact: () => void;
  onOpenShowreel: () => void;
}

// Kept to the site's actual sections — the previous #mentorship/#about items
// pointed at nothing. DIGITAL's content (stack, tooling) is effectively the
// services pitch, so it's labeled that way here instead of adding a section.
export default function Navbar({ onOpenContact, onOpenShowreel }: NavbarProps) {
  const isHome = usePathname() === '/';
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Work', href: '#work' },
    { label: 'Process', href: '#process' },
    { label: 'Strategy', href: '#strategy' },
    { label: 'Services', href: '#digital' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-spy: highlights whichever section is crossing the middle band of
  // the viewport, so the pill follows scroll position, not just clicks.
  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top <= b.boundingClientRect.top ? a : b));
        setActiveSection(topMost.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Off the homepage, these hrefs (#home, #work, ...) point at anchors that
  // don't exist on this page — fall through to a real navigation to the
  // homepage anchor instead of smooth-scrolling in place.
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isHome) return;
    e.preventDefault();
    createRipple(e);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(href.substring(1));
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header
        id="navbar-header"
        className={`fixed top-0 left-0 right-0 z-40 bg-[#F6F6F4] border-b border-black/10 transition-all duration-500 ${
          isScrolled ? 'py-3.5' : 'py-6'
        }`}
      >
        <div className="px-8 xl:px-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href={isHome ? '#home' : '/'}
            onClick={(e) => scrollToSection(e, '#home')}
            className="group flex items-center"
          >
            <img
              src={logo}
              alt="AODZN"
              className="h-7 sm:h-8 w-auto"
              style={{ filter: 'brightness(0)' }}
            />
          </a>

          {/* Desktop Navigation — each tab is its own rounded segment with a
              small gap between, sitting inside the darker parent pill. */}
          <nav className="hidden md:flex items-center gap-1 rounded-md bg-neutral-900 p-[0.2rem] text-xs tracking-normal font-bold capitalize">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.label}
                  href={isHome ? item.href : `/${item.href}`}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`relative rounded-sm px-5 py-3 transition-colors duration-200 ${
                    isActive ? 'text-black' : 'bg-neutral-800 text-neutral-300 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-sm bg-white"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right cluster — menu button */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-sm border border-black/15 text-black hover:bg-black/5 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-sm border border-black/15 text-black hover:bg-black/5 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-[#F6F6F4] pt-24 px-6 pb-8 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#04a3cc]/10 text-[#04a3cc] text-xs font-medium border border-[#04a3cc]/30 w-fit">
                <span className="w-2 h-2 rounded-[20px] bg-[#04a3cc] animate-pulse" />
                <span>Available for New Projects</span>
              </div>

              <div className="space-y-4 pt-4 border-t border-black/10">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className="block text-3xl font-display font-medium uppercase tracking-wide text-black hover:pl-2 transition-all"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-black/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenShowreel();
                }}
                className="w-full py-3.5 rounded-sm border border-black/20 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 bg-white"
              >
                <Sparkles className="w-4 h-4 text-[#04a3cc]" />
                <span>Play Showreel</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-4 rounded-sm bg-[#04a3cc] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <span>LET'S WORK TOGETHER</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}