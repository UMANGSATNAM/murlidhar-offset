'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigationStore } from '@/lib/store'
import { useRecentlyViewedStore } from '@/lib/recently-viewed-store'

export default function RecentlyViewedSection() {
  const { navigate } = useNavigationStore()
  const items = useRecentlyViewedStore((s) => s.items)
  const _hydrate = useRecentlyViewedStore((s) => s._hydrate)

  useEffect(() => {
    _hydrate()
  }, [_hydrate])

  if (items.length === 0) return null

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gold/[0.03]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2"
            >
              <div className="rounded-lg bg-navy/10 p-2">
                <Clock className="h-5 w-5 text-navy" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-navy">
                  Recently Viewed
                </h2>
                <p className="text-xs text-muted-foreground">
                  Products you&apos;ve browsed recently
                </p>
              </div>
            </motion.div>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('products')}
            className="text-gold hover:text-gold-dark text-sm font-medium"
          >
            Browse All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Horizontal scrollable row */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent">
            {items.map((item, idx) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                whileHover={{ y: -4 }}
                onClick={() =>
                  navigate('product-detail', { productId: item.productId })
                }
                className="group flex-shrink-0 w-[180px] sm:w-[200px] cursor-pointer rounded-xl border border-border/40 bg-white overflow-hidden premium-shadow hover:premium-shadow-xl transition-all duration-300 gold-glow-hover border-glow-animate card-hover-lift"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-navy/5 to-gold/5 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center">
                        <span className="text-navy/20 font-bold text-lg">
                          {item.name[0]}
                        </span>
                      </div>
                    </div>
                  )}
                  {/* Category badge */}
                  <div className="absolute top-2 left-2">
                    <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-white/90 text-navy backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>
                  {/* Hover arrow */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                    <div className="h-7 w-7 rounded-full gold-gradient flex items-center justify-center shadow-md">
                      <ArrowRight className="h-3.5 w-3.5 text-navy" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="font-semibold text-navy text-xs mb-1 group-hover:text-gold-dark transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-gold-dark font-bold text-sm">
                    ₹{item.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Fade edges for scroll hint */}
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  )
}
