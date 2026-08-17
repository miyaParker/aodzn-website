'use client';

import React, { useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ContactModal from '../ContactModal';
import { HomePageContent, Project, SiteSettings } from '../../types';

// Tints a project's brand hex for use as a section background — keeps every
// color block on the page tied to that project's own palette instead of a
// fixed set of case-study colors.
function tint(hex: string, alpha: number) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Picks black or white ink for text sitting directly on a project's brand
// color (relative luminance per WCAG) — avoids the page silently going
// unreadable the day a project's primaryColor/accentColor is a light tint
// instead of the dark/saturated ones every current project happens to use.
function ink(hex: string, alpha = 1) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  const [ir, ig, ib] = luminance > 0.45 ? [17, 17, 17] : [255, 255, 255];
  return `rgba(${ir}, ${ig}, ${ib}, ${alpha})`;
}

function Reveal({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

// Auto-advancing carousel through a set of images, used where a single
// static frame would otherwise sit in a grid alongside real photos. Swaps
// the frame on an interval with a hard cut — no transition.
function GallerySlideshow({ images, alt, className }: { images: string[]; alt: string; className?: string }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className={`relative overflow-hidden bg-neutral-100 ${className ?? ''}`}>
      <img
        src={images[index]}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

interface CaseStudyViewProps {
  project: Project;
  siteSettings: SiteSettings;
  footerCta: HomePageContent['footerCta'];
  contactModalContent: HomePageContent['contactModal'];
}

export default function CaseStudyView({
  project,
  siteSettings,
  footerCta,
  contactModalContent,
}: CaseStudyViewProps) {
  const [contactOpen, setContactOpen] = useState(false);

  const { caseStudy: cs, primaryColor, accentColor } = project;

  // Walks the project's gallery in rotation instead of hardcoding indices —
  // short galleries (a couple of real assets) cycle without ever repeating
  // back-to-back, and longer ones actually put all of their photos on screen
  // instead of only ever showing the first three.
  let imgCursor = 0;
  const nextImg = () => cs.gallery[imgCursor++ % cs.gallery.length];
  const galleryAlt = `${project.title} case study visual`;

  // Mirrors the page's own section headings rather than the homepage's
  // #home/#work/#about — the sections a case study page actually has.
  const caseStudyNavItems = [
    { label: 'Overview', href: '#overview' },
    { label: 'Challenge', href: '#challenge' },
    { label: 'Solution', href: '#solution' },
    { label: 'Impact', href: '#impact' },
  ];

  return (
    <div className="relative min-h-screen bg-white text-[#111111] antialiased selection:bg-black selection:text-white">
      <Navbar
        siteSettings={siteSettings}
        navItems={caseStudyNavItems}
        onOpenContact={() => setContactOpen(true)}
        onOpenShowreel={() => {}}
      />

      <main className="relative z-10">
        {/* Hero: full-bleed dark banner with the project wordmark and
            Sector/Year meta pinned top-left/top-right above a huge white
            headline, matching the reference banner exactly. */}
        <section
          id="overview"
          className="relative pt-36 sm:pt-44 pb-16 sm:pb-20 px-8 xl:px-16 overflow-hidden"
          style={{ backgroundColor: accentColor }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 sm:gap-4 mb-8 sm:mb-10">
            <span
              className="font-display font-medium uppercase tracking-wide text-4xl sm:text-5xl"
              style={{ color: primaryColor }}
            >
              {project.title}
            </span>

            <div className="flex items-center gap-12 sm:gap-16">
              <div className="flex flex-col gap-1.5">
                <span className="text-sm sm:text-base font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
                  Sector
                </span>
                <span className="text-lg sm:text-xl font-semibold" style={{ color: ink(accentColor) }}>{project.domain}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm sm:text-base font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
                  Year
                </span>
                <span className="text-lg sm:text-xl font-semibold" style={{ color: ink(accentColor) }}>{project.year}</span>
              </div>
            </div>
          </div>

          <h1
            className="font-medium text-md sm:text-lg lg:text-4xl leading-[130%] tracking-tight max-w-2xl"
            style={{ fontFamily: 'var(--font-sans)', color: ink(accentColor) }}
          >
            {project.subtitle}
          </h1>
        </section>

        {/* The Challenge: left column pins in place while the right
            column's image/paragraph stack scrolls past it. */}
        <section id="challenge" className="lg:grid lg:grid-cols-2">
          <div
            className="lg:sticky lg:top-0 lg:h-screen flex flex-col"
            style={{ backgroundColor: tint(primaryColor, 0.08) }}
          >
            <div className="flex-1 flex items-center px-8 xl:px-16 py-16 lg:py-0">
              <h2 className="font-display font-medium uppercase text-6xl sm:text-7xl lg:text-9xl leading-[0.92] max-w-md">
                {cs.challengeHeadline}
              </h2>
            </div>
            <div className="px-8 xl:px-16 py-14" style={{ backgroundColor: accentColor }}>
              <span className="text-2xl sm:text-4xl font-medium" style={{ color: ink(accentColor) }}>The Challenge</span>
            </div>
          </div>

          <div className="flex flex-col gap-10 pb-16 lg:pb-24">
            <Reveal className="aspect-[2.7/2] overflow-hidden bg-neutral-100">
              <img src={nextImg()} alt={galleryAlt} loading="lazy" className="w-full h-full object-cover" />
            </Reveal>
            <Reveal className="px-8 xl:px-16">
              <p className="text-xl sm:text-2xl font-medium tracking-tight text-neutral-900 leading-relaxed">{cs.overview}</p>
            </Reveal>
            <Reveal className="px-8 xl:px-16">
              <p className="text-lg text-neutral-700 leading-relaxed">{cs.challenge}</p>
            </Reveal>
            <Reveal className="aspect-[2.7/2] overflow-hidden bg-neutral-100">
              <img src={nextImg()} alt={galleryAlt} loading="lazy" className="w-full h-full object-cover" />
            </Reveal>
            <Reveal className="px-8 xl:px-16">
              <p className="text-xl sm:text-2xl font-medium tracking-tight text-neutral-900 leading-relaxed">{cs.overview}</p>
            </Reveal>
            <Reveal className="px-8 xl:px-16">
              <p className="text-lg text-neutral-700 leading-relaxed">{cs.challenge}</p>
            </Reveal>
          </div>
        </section>

        {/* Product film — full-bleed autoplaying video, no text card. The
            overlay used to repeat cs.overview, which the Challenge section
            just showed; letting the film run clean avoids saying the same
            line twice within one scroll beat. */}
        {cs.video && (
          <section className="relative w-full h-screen overflow-hidden bg-black">
            <video
              src={cs.video}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          </section>
        )}

        {/* Image strip — a row of gallery shots straight from the
            project's asset folder, filling the beat that used to be the
            pull quote. */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Reveal className="aspect-[3/4] overflow-hidden bg-neutral-100">
            <img src={nextImg()} alt={galleryAlt} loading="lazy" className="w-full h-full object-cover" />
          </Reveal>
          <Reveal className="aspect-[3/4] overflow-hidden bg-neutral-100">
            <img src={nextImg()} alt={galleryAlt} loading="lazy" className="w-full h-full object-cover" />
          </Reveal>
          <Reveal className="aspect-[3/4]">
            <GallerySlideshow images={cs.gallery} alt={galleryAlt} className="w-full h-full" />
          </Reveal>
        </section>

        {/* Pull quote — the project's own words on what changed, paired
            with the one-line principle it was designed around. */}
        <section
          className="relative py-24 sm:py-32 px-8 xl:px-16 flex flex-col items-center text-center gap-8"
          style={{ backgroundColor: primaryColor }}
        >
          <Reveal className="max-w-4xl">
            <p className="font-medium tracking-tight text-3xl sm:text-5xl leading-[1.15]" style={{ color: ink(primaryColor) }}>
              &ldquo;{cs.quote}&rdquo;
            </p>
          </Reveal>
          <Reveal>
            <span className="text-sm sm:text-base font-bold uppercase tracking-widest" style={{ color: ink(primaryColor, 0.7) }}>
              {cs.principle}
            </span>
          </Reveal>
        </section>

        {/* Our Solution: same sticky-left / scrolling-right composition as
            The Challenge, just carrying the solution's own copy. */}
        <section id="solution" className="lg:grid lg:grid-cols-2">
          <div
            className="lg:sticky lg:top-0 lg:h-screen flex flex-col"
            style={{ backgroundColor: tint(primaryColor, 0.08) }}
          >
            <div className="flex-1 flex items-center px-8 xl:px-16 py-16 lg:py-0">
              <h2 className="font-display font-medium uppercase text-6xl sm:text-7xl lg:text-9xl leading-[0.92] max-w-md">
                {cs.solutionHeadline}
              </h2>
            </div>
            <div className="px-8 xl:px-16 py-14" style={{ backgroundColor: accentColor }}>
              <span className="text-2xl sm:text-4xl font-medium" style={{ color: ink(accentColor) }}>Our Solution</span>
            </div>
          </div>

          <div className="flex flex-col gap-10 pb-16 lg:pb-24">
            <Reveal className="aspect-[4/3] overflow-hidden bg-neutral-100">
              <img src={nextImg()} alt={galleryAlt} loading="lazy" className="w-full h-full object-cover" />
            </Reveal>
            <Reveal className="px-8 xl:px-16">
              <p className="text-xl sm:text-2xl font-medium tracking-tight text-neutral-900 leading-relaxed">{cs.solution}</p>
            </Reveal>
            <Reveal className="px-8 xl:px-16">
              <p className="text-lg text-neutral-700 leading-relaxed">{cs.solution}</p>
            </Reveal>
            <Reveal className="aspect-[4/3] overflow-hidden bg-neutral-100">
              <img src={nextImg()} alt={galleryAlt} loading="lazy" className="w-full h-full object-cover" />
            </Reveal>
            <Reveal className="px-8 xl:px-16">
              <p className="text-xl sm:text-2xl font-medium tracking-tight text-neutral-900 leading-relaxed">{cs.solution}</p>
            </Reveal>
            <Reveal className="px-8 xl:px-16">
              <p className="text-lg text-neutral-700 leading-relaxed">{cs.solution}</p>
            </Reveal>
          </div>
        </section>

        {/* Mixed gallery — four rows of varying image arrangements pulled
            from the project's asset set, breaking the rhythm of one even
            grid with a full-bleed shot, a pair, a trio, then an
            asymmetric pair. */}
        <section className="px-4 pt-4 pb-4 flex flex-col gap-4">
          <Reveal className="aspect-21/9 overflow-hidden bg-neutral-100">
            <img src={nextImg()} alt={galleryAlt} loading="lazy" className="w-full h-full object-cover" />
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            <Reveal className="aspect-square overflow-hidden bg-neutral-100">
              <img src={nextImg()} alt={galleryAlt} loading="lazy" className="w-full h-full object-cover" />
            </Reveal>
            <Reveal className="aspect-square overflow-hidden bg-neutral-100">
              <img src={nextImg()} alt={galleryAlt} loading="lazy" className="w-full h-full object-cover" />
            </Reveal>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Reveal className="aspect-[3/4] overflow-hidden bg-neutral-100">
              <img src={nextImg()} alt={galleryAlt} loading="lazy" className="w-full h-full object-cover" />
            </Reveal>
            <Reveal className="aspect-[3/4] overflow-hidden bg-neutral-100">
              <img src={nextImg()} alt={galleryAlt} loading="lazy" className="w-full h-full object-cover" />
            </Reveal>
            <Reveal className="aspect-[3/4] overflow-hidden bg-neutral-100">
              <img src={nextImg()} alt={galleryAlt} loading="lazy" className="w-full h-full object-cover" />
            </Reveal>
          </div>
          <Reveal className="aspect-21/9 overflow-hidden bg-neutral-100">
            <img src={nextImg()} alt={galleryAlt} loading="lazy" className="w-full h-full object-cover" />
          </Reveal>
          <div className="grid grid-cols-3 gap-4 h-80 sm:h-96">
            <Reveal className="col-span-2 h-full overflow-hidden bg-neutral-100">
              <img src={nextImg()} alt={galleryAlt} loading="lazy" className="w-full h-full object-cover" />
            </Reveal>
            <Reveal className="col-span-1 h-full overflow-hidden bg-neutral-100">
              <img src={nextImg()} alt={galleryAlt} loading="lazy" className="w-full h-full object-cover" />
            </Reveal>
          </div>
        </section>

        {/* The Impact: closes the page out with the growth narrative —
            headline plus copy, full-width, no sticky two-column composition
            like Challenge/Solution. */}
        <section id="impact" className="pt-12 pb-24 sm:pt-16 sm:pb-32 px-8 xl:px-16" style={{ backgroundColor: accentColor }}>
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ink(accentColor, 0.6) }}>The Impact</span>
            </Reveal>
            <Reveal>
              <h2
                className="font-display font-medium uppercase text-5xl sm:text-6xl lg:text-7xl leading-[0.95] mt-4"
                style={{ color: ink(accentColor) }}
              >
                {cs.growthHeadline}
              </h2>
            </Reveal>
            <Reveal>
              <p
                className="mt-8 text-xl sm:text-2xl leading-relaxed font-medium tracking-tight"
                style={{ color: ink(accentColor, 0.8) }}
              >
                {cs.growth}
              </p>
            </Reveal>
          </div>
        </section>

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
