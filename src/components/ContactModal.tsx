'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, ChevronLeft, ArrowRight, Check } from 'lucide-react';
import { createRipple } from '../lib/animations';
import { HomePageContent, SiteSettings } from '../types';

const EASE = [0.76, 0, 0.24, 1] as const;

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: HomePageContent['contactModal'];
  projectContactEmail: SiteSettings['projectContactEmail'];
}

// Four bite-sized steps rather than one long form — each screen asks a
// single question, mirroring how the mega menu presents one dark panel
// with a handful of large, unhurried choices instead of a dense list.
const STEPS = ['scope', 'details', 'message', 'summary'] as const;
type Step = (typeof STEPS)[number];

// A full-width, generously spaced row with a checkbox indicator — the
// scope choices read as a short questionnaire list rather than a tight
// grid of pills.
function ChoiceRow({
  label,
  active,
  activeFillClass,
  checkColorClass = 'text-black',
  onClick,
}: {
  label: string;
  active: boolean;
  activeFillClass: string;
  checkColorClass?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-5 sm:p-6 rounded-lg text-left transition-all border ${
        active ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
    >
      <span
        className={`shrink-0 w-5 h-5 rounded-sm border flex items-center justify-center transition-colors ${
          active ? `${activeFillClass} border-transparent` : 'border-white/30'
        }`}
      >
        {active && <Check className={`w-3.5 h-3.5 ${checkColorClass}`} strokeWidth={3} />}
      </span>
      <span className="text-sm sm:text-base font-bold uppercase tracking-wide text-white">{label}</span>
    </button>
  );
}

// A read-only review row for the summary step — shows what was entered
// for one earlier question, with a jump-back link to fix it.
function SummaryRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="w-full flex items-start justify-between gap-4 p-5 rounded-lg bg-white/5 border border-white/10">
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase text-white/40">{label}</p>
        <p className="text-sm sm:text-base font-medium text-white mt-1 break-words">{value || '—'}</p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-white/50 hover:text-white transition-colors"
      >
        Edit
      </button>
    </div>
  );
}

