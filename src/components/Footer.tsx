'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { Instagram, Linkedin, Globe, ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { createRipple } from '../lib/animations';
import { HomePageContent, SiteSettings, SocialLink } from '../types';

interface FooterProps {
  siteSettings: SiteSettings;
  footerCta: HomePageContent['footerCta'];
  onOpenContact?: () => void;
}

const SOCIAL_ICONS: Record<SocialLink['label'], typeof Instagram> = {
  Instagram: Instagram,
  LinkedIn: Linkedin,
  Website: Globe,
};

export default function Footer({ siteSettings, footerCta, onOpenContact }: FooterProps) {
  const isHome = usePathname() === '/';
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (logoRef.current) {
        gsap.fromTo(
          logoRef.current,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: logoRef.current,
              start: 'top 90%',
            },
          }
        );
      }

      if (lineRef.current && highlightRef.current) {
        const scrollTrigger = {
          trigger: headingRef.current,
          start: 'top 80%',
        };

        gsap.fromTo(
          lineRef.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', scrollTrigger }
        );

        gsap.fromTo(
          highlightRef.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.2, delay: 0.35, ease: 'power3.out', scrollTrigger }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#') || !isHome) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      className="min-h-screen bg-white text-black px-8 xl:px-16 pt-24 sm:pt-28 pb-6 flex flex-col justify-between"
    >
      {/* CTA + nav — same row, nav pinned to the far right. */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
        <div className="flex flex-col items-start gap-6">
          <p className="text-md text-neutral-500 font-bold uppercase tracking-wider overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: '100%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            >
              Contact Us
            </motion.span>
          </p>

          <h2
            ref={headingRef}
            className="text-5xl sm:text-7xl lg:text-8xl font-display font-medium uppercase text-black leading-[0.88]"
          >
            <span ref={lineRef} className="block">{footerCta.heading}</span>
            <span ref={highlightRef} className="block text-neutral-500">{footerCta.headingHighlight}</span>
          </h2>

          <button
            onClick={(e) => {
              createRipple(e);
              onOpenContact?.();
            }}
            data-cursor="hover"
            data-cursor-text="CONNECT"
            className="relative group inline-flex items-center gap-3 px-8 py-4 tracking-wide rounded-sm bg-black text-white text-2xl sm:text-3xl font-medium font-display uppercase hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all ripple-container"
          >
            <span>{footerCta.ctaLabel}</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        <nav className="flex flex-wrap items-center sm:justify-end gap-x-8 gap-y-3">
          {siteSettings.footerMenuLinks.map((item) => {
            const isAnchor = item.href.startsWith('#');
            return (
              <a
                key={item.label}
                href={isAnchor ? (isHome ? item.href : `/${item.href}`) : item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="text-sm sm:text-base font-medium text-neutral-600 hover:text-black transition-colors"
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Everything below the CTA row is pinned to the bottom of the same
          screen-height block, so the whole footer — CTA and footer
          elements alike — fits within one viewport. */}
      <div className="flex flex-col gap-10 sm:gap-14">
        {/* Full-bleed wordmark */}
        <motion.div
          ref={logoRef}
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="w-full"
        >
          <a href={isHome ? '#home' : '/'} onClick={(e) => scrollToSection(e, '#home')} className="block">
            {siteSettings.logo && (
              <img
                src={siteSettings.logo}
                alt={siteSettings.logoAlt}
                className="w-full h-auto max-h-32 sm:max-h-48 lg:max-h-64"
                style={{ filter: 'brightness(0)' }}
              />
            )}
          </a>
        </motion.div>

        <div className="w-full">
          <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm font-medium text-neutral-500">
            <p>&copy;{new Date().getFullYear()} {siteSettings.copyrightName}</p>

            <div className="flex items-center gap-6">
              {siteSettings.footerLegalLinks.map((link) => (
                <a key={link.label} href={link.href} className="hover:text-black transition-colors">
                  {link.label}
                </a>
              ))}

              <div className="flex items-center gap-2">
                {siteSettings.socialLinks.map((link) => {
                  const Icon = SOCIAL_ICONS[link.label];
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="flex items-center justify-center w-8 h-8 rounded-sm border border-neutral-300 text-neutral-500 hover:text-black hover:border-[#04a3cc] transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}