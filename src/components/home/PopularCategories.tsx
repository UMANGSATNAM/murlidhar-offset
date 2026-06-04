'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CreditCard,
  Heart,
  FileText,
  BookOpen,
  Package,
  Sticker,
  Megaphone,
  Mail,
  Tag,
  Layers,
  Newspaper,
  Award,
  ArrowRight,
} from 'lucide-react'
import { useNavigationStore } from '@/lib/store'

const iconMap: Record<string, React.ElementType> = {
  'credit-card': CreditCard,
  heart: Heart,
  'file-text': FileText,
  'book-open': BookOpen,
  package: Package,
  sticker: Sticker,
  megaphone: Megaphone,
  mail: Mail,
  tag: Tag,
  layers: Layers,
  newspaper: Newspaper,
  award: Award,
}

const defaultIcons = [
  CreditCard,
  Heart,
  FileText,
  BookOpen,
  Package,
  Sticker,
  Megaphone,
  Mail,
  Tag,
  Layers,
  Newspaper,
  Award,
]

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  icon: string | null
  productCount: number
}

const fallbackCategories: Category[] = [
  { id: '1', name: 'Business Cards', slug: 'business-cards', description: 'Professional cards that make an impression', image: null, icon: 'credit-card', productCount: 24 },
  { id: '2', name: 'Wedding Cards', slug: 'wedding-cards', description: 'Elegant invitations for your special day', image: null, icon: 'heart', productCount: 18 },
  { id: '3', name: 'Letterheads', slug: 'letterheads', description: 'Corporate stationery with your brand', image: null, icon: 'file-text', productCount: 12 },
  { id: '4', name: 'Brochures', slug: 'brochures', description: 'Marketing materials that convert', image: null, icon: 'book-open', productCount: 16 },
  { id: '5', name: 'Packaging', slug: 'packaging', description: 'Custom packaging for your products', image: null, icon: 'package', productCount: 20 },
  { id: '6', name: 'Stickers & Labels', slug: 'stickers', description: 'Eye-catching stickers and labels', image: null, icon: 'sticker', productCount: 14 },
  { id: '7', name: 'Banners & Posters', slug: 'banners', description: 'Large format printing solutions', image: null, icon: 'megaphone', productCount: 10 },
  { id: '8', name: 'Envelopes', slug: 'envelopes', description: 'Premium business envelopes', image: null, icon: 'mail', productCount: 8 },
]

const categoryImages: Record<string, string> = {
  'business-cards': '/products/business-cards.png',
  'wedding-cards': '/products/wedding-cards.png',
  'letterheads': '/products/letter-pads.png',
  'brochures': '/products/brochures.png',
  'packaging': '/products/packaging.png',
  'stickers': '/products/stickers.png',
  'banners': '/products/flex-banners.png',
  'envelopes': '/products/letter-pads.png',
}

export default function PopularCategories() {
  const { navigate } = useNavigationStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories)
        } else {
          setCategories(fallbackCategories)
        }
      } catch {
        setCategories(fallbackCategories)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const getIcon = (category: Category, index: number) => {
    if (category.icon && iconMap[category.icon]) {
      return iconMap[category.icon]
    }
    return defaultIcons[index % defaultIcons.length]
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50/50 relative">
      {/* Subtle top gold divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />

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
            CATEGORIES
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-navy mb-3"
          >
            Browse by Category
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
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Explore our wide range of printing categories — from business
            essentials to celebration stationery.
          </motion.p>
        </div>

        {/* Categories grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-muted/30 animate-pulse h-40"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => {
              const Icon = getIcon(category, index)
              const catImage = categoryImages[category.slug] || category.image
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() =>
                    navigate('products', { categorySlug: category.slug })
                  }
                  className="group cursor-pointer rounded-xl overflow-hidden border border-transparent hover:border-gold/30 transition-all duration-300 gold-glow-hover border-glow-animate card-hover-lift relative"
                >
                  {/* Background image with overlay */}
                  {catImage && (
                    <div className="absolute inset-0">
                      <img
                        src={catImage}
                        alt={category.name}
                        className="w-full h-full object-cover opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-gold/5 group-hover:from-white/90 group-hover:via-white/85 group-hover:to-gold/10 transition-all duration-500" />
                    </div>
                  )}

                  {/* Content */}
                  <div className={`relative p-5 md:p-6 ${!catImage ? 'bg-navy/5 hover:bg-navy/10' : ''} transition-all duration-300`}>
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-gold/15 transition-all duration-300"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        <Icon className="size-6 text-navy group-hover:text-gold-dark transition-colors duration-300" />
                      </motion.div>
                      {/* Product count badge */}
                      <div className="px-2.5 py-1 rounded-full gold-gradient text-navy text-[10px] font-bold shadow-sm">
                        {category.productCount}
                      </div>
                    </div>
                    <h3 className="font-semibold text-navy text-sm md:text-base mb-1 group-hover:text-gold-dark transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {category.description || 'Premium quality printing'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {category.productCount} Products
                      </span>
                      <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
