'use client';

import React from 'react';
import { motion } from 'motion/react';

const EASE = [0.76, 0, 0.24, 1] as const;

// Four scale tiers covering every sticker on the site today, from the
// small floating bio tags to Hero's word-sized pills — each tier is
// itself responsive, so a single `size` choice is all a caller needs
// for the tag to behave well from mobile up through desktop.
const SIZE_STYLES = {
  xs: 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm lg:text-base',
  sm: 'px-3 sm:px-4 py-1.5 sm:py-2 text-lg sm:text-xl lg:text-2xl',
  md: 'px-4 sm:px-5 py-1.5 sm:py-2 text-2xl sm:text-3xl lg:text-4xl',
  lg: 'px-4 sm:px-5 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 text-sm sm:text-3xl lg:text-4xl',
} as const;

export type TagSize = keyof typeof SIZE_STYLES;

interface TagProps {
  children: React.ReactNode;
  /** Background color — hex or any valid CSS color value. */
  bgColor: string;
  textColor?: string;
  size?: TagSize;
  /** Resting rotation in degrees once the entrance animation settles. */
  rotate?: number;
  /**
   * Starting rotation for the "spin in" entrance. Defaults to a steeper
   * angle on the same side as `rotate`; pass the same value as `rotate`
   * to opt out of the spin and just fade/scale in.
   */
  initialRotate?: number;
  hoverRotate?: number;
  /** Entrance delay in seconds. */
  delay?: number;
  /**
   * 'mount' (default) plays once the component renders, gated by
   * `visible` if that's provided — use this for choreographed reveals
   * tied to a parent's own ready state. 'inView' instead plays the
   * first time the tag scrolls into the viewport.
   */
  trigger?: 'mount' | 'inView';
  /** Only relevant for trigger="mount" — lets a parent hold the tag in
   *  its hidden state until the rest of a sequence is ready. */
  visible?: boolean;
  /** Stack the continuous floating bob used for the About page's tags. */
  float?: boolean;
  /** Positioning classes (absolute/top/left/etc.) supplied by the caller
   *  — this component only owns the pill's own look and motion. */
  className?: string;
  /** Extra inline styles merged in alongside bg/text color — e.g. a
   *  caller's own top/left offsets or animation-delay. */
  style?: React.CSSProperties;
}

export default function Tag({
  children,
  bgColor,
  textColor = '#111111',
  size = 'md',
  rotate = -6,
  initialRotate,
  hoverRotate = 0,
  delay = 0,
  trigger = 'mount',
  visible = true,
  float = false,
  className = '',
  style,
}: TagProps) {
  const fromRotate = initialRotate ?? rotate + (rotate <= 0 ? -20 : 20);

  const shared = {
    'aria-hidden': true as const,
    whileHover: { rotate: hoverRotate, scale: 1.08 },
    style: { backgroundColor: bgColor, color: textColor, ...style },
    className: `${float ? 'animate-float ' : ''}inline-block rounded-sm font-display font-bold uppercase select-none cursor-default ${SIZE_STYLES[size]} ${className}`,
  };

  if (trigger === 'inView') {
    return (
      <motion.span
        {...shared}
        initial={{ opacity: 0, scale: 0.7, rotate: fromRotate }}
        whileInView={{ opacity: 1, scale: 1, rotate }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <motion.span
      {...shared}
      initial={{ opacity: 0, scale: 0.6, rotate: fromRotate }}
      animate={
        visible
          ? { opacity: 1, scale: 1, rotate }
          : { opacity: 0, scale: 0.6, rotate: fromRotate }
      }
      transition={{ duration: 0.7, ease: EASE, delay: visible ? delay : 0 }}
    >
      {children}
    </motion.span>
  );
}
