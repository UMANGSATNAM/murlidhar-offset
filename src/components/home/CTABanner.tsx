'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ShoppingBag, Pill, Heart, Briefcase, Store, Flame } from 'lucide-react'

const industries = [
  {
    number: '01',
    title: 'FMCG & Beauty',
    description: 'Mono cartons, labels, dispenser sleeves and shelf-ready packaging for fast-moving brands.',
    icon: ShoppingBag,
  },
  {
    number: '02',
    title: 'Pharmaceutical',
    description: 'Compliant cartons, leaflet inserts, batch-printed labels and tamper-evident packaging.',
    icon: Pill,
  },
  {
    number: '03',
    title: 'Weddings & Events',
    description: 'Multilingual wedding cards, save-the-dates, RSVPs and event collateral — foil, emboss, laser-cut.',
    icon: Heart,
  },
  {
    number: '04',
    title: 'Corporate & Finance',
    description: 'Annual reports, identity stationery, presentation folders and conference collateral.',
    icon: Briefcase,
  },
  {
    number: '05',
    title: 'Retail & D2C',
    description: 'Hangtags, lookbooks, dispatch boxes, paper bags and seasonal campaign posters.',
    icon: Store,
  },
  {
    number: '06',
    title: 'Festival & Religious',
    description: 'Diwali, Navratri and temple-trust posters, calendars, panchang and prasad packaging.',
    icon: Flame,
  },
]

const stats = [
  { value: '25+', label: 'Print Categories' },
  { value: '1K+', label: 'Projects Delivered' },
  { value: '200+', label: 'Brand Partners' },
  { value: '100%', label: 'In-House Production' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const fadeUpVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28" style={{ backgroundColor: '#0B1628' }}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent, transparent 80px, #C9A227 80px, #C9A227 81px)',
          }}
        />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#C9A227]/[0.03] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#C9A227]/[0.02] blur-3xl" />
      </div>

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 ink-line" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section header */}
        <div className="text-center mb-14 sm:mb-16">
          {/* Gold label */}
          <motion.div variants={fadeUpVariant} className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#C9A227]/60" />
            <span className="text-[#C9A227] text-xs font-semibold uppercase tracking-[0.2em] flex items-center gap-1.5">
              <Sparkles className="size-3.5" />
              Industries We Serve
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#C9A227]/60" />
          </motion.div>

          {/* Main heading */}
          <motion.h2
            variants={fadeUpVariant}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-display)] text-[#E2E8F0] mb-4"
          >
            Who We Print{' '}
            <span className="italic bg-gradient-to-r from-[#C9A227] via-[#E8CC6E] to-[#C9A227] bg-clip-text text-transparent">
              For
            </span>
          </motion.h2>

          {/* Gold accent line */}
          <motion.div variants={fadeUpVariant} className="flex justify-center mb-6">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent" />
          </motion.div>

          {/* Subheading */}
          <motion.p
            variants={fadeUpVariant}
            className="text-[#94A3B8] text-base sm:text-lg max-w-3xl mx-auto leading-relaxed"
          >
            Trusted by businesses across every shelf. Our press has run jobs for FMCG launches, family weddings,
            hospital networks, festival shopkeepers and D2C founders. The standard is the same for all of them.
          </motion.p>
        </div>

        {/* Industry cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-14 sm:mb-16">
          {industries.map((industry) => {
            const Icon = industry.icon
            return (
              <motion.div
                key={industry.number}
                variants={cardVariant}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="group relative overflow-hidden rounded-xl p-5 sm:p-6 border-l-[3px] border-l-[#C9A227] transition-all duration-300"
                style={{
                  backgroundColor: '#162032',
                  borderRight: '1px solid rgba(30, 48, 72, 0.6)',
                  borderTop: '1px solid rgba(30, 48, 72, 0.6)',
                  borderBottom: '1px solid rgba(30, 48, 72, 0.6)',
                }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at left center, rgba(201,162,39,0.06) 0%, transparent 70%)',
                  }}
                />

                <div className="relative">
                  {/* Number + Icon row */}
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[#C9A227]/20 text-5xl sm:text-6xl font-bold font-[family-name:var(--font-display)] leading-none select-none">
                      {industry.number}
                    </span>
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-300"
                      style={{
                        backgroundColor: 'rgba(30, 48, 72, 0.6)',
                      }}
                    >
                      <Icon className="size-4.5 text-[#94A3B8] group-hover:text-[#C9A227] transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-[#E2E8F0] text-lg font-semibold font-[family-name:var(--font-display)] mb-2 group-hover:text-white transition-colors duration-300">
                    {industry.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#64748B] text-sm leading-relaxed">
                    {industry.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Stats row */}
        <motion.div
          variants={fadeUpVariant}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center py-4 px-3 rounded-xl border border-[#1E3048]/60 transition-colors duration-300 hover:border-[#C9A227]/30"
              style={{ backgroundColor: 'rgba(22, 32, 50, 0.5)' }}
            >
              <div className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-display)] bg-gradient-to-r from-[#C9A227] to-[#E8CC6E] bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-[#64748B] text-xs sm:text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Bottom accent */}
        <div className="flex justify-center mt-14 sm:mt-16">
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#C9A227]/30 to-transparent" />
        </div>
      </motion.div>
    </section>
  )
}
