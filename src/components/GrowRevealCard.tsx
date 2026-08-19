'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

// Starting square is half the final card's height/width: on a 4:3 box that
// means 25% inset top/bottom (half the height showing) and 31.25% inset
// left/right (half the height's worth of width, centered, staying square).
// Animating straight to CLIP_FULL in one continuous tween — rather than via
// an intermediate "square at full height" keyframe — means both axes reach
// their target at the same time instead of height finishing first.
const CLIP_HIDDEN = 'inset(25% 31.25% 25% 31.25%)';
const CLIP_FULL = 'inset(0% 0% 0% 0%)';

// Driven by a plain IntersectionObserver rather than Framer Motion's
// `whileInView`, and observing a plain wrapper rather than the clipped
// element itself: `clip-path` collapses the target to zero visible area at
// its initial state, which some engines treat as zero intersection — so a
// self-clipping element watching its own visibility can deadlock and never
// see itself come into view. The wrapper (never clipped) is what's observed;
// only the inner element carries the clip-path reveal.
export default function GrowRevealCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      // Positive bottom margin expands the trigger zone past the actual
      // viewport edge, so this fires while the card is still approaching
      // from below rather than waiting for it to actually be on screen.
      { threshold: 0, rootMargin: '0px 0px 200px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="relative aspect-[4/3] overflow-hidden rounded-sm bg-white">
      <motion.div
        initial={{ clipPath: CLIP_HIDDEN }}
        animate={revealed ? { clipPath: CLIP_FULL } : undefined}
        transition={{ duration: 0.55, delay, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        {children}
      </motion.div>
    </div>
  );
}
