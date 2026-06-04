'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Users, Clock, Palette, ThumbsUp } from 'lucide-react'

const badges = [
  { icon: ShieldCheck, text: 'ISO 9001 Certified' },
  { icon: Users, text: '10,000+ Happy Customers' },
  { icon: Clock, text: '24hr Production' },
  { icon: Palette, text: 'Free Design Support' },
  { icon: ThumbsUp, text: '100% Satisfaction Guarantee' },
]

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const badgeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function TrustStrip() {
  return (
    <section className="relative bg-navy overflow-hidden">
      {/* Enhanced gold divider top */}
      <div className="relative h-1">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <motion.div
          initial={{ x: '-100%' }}
          whileInView={{ x: '100%' }}
          viewport={{ once: false }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent"
        />
      </div>

      {/* Subtle decorative background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 40px, #C9A227 40px, #C9A227 41px)',
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7"
      >
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-0">
          {badges.map((badge, i) => (
            <React.Fragment key={badge.text}>
              <motion.div
                variants={badgeVariants}
                className="flex items-center gap-2.5 px-4 sm:px-6 py-2 group"
              >
                <motion.div
                  className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-300 icon-bounce-hover"
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <badge.icon className="size-4 text-gold" />
                </motion.div>
                <span className="text-white/80 text-xs sm:text-sm font-medium group-hover:text-white transition-colors duration-300 whitespace-nowrap">
                  {badge.text}
                </span>
              </motion.div>

              {/* Gold divider between badges (not after last) */}
              {i < badges.length - 1 && (
                <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* Enhanced gold divider bottom */}
      <div className="relative h-1">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <motion.div
          initial={{ x: '100%' }}
          whileInView={{ x: '-100%' }}
          viewport={{ once: false }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent"
        />
      </div>
    </section>
  )
}
