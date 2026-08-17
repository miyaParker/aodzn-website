'use client';

import React, { useEffect, useState } from 'react';
import Loader from '../Loader';
import Navbar from '../Navbar';
import Hero from '../Hero';
import ProcessTimeline from '../ProcessTimeline';
import StrategySection from '../StrategySection';
import ProcessAccordionSection from '../ProcessAccordionSection';
import MovesPeopleSection from '../MovesPeopleSection';
import DigitalSection from '../DigitalSection';
import PortfolioSection from '../PortfolioSection';
import JournalSection from '../JournalSection';
import Footer from '../Footer';
import CustomCursor from '../CustomCursor';
import ShowreelModal from '../ShowreelModal';
import ContactModal from '../ContactModal';
import { useLenis } from '../../hooks/useLenis';
import { HomePageContent, JournalArticle, Project, ProcessStepContent, SiteSettings } from '../../types';

interface HomeViewProps {
  siteSettings: SiteSettings;
  homePage: HomePageContent;
  projects: Project[];
  journalArticles: JournalArticle[];
  processSteps: ProcessStepContent[];
}

export default function HomeView({
  siteSettings,
  homePage,
  projects,
  journalArticles,
  processSteps,
}: HomeViewProps) {
  // Activate Lenis smooth scrolling
  useLenis();

  // Modals state
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Gates the Hero entrance animation so it plays as the loader wipes away
  // instead of finishing silently underneath it.
  const [heroReady, setHeroReady] = useState(false);

  // The process-accordion section onward is all dark content with no light
  // section in between, so this is a one-way switch: rather than each dark
  // section painting its own black backdrop (a hard cut at its edge), the
  // page background itself crossfades to black once that section is almost
  // in view, so the color change reads as a wash rather than a seam.
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const section = document.getElementById('process-accordion');
    if (!section) return;

    let raf = 0;
    const measure = () => {
      raf = 0;
      setIsDark(section.getBoundingClientRect().top <= window.innerHeight * 0.85);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    measure();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className={`relative min-h-screen antialiased selection:bg-black selection:text-white ${
        isDark ? 'bg-black text-white' : 'bg-[#FFFFFF] text-[#111111]'
      }`}
    >
      {/* Animated Loading Screen */}
      <Loader content={homePage.loader} onComplete={() => setHeroReady(true)} />

      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* Top Navbar */}
      <Navbar
        siteSettings={siteSettings}
        onOpenContact={() => setContactOpen(true)}
        onOpenShowreel={() => setShowreelOpen(true)}
      />

      {/* Main Page Content */}
      <main className="relative z-10">
        <Hero
          ready={heroReady}
          onOpenShowreel={() => setShowreelOpen(true)}
          topWordLeft={homePage.hero.topWordLeft}
          topWordRight={homePage.hero.topWordRight}
          bottomWord={homePage.hero.bottomWord}
          tagline={homePage.hero.tagline}
          ctaLabel={homePage.hero.ctaLabel}
          video={homePage.hero.video}
          sticker={homePage.hero.sticker}
        />

        <ProcessTimeline content={homePage.processTimeline} isDark={isDark} />

        <StrategySection />

        <ProcessAccordionSection steps={processSteps} content={homePage.processSection} />

        {/* <MovesPeopleSection /> */}

        {/* <DigitalSection /> */}

        <PortfolioSection projects={projects} content={homePage.portfolioSection} />

        <JournalSection articles={journalArticles} content={homePage.journalSection} />
      </main>

      {/* Footer */}
      <Footer siteSettings={siteSettings} footerCta={homePage.footerCta} onOpenContact={() => setContactOpen(true)} />

      {/* Overlays & Modals */}
      <ShowreelModal
        isOpen={showreelOpen}
        onClose={() => setShowreelOpen(false)}
        title={homePage.showreelModal.title}
        video={homePage.showreelModal.video}
        posterImage={homePage.showreelModal.posterImage}
      />

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        content={homePage.contactModal}
        projectContactEmail={siteSettings.projectContactEmail}
      />
    </div>
  );
}
