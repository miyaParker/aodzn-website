'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { ArrowUpRight, Star } from 'lucide-react';

const EASE = [0.76, 0, 0.24, 1] as const;
const BG = '#FFFFFF';
// Glass shell — blur/border/shadow only; each card supplies its own tint via
// bgAccent, the same alternating pastels StrategySection uses for its rows,
// so this section still reads as the same design language as the rest of
// the site rather than a one-off.
const GLASS_CARD_CLASS = 'rounded-md backdrop-blur-xl border border-white/50 shadow-xl shadow-black/5';

interface Testimonial {
  name: string;
  company: string;
  quote: string;
  rating: number;
  photo: string;
  bgAccent: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Christian Chimezie',
    company: 'Development Lead at PlotSenseAI',
    quote: 'Abdul\'s designs don\'t just look great; they solve real problems. His ability to merge creativity with results made a huge difference for our team',
    rating: 5.0,
    photo: '/christiam-chimezie.png',
    bgAccent: '#f2fafc',
  },
  {
    name: 'Chidinma Eze',
    company: 'Product Manager at Opay',
    quote: 'Abdul transformed our vision into a user-friendly app that exceeded expectations. His attention to detail and design thinking truly set him apart',
    rating: 5.0,
    photo: '/chidinma-eze.jpeg',
    bgAccent: '#e6f6fa',
  },
  {
    name: 'Oluwatomiwa Bokin',
    company: 'Project Manager at OATEK Concepts and Tech Ltd.',
    quote: 'Working with Abdul was seamless — he delivered creative, functional designs that boosted engagement and streamlined our product experience',
    rating: 5.0,
    photo: '/oluwatomiwa-bokin.jpeg',
    bgAccent: '#f2fafc',
  },
];

