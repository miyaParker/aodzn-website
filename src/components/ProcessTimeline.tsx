'use client';

import React from 'react';
import { motion } from 'motion/react';
import { HomePageContent } from '../types';

const EASE = [0.76, 0, 0.24, 1] as const;

interface ProcessTimelineProps {
  content: HomePageContent['processTimeline'];
}

export default function ProcessTimeline({ content }: ProcessTimelineProps) {
  return (
    <section id="approach" className="min-h-screen w-full px-8 xl:px-16 pt-16 flex flex-col">
      {/* Subhead */}
      <div className="text-center space-y-3">
        <h2 className="text-5xl sm:text-7xl lg:text-8xl font-display font-medium text-black max-w-4xl mx-auto leading-[0.9] tracking uppercase">
          {content.headingLines.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '100%', opacity: 0 }}
                whileInView={{ y: '0%', opacity: 1 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.9, ease: EASE, delay: i * 0.15 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>
      </div>

      {/* Illustrations */}
      <div className="flex-1 flex items-center mt-12 sm:mt-16">
        <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12 lg:gap-24">
          {content.illustrations.map((illustration, index) => (
            <motion.div
              key={illustration}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-center justify-center shrink-0"
            >
              <img
                src={illustration}
                alt=""
                className="w-40 sm:w-56 lg:w-64 h-auto"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
