'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, MessageCircle, Printer, Package, Award, CheckCircle2, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigationStore } from '@/lib/store'

const stats = [
  { value: '25+', label: 'Print Categories', icon: Layers },
  { value: '1000+', label: 'Projects Delivered', icon: Package },
  { value: 'Industry-Approved', label: 'FMCG · Pharma', icon: Award },
  { value: 'Premium', label: 'Offset Press', icon: Printer },
  { value: 'Included', label: 'Pre-press & Proofing', icon: CheckCircle2 },
]

const serviceBadges = [
  'Brochures',
  'Wedding Invitations',
  'Mono Cartons',
  'Foil Stamping',
  'Pharmaceutical Labels',
  'Festival Posters',
  'Annual Reports',
  'Spot UV',
  'Business Cards',
  'Flex Banners',
  'Letter Pads',
  'Stickers',
  'Bill Books',
  'Envelope Printing',
  'Danglers',
  'Catalogues',
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

const scaleInVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function HeroSection() {
  const { navigate } = useNavigationStore()

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col bg-[#0B1628]">
      {/* Subtle geometric line pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,162,39,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,162,39,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Subtle radial glow accents */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#C9A227]/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#C9A227]/[0.02] rounded-full blur-[100px] pointer-events-none" />

      {/* Main content area - centered */}
      <div className="relative flex-1 flex items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center py-20 md:py-28"
        >
          {/* Top badge */}
          <motion.div variants={fadeUpVariant} className="mb-8">
            <span className="inline-flex items-center gap-2 text-[#8899B3] text-xs sm:text-sm tracking-[0.2em] uppercase font-medium">
              <span className="w-8 h-px bg-[#C9A227]/40" />
              Established &amp; Trusted · Gujarat, India
              <span className="w-8 h-px bg-[#C9A227]/40" />
            </span>
          </motion.div>

          {/* Main heading - serif font with gold accents */}
          <motion.h1
            variants={fadeUpVariant}
            className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.25rem] leading-[1.2] sm:leading-[1.15] md:leading-[1.15] text-white mb-8 tracking-tight"
          >
            Where ink meets{' '}
            <span className="text-[#C9A227] italic">intention</span>,
            <br className="hidden sm:block" />
            {' '}and paper becomes a{' '}
            <span className="text-[#C9A227] italic">keepsake</span>.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUpVariant}
            className="text-[#8899B3] text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10 sm:mb-12"
          >
            Murlidhar Offset is a full-service offset printing house crafting brochures,
            packaging, wedding stationery, and brand collateral for India&apos;s most
            considered businesses — from D2C labels to FMCG and pharmaceutical leaders.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUpVariant}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
          >
            <Button
              onClick={() => navigate('products')}
              className="bg-[#C9A227] hover:bg-[#D4B54E] text-[#0B1628] font-semibold px-8 py-6 text-base rounded-lg transition-all duration-300 h-auto gold-shadow hover-shimmer group"
            >
              Explore Our Craft
              <ChevronRight className="size-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-[#C9A227]/40 text-[#C9A227] hover:bg-[#C9A227]/10 hover:border-[#C9A227]/70 font-semibold px-8 py-6 text-base rounded-lg h-auto bg-transparent transition-all duration-300 group"
            >
              <a
                href="https://wa.me/919876543210?text=Hi%20Murlidhar%20Offset%2C%20I%27d%20like%20to%20discuss%20a%20printing%20project."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4 mr-2 group-hover:scale-110 transition-transform" />
                Talk on WhatsApp
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative border-t border-white/[0.06] bg-[#0A1220]/80 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={scaleInVariant}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1 + i * 0.08 }}
                className="flex items-center gap-3 justify-center sm:justify-start group"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#C9A227]/[0.08] border border-[#C9A227]/[0.12] flex items-center justify-center group-hover:bg-[#C9A227]/[0.14] transition-colors duration-300">
                  <stat.icon className="size-4 text-[#C9A227]/70 group-hover:text-[#C9A227] transition-colors duration-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-white font-semibold text-sm sm:text-base leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-[#8899B3] text-[10px] sm:text-xs leading-tight truncate">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scrolling service badges marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative border-t border-white/[0.06] bg-[#080F1E] py-4 overflow-hidden"
      >
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#080F1E] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#080F1E] to-transparent z-10 pointer-events-none" />

        <div className="marquee-track flex items-center gap-6">
          {/* Duplicate the badges for seamless loop */}
          {[...serviceBadges, ...serviceBadges].map((badge, i) => (
            <span
              key={`${badge}-${i}`}
              className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A227]/[0.12] bg-[#C9A227]/[0.04] text-[#C9A227]/70 text-xs sm:text-sm tracking-wide whitespace-nowrap hover:border-[#C9A227]/25 hover:text-[#C9A227] transition-colors duration-300"
            >
              <span className="w-1 h-1 rounded-full bg-[#C9A227]/50" />
              {badge}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
