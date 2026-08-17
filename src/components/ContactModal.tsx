'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { createRipple } from '../lib/animations';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Mobile App',
    budget: '$15k - $30k',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after 3s
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    }, 500);
  };

  const projectTypes = ['Mobile App', 'Design System', 'Full Product UI/UX', 'Strategy & Audit'];
  const budgets = ['$10k - $20k', '$20k - $40k', '$40k - $80k', '$80k+'];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white text-black rounded-sm max-w-2xl w-full p-6 sm:p-10 my-auto overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-sm bg-neutral-100 hover:bg-black hover:text-white transition-colors"
            aria-label="Close Contact Modal"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-sm bg-[#04a3cc]/20 text-[#04a3cc] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-display font-medium uppercase text-black">
                MESSAGE SENT SUCCESSFULLY!
              </h3>
              <p className="text-sm text-neutral-600 font-medium max-w-md mx-auto">
                Thank you, {formData.name || 'friend'}. Abdulazees will review your project brief and respond within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-sm bg-[#04a3cc]/10 text-[#04a3cc] text-[11px] font-mono font-bold uppercase tracking-wider">
                  START A CONVERSATION
                </span>
                <h3 className="text-3xl font-display font-medium uppercase text-black">
                  LET'S DISCUSS YOUR PROJECT
                </h3>
                <p className="text-xs text-neutral-500 font-medium">
                  Fill out the quick brief below or email directly at{' '}
                  <a href="mailto:abdulazees@aodzn.com" className="text-black font-bold underline">
                    abdulazees@aodzn.com
                  </a>
                </p>
              </div>

              {/* Project Type Picker */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-neutral-500">
                  Project Scope / Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {projectTypes.map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setFormData({ ...formData, projectType: type })}
                      className={`p-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all border ${
                        formData.projectType === type
                          ? 'bg-black text-white border-black'
                          : 'bg-[#F6F6F4] text-neutral-700 border-black/5 hover:border-black/20'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range Picker */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-neutral-500">
                  Target Budget (USD)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {budgets.map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setFormData({ ...formData, budget: b })}
                      className={`p-2 rounded-sm text-xs font-mono font-bold transition-all border ${
                        formData.budget === b
                          ? 'bg-[#04a3cc] text-white border-[#04a3cc]'
                          : 'bg-[#F6F6F4] text-neutral-700 border-black/5 hover:border-black/20'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-neutral-500">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-sm bg-[#F6F6F4] border border-black/10 focus:outline-none focus:border-black text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-neutral-500">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-sm bg-[#F6F6F4] border border-black/10 focus:outline-none focus:border-black text-xs font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-neutral-500">
                  Project Overview & Timeline
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about your product goals, target launch date, or key challenges..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-sm bg-[#F6F6F4] border border-black/10 focus:outline-none focus:border-black text-xs font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                onClick={(e) => createRipple(e)}
                className="w-full py-4 rounded-sm bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 ripple-container"
              >
                <span>SEND INQUIRY</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}