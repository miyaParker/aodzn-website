'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { createRipple } from '../lib/animations';
import { markHeroVideoReady } from '../lib/heroVideoReady';
interface HeroProps {
  ready: boolean;
  onOpenShowreel: () => void;
  topWordLeft: string;
  topWordRight: string;
  bottomWord: string;
  tagline: string;
  ctaLabel: string;
  video: string;
  sticker: string;
}

const WORD_EASE = [0.76, 0, 0.24, 1] as const;

function RevealWord({ ready, delay, className, innerRef, children }: {
  ready: boolean;
  delay: number;
  className: string;
  innerRef?: React.Ref<HTMLHeadingElement>;
  children: React.ReactNode;
}) {
  // overflow-hidden is only needed while the word is sliding up into view —
  // it's what masks the portion still below the baseline. Once the reveal
  // finishes we switch to visible so glyphs that optically overshoot the
  // font's nominal cap-height/baseline (a normal thing in type design)
  // aren't clipped at rest. Doing it this way (instead of padding the box)
  // keeps the wrapper's layout height exactly text-sized, since siblings
  // (e.g. the video cards) stretch to match that height.
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    if (!ready) setRevealed(false);
  }, [ready]);

  return (
    <div className={revealed ? 'overflow-visible' : 'overflow-hidden'} style={{ perspective: 600 }}>
      <motion.h1
        ref={innerRef}
        initial={{ y: '100%', opacity: 0, rotateX: 90 }}
        animate={ready ? { y: '0%', opacity: 1, rotateX: 0 } : { y: '100%', opacity: 0, rotateX: 90 }}
        transition={{ duration: 0.9, ease: WORD_EASE, delay: ready ? delay : 0 }}
        onAnimationComplete={() => { if (ready) setRevealed(true); }}
        style={{ transformOrigin: '50% 100%' }}
        className={`${className} [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]`}
      >
        {children}
      </motion.h1>
    </div>
  );
}

