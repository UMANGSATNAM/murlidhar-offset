'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart } from 'lucide-react'

const socialProofMessages = [
  { name: 'Raj', city: 'Ahmedabad', action: 'just ordered 500 Business Cards', time: '2 min ago' },
  { name: 'Priya', city: 'Mumbai', action: 'ordered Wedding Cards', time: '5 min ago' },
  { name: 'Amit', city: 'Delhi', action: 'ordered 1,000 Letterheads', time: '8 min ago' },
  { name: 'Sneha', city: 'Pune', action: 'ordered Brochures for her startup', time: '12 min ago' },
  { name: 'Vikram', city: 'Jaipur', action: 'ordered Custom Packaging Boxes', time: '3 min ago' },
  { name: 'Meera', city: 'Surat', action: 'ordered 200 Premium Wedding Invitations', time: '15 min ago' },
  { name: 'Karan', city: 'Bangalore', action: 'ordered Flyers for an event', time: '7 min ago' },
  { name: 'Nisha', city: 'Hyderabad', action: 'ordered Stickers for her brand', time: '4 min ago' },
  { name: 'Arjun', city: 'Chennai', action: 'ordered Banners for a trade show', time: '10 min ago' },
  { name: 'Divya', city: 'Kolkata', action: 'ordered Envelopes for her company', time: '6 min ago' },
]

const avatarColors = [
  'from-gold to-gold-dark',
  'from-navy-light to-navy',
  'from-gold-dark to-gold-light',
  'from-gold to-navy-light',
]

const popupVariants = {
  initial: { opacity: 0, x: -80, scale: 0.9 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -80, scale: 0.9 },
}

export default function NotificationPopup() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [hasShownOnce, setHasShownOnce] = useState(false)

  const showNextNotification = useCallback(() => {
    if (isDismissed) return

    setIsVisible(false)

    // Wait for exit animation, then show next
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % socialProofMessages.length)
      setIsVisible(true)
    }, 500)
  }, [isDismissed])

  // Initial delay before first notification
  useEffect(() => {
    if (isDismissed) return

    const initialTimer = setTimeout(() => {
      setIsVisible(true)
      setHasShownOnce(true)
    }, 5000) // Show first after 5 seconds

    return () => clearTimeout(initialTimer)
  }, [isDismissed])

  // Auto-rotate notifications
  useEffect(() => {
    if (isDismissed || !hasShownOnce) return

    const interval = setInterval(showNextNotification, 15000) // Rotate every 15 seconds
    return () => clearInterval(interval)
  }, [showNextNotification, isDismissed, hasShownOnce])

  // Auto-hide after 6 seconds of being visible
  useEffect(() => {
    if (!isVisible || isDismissed) return

    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, 6000)

    return () => clearTimeout(hideTimer)
  }, [isVisible, isDismissed, currentIndex])

  if (isDismissed) return null

  const current = socialProofMessages[currentIndex]
  const colorClass = avatarColors[currentIndex % avatarColors.length]
  const initials = current.name.charAt(0)

  return (
    <div className="fixed bottom-4 left-4 z-[60] pointer-events-none">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentIndex}
            variants={popupVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            className="pointer-events-auto max-w-[320px] sm:max-w-[360px]"
          >
            <div className="glass-navy rounded-xl p-3 sm:p-4 premium-shadow-lg gold-border relative overflow-hidden">
              {/* Subtle animated shimmer line at top */}
              <div className="absolute top-0 left-0 right-0 h-px gold-gradient" />

              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center shrink-0`}
                >
                  <span className="text-white text-xs font-bold">{initials}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <ShoppingCart className="size-3 text-gold shrink-0" />
                    <span className="text-gold text-[10px] font-semibold uppercase tracking-wider">
                      Recent Order
                    </span>
                  </div>
                  <p className="text-white text-xs sm:text-sm leading-snug">
                    <span className="font-semibold">{current.name}</span>
                    <span className="text-white/50"> from </span>
                    <span className="font-medium text-gold-light">{current.city}</span>
                    <span className="text-white/50"> {current.action}</span>
                  </p>
                  <p className="text-white/30 text-[10px] mt-1">{current.time}</p>
                </div>

                {/* Dismiss */}
                <button
                  onClick={() => {
                    setIsVisible(false)
                    setIsDismissed(true)
                  }}
                  className="text-white/30 hover:text-white/60 transition-colors p-0.5 shrink-0"
                  aria-label="Dismiss notification"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
