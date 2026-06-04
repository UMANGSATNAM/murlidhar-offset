'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const announcements = [
  { icon: '🎉', text: 'Free Shipping on orders above ₹999!' },
  { icon: '🏷️', text: 'Use code WELCOME10 for 10% off' },
  { icon: '📦', text: 'Bulk orders? Get custom quotes!' },
  { icon: '⚡', text: 'Same-day dispatch on orders before 2 PM' },
  { icon: '✨', text: 'Premium quality guaranteed on every print' },
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
  }),
}

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isDismissed, setIsDismissed] = useState(false)

  const goToNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % announcements.length)
  }, [])

  useEffect(() => {
    if (isDismissed) return
    const interval = setInterval(goToNext, 4000)
    return () => clearInterval(interval)
  }, [goToNext, isDismissed])

  if (isDismissed) return null

  return (
    <div className="relative bg-navy-dark overflow-hidden" style={{ height: '28px' }}>
      {/* Subtle gold line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.25 },
            }}
            className="absolute inset-0 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium"
          >
            <span className="text-sm">{announcements[currentIndex].icon}</span>
            <span className="text-gold">{announcements[currentIndex].text}</span>
          </motion.div>
        </AnimatePresence>

        {/* Dismiss button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-gold transition-colors p-0.5"
          aria-label="Dismiss announcement"
        >
          <X className="size-3.5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
          {announcements.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1)
                setCurrentIndex(i)
              }}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'bg-gold w-3'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to announcement ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
