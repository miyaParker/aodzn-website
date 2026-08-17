import HomeView from '../components/views/HomeView';
import {
  getHomePage,
  getJournalArticles,
  getProcessSteps,
  getProjects,
  getSiteSettings,
} from '../sanity/lib/fetch';

export default async function Page() {
  const [siteSettings, homePage, projects, journalArticles, processSteps] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getProjects(),
    getJournalArticles(),
    getProcessSteps(),
  ]);

  return (
    <HomeView
      siteSettings={siteSettings}
      homePage={homePage}
      projects={projects}
      journalArticles={journalArticles}
      processSteps={processSteps}
    />
  );
}
