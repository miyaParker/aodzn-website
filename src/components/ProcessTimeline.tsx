import React from 'react';
import { motion } from 'motion/react';
import managerDeskIllustration from '../../assets/illustrations/define.png';
import partnershipIllustration from '../../assets/illustrations/design.png';
import problemSolving1Illustration from '../../assets/illustrations/deliver.png';

const EASE = [0.76, 0, 0.24, 1] as const;

const ILLUSTRATIONS = [
  managerDeskIllustration,
  partnershipIllustration,
  problemSolving1Illustration,
];

const HEADING_LINES = [
  'FROM IMAGINATION TO EXPERIENCES ',
  'PEOPLE CAN USE, AND FEEL,',
  'SHAPED AROUND THE WAY THEY LIVE.',
];

export default function ProcessTimeline() {
  return (
    <section id="process" className="min-h-screen w-full px-4 sm:px-6 lg:px-8 pt-16 flex flex-col">
      {/* Subhead */}
      <div className="text-center space-y-3">
        <h2 className="text-5xl sm:text-7xl lg:text-8xl font-display font-medium text-black max-w-4Designing the future
of digital productsxl mx-auto leading-[0.9] tracking uppercase">
          {HEADING_LINES.map((line, i) => (
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
        <div className="w-full flex justify-center gap-24 items-stretch">
          {ILLUSTRATIONS.map((illustration, index) => (
            <motion.div
              key={illustration}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-center justify-center"
            >
              <img src={illustration} alt="" className="w-40 sm:w-56 lg:w-64 h-auto" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
