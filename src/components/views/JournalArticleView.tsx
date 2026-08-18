'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Facebook, Linkedin, Link2, Mail, Twitter } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ContactModal from '../ContactModal';
import { HomePageContent, JournalArticle, SiteSettings } from '../../types';

const ACCENT = '#04a3cc';

const formatArticleDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

// Shown until a real `body` is written in Studio, so the page never ends
// abruptly right after the hero image.
const PLACEHOLDER_PARAGRAPHS = [
  'This article is still being written. Check back soon for the full piece — in the meantime, the summary above covers the gist of it.',
  'Want to talk through this topic sooner? Reach out directly and I\'m happy to share more.',
];

// Lightweight markup the `body` text field supports: a paragraph prefixed
// with "> " renders as a pull quote (optionally "> quote — Attribution"),
// and ==words== render as an inline highlight. Keeps Studio authoring to
// plain text while still allowing richer typography in the article.
function renderInline(text: string) {
  return text.split(/(==[^=]+==)/g).map((part, i) => {
    const match = part.match(/^==([^=]+)==$/);
    if (!match) return part;
    return (
      <mark key={i} className="px-1 rounded-[2px] text-black" style={{ backgroundColor: `${ACCENT}26` }}>
        {match[1]}
      </mark>
    );
  });
}

