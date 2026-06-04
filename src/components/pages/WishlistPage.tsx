'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Trash2,
  ShoppingCart,
  ShoppingBag,
  ChevronRight,
  ArrowLeft,
  X,
  Package,
  Sparkles,
} from 'lucide-react'
import { useWishlistStore, useWishlistCount } from '@/lib/wishlist-store'
import { useCartStore } from '@/lib/cart-store'
import { useNavigationStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items)
  const removeItem = useWishlistStore((s) => s.removeItem)
  const clearWishlist = useWishlistStore((s) => s.clearWishlist)
  const wishlistCount = useWishlistCount()
  const addCartItem = useCartStore((s) => s.addItem)
  const { navigate } = useNavigationStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    useWishlistStore.getState()._hydrate()
    useCartStore.getState()._hydrate()
    requestAnimationFrame(() => setMounted(true))
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Heart className="size-12 text-gold" />
          <p className="text-muted-foreground">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  const handleMoveToCart = (item: typeof items[0]) => {
    addCartItem({
      productId: item.productId,
      name: item.name,
      quantity: 1,
      price: item.price,
      image: item.image,
      variantName: 'Standard',
      variantId: null,
      attrs: {},
    })
    removeItem(item.productId)
    toast.success('Moved to Cart', {
      description: `${item.name} has been moved to your cart.`,
    })
  }

  const handleRemove = (productId: string, name: string) => {
    removeItem(productId)
    toast.success('Removed from Wishlist', {
      description: name,
    })
  }

  const handleClearAll = () => {
    clearWishlist()
    toast.success('Wishlist Cleared', {
      description: 'All items have been removed from your wishlist.',
    })
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <button onClick={() => navigate('home')} className="hover:text-gold transition-colors">
              Home
            </button>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-medium">Wishlist</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-full bg-gold-muted flex items-center justify-center">
                <Heart className="size-16 text-gold" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-gold flex items-center justify-center">
                <span className="text-xs font-bold text-gold">0</span>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Your Wishlist is Empty
            </h2>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              Save your favorite printing products here for later. Browse our premium collection and tap the heart icon to add items!
            </p>
            <Button
              onClick={() => navigate('products')}
              className="gold-gradient font-semibold px-8 py-3 h-12 text-base gold-shadow hover:opacity-90 transition-opacity"
            >
              <ShoppingBag className="size-5 mr-2" />
              Browse Products
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <button onClick={() => navigate('home')} className="hover:text-gold transition-colors">
            Home
          </button>
          <ChevronRight className="size-3" />
          <span className="text-foreground font-medium">Wishlist</span>
        </nav>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center premium-shadow">
                <Heart className="size-6 text-navy fill-navy" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Wishlist</h1>
                  <Badge className="gold-gradient text-navy font-bold text-xs border-0 px-2.5 py-0.5">
                    {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Products you love, saved for later
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('products')}
                className="border-gold/30 text-gold hover:bg-gold/10 font-semibold rounded-lg"
              >
                <ArrowLeft className="size-4 mr-1.5" />
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="border-destructive/30 text-destructive hover:bg-destructive/10 font-semibold rounded-lg"
              >
                <Trash2 className="size-4 mr-1.5" />
                Clear All
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, height: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <Card className="group premium-shadow hover-lift gold-border overflow-hidden">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-navy/5 to-navy/10">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy via-navy-light to-navy">
                        <div className="text-center">
                          <div className="text-gold text-4xl font-light mb-1">M</div>
                          <div className="text-white/40 text-[8px] tracking-widest uppercase">
                            Murlidhar
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors duration-300" />

                    {/* Remove button - top right */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemove(item.productId, item.name)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center text-destructive hover:bg-destructive hover:text-white transition-colors shadow-md"
                      aria-label={`Remove ${item.name} from wishlist`}
                    >
                      <X className="size-4" />
                    </motion.button>

                    {/* Wishlist heart badge - top left */}
                    <div className="absolute top-3 left-3">
                      <div className="w-8 h-8 rounded-full bg-red-500/90 backdrop-blur-sm flex items-center justify-center shadow-md">
                        <Heart className="size-4 text-white fill-white" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    {/* Product Name */}
                    <h3
                      className="font-semibold text-foreground text-sm sm:text-base line-clamp-2 cursor-pointer hover:text-gold transition-colors mb-1"
                      onClick={() => navigate('product-detail', { productId: item.productId })}
                    >
                      {item.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-lg font-bold gold-gradient-text">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-muted-foreground">onwards</span>
                    </div>

                    {/* Added date */}
                    <p className="text-[11px] text-muted-foreground mb-3 flex items-center gap-1">
                      <Sparkles className="size-3 text-gold" />
                      Added {new Date(item.addedAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>

                    <Separator className="bg-gold/10 mb-3" />

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleMoveToCart(item)}
                        size="sm"
                        className="flex-1 gold-gradient text-navy font-semibold text-xs h-9 rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <ShoppingCart className="size-3.5 mr-1.5" />
                        Move to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('product-detail', { productId: item.productId })}
                        className="border-gold/30 text-gold hover:bg-gold/10 font-semibold text-xs h-9 rounded-lg"
                      >
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-12 mb-8"
        >
          <Card className="navy-gradient-deep overflow-hidden">
            <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center premium-shadow shrink-0">
                  <Package className="size-7 text-navy" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Want More Options?</h3>
                  <p className="text-sm text-white/70 mt-0.5">
                    Explore our full range of premium printing products
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate('products')}
                className="gold-gradient text-navy font-bold px-6 py-3 h-12 gold-shadow hover:opacity-90 transition-opacity shrink-0"
              >
                <ShoppingBag className="size-5 mr-2" />
                Browse All Products
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
