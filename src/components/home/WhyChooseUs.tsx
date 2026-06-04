'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Award,
  Truck,
  BadgeIndianRupee,
  Palette,
  Receipt,
  Globe,
} from 'lucide-react'

const features = [
  {
    icon: Award,
    title: 'Premium Quality',
    description:
      'State-of-the-art offset printing technology delivering unmatched color accuracy and sharp detail on every print.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description:
      '24–48 hour turnaround on most orders. Rush delivery available for urgent printing needs across India.',
  },
  {
    icon: BadgeIndianRupee,
    title: 'Best Prices',
    description:
      'Competitive pricing with bulk discounts. Get the best value without compromising on print quality.',
  },
  {
    icon: Palette,
    title: 'Custom Design',
    description:
      'Professional design support from our in-house team. Upload your own or let us create something special.',
  },
  {
    icon: Receipt,
    title: 'GST Invoicing',
    description:
      'Fully compliant GST invoices for all business orders. Simplify your accounting with proper documentation.',
  },
  {
    icon: Globe,
    title: 'Pan-India Delivery',
    description:
      'Reliable shipping to every corner of India. Track your orders and get them delivered right to your doorstep.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-navy relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-gold text-xs font-semibold mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            WHY CHOOSE US
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white mb-3"
          >
            The Murlidhar <span className="gold-gradient-text">Advantage</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-20 h-0.5 gold-gradient mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 max-w-2xl mx-auto"
          >
            We combine decades of printing expertise with cutting-edge
            technology to deliver results that exceed expectations.
          </motion.p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative p-6 md:p-7 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all duration-300 hover:bg-white/[0.08]"
            >
              {/* Gold accent corner */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-xl">
                <div className="absolute top-0 right-0 w-8 h-8 bg-gold/10 transform rotate-45 translate-x-4 -translate-y-4 group-hover:bg-gold/20 transition-colors" />
              </div>

              <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="size-6 text-navy" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-gold-light transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
