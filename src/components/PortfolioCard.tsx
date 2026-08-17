import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';

interface PortfolioCardProps {
  project: Project;
}

const EASE = [0.25, 1, 0.5, 1] as const;

// The sticky left-hand info panel for the active project in the scroll-synced
// portfolio stack. This component stays mounted the whole time — each field
// keys its own AnimatePresence off project.id so title, body, and client can
// each run a different transition as the active project changes underneath.
// The "view case study" action itself lives on the image frame (right side),
// surfaced via the custom trailing cursor rather than a visible button here.
export default function PortfolioCard({ project }: PortfolioCardProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Title: swipes up on enter, drops down on exit — same box, mirrored
          direction, both clipped by the same overflow-hidden. pb-2 gives
          descenders (the tail on a lowercase y/p/g) room so the tight
          leading + clip box don't cut them off. */}
      <div className="overflow-hidden pb-2">
        <AnimatePresence mode="wait">
          <motion.h3
            key={project.id}
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: '0%', transition: { duration: 0.3, ease: EASE } }}
            exit={{ opacity: 0, y: '100%', transition: { duration: 0.12, ease: EASE } }}
            className="font-display tracking- text-white text-6xl sm:text-7xl lg:text-8xl leading-[0.95] capitalize"
          >
            {project.title.toLowerCase()}
          </motion.h3>
        </AnimatePresence>
      </div>

      {/* Description: plain crossfade, no movement — kept subtler than the
          title so it doesn't compete with the swipe-up above it. Exit is
          much quicker than enter so there's no flat, fully-invisible beat
          between the old text leaving and the new one arriving. */}
      <AnimatePresence mode="wait">
        <motion.p
          key={project.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4, ease: EASE } }}
          exit={{ opacity: 0, transition: { duration: 0.12, ease: EASE } }}
          className="text-sm sm:text-base text-neutral-400 font-medium leading-relaxed max-w-md"
        >
          {project.description}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// Client credit, kept separate so it can be pinned to the bottom-left of the
// sticky panel instead of flowing inline under the description.
export function PortfolioClientTag({ project }: { project: Project }) {
  const initials = project.client.charAt(0).toUpperCase();

  return (
    <div className="overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex items-center gap-3"
        >
          {project.logo ? (
            <div className="w-10 h-10 shrink-0 rounded-sm overflow-hidden bg-white flex items-center justify-center p-1.5">
              <img src={project.logo} alt="" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div
              className="w-10 h-10 shrink-0 rounded-sm flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: project.primaryColor }}
            >
              {initials}
            </div>
          )}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Client</p>
            <p className="text-sm font-semibold text-white">{project.client}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
