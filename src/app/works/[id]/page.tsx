import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CaseStudyView from '../../../components/views/CaseStudyView';
import { getHomePage, getProjectBySlug, getProjectSlugs, getSiteSettings } from '../../../sanity/lib/fetch';

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map(({ id }) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectBySlug(id);

  if (!project) return {};

  return {
    title: `${project.title} — AODZN`,
    description: project.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, siteSettings, homePage] = await Promise.all([
    getProjectBySlug(id),
    getSiteSettings(),
    getHomePage(),
  ]);

  if (!project) notFound();

  return (
    <CaseStudyView
      project={project}
      siteSettings={siteSettings}
      footerCta={homePage.footerCta}
      contactModalContent={homePage.contactModal}
    />
  );
}
