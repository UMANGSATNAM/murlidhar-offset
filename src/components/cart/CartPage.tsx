'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ChevronRight,
  ShoppingBag,
  Tag,
  Heart,
  ArrowLeft,
  Gift,
  Truck,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { useCartStore, useCartSubtotal, useCartGstAmount, useCartItemCount } from '@/lib/cart-store'
import { useNavigationStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

const FREE_SHIPPING_THRESHOLD = 999
const SHIPPING_COST = 99

interface SavedItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  variantName: string
  variantId: string | null
  attrs: Record<string, string>
}

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const subtotalVal = useCartSubtotal()
  const gstVal = useCartGstAmount()
  const itemCount = useCartItemCount()
  const { navigate } = useNavigationStore()
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    useCartStore.getState()._hydrate()
    // Use requestAnimationFrame to avoid synchronous setState in effect
    requestAnimationFrame(() => setMounted(true))
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <ShoppingCart className="size-12 text-gold" />
          <p className="text-muted-foreground">Loading your cart...</p>
        </div>
      </div>
    )
  }

  const shipping = subtotalVal >= FREE_SHIPPING_THRESHOLD ? 0 : (items.length > 0 ? SHIPPING_COST : 0)
  const totalVal = subtotalVal + gstVal + shipping - discount

  // Estimated delivery date
  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5)
  const deliveryStr = estimatedDelivery.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })

  const handleApplyCoupon = () => {
    setCouponError('')
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }
    // Demo coupons
    const code = couponCode.toUpperCase().trim()
    if (code === 'WELCOME10') {
      const disc = Math.min(subtotalVal * 0.1, 500)
      setDiscount(disc)
      setCouponApplied(true)
      setCouponError('')
    } else if (code === 'PRINT50') {
      setDiscount(50)
      setCouponApplied(true)
      setCouponError('')
    } else {
      setCouponError('Invalid coupon code')
      setDiscount(0)
      setCouponApplied(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode('')
    setDiscount(0)
    setCouponApplied(false)
    setCouponError('')
  }

  const handleSaveForLater = (item: typeof items[0]) => {
    setSavedItems([...savedItems, { id: item.id, productId: item.productId, name: item.name, price: item.price, image: item.image, variantName: item.variantName, variantId: item.variantId, attrs: item.attrs }])
    removeItem(item.id)
  }

  const handleMoveToCart = (savedItem: SavedItem) => {
    useCartStore.getState().addItem({
      productId: savedItem.productId,
      name: savedItem.name,
      quantity: 1,
      price: savedItem.price,
      image: savedItem.image,
      variantName: savedItem.variantName,
      variantId: savedItem.variantId,
      attrs: savedItem.attrs,
    })
    setSavedItems(savedItems.filter(i => i.id !== savedItem.id))
  }

  const handleRemoveSaved = (id: string) => {
    setSavedItems(savedItems.filter(i => i.id !== id))
  }

  // Free shipping progress
  const shippingProgress = Math.min((subtotalVal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const amountForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotalVal, 0)

  // Empty cart state
  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <button onClick={() => navigate('home')} className="hover:text-gold transition-colors">Home</button>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-medium">Cart</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20"
          >
            {/* Sad cart animation */}
            <div className="relative mb-8">
              <motion.div
                className="w-36 h-36 rounded-full bg-gold-muted flex items-center justify-center"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ShoppingCart className="size-16 text-gold" />
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-background border-2 border-gold flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
              >
                <span className="text-sm font-bold text-gold">0</span>
              </motion.div>
              {/* Sad face overlay */}
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-lg">😢</span>
              </motion.div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Your Cart is Empty</h2>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              Looks like you haven&apos;t added any printing products to your cart yet. Start exploring our premium collection!
            </p>
            <Button
              onClick={() => navigate('products')}
              className="gold-gradient font-semibold px-8 py-3 h-12 text-base gold-shadow hover:opacity-90 transition-opacity"
            >
              <ShoppingBag className="size-5 mr-2" />
              Shop Now
            </Button>

            {/* You Might Also Like Section */}
            <motion.div
              className="mt-16 w-full max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-6 justify-center">
                <Sparkles className="size-5 text-gold" />
                <h3 className="text-lg font-semibold text-foreground">You Might Also Like</h3>
                <div className="h-0.5 w-16 gold-gradient rounded-full" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'Business Cards', price: '₹499', emoji: '💳' },
                  { name: 'Wedding Cards', price: '₹1,499', emoji: '💒' },
                  { name: 'Brochures', price: '₹799', emoji: '📄' },
                  { name: 'Stickers', price: '₹299', emoji: '🏷️' },
                ].map((product, idx) => (
                  <motion.button
                    key={product.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    whileHover={{ y: -4 }}
                    onClick={() => navigate('products')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card premium-shadow gold-border hover:gold-border-glow transition-smooth"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold-muted flex items-center justify-center text-xl">
                      {product.emoji}
                    </div>
                    <p className="text-sm font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-gold font-semibold">{product.price}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
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
          <button onClick={() => navigate('home')} className="hover:text-gold transition-colors">Home</button>
          <ChevronRight className="size-3" />
          <span className="text-foreground font-medium">Cart</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <ShoppingCart className="size-7 text-gold" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Shopping Cart</h1>
            <Badge variant="secondary" className="ml-2">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </Badge>
          </div>

          {/* Free Shipping Progress Bar */}
          {items.length > 0 && shipping > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-gold/5 border border-gold/15"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="size-4 text-gold" />
                  <span className="font-medium text-foreground">
                    {amountForFreeShipping > 0
                      ? `Add ₹${amountForFreeShipping.toLocaleString()} more for FREE shipping!`
                      : 'You qualify for FREE shipping!'}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">₹{subtotalVal.toLocaleString()} / ₹{FREE_SHIPPING_THRESHOLD}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full gold-gradient"
                  initial={{ width: 0 }}
                  animate={{ width: `${shippingProgress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="premium-shadow hover-lift overflow-hidden">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="size-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3
                                  className="font-semibold text-foreground text-sm sm:text-base cursor-pointer hover:text-gold transition-colors line-clamp-2"
                                  onClick={() => navigate('product-detail', { productId: item.productId })}
                                >
                                  {item.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{item.variantName}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="flex-shrink-0 text-muted-foreground hover:text-destructive h-8 w-8"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>

                            {/* Variant Attributes */}
                            {Object.keys(item.attrs).length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {Object.entries(item.attrs).map(([key, value]) => (
                                  <Badge key={key} variant="outline" className="text-[10px] sm:text-xs py-0">
                                    {key}: {value}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Quantity & Price Row */}
                            <div className="flex items-center justify-between mt-3 gap-4">
                              {/* Quantity Selector */}
                              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="h-8 w-8 flex items-center justify-center hover:bg-gold/10 hover:text-gold transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="size-3.5" />
                                </button>
                                <span className="h-8 w-10 flex items-center justify-center text-sm font-medium border-x border-border">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="h-8 w-8 flex items-center justify-center hover:bg-gold/10 hover:text-gold transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="size-3.5" />
                                </button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">₹{item.price.toLocaleString()} × {item.quantity}</p>
                                <p className="font-bold text-foreground text-sm sm:text-base">₹{(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                            </div>

                            {/* Save for Later */}
                            <div className="mt-2">
                              <button
                                onClick={() => handleSaveForLater(item)}
                                className="text-xs text-muted-foreground hover:text-gold transition-colors flex items-center gap-1"
                              >
                                <Heart className="size-3" />
                                Save for Later
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Saved for Later */}
              {savedItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="size-5 text-gold" />
                    <h3 className="text-lg font-semibold text-foreground">Saved for Later</h3>
                    <Badge variant="secondary">{savedItems.length}</Badge>
                  </div>
                  <div className="space-y-3">
                    {savedItems.map((item) => (
                      <Card key={item.id} className="border-dashed">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="size-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.variantName}</p>
                              <p className="text-sm font-semibold text-gold mt-1">₹{item.price.toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMoveToCart(item)}
                                className="text-xs"
                              >
                                Move to Cart
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleRemoveSaved(item.id)}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="premium-shadow-lg overflow-hidden">
                  <CardHeader className="bg-navy text-white pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Tag className="size-5 text-gold" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {/* Subtotal */}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">₹{subtotalVal.toLocaleString()}</span>
                    </div>

                    {/* GST */}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GST (18%)</span>
                      <span className="font-medium">₹{gstVal.toLocaleString()}</span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      {shipping === 0 ? (
                        <span className="font-medium text-green-600 flex items-center gap-1">
                          <Truck className="size-3" /> FREE
                        </span>
                      ) : (
                        <span className="font-medium">₹{shipping}</span>
                      )}
                    </div>

                    {/* Discount */}
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Discount</span>
                        <span className="font-medium text-green-600">-₹{discount.toLocaleString()}</span>
                      </div>
                    )}

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-xl font-bold gold-gradient-text">₹{totalVal.toLocaleString()}</span>
                    </div>

                    {/* Estimated Delivery */}
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-gold/5 border border-gold/10">
                      <Calendar className="size-4 text-gold shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                        <p className="text-sm font-semibold text-foreground">{deliveryStr}</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Coupon Code */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Coupon Code</label>
                      {couponApplied ? (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-2.5">
                          <Tag className="size-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700 flex-1">{couponCode.toUpperCase()}</span>
                          <button
                            onClick={handleRemoveCoupon}
                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter code"
                            value={couponCode}
                            onChange={(e) => { setCouponCode(e.target.value); setCouponError('') }}
                            className="h-9 text-sm flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleApplyCoupon}
                            className="h-9 px-3 border-gold/30 text-gold hover:bg-gold/10"
                          >
                            Apply
                          </Button>
                        </div>
                      )}
                      {couponError && (
                        <p className="text-xs text-destructive mt-1">{couponError}</p>
                      )}
                      {!couponApplied && !couponError && (
                        <p className="text-[10px] text-muted-foreground mt-1">Try: WELCOME10 or PRINT50</p>
                      )}
                    </div>

                    <Separator />

                    {/* Proceed to Checkout */}
                    <Button
                      onClick={() => navigate('checkout')}
                      className="w-full gold-gradient font-semibold py-3 h-12 text-base gold-shadow hover:opacity-90 transition-opacity"
                      disabled={items.length === 0}
                    >
                      Proceed to Checkout
                      <ChevronRight className="size-4 ml-1" />
                    </Button>

                    {/* Continue Shopping */}
                    <Button
                      variant="ghost"
                      onClick={() => navigate('products')}
                      className="w-full text-muted-foreground hover:text-gold"
                    >
                      <ArrowLeft className="size-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </CardContent>
                </Card>

                {/* Trust Badges */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { icon: '🔒', label: 'Secure Checkout' },
                    { icon: '🚚', label: 'Free Shipping 999+' },
                    { icon: '↩️', label: 'Easy Returns' },
                  ].map((badge) => (
                    <div key={badge.label} className="text-center p-2 rounded-lg bg-muted/50">
                      <span className="text-lg">{badge.icon}</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{badge.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
