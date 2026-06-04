'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Users, Clock, Palette, ThumbsUp } from 'lucide-react'

const badges = [
  { icon: ShieldCheck, text: 'ISO 9001 Certified', stat: '9001' },
  { icon: Users, text: '10,000+ Happy Customers', stat: '10K+' },
  { icon: Clock, text: '24hr Production', stat: '24hr' },
  { icon: Palette, text: 'Free Design Support', stat: '500+' },
  { icon: ThumbsUp, text: '100% Satisfaction Guarantee', stat: '100%' },
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
    <section className="relative bg-[#F8F9FA] overflow-hidden">
      {/* Subtle top gold divider */}
      <div className="relative h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      {/* Subtle decorative background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
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
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10"
      >
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-4 sm:gap-x-0">
          {badges.map((badge, i) => (
            <React.Fragment key={badge.text}>
              <motion.div
                variants={badgeVariants}
                className="flex items-center gap-4 px-6 sm:px-10 py-4 group"
              >
                <motion.div
                  className="w-12 h-12 rounded-xl bg-navy/[0.06] flex items-center justify-center group-hover:bg-gold/15 transition-colors duration-300 icon-bounce-hover shadow-[0_2px_8px_-2px_rgba(13,27,61,0.06)]"
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <badge.icon className="size-5 text-gold-dark group-hover:text-gold transition-colors duration-300" />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-navy font-bold text-sm sm:text-[15px] group-hover:text-gold-dark transition-colors duration-300 whitespace-nowrap">
                    {badge.text}
                  </span>
                  <span className="text-navy/35 text-[10px] uppercase tracking-widest mt-0.5">
                    Verified
                  </span>
                </div>
              </motion.div>

              {/* Gold divider between badges (not after last) */}
              {i < badges.length - 1 && (
                <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* Subtle bottom gold divider */}
      <div className="relative h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>
    </section>
  )
}
