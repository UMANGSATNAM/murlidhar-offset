'use client'

import React from 'react'
import { motion, type Variants } from 'framer-motion'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'

type AnimationVariant = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-in' | 'fade'

const variants: Record<AnimationVariant, Variants> = {
  'fade-up': {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  },
  'fade-down': {
    hidden: { opacity: 0, y: -40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  },
  'fade-left': {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  },
  'fade-right': {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  },
  'scale-in': {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  },
  'fade': {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  },
}

interface ScrollRevealProps {
  children: React.ReactNode
  variant?: AnimationVariant
  delay?: number
  className?: string
  threshold?: number
}

export default function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  className = '',
  threshold = 0.12,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal(threshold)

  return (
    <div ref={ref} className={className}>
      <motion.div
        variants={variants[variant]}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export { variants as scrollRevealVariants }
export type { AnimationVariant }
