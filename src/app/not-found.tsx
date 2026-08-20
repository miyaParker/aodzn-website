import NotFoundView from '../components/views/NotFoundView';
import { getHomePage, getProjects, getSiteSettings } from '../sanity/lib/fetch';

export default async function NotFound() {
  const [siteSettings, homePage, projects] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getProjects(),
  ]);

  return (
    <NotFoundView
      siteSettings={siteSettings}
      footerCta={homePage.footerCta}
      contactModalContent={homePage.contactModal}
      projects={projects}
    />
  );
}
