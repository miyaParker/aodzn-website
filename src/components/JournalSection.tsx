import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { JOURNAL_ARTICLES } from '../data/journalData';

const EASE = [0.76, 0, 0.24, 1] as const;
const PREVIEW_HEIGHT = 200;
const PREVIEW_WIDTH_MIN = 180;
const PREVIEW_WIDTH_MAX = 300;

interface PreviewRect {
  top: number;
  left: number;
  width: number;
}

export default function JournalSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewRect, setPreviewRect] = useState<PreviewRect | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // One ref per row, pointing at the flex-1 spacer that fills whatever gap
  // is left between that row's title and its date — the box measures this
  // directly rather than guessing a fixed offset, so it lands correctly
  // whether the title is long or short.
  const anchorRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const hovered = JOURNAL_ARTICLES.find((article) => article.id === hoveredId) ?? null;

  const showPreview = (id: string, index: number) => {
    setHoveredId(id);
    const anchor = anchorRefs.current[index];
    const list = listRef.current;
    if (!anchor || !list) return;
    const anchorBox = anchor.getBoundingClientRect();
    const listBox = list.getBoundingClientRect();
    const width = Math.max(PREVIEW_WIDTH_MIN, Math.min(PREVIEW_WIDTH_MAX, anchorBox.width - 24));
    setPreviewRect({
      top: anchorBox.top - listBox.top + anchorBox.height / 2 - PREVIEW_HEIGHT / 2,
      left: anchorBox.left - listBox.left + (anchorBox.width - width) / 2,
      width,
    });
  };

  const clearIfCurrent = (id: string) => setHoveredId((current) => (current === id ? null : current));

  return (
    <section id="journal" className="relative w-full bg-black text-white border-t" style={{ borderColor: '#737373' }}>
      <div className="px-6 sm:px-10 lg:px-16 pt-24 sm:pt-32 pb-24 sm:pb-32">
        <motion.p
          className="text-sm text-neutral-400 uppercase tracking-widest mb-6"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          Latest Writing
        </motion.p>
        <h2 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-none overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: '100%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            Journal
          </motion.span>
        </h2>

        <div ref={listRef} className="relative mt-14 sm:mt-20 border-t border-white/10">
          {JOURNAL_ARTICLES.map((article, index) => (
            <div
              key={article.id}
              tabIndex={0}
              data-cursor="view"
              data-cursor-text="READ"
              onMouseEnter={() => showPreview(article.id, index)}
              onMouseLeave={() => clearIfCurrent(article.id)}
              onFocus={() => showPreview(article.id, index)}
              onBlur={() => clearIfCurrent(article.id)}
              className="group flex items-center border-b border-white/10 px-2 sm:px-4 py-6 sm:py-8 cursor-pointer transition-colors duration-300 hover:bg-white/[0.04] outline-none focus-visible:bg-white/[0.04]"
            >
              <div className="flex items-center gap-4 sm:gap-5 min-w-0 shrink-0 max-w-[55%] sm:max-w-[45%]">
                <div
                  aria-hidden="true"
                  className="hidden sm:block w-12 h-12 shrink-0 rounded-sm"
                  style={{ background: article.gradient }}
                />
                <span className="text-lg sm:text-xl lg:text-2xl font-medium tracking-tighter text-neutral-300 group-hover:text-white transition-colors truncate">
                  {article.title}
                </span>
              </div>

              <span
                ref={(el) => { anchorRefs.current[index] = el; }}
                aria-hidden="true"
                className="flex-1 min-w-8 self-stretch"
              />

              <div className="flex items-center gap-5 sm:gap-10 shrink-0">
                <span className="hidden sm:block text-xs tracking-widest text-neutral-500 uppercase">
                  {article.date}
                </span>
                <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-black flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#04a3cc] group-hover:text-white">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}

          {/* Hover preview: slides to sit in the gap between whichever row's
              title and date is currently hovered/focused; content crossfades
              independently so switching rows reads as one box sliding, not a
              new box popping in each time. */}
          <div className="hidden lg:block pointer-events-none absolute inset-0 z-10">
            <AnimatePresence>
              {hovered && previewRect && (
                <motion.div
                  key="journal-preview"
                  initial={{ opacity: 0, scale: 0.94, top: previewRect.top, left: previewRect.left, width: previewRect.width }}
                  animate={{ opacity: 1, scale: 1, top: previewRect.top, left: previewRect.left, width: previewRect.width }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="absolute rounded-md overflow-hidden shadow-2xl shadow-black/60"
                  style={{ height: PREVIEW_HEIGHT }}
                >
                  <AnimatePresence>
                    <motion.div
                      key={hovered.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
                      style={{ background: hovered.gradient }}
                    >
                      <p className="font-display text-xl xl:text-2xl leading-snug text-white">{hovered.previewTitle}</p>
                      <p className="mt-2 text-sm text-white/70">{hovered.previewSubtitle}</p>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
