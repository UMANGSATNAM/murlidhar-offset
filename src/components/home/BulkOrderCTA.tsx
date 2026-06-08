'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Mail, Phone, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigationStore } from '@/lib/store'

const contactMethods = [
  {
    title: 'WhatsApp Us',
    subtitle: 'Quick response, easy sharing',
    icon: MessageCircle,
    href: 'https://wa.me/919510737852',
    accent: '#25D366',
    accentBg: 'rgba(37, 211, 102, 0.1)',
    accentBorder: 'rgba(37, 211, 102, 0.25)',
  },
  {
    title: 'Email a Brief',
    subtitle: 'murlidharoffset84@gmail.com',
    icon: Mail,
    href: 'mailto:murlidharoffset84@gmail.com',
    accent: '#C9A227',
    accentBg: 'rgba(201, 162, 39, 0.1)',
    accentBorder: 'rgba(201, 162, 39, 0.25)',
  },
  {
    title: 'Call the Studio',
    subtitle: '+91 95107 37852',
    icon: Phone,
    href: 'tel:+919510737852',
    accent: '#C9A227',
    accentBg: 'rgba(201, 162, 39, 0.1)',
    accentBorder: 'rgba(201, 162, 39, 0.25)',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

export default function BulkOrderCTA() {
  const { navigate } = useNavigationStore()

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28" style={{ backgroundColor: '#0B1628' }}>
      {/* Subtle gold gradient accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(201, 162, 39, 0.06) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent, transparent 80px, #C9A227 80px, #C9A227 81px)',
          }}
        />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-[#C9A227]/[0.03] blur-3xl" />
        <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-[#C9A227]/[0.02] blur-3xl" />
      </div>

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 ink-line" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-14">
          {/* Gold label */}
          <motion.div variants={fadeUpVariant} className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#C9A227]/60" />
            <span className="text-[#C9A227] text-xs font-semibold uppercase tracking-[0.2em]">
              Get In Touch
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#C9A227]/60" />
          </motion.div>

          {/* Main heading */}
          <motion.h2
            variants={fadeUpVariant}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-display)] text-[#E2E8F0] mb-4"
          >
            Start a{' '}
            <span className="italic bg-gradient-to-r from-[#C9A227] via-[#E8CC6E] to-[#C9A227] bg-clip-text text-transparent">
              Print
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
            Have a print job on your mind? Let&apos;s make it well. Send us your file, your idea, or even just a
            rough description. We&apos;ll come back with options, paper recommendations, and an honest timeline —
            usually within the same working day.
          </motion.p>
        </div>

        {/* Contact methods */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8"
        >
          {contactMethods.map((method) => {
            const Icon = method.icon
            return (
              <motion.a
                key={method.title}
                href={method.href}
                target={method.href.startsWith('http') ? '_blank' : undefined}
                rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                variants={cardVariant}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="group relative rounded-xl p-5 sm:p-6 text-center transition-all duration-300 border border-[#1E3048]/60 hover:border-opacity-100"
                style={{
                  backgroundColor: '#162032',
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at center top, ${method.accentBg} 0%, transparent 70%)`,
                  }}
                />

                {/* Dynamic hover border */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border"
                  style={{ borderColor: method.accentBorder }}
                />

                <div className="relative">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors duration-300"
                    style={{
                      backgroundColor: method.accentBg,
                      border: `1px solid ${method.accentBorder}`,
                    }}
                  >
                    <Icon className="size-5" style={{ color: method.accent }} />
                  </div>

                  {/* Title */}
                  <h3 className="text-[#E2E8F0] font-semibold font-[family-name:var(--font-display)] text-lg mb-1.5 group-hover:text-white transition-colors duration-300">
                    {method.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-[#64748B] text-sm leading-relaxed">
                    {method.subtitle}
                  </p>
                </div>
              </motion.a>
            )
          })}
        </motion.div>

        {/* Working hours */}
        <motion.p
          variants={fadeUpVariant}
          className="text-center text-[#64748B] text-sm mb-8 sm:mb-10"
        >
          Mon–Sat · 9 AM to 8 PM
        </motion.p>

        {/* Big CTA button */}
        <motion.div variants={fadeUpVariant} className="text-center">
          <Button
            onClick={() => navigate('contact')}
            className="font-semibold px-10 py-6 text-base sm:text-lg rounded-xl h-auto transition-all duration-300 hover-shimmer gold-shadow"
            style={{
              background: 'linear-gradient(135deg, #C9A227 0%, #D4B54E 50%, #C9A227 100%)',
              color: '#0B1628',
            }}
          >
            <Send className="size-5 mr-2" />
            Send a Brief
          </Button>
        </motion.div>

        {/* Bottom accent */}
        <div className="flex justify-center mt-14 sm:mt-16">
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#C9A227]/30 to-transparent" />
        </div>
      </motion.div>
    </section>
  )
}
