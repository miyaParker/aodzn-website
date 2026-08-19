'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ContactModal from '../ContactModal';
import FilterDropdown from '../FilterDropdown';
import GrowRevealCard from '../GrowRevealCard';
import TagPills from '../TagPills';
import { HomePageContent, JournalArticle, SiteSettings } from '../../types';

type CategoryFilter = 'All' | string;

const formatArticleDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();

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
              <TagPills tags={article.tags ?? []} />
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
