import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import { PROJECTS_DATA, WORK_TYPES, WORK_DOMAINS } from '../data/portfolioData';
import { Project } from '../types';

type TypeFilter = 'All' | Project['type'];
type DomainFilter = 'All' | string;

function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="flex items-center gap-2 text-sm font-medium text-black hover:text-neutral-600 transition-colors"
      >
        <span className="text-neutral-500">{label}</span>
        <span>{value}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-3 min-w-40 rounded-sm border border-black/10 bg-white shadow-lg overflow-hidden z-20">
          {options.map((opt) => (
            <button
              key={opt}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                opt === value ? 'bg-black/5 text-black font-medium' : 'text-neutral-600 hover:bg-black/5'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WorksPage() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [domainFilter, setDomainFilter] = useState<DomainFilter>('All');
  const [contactOpen, setContactOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter((p) => {
      if (typeFilter !== 'All' && p.type !== typeFilter) return false;
      if (domainFilter !== 'All' && p.domain !== domainFilter) return false;
      return true;
    });
  }, [typeFilter, domainFilter]);

  return (
    <div className="relative min-h-screen bg-[#FFFFFF] text-[#111111] antialiased selection:bg-black selection:text-white">
      <Navbar
        onOpenContact={() => setContactOpen(true)}
        onOpenShowreel={() => {}}
      />

      <main className="relative z-10 pt-28 pb-16 px-8 xl:px-16">
        <div className="w-full text-center">
          <h1 className="font-display font-medium text-6xl sm:text-8xl lg:text-9xl leading-[0.95] text-black">
            Work that ships,<br />and actually works.
          </h1>

          <div className="mt-6 inline-flex items-center gap-6 sm:gap-8 px-6 py-3.5 rounded-full bg-white border border-black/10">
            <FilterDropdown
              label="Type of work"
              value={typeFilter}
              options={['All', ...WORK_TYPES]}
              onChange={setTypeFilter}
            />
            <span className="w-px h-4 bg-black/10" />
            <FilterDropdown
              label="Domain"
              value={domainFilter}
              options={['All', ...WORK_DOMAINS]}
              onChange={setDomainFilter}
            />
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-14 w-full mx-auto">
          {filteredProjects.map((project, i) => (
            <Link
              key={project.id}
              to={`/works/${project.id}`}
              data-cursor="view"
              data-cursor-text="VIEW CASE STUDY"
              className="group text-left block"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-neutral-950">
                <img
                  src={project.image}
                  alt={`${project.title} project preview`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                {/* Swipe reveal: mask starts covering the card and retreats
                    upward on scroll-into-view, uncovering it bottom to top. */}
                <motion.div
                  initial={{ y: '0%' }}
                  whileInView={{ y: '-100%' }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, delay: (i % 2) * 0.15, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute inset-0 z-10 bg-[#FFFFFF] pointer-events-none"
                />
              </div>
              <div className="relative z-20 mt-4 flex items-center justify-between">
                <span className="font-display font-medium text-xl sm:text-2xl text-black">{project.client}</span>
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

      <Footer onOpenContact={() => setContactOpen(true)} />

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
}
