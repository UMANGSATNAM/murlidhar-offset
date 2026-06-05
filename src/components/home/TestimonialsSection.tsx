'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface Testimonial {
  id: string
  title: string | null
  content: string | null
  metadata: {
    name?: string
    company?: string
    rating?: number
    role?: string
  }
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    title: 'Exceptional Print Quality',
    content:
      'The business cards we ordered were absolutely stunning. The gold foil detailing and paper quality exceeded our expectations. Murlidhar Offset is now our go-to printer for all corporate stationery needs!',
    metadata: {
      name: 'Rajesh Patel',
      company: 'Patel Industries',
      rating: 5,
      role: 'Managing Director',
    },
  },
  {
    id: '2',
    title: 'Fast & Reliable Delivery',
    content:
      'We needed 5000 wedding invitations in just 3 days and they delivered perfectly. The quality was impeccable and the team was incredibly responsive throughout the entire process. Highly recommend!',
    metadata: {
      name: 'Priya Sharma',
      company: 'Sharma Textiles',
      rating: 5,
      role: 'Owner',
    },
  },
  {
    id: '3',
    title: 'Best Prices in Gujarat',
    content:
      'Outstanding bulk pricing without compromising on quality. The bulk order discounts saved us over 40%. Their GST invoicing makes business transactions seamless. A true partner for B2B printing.',
    metadata: {
      name: 'Amit Mehta',
      company: 'Mehta & Associates',
      rating: 5,
      role: 'Senior Partner',
    },
  },
  {
    id: '4',
    title: 'Creative Design Support',
    content:
      'The design team helped us create the perfect brand identity package — from letterheads to packaging boxes. Their attention to detail and creative input was invaluable for our jewelry brand launch.',
    metadata: {
      name: 'Sunita Desai',
      company: 'Desai Jewellers',
      rating: 5,
      role: 'Creative Director',
    },
  },
  {
    id: '5',
    title: 'Pan-India Delivery Excellence',
    content:
      'We operate across 15 cities and Murlidhar Offset delivers consistently to every location. Their packaging is secure, tracking is reliable, and the print quality is always top-notch. A trusted partner indeed.',
    metadata: {
      name: 'Vikram Singh',
      company: 'Singh Enterprises',
      rating: 4,
      role: 'Operations Head',
    },
  },
]

// Color map for initial circles
const avatarColors: Record<string, string> = {
  'R': 'from-blue-500 to-blue-600',
  'P': 'from-purple-500 to-purple-600',
  'A': 'from-emerald-500 to-emerald-600',
  'S': 'from-rose-500 to-rose-600',
  'V': 'from-amber-500 to-amber-600',
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch('/api/cms?section=testimonials')
        const data = await res.json()
        if (data.contents && data.contents.length > 0) {
          setTestimonials(data.contents)
        } else {
          setTestimonials(fallbackTestimonials)
        }
      } catch {
        setTestimonials(fallbackTestimonials)
      }
    }
    fetchTestimonials()
  }, [])

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const prev = useCallback(() => {
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    )
  }, [testimonials.length])

  // Auto-play
  useEffect(() => {
    if (!autoPlay || testimonials.length === 0) return
    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [autoPlay, next, testimonials.length])

  if (testimonials.length === 0) return null

  const testimonial = testimonials[current]
  const rating = testimonial.metadata?.rating || 5
  // Use realistic Indian business name as fallback if name is blank/missing
  const displayName = testimonial.metadata?.name?.trim() || testimonial.title?.replace(/^(Exceptional|Fast|Best|Creative|Pan-India|Outstanding|Premium|Reliable|Superb|Excellent)\s*/i, '').trim() || 'Valued Customer'
  const nameInitial = displayName[0].toUpperCase()
  const colorClass = avatarColors[nameInitial] || 'from-gold to-gold-dark'

  return (
    <section className="py-16 md:py-24 bg-gray-50/80 relative">
      {/* Subtle top gold divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

      <ScrollReveal variant="fade-left" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-muted text-gold text-xs font-semibold mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            TESTIMONIALS
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-navy mb-3"
          >
            Trusted by <span className="text-gradient-animate">Businesses</span> Across India
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
            Hear from businesses that trust Murlidhar Offset for their printing needs.
          </motion.p>
        </div>

        {/* Testimonial carousel */}
        <div className="max-w-3xl mx-auto">
          <div
            className="relative"
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 50, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="bg-navy rounded-2xl p-8 md:p-10 relative overflow-hidden gold-border-glow shadow-[0_8px_30px_-8px_rgba(13,27,61,0.3)]"
              >
                {/* Decorative quote marks — more visible */}
                <Quote className="absolute top-6 left-6 size-16 md:size-20 text-gold/15 fill-gold/15" />
                <Quote className="absolute bottom-6 right-6 size-16 md:size-20 text-gold/15 fill-gold/15 rotate-180" />

                {/* Gold accent line — more prominent */}
                <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

                {/* Stars — more prominent */}
                <div className="flex items-center gap-1.5 mb-6 relative z-10">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Star
                        className={`size-5 ${
                          i < rating
                            ? 'text-gold fill-gold'
                            : 'text-white/20 fill-white/20'
                        }`}
                      />
                    </motion.div>
                  ))}
                  <span className="ml-2 text-gold/80 text-sm font-semibold">
                    {rating}.0
                  </span>
                </div>

                {/* Quote text */}
                <p className="text-white/85 text-lg md:text-xl leading-relaxed mb-8 relative z-10 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 relative z-10">
                  {/* Colored initial circle instead of generic avatar */}
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-xl ring-2 ring-gold/30 ring-offset-2 ring-offset-navy shadow-lg`}>
                    {nameInitial}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg">
                      {displayName}
                    </h4>
                    <p className="text-gold/70 text-sm font-medium">
                      {testimonial.metadata?.company || ''}
                    </p>
                    {testimonial.metadata?.role && (
                      <p className="text-white/40 text-xs mt-0.5">
                        {testimonial.metadata.role}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(13,27,61,0.1)] flex items-center justify-center text-navy hover:text-gold hover:scale-110 transition-all z-20"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(13,27,61,0.1)] flex items-center justify-center text-navy hover:text-gold hover:scale-110 transition-all z-20"
              aria-label="Next testimonial"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-8 gold-gradient'
                    : 'w-2 bg-navy/20 hover:bg-navy/40'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
