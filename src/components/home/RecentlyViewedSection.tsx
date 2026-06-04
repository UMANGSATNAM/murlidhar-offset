'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  ChevronRight,
  ArrowRight,
  ChevronLeft,
  Trash2,
  Star,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigationStore } from '@/lib/store'
import { useRecentlyViewedStore } from '@/lib/recently-viewed-store'

// Fallback popular products when no recently viewed items
const popularProducts = [
  { id: 'pop-1', name: 'Premium Business Cards', price: 499, category: 'Business Cards', image: '', rating: 4.8 },
  { id: 'pop-2', name: 'Royal Wedding Invitations', price: 2499, category: 'Wedding Cards', image: '', rating: 4.9 },
  { id: 'pop-3', name: 'Glossy Brochures', price: 899, category: 'Brochures', image: '', rating: 4.7 },
  { id: 'pop-4', name: 'Custom Letterheads', price: 599, category: 'Stationery', image: '', rating: 4.5 },
  { id: 'pop-5', name: 'Product Packaging Boxes', price: 1999, category: 'Packaging', image: '', rating: 4.8 },
  { id: 'pop-6', name: 'Event Flyers', price: 399, category: 'Flyers', image: '', rating: 4.6 },
]

export default function RecentlyViewedSection() {
  const { navigate } = useNavigationStore()
  const items = useRecentlyViewedStore((s) => s.items)
  const _hydrate = useRecentlyViewedStore((s) => s._hydrate)
  const clearAll = useRecentlyViewedStore((s) => s.clearAll)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  useEffect(() => {
    _hydrate()
  }, [_hydrate])

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true })
      return () => el.removeEventListener('scroll', checkScroll)
    }
  }, [items])

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = direction === 'left' ? -320 : 320
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' })
  }

  const handleClear = () => {
    clearAll()
    setShowClearConfirm(false)
  }

  const hasItems = items.length > 0

  const renderProductCard = (
    id: string,
    name: string,
    price: number,
    category: string,
    image: string,
    idx: number,
    extra?: { rating?: number }
  ) => (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05, duration: 0.4 }}
      whileHover={{ y: -6 }}
      onClick={() => navigate('product-detail', { productId: id })}
      className="group flex-shrink-0 w-[180px] sm:w-[200px] cursor-pointer rounded-xl border border-border/40 bg-white overflow-hidden premium-shadow hover:premium-shadow-xl transition-all duration-300 gold-glow-hover border-glow-animate card-hover-lift"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-navy/5 to-gold/5 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center">
              <span className="text-navy/20 font-bold text-lg">
                {name[0]}
              </span>
            </div>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-white/90 text-navy backdrop-blur-sm">
            {category}
          </span>
        </div>
        {/* Rating badge */}
        {extra?.rating && (
          <div className="absolute top-2 right-2">
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full gold-gradient text-navy flex items-center gap-0.5">
              <Star className="size-2.5 fill-navy" />
              {extra.rating}
            </span>
          </div>
        )}
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
          {name}
        </h3>
        <p className="text-gold-dark font-bold text-sm">
          ₹{price.toLocaleString('en-IN')}
        </p>
      </div>
    </motion.div>
  )

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
                {hasItems ? (
                  <Clock className="h-5 w-5 text-navy" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-navy" />
                )}
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-navy">
                  {hasItems ? 'Recently Viewed' : 'Popular Products'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {hasItems
                    ? 'Products you\'ve browsed recently'
                    : 'Top-rated products our customers love'}
                </p>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-2">
            {/* Clear History button */}
            {hasItems && (
              <AnimatePresence>
                {!showClearConfirm ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => setShowClearConfirm(true)}
                      className="text-muted-foreground hover:text-red-500 text-xs font-medium h-8 px-2"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Clear
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-1"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 h-7 text-xs px-2"
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowClearConfirm(false)}
                      className="text-muted-foreground h-7 text-xs px-2"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* View All link */}
            <Button
              variant="ghost"
              onClick={() => navigate('products')}
              className="text-gold hover:text-gold-dark text-sm font-medium"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Horizontal scrollable row */}
        <div className="relative group/scroll">
          {/* Left scroll arrow - desktop */}
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => scrollByAmount('left')}
              className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-border/50 items-center justify-center premium-shadow hover:premium-shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4 text-navy" />
            </motion.button>
          )}

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent scroll-smooth"
          >
            {hasItems
              ? items.map((item, idx) =>
                  renderProductCard(
                    item.productId,
                    item.name,
                    item.price,
                    item.category,
                    item.image,
                    idx
                  )
                )
              : popularProducts.map((item, idx) =>
                  renderProductCard(
                    item.id,
                    item.name,
                    item.price,
                    item.category,
                    item.image,
                    idx,
                    { rating: item.rating }
                  )
                )}
          </div>

          {/* Right scroll arrow - desktop */}
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => scrollByAmount('right')}
              className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-border/50 items-center justify-center premium-shadow hover:premium-shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4 text-navy" />
            </motion.button>
          )}

          {/* Fade edges for scroll hint */}
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          )}
        </div>
      </div>
    </section>
  )
}
