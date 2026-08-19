'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ContactModal from '../ContactModal';
import FilterDropdown from '../FilterDropdown';
import GrowRevealCard from '../GrowRevealCard';
import TagPills from '../TagPills';
import { WORK_TYPES } from '../../data/portfolioData';
import { HomePageContent, Project, SiteSettings } from '../../types';

type TypeFilter = 'All' | Project['type'];
type DomainFilter = 'All' | string;

interface WorksViewProps {
  siteSettings: SiteSettings;
  footerCta: HomePageContent['footerCta'];
  contactModalContent: HomePageContent['contactModal'];
  projects: Project[];
}

export default function WorksView({ siteSettings, footerCta, contactModalContent, projects }: WorksViewProps) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [domainFilter, setDomainFilter] = useState<DomainFilter>('All');
  const [contactOpen, setContactOpen] = useState(false);

  const domains = useMemo(() => Array.from(new Set(projects.map((p) => p.domain))), [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (typeFilter !== 'All' && p.type !== typeFilter) return false;
      if (domainFilter !== 'All' && p.domain !== domainFilter) return false;
      return true;
    });
  }, [projects, typeFilter, domainFilter]);

  return (
    <div className="relative min-h-screen bg-[#FFFFFF] text-[#111111] antialiased selection:bg-black selection:text-white">
      <Navbar
        siteSettings={siteSettings}
        onOpenContact={() => setContactOpen(true)}
        onOpenShowreel={() => {}}
      />

      <main className="relative z-10 pt-28 pb-16 px-8 xl:px-16">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-widest text-neutral-500 mb-8">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black">Work</span>
        </nav>

        <div className="w-full text-center">
          <h1 className="font-display font-medium text-7xl sm:text-9xl lg:text-[10rem] leading-[0.95] text-black">
            Work that ships,<br />and actually works.
          </h1>

          <div className="mt-6 inline-flex items-center gap-6 sm:gap-8 px-6 py-3.5 rounded-full bg-white border border-black/10">
            <FilterDropdown
              label="Type of work"
              value={typeFilter}
              options={['All', ...WORK_TYPES] as TypeFilter[]}
              onChange={(value) => setTypeFilter(value)}
            />
            <span className="w-px h-4 bg-black/10" />
            <FilterDropdown
              label="Domain"
              value={domainFilter}
              options={['All', ...domains]}
              onChange={setDomainFilter}
            />
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-14 w-full mx-auto">
          {filteredProjects.map((project, i) => (
            <Link
              key={project.id}
              href={`/works/${project.id}`}
              data-cursor="view"
              data-cursor-text="VIEW CASE STUDY"
              className="group text-left block"
            >
              <GrowRevealCard delay={(i % 2) * 0.06}>
                <img
                  src={project.image}
                  alt={`${project.title} project preview`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </GrowRevealCard>
              <p className="relative z-20 mt-4 font-display font-medium uppercase text-3xl sm:text-5xl text-black leading-snug">
                {project.title}
              </p>
              <TagPills tags={project.tags.slice(0, 3)} />
              <div className="relative z-20 mt-3 flex items-center gap-3">
                <span className="font-medium text-neutral-600">{project.client}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{project.domain}</span>
              </div>
            </Link>
          ))}

          {filteredProjects.length === 0 && (
            <p className="col-span-full text-center text-neutral-500 py-20">
              No work matches those filters yet — check back soon.
            </p>
          )}
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
