'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Layers, Sun, Shield, Scissors, BookOpen, FileText } from 'lucide-react'

const finishes = [
  {
    icon: Sparkles,
    title: 'Foil Stamping',
    description:
      'Gold, silver, rose-gold and holographic foils pressed onto paper with metallic luminosity. The signature of a wedding card or premium gift box.',
  },
  {
    icon: Layers,
    title: 'Embossing & Debossing',
    description:
      "Raised or recessed surfaces — felt before they're seen.",
  },
  {
    icon: Sun,
    title: 'UV Coating & Spot UV',
    description:
      'A high-gloss varnish that we apply as a full coat for protection or as spot UV to bring a logo, headline or pattern forward against a matte field.',
  },
  {
    icon: Shield,
    title: 'Lamination',
    description:
      'Matte, gloss, soft-touch and velvet finishes for protection and feel.',
  },
  {
    icon: Scissors,
    title: 'Die-Cutting',
    description:
      'Custom shapes, windows and intricate cut-outs for cards and packaging.',
  },
  {
    icon: BookOpen,
    title: 'Binding & Assembly',
    description:
      'Spiral, perfect, saddle-stitch and case binding — plus folding, scoring, gluing and assembly. The unseen craft that holds a finished piece together.',
  },
  {
    icon: FileText,
    title: 'Specialty Substrates',
    description:
      'Cardboard, MetPet, Kraft, textured papers and select plastics — printed with the right ink chemistry.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function TestimonialsSection() {
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
          className="absolute top-1/4 left-0 w-96 h-96 rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, #C9A227 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full opacity-[0.03]"
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
              What Sets Us Apart
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
            Specialty Finishes
          </h2>

          {/* Subheading */}
          <p
            className="text-base md:text-lg max-w-3xl mx-auto mb-3 leading-relaxed"
            style={{ color: '#94A3B8' }}
          >
            The treatments that turn print into an experience. A piece of paper
            holds attention for one second longer when it has weight, sheen, and
            texture.
          </p>
          <p
            className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed"
            style={{ color: '#94A3B8' }}
          >
            These are the techniques we use to earn that second.
          </p>
        </motion.div>

        {/* Finish cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {finishes.map((finish) => (
            <motion.div
              key={finish.title}
              variants={cardVariant}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="group relative rounded-xl p-6 md:p-7 transition-all duration-300 cursor-default"
              style={{
                background: '#162032',
                border: '1px solid rgba(30, 48, 72, 0.6)',
              }}
            >
              {/* Hover gold border glow */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{
                  boxShadow:
                    '0 0 20px rgba(201, 162, 39, 0.08), inset 0 0 20px rgba(201, 162, 39, 0.02)',
                  border: '1px solid rgba(201, 162, 39, 0.3)',
                }}
              />

              {/* Icon */}
              <div className="mb-4 relative z-10">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(201, 162, 39, 0.1)' }}
                >
                  <finish.icon
                    className="size-5"
                    style={{ color: '#C9A227' }}
                  />
                </div>
              </div>

              {/* Title */}
              <h3
                className="text-lg font-bold mb-2 relative z-10"
                style={{
                  fontFamily:
                    'var(--font-display), "Playfair Display", ui-serif, Georgia, serif',
                  color: '#E2E8F0',
                }}
              >
                {finish.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm leading-relaxed relative z-10"
                style={{ color: '#94A3B8' }}
              >
                {finish.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