function ShareRow({ article }: { article: JournalArticle }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const iconClass =
    'flex items-center justify-center w-9 h-9 rounded-sm border border-neutral-300 text-neutral-500 hover:text-black hover:border-[#04a3cc] transition-colors';

  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 mr-1">Share:</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className={iconClass}
      >
        <Facebook className="w-4 h-4" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={iconClass}
      >
        <Twitter className="w-4 h-4" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={iconClass}
      >
        <Linkedin className="w-4 h-4" />
      </a>
      <a
        href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(shareUrl)}`}
        aria-label="Share via email"
        className={iconClass}
      >
        <Mail className="w-4 h-4" />
      </a>
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className={`relative ${iconClass}`}
      >
        <Link2 className="w-4 h-4" />
        {copied && (
          <span className="absolute -bottom-8 right-0 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1 rounded-sm">
            Copied
          </span>
        )}
      </button>
    </div>
  );
}

// Thin fixed bar above the navbar that fills with the reader's scroll
// position through <main>, so there's a persistent sense of how much of
// the piece is left.
function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent">
      <div
        className="h-full transition-[width] duration-150 ease-linear"
        style={{ width: `${progress}%`, backgroundColor: ACCENT }}
      />
    </div>
  );
}

function RelatedArticles({ articles }: { articles: JournalArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="w-full pb-20 sm:pb-28 border-t border-black/10 pt-16 sm:pt-20">
      <h2 className="font-display font-medium text-3xl sm:text-4xl text-black mb-10">
        Keep reading
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((related) => (
          <Link
            key={related.id}
            href={`/journal/${related.id}`}
            data-cursor="view"
            data-cursor-text="READ"
            className="group block"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-neutral-950">
              {related.heroImage ? (
                <img
                  src={related.heroImage}
                  alt={related.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={{ background: related.gradient }}
                />
              )}
            </div>
            {related.category && (
              <span className="block mt-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                {related.category}
              </span>
            )}
            <p className="mt-2 font-display font-medium text-lg sm:text-xl text-black leading-snug group-hover:text-neutral-600 transition-colors">
              {related.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

interface JournalArticleViewProps {
  article: JournalArticle;
  siteSettings: SiteSettings;
  footerCta: HomePageContent['footerCta'];
  contactModalContent: HomePageContent['contactModal'];
  relatedArticles?: JournalArticle[];
}

export default function JournalArticleView({
  article,
  siteSettings,
  footerCta,
  contactModalContent,
  relatedArticles = [],
}: JournalArticleViewProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const paragraphs = article.body?.split(/\n\s*\n/).filter(Boolean) ?? [];
  const galleryInsertIndex = Math.max(0, Math.floor(paragraphs.length / 2) - 1);

  return (
    <div className="relative min-h-screen bg-[#FFFFFF] text-[#111111] antialiased selection:bg-black selection:text-white">
      <ReadingProgress />
      <Navbar
        siteSettings={siteSettings}
        onOpenContact={() => setContactOpen(true)}
        onOpenShowreel={() => {}}
      />

      <main className="relative z-10 pt-28 px-8 xl:px-16">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-widest text-neutral-500 mb-6">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/journal" className="hover:text-black transition-colors">Journal</Link>
          <span className="mx-2">/</span>
          <span className="text-black truncate">{article.title}</span>
        </nav>

        <div className="flex items-center gap-3 mb-4">
          {article.category && (
            <span className="px-2.5 py-1 rounded-full bg-black/5 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
              {article.category}
            </span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            {formatArticleDate(article.date)}
          </span>
        </div>

        <h1 className="font-display font-medium text-5xl sm:text-7xl lg:text-8xl leading-[0.95] text-black max-w-4xl">
          {article.title}
        </h1>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 border-b border-black/10">
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl">{article.previewSubtitle}</p>
          <ShareRow article={article} />
        </div>

        <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] aspect-[21/9] mt-8 sm:mt-10 overflow-hidden">
          {article.heroImage ? (
            <img
              src={article.heroImage}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div aria-hidden="true" className="absolute inset-0" style={{ background: article.gradient }} />
          )}
        </div>

        <div className="max-w-2xl mx-auto py-16 sm:py-24 flex flex-col gap-6">
          {(paragraphs.length > 0 ? paragraphs : PLACEHOLDER_PARAGRAPHS).map((paragraph, i) => {
            const isPlaceholder = paragraphs.length === 0;
            const trimmed = paragraph.trim();

            let block: React.ReactNode;

            if (!isPlaceholder && trimmed.startsWith('## ')) {
              block = (
                <h2 key={i} className="font-sans font-medium text-2xl sm:text-3xl text-black mt-4">
                  {trimmed.slice(3)}
                </h2>
              );
            } else if (!isPlaceholder && trimmed.startsWith('>')) {
              const raw = trimmed.replace(/^>\s*/, '');
              // Split on " ~ " rather than an em dash — this prose style
              // uses em dashes constantly for asides, so that character
              // isn't a safe delimiter for an optional attribution suffix.
              const attributionMatch = raw.match(/^(.*?)\s+~\s+(.+)$/s);
              const quote = attributionMatch ? attributionMatch[1] : raw;
              const attribution = attributionMatch?.[2];
              block = (
                <blockquote
                  key={i}
                  className="my-2 border-l-2 pl-6 sm:pl-8 py-1"
                  style={{ borderColor: ACCENT }}
                >
                  <p className="font-display font-medium text-2xl sm:text-3xl leading-snug text-black">
                    &ldquo;{renderInline(quote)}&rdquo;
                  </p>
                  {attribution && (
                    <cite className="block mt-3 text-xs font-bold uppercase tracking-widest text-neutral-500 not-italic">
                      — {attribution}
                    </cite>
                  )}
                </blockquote>
              );
            } else {
              block = (
                <p
                  key={i}
                  className={`text-base sm:text-lg leading-relaxed ${
                    isPlaceholder ? 'text-neutral-400 italic' : 'text-neutral-700'
                  }`}
                >
                  {isPlaceholder ? paragraph : renderInline(paragraph)}
                </p>
              );
            }

            const showGallery =
              !isPlaceholder && (article.gallery?.length ?? 0) > 0 && i === galleryInsertIndex;

            return (
              <React.Fragment key={i}>
                {block}
                {showGallery && (
                  <figure className="my-2">
                    <div className={`grid gap-4 ${article.gallery!.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {article.gallery!.map((src, gi) => (
                        <div key={gi} className="aspect-[3/4] overflow-hidden rounded-sm bg-neutral-100">
                          <img src={src} alt={article.title} loading="lazy" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    {article.galleryCaption && (
                      <figcaption className="mt-3 text-sm text-neutral-500 italic">
                        {article.galleryCaption}
                      </figcaption>
                    )}
                  </figure>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <RelatedArticles articles={relatedArticles} />
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
