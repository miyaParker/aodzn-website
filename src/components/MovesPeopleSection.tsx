'use client';

import React from 'react';
import { motion } from 'motion/react';
const EASE = [0.76, 0, 0.24, 1] as const;
const ACCENT_LIGHT = '#4fc3de'; // a shade lighter than the site's #04a3cc accent

export default function MovesPeopleSection() {
  return (
    <section className="relative w-full">
      <div
        className="h-screen w-full flex items-center justify-center px-6 sm:px-10 lg:px-16 overflow-hidden"
        style={{ backgroundColor: '#F6F6F4' }}
      >
        <h2
          className="font-display font-medium uppercase leading-[0.9] text-7xl sm:text-9xl lg:text-[10rem] text-center text-black"
        >
          <span className="block overflow-hidden">
            <motion.span
              className="block leading-[90%]"
              initial={{ y: '100%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              I Create designs
            </motion.span>
          </span>

          <motion.div
            className="flex items-center justify-center overflow-hidden"
            initial={{ height: 0 }}
            whileInView={{ height: 'auto' }}
            viewport={{ once: true, margin: '0px 0px -25% 0px' }}
            transition={{ type: 'spring', stiffness: 190, damping: 13, mass: 1, delay: 0.9 }}
          >
            <span
              className="block text-8xl sm:text-[12rem] lg:text-[16rem] leading-[90%]"
              style={{ color: ACCENT_LIGHT }}
            >
              Impossible
            </span>
          </motion.div>

          <span className="block overflow-hidden">
            <motion.span
              className="block leading-[90%"
              initial={{ y: '100%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              to ignore.
            </motion.span>
          </span>
        </h2>
      </div>
    </section>
  );
}