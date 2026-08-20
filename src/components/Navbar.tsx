'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';
import { X, Sparkles, Home, Compass, Workflow, Briefcase, BookOpen, Circle } from 'lucide-react';
import { createRipple } from '../lib/animations';
import { NavLink, SiteSettings } from '../types';

const EASE = [0.76, 0, 0.24, 1] as const;

// Display order for the mega menu's social row, independent of however
// they're ordered in Studio.
const SOCIAL_LINK_ORDER = ['X', 'LinkedIn', 'Instagram', 'Website'];

// Nav items have no per-item image in the data model, so the hover swatch
// pairs a small illustrative icon (matched by keyword against the item's
// label) with a gradient tile in the same radial-bloom-over-dark-base style
// already used for journal article cards.
const NAV_PREVIEW_GRADIENTS = [
  'radial-gradient(120% 120% at 20% 15%, #a78bfa 0%, transparent 55%), radial-gradient(100% 100% at 80% 80%, #f59e0b 0%, transparent 45%), linear-gradient(160deg, #3b0764, #1e1b4b 70%)',
  'radial-gradient(120% 120% at 20% 15%, #38bdf8 0%, transparent 55%), radial-gradient(100% 100% at 80% 80%, #1d4ed8 0%, transparent 45%), linear-gradient(160deg, #0c1a3d, #050914 70%)',
  'radial-gradient(120% 120% at 20% 15%, #fb7185 0%, transparent 55%), radial-gradient(100% 100% at 80% 80%, #f97316 0%, transparent 45%), linear-gradient(160deg, #4c0519, #1f0a10 70%)',
  'radial-gradient(120% 120% at 20% 15%, #34d399 0%, transparent 55%), radial-gradient(100% 100% at 80% 80%, #6366f1 0%, transparent 45%), linear-gradient(160deg, #022c22, #0f172a 70%)',
  'radial-gradient(120% 120% at 20% 15%, #f472b6 0%, transparent 55%), radial-gradient(100% 100% at 80% 80%, #8b5cf6 0%, transparent 45%), linear-gradient(160deg, #3b0764, #1e1b4b 70%)',
];

function getNavIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes('home') || l.includes('welcome')) return Home;
  if (l.includes('approach')) return Compass;
  if (l.includes('process')) return Workflow;
  if (l.includes('work')) return Briefcase;
  if (l.includes('journal') || l.includes('blog')) return BookOpen;
  return Circle;
}

