'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ContactModal from '../ContactModal';
import FilterDropdown from '../FilterDropdown';
import { HomePageContent, JournalArticle, SiteSettings } from '../../types';

type CategoryFilter = 'All' | string;

const EASE = [0.76, 0, 0.24, 1] as const;

const formatArticleDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();

// Cycles accent → green → orange, matching the hero section's tag pills.
const TAG_COLORS = ['bg-[#04a3cc] text-black', 'bg-[#A5CD04] text-black', 'bg-[#f59e0b] text-black'];

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
function GrowRevealCard({ children, delay }: { children: React.ReactNode; delay: number }) {
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

interface JournalListViewProps {
  siteSettings: SiteSettings;
  footerCta: HomePageContent['footerCta'];
  contactModalContent: HomePageContent['contactModal'];
  articles: JournalArticle[];
}

export default function JournalListView({
  siteSettings,
  footerCta,
  contactModalContent,
  articles,
}: JournalListViewProps) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [contactOpen, setContactOpen] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(articles.map((a) => a.category).filter((c): c is string => Boolean(c)))),
    [articles]
  );

  const filteredArticles = useMemo(() => {
    if (categoryFilter === 'All') return articles;
    return articles.filter((a) => a.category === categoryFilter);
  }, [articles, categoryFilter]);

  return (
    <div className="relative min-h-screen bg-[#FFFFFF] text-[#111111] antialiased selection:bg-black selection:text-white">
      <Navbar
        siteSettings={siteSettings}
        onOpenContact={() => setContactOpen(true)}
        onOpenShowreel={() => {}}
      />

      <main className="relative z-10 pt-28 pb-16 px-8 xl:px-16">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-widest text-neutral-500 mb-8">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black">Journal</span>
        </nav>

        <div className="w-full text-center">
          <h1 className="font-display font-medium text-7xl sm:text-9xl lg:text-[10rem] leading-[0.95] text-black">
            Lessons that stuck,<br />and a few that didn&apos;t.
          </h1>

          {categories.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-6 sm:gap-8 px-6 py-3.5 rounded-full bg-white border border-black/10">
              <FilterDropdown
                label="Category"
                value={categoryFilter}
                options={['All', ...categories]}
                onChange={setCategoryFilter}
              />
            </div>
          )}
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-14 w-full mx-auto">
          {filteredArticles.map((article, i) => (
            <Link
              key={article.id}
              href={`/journal/${article.id}`}
              data-cursor="view"
              data-cursor-text="READ"
              className="group text-left block"
            >
              <GrowRevealCard delay={(i % 2) * 0.06}>
                {article.heroImage ? (
                  <img
                    src={article.heroImage}
                    alt={article.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                    style={{ background: article.gradient }}
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </GrowRevealCard>
              <p className="relative z-20 mt-4 font-display font-medium uppercase text-3xl sm:text-5xl text-black leading-snug">
                {article.title}
              </p>
              {/* {article.previewSubtitle && (
                <p className="relative z-20 mt-1 font-sans text-sm sm:text-base text-neutral-600">
                  {article.previewSubtitle}
                </p>
              )} */}
              {article.tags && article.tags.length > 0 && (
                <div className="relative z-20 flex flex-wrap items-center gap-2">
                  {article.tags.map((tag, ti) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-sm font-display  text-3xl uppercase select-none ${
                        TAG_COLORS[ti % TAG_COLORS.length]
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="relative z-20 mt-3 flex items-center gap-3">
                {/* {article.category && (
                  <span className="px-2.5 py-1 rounded-full bg-black/5 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                    {article.category}
                  </span>
                )} */}
                <span className="text-[16x] font-medium uppercase tracking text-neutral-500">
                  {formatArticleDate(article.date)}
                </span>
              </div>
            </Link>
          ))}

          {filteredArticles.length === 0 && (
            <p className="col-span-full text-center text-neutral-500 py-20">
              No articles in this category yet — check back soon.
            </p>
          )}
        </div>
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
