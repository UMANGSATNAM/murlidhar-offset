'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Palette, Clock, Layers } from 'lucide-react'

const valueCards = [
  {
    icon: CheckCircle,
    title: 'Print-Ready Standard',
    description:
      'Every file is inspected, profiled and proofed before plate. No surprises on press.',
  },
  {
    icon: Palette,
    title: 'Craft Finishing',
    description:
      'Foil, emboss, spot UV — applied with the patience these techniques deserve.',
  },
  {
    icon: Clock,
    title: 'Honest Timelines',
    description:
      'We commit only to what the press can deliver. Then we deliver early when we can.',
  },
  {
    icon: Layers,
    title: 'Substrate Range',
    description:
      'Standard paper, board, MetPet, and certain plastics — printed with the right ink for the surface.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

const fadeUpVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function WhyChooseUs() {
  return (
    <section
      className="relative py-20 md:py-28 lg:py-32 overflow-hidden"
      style={{ backgroundColor: '#0B1628' }}
    >
      {/* Subtle background pattern — diagonal lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #C9A227 0, #C9A227 1px, transparent 1px, transparent 32px)',
        }}
      />

      {/* Radial gold glow — top left */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none">
        <div
          className="w-full h-full rounded-full"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(201,162,39,0.06) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Radial gold glow — bottom right */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] pointer-events-none">
        <div
          className="w-full h-full rounded-full"
          style={{
            background:
              'radial-gradient(circle at 70% 70%, rgba(201,162,39,0.04) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Opening Quote */}
        <motion.div variants={fadeUpVariant} className="text-center mb-14 md:mb-20">
          <blockquote
            className="font-[family-name:var(--font-display)] text-base sm:text-lg md:text-xl italic leading-relaxed max-w-3xl mx-auto"
            style={{ color: '#8899B3' }}
          >
            &ldquo;The press has a memory. Every machine remembers a story it has helped
            tell.&rdquo;
          </blockquote>
        </motion.div>

        {/* Two-column layout: text left, cards right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20">
          {/* Left column — Text content */}
          <motion.div variants={fadeUpVariant} className="flex flex-col justify-center">
            {/* Section heading */}
            <div className="mb-6">
              <motion.h2
                variants={fadeUpVariant}
                className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span style={{ color: '#E2E8F0' }}>Our </span>
                <span
                  style={{
                    background:
                      'linear-gradient(135deg, #C9A227 0%, #E8CC6E 50%, #C9A227 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Heritage
                </span>
              </motion.h2>

              {/* Gold accent line */}
              <motion.div
                variants={fadeUpVariant}
                className="mt-4 mb-6"
                style={{
                  height: '2px',
                  width: '64px',
                  background: 'linear-gradient(90deg, #C9A227, transparent)',
                }}
              />
            </div>

            {/* Subheading */}
            <motion.p
              variants={fadeUpVariant}
              className="text-lg sm:text-xl font-medium mb-6"
              style={{ color: '#94A3B8', fontFamily: 'var(--font-display)' }}
            >
              A printing house built on precision, paper &amp; patience.
            </motion.p>

            {/* Body text */}
            <motion.p
              variants={fadeUpVariant}
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: '#8899B3' }}
            >
              For Murlidhar Offset, printing isn&rsquo;t manufacturing — it&rsquo;s craft.
              Every job that leaves our floor passes through hands that understand paper grain,
              ink density, and the quiet difference between &ldquo;good enough&rdquo; and finished.
              From a saffron-stitched wedding invitation to a thousand-unit pharmaceutical
              carton run, we treat each piece with the same standard: it should look as
              considered in your hand as it did on the page.
            </motion.p>
          </motion.div>

          {/* Right column — Value cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {valueCards.map((card, index) => (
              <motion.div
                key={card.title}
                variants={cardVariant}
                whileHover={{
                  y: -4,
                  borderColor: 'rgba(201,162,39,0.35)',
                  transition: { duration: 0.3 },
                }}
                className="group relative p-5 md:p-6 rounded-xl transition-colors duration-300"
                style={{
                  backgroundColor: '#162032',
                  border: '1px solid rgba(30,48,72,0.7)',
                }}
              >
                {/* Gold icon */}
                <div
                  className="w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: 'rgba(201,162,39,0.12)',
                    border: '1px solid rgba(201,162,39,0.2)',
                  }}
                >
                  <card.icon
                    className="w-5 h-5 md:w-5.5 md:h-5.5"
                    style={{ color: '#C9A227' }}
                    strokeWidth={1.75}
                  />
                </div>

                {/* Card title */}
                <h3
                  className="text-base md:text-lg font-semibold mb-2 transition-colors duration-300"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: '#E2E8F0',
                  }}
                >
                  {card.title}
                </h3>

                {/* Card description */}
                <p
                  className="text-sm md:text-base leading-relaxed"
                  style={{ color: '#8899B3' }}
                >
                  {card.description}
                </p>

                {/* Subtle gold accent on hover — top border reveal */}
                <div
                  className="absolute top-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(201,162,39,0.5), transparent)',
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom decorative divider */}
        <motion.div
          variants={fadeUpVariant}
          className="mt-16 md:mt-24 mx-auto"
          style={{
            height: '1px',
            maxWidth: '200px',
            background:
              'linear-gradient(90deg, transparent, rgba(201,162,39,0.3), transparent)',
          }}
        />
      </motion.div>
    </section>
  )
}