// Small hover swatch — an icon-on-gradient tile that reveals inline next to
// the label, rather than a floating preview box. Keeping it inside the row
// means it's guaranteed to stay within the panel's own bounds.
function NavItemSwatch({ label, index }: { label: string; index: number }) {
  const Icon = getNavIcon(label);
  return (
    <span
      aria-hidden="true"
      className="shrink-0 flex items-center justify-center w-0 h-11 sm:h-12 rounded-lg overflow-hidden opacity-0 scale-90 group-hover:w-11 sm:group-hover:w-12 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out"
      style={{ background: NAV_PREVIEW_GRADIENTS[index % NAV_PREVIEW_GRADIENTS.length] }}
    >
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white shrink-0" strokeWidth={1.75} />
    </span>
  );
}

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
  const [hideForSection, setHideForSection] = useState(false);

  const navItems = navItemsProp ?? siteSettings.navItems;
  // The mega menu is used globally, off the homepage too, so it's limited
  // to items with a real standalone destination. In the CMS data every item
  // (including Works/Journal) is stored as a homepage anchor — #works,
  // #journal — so this both drops Approach/Process (no page of their own)
  // and swaps Works/Journal's href for their actual route rather than the
  // homepage section.
  const MEGA_MENU_ROUTES: Record<string, string> = { home: '/', works: '/works', journal: '/journal' };
  const megaMenuItems = [
    ...navItems
      .filter((item) => item.href.replace(/^#/, '') in MEGA_MENU_ROUTES)
      .map((item) => ({ ...item, href: MEGA_MENU_ROUTES[item.href.replace(/^#/, '')] })),
    { label: 'About', href: '/about' },
  ];

  // Lock background scroll while the menu is open — unlike the old
  // full-screen panel, the page is now visible (blurred) behind it, so it
  // would otherwise still scroll underneath.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

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
      .filter((item) => item.href.startsWith('#'))
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

  // The Portfolio ("Work") and Testimonials sections are full-bleed
  // scrollytelling blocks — the fixed navbar competes with them visually, so
  // it slides out of the way for as long as either is in view and returns
  // once scrolled past. One observer tracks both; the navbar stays hidden
  // as long as at least one of them is still intersecting.
  useEffect(() => {
    if (!isHome) return;
    const targets = ['#works', '#testimonials']
      .map((selector) => document.querySelector(selector))
      .filter((el): el is Element => el !== null);
    if (targets.length === 0) return;

    const intersecting = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) intersecting.add(entry.target);
          else intersecting.delete(entry.target);
        });
        setHideForSection(intersecting.size > 0);
      },
      { threshold: 0.15 }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [isHome]);

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
  // Items whose href is a real route (e.g. /works) rather than a #anchor
  // always fall through to a normal navigation.
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#') || !scrollsInPage) return;
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
        } ${hideForSection && !mobileMenuOpen ? '-translate-y-full pointer-events-none' : 'translate-y-0'}`}
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
              const isAnchor = item.href.startsWith('#');
              const isActive = isAnchor
                ? activeSection === item.href.substring(1)
                : pathname?.startsWith(item.href);
              return (
                <a
                  key={item.label}
                  href={isAnchor ? (scrollsInPage ? item.href : `/${item.href}`) : item.href}
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

      {/* Mega menu — a floating dark panel anchored under the toggle,
          rather than a full-screen takeover. The rest of the page stays
          visible through a blurred scrim behind it instead of being hidden
          outright, so the menu reads as an overlay, not a scene change. */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <React.Fragment key="mega-menu">
            <motion.button
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="fixed inset-0 z-20 bg-black/10 backdrop-blur-md cursor-default"
            />

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="fixed z-30 top-24 sm:top-28 right-4 sm:right-6 bottom-4 sm:bottom-6 w-[calc(100%-2rem)] sm:w-[420px] lg:w-[460px] rounded-2xl sm:rounded-3xl bg-black text-white flex flex-col overflow-y-auto shadow-2xl"
            >
              <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                <nav className="flex flex-col">
                  {megaMenuItems.map((item, i) => {
                    const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
                    return (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                        className={`group py-2.5 sm:py-3 font-sans text-4xl sm:text-5xl leading-tight transition-colors duration-300 flex items-center gap-4 ${
                          isActive ? 'text-[#04a3cc]' : 'text-white hover:text-neutral-400'
                        }`}
                      >
                        {item.label}
                        <NavItemSwatch label={item.label} index={i} />
                      </motion.a>
                    );
                  })}
                  <motion.button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenShowreel();
                    }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: megaMenuItems.length * 0.05, ease: EASE }}
                    className="group py-2.5 sm:py-3 text-left font-sans text-4xl sm:text-5xl leading-tight text-white hover:text-neutral-400 transition-colors duration-300 flex items-center gap-4"
                  >
                    {siteSettings.navbarShowreelLabel}
                    <span
                      aria-hidden="true"
                      className="shrink-0 flex items-center justify-center w-0 h-11 sm:h-12 rounded-lg overflow-hidden opacity-0 scale-90 group-hover:w-11 sm:group-hover:w-12 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out"
                      style={{ background: NAV_PREVIEW_GRADIENTS[megaMenuItems.length % NAV_PREVIEW_GRADIENTS.length] }}
                    >
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white shrink-0" strokeWidth={1.75} />
                    </span>
                  </motion.button>
                </nav>

                <div className="flex items-end justify-between gap-6 pt-10 mt-10 border-t border-white/15">
                  <div className="flex flex-col gap-2 text-sm sm:text-base">
                    <a
                      href={`mailto:${siteSettings.projectContactEmail}`}
                      className="underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
                    >
                      {siteSettings.projectContactEmail}
                    </a>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenContact();
                      }}
                      className="text-left text-white/50 hover:text-white transition-colors"
                    >
                      {siteSettings.navbarCtaLabel}
                    </button>
                  </div>

                  <div className="flex flex-col items-end gap-2 text-sm sm:text-base">
                    {[...siteSettings.socialLinks]
                      .sort((a, b) => SOCIAL_LINK_ORDER.indexOf(a.label) - SOCIAL_LINK_ORDER.indexOf(b.label))
                      .map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>
    </>
  );
}