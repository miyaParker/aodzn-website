'use client';

import React, { useState } from 'react';
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

export default function HomeView() {
  // Activate Lenis smooth scrolling
  useLenis();

  // Modals state
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Gates the Hero entrance animation so it plays as the loader wipes away
  // instead of finishing silently underneath it.
  const [heroReady, setHeroReady] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#F6F6F4] text-[#111111] antialiased selection:bg-black selection:text-white">
      {/* Animated Loading Screen */}
      <Loader onComplete={() => setHeroReady(true)} />

      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* Top Navbar */}
      <Navbar
        onOpenContact={() => setContactOpen(true)}
        onOpenShowreel={() => setShowreelOpen(true)}
      />

      {/* Main Page Content */}
      <main className="relative z-10">
        <Hero
          ready={heroReady}
          onOpenShowreel={() => setShowreelOpen(true)}
        />

        <ProcessTimeline />

        {/* <StrategySection /> */}

        <ProcessAccordionSection />

        {/* <MovesPeopleSection /> */}

        {/* <DigitalSection /> */}

        <PortfolioSection />

        <JournalSection />
      </main>

      {/* Footer */}
      <Footer onOpenContact={() => setContactOpen(true)} />

      {/* Overlays & Modals */}
      <ShowreelModal
        isOpen={showreelOpen}
        onClose={() => setShowreelOpen(false)}
      />

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
}
