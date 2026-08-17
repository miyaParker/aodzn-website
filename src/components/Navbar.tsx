'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';
import { X, ArrowUpRight, Sparkles } from 'lucide-react';
import { createRipple } from '../lib/animations';
import { NavLink, SiteSettings } from '../types';

const EASE = [0.76, 0, 0.24, 1] as const;

// A staggered two-bar mark reads less like a stock hamburger icon and more
// like a deliberate wordmark-adjacent glyph — paired with a text label, the
// way the toggle is drawn in the reference.
function MenuToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 text-black hover:opacity-70 transition-opacity cursor-pointer"
      aria-label="Toggle Navigation"
    >
      <span className="text-sm sm:text-base font-medium">{open ? 'Close' : 'Menu'}</span>
      <span className="relative w-6 h-6 shrink-0">
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span
              key="menu"
              initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg width="22" height="13" viewBox="0 0 22 13" fill="none">
                <rect width="22" height="2.2" rx="1.1" fill="currentColor" />
                <rect x="8" y="10.3" width="14" height="2.2" rx="1.1" fill="currentColor" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}

interface NavbarProps {
  siteSettings: SiteSettings;
  onOpenContact: () => void;
  onOpenShowreel: () => void;
  // Lets a page swap in nav items that point at its own in-page sections
  // instead of the homepage's — e.g. a case study page links to its own
  // Overview/Challenge/Solution/Impact anchors rather than #home/#work.
  navItems?: NavLink[];
}

export default function Navbar({ siteSettings, onOpenContact, onOpenShowreel, navItems: navItemsProp }: NavbarProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  // Case study pages open with a full-bleed colored hero directly under the
  // transparent navbar, so the logo needs to read white there instead of
  // the black mark used everywhere else, and their nav items scroll within
  // the page instead of navigating back to the homepage.
  const isCaseStudy = /^\/works\/.+/.test(pathname ?? '');
  const scrollsInPage = isHome || isCaseStudy;
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = navItemsProp ?? siteSettings.navItems;

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

  // The logo always points home — off the homepage, let its href='/' do a
  // real navigation instead of smooth-scrolling to a #home that isn't there.
  const scrollToHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) return;
    e.preventDefault();
    createRipple(e);
    const target = document.querySelector('#home');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setActiveSection('home');
      setMobileMenuOpen(false);
    }
  };

  // Nav items scroll in place on any page that owns the sections they point
  // at (home, and case study pages via their own navItems override) —
  // elsewhere they fall through to a real navigation back to the homepage.
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!scrollsInPage) return;
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
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'py-3.5 bg-white/70 backdrop-blur-md border-b border-black/5'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="px-8 xl:px-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href={isHome ? '#home' : '/'}
            onClick={scrollToHome}
            className="group flex items-center"
          >
            {siteSettings.logo && (
              <img
                src={siteSettings.logo}
                alt={siteSettings.logoAlt}
                className="h-7 sm:h-8 w-auto"
                style={{ filter: isCaseStudy && !isScrolled ? 'brightness(0) invert(1)' : 'brightness(0)' }}
              />
            )}
          </a>

          {/* Desktop Navigation — each tab is its own rounded segment with a
              small gap between, sitting inside the darker parent pill. */}
          <nav className="hidden md:flex items-center gap-1 rounded-md bg-neutral-900 p-[0.2rem] text-xs tracking-normal font-bold capitalize">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.label}
                  href={scrollsInPage ? item.href : `/${item.href}`}
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
            <MenuToggle open={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <MenuToggle open={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
          </div>
        </div>
      </header>

      {/* Mega menu — full-bleed rows, each one a huge display-type headline
          with a divider and an arrow, closing on two bold CTA cards. Bigger
          and blunter than a conventional dropdown list on purpose. */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 z-30 bg-[#F6F6F4] overflow-y-auto"
          >
            <div className="min-h-full flex flex-col px-6 sm:px-10 lg:px-16 pt-24 sm:pt-28 pb-8 sm:pb-10">
              <nav className="border-t border-black/10">
                {navItems.map((item, i) => {
                  const isActive = activeSection === item.href.substring(1);
                  return (
                    <div key={item.label} className="overflow-hidden border-b border-black/10">
                      <motion.a
                        href={scrollsInPage ? item.href : `/${item.href}`}
                        onClick={(e) => scrollToSection(e, item.href)}
                        initial={{ y: '100%' }}
                        animate={{ y: '0%' }}
                        transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
                        className={`group flex items-center justify-between gap-6 py-4 sm:py-6 transition-colors duration-300 ${
                          isActive ? 'text-[#04a3cc]' : 'text-black hover:text-[#04a3cc]'
                        }`}
                      >
                        <span className="font-display font-medium uppercase leading-none tracking-tight text-6xl sm:text-7xl lg:text-8xl">
                          {item.label}
                        </span>
                        <ArrowUpRight className="w-7 h-7 sm:w-9 sm:h-9 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </motion.a>
                    </div>
                  );
                })}
              </nav>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenContact();
                  }}
                  className="group flex items-center justify-between gap-6 rounded-md bg-[#04a3cc] text-white px-6 sm:px-8 py-8 sm:py-10 text-left hover:brightness-105 transition-[filter]"
                >
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-widest text-white/70 mb-3">Contact</span>
                    <span className="block font-display font-medium uppercase text-3xl sm:text-4xl leading-[0.95]">
                      {siteSettings.navbarCtaLabel}
                    </span>
                  </div>
                  <ArrowUpRight className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenShowreel();
                  }}
                  className="group flex items-center justify-between gap-6 rounded-md bg-white border border-black/10 text-black px-6 sm:px-8 py-8 sm:py-10 text-left hover:border-black/20 transition-colors"
                >
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Showreel</span>
                    <span className="block font-display font-medium uppercase text-3xl sm:text-4xl leading-[0.95]">
                      {siteSettings.navbarShowreelLabel}
                    </span>
                  </div>
                  <Sparkles className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 text-[#04a3cc]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}