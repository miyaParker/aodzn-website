'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import Link from 'next/link';
import { PROJECTS_DATA } from '../data/portfolioData';
import PortfolioCard, { PortfolioClientTag } from './PortfolioCard';
import { Project } from '../types';

const EASE = [0.76, 0, 0.24, 1] as const;

// One full viewport of scroll "dwell" per project — the image filmstrip on
// the right travels exactly one frame per project across that range while
// the sticky left panel's text swaps to match whichever frame is current.
const VH_PER_PROJECT = 100;
// The next project becomes active once the current one is mostly scrolled
// off screen, not only once it's fully gone — waiting for 100% reads as
// laggy since the incoming image is already most of the way into view.
const ACTIVATE_AT = 0.7;

export default function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // The CTA button is appended to the filmstrip as one extra (short) frame
  // rather than an overlay pinned on top of the current image — scrolling
  // past the last project reveals it exactly the way scrolling to one more
  // image would. It's sized to its own content, not a fixed vh block, so
  // its real rendered height (in vh, to stay unit-consistent with the rest
  // of this scroll math) is measured live and used as the extra scroll
  // dwell reserved in both the section height and the transform's range —
  // otherwise the filmstrip would run out of scroll distance before the
  // button comes into view.
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const [ctaVh, setCtaVh] = useState(0);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;

    const sync = () => setCtaVh((el.getBoundingClientRect().height / window.innerHeight) * 100);

    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener('resize', sync);
    sync();

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, []);

  // Same idea as the CTA measurement above, but for the intro paragraph
  // prepended before the first project frame: it's sized to its own content
  // rather than a fixed vh block, so its real height is measured and added
  // to the scroll dwell — otherwise the filmstrip's translateY math would be
  // off by however tall this block actually renders.
  const introRef = useRef<HTMLDivElement | null>(null);
  const [introVh, setIntroVh] = useState(0);

  useEffect(() => {
    const el = introRef.current;
    if (!el) return;

    const sync = () => setIntroVh((el.getBoundingClientRect().height / window.innerHeight) * 100);

    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener('resize', sync);
    sync();

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, []);

  const totalScrollVh = introVh + (PROJECTS_DATA.length - 1) * VH_PER_PROJECT + ctaVh;
  const sectionHeightVh = introVh + PROJECTS_DATA.length * VH_PER_PROJECT + ctaVh;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const scrolledPastIntro = v * totalScrollVh - introVh;
    const idx = Math.floor((scrolledPastIntro - VH_PER_PROJECT * ACTIVATE_AT) / VH_PER_PROJECT) + 1;
    setActiveIndex(Math.min(PROJECTS_DATA.length - 1, Math.max(0, idx)));
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [0, -totalScrollVh]);
  const filmstripY = useTransform(rawY, (v) => `${v}vh`);

  const activeProject = PROJECTS_DATA[activeIndex];

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative w-full bg-black border-t"
      style={{ height: `${sectionHeightVh}vh`, borderColor: '#737373' }}
    >
      {/* Desktop: sticky-left / scroll-synced-right scrollytelling */}
      <div className="hidden lg:block sticky top-0 h-screen w-full overflow-hidden">
        <div className="grid grid-cols-12 h-full">
          <div className="col-span-4 h-full relative px-8 xl:pl-16 xl:pr-12 z-10 bg-black">
            <div className="absolute top-10 left-8 xl:left-16">
              <p className="text-sm text-neutral-400 uppercase tracking-widest overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: '100%', opacity: 0 }}
                  whileInView={{ y: '0%', opacity: 1 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  Featured Works
                </motion.span>
              </p>
            </div>

            <div className="h-full flex flex-col justify-center gap-6 relative">
              <PortfolioCard project={activeProject} />
            </div>

            <div className="absolute bottom-10 left-8 xl:left-16">
              <PortfolioClientTag project={activeProject} />
            </div>
          </div>

          <div className="col-span-8 h-full relative overflow-hidden">
            <motion.div style={{ y: filmstripY }} className="flex flex-col">
              <div ref={introRef} className="w-full px-8 xl:px-16 py-16">
                <p className="text-xl sm:text-2xl xl:text-3xl text-neutral-300 leading-[140%] tracking-tight max-w-3xl">
                  A selection of recent work — real products shipped to real users, not concepts sitting in a deck.
                </p>
              </div>
              {PROJECTS_DATA.map((project) => (
                <ImageFrame
                  key={project.id}
                  project={project}
                  className="h-screen"
                  isActive={project.id === activeProject.id}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet: plain stacked fallback, no scroll-jacking */}
      <div className="lg:hidden">
        <div className="px-4 sm:px-6 py-16">
          <p className="text-sm text-neutral-400 uppercase tracking-widest overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: '100%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              Featured Works
            </motion.span>
          </p>
        </div>
        <div className="divide-y divide-white/10 border-t border-white/10">
          {PROJECTS_DATA.map((project) => (
            <div key={project.id} className="flex flex-col">
              <div className="px-4 sm:px-6 py-16 flex flex-col gap-8">
                <PortfolioCard project={project} />
                <PortfolioClientTag project={project} />
              </div>
              <ImageFrame
                project={project}
                className="h-[360px] sm:h-[460px]"
                isActive
              />
            </div>
          ))}
        </div>
        <div className="p-4 sm:p-6">
          <button
            onClick={() => document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full py-5 rounded-sm bg-[#04a3cc] text-black text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all"
          >
            View All Works
          </button>
        </div>
      </div>
    </section>
  );
}

function ImageFrame({
  project,
  className = '',
  isActive,
}: {
  project: Project;
  className?: string;
  isActive: boolean;
}) {
  const initials = project.client.charAt(0).toUpperCase();

  return (
    <Link
      href={`/works/${project.id}`}
      aria-label={`View ${project.title} case study`}
      data-cursor="view"
      data-cursor-text="VIEW CASE STUDY"
      className={`relative w-full overflow-hidden bg-neutral-950 cursor-pointer p-2 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${className}`}
    >
      <div className="relative w-full h-full rounded-sm overflow-hidden">
        <motion.img
          src={project.image}
          alt={`${project.title} project preview`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          animate={{
            filter: isActive ? 'blur(0px) brightness(1)' : 'blur(24px) brightness(0.25)',
            scale: isActive ? 1 : 1.1,
          }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-black/30 pointer-events-none" />

        <div className="absolute inset-0 flex items-center justify-center gap-3 sm:gap-4 px-6">
          {project.logo ? (
            <div className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 rounded-sm overflow-hidden bg-white flex items-center justify-center p-1.5">
              <img src={project.logo} alt="" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div
              className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 rounded-sm flex items-center justify-center text-white font-bold text-base sm:text-lg"
              style={{ backgroundColor: project.primaryColor }}
            >
              {initials}
            </div>
          )}
          <span className="font-display font-medium uppercase text-white text-3xl sm:text-5xl lg:text-6xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            {project.title}
          </span>
        </div>
      </div>
    </Link>
  );
}