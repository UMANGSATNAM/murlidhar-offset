'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, ShoppingCart, Star, Heart, GitCompare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/lib/store'
import { useCartStore } from '@/lib/cart-store'
import { useCompareStore } from '@/lib/compare-store'
import { toast } from 'sonner'

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
  const addItem = useCartStore((s) => s.addItem)
  const compareAddItem = useCompareStore((s) => s.addItem)
  const isInCompare = useCompareStore((s) => s.isInCompare)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?featured=true&limit=8')
        const data = await res.json()
        setProducts(data.products || [])
      } catch {
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

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.name,
      quantity: 1,
      price: product.basePrice,
      image: product.images?.[0] || '',
      variantName: 'Standard',
      variantId: null,
      attrs: {},
    })
    toast.success('Added to cart', {
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleCompare = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation()
    if (isInCompare(product.id)) {
      useCompareStore.getState().removeItem(product.id)
      toast.info('Removed from comparison')
      return
    }
    const success = compareAddItem({
      productId: product.id,
      name: product.name,
      price: product.basePrice,
      image: product.images?.[0] || '',
      slug: product.slug,
      category: product.category.name,
      materials: [],
      sizes: [],
      finishes: [],
      turnaround: '3-5 Business Days',
    })
    if (!success) {
      toast.error('Compare list is full', {
        description: 'You can compare up to 3 products at a time. Remove one to add another.',
      })
    } else {
      toast.success('Added to comparison', {
        description: `${product.name} added. Click the compare icon in the header to view.`,
      })
    }
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#F8F9FA] to-white relative">
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
            className="text-3xl md:text-4xl font-bold mb-3 text-gradient-animate"
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
            className="text-muted-foreground text-base max-w-2xl mx-auto"
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
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                className="group rounded-xl border border-border/40 bg-white overflow-hidden shadow-[0_4px_20px_-4px_rgba(13,27,61,0.08)] hover:premium-shadow-xl transition-all duration-300 cursor-pointer gold-glow-hover border-glow-animate card-hover-lift"
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
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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

                  {/* Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <Badge className="gold-gradient text-navy font-semibold text-[10px] uppercase tracking-wider border-0 px-2.5 py-0.5">
                      {product.isFeatured ? 'BESTSELLER' : 'NEW'}
                    </Badge>
                    <Badge className="bg-white/90 text-navy text-[10px] font-medium backdrop-blur-sm border-0">
                      {product.category.name}
                    </Badge>
                  </div>

                  {/* Hover actions - right side */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation() }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-gold hover:text-navy transition-colors"
                    >
                      <Heart className="h-3.5 w-3.5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleCompare(e, product)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm shadow-md transition-colors ${
                        isInCompare(product.id)
                          ? 'bg-gold text-navy'
                          : 'bg-white/90 hover:bg-gold hover:text-navy'
                      }`}
                    >
                      <GitCompare className="h-3.5 w-3.5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate('product-detail', { productId: product.id })}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-gold hover:text-navy transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </motion.button>
                  </div>

                  {/* Quick Add to Cart overlay - bottom */}
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                    <Button
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="w-full rounded-none gold-gradient hover-shimmer text-navy font-semibold text-sm h-9 border-0 shadow-lg"
                    >
                      <ShoppingCart className="size-3.5 mr-1.5" />
                      Quick Add to Cart
                    </Button>
                  </div>

                  {/* Bottom gradient overlay for text readability */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-navy/30 via-navy/10 to-transparent group-hover:from-navy/50 transition-colors duration-300 pointer-events-none" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-navy text-sm mb-1 group-hover:text-gold-dark transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-1">
                    {product.shortDesc || 'Premium Quality Printing'}
                  </p>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`size-3 ${
                            star <= 4
                              ? 'fill-gold text-gold'
                              : 'fill-gold/40 text-gold/40'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      ({64 + idx * 12})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Starting from
                      </span>
                      <p className="text-gold-dark font-bold text-lg leading-tight">
                        ₹{product.basePrice.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="gold-gradient hover-shimmer text-navy font-semibold text-xs h-8 px-3 hover:opacity-90 transition-opacity"
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
            className="border-navy/20 text-navy hover:bg-navy hover:text-white font-semibold px-8 py-5 rounded-xl transition-all hover-shimmer"
          >
            View All Products
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
