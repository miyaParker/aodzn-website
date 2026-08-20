'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import { Rocket, Target, TrendingUp } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ContactModal from '../ContactModal';
import Tag from '../Tag';
import { animateSplitText, applyMagneticEffect } from '../../lib/animations';
import { HomePageContent, SiteSettings } from '../../types';

const EASE = [0.76, 0, 0.24, 1] as const;

const MARQUEE_WORDS = [
  'PRODUCT DESIGN',
  'BRAND STRATEGY',
  'DESIGN SYSTEMS',
  'MOTION',
  'UI ENGINEERING',
  'ZERO TO ONE',
  'CREATIVE DIRECTION',
];

const STATS = [
  { value: 10, decimals: 0, suffix: '+', label: 'Years shaping products', accent: '#04a3cc', bg: '#f2fafc' },
  { value: 40, decimals: 0, suffix: '+', label: 'Products shipped', accent: '#A5CD04', bg: '#e6f6fa' },
  { value: 15, decimals: 0, suffix: '+', label: 'Countries reached', accent: '#f59e0b', bg: '#f2fafc' },
  { value: 5, decimals: 1, suffix: '', label: 'Average client rating', accent: '#f472b6', bg: '#e6f6fa' },
];

const SKILLS = [
  { title: 'Product Design', items: ['UX Strategy', 'Interaction Design', 'Design Systems', 'Prototyping'], accent: '#04a3cc' },
  { title: 'Brand & Identity', items: ['Visual Identity', 'Art Direction', 'Typography', 'Packaging'], accent: '#A5CD04' },
  { title: 'Motion & Craft', items: ['Micro-interactions', 'Motion Design', '3D & WebGL', 'Storytelling'], accent: '#f59e0b' },
  { title: 'Tools', items: ['Figma', 'Framer', 'Webflow', 'After Effects'], accent: '#f472b6' },
];

const JOURNEY = [
  {
    year: '2015',
    role: 'Junior Product Designer',
    org: 'Freelance & Early Career',
    blurb: 'Cut my teeth designing interfaces for local startups, learning that good design is judged by whether people use it — not how it looks in a portfolio.',
    accent: '#f2fafc',
  },
  {
    year: '2018',
    role: 'Product Designer',
    org: 'Fintech & Mobility Startups',
    blurb: 'Shipped wallets, ride-hailing apps, and dashboards for fast-moving teams — learned to design under real constraints: time, engineering, and users who never read onboarding screens.',
    accent: '#e6f6fa',
  },
  {
    year: '2021',
    role: 'Senior Product Designer',
    org: 'Cross-industry Clients',
    blurb: 'Took ownership of end-to-end product experiences, from discovery through launch, for clients across fintech, health, and logistics.',
    accent: '#f2fafc',
  },
  {
    year: 'Today',
    role: 'Senior Creative Product Designer',
    org: 'AODZN',
    blurb: 'Partnering directly with founders and product teams to turn ambiguous problems into products people actually enjoy using.',
    accent: '#e6f6fa',
  },
];

const PRINCIPLES = [
  {
    icon: Target,
    title: 'Clarity over cleverness',
    description: "If a user has to think about the interface, the interface has already failed.",
    accent: '#f59e0b',
  },
  {
    icon: TrendingUp,
    title: 'Design is a business tool',
    description: 'Every pixel should be traceable back to a metric someone in the business actually cares about.',
    accent: '#A5CD04',
  },
  {
    icon: Rocket,
    title: 'Ship, then sharpen',
    description: 'Momentum beats perfection — get it in front of real users, then iterate with evidence instead of opinions.',
    accent: '#10b981',
  },
];

// Wraps its child in gsap's cursor-follow effect (already written for this
// purpose in lib/animations but unused elsewhere) — the wrapper carries the
// gsap transform while the child keeps its own independent framer-motion
// transform, so the two never fight over the same style property.
function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return applyMagneticEffect(el);
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

