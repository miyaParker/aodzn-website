'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { heroVideoReady } from '../lib/heroVideoReady';

const WORDS = ['REDEFINE', 'BRANDS', 'DIGITAL'];
const BG_WORDS = ['PRODUCT', 'DESIGN', 'PROTOTYPE', 'RESEARCH'];
const bgRowText = (word: string) => Array.from({ length: 6 }, () => word).join(' ');
const BG_ROWS = 12;

// Owns its own interval/state so the frequent re-renders driven by the
// progress bar (elsewhere in Loader) can't interrupt its enter/exit
// transitions mid-flight.
function CyclingWord({ active }: { active: boolean }) {
  const [wordIndex, setWordIndex] = useState(0);

  // mode="wait" runs exit (220ms) then enter (220ms) sequentially, so the
  // interval must exceed that combined ~440ms or a new word arrives before
  // the previous swap finishes, permanently truncating the enter animation.
  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => {
      setWordIndex((i) => (i + 1) % WORDS.length);
    }, 600);
    return () => window.clearInterval(timer);
  }, [active]);

  const word = active ? WORDS[wordIndex] : WORDS[0];

  return (
    <div className="overflow-hidden h-[1.3em] flex items-center text-[13vw] sm:text-6xl md:text-[160px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.76, 0, 0.24, 1] }}
          className="block font-display font-medium uppercase text-white leading-none"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="mt-8 flex items-start gap-6 w-full">
      <div className="flex-1 h-20 sm:h-40 bg-neutral-800 shrink-0 w-[120px]">
        <motion.div
          className="h-full bg-white/80"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        />
      </div>
      <span className="font-display font-medium text-white text-3xl sm:text-[200px] tabular-nums my-0! py-0! leading-[1]!">
        {Math.round(progress)}%
      </span>
    </div>
  );
}

export default function Loader({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [cycling, setCycling] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDone(true);
      onComplete?.();
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const start = Date.now();
    const minDuration = 2200;
    // Don't let a slow/broken video hold the loader open indefinitely -
    // proceed anyway if it hasn't started playing within this window.
    const videoReadyTimeout = 6000;

    const progressTimer = window.setInterval(() => {
      setProgress((p) => (p >= 90 ? p : Math.min(p + Math.random() * 10 + 4, 90)));
    }, 180);

    let cancelled = false;
    const finish = () => {
      if (cancelled) return;
      const wait = Math.max(minDuration - (Date.now() - start), 0);
      window.setTimeout(() => {
        if (cancelled) return;
        window.clearInterval(progressTimer);
        setProgress(100);
        setCycling(false);
        window.setTimeout(() => {
          if (cancelled) return;
          setDone(true);
          onComplete?.();
          document.body.style.overflow = previousOverflow;
        }, 600);
      }, wait);
    };

    const windowLoaded = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));

    const videoReadyOrTimeout = Promise.race([
      heroVideoReady,
      new Promise<void>((resolve) => window.setTimeout(resolve, videoReadyTimeout)),
    ]);

    // Hold the loader open until the page has loaded AND the Hero video has
    // actually started playing, so there's no blank/frozen video the moment
    // it's revealed.
    Promise.all([windowLoaded, videoReadyOrTimeout]).then(finish);

    return () => {
      cancelled = true;
      window.clearInterval(progressTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
        >
          {/* Tiled background word texture */}
          <div className="absolute inset-0 flex flex-col justify-center gap-2 select-none pointer-events-none" aria-hidden="true">
            {Array.from({ length: BG_ROWS }).map((_, row) => {
              const rowText = bgRowText(BG_WORDS[row % BG_WORDS.length]);
              return (
                <div key={row} className="overflow-hidden shrink-0" style={{ height: '9vw', minHeight: 72 }}>
                  <motion.div
                    className="flex whitespace-nowrap font-display font-medium uppercase text-white/12 leading-none tracking-no"
                    style={{ fontSize: 'clamp(56px, 9vw, 450px)' }}
                    animate={{ x: row % 2 === 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
                    transition={{ duration: row % 2 === 0 ? 5 : 20, ease: 'linear', repeat: Infinity }}
                  >
                    <span className="pr-8 text-[180px]">{rowText}</span>
                    <span className="pr-8 text-[180px]">{rowText}</span>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-2xl">
            <CyclingWord active={cycling} />
            <ProgressBar progress={progress} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}