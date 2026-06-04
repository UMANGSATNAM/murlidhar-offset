'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitCompare,
  X,
  ShoppingCart,
  Package,
  ArrowRight,
  Trash2,
  Plus,
  Ruler,
  Palette,
  Clock,
  Tag,
  Layers,
  Image as ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useNavigationStore } from '@/lib/store'
import { useCompareStore, useCompareCount } from '@/lib/compare-store'
import { useCartStore } from '@/lib/cart-store'
import { toast } from 'sonner'

export default function ComparePage() {
  const navigate = useNavigationStore((s) => s.navigate)
  const items = useCompareStore((s) => s.items)
  const removeItem = useCompareStore((s) => s.removeItem)
  const clearAll = useCompareStore((s) => s.clearAll)
  const compareCount = useCompareCount()
  const addItemToCart = useCartStore((s) => s.addItem)

  const handleAddToCart = (item: typeof items[0]) => {
    addItemToCart({
      productId: item.productId,
      name: item.name,
      quantity: 1,
      price: item.price,
      image: item.image,
      variantName: 'Standard',
      variantId: null,
      attrs: {},
    })
    toast.success('Added to cart', {
      description: `${item.name} has been added to your cart.`,
    })
  }

  const handleRemoveItem = (productId: string) => {
    removeItem(productId)
    toast.info('Removed from comparison')
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)

  // Comparison rows
  const comparisonRows = [
    { label: 'Image', icon: ImageIcon, key: 'image' as const },
    { label: 'Category', icon: Tag, key: 'category' as const },
    { label: 'Base Price', icon: Package, key: 'price' as const },
    { label: 'Materials', icon: Layers, key: 'materials' as const },
    { label: 'Sizes', icon: Ruler, key: 'sizes' as const },
    { label: 'Finishes', icon: Palette, key: 'finishes' as const },
    { label: 'Turnaround', icon: Clock, key: 'turnaround' as const },
  ]

  const renderCellValue = (item: typeof items[0], key: string) => {
    switch (key) {
      case 'image':
        return (
          <div className="aspect-square w-full max-w-[200px] mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-navy/5 to-gold/5 border border-border/40">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-14 h-14 rounded-xl bg-navy/5 flex items-center justify-center">
                  <span className="text-navy/20 font-bold text-xl">MO</span>
                </div>
              </div>
            )}
          </div>
        )
      case 'price':
        return (
          <span className="text-lg font-bold gold-gradient-text">
            {formatCurrency(item.price)}
          </span>
        )
      case 'materials':
        return (
          <div className="flex flex-wrap gap-1 justify-center">
            {item.materials.length > 0 ? (
              item.materials.map((m) => (
                <Badge key={m} variant="outline" className="text-xs border-gold/30 text-navy">
                  {m}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Standard</span>
            )}
          </div>
        )
      case 'sizes':
        return (
          <div className="flex flex-wrap gap-1 justify-center">
            {item.sizes.length > 0 ? (
              item.sizes.map((s) => (
                <Badge key={s} variant="outline" className="text-xs border-gold/30 text-navy">
                  {s}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Standard</span>
            )}
          </div>
        )
      case 'finishes':
        return (
          <div className="flex flex-wrap gap-1 justify-center">
            {item.finishes.length > 0 ? (
              item.finishes.map((f) => (
                <Badge key={f} variant="outline" className="text-xs border-gold/30 text-navy">
                  {f}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Standard</span>
            )}
          </div>
        )
      case 'category':
        return (
          <Badge className="gold-gradient text-navy font-semibold text-xs border-0">
            {item.category}
          </Badge>
        )
      case 'turnaround':
        return (
          <span className="text-sm font-medium text-navy">
            {item.turnaround}
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="navy-gradient-deep py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold mb-4">
              <GitCompare className="size-3.5" />
              PRODUCT COMPARISON
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              Compare{' '}
              <span className="gold-gradient-text">Products</span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base">
              Side-by-side comparison of up to 3 products to help you make the
              best choice for your printing needs.
            </p>
            <div className="h-0.5 w-20 gold-gradient rounded-full mx-auto mt-6" />
          </motion.div>
        </div>
      </div>

      {/* Compare Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {items.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 sm:py-24"
          >
            <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center mb-6">
              <GitCompare className="h-10 w-10 text-gold" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Products to Compare
            </h3>
            <p className="text-muted-foreground text-sm text-center max-w-md mb-8">
              Add up to 3 products to compare them side by side. Look for the
              compare icon on product cards.
            </p>
            <Button
              onClick={() => navigate('products')}
              className="gold-gradient text-navy font-semibold rounded-xl px-8"
            >
              <Plus className="size-4 mr-2" />
              Browse Products
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Header bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center premium-shadow">
                  <GitCompare className="size-5 text-navy" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy">
                    Comparing {items.length} Product{items.length !== 1 ? 's' : ''}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    You can compare up to 3 products at a time
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {items.length < 3 && (
                  <Button
                    variant="outline"
                    onClick={() => navigate('products')}
                    className="border-gold/30 text-gold hover:bg-gold/10 font-semibold rounded-xl"
                  >
                    <Plus className="size-4 mr-1.5" />
                    Add More
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={clearAll}
                  className="border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded-xl"
                >
                  <Trash2 className="size-4 mr-1.5" />
                  Clear All
                </Button>
              </div>
            </motion.div>

            {/* Mobile: Stacked cards */}
            <div className="block lg:hidden space-y-6">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="premium-shadow border-0 overflow-hidden">
                      {/* Product header with image */}
                      <div className="relative aspect-[16/9] bg-gradient-to-br from-navy/5 to-gold/5">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-navy/20 font-bold text-3xl">MO</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <X className="size-4" />
                        </button>
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-white font-bold text-lg">{item.name}</h3>
                        </div>
                      </div>

                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge className="gold-gradient text-navy font-semibold text-xs border-0">
                            {item.category}
                          </Badge>
                          <span className="text-lg font-bold gold-gradient-text">
                            {formatCurrency(item.price)}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Layers className="size-4 text-gold shrink-0" />
                            <span className="text-muted-foreground">Materials:</span>
                            <span className="font-medium text-navy">
                              {item.materials.length > 0 ? item.materials.join(', ') : 'Standard'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Ruler className="size-4 text-gold shrink-0" />
                            <span className="text-muted-foreground">Sizes:</span>
                            <span className="font-medium text-navy">
                              {item.sizes.length > 0 ? item.sizes.join(', ') : 'Standard'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Palette className="size-4 text-gold shrink-0" />
                            <span className="text-muted-foreground">Finishes:</span>
                            <span className="font-medium text-navy">
                              {item.finishes.length > 0 ? item.finishes.join(', ') : 'Standard'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="size-4 text-gold shrink-0" />
                            <span className="text-muted-foreground">Turnaround:</span>
                            <span className="font-medium text-navy">{item.turnaround}</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleAddToCart(item)}
                          className="w-full gold-gradient text-navy font-semibold rounded-xl h-10"
                        >
                          <ShoppingCart className="size-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Desktop: Comparison Table */}
            <div className="hidden lg:block">
              <Card className="premium-shadow border-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/80 border-b">
                        <th className="w-44 p-4 text-left text-xs font-semibold text-navy uppercase tracking-wider">
                          Feature
                        </th>
                        {items.map((item) => (
                          <th key={item.productId} className="p-4 text-center min-w-[220px]">
                            <div className="flex items-center justify-center gap-2">
                              <h3 className="text-sm font-bold text-navy truncate max-w-[180px]">
                                {item.name}
                              </h3>
                              <button
                                onClick={() => handleRemoveItem(item.productId)}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-colors shrink-0"
                              >
                                <X className="size-3" />
                              </button>
                            </div>
                          </th>
                        ))}
                        {/* Empty columns placeholder */}
                        {Array.from({ length: 3 - items.length }).map((_, i) => (
                          <th key={`empty-${i}`} className="p-4 min-w-[220px]">
                            <div className="flex flex-col items-center gap-2 py-4">
                              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                                <Plus className="size-5 text-gold" />
                              </div>
                              <button
                                onClick={() => navigate('products')}
                                className="text-xs text-gold font-semibold hover:underline"
                              >
                                Add Product
                              </button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row, rowIdx) => (
                        <motion.tr
                          key={row.key}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: rowIdx * 0.05 }}
                          className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                        >
                          <td className="p-4 border-r">
                            <div className="flex items-center gap-2">
                              <row.icon className="size-4 text-gold shrink-0" />
                              <span className="text-sm font-medium text-navy">
                                {row.label}
                              </span>
                            </div>
                          </td>
                          {items.map((item) => (
                            <td key={item.productId} className="p-4 text-center border-r last:border-r-0">
                              {renderCellValue(item, row.key)}
                            </td>
                          ))}
                          {Array.from({ length: 3 - items.length }).map((_, i) => (
                            <td key={`empty-${i}`} className="p-4 text-center text-muted-foreground/40">
                              —
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                      {/* Add to Cart row */}
                      <tr className="bg-gray-50/80 border-t">
                        <td className="p-4 border-r">
                          <span className="text-sm font-medium text-navy">Actions</span>
                        </td>
                        {items.map((item) => (
                          <td key={item.productId} className="p-4 text-center border-r last:border-r-0">
                            <Button
                              onClick={() => handleAddToCart(item)}
                              className="gold-gradient text-navy font-semibold rounded-xl h-9 px-4"
                            >
                              <ShoppingCart className="size-4 mr-1.5" />
                              Add to Cart
                            </Button>
                          </td>
                        ))}
                        {Array.from({ length: 3 - items.length }).map((_, i) => (
                          <td key={`empty-${i}`} className="p-4" />
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Bottom CTA */}
            {items.length < 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <Card className="navy-gradient border-0 overflow-hidden">
                  <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">
                        Add More Products to Compare
                      </h3>
                      <p className="text-white/60 text-sm">
                        You can add {3 - items.length} more product{3 - items.length !== 1 ? 's' : ''} for a comprehensive comparison
                      </p>
                    </div>
                    <Button
                      onClick={() => navigate('products')}
                      className="gold-gradient text-navy font-semibold rounded-xl px-6 shrink-0"
                    >
                      Browse Products
                      <ArrowRight className="size-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
