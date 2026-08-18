'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Facebook, Link2, Twitter } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ContactModal from '../ContactModal';
import { HomePageContent, JournalArticle, SiteSettings } from '../../types';

const formatArticleDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

// Shown until a real `body` is written in Studio, so the page never ends
// abruptly right after the hero image.
const PLACEHOLDER_PARAGRAPHS = [
  'This article is still being written. Check back soon for the full piece — in the meantime, the summary above covers the gist of it.',
  'Want to talk through this topic sooner? Reach out directly and I\'m happy to share more.',
];

function ShareRow({ article }: { article: JournalArticle }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 mr-1">Share:</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="flex items-center justify-center w-9 h-9 rounded-sm border border-neutral-300 text-neutral-500 hover:text-black hover:border-[#04a3cc] transition-colors"
      >
        <Facebook className="w-4 h-4" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="flex items-center justify-center w-9 h-9 rounded-sm border border-neutral-300 text-neutral-500 hover:text-black hover:border-[#04a3cc] transition-colors"
      >
        <Twitter className="w-4 h-4" />
      </a>
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="relative flex items-center justify-center w-9 h-9 rounded-sm border border-neutral-300 text-neutral-500 hover:text-black hover:border-[#04a3cc] transition-colors"
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

interface JournalArticleViewProps {
  article: JournalArticle;
  siteSettings: SiteSettings;
  footerCta: HomePageContent['footerCta'];
  contactModalContent: HomePageContent['contactModal'];
}

export default function JournalArticleView({
  article,
  siteSettings,
  footerCta,
  contactModalContent,
}: JournalArticleViewProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const paragraphs = article.body?.split(/\n\s*\n/).filter(Boolean) ?? [];

  return (
    <div className="relative min-h-screen bg-[#FFFFFF] text-[#111111] antialiased selection:bg-black selection:text-white">
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
          {(paragraphs.length > 0 ? paragraphs : PLACEHOLDER_PARAGRAPHS).map((paragraph, i) => (
            <p
              key={i}
              className={`text-lg sm:text-xl leading-relaxed ${
                paragraphs.length > 0 ? 'text-neutral-700' : 'text-neutral-400 italic'
              }`}
            >
              {paragraph}
            </p>
          ))}
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
