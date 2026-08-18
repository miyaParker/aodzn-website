import type { Metadata } from 'next';
import JournalListView from '../../components/views/JournalListView';
import { getHomePage, getJournalArticles, getSiteSettings } from '../../sanity/lib/fetch';

export const metadata: Metadata = {
  title: 'Journal — AODZN',
};

export default async function Page() {
  const [siteSettings, homePage, articles] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getJournalArticles(),
  ]);

  return (
    <JournalListView
      siteSettings={siteSettings}
      footerCta={homePage.footerCta}
      contactModalContent={homePage.contactModal}
      articles={articles}
    />
  );
}
