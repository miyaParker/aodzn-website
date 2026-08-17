import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CaseStudyView from '../../../components/views/CaseStudyView';
import { PROJECTS_DATA } from '../../../data/portfolioData';

export function generateStaticParams() {
  return PROJECTS_DATA.map((project) => ({ id: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = PROJECTS_DATA.find((p) => p.id === id);

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
  const project = PROJECTS_DATA.find((p) => p.id === id);

  if (!project) notFound();

  return <CaseStudyView project={project} />;
}
