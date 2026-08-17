'use client';

import React from 'react';
import { motion } from 'motion/react';

interface Step {
  word: string;
  suffix: string;
  tag: string;
  description: string;
  accent: string;
}

const STEPS: Step[] = [
  {
    word: 'DEFINE',
    suffix: 'FINE',
    tag: 'DISCOVERY',
    description: 'We dig into your goals, your users, and the real problem worth solving.',
    accent: '#04a3cc',
  },
  {
    word: 'DESIGN',
    suffix: 'SIGN',
    tag: 'ARCHITECTURE',
    description: 'We structure intuitive flows and information maps that scale with the product.',
    accent: '#f59e0b',
  },
  {
    word: 'DELIVER',
    suffix: 'LIVER',
    tag: 'HANDOFF',
    description: 'We ship polished, production-ready experiences your team can build on.',
    accent: '#10b981',
  },
];

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
  return (
    <section id="strategy" className="w-full flex">
      {/* Shared "DE" block — same height as one row, sticks at the top of the
          section so each row scrolls up and intersects it in turn. */}
      <div className="hidden sm:flex shrink-0 w-72 lg:w-[23rem] min-h-[420px] sm:min-h-[520px] bg-black items-center justify-center sticky top-20 self-start overflow-hidden">
        <span
          aria-hidden="true"
          className="font-display font-medium text-white text-[13rem] lg:text-[18rem] leading-none whitespace-nowrap m-0 p-0"
        >
          DE
        </span>
      </div>

      <div className="flex-1 flex flex-col">
        {STEPS.map((step, index) => (
          <motion.div
            key={step.word}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row min-h-[420px] sm:min-h-[520px] border-b border-black/10 last:border-b-0 bg-white"
          >
            {/* Headline + description */}
            <div className="flex-1 flex flex-col justify-center gap-4 px-6 sm:px-10 py-10 sm:py-16">
              <div className="flex flex-wrap items-center gap-3" aria-label={step.word}>
                <h3
                  aria-hidden="true"
                  className="text-6xl sm:text-8xl lg:text-9xl font-display font-medium uppercase text-black leading-[0.9]"
                >
                  {step.suffix}
                </h3>
                <motion.span
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  className="inline-block px-3 py-1 rounded-sm text-white font-mono font-bold text-xs uppercase tracking-widest transform -rotate-6 cursor-pointer"
                  style={{ backgroundColor: step.accent }}
                >
                  {step.tag}
                </motion.span>
              </div>
              <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed max-w-sm">
                {step.description}
              </p>
            </div>

            {/* Doodle */}
            <div className="hidden lg:flex w-48 shrink-0 items-center justify-center px-6">
              <StepDoodle accent={step.accent} variant={index} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}