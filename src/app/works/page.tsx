import type { Metadata } from 'next';
import WorksView from '../../components/views/WorksView';
import { getHomePage, getProjects, getSiteSettings } from '../../sanity/lib/fetch';

export const metadata: Metadata = {
  title: 'Work — AODZN',
};

export default async function Page() {
  const [siteSettings, homePage, projects] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getProjects(),
  ]);

  return (
    <WorksView
      siteSettings={siteSettings}
      footerCta={homePage.footerCta}
      contactModalContent={homePage.contactModal}
      projects={projects}
    />
  );
}
