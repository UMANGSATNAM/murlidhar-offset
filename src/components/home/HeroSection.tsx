'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, Truck, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigationStore } from '@/lib/store'

const stats = [
  { value: '10,000+', label: 'Happy Customers', icon: Users },
  { value: '500+', label: 'Products', icon: Sparkles },
  { value: '15+', label: 'Years Experience', icon: Clock },
  { value: '24hr', label: 'Delivery', icon: Truck },
]

const rotatingWords = ['Print', 'Story', 'Vision', 'Brand', 'Dream']

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

// Particle component for background
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gold/20"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -(Math.random() * 60 + 20)],
            x: [0, (Math.random() - 0.5) * 40],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default function HeroSection() {
  const { navigate } = useNavigationStore()
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[100vh] overflow-hidden flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/products/hero-printing-press.png"
          alt="Murlidhar Offset Printing Press"
          className="h-full w-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-navy/85" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70" />
      </div>

      {/* Animated background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large decorative circle */}
        <motion.div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-gold/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full border border-gold/5"
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating particles */}
        <Particles />

        {/* Gold gradient orb */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/3 rounded-full blur-3xl" />

        {/* Diagonal lines pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 60px, #C9A227 60px, #C9A227 61px)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 md:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold text-gold text-xs font-semibold mb-6"
            >
              <Sparkles className="size-3.5" />
              Premium Offset Printing Since 2009
            </motion.div>

            {/* Heading with rotating word */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6"
            >
              <span className="text-white">Where Every </span>
              <span className="relative inline-block min-w-[180px] sm:min-w-[220px] lg:min-w-[260px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ y: 30, opacity: 0, filter: 'blur(8px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: -30, opacity: 0, filter: 'blur(8px)' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-gradient-animate inline-block"
                  >
                    {rotatingWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br />
              <span className="text-white">Tells a </span>
              <span className="gold-gradient-text">Story</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-white/70 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              Murlidhar Offset — Gujarat&apos;s trusted printing press. From
              business cards to wedding invitations, we bring your vision to
              life with premium quality printing.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Button
                onClick={() => navigate('products')}
                className="gold-gradient font-semibold px-8 py-6 text-base rounded-xl hover:opacity-90 transition-all gold-shadow h-auto hover-shimmer"
              >
                Shop Now
                <ArrowRight className="size-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                className="border-gold/50 text-gold hover:bg-gold/10 hover:text-gold-light hover:border-gold font-semibold px-8 py-6 text-base rounded-xl h-auto bg-transparent transition-all duration-300 hover-shimmer"
              >
                Get Custom Quote
              </Button>
            </motion.div>
          </div>

          {/* Right side visual - Product showcase with real images */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hidden lg:flex items-center justify-center relative"
          >
            <div className="relative w-[420px] h-[420px]">
              {/* Stacked cards effect with real product images */}
              <motion.div
                className="absolute inset-0 rounded-2xl glass-card rotate-6 overflow-hidden"
                animate={{ y: [-4, 4, -4] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <img src="/products/wedding-cards.png" alt="Wedding Cards" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white font-bold text-lg drop-shadow-lg">Wedding Cards</h3>
                  <p className="text-white/80 text-sm drop-shadow-md">Premium Collection</p>
                </div>
              </motion.div>

              <motion.div
                className="absolute inset-0 rounded-2xl glass-card -rotate-3 overflow-hidden"
                animate={{ y: [4, -4, 4] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <img src="/products/brochures.png" alt="Brochures" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white font-bold text-lg drop-shadow-lg">Brochures</h3>
                  <p className="text-white/80 text-sm drop-shadow-md">Professional Quality</p>
                </div>
              </motion.div>

              <motion.div
                className="absolute inset-0 rounded-2xl overflow-hidden premium-shadow-lg"
                animate={{ y: [-6, 6, -6] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <img src="/products/business-cards.png" alt="Business Cards" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center mb-3 premium-shadow">
                    <span className="text-navy font-bold text-lg">MO</span>
                  </div>
                  <h3 className="text-white font-bold text-xl drop-shadow-lg">Business Cards</h3>
                  <p className="text-white/80 text-sm drop-shadow-md">Starting from ₹299</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center p-5 rounded-xl glass-gold group hover:bg-gold/10 transition-all duration-300"
            >
              <stat.icon className="size-5 text-gold mb-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.value}
              </span>
              <span className="text-white/50 text-xs md:text-sm text-center">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
