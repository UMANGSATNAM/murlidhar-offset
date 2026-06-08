'use client'

import React from 'react'
import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Design & File Prep',
    description:
      'Your artwork — or ours — checked for bleed, colour profile, fonts, and resolution. Print-ready files only.',
  },
  {
    number: '02',
    title: 'Proofing & Sign-Off',
    description:
      'Digital and (where the run requires it) physical proofs. Approved on paper, before plate.',
  },
  {
    number: '03',
    title: 'Press & Finishing',
    description:
      'Offset run with colour calibration, then through the chosen finishing line — coating, foil, emboss, die-cut.',
  },
  {
    number: '04',
    title: 'Quality Check & Dispatch',
    description:
      'Visual inspection, count verification, careful packing — and onward delivery to your door.',
  },
]

const stepVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.15,
    },
  }),
}

const lineVariant = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.4,
    },
  },
}

export default function PrintingProcess() {
  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ background: '#0B1628' }}
    >
      {/* Subtle top gold divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full opacity-[0.025]"
          style={{
            background: 'radial-gradient(circle, #C9A227 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#C9A227]/60" />
            <span
              className="text-xs font-semibold uppercase tracking-[0.25em]"
              style={{ color: '#C9A227' }}
            >
              Our Process
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#C9A227]/60" />
          </motion.div>

          {/* Heading */}
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", ui-serif, Georgia, serif',
              color: '#E2E8F0',
            }}
          >
            How We Work
          </h2>

          {/* Subheading */}
          <p
            className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed"
            style={{ color: '#94A3B8' }}
          >
            From file to finished piece, in four careful passes. Every project
            follows the same disciplined route — because the surprises that
            shouldn&apos;t happen on press, don&apos;t.
          </p>
        </motion.div>

        {/* Desktop timeline — horizontal */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-[32px] left-[12%] right-[12%] h-[2px] origin-left">
              <motion.div
                variants={lineVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="w-full h-full"
                style={{
                  background:
                    'linear-gradient(90deg, #C9A227, #D4B54E, #C9A227)',
                }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-4 gap-6 relative">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  custom={i}
                  variants={stepVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Numbered circle */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-6 relative z-10"
                    style={{
                      background: '#0B1628',
                      border: '2px solid #C9A227',
                      boxShadow: '0 0 20px rgba(201, 162, 39, 0.15)',
                    }}
                  >
                    <span
                      className="text-lg font-bold"
                      style={{
                        fontFamily: 'var(--font-display), "Playfair Display", ui-serif, Georgia, serif',
                        color: '#C9A227',
                      }}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{
                      fontFamily: 'var(--font-display), "Playfair Display", ui-serif, Georgia, serif',
                      color: '#E2E8F0',
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed max-w-[260px]"
                    style={{ color: '#94A3B8' }}
                  >
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile timeline — vertical */}
        <div className="md:hidden">
          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-[31px] top-0 bottom-0 w-[2px]">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full origin-top"
                style={{
                  background:
                    'linear-gradient(180deg, #C9A227, #D4B54E, #C9A227)',
                }}
              />
            </div>

            {/* Steps */}
            <div className="space-y-10">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  custom={i}
                  variants={stepVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-20px' }}
                  className="flex gap-5 relative"
                >
                  {/* Numbered circle */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 relative z-10"
                    style={{
                      background: '#0B1628',
                      border: '2px solid #C9A227',
                      boxShadow: '0 0 20px rgba(201, 162, 39, 0.15)',
                    }}
                  >
                    <span
                      className="text-lg font-bold"
                      style={{
                        fontFamily: 'var(--font-display), "Playfair Display", ui-serif, Georgia, serif',
                        color: '#C9A227',
                      }}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="pt-2">
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{
                        fontFamily: 'var(--font-display), "Playfair Display", ui-serif, Georgia, serif',
                        color: '#E2E8F0',
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: '#94A3B8' }}
                    >
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
