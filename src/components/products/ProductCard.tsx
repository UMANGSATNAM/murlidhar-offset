'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, Eye, Star, Heart, GitCompare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNavigationStore } from '@/lib/store'
import { useCartStore } from '@/lib/cart-store'
import { useCompareStore } from '@/lib/compare-store'
import { toast } from 'sonner'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    basePrice: number
    comparePrice?: number | null
    images: string[] | string
    category: {
      id: string
      name: string
      slug: string
      icon?: string | null
    }
    shortDesc?: string | null
    isFeatured?: boolean
    minQty?: number
    variants?: Array<{
      id: string
      name: string
      price: number
    }>
  }
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const navigate = useNavigationStore((s) => s.navigate)
  const addItem = useCartStore((s) => s.addItem)
  const compareAddItem = useCompareStore((s) => s.addItem)
  const isInCompare = useCompareStore((s) => s.isInCompare)
  const inCompare = isInCompare(product.id)

  // Parse images if it's a JSON string
  const images: string[] =
    typeof product.images === 'string'
      ? JSON.parse(product.images || '[]')
      : product.images || []

  const mainImage = images[0] || ''
  const hasDiscount =
    product.comparePrice && product.comparePrice > product.basePrice
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.comparePrice! - product.basePrice) / product.comparePrice!) *
          100
      )
    : 0

  // Determine badge
  const badge = product.isFeatured
    ? { text: 'BESTSELLER', className: 'gold-gradient text-navy' }
    : discountPercent > 20
      ? { text: 'HOT DEAL', className: 'bg-red-500 text-white' }
      : discountPercent > 0
        ? { text: 'SALE', className: 'bg-orange-500 text-white' }
        : null

  // Star rating (derived from featured status for demo, or 0)
  const rating = product.isFeatured ? 4.8 : 4.5
  const reviewCount = product.isFeatured ? 128 : 64

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate('product-detail', { productId: product.id })
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.name,
      quantity: product.minQty || 1,
      price: product.basePrice,
      image: mainImage,
      variantName: product.variants?.[0]?.name || 'Standard',
      variantId: product.variants?.[0]?.id || null,
      attrs: {},
    })
    toast.success('Added to cart', {
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    toast.info('Added to Wishlist', {
      description: `${product.name} saved to your wishlist.`,
    })
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (inCompare) {
      useCompareStore.getState().removeItem(product.id)
      toast.info('Removed from comparison')
      return
    }
    const success = compareAddItem({
      productId: product.id,
      name: product.name,
      price: product.basePrice,
      image: mainImage,
      slug: product.slug,
      category: product.category?.name || 'Uncategorized',
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col rounded-xl bg-card premium-shadow hover:premium-shadow-xl transition-smooth overflow-hidden cursor-pointer border border-border/40 gold-glow-hover border-glow-animate card-hover-lift"
      onClick={handleViewDetails}
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-navy/5 to-navy/10">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy via-navy-light to-navy">
            <div className="text-center">
              <div className="text-gold text-4xl font-light mb-1">M</div>
              <div className="text-white/40 text-xs tracking-widest uppercase">
                Murlidhar
              </div>
            </div>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {badge && (
            <Badge className={`${badge.className} font-semibold text-[10px] uppercase tracking-wider border-0 px-2.5 py-0.5`}>
              {badge.text}
            </Badge>
          )}
          {hasDiscount && discountPercent > 0 && (
            <Badge className="bg-red-500 text-white font-semibold text-[10px] uppercase tracking-wider border-0 px-2.5 py-0.5">
              {discountPercent}% OFF
            </Badge>
          )}
        </div>

        {/* Quick Actions - right side */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-gold hover:text-navy transition-colors"
          >
            <Heart className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCompare}
            className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm shadow-md transition-colors ${
              inCompare
                ? 'bg-gold text-navy'
                : 'bg-white/90 hover:bg-gold hover:text-navy'
            }`}
          >
            <GitCompare className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleViewDetails}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-gold hover:text-navy transition-colors"
          >
            <Eye className="h-4 w-4" />
          </motion.button>
        </div>
        {/* Compare badge indicator */}
        {inCompare && (
          <div className="absolute top-3 left-3">
            <Badge className="gold-gradient text-navy font-semibold text-[10px] border-0 px-2 py-0.5 flex items-center gap-1">
              <GitCompare className="size-3" />
              Comparing
            </Badge>
          </div>
        )}

        {/* Quick Add to Cart overlay - bottom */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <Button
            onClick={handleAddToCart}
            className="w-full rounded-none gold-gradient hover-shimmer text-navy font-semibold text-sm h-10 border-0 shadow-lg"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Quick Add to Cart
          </Button>
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/50 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 gap-1.5">
        {/* Category Badge */}
        <Badge
          variant="outline"
          className="w-fit text-[10px] uppercase tracking-wider text-gold border-gold/30 bg-gold/5 font-medium"
        >
          {product.category?.name || 'Uncategorized'}
        </Badge>

        {/* Product Name */}
        <h3 className="font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-gold transition-colors duration-300 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Short Description */}
        {product.shortDesc && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {product.shortDesc}
          </p>
        )}

        {/* Star Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= Math.floor(rating)
                    ? 'fill-gold text-gold'
                    : star - 0.5 <= rating
                      ? 'fill-gold/50 text-gold'
                      : 'fill-muted text-muted'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">
            ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-2 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Starting from
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gold-dark">
                ₹{product.basePrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.comparePrice!.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="flex h-9 w-9 items-center justify-center rounded-lg gold-gradient hover:gold-gradient-shimmer transition-all shadow-md hover:shadow-lg"
          >
            <ShoppingCart className="h-4 w-4 text-navy" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
