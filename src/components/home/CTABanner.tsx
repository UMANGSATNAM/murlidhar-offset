'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Printer, MessageSquareQuote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigationStore } from '@/lib/store'

const stats = [
  { value: '500+', label: 'Products' },
  { value: '15+', label: 'Years' },
  { value: '10K+', label: 'Customers' },
  { value: '99%', label: 'Satisfaction' },
]

export default function CTABanner() {
  const { navigate } = useNavigationStore()

  return (
    <section className="relative overflow-hidden">
      {/* Main container */}
      <div className="relative bg-navy-gradient py-16 sm:py-20 lg:py-24">
        {/* Decorative gold pattern overlay - CSS-based */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Diamond pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #C9A227 25%, transparent 25%),
                linear-gradient(-45deg, #C9A227 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #C9A227 75%),
                linear-gradient(-45deg, transparent 75%, #C9A227 75%)
              `,
              backgroundSize: '40px 40px',
              backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
            }}
          />

          {/* Large gold circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-gold/10" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full border border-gold/5" />

          {/* Gold glow orbs */}
          <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-gold/3 rounded-full blur-2xl" />

          {/* Diagonal gold lines */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, transparent, transparent 80px, #C9A227 80px, #C9A227 81px)',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            {/* Left side - Heading */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-center lg:text-left flex-shrink-0"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-semibold mb-4">
                <Printer className="size-3.5" />
                Start Your Order Today
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-white">Ready to </span>
                <span className="gold-gradient-text">Print?</span>
              </h2>
              <p className="text-white/60 mt-3 text-sm sm:text-base max-w-md">
                From concept to delivery — we make premium printing effortless.
              </p>
            </motion.div>

            {/* Center - Glass stats card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="glass-navy rounded-2xl p-6 lg:p-8 gold-border-glow">
                <div className="grid grid-cols-2 gap-6 lg:gap-8">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                      className="text-center"
                    >
                      <div className="text-2xl lg:text-3xl font-bold text-gold">
                        {stat.value}
                      </div>
                      <div className="text-white/50 text-xs mt-1 uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right side - CTA buttons */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row lg:flex-col gap-3 sm:gap-4 lg:gap-4 flex-shrink-0"
            >
              <Button
                onClick={() => navigate('products')}
                className="gold-gradient font-semibold px-8 py-6 text-base rounded-xl hover:opacity-90 transition-opacity gold-shadow h-auto"
              >
                Shop Now
                <ArrowRight className="size-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border-gold/50 text-gold hover:bg-gold/10 hover:text-gold-light hover:border-gold font-semibold px-8 py-6 text-base rounded-xl h-auto bg-transparent transition-all duration-300"
              >
                <MessageSquareQuote className="size-4 mr-2" />
                Get Custom Quote
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
