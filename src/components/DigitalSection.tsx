import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Code, Search, Sparkles, Check } from 'lucide-react';

export default function DigitalSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="digital"
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/10 overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Digital Architecture Card */}
        <div className="order-2 lg:order-1 lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-md bg-white p-8 flex flex-col justify-between overflow-hidden">
            {/* Code Node Graphic */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3.5 rounded-sm bg-[#F6F6F4]">
                <div className="w-9 h-9 rounded-sm bg-[#04a3cc] text-white flex items-center justify-center font-bold">
                  <Code className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold font-syne text-black">React & TypeScript Architecture</h4>
                  <p className="text-[11px] text-neutral-500">Modular component tokens</p>
                </div>
                <Check className="w-4 h-4 text-[#04a3cc]" />
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-sm bg-[#F6F6F4]">
                <div className="w-9 h-9 rounded-sm bg-[#04a3cc] text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold font-syne text-black">GSAP & Motion Physics</h4>
                  <p className="text-[11px] text-neutral-500">60fps frame rate pipeline</p>
                </div>
                <Check className="w-4 h-4 text-[#04a3cc]" />
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-sm bg-[#F6F6F4]">
                <div className="w-9 h-9 rounded-sm bg-[#04a3cc] text-white flex items-center justify-center font-bold">
                  <Search className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold font-syne text-black">Micro-interactions & UX</h4>
                  <p className="text-[11px] text-neutral-500">WCAG AA accessible contrast</p>
                </div>
                <Check className="w-4 h-4 text-[#04a3cc]" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Text & Header */}
        <div className="order-1 lg:order-2 lg:col-span-6 space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl sm:text-6xl font-display font-medium uppercase text-black leading-[0.9]">
            FROM ROUGH IDEAS TO REFINED EXPERIENCES.
            </h2>
            <motion.span
              whileHover={{ rotate: -8, scale: 1.1 }}
              className="inline-block px-3 py-1 rounded-sm bg-[#04a3cc] text-white font-mono font-bold text-xs uppercase tracking-widest transform rotate-6 cursor-pointer shrink-0"
            >
              DIGITAL
            </motion.span>
          </div>

          <p className="text-lg sm:text-xl text-neutral-700 font-medium leading-relaxed max-w-lg">
            I design and build intuitive, accessible products that not only{' '}
            <span className="text-black font-bold underline decoration-[#04a3cc] decoration-3">
              look good
            </span>{' '}
            but{' '}
            <span className="text-black font-bold underline decoration-[#04a3cc] decoration-3">
              work beautifully
            </span>
            .
          </p>

          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-3 text-sm font-semibold text-black">
              <span className="w-2 h-2 rounded-[20px] bg-[#04a3cc]" />
              <span>Pixel-perfect responsive design systems</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-black">
              <span className="w-2 h-2 rounded-[20px] bg-[#04a3cc]" />
              <span>Performance-optimized GSAP & Framer Motion pipelines</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-black">
              <span className="w-2 h-2 rounded-[20px] bg-[#04a3cc]" />
              <span>Fullstack developer handoff & React codebase architecture</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
