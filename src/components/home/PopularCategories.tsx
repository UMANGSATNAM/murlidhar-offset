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

const colorPalettes = [
  { bg: 'bg-navy/5', hover: 'hover:bg-navy/10', iconBg: 'bg-navy/10', iconColor: 'text-navy' },
  { bg: 'bg-gold/5', hover: 'hover:bg-gold/10', iconBg: 'bg-gold/15', iconColor: 'text-gold-dark' },
  { bg: 'bg-navy/5', hover: 'hover:bg-navy/10', iconBg: 'bg-navy/10', iconColor: 'text-navy' },
  { bg: 'bg-gold/5', hover: 'hover:bg-gold/10', iconBg: 'bg-gold/15', iconColor: 'text-gold-dark' },
  { bg: 'bg-navy/5', hover: 'hover:bg-navy/10', iconBg: 'bg-navy/10', iconColor: 'text-navy' },
  { bg: 'bg-gold/5', hover: 'hover:bg-gold/10', iconBg: 'bg-gold/15', iconColor: 'text-gold-dark' },
  { bg: 'bg-navy/5', hover: 'hover:bg-navy/10', iconBg: 'bg-navy/10', iconColor: 'text-navy' },
  { bg: 'bg-gold/5', hover: 'hover:bg-gold/10', iconBg: 'bg-gold/15', iconColor: 'text-gold-dark' },
]

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
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-muted/30">
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
              const palette = colorPalettes[index % colorPalettes.length]
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() =>
                    navigate('products', { categorySlug: category.slug })
                  }
                  className={`group cursor-pointer rounded-xl p-5 md:p-6 ${palette.bg} ${palette.hover} border border-transparent hover:border-gold/20 transition-all duration-300 gold-border-glow-hover`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${palette.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`size-6 ${palette.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-navy text-sm md:text-base mb-1 group-hover:text-gold-dark transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                    {category.description || 'Premium quality printing'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {category.productCount} Products
                    </span>
                    <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all duration-200" />
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
