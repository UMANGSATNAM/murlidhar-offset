'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

interface Testimonial {
  id: string
  title: string | null
  content: string | null
  metadata: {
    name?: string
    company?: string
    rating?: number
  }
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    title: 'Excellent Quality',
    content:
      'The business cards we ordered were absolutely stunning. The gold foil detailing and paper quality exceeded our expectations. Murlidhar Offset is now our go-to printer!',
    metadata: {
      name: 'Rajesh Patel',
      company: 'Patel Industries',
      rating: 5,
    },
  },
  {
    id: '2',
    title: 'Fast & Reliable',
    content:
      'We needed 5000 wedding invitations in just 3 days and they delivered perfectly. The quality was impeccable and the team was incredibly responsive throughout the process.',
    metadata: {
      name: 'Priya Sharma',
      company: 'Wedding Planner Co.',
      rating: 5,
    },
  },
  {
    id: '3',
    title: 'Great Value',
    content:
      'Best prices in the market without compromising on quality. The bulk order discounts saved us a lot. Their GST invoicing makes business transactions seamless.',
    metadata: {
      name: 'Amit Desai',
      company: 'Desai & Associates',
      rating: 4,
    },
  },
  {
    id: '4',
    title: 'Professional Design Team',
    content:
      'The design team helped us create the perfect brand identity package — from letterheads to packaging. Their attention to detail and creative input was invaluable.',
    metadata: {
      name: 'Meera Joshi',
      company: 'Organic Foods Pvt Ltd',
      rating: 5,
    },
  },
]

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

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            What Our Clients Say
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-20 h-0.5 gold-gradient mx-auto"
          />
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
                className="bg-navy rounded-2xl p-8 md:p-10 relative overflow-hidden gold-border-glow"
              >
                {/* Decorative quote marks with gold styling */}
                <Quote className="absolute top-4 left-4 size-20 text-gold/8 fill-gold/8" />
                <Quote className="absolute bottom-4 right-4 size-20 text-gold/8 fill-gold/8 rotate-180" />

                {/* Gold accent line */}
                <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                {/* Stars */}
                <div className="flex items-center gap-1 mb-6 relative z-10">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Star
                        className={`size-4 ${
                          i < rating
                            ? 'text-gold fill-gold'
                            : 'text-white/20 fill-white/20'
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8 relative z-10">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-navy font-bold text-lg ring-2 ring-gold/30 ring-offset-2 ring-offset-navy">
                    {(testimonial.metadata?.name || 'A')[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      {testimonial.metadata?.name || 'Anonymous'}
                    </h4>
                    <p className="text-gold/60 text-sm">
                      {testimonial.metadata?.company || ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-white premium-shadow flex items-center justify-center text-navy hover:text-gold hover:scale-110 transition-all z-20"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-white premium-shadow flex items-center justify-center text-navy hover:text-gold hover:scale-110 transition-all z-20"
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
      </div>
    </section>
  )
}
