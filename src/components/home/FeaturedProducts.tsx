'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/lib/store'

interface Product {
  id: string
  name: string
  slug: string
  shortDesc: string | null
  images: string[]
  basePrice: number
  category: { name: string; slug: string }
  isFeatured: boolean
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function FeaturedProducts() {
  const { navigate } = useNavigationStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?featured=true&limit=8')
        const data = await res.json()
        setProducts(data.products || [])
      } catch {
        // Use fallback products
        setProducts([
          { id: '1', name: 'Premium Business Cards', slug: 'premium-business-cards', shortDesc: '250 GSM Premium Cards', images: [], basePrice: 199, category: { name: 'Business Cards', slug: 'business-cards' }, isFeatured: true },
          { id: '2', name: 'Royal Wedding Cards', slug: 'royal-wedding-cards', shortDesc: 'Hand-crafted Luxury', images: [], basePrice: 1499, category: { name: 'Wedding Cards', slug: 'wedding-cards' }, isFeatured: true },
          { id: '3', name: 'Corporate Letterheads', slug: 'corporate-letterheads', shortDesc: 'Professional Stationery', images: [], basePrice: 499, category: { name: 'Letterheads', slug: 'letterheads' }, isFeatured: true },
          { id: '4', name: 'Tri-fold Brochures', slug: 'tri-fold-brochures', shortDesc: 'Marketing Materials', images: [], basePrice: 799, category: { name: 'Brochures', slug: 'brochures' }, isFeatured: true },
          { id: '5', name: 'Custom Packaging Boxes', slug: 'custom-packaging', shortDesc: 'Branded Packaging', images: [], basePrice: 999, category: { name: 'Packaging', slug: 'packaging' }, isFeatured: true },
          { id: '6', name: 'Vinyl Stickers', slug: 'vinyl-stickers', shortDesc: 'Die-cut Stickers', images: [], basePrice: 299, category: { name: 'Stickers', slug: 'stickers' }, isFeatured: true },
          { id: '7', name: 'Flex Banners', slug: 'flex-banners', shortDesc: 'Large Format', images: [], basePrice: 399, category: { name: 'Banners', slug: 'banners' }, isFeatured: true },
          { id: '8', name: 'Premium Envelopes', slug: 'premium-envelopes', shortDesc: 'Corporate Envelopes', images: [], basePrice: 349, category: { name: 'Envelopes', slug: 'envelopes' }, isFeatured: true },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <section className="py-16 md:py-24 bg-white">
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
            FEATURED
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-navy mb-3"
          >
            Our Best Sellers
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
            Discover our most popular printing products, crafted with premium
            materials and state-of-the-art offset printing technology.
          </motion.p>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border bg-muted/30 animate-pulse h-72"
              />
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                className="group rounded-xl border border-border/60 bg-white overflow-hidden premium-shadow hover:premium-shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() =>
                  navigate('product-detail', { productId: product.id })
                }
              >
                {/* Image area */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-navy/5 to-gold/5 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 rounded-xl bg-navy/5 flex items-center justify-center">
                        <span className="text-navy/20 font-bold text-2xl">
                          MO
                        </span>
                      </div>
                    </div>
                  )}
                  {/* Category badge */}
                  <Badge className="absolute top-3 left-3 bg-white/90 text-navy text-[10px] font-medium backdrop-blur-sm border-0">
                    {product.category.name}
                  </Badge>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-all duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-2.5 premium-shadow">
                      <Eye className="size-4 text-navy" />
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-navy text-sm mb-1 group-hover:text-gold-dark transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-xs mb-3 line-clamp-1">
                    {product.shortDesc || 'Premium Quality Printing'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Starting from
                      </span>
                      <p className="text-gold font-bold text-lg">
                        ₹{product.basePrice.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="gold-gradient text-navy font-semibold text-xs h-8 px-3 hover:opacity-90 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('product-detail', { productId: product.id })
                      }}
                    >
                      View
                      <ArrowRight className="size-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            onClick={() => navigate('products')}
            variant="outline"
            className="border-navy/20 text-navy hover:bg-navy hover:text-white font-semibold px-8 py-5 rounded-xl transition-all"
          >
            View All Products
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