export default function Hero({
  ready,
  onOpenShowreel,
  topWordLeft,
  topWordRight,
  bottomWord,
  tagline,
  ctaLabel,
  video,
  sticker,
}: HeroProps) {
  // A single hidden <video> is the only decoded/playing instance. The two
  // "cards" never get their own <video> — instead each has a <canvas> that
  // repaints itself every frame with a crop of this one video, computed from
  // the cards' live positions on screen. Because both canvases sample the
  // exact same decoded frame on every tick, they can never drift apart, and
  // the crop math makes the two cards read as windows onto one continuous
  // video rather than two independent clips.
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardWindow1Ref = useRef<HTMLDivElement | null>(null);
  const cardWindow2Ref = useRef<HTMLDivElement | null>(null);
  const canvas1Ref = useRef<HTMLCanvasElement | null>(null);
  const canvas2Ref = useRef<HTMLCanvasElement | null>(null);
  const topCardWrapRef = useRef<HTMLDivElement | null>(null);
  const bottomCardWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    const onReady = () => {
      if (cancelled) return;
      video.play().catch(() => {});
      markHeroVideoReady();
    };

    if (video.readyState >= 3) onReady();
    else video.addEventListener('canplaythrough', onReady, { once: true });

    return () => {
      cancelled = true;
      video.removeEventListener('canplaythrough', onReady);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const windows = [
      { win: cardWindow1Ref.current, canvas: canvas1Ref.current },
      { win: cardWindow2Ref.current, canvas: canvas2Ref.current },
    ];
    if (!video || windows.some(({ win, canvas }) => !win || !canvas)) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId: number;

    const draw = () => {
      rafId = requestAnimationFrame(draw);

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return;

      // The union of both card rects stands in for "the full frame of the
      // background video" — as if one video, sized with object-fit:cover
      // over that union box, sat behind everything. Each card then just
      // samples the slice of the video that falls under its own rect.
      const rects = windows.map(({ win }) => win!.getBoundingClientRect());
      const union = rects.reduce(
        (acc, r) => ({
          left: Math.min(acc.left, r.left),
          top: Math.min(acc.top, r.top),
          right: Math.max(acc.right, r.right),
          bottom: Math.max(acc.bottom, r.bottom),
        }),
        { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
      );
      const unionW = union.right - union.left;
      const unionH = union.bottom - union.top;
      if (unionW <= 0 || unionH <= 0) return;

      const scale = Math.max(unionW / vw, unionH / vh);
      const drawnW = vw * scale;
      const drawnH = vh * scale;
      const offsetX = union.left + (unionW - drawnW) / 2;
      const offsetY = union.top + (unionH - drawnH) / 2;

      windows.forEach(({ canvas }, i) => {
        const rect = rects[i];
        const c = canvas!;
        if (rect.width <= 0 || rect.height <= 0) return;

        const targetW = Math.round(rect.width * dpr);
        const targetH = Math.round(rect.height * dpr);
        if (c.width !== targetW) c.width = targetW;
        if (c.height !== targetH) c.height = targetH;

        const ctx = c.getContext('2d');
        if (!ctx) return;

        const sx = (rect.left - offsetX) / scale;
        const sy = (rect.top - offsetY) / scale;
        const sw = rect.width / scale;
        const sh = rect.height / scale;

        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, c.width, c.height);
      });
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // The bottom card's width is dictated by how much room INTENTIONALLY
  // leaves behind; the top card sits between two much shorter words (DE,
  // SIGN) and would otherwise grow wider. Capping its max-width to the
  // bottom card's live measured width keeps the two video cards visually
  // equal without hand-tuning a breakpoint-specific value.
  useEffect(() => {
    const source = bottomCardWrapRef.current;
    const target = topCardWrapRef.current;
    if (!source || !target) return;

    const sync = () => {
      target.style.maxWidth = `${source.getBoundingClientRect().width}px`;
    };

    const ro = new ResizeObserver(sync);
    ro.observe(source);
    sync();

    return () => ro.disconnect();
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-16 px-8 xl:px-16 flex flex-col justify-center overflow-hidden"
    >
      {/* Single source-of-truth video. Never shown directly — the two card
          canvases below repaint themselves from this element every frame,
          which is what keeps them in perfect sync. */}
      {video && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          src={video}
          aria-hidden="true"
          style={{ position: 'fixed', top: 0, left: 0, width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
        />
      )}
      <div className="mx-auto w-full max-w-[1250px] @container">
      {/* Top Grid / Display Typography */}
      <div className={`${ready ? 'justify-start' : 'justify-center'} relative w-full flex flex-row flex-nowrap items-stretch gap-y-8 md:gap-y-4 items-start`}>
        {/* SHAPE Word (Left) */}
        <motion.div layout transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: ready ? 1.4 : 0 }} className="md:col-span-6 md:shrink-0">
          <RevealWord
            ready={ready}
            delay={0}
            className="text-[20vw] sm:text-[14vw] md:text-[min(21cqw,380px)] font-display font-medium text-black select-none"
          >
            {topWordLeft}{' '}
          </RevealWord>
        </motion.div>

        {/* Video Showreel Card (Center / Top Right) — flex-grow fills exactly
            whatever space SHAPE and EVERY's fixed widths leave behind, capped
            at the bottom card's measured width (see ResizeObserver effect)
            so it can never overflow the row or leave a dead gap before EVERY.
            `layout` (with the same delay/duration as the clip-path reveal
            below) is what makes the center->left row shift happen as ONE
            motion together with the swipe, not a separate beat afterward —
            justify-content itself isn't animatable by CSS transitions, it
            only ever jumps, so this FLIP-based approach replaces it. */}
        <motion.div
          ref={topCardWrapRef}
          layout
          initial={{ flexGrow: 0 }}
          animate={{ flexGrow: ready ? 1 : 0 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: ready ? 1.4 : 0 }}
          style={{ flexBasis: '0%', flexShrink: 1 }}
          className="md:col-span-6 flex flex-col items-center ml-2"
        >
          <motion.div
            role="button"
            tabIndex={0}
            aria-label="Play showreel"
            data-cursor="video"
            data-cursor-text="WATCH REEL"
            onClick={onOpenShowreel}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenShowreel(); } }}
            initial={{ clipPath: 'inset(0% 0% 0% 100%)' }}
            animate={{ clipPath: ready ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 0% 100%)' }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: ready ? 1.4 : 0 }}
            className="relative w-full max-w-sm md:max-w-none md:h-full overflow-hidden group cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <div ref={cardWindow1Ref} className="relative aspect-16/10 md:absolute md:inset-0 w-full h-full overflow-hidden rounded-sm bg-neutral-200">
              <canvas
                ref={canvas1Ref}
                aria-hidden="true"
                className="absolute inset-0 w-full h-full transform-gpu will-change-transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* EVERY Word (Top Far Right) */}
        <motion.div layout transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: ready ? 1.4 : 0 }} className="md:col-span-12 md:shrink-0 relative">
          <RevealWord
            ready={ready}
            delay={0}
            className="text-[20vw] sm:text-[14vw] md:text-[min(21cqw,380px)] font-display font-medium text-black select-none md:whitespace-nowrap"
          >
            {topWordRight}
          </RevealWord>

          {/* Tag pill: pops in over the tail of the word, echoing the rotated
              sticker used near the bottom word. */}
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.6, rotate: -16 }}
            animate={
              ready
                ? { opacity: 1, scale: 1, rotate: -6 }
                : { opacity: 0, scale: 0.6, rotate: -16 }
            }
            transition={{ duration: 0.7, ease: WORD_EASE, delay: ready ? 1.7 : 0 }}
            whileHover={{ rotate: 2, scale: 1.08 }}
            className="absolute bottom-[8%] right-[6%] sm:right-[10%] px-5 py-2 rounded-sm bg-[#A5CD04] text-black font-display font-bold text-sm sm:text-4xl uppercase select-none cursor-default"
          >
            INTENTIONAL
          </motion.span>
        </motion.div>
      </div>

      {/* Middle Row: EX Word + Featured Embedded Video Showcase + PERIENCE Word */}
      <div className="relative mt-2 md:mt-[34px]">
      <div className={`flex flex-row flex-nowrap items- gap-8 md:gap-x-0 ${ready ? 'justify-start' : 'justify-center'}`}>
        {/* EX Word (Left) */}
        {/* <div className="md:col-span-6 lg:shrink-0">
          <RevealWord
            ready={ready}
            delay={0}
            // innerRef={exWordRef}
            className="text-[20vw] sm:text-[14vw] md:text-[11vw] lg:text-[250px] font-display font-medium text-black select-none md:whitespace-nowrap"
          >
            EX
          </RevealWord>
        </div> */}

        {/* Featured Video Card Replacing Wakabeta — flex-grow fills exactly
            whatever space EXPERIENCE's fixed width leaves behind. */}
        <motion.div
          ref={bottomCardWrapRef}
          layout
          initial={{ flexGrow: 0 }}
          animate={{ flexGrow: ready ? 1 : 0 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: ready ? 1.4 : 0 }}
          style={{ flexBasis: '0%', flexShrink: 1, maxWidth: 'calc(80%)' }}
          className="md:col-span-6 flex flex-col items-center"
        >
          <motion.div
            role="button"
            tabIndex={0}
            aria-label="Watch showreel"
            initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
            animate={{ clipPath: ready ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)' }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: ready ? 1.4 : 0 }}
            onClick={onOpenShowreel}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenShowreel(); } }}
            data-cursor="video"
            data-cursor-text="WATCH REEL"
            className="ml-2 relative w-full md:h-full overflow-hidden group cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <div ref={cardWindow2Ref} className="relative aspect-16/10 md:absolute md:inset-0 w-full h-full overflow-hidden rounded-sm bg-neutral-200">
              <canvas
                ref={canvas2Ref}
                aria-hidden="true"
                className="absolute inset-0 w-full h-full transform-gpu will-change-transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* PERIENCE Word (Right) */}
        <motion.div
          layout
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: ready ? 1.4 : 0 }}
          className="md:col-span-12 md:shrink-0 flex items-center gap-2 sm:gap-4 justify-start md:justify-end z-20 relative"
        >
          <RevealWord
            ready={ready}
            delay={0}
            className="text-[20vw]  sm:text-[14vw] md:text-[min(21cqw,380px)] font-display font-medium text-black select-none md:whitespace-nowrap"
          >
            {bottomWord}
          </RevealWord>

          {/* Tag pill: accent-colored twin of the DESIGN pill above, popping
              in over the start of the word so it doesn't collide with the
              sticker at the word's tail. */}
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.6, rotate: 16 }}
            animate={
              ready
                ? { opacity: 1, scale: 1, rotate: 6 }
                : { opacity: 0, scale: 0.6, rotate: 16 }
            }
            transition={{ duration: 0.7, ease: WORD_EASE, delay: ready ? 1.7 : 0 }}
            whileHover={{ rotate: -2, scale: 1.08 }}
            className="absolute bottom-[8%] left-[2%] px-5 py-2 rounded-sm bg-[#04a3cc] text-white font-display font-bold text-sm sm:text-4xl uppercase select-none cursor-default"
          >
            BY DESIGN
          </motion.span>

          {/* Sticker: a small rotated badge that pops in just after the word
              lands, echoing the tag pills used elsewhere on the site. */}
          {sticker && (
            <motion.img
              src={sticker}
              alt=""
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.6, rotate: -16 }}
              animate={
                ready
                  ? { opacity: 1, scale: 1, rotate: -8 }
                  : { opacity: 0, scale: 0.6, rotate: -16 }
              }
              transition={{ duration: 0.7, ease: WORD_EASE, delay: ready ? 1.7 : 0 }}
              whileHover={{ rotate: 4, scale: 1.08 }}
              className="w-10 sm:w-16 md:w-20 lg:w-32 h-auto absolute z-5-top-30 -right-15 shrink-0 select-none cursor-default"
            />
          )}
        </motion.div>
      </div>

      <div className="mt-14 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <p className="text-sm sm:text-xl text-neutral-600 max-w-xl font-medium leading-[150%]">
          {tagline}
        </p>

        {/* Big Explore Pill Button */}
        <a
          href="#work"
          onClick={(e) => createRipple(e)}
          className="relative group inline-flex items-center gap-3 px-8 py-4 tracking-wide rounded-sm shrink-0 ml-auto bg-black text-white text-4xl font-medium font-display uppercase hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all ripple-container"
        >
          <span>{ctaLabel}</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </a>
      </div>
      </div>
      </div>
    </section>
  );
}