'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { Instagram, Linkedin, Globe, ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { createRipple } from '../lib/animations';
const logo = '/assets/logo.svg';

interface FooterProps {
  onOpenContact?: () => void;
}

const menuLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Portfolio', href: '#work' },
  { label: 'My process', href: '#process' },
  { label: 'About', href: '#strategy' },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  { label: 'Website', href: '#home', icon: Globe },
];

export default function Footer({ onOpenContact }: FooterProps) {
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
    if (!isHome) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      className="bg-black text-white px-8 xl:px-16 pt-24 sm:pt-32 pb-6 flex flex-col"
    >
      {/* CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 sm:mb-20">
        <div className="lg:col-span-8">
          <h2
            ref={headingRef}
            className="text-5xl sm:text-7xl lg:text-8xl font-display font-medium uppercase text-white leading-[0.88]"
          >
            <span ref={lineRef} className="block">LET'S BUILD SOMETHING</span>
            <span ref={highlightRef} className="block text-neutral-500">MEANINGFUL.</span>
          </h2>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
            I design digital products that solve real problems and create real impact.
          </p>

          <div>
            <button
              onClick={(e) => {
                createRipple(e);
                onOpenContact?.();
              }}
              data-cursor="hover"
              data-cursor-text="CONNECT"
              className="relative group inline-flex items-center gap-3 px-8 py-4 tracking-wide rounded-sm bg-white text-black text-2xl sm:text-3xl font-medium font-display uppercase hover:bg-neutral-200 hover:scale-105 active:scale-95 transition-all ripple-container"
            >
              <span>LET'S CONNECT</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div ref={logoRef} className="w-full flex flex-col sm:flex-row sm:items-start sm:justify-between gap-10 sm:gap-6">
        {/* Logo */}
        <div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="w-28 sm:w-36 lg:w-40"
          >
            <a href={isHome ? '#home' : '/'} onClick={(e) => scrollToSection(e, '#home')} className="block">
              <img src={logo} alt="AODZN" className="w-full h-auto" style={{ filter: 'brightness(0) invert(1)' }} />
            </a>
            <p className="tracking-wide text-xs uppercase text-neutral-500">Abdulazees Olayinka Design</p>
          </motion.div>
        </div>

        {/* Menu / Contact / Social columns */}
        <div className="grid grid-cols-3 gap-8 sm:gap-14 lg:gap-20">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-4">Menu</p>
            <ul className="space-y-2.5">
              {menuLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={isHome ? item.href : `/${item.href}`}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className="text-sm sm:text-base text-neutral-300 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onOpenContact?.()}
                  className="text-sm sm:text-base text-neutral-300 hover:text-white transition-colors text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-4">Contact</p>
            <a
              href="mailto:hello@aodzn.com"
              className="text-sm sm:text-base text-neutral-300 hover:text-white transition-colors break-all"
            >
              hello@aodzn.com
            </a>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-4">Social</p>
            <div className="flex items-center gap-2">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="flex items-center justify-center w-9 h-9 rounded-sm border border-neutral-800 text-neutral-400 hover:text-white hover:border-[#04a3cc] transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-16 sm:mt-20">
        <div className="pt-6 border-t border-neutral-800 flex items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <p>&copy;2026 AODZN</p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}