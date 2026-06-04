'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  Home,
  Star,
  Heart,
  ShoppingCart,
  MessageSquareQuote,
  Upload,
  Share2,
  ZoomIn,
  ChevronRight as ChevronRightIcon,
  Clock,
  Shield,
  Truck,
  CheckCircle,
  Package,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useNavigationStore } from '@/lib/store'
import { useCartStore } from '@/lib/cart-store'
import { toast } from 'sonner'
import DynamicPricing, { SelectedConfig } from './DynamicPricing'
import ProductCard from './ProductCard'

interface Review {
  id: string
  rating: number
  title?: string | null
  comment?: string | null
  createdAt: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

interface FAQ {
  id: string
  question: string
  answer: string
}

interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  shortDesc?: string | null
  basePrice: number
  comparePrice?: number | null
  images: string[] | string
  isFeatured?: boolean
  isCustomizable?: boolean
  minQty: number
  maxQty: number
  productionDays: number
  templateType: string
  category: {
    id: string
    name: string
    slug: string
    icon?: string | null
  }
  variants: Array<{
    id: string
    name: string
    sku?: string | null
    price: number
    stock: number
    isActive: boolean
    image?: string | null
    attrs: Record<string, string>
  }>
  variantOptions: Array<{
    id: string
    type: string
    label: string
    values: string[]
    required: boolean
    sortOrder: number
  }>
  quantityPrices: Array<{
    id: string
    minQty: number
    maxQty: number
    pricePer: number
    discount: number
  }>
  faqs: FAQ[]
  reviews: Review[]
}

