'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const WORD_EASE = [0.76, 0, 0.24, 1] as const;
const ENTER_DURATION = 0.7;
const EXIT_DURATION = 0.25;

interface Step {
  word: string;
  tag: string;
  description: string;
  accent: string;
  bgAccent: string;
}

// `word` is only the tail of each question — the sticky panel supplies the
// interrogative (WHO/WHY/WHAT) that starts it, so the two columns read as
// one sentence together: "WHO" + "ARE WE DESIGNING FOR?".
const STEPS: Step[] = [
  {
    word: 'ARE WE DESIGNING FOR?',
    tag: 'DISCOVERY',
    description: 'We explore the people, needs, behaviours, goals, and context behind the problem, building a deeper understanding of who we\'re designing for and what their experience actually looks like.',
    accent: '#f59e0b',
    bgAccent: '#f2fafc',
  },
  {
    word: 'DOES THIS MATTER?',
    tag: 'CLARITY',
    description: 'We connect what we\'ve learned to the problem at hand, uncovering the needs and opportunities that matter most and making sure we\'re solving something meaningful, relevant, and worth pursuing.',
    accent: '#A5CD04',
    bgAccent: '#e6f6fa',
  },
  {
    word: 'COULD THIS BECOME?',
    tag: 'DIRECTION',
    description: 'We turn our understanding into a clear and purposeful direction, bringing together the insights, possibilities, and constraints to shape a product experience that has somewhere meaningful to go.',
    accent: '#10b981',
    bgAccent: '#f2fafc',
  },
];

// One interrogative per row, in the same order as STEPS — the sticky panel
// cycles to whichever word matches the row currently under the fold, and
// its own row's `word` above finishes that same sentence.
const QUESTION_STARTS = ['WHO', 'WHY', 'WHAT'];

function StepDoodle({ accent, variant }: { accent: string; variant: number }) {
  return (
    <svg className="w-24 h-24 sm:w-28 sm:h-28" viewBox="0 0 120 120" fill="none">
      {variant === 0 && (
        <>
          <path
            d="M 16 90 Q 40 30, 70 55 T 104 24"
            stroke="#111111"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="16" cy="90" r="7" fill={accent} className="animate-pulse" />
          <circle cx="104" cy="24" r="6" fill={accent} />
          <path d="M 88 12 L 100 24 M 100 12 L 88 24" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {variant === 1 && (
        <>
          <rect x="24" y="24" width="52" height="52" rx="4" stroke="#111111" strokeWidth="3" fill="none" transform="rotate(-6 50 50)" />
          <path d="M 30 30 L 66 66 M 66 30 L 30 66" stroke="#111111" strokeWidth="2" strokeLinecap="round" transform="rotate(-6 50 50)" />
          <circle cx="96" cy="90" r="9" fill={accent} />
          <circle cx="96" cy="90" r="9" stroke="#111111" strokeWidth="2" fill="none" opacity="0.15" />
        </>
      )}
      {variant === 2 && (
        <>
          <circle cx="60" cy="60" r="34" stroke="#111111" strokeWidth="2" strokeDasharray="3 4" fill="none" />
          <path d="M 42 60 L 55 73 L 82 44" stroke={accent} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      )}
    </svg>
  );
}

export default function StrategySection() {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Which row is "current" is whichever row's own center is closest to the
  // viewport's center — a "top past the fold" threshold flips too early,
  // while the previous row's content still dominates the screen. This is
  // the only thing that animates in the section: the sticky panel's word.
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const viewportCenter = window.innerHeight / 2;
      let current = 0;
      let bestDist = Infinity;
      rowRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - viewportCenter);
        if (dist < bestDist) {
          bestDist = dist;
          current = i;
        }
      });
      setActiveIndex(current);
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
    <section id="values" className="w-full flex">
      {/* Section label — same height as one row, sticks at the top of the
          section so each row scrolls up and intersects it in turn. */}
      <div className="hidden sm:flex shrink-0 w-72 lg:w-[23rem] min-h-[420px] sm:min-h-[520px] bg-[#0082a8] items-center justify-center sticky top-20 self-start overflow-hidden">
        <div className="relative flex items-center justify-center" style={{ perspective: 600 }}>
          <AnimatePresence>
            <motion.span
              key={activeIndex}
              aria-live="polite"
              initial={{ opacity: 0, y: 40, rotateX: -45 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, position: 'absolute', transition: { duration: EXIT_DURATION, ease: WORD_EASE } }}
              transition={{ duration: ENTER_DURATION, ease: WORD_EASE }}
              style={{ transformOrigin: '50% 100%' }}
              className="font-display font-medium text-white text-9xl lg:text-[13rem] uppercase tracking-tight leading-none whitespace-nowrap"
            >
              {QUESTION_STARTS[activeIndex]}
            </motion.span>
          </AnimatePresence>

          {/* Pill: same rotated-badge treatment as Hero's word tags, in the
              same lemon-peel accent as Hero's INTENTIONAL pill. */}
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.6, rotate: -26 }}
            animate={{ opacity: 1, scale: 1, rotate: -16 }}
            transition={{ duration: 0.7, ease: WORD_EASE, delay: 0.3 }}
            whileHover={{ rotate: 2, scale: 1.08 }}
            className="absolute -top-10 -left-10 px-4 py-2 rounded-sm bg-[#A5CD04] text-black font-display font-bold text-4xl uppercase select-none cursor-default"
          >
            MY APPROACH
          </motion.span>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {STEPS.map((step, index) => (
          <div
            key={step.word}
            ref={(el) => { rowRefs.current[index] = el; }}
            style={{ backgroundColor: step.bgAccent }}
            className="flex flex-col sm:flex-row min-h-[420px] sm:min-h-[520px] border-b border-black/10 last:border-b-0 "
          >
            {/* Headline + description */}
            <div className="flex-1 flex flex-col justify-center gap-4 px-6 sm:px-10 py-10 sm:py-16">
              <div className="flex flex-wrap items-center gap-3 relative w-max" aria-label={step.word}>
                <h3 className="text-6xl sm:text-8xl lg:text-9xl font-display font-medium uppercase text-black leading-[0.95]">
                  {step.word}
                </h3>
                <motion.span
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  className="absolute right-0 -bottom-3 inline-block px-2 py-2 rounded-sm font-display font-bold text-2xl uppercase tracking-widest transform -rotate-16 cursor-pointer leading-[90%]"
                  style={{ backgroundColor: step.accent }}
                >
                  {step.tag}
                </motion.span>
              </div>
              <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed max-w-3xl">
                {step.description}
              </p>
            </div>

            {/* Doodle */}
            <div className="hidden lg:flex w-48 shrink-0 items-center justify-center px-6">
              <StepDoodle accent={step.accent} variant={index} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}