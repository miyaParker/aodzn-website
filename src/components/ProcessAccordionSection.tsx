'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HomePageContent, ProcessStepContent } from '../types';

const EASE = [0.76, 0, 0.24, 1] as const;

const ACCENT = '#04a3cc';
const NEUTRAL = '#737373'; // Tailwind neutral-500
// Clears the fixed navbar.
const STACK_TOP_OFFSET = 96;
// Each card sticks at STACK_TOP_OFFSET + its own index * PEEK — kept small
// on purpose. Each new card rises almost all the way to the top of the one
// before it, covering nearly all of its content; PEEK is just enough for a
// hairline sliver (that card's border) to keep showing above it, which is
// what reads as an accumulating stack rather than a hard swap. Cards are
// plain flow siblings (no wrapper spacer) — each card's own height is what
// gives the next one room to slide over it, so once the last card's height
// is used up the whole stack releases and the section scrolls away.
const PEEK = 2;
// The card's own rendered height — also its scroll "dwell" budget, i.e. how
// long it stays the topmost card before the next one covers it.
const ROW_MIN_HEIGHT = 280;

// Hover preview box — mirrors the Journal section's approach: measure the
// actual gap between the title and the description (rather than guessing a
// fixed offset) and slide a small preview into exactly that space.
const PREVIEW_HEIGHT = 200;
const PREVIEW_WIDTH_MIN = 180;
const PREVIEW_WIDTH_MAX = 280;

interface ProcessAccordionSectionProps {
  steps: ProcessStepContent[];
  content: HomePageContent['processSection'];
}

export default function ProcessAccordionSection({ steps, content }: ProcessAccordionSectionProps) {
  const [active, setActive] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Which card is "active" (topmost) isn't a fixed fraction of scroll
  // progress — each card's own stuck range depends on its rendered height,
  // which isn't uniform with the header in the mix. Measuring each card's
  // real position directly is what keeps this in sync with what's actually
  // on screen, rather than drifting and coloring the wrong card.
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      let current = 0;
      cardRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= STACK_TOP_OFFSET + i * PEEK + 1) {
          current = i;
        }
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    measure();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="process" className="relative w-full bg-white text-black">
      <div className="px-6 sm:px-10 lg:px-16 pt-24 sm:pt-32 pb-10 sm:pb-14">
      <p className="text-sm text-neutral-500 font-bold uppercase tracking-wider overflow-hidden mb-4">
                <motion.span
                  className="block"
                  initial={{ y: '100%', opacity: 0 }}
                  whileInView={{ y: '0%', opacity: 1 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  {content.eyebrowLabel}
                </motion.span>
              </p>
        <h2 className="font-display font-medium text-5xl sm:text-6xl lg:text-7xl leading-[1.05] max-w-3xl uppercase">
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: '100%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              {content.heading}
            </motion.span>
          </span>
        </h2>
      </div>

      {steps.map((step, i) => {
        const isActive = i === active;
        return (
          <StepCard
            key={step.number}
            step={step}
            isActive={isActive}
            cardRef={(el) => { cardRefs.current[i] = el; }}
            top={STACK_TOP_OFFSET + i * PEEK}
            zIndex={i + 1}
            peekOffset={i * PEEK}
          />
        );
      })}
    </section>
  );
}

interface PreviewRect {
  top: number;
  left: number;
  width: number;
}

function StepCard({
  step,
  isActive,
  cardRef,
  top,
  zIndex,
  peekOffset,
}: {
  step: ProcessStepContent;
  isActive: boolean;
  cardRef: (el: HTMLDivElement | null) => void;
  top: number;
  zIndex: number;
  peekOffset: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [rect, setRect] = useState<PreviewRect | null>(null);

  const showPreview = () => {
    setHovered(true);
    const anchor = anchorRef.current;
    const container = containerRef.current;
    if (!anchor || !container) return;
    const anchorBox = anchor.getBoundingClientRect();
    const containerBox = container.getBoundingClientRect();
    const width = Math.max(PREVIEW_WIDTH_MIN, Math.min(PREVIEW_WIDTH_MAX, anchorBox.width - 24));
    setRect({
      top: anchorBox.top - containerBox.top + anchorBox.height / 2 - PREVIEW_HEIGHT / 2,
      left: anchorBox.left - containerBox.left + (anchorBox.width - width) / 2,
      width,
    });
  };

  const hidePreview = () => setHovered(false);

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        cardRef(el);
      }}
      onMouseEnter={showPreview}
      onMouseLeave={hidePreview}
      className="relative sticky bg-white"
      style={{ top, zIndex, minHeight: ROW_MIN_HEIGHT }}
    >
      {/* Countering this card's own PEEK offset here means every card's
          border lands on the exact same pixel row (the stack's top),
          instead of drifting down by i * PEEK with the card itself — so the
          visible line never shows a seam. */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 border-t transition-colors duration-500"
        style={{ top: -peekOffset, borderColor: isActive ? ACCENT : NEUTRAL }}
      />

      <div className="relative h-full px-6 sm:px-10 lg:px-16 pt-10 pb-6 sm:pt-12 sm:pb-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(17,17,17,0.8) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }}
        />

        <div
          tabIndex={0}
          onFocus={showPreview}
          onBlur={hidePreview}
          className="relative flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-10 outline-none"
        >
          <div className="shrink-0 overflow-hidden">
            <motion.span
              className="font-display text-7xl sm:text-8xl lg:text-9xl leading-none block transition-colors duration-500"
              style={{ color: isActive ? ACCENT : NEUTRAL }}
              initial={{ y: '100%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {step.number}
            </motion.span>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl leading-tight tracking-tight flex-1 max-w-xl overflow-hidden font-medium">
            <motion.span
              className="block"
              initial={{ y: '100%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {step.title}
            </motion.span>
          </h3>

          <motion.p
            className="sm:w-80 shrink-0 text-neutral-400 text-sm sm:text-base leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {step.description}
          </motion.p>

          <span ref={anchorRef} aria-hidden="true" className="hidden sm:block sm:flex-1 sm:min-w-8 sm:self-stretch" />

          {/* Hover preview: slides into the gap between the title and the
              description, in whatever space is actually left over. */}
          <div className="hidden lg:block pointer-events-none absolute inset-0 z-10">
            <AnimatePresence>
              {hovered && rect && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, top: rect.top, left: rect.left, width: rect.width }}
                  animate={{ opacity: 1, scale: 1, top: rect.top, left: rect.left, width: rect.width }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="absolute rounded-md overflow-hidden shadow-2xl shadow-black/60 flex items-center justify-center"
                  style={{ height: PREVIEW_HEIGHT, background: step.gradient }}
                >
                  <span className="font-display text-2xl xl:text-3xl tracking-wide text-white">{step.phase}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}