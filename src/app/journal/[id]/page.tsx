import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JournalArticleView from '../../../components/views/JournalArticleView';
import {
  getHomePage,
  getJournalArticleBySlug,
  getJournalArticleSlugs,
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
  const [article, siteSettings, homePage] = await Promise.all([
    getJournalArticleBySlug(id),
    getSiteSettings(),
    getHomePage(),
  ]);

  if (!article) notFound();

  return (
    <JournalArticleView
      article={article}
      siteSettings={siteSettings}
      footerCta={homePage.footerCta}
      contactModalContent={homePage.contactModal}
    />
  );
}
