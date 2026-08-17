import { client } from './client'
import {
  HOME_PAGE_QUERY,
  JOURNAL_ARTICLES_QUERY,
  PROCESS_STEPS_QUERY,
  PROJECTS_QUERY,
  PROJECT_BY_SLUG_QUERY,
  PROJECT_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
} from './queries'
import {
  HomePageContent,
  JournalArticle,
  Project,
  ProcessStepContent,
  SiteSettings,
} from '../../types'

export const getSiteSettings = () => client.fetch<SiteSettings>(SITE_SETTINGS_QUERY)
export const getHomePage = () => client.fetch<HomePageContent>(HOME_PAGE_QUERY)
export const getProjects = () => client.fetch<Project[]>(PROJECTS_QUERY)
export const getProjectBySlug = (slug: string) =>
  client.fetch<Project | null>(PROJECT_BY_SLUG_QUERY, { slug })
export const getProjectSlugs = () => client.fetch<{ id: string }[]>(PROJECT_SLUGS_QUERY)
export const getJournalArticles = () => client.fetch<JournalArticle[]>(JOURNAL_ARTICLES_QUERY)
export const getProcessSteps = () => client.fetch<ProcessStepContent[]>(PROCESS_STEPS_QUERY)