export default function ContactModal({ isOpen, onClose, content, projectContactEmail }: ContactModalProps) {
  const projectTypes = content.projectTypes;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    address: '',
    projectType: projectTypes[0] ?? '',
    message: '',
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Land back on the first question every time the modal is reopened,
  // rather than resuming wherever a previous session left off.
  useEffect(() => {
    if (isOpen) setStepIndex(0);
  }, [isOpen]);

  const step: Step = STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEPS.length - 1;

  const isValidEmail = /\S+@\S+\.\S+/.test(formData.email);
  const canAdvance =
    step === 'scope' ? Boolean(formData.projectType) :
    step === 'details' ? formData.name.trim() !== '' && isValidEmail :
    step === 'message' ? formData.message.trim() !== '' :
    true;

  const goNext = () => {
    if (!canAdvance || isLastStep) return;
    setStepIndex((i) => i + 1);
  };

  const goBack = () => {
    if (isFirstStep) return;
    setStepIndex((i) => i - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAdvance) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 6000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.button
          key="contact-scrim"
          aria-label="Close Contact Modal"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="fixed inset-0 z-50 bg-black/10 backdrop-blur-md cursor-default"
        />
      )}

      {isOpen && (
      <motion.div
        key="contact-panel"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 24 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="fixed z-50 top-24 sm:top-28 right-4 sm:right-6 bottom-4 sm:bottom-6 w-[calc(100%-2rem)] sm:w-[420px] lg:w-[460px] rounded-2xl sm:rounded-3xl bg-black text-white shadow-2xl overflow-hidden"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="relative h-full flex flex-col p-6 sm:p-8 lg:p-10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-colors"
            aria-label="Close Contact Modal"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#04a3cc]/20 text-[#04a3cc] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-display font-medium uppercase text-4xl sm:text-5xl leading-tight text-white">
                {content.successHeading}
              </h3>
              <p className="text-sm text-white/60 font-medium max-w-md mx-auto">
                {formData.name || 'friend'}, {content.successMessage}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              {/* Step progress — pinned to the top of the panel */}
              <div className="shrink-0 flex gap-2 pr-10 mb-8">
                {STEPS.map((s, i) => (
                  <div key={s} className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-white"
                      initial={false}
                      animate={{ width: i <= stepIndex ? '100%' : '0%' }}
                      transition={{ duration: 0.35, ease: EASE }}
                    />
                  </div>
                ))}
              </div>

              {/* Step content — the only region that scrolls, so the nav
                  footer below never shifts position between steps. */}
              <div className="flex-1 min-h-0 overflow-y-auto -mr-2 pr-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="space-y-8"
                >
                  {step === 'scope' && (
                    <div className="space-y-4">
                      <h3 className="font-display font-medium uppercase text-4xl sm:text-5xl leading-tight text-white">
                        {content.heading}
                      </h3>
                      <div className="space-y-4">
                        <p className="font-sans text-lg sm:text-xl text-white/70">
                          What would you like to do?
                        </p>
                        <div className="space-y-3 sm:space-y-4">
                          {projectTypes.map((type) => (
                            <ChoiceRow
                              key={type}
                              label={type}
                              active={formData.projectType === type}
                              activeFillClass="bg-white"
                              onClick={() => setFormData({ ...formData, projectType: type })}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 'details' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase text-white/40">
                          {content.nameLabel}
                        </label>
                        <input
                          type="text"
                          required
                          autoFocus
                          placeholder={content.namePlaceholder}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (formData.name.trim() !== '') goNext();
                            }
                          }}
                          className="w-full px-4 py-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white text-sm font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase text-white/40">
                          {content.emailLabel}
                        </label>
                        <input
                          type="email"
                          required
                          placeholder={content.emailPlaceholder}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (canAdvance) goNext();
                            }
                          }}
                          className="w-full px-4 py-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white text-sm font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase text-white/40">
                          Company Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Acme Studio"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (canAdvance) goNext();
                            }
                          }}
                          className="w-full px-4 py-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white text-sm font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase text-white/40">
                          Address
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 123 Main St, City"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (canAdvance) goNext();
                            }
                          }}
                          className="w-full px-4 py-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white text-sm font-medium"
                        />
                      </div>
                    </div>
                  )}

                  {step === 'message' && (
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase text-white/40">
                        {content.messageLabel}
                      </label>
                      <textarea
                        rows={8}
                        required
                        autoFocus
                        placeholder={content.messagePlaceholder}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white text-sm font-medium resize-none"
                      />
                    </div>
                  )}

                  {step === 'summary' && (
                    <div className="space-y-4">
                      <p className="font-sans text-lg sm:text-xl text-white/70">
                        Review your details
                      </p>
                      <div className="space-y-3">
                        <SummaryRow label={content.projectScopeLabel} value={formData.projectType} onEdit={() => setStepIndex(0)} />
                        <SummaryRow label={content.nameLabel} value={formData.name} onEdit={() => setStepIndex(1)} />
                        <SummaryRow label={content.emailLabel} value={formData.email} onEdit={() => setStepIndex(1)} />
                        <SummaryRow label="Company Name" value={formData.companyName} onEdit={() => setStepIndex(1)} />
                        <SummaryRow label="Address" value={formData.address} onEdit={() => setStepIndex(1)} />
                        <SummaryRow label={content.messageLabel} value={formData.message} onEdit={() => setStepIndex(2)} />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              </div>

              {/* Step navigation — pinned to the bottom of the panel */}
              <div className="shrink-0 flex items-center justify-between gap-4 border-t border-white/10 pt-6 mt-6">
                {isFirstStep ? (
                  <span />
                ) : (
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                )}

                {isLastStep ? (
                  <button
                    key="submit-btn"
                    type="submit"
                    disabled={!canAdvance}
                    onClick={(e) => canAdvance && createRipple(e)}
                    className="py-4 sm:py-5 px-8 sm:px-10 rounded-lg bg-white text-black text-sm font-bold uppercase tracking-wide hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 ripple-container"
                  >
                    <span>{content.submitLabel}</span>
                    <Send className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    key="next-btn"
                    type="button"
                    disabled={!canAdvance}
                    onClick={(e) => {
                      createRipple(e);
                      goNext();
                    }}
                    className="py-4 sm:py-5 px-8 sm:px-10 rounded-lg bg-white text-black text-sm font-bold uppercase tracking-wide hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 ripple-container"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
