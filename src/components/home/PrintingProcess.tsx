'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Palette, Printer, Scissors, Truck } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Palette,
    title: 'Design',
    description:
      'Choose from our templates or upload your own design. Our team can also create a custom design for you.',
  },
  {
    number: '02',
    icon: Printer,
    title: 'Print',
    description:
      'Your design goes through our state-of-the-art offset printing machines for crisp, vibrant results.',
  },
  {
    number: '03',
    icon: Scissors,
    title: 'Finish',
    description:
      'Professional finishing touches — lamination, foiling, embossing, die-cutting, and more.',
  },
  {
    number: '04',
    icon: Truck,
    title: 'Deliver',
    description:
      'Securely packed and shipped right to your doorstep. Track your order every step of the way.',
  },
]

export default function PrintingProcess() {
  return (
    <section className="py-16 md:py-24 bg-white relative">
      {/* Subtle top gold divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
      {/* Subtle bottom gold divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-muted text-gold text-xs font-semibold mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            OUR PROCESS
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-navy mb-3"
          >
            How It Works
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
            className="text-muted-foreground text-base max-w-2xl mx-auto"
          >
            From design to delivery — our streamlined 4-step process ensures
            your printing experience is smooth and hassle-free.
          </motion.p>
        </div>

        {/* Process steps */}
        <div className="relative">
          {/* Connecting dotted line - desktop */}
          <div className="hidden md:flex absolute top-1/2 left-[12.5%] right-[12.5%] -translate-y-1/2 items-center justify-between z-0">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex-1 flex items-center mx-4">
                <div className="w-full border-t-2 border-dashed border-gold/20" />
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.2 }}
                  className="w-3 h-3 rounded-full bg-gold/20 -ml-1.5 shrink-0"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center group"
              >
                {/* Step circle */}
                <div className="relative mx-auto mb-6">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white border-2 border-gold/30 flex items-center justify-center mx-auto relative z-10 group-hover:border-gold group-hover:gold-shadow transition-all duration-300 premium-shadow"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                    >
                      <step.icon className="size-8 md:size-9 text-navy group-hover:text-gold transition-colors duration-300" />
                    </motion.div>
                  </motion.div>
                  {/* Step number with gold circle and pulse animation */}
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.15, type: 'spring', stiffness: 300 }}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-navy font-bold text-xs z-20 premium-shadow animate-gold-pulse-sm"
                  >
                    {step.number}
                  </motion.span>
                </div>

                {/* Content */}
                <h3 className="text-navy font-bold text-lg md:text-xl mb-2 group-hover:text-gold-dark transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed max-w-[250px] mx-auto">
                  {step.description}
                </p>

                {/* Connecting dotted line for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <div className="w-0.5 h-8 border-l-2 border-dashed border-gold/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
