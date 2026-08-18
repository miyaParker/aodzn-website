import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JournalArticleView from '../../../components/views/JournalArticleView';
import {
  getHomePage,
  getJournalArticleBySlug,
  getJournalArticleSlugs,
  getJournalArticles,
  getSiteSettings,
} from '../../../sanity/lib/fetch';

export async function generateStaticParams() {
  const slugs = await getJournalArticleSlugs();
  return slugs.map(({ id }) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getJournalArticleBySlug(id);

  if (!article) return {};

  return {
    title: `${article.title} — AODZN`,
    description: article.previewSubtitle,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article, siteSettings, homePage, allArticles] = await Promise.all([
    getJournalArticleBySlug(id),
    getSiteSettings(),
    getHomePage(),
    getJournalArticles(),
  ]);

  if (!article) notFound();

  const otherArticles = allArticles.filter((a) => a.id !== article.id);
  const relatedArticles = [
    ...otherArticles.filter((a) => a.category && a.category === article.category),
    ...otherArticles.filter((a) => !a.category || a.category !== article.category),
  ].slice(0, 4);

  return (
    <JournalArticleView
      article={article}
      siteSettings={siteSettings}
      footerCta={homePage.footerCta}
      contactModalContent={homePage.contactModal}
      relatedArticles={relatedArticles}
    />
  );
}
