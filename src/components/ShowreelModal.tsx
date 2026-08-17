'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Sparkles } from 'lucide-react';

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShowreelModal({ isOpen, onClose }: ShowreelModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 lg:p-12"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl rounded-sm overflow-hidden bg-neutral-950 space-y-4"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-800 text-white">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-[20px] bg-[#04a3cc] animate-ping" />
              <span className="font-syne font-bold text-sm tracking-wide">
                AODZN — CREATIVE SHOWREEL 2026
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-sm bg-neutral-800 hover:bg-white hover:text-black transition-colors"
              aria-label="Close Showreel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Container */}
          <div className="relative aspect-16/9 w-full bg-black flex items-center justify-center overflow-hidden">
            {/* High Definition Sample Video or Canvas Reel */}
            <video
              autoPlay
              loop
              muted={isMuted}
              playsInline
              poster="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"
              className="w-full h-full object-cover"
              src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* Video Controls Overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white bg-black/60 backdrop-blur-md px-6 py-3 rounded-sm">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-sm bg-white text-black hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <div className="text-xs font-mono">
                  <span>00:42</span> / <span className="text-neutral-400">01:24</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="hidden sm:block flex-1 mx-8 h-1 bg-white/20 rounded-sm overflow-hidden">
                <div className="w-1/2 h-full bg-[#04a3cc] rounded-sm" />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-sm hover:bg-white/10 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button className="p-2 rounded-sm hover:bg-white/10 transition-colors">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}