export default function ProductDetail() {
  const { productId, navigate } = useNavigationStore()
  const addItem = useCartStore((s) => s.addItem)

  const [product, setProduct] = useState<Product | null>(null)
  const [reviewStats, setReviewStats] = useState({ average: 0, count: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [priceConfig, setPriceConfig] = useState<SelectedConfig | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Array<Record<string, unknown>>>([])
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [isZooming, setIsZooming] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  // Parse images
  const images: string[] = useMemo(() => {
    if (!product) return []
    return typeof product.images === 'string'
      ? JSON.parse(product.images || '[]')
      : product.images || []
  }, [product])

  // Fetch product
  const fetchProduct = useCallback(async () => {
    if (!productId) return

    try {
      const res = await fetch(`/api/products/${productId}`)
      const data = await res.json()
      if (data.product) {
        setProduct(data.product as Product)
        setReviewStats(data.reviewStats || { average: 0, count: 0 })
      }
    } catch {
      toast.error('Failed to load product')
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  // Fetch related products
  useEffect(() => {
    if (!product?.category?.slug) return

    fetch(`/api/products?category=${product.category.slug}&limit=4`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setRelatedProducts(
            data.products.filter((p: { id: string }) => p.id !== product.id)
          )
        }
      })
      .catch(() => {})
  }, [product])

  // Handle zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  // Add to cart
  const handleAddToCart = () => {
    if (!product || !priceConfig) return

    addItem({
      productId: product.id,
      name: product.name,
      quantity: priceConfig.quantity,
      price: priceConfig.unitPrice,
      image: images[0] || '',
      variantName: `${priceConfig.material} · ${priceConfig.size} · ${priceConfig.finish}`,
      variantId: priceConfig.variantId,
      attrs: {
        material: priceConfig.material,
        size: priceConfig.size,
        finish: priceConfig.finish,
      },
    })
    toast.success('Added to Cart', {
      description: `${product.name} (×${priceConfig.quantity}) added to your cart.`,
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="flex gap-3 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 w-20 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Not found
  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gold mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Product Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button
            onClick={() => navigate('products')}
            className="gold-gradient text-navy font-semibold rounded-lg"
          >
            Browse Products
          </Button>
        </div>
      </div>
    )
  }

  const hasDiscount =
    product.comparePrice && product.comparePrice > product.basePrice
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.comparePrice! - product.basePrice) /
          product.comparePrice!) *
          100
      )
    : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header Breadcrumb */}
      <div className="navy-gradient-deep py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-1.5 text-white/60 hover:text-gold transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </button>
            <ChevronRight className="h-3 w-3 text-white/40" />
            <button
              onClick={() =>
                navigate('products', {
                  categorySlug: product.category?.slug || null,
                })
              }
              className="text-white/60 hover:text-gold transition-colors"
            >
              {product.category?.name || 'Products'}
            </button>
            <ChevronRight className="h-3 w-3 text-white/40" />
            <span className="text-gold font-medium truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* LEFT COLUMN — Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            {/* Main Image */}
            <div
              ref={imageRef}
              className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-navy/5 to-navy/10 premium-shadow-lg gold-border cursor-crosshair"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              {images[selectedImageIndex] ? (
                <>
                  <img
                    src={images[selectedImageIndex]}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300"
                    style={
                      isZooming
                        ? {
                            transform: 'scale(2)',
                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          }
                        : {}
                    }
                  />
                  {/* Zoom indicator */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-xs">
                    <ZoomIn className="h-3.5 w-3.5" />
                    Hover to zoom
                  </div>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy via-navy-light to-navy">
                  <div className="text-center">
                    <div className="text-gold text-6xl font-light mb-2">M</div>
                    <div className="text-white/40 text-sm tracking-widest uppercase">
                      Murlidhar Offset
                    </div>
                  </div>
                </div>
              )}

              {/* Discount badge */}
              {hasDiscount && discountPercent > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white font-bold text-sm border-0 px-3 py-1">
                  {discountPercent}% OFF
                </Badge>
              )}

              {/* Featured badge */}
              {product.isFeatured && (
                <Badge className="absolute bottom-4 left-4 gold-gradient text-navy font-semibold border-0 px-3 py-1">
                  ★ Featured
                </Badge>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-20 w-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-gold gold-shadow'
                        : 'border-transparent hover:border-gold/40'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                {
                  icon: Shield,
                  label: 'Quality Guarantee',
                  sub: '100% satisfaction',
                },
                {
                  icon: Truck,
                  label: 'Fast Delivery',
                  sub: `${product.productionDays || 3} day production`,
                },
                {
                  icon: CheckCircle,
                  label: 'Secure Payment',
                  sub: 'SSL encrypted',
                },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center text-center p-3 rounded-lg bg-gold/5 border border-gold/10"
                >
                  <badge.icon className="h-5 w-5 text-gold mb-1.5" />
                  <span className="text-[11px] font-semibold text-foreground leading-tight">
                    {badge.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {badge.sub}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT COLUMN — Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:w-1/2"
          >
            {/* Category Badge */}
            <Badge
              variant="outline"
              className="text-[10px] uppercase tracking-wider text-gold border-gold/30 bg-gold/5 font-medium mb-3"
            >
              {product.category?.name || 'Uncategorized'}
            </Badge>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-3">
              {product.name}
            </h1>

            {/* Short Description */}
            {product.shortDesc && (
              <p className="text-muted-foreground text-sm mb-4">
                {product.shortDesc}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(reviewStats.average)
                        ? 'fill-gold text-gold'
                        : 'fill-muted text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {reviewStats.average > 0
                  ? `${reviewStats.average} (${reviewStats.count} review${reviewStats.count !== 1 ? 's' : ''})`
                  : 'No reviews yet'}
              </span>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-sm text-muted-foreground">
                Starting from
              </span>
              <span className="text-3xl font-bold text-foreground">
                ₹{product.basePrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹{product.comparePrice!.toLocaleString('en-IN')}
                </span>
              )}
              {hasDiscount && (
                <Badge className="bg-green-500/10 text-green-600 text-xs border-0">
                  Save {discountPercent}%
                </Badge>
              )}
            </div>

            {/* Customizable Badge */}
            {product.isCustomizable && (
              <div className="flex items-center gap-2 mb-5 p-3 rounded-lg bg-gold/5 border border-gold/15">
                <Clock className="h-4 w-4 text-gold" />
                <span className="text-xs font-medium text-foreground">
                  This product is customizable. Select your preferences below.
                </span>
              </div>
            )}

            <Separator className="bg-gold/10 mb-6" />

            {/* Dynamic Pricing Section */}
            <DynamicPricing
              product={{
                id: product.id,
                basePrice: product.basePrice,
                comparePrice: product.comparePrice,
                minQty: product.minQty,
                maxQty: product.maxQty,
                productionDays: product.productionDays,
                variantOptions: product.variantOptions,
                variants: product.variants,
                quantityPrices: product.quantityPrices,
              }}
              onPriceChange={setPriceConfig}
            />

            <Separator className="bg-gold/10 my-6" />

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full gold-gradient hover:gold-gradient-shimmer text-navy font-bold text-base h-13 rounded-xl gold-shadow"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart — ₹
                {priceConfig
                  ? priceConfig.total.toLocaleString('en-IN', {
                      maximumFractionDigits: 2,
                    })
                  : product.basePrice.toLocaleString('en-IN')}
              </Button>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-gold/30 text-gold hover:bg-gold/10 font-semibold rounded-xl h-11"
                  onClick={() =>
                    toast.info('Custom Quote', {
                      description:
                        'Our team will reach out to you shortly for a custom quote.',
                    })
                  }
                >
                  <MessageSquareQuote className="h-4 w-4 mr-2" />
                  Get Custom Quote
                </Button>
                <Button
                  variant="outline"
                  className="border-gold/30 text-gold hover:bg-gold/10 font-semibold rounded-xl h-11"
                  onClick={() =>
                    toast.info('Upload Design', {
                      description:
                        'Upload your design file and we\'ll handle the rest.',
                    })
                  }
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Design
                </Button>
              </div>

              {/* Wishlist & Share */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsWishlisted(!isWishlisted)
                    toast.success(
                      isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist',
                      {
                        description: product.name,
                      }
                    )
                  }}
                  className="text-muted-foreground hover:text-gold"
                >
                  <Heart
                    className={`h-5 w-5 mr-2 transition-colors ${
                      isWishlisted
                        ? 'fill-red-500 text-red-500'
                        : ''
                    }`}
                  />
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success('Link copied to clipboard!')
                  }}
                  className="text-muted-foreground hover:text-gold"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 sm:mt-16"
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full flex h-auto p-1 bg-muted/50 rounded-xl overflow-x-auto">
              {[
                { value: 'description', label: 'Description' },
                { value: 'specifications', label: 'Specifications' },
                { value: 'pricing', label: 'Pricing Tiers' },
                { value: 'faqs', label: 'FAQs' },
                { value: 'reviews', label: `Reviews (${reviewStats.count})` },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 data-[state=active]:gold-gradient data-[state=active]:text-navy data-[state=active]:font-semibold data-[state=active]:shadow-md rounded-lg text-xs sm:text-sm py-2.5 px-3 min-w-fit"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="mt-6">
              <div className="rounded-xl bg-card premium-shadow gold-border p-6 sm:p-8">
                {product.description ? (
                  <div
                    className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-gold prose-strong:text-foreground"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No detailed description available for this product yet.
                    Please contact us for more information.
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specifications" className="mt-6">
              <div className="rounded-xl bg-card premium-shadow gold-border p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Product Specifications
                </h3>
                <div className="space-y-3">
                  {product.variantOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-start justify-between py-3 border-b border-gold/10 last:border-0"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {option.label}
                      </span>
                      <span className="text-sm text-muted-foreground text-right max-w-[60%]">
                        {option.values.join(', ')}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-start justify-between py-3 border-b border-gold/10">
                    <span className="text-sm font-medium text-foreground">
                      Minimum Order
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {product.minQty} pieces
                    </span>
                  </div>
                  <div className="flex items-start justify-between py-3 border-b border-gold/10">
                    <span className="text-sm font-medium text-foreground">
                      Maximum Order
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {product.maxQty.toLocaleString('en-IN')} pieces
                    </span>
                  </div>
                  <div className="flex items-start justify-between py-3 border-b border-gold/10">
                    <span className="text-sm font-medium text-foreground">
                      Production Time
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {product.productionDays} business days
                    </span>
                  </div>
                  <div className="flex items-start justify-between py-3">
                    <span className="text-sm font-medium text-foreground">
                      Customizable
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {product.isCustomizable ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Pricing Tiers Tab */}
            <TabsContent value="pricing" className="mt-6">
              <div className="rounded-xl bg-card premium-shadow gold-border p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Quantity Pricing Tiers
                </h3>
                {product.quantityPrices.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gold/20">
                          <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                            Quantity Range
                          </th>
                          <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                            Price per Unit
                          </th>
                          <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                            Discount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.quantityPrices.map((tier) => (
                          <tr
                            key={tier.id}
                            className="border-b border-gold/5 hover:bg-gold/5 transition-colors"
                          >
                            <td className="py-3 px-4 font-medium text-foreground">
                              {tier.minQty.toLocaleString('en-IN')}
                              {tier.maxQty >= 99999
                                ? '+'
                                : ` – ${tier.maxQty.toLocaleString('en-IN')}`}{' '}
                              pcs
                            </td>
                            <td className="py-3 px-4 text-foreground">
                              ₹
                              {(tier.pricePer > 0
                                ? tier.pricePer
                                : product.basePrice *
                                  (1 - tier.discount / 100)
                              ).toLocaleString('en-IN', {
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="py-3 px-4">
                              {tier.discount > 0 ? (
                                <Badge className="bg-green-500/10 text-green-600 text-xs border-0">
                                  {tier.discount}% OFF
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-xs">
                                  —
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No quantity pricing tiers available for this product.
                    Contact us for bulk pricing.
                  </p>
                )}
              </div>
            </TabsContent>

            {/* FAQs Tab */}
            <TabsContent value="faqs" className="mt-6">
              <div className="rounded-xl bg-card premium-shadow gold-border p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Frequently Asked Questions
                </h3>
                {product.faqs.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {product.faqs.map((faq, idx) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border-gold/10"
                      >
                        <AccordionTrigger className="text-sm font-medium text-foreground hover:text-gold text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No FAQs available for this product yet. Feel free to contact
                    us with your questions.
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6">
              <div className="rounded-xl bg-card premium-shadow gold-border p-6 sm:p-8">
                {/* Rating Summary */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold gold-gradient-text">
                      {reviewStats.average.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.round(reviewStats.average)
                              ? 'fill-gold text-gold'
                              : 'fill-muted text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {reviewStats.count} review
                      {reviewStats.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Separator
                    orientation="vertical"
                    className="h-16 bg-gold/10"
                  />
                  <div className="flex-1">
                    <Button
                      variant="outline"
                      className="border-gold/30 text-gold hover:bg-gold/10 rounded-lg"
                      onClick={() =>
                        toast.info('Coming Soon', {
                          description:
                            'Review submission will be available soon.',
                        })
                      }
                    >
                      Write a Review
                    </Button>
                  </div>
                </div>

                <Separator className="bg-gold/10 mb-6" />

                {/* Reviews List */}
                {product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gold/5 pb-5 last:border-0"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3.5 w-3.5 ${
                                  star <= review.rating
                                    ? 'fill-gold text-gold'
                                    : 'fill-muted text-muted'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString(
                              'en-IN',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                        {review.title && (
                          <h4 className="text-sm font-semibold text-foreground mb-1">
                            {review.title}
                          </h4>
                        )}
                        {review.comment && (
                          <p className="text-sm text-muted-foreground">
                            {review.comment}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          — {review.user.name || 'Anonymous'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-10 w-10 text-gold/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      No reviews yet. Be the first to review this product!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 sm:mt-16"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Related Products
                </h2>
                <div className="h-0.5 w-12 gold-gradient rounded-full mt-2" />
              </div>
              <Button
                variant="ghost"
                onClick={() =>
                  navigate('products', {
                    categorySlug: product.category?.slug || null,
                  })
                }
                className="text-gold hover:text-gold-light"
              >
                View All
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(
                (p, idx) =>
                  idx < 4 && (
                    <ProductCard
                      key={p.id as string}
                      product={p as Parameters<typeof ProductCard>[0]['product']}
                      index={idx}
                    />
                  )
              )}
            </div>
          </motion.div>
        )}

        {/* Recently Viewed Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 sm:mt-16 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-5 w-5 text-gold" />
            <h2 className="text-lg font-semibold text-foreground">
              You Might Also Like
            </h2>
            <div className="h-0.5 flex-1 gold-gradient rounded-full opacity-20" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              'Business Cards',
              'Wedding Cards',
              'Brochures',
              'Letterheads',
              'Envelopes',
              'Stickers',
            ].map((name, idx) => (
              <motion.button
                key={name}
                whileHover={{ y: -3 }}
                onClick={() => navigate('products')}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card premium-shadow gold-border hover:gold-border-glow transition-smooth"
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
                  <span className="text-gold text-sm font-bold">
                    {name[0]}
                  </span>
                </div>
                <span className="text-xs font-medium text-foreground text-center">
                  {name}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
