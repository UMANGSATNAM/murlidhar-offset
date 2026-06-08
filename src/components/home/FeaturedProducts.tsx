'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Camera } from 'lucide-react'

interface Project {
  title: string
  category: string
  gradient: string
  aspectClass: string
}

const projects: Project[] = [
  {
    title: 'Saffron & Gold Wedding Suite',
    category: 'Wedding · Foil',
    gradient: 'linear-gradient(135deg, #B45309 0%, #D97706 30%, #F59E0B 60%, #FBBF24 100%)',
    aspectClass: 'aspect-[3/4]',
  },
  {
    title: "Architect's Visiting Card",
    category: 'Stationery',
    gradient: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 40%, #3B82F6 70%, #60A5FA 100%)',
    aspectClass: 'aspect-[4/3]',
  },
  {
    title: 'Skincare Mono Carton',
    category: 'Packaging',
    gradient: 'linear-gradient(135deg, #065F46 0%, #059669 35%, #10B981 65%, #34D399 100%)',
    aspectClass: 'aspect-[3/4]',
  },
  {
    title: 'Jewellery Catalogue',
    category: 'Brochure',
    gradient: 'linear-gradient(135deg, #581C87 0%, #7C3AED 35%, #8B5CF6 65%, #A78BFA 100%)',
    aspectClass: 'aspect-[4/5]',
  },
  {
    title: 'Spot UV Brand Folder',
    category: 'Specialty',
    gradient: 'linear-gradient(135deg, #134E4A 0%, #0D9488 35%, #14B8A6 65%, #2DD4BF 100%)',
    aspectClass: 'aspect-[4/3]',
  },
  {
    title: 'Wellness Packaging Series',
    category: 'Pharmaceutical · Carton',
    gradient: 'linear-gradient(135deg, #78350F 0%, #B45309 30%, #D97706 60%, #F59E0B 100%)',
    aspectClass: 'aspect-[3/4]',
  },
  {
    title: 'Studio Annual Report',
    category: 'Binding',
    gradient: 'linear-gradient(135deg, #312E81 0%, #4338CA 35%, #6366F1 65%, #818CF8 100%)',
    aspectClass: 'aspect-[4/5]',
  },
  {
    title: 'Diwali Storefront Print',
    category: 'Festival Poster',
    gradient: 'linear-gradient(135deg, #9A3412 0%, #EA580C 30%, #F97316 60%, #FB923C 100%)',
    aspectClass: 'aspect-[4/3]',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
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
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function FeaturedProducts() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28" style={{ backgroundColor: '#0B1628' }}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, transparent, transparent 80px, #C9A227 80px, #C9A227 81px)',
          }}
        />
        <div className="absolute top-1/3 right-0 w-72 h-72 rounded-full bg-[#C9A227]/[0.02] blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-64 h-64 rounded-full bg-[#C9A227]/[0.02] blur-3xl" />
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
              <Camera className="size-3.5" />
              From Our Floor
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#C9A227]/60" />
          </motion.div>

          {/* Main heading */}
          <motion.h2
            variants={fadeUpVariant}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-display)] text-[#E2E8F0] mb-4"
          >
            Recent{' '}
            <span className="italic bg-gradient-to-r from-[#C9A227] via-[#E8CC6E] to-[#C9A227] bg-clip-text text-transparent">
              Work
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
            A few things we&apos;ve made recently. A small selection from our floor — packaging, stationery, weddings, brochures.
          </motion.p>
        </div>

        {/* Project cards masonry grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={cardVariant}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group cursor-pointer"
            >
              <div
                className={`${project.aspectClass} relative rounded-xl overflow-hidden border border-[#1E3048]/60 transition-all duration-500 group-hover:border-[#C9A227]/30`}
              >
                {/* Gradient placeholder background */}
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                  style={{ background: project.gradient }}
                />

                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-[#0B1628]/0 group-hover:bg-[#0B1628]/20 transition-colors duration-500" />

                {/* Bottom gradient for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0B1628]/80 via-[#0B1628]/40 to-transparent" />

                {/* Content overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  {/* Category label */}
                  <span className="inline-block text-[#C9A227] text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-1.5 sm:mb-2">
                    {project.category}
                  </span>
                  {/* Title */}
                  <h3 className="text-white text-sm sm:text-base font-semibold font-[family-name:var(--font-display)] leading-snug line-clamp-2 group-hover:text-[#E2E8F0] transition-colors duration-300">
                    {project.title}
                  </h3>
                </div>

                {/* Gold border glow on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 20px rgba(201, 162, 39, 0.08), 0 0 20px rgba(201, 162, 39, 0.05)',
                  }}
                />
              </div>
            </motion.div>
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