function SectionEyebrow({ text, dark = false }: { text: string; dark?: boolean }) {
  return (
    <p className={`text-sm font-bold uppercase tracking-wider overflow-hidden mb-3 ${dark ? 'text-white/50' : 'text-neutral-500'}`}>
      <motion.span
        className="block"
        initial={{ y: '100%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {text}
      </motion.span>
    </p>
  );
}

function RevealLine({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: '100%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay }}
      >
        {text}
      </motion.span>
    </span>
  );
}

// Character-by-character stagger with a bounce ease — a rowdier alternative
// to RevealLine's single swipe-up, reserved for one headline so it reads as
// a deliberate flourish rather than the default treatment everywhere.
function SplitHeading({ text, className }: { text: string; className: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    animateSplitText(ref.current, { scrollTrigger: true });
  }, []);

  return (
    <h2 ref={ref} className={className}>
      {text}
    </h2>
  );
}

// Counts up from 0 once the number scrolls into view, rather than on mount —
// firing on mount would burn the animation before anyone's scrolled far
// enough to see it.
function CountUp({ target, decimals = 0, duration = 1.4 }: { target: number; decimals?: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return (
    <motion.span onViewportEnter={() => setStarted(true)} viewport={{ once: true, amount: 0.6 }}>
      {value.toFixed(decimals)}
    </motion.span>
  );
}

function AboutHero({ availabilityBadgeText }: { availabilityBadgeText: string }) {
  return (
    <section className="relative min-h-[85vh] pb-16 sm:pb-20 px-8 xl:px-16 flex flex-col justify-center overflow-hidden">
      <motion.p
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
        className="pointer-events-none select-none absolute top-10 sm:top-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-display font-medium uppercase text-[30vw] leading-none text-black/[0.035]"
      >
        Abdul Azees
      </motion.p>

      <div className="relative z-10 flex flex-col items-start gap-6">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-500 overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Creative Product Designer — Lagos, NG
          </motion.span>
        </p>

        <h1 className="font-display font-medium text-[16vw] sm:text-[11vw] lg:text-[9vw] leading-[0.85] uppercase text-black">
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              Abdul
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            >
              Azees
            </motion.span>
          </span>
        </h1>

        <Magnetic>
          <motion.span
            initial={{ opacity: 0, scale: 0.6, rotate: -16 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
            whileHover={{ rotate: 2, scale: 1.08 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-sm bg-[#A5CD04] text-black font-display font-bold text-sm sm:text-lg uppercase select-none cursor-default"
          >
            <span className="w-2 h-2 rounded-full bg-black animate-pulse-subtle" />
            {availabilityBadgeText}
          </motion.span>
        </Magnetic>

        <p className="max-w-xl text-base sm:text-lg text-neutral-600 font-medium leading-relaxed">
          Ten-plus years turning ambiguous problems into products people actually enjoy using —
          equal parts strategy, pixels, and a stubborn refusal to ship anything boring.
        </p>
      </div>

      <Magnetic className="absolute right-8 xl:right-16 bottom-4 sm:bottom-10 hidden md:block">
        <div className="relative w-36 h-36 lg:w-48 lg:h-48 flex items-center justify-center">
          <motion.svg
            viewBox="0 0 200 200"
            className="absolute inset-0 w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          >
            <defs>
              <path id="about-badge-circle" d="M 100,100 m -85,0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0" />
            </defs>
            <text fill="#111111" fontSize="13" fontWeight={700} letterSpacing="3">
              <textPath href="#about-badge-circle">
                AVAILABLE FOR NEW WORK &#8226; AVAILABLE FOR NEW WORK &#8226;
              </textPath>
            </text>
          </motion.svg>
          <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-black flex items-center justify-center">
            <span className="font-display font-medium text-white text-2xl lg:text-3xl uppercase">AA</span>
          </div>
        </div>
      </Magnetic>
    </section>
  );
}

function SkillsMarquee({ words }: { words: string[] }) {
  const track = [...words, ...words];
  return (
    <div className="relative w-full overflow-hidden border-y border-black/10 bg-black py-4 sm:py-6">
      <motion.div
        className="flex whitespace-nowrap will-change-transform"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
      >
        {track.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="flex items-center gap-6 sm:gap-10 px-6 sm:px-10 font-display font-medium uppercase text-3xl sm:text-5xl text-white shrink-0"
          >
            {word}
            <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-[#A5CD04]" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function StatsRow() {
  return (
    <section className="px-8 xl:px-16 py-16 sm:py-20 grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
          whileHover={{ y: -6, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
          style={{ backgroundColor: stat.bg }}
          className="relative flex flex-col gap-2 p-6 sm:p-8 rounded-md border border-black/10"
        >
          <span className="font-display font-medium text-5xl sm:text-6xl lg:text-7xl text-black leading-none">
            <CountUp target={stat.value} decimals={stat.decimals} />
            {stat.suffix}
          </span>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-500">{stat.label}</span>
          <span aria-hidden="true" className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.accent }} />
        </motion.div>
      ))}
    </section>
  );
}

const BIO_LINES = [
  "I'm Abdul — a Lagos-based product designer obsessed with the gap between a good idea and a product people can't stop using.",
  "My background spans fintech, mobility, and health-tech, which means I've designed for users with very little patience and even less bandwidth.",
  "I care less about how a screen looks in a deck and more about whether someone can actually get what they came for — fast, and without a support ticket.",
];

const BIO_TAGS = [
  { word: 'STRATEGY', bg: '#04a3cc', color: '#FFFFFF', top: '2%', left: '8%' },
  { word: 'PROTOTYPES', bg: '#f59e0b', color: '#111111', top: '18%', left: '54%' },
  { word: 'PIXELS', bg: '#A5CD04', color: '#111111', top: '42%', left: '6%' },
  { word: 'CRAFT', bg: '#10b981', color: '#FFFFFF', top: '58%', left: '56%' },
  { word: 'PEOPLE', bg: '#f472b6', color: '#FFFFFF', top: '80%', left: '20%' },
];

// A loose hand-drawn line threading through the tags — framer's `pathLength`
// draws it on scroll-in rather than fighting with manual stroke-dasharray math.
function BioSquiggle() {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 200 300"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none"
      fill="none"
    >
      <motion.path
        d="M 30 15 C 90 45, 150 35, 165 90 S 60 150, 45 195 S 160 230, 150 280"
        stroke="#111111"
        strokeOpacity={0.15}
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.6, ease: EASE }}
      />
    </motion.svg>
  );
}

function BioSection() {
  return (
    <section className="px-8 xl:px-16 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      <div className="lg:col-span-7 flex flex-col gap-6">
        {BIO_LINES.map((line, i) => (
          <div key={line} className="overflow-hidden">
            <motion.p
              className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl leading-[1.15] text-black"
              initial={{ y: '100%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.1 }}
            >
              {line}
            </motion.p>
          </div>
        ))}
      </div>

      <div className="lg:col-span-5 relative min-h-[380px]">
        <BioSquiggle />
        {BIO_TAGS.map((tag, i) => {
          const rotate = (i - 2) * 9;
          return (
            <Tag
              key={tag.word}
              bgColor={tag.bg}
              textColor={tag.color}
              size="xs"
              rotate={rotate}
              initialRotate={rotate}
              hoverRotate={0}
              delay={i * 0.1}
              trigger="inView"
              float
              className="absolute"
              style={{ top: tag.top, left: tag.left, animationDelay: `${i * 0.6}s` }}
            >
              {tag.word}
            </Tag>
          );
        })}
      </div>
    </section>
  );
}

function SkillsGrid() {
  return (
    <section className="px-8 xl:px-16 py-20 sm:py-28">
      <SectionEyebrow text="What I bring" />
      <SplitHeading
        text="Design, end to end."
        className="font-display font-medium text-5xl sm:text-7xl lg:text-8xl uppercase leading-[0.95] text-black mb-12 sm:mb-16"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {SKILLS.map((group, i) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
            whileHover={{ y: -8 }}
            className="group relative flex flex-col gap-5 p-6 sm:p-7 rounded-md bg-white border border-black/10 overflow-hidden"
          >
            <span
              aria-hidden="true"
              className="absolute -top-8 -right-8 w-24 h-24 rounded-full transition-transform duration-500 group-hover:scale-150"
              style={{ backgroundColor: `${group.accent}22` }}
            />
            <span
              className="relative w-10 h-10 rounded-sm flex items-center justify-center text-white font-display font-bold"
              style={{ backgroundColor: group.accent }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="relative font-display font-medium text-xl sm:text-2xl uppercase text-black">{group.title}</h3>
            <ul className="relative flex flex-col gap-1.5">
              {group.items.map((item) => (
                <li key={item} className="text-sm text-neutral-600 font-medium">
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function JourneySection() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

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
    <section className="relative bg-black text-white">
      <div ref={pinRef} className="hidden lg:block relative" style={{ height: `calc(100vh + ${scrollDistance}px)` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
          <div className="px-8 xl:px-16 pt-16 sm:pt-20">
            <SectionEyebrow text="The journey" dark />
            <h2 className="font-display font-medium text-5xl sm:text-7xl uppercase leading-[0.95]">
              <RevealLine text="A decade, roughly." />
            </h2>
          </div>

          <div className="px-8 xl:px-16 mt-8">
            <div className="h-[2px] w-full bg-white/15 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-y-0 left-0 w-full bg-[#A5CD04] origin-left"
                style={{ scaleX: scrollYProgress }}
              />
            </div>
          </div>

          <div className="flex-1 flex items-center overflow-hidden mt-6 sm:mt-10">
            <motion.div
              ref={trackRef}
              style={{ x: trackX }}
              className="flex items-stretch gap-6 xl:gap-8 pl-8 xl:pl-16 pr-[38vw] will-change-transform"
            >
              {JOURNEY.map((milestone) => (
                <div
                  key={milestone.year}
                  style={{ backgroundColor: milestone.accent, color: '#111111' }}
                  className="w-[340px] xl:w-[400px] shrink-0 rounded-md p-8 flex flex-col justify-between gap-8"
                >
                  <span className="font-display font-medium text-6xl">{milestone.year}</span>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display font-medium text-2xl uppercase">{milestone.role}</h3>
                    <p className="text-sm font-bold uppercase tracking-widest opacity-60">{milestone.org}</p>
                    <p className="mt-2 text-sm leading-relaxed opacity-80">{milestone.blurb}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile/tablet: plain vertical stack — scroll-jacking a pinned track
          doesn't translate to touch scrolling. */}
      <div className="lg:hidden px-6 sm:px-10 pt-16 pb-20 flex flex-col gap-8">
        <SectionEyebrow text="The journey" dark />
        <h2 className="font-display font-medium text-5xl uppercase leading-[0.95]">
          <RevealLine text="A decade, roughly." />
        </h2>
        <div className="flex flex-col gap-5 mt-4">
          {JOURNEY.map((milestone) => (
            <div
              key={milestone.year}
              style={{ backgroundColor: milestone.accent, color: '#111111' }}
              className="rounded-md p-6 flex flex-col gap-3"
            >
              <span className="font-display font-medium text-4xl">{milestone.year}</span>
              <h3 className="font-display font-medium text-xl uppercase">{milestone.role}</h3>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60">{milestone.org}</p>
              <p className="text-sm leading-relaxed opacity-80">{milestone.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrinciplesSection() {
  return (
    <section className="px-8 xl:px-16 py-20 sm:py-28">
      <SectionEyebrow text="How I work" />
      <h2 className="font-display font-medium text-5xl sm:text-7xl lg:text-8xl uppercase leading-[0.95] text-black mb-12 sm:mb-16">
        <RevealLine text="Three rules I don't break." />
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        {PRINCIPLES.map((principle, i) => {
          const Icon = principle.icon;
          const rotate = i % 2 === 0 ? -3 : 3;
          return (
            <Magnetic key={principle.title}>
              <motion.div
                initial={{ opacity: 0, y: 30, rotate: rotate * 2 }}
                whileInView={{ opacity: 1, y: 0, rotate }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
                whileHover={{ rotate: 0, scale: 1.03 }}
                className="flex flex-col gap-5 p-8 rounded-md border border-black/10 bg-white h-full"
              >
                <span
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: principle.accent }}
                >
                  <Icon className="w-6 h-6 text-black" strokeWidth={1.75} />
                </span>
                <h3 className="font-display font-medium text-2xl uppercase text-black leading-snug">{principle.title}</h3>
                <p className="text-sm text-neutral-600 font-medium leading-relaxed">{principle.description}</p>
              </motion.div>
            </Magnetic>
          );
        })}
      </div>
    </section>
  );
}

interface AboutViewProps {
  siteSettings: SiteSettings;
  footerCta: HomePageContent['footerCta'];
  contactModalContent: HomePageContent['contactModal'];
}

export default function AboutView({ siteSettings, footerCta, contactModalContent }: AboutViewProps) {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#FFFFFF] text-[#111111] antialiased selection:bg-black selection:text-white overflow-x-hidden">
      <Navbar
        siteSettings={siteSettings}
        onOpenContact={() => setContactOpen(true)}
        onOpenShowreel={() => {}}
      />

      <main className="relative z-10">
        <div className="px-8 xl:px-16 pt-28">
          <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-widest text-neutral-500">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-black">About</span>
          </nav>
        </div>

        <AboutHero availabilityBadgeText={siteSettings.availabilityBadgeText} />
        <SkillsMarquee words={MARQUEE_WORDS} />
        <StatsRow />
        <BioSection />
        <SkillsGrid />
        <JourneySection />
        <PrinciplesSection />
      </main>

      <Footer siteSettings={siteSettings} footerCta={footerCta} onOpenContact={() => setContactOpen(true)} />

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        content={contactModalContent}
        projectContactEmail={siteSettings.projectContactEmail}
      />
    </div>
  );
}
