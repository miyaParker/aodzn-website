'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';

export default function CustomCursor() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'video' | 'view' | 'drag'>('default');
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only activate on devices with mouse pointing capabilities
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });

      // Check hovered element data attribute or interactive class
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const mode = cursorTarget.getAttribute('data-cursor');
        const text = cursorTarget.getAttribute('data-cursor-text') || '';
        
        if (mode === 'video') {
          setCursorVariant('video');
          setCursorText(text || 'PLAY');
        } else if (mode === 'view') {
          setCursorVariant('view');
          setCursorText(text || 'VIEW');
        } else if (mode === 'drag') {
          setCursorVariant('drag');
          setCursorText(text || 'SWIPE');
        } else {
          setCursorVariant('hover');
          setCursorText(text);
        }
      } else if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setCursorVariant('hover');
        setCursorText('');
      } else {
        setCursorVariant('default');
        setCursorText('');
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  const variants = {
    default: {
      width: 14,
      height: 14,
      backgroundColor: '#111111',
      border: '0px solid transparent',
      mixBlendMode: 'difference' as const,
    },
    hover: {
      width: 50,
      height: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      mixBlendMode: 'difference' as const,
    },
    video: {
      width: 70,
      height: 70,
      backgroundColor: '#04a3cc',
      color: '#FFFFFF',
      mixBlendMode: 'normal' as const,
    },
    view: {
      width: 76,
      height: 76,
      backgroundColor: '#04a3cc',
      color: '#FFFFFF',
      mixBlendMode: 'normal' as const,
    },
    drag: {
      width: 64,
      height: 64,
      backgroundColor: '#04a3cc',
      color: '#FFFFFF',
      mixBlendMode: 'normal' as const,
    },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 rounded-full flex items-center justify-center font-bold text-xs uppercase tracking-wider text-center backdrop-blur-xs"
      animate={{
        x: cursorPos.x - (variants[cursorVariant]?.width || 14) / 2,
        y: cursorPos.y - (variants[cursorVariant]?.height || 14) / 2,
        width: variants[cursorVariant]?.width,
        height: variants[cursorVariant]?.height,
        backgroundColor: variants[cursorVariant]?.backgroundColor,
        color: cursorVariant !== 'default' && cursorVariant !== 'hover' ? '#FFFFFF' : '#000000',
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 350,
        mass: 0.2,
      }}
      style={{
        mixBlendMode: variants[cursorVariant]?.mixBlendMode,
      }}
    >
      {cursorText && (
        <span className="animate-fade-in font-syne font-bold tracking-widest text-[10px] select-none">
          {cursorText}
        </span>
      )}
    </motion.div>
  );
}