'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ContactModal from '../ContactModal';
import { HomePageContent, JournalArticle, SiteSettings } from '../../types';

const EASE = [0.76, 0, 0.24, 1] as const;

const formatArticleDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();

interface JournalListViewProps {
  siteSettings: SiteSettings;
  footerCta: HomePageContent['footerCta'];
  contactModalContent: HomePageContent['contactModal'];
  content: HomePageContent['journalSection'];
  articles: JournalArticle[];
}

export default function JournalListView({
  siteSettings,
  footerCta,
  contactModalContent,
  content,
  articles,
}: JournalListViewProps) {
  const [categoryFilter, setCategoryFilter] = useState('All');
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

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <h1 className="font-display font-medium text-6xl sm:text-7xl lg:text-8xl leading-[0.95] text-black">
            {content.sectionTitle}
          </h1>

          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
                    categoryFilter === cat
                      ? 'bg-black text-white'
                      : 'bg-white text-neutral-600 border border-black/10 hover:border-black/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
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
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-neutral-950">
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
                {/* Swipe reveal: mask starts covering the card and retreats
                    upward on scroll-into-view, uncovering it bottom to top. */}
                <motion.div
                  initial={{ y: '0%' }}
                  whileInView={{ y: '-100%' }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, delay: (i % 2) * 0.15, ease: EASE }}
                  className="absolute inset-0 z-10 bg-[#FFFFFF] pointer-events-none"
                />
              </div>
              <div className="relative z-20 mt-4 flex items-center gap-3">
                {article.category && (
                  <span className="px-2.5 py-1 rounded-full bg-black/5 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                    {article.category}
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  {formatArticleDate(article.date)}
                </span>
              </div>
              <p className="relative z-20 mt-2 font-display font-medium text-xl sm:text-2xl text-black leading-snug">
                {article.title}
              </p>
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
