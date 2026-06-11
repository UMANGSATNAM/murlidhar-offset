'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function ScrollProgress() {
  const [scrollPercent, setScrollPercent] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [ticking, setTicking] = useState(false)

  const updateScroll = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const percent = docHeight > 0 ? Math.min(Math.round((scrollTop / docHeight) * 100), 100) : 0

    setScrollPercent(percent)
    setShowBackToTop(scrollTop > 300)
    setTicking(false)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking) {
        setTicking(true)
        requestAnimationFrame(updateScroll)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [updateScroll, ticking])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Scroll progress bar at the very top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px]">
        <motion.div
          className="h-full"
          style={{
            background: 'linear-gradient(90deg, #C9A227, #E8CC6E, #C9A227)',
            width: `${scrollPercent}%`,
          }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </div>

      {/* Back to top floating button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-5 z-40 w-12 h-12 rounded-full flex items-center justify-center premium-shadow-lg hover-shimmer"
            style={{
              background: 'linear-gradient(135deg, #C9A227 0%, #D4B54E 50%, #C9A227 100%)',
            }}
            aria-label="Back to top"
          >
            <div className="flex flex-col items-center justify-center">
              <ArrowUp className="size-4 text-navy" />
              <span className="text-[8px] font-bold text-navy leading-none mt-0.5">
                {scrollPercent}%
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