// Eyebrow label — same treatment as PortfolioSection's eyebrowLabel.
function SectionEyebrow() {
  return (
    <p className="text-md text-neutral-500 font-bold uppercase tracking-wider overflow-hidden mb-3">
      <motion.span
        className="block"
        initial={{ y: '100%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        Client quotes
      </motion.span>
    </p>
  );
}

function SectionHeading() {
  return (
    <h2 className="font-display font-medium text-5xl sm:text-6xl lg:text-7xl uppercase leading-[1.05]">
      <span className="block overflow-hidden">
        <motion.span
          className="block"
          initial={{ y: '100%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          The work is ours.
        </motion.span>
      </span>
      <span className="block overflow-hidden">
        <motion.span
          className="block"
          initial={{ y: '100%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        >
          The experience is theirs.
        </motion.span>
      </span>
    </h2>
  );
}

function ReadReviewsLink({ reviewsUrl }: { reviewsUrl: string }) {
  return (
    <a
      href={reviewsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 shrink-0 text-sm font-mono uppercase tracking-widest text-black/70 hover:text-black transition-colors border-b border-black/30 hover:border-black pb-1"
    >
      Read all reviews
      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
    </a>
  );
}

function CardBody({ testimonial }: { testimonial: Testimonial }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <img
          src={testimonial.photo}
          alt={testimonial.name}
          className="w-12 h-12 xl:w-14 xl:h-14 rounded-full object-cover shrink-0 ring-2 ring-white/60"
        />
        <div>
          <p className="font-bold text-base">{testimonial.name}</p>
          <p className="text-sm text-neutral-500">{testimonial.company}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5 text-sm font-bold">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{testimonial.rating.toFixed(1)}</span>
        </div>
        <p className="text-xl xl:text-2xl leading-snug tracking-tight line-clamp-6">{testimonial.quote}</p>
      </div>
    </>
  );
}

interface TestimonialsSectionProps {
  reviewsUrl?: string;
}

export default function TestimonialsSection({ reviewsUrl }: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="relative w-full text-[#111111]" style={{ backgroundColor: BG }}>
      <DesktopTrack reviewsUrl={reviewsUrl} />
      <MobileStack reviewsUrl={reviewsUrl} />
    </section>
  );
}

// Desktop: the section pins for one extra screen-height of scroll per pixel
// of horizontal distance the card track needs to cover, so scrolling down
// drives the cards sideways instead of the page. Heading, waveform, and
// cards all share the one pinned h-screen frame so the whole section reads
// at a glance — card height is capped to leave room for the heading above it.
function DesktopTrack({ reviewsUrl }: { reviewsUrl?: string }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const sync = () => setScrollDistance(Math.max(0, track.scrollWidth - window.innerWidth));

    const ro = new ResizeObserver(sync);
    ro.observe(track);
    window.addEventListener('resize', sync);
    sync();

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ['start start', 'end end'],
  });

  const trackX = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  return (
    <div
      ref={pinRef}
      className="hidden lg:block relative"
      style={{ height: `calc(100vh + ${scrollDistance}px)` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
        <motion.div
          animate={{ filter: hoveredIndex !== null ? 'blur(8px)' : 'blur(0px)', opacity: hoveredIndex !== null ? 0.5 : 1 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="px-8 xl:px-16 pt-10 sm:pt-12 flex items-start justify-between gap-8"
        >
          <div>
            <SectionEyebrow />
            <SectionHeading />
          </div>
          {reviewsUrl && <div className="mt-4"><ReadReviewsLink reviewsUrl={reviewsUrl} /></div>}
        </motion.div>

        <div className="flex-1 flex items-center overflow-hidden mt-6 sm:mt-8">
          <motion.div
            ref={trackRef}
            style={{ x: trackX }}
            className="flex items-start gap-8 xl:gap-10 pl-[33.333vw] pr-[38vw] will-change-transform"
          >
            {TESTIMONIALS.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.name}
                testimonial={testimonial}
                index={index}
                count={TESTIMONIALS.length}
                scrollYProgress={scrollYProgress}
                isDimmed={hoveredIndex !== null && hoveredIndex !== index}
                onHoverChange={(hovered) => setHoveredIndex(hovered ? index : null)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Each card's resting position sits lower than the one before it — a
// staggered cascade as it rises into view — but that cascade is only
// mid-scroll: every card keeps drifting the rest of the way up after its
// own entrance, so by the very end of the section (scrollYProgress = 1)
// they've all converged flush with the container's top edge. The offsets
// are kept modest (and the card height is vh-relative, not a fixed px) so
// the cascade never pushes a card past the edges of the pinned viewport.
const CARD_STEP = 20;
const RISE_AMOUNT = 18;

function TestimonialCard({
  testimonial,
  index,
  count,
  scrollYProgress,
  isDimmed,
  onHoverChange,
}: {
  testimonial: Testimonial;
  index: number;
  count: number;
  scrollYProgress: MotionValue<number>;
  isDimmed: boolean;
  onHoverChange: (hovered: boolean) => void;
}) {
  const base = index * CARD_STEP;
  const start = index / count;
  const end = (index + 0.6) / count;
  const y = useTransform(scrollYProgress, [start, end, 1], [base + RISE_AMOUNT, base, 0], { clamp: true });

  return (
    <motion.div
      style={{ y, height: 'min(580px, 54vh)', backgroundColor: testimonial.bgAccent }}
      animate={{ filter: isDimmed ? 'blur(8px)' : 'blur(0px)', opacity: isDimmed ? 0.5 : 1 }}
      transition={{ duration: 0.3, ease: EASE }}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      className={`w-[480px] xl:w-[540px] shrink-0 text-[#111111] p-8 xl:p-10 flex flex-col justify-between overflow-hidden ${GLASS_CARD_CLASS}`}
    >
      <CardBody testimonial={testimonial} />
    </motion.div>
  );
}

// Mobile / tablet: a plain, natively swipeable horizontal scroller — no
// scroll-jacking, since hijacking vertical scroll doesn't translate to touch.
function MobileStack({ reviewsUrl }: { reviewsUrl?: string }) {
  return (
    <div className="lg:hidden px-6 sm:px-10 pt-20 pb-16 flex flex-col gap-8">
      <div>
        <SectionEyebrow />
        <SectionHeading />
      </div>

      {reviewsUrl && <ReadReviewsLink reviewsUrl={reviewsUrl} />}

      <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 sm:-mx-10 sm:px-10 pb-2">
        {TESTIMONIALS.map((testimonial) => (
          <div
            key={testimonial.name}
            style={{ backgroundColor: testimonial.bgAccent }}
            className={`snap-start shrink-0 w-[300px] text-[#111111] p-6 flex flex-col gap-10 ${GLASS_CARD_CLASS}`}
          >
            <CardBody testimonial={testimonial} />
          </div>
        ))}
      </div>
    </div>
  );
}
