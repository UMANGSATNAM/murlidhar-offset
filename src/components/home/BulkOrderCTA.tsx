'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Phone, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigationStore } from '@/lib/store'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function BulkOrderCTA() {
  const { navigate } = useNavigationStore()

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy-light to-navy" />
      <div className="absolute inset-0 hero-gradient opacity-60" />

      {/* Animated dot pattern */}
      <div className="absolute inset-0 pointer-events-none animate-dot-pattern opacity-30" />

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/3 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, transparent, transparent 80px, #C9A227 80px, #C9A227 81px)',
          }}
        />
      </div>

      <ScrollReveal variant="scale-in" className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Printer icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gold-gradient mb-6 premium-shadow animate-gold-pulse-sm"
        >
          <Printer className="size-8 text-navy" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
        >
          Need Bulk Printing?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Whether it&apos;s 1,000 business cards or 50,000 wedding invitations,
          we offer the best bulk pricing with uncompromising quality. Get a
          custom quote today!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            onClick={() => navigate('products')}
            className="gold-gradient font-semibold px-8 py-6 text-base rounded-xl hover:opacity-90 transition-all gold-shadow h-auto hover-shimmer"
          >
            Get Custom Quote
            <ArrowRight className="size-4 ml-2" />
          </Button>
          <a href="tel:+919876543210">
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white font-semibold px-8 py-6 text-base rounded-xl h-auto bg-transparent hover-shimmer"
            >
              <Phone className="size-4 mr-2" />
              Call Us Now
            </Button>
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white/40 text-xs"
        >
          {['Free Design Support', 'Bulk Discounts', 'GST Invoicing', 'Pan-India Delivery'].map((text) => (
            <span key={text} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />
              {text}
            </span>
          ))}
        </motion.div>
      </ScrollReveal>
    </section>
  )
}
