'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ContactModal from '../ContactModal';
import Tag from '../Tag';
import { HomePageContent, Project, SiteSettings } from '../../types';

const EASE = [0.76, 0, 0.24, 1] as const;
const ROTATE_INTERVAL_MS = 2600;

interface NotFoundViewProps {
  siteSettings: SiteSettings;
  footerCta: HomePageContent['footerCta'];
  contactModalContent: HomePageContent['contactModal'];
  projects: Project[];
}

export default function NotFoundView({ siteSettings, footerCta, contactModalContent, projects }: NotFoundViewProps) {
  const [contactOpen, setContactOpen] = useState(false);

  // A single photo slot that cycles through recent projects one after
  // another — the reference design shows one editorial photo, so rather
  // than fanning several out we keep that one spot and rotate what's in it.
  const showcaseProjects = projects.slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (showcaseProjects.length < 2) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % showcaseProjects.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [showcaseProjects.length]);

  const activeProject = showcaseProjects[activeIndex];

  return (
    <div className="relative min-h-screen bg-[#FFFFFF] text-[#111111] antialiased selection:bg-black selection:text-white">
      <Navbar
        siteSettings={siteSettings}
        onOpenContact={() => setContactOpen(true)}
        onOpenShowreel={() => {}}
      />

      <main className="relative z-10 min-h-screen flex flex-col justify-center lg:justify-end px-8 xl:px-16 overflow-hidden">
        <div className="relative w-full">
        {/* Single rotating project photo — same spot and size the whole
            time, just swapping which case study it shows and links to.
            Centered on this block's own height (roughly the Back to Home
            row) rather than the full viewport, so it sits clear of the
            Not Found line below and leaves that free to span full width. */}
        {activeProject && (
          <div className="hidden md:block absolute top-1/3 -translate-y-1/2 right-8 xl:right-24 w-48 lg:w-56">
          <p className="mb-3 text-sm sm:text-base font-bold uppercase tracking-widest text-black">
            Explore My Work
          </p>
          <Link
            href={`/works/${activeProject.id}`}
            className="relative block aspect-[3/4] rounded-md overflow-hidden shadow-xl ring-1 ring-black/5"
          >
            {/* No `mode="wait"` — the incoming image needs to be
                stacked and fading in while the outgoing one is still
                fading out, otherwise there's a beat where neither has
                painted yet and the empty rounded container shows through. */}
            <AnimatePresence initial={false}>
              <motion.img
                key={activeProject.id}
                src={activeProject.image}
                alt={`${activeProject.title} project preview`}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Scrim so the title stays legible over whichever photo is
                currently showing, then the title itself overlapping the
                card's bottom-left corner. */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <AnimatePresence initial={false}>
              <motion.p
                key={activeProject.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute bottom-3 left-3 right-3 font-sans font-medium lowercase text-lg lg:text-xl text-white leading-snug truncate"
              >
                {activeProject.title}
              </motion.p>
            </AnimatePresence>
          </Link>
          </div>
        )}

        <div className="relative inline-block">
          <h1 className="font-display font-medium uppercase leading-[0.9] text-black text-[8rem] sm:text-[12rem] lg:text-[14rem]">
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                404
              </motion.span>
            </span>
          </h1>

          {/* Error tag — the shared sticker treatment also used by the
              Hero section's INTENTIONAL/BY DESIGN pills, anchored to the
              bottom-right corner of the numeral and tilted the same way. */}
          <Tag
            bgColor="#04a3cc"
            size="md"
            rotate={-16}
            initialRotate={-40}
            delay={0.6}
            className="absolute bottom-0 -right-4 sm:-right-8 -translate-y-1/6"
          >
            Error
          </Tag>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
          className="my-8 sm:my-10"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-widest text-black underline underline-offset-4 decoration-black/20 hover:decoration-black transition-colors"
          >
            Back to Home
            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        <h1 className="w-full font-display font-medium uppercase leading-[0.9] text-black text-[10rem] md:text-[19vw] lg:text-[26vw]">
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            >
              Not Found
            </motion.span>
          </span>
        </h1>
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
