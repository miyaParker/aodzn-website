import React, { useState } from 'react';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProcessTimeline from '../components/ProcessTimeline';
import StrategySection from '../components/StrategySection';
import ProcessAccordionSection from '../components/ProcessAccordionSection';
import MovesPeopleSection from '../components/MovesPeopleSection';
import DigitalSection from '../components/DigitalSection';
import PortfolioSection from '../components/PortfolioSection';
import JournalSection from '../components/JournalSection';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import ShowreelModal from '../components/ShowreelModal';
import ContactModal from '../components/ContactModal';
import { useLenis } from '../hooks/useLenis';

export default function Home() {
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

        {/* <JournalSection /> */}
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
