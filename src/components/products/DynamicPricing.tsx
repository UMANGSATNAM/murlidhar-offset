'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Minus,
  Plus,
  Calculator,
  Truck,
  Info,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface SelectedConfig {
  material: string
  size: string
  finish: string
  quantity: number
  variantId: string | null
  basePrice: number
  variantPrice: number
  quantityDiscount: number
  subtotal: number
  gstAmount: number
  total: number
  unitPrice: number
}

interface VariantOption {
  id: string
  type: string
  label: string
  values: string[]
  required: boolean
  sortOrder: number
}

interface Variant {
  id: string
  name: string
  sku?: string | null
  price: number
  stock: number
  isActive: boolean
  image?: string | null
  attrs: Record<string, string>
}

interface QuantityPrice {
  id: string
  minQty: number
  maxQty: number
  pricePer: number
  discount: number
}

interface DynamicPricingProps {
  product: {
    id: string
    basePrice: number
    comparePrice?: number | null
    minQty: number
    maxQty: number
    productionDays: number
    variantOptions: VariantOption[]
    variants: Variant[]
    quantityPrices: QuantityPrice[]
  }
  onPriceChange: (config: SelectedConfig) => void
}

const GST_RATE = 0.18

// Option selector component - dropdown menu style
function OptionSelector({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string
  options: string[] | null
  selected: string
  onSelect: (val: string) => void
}) {
  if (!options || options.length === 0) return null

  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        {label}
      </Label>
      <Select value={selected} onValueChange={onSelect}>
        <SelectTrigger
          className="w-full h-10 bg-[#162032] border-[#1E3048] hover:border-[#C9A227]/50
            focus:ring-[#C9A227]/30 text-[#E2E8F0] rounded-lg transition-colors duration-200"
        >
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent
          className="bg-[#162032] border-[#1E3048] rounded-xl shadow-xl shadow-black/40"
        >
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="text-[#94A3B8] hover:bg-[#1E3048]/60 hover:text-[#E2E8F0]
                focus:bg-[#C9A227]/15 focus:text-[#C9A227]
                data-[state=checked]:bg-[#C9A227]/15 data-[state=checked]:text-[#C9A227]
                cursor-pointer rounded-md my-0.5 transition-colors duration-150"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default function DynamicPricing({
  product,
  onPriceChange,
}: DynamicPricingProps) {
  // Extract option types
  const materialOptions = useMemo(
    () =>
      product.variantOptions.find((vo) => vo.type === 'material') || null,
    [product.variantOptions]
  )
  const sizeOptions = useMemo(
    () =>
      product.variantOptions.find((vo) => vo.type === 'size') || null,
    [product.variantOptions]
  )
  const finishOptions = useMemo(
    () =>
      product.variantOptions.find((vo) => vo.type === 'finish') || null,
    [product.variantOptions]
  )

  // State
  const [selectedMaterial, setSelectedMaterial] = useState<string>(
    materialOptions?.values[0] || ''
  )
  const [selectedSize, setSelectedSize] = useState<string>(
    sizeOptions?.values[0] || ''
  )
  const [selectedFinish, setSelectedFinish] = useState<string>(
    finishOptions?.values[0] || ''
  )
  const [quantity, setQuantity] = useState<number>(product.minQty || 1)

  // Find matching variant
  const matchingVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null

    return (
      product.variants.find((v) => {
        const attrs = v.attrs
        const materialMatch = !selectedMaterial || attrs.material === selectedMaterial
        const sizeMatch = !selectedSize || attrs.size === selectedSize
        const finishMatch = !selectedFinish || attrs.finish === selectedFinish
        return materialMatch && sizeMatch && finishMatch
      }) || null
    )
  }, [product.variants, selectedMaterial, selectedSize, selectedFinish])

  // Find quantity price tier
  const quantityTier = useMemo(() => {
    if (!product.quantityPrices || product.quantityPrices.length === 0) return null

    return (
      product.quantityPrices.find(
        (qp) => quantity >= qp.minQty && quantity <= qp.maxQty
      ) || null
    )
  }, [product.quantityPrices, quantity])

  // Calculate pricing
  const pricing = useMemo(() => {
    // Base price
    const basePrice = product.basePrice

    // Variant price (overrides base if match found)
    const variantPrice = matchingVariant ? matchingVariant.price : basePrice

    // Unit price after quantity discount
    let unitPrice = variantPrice
    let discountPercent = 0

    if (quantityTier) {
      discountPercent = quantityTier.discount
      unitPrice = quantityTier.pricePer > 0 ? quantityTier.pricePer : variantPrice
      if (discountPercent > 0 && quantityTier.pricePer === 0) {
        unitPrice = variantPrice * (1 - discountPercent / 100)
      }
    }

    const subtotal = unitPrice * quantity
    const gstAmount = subtotal * GST_RATE
    const total = subtotal + gstAmount

    return {
      basePrice,
      variantPrice,
      unitPrice,
      discountPercent,
      quantityDiscount: discountPercent > 0 ? (variantPrice - unitPrice) * quantity : 0,
      subtotal,
      gstAmount,
      total,
    }
  }, [product.basePrice, matchingVariant, quantityTier, quantity])

  // Estimate delivery
  const estimatedDelivery = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() + (product.productionDays || 3))
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }, [product.productionDays])

  // Notify parent of price changes
  useEffect(() => {
    onPriceChange({
      material: selectedMaterial,
      size: selectedSize,
      finish: selectedFinish,
      quantity,
      variantId: matchingVariant?.id || null,
      basePrice: pricing.basePrice,
      variantPrice: pricing.variantPrice,
      quantityDiscount: pricing.discountPercent,
      subtotal: pricing.subtotal,
      gstAmount: pricing.gstAmount,
      total: pricing.total,
      unitPrice: pricing.unitPrice,
    })
  }, [
    selectedMaterial,
    selectedSize,
    selectedFinish,
    quantity,
    matchingVariant,
    pricing,
    onPriceChange,
  ])

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta
    if (newQty >= (product.minQty || 1) && newQty <= (product.maxQty || 10000)) {
      setQuantity(newQty)
    }
  }

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    if (!isNaN(val) && val >= 1) {
      setQuantity(Math.min(val, product.maxQty || 10000))
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-5">
        {/* Material Selector */}
        <OptionSelector
          label="Material"
          options={materialOptions?.values || null}
          selected={selectedMaterial}
          onSelect={setSelectedMaterial}
        />

        {/* Size Selector */}
        <OptionSelector
          label="Size"
          options={sizeOptions?.values || null}
          selected={selectedSize}
          onSelect={setSelectedSize}
        />

        {/* Finish Selector */}
        <OptionSelector
          label="Finish"
          options={finishOptions?.values || null}
          selected={selectedFinish}
          onSelect={setSelectedFinish}
        />

        <Separator className="bg-gold/10" />

        {/* Quantity Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Quantity
            </Label>
            <span className="text-[10px] text-muted-foreground">
              Min: {product.minQty || 1} · Max: {(product.maxQty || 10000).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gold/20 rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none hover:bg-gold/10"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= (product.minQty || 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityInput}
                className="h-10 w-20 text-center bg-transparent text-foreground font-semibold text-sm border-x border-gold/20 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none hover:bg-gold/10"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= (product.maxQty || 10000)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quantity Price Tiers - Dropdown */}
          {product.quantityPrices && product.quantityPrices.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Calculator className="h-3.5 w-3.5 text-[#C9A227]" />
                <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider">
                  Quantity Discounts
                </span>
              </div>
              <Select
                value={quantityTier?.id || product.quantityPrices[0]?.id || ''}
                onValueChange={(val) => {
                  const tier = product.quantityPrices.find((t) => t.id === val)
                  if (tier) setQuantity(tier.minQty)
                }}
              >
                <SelectTrigger
                  className="w-full h-9 bg-[#0D1A2E] border-[#1E3048] hover:border-[#C9A227]/50
                    focus:ring-[#C9A227]/30 text-[#E2E8F0] rounded-lg text-xs transition-colors duration-200"
                >
                  <SelectValue placeholder="Select quantity tier" />
                </SelectTrigger>
                <SelectContent
                  className="bg-[#162032] border-[#1E3048] rounded-xl shadow-xl shadow-black/40"
                >
                  {product.quantityPrices.map((tier) => (
                    <SelectItem
                      key={tier.id}
                      value={tier.id}
                      className="text-[#94A3B8] hover:bg-[#1E3048]/60 hover:text-[#E2E8F0]
                        focus:bg-[#C9A227]/15 focus:text-[#C9A227]
                        cursor-pointer rounded-md my-0.5 transition-colors duration-150 text-xs"
                    >
                      {tier.minQty.toLocaleString('en-IN')}
                      {tier.maxQty >= 99999 ? '+' : ` – ${tier.maxQty.toLocaleString('en-IN')}`} pcs
                      {tier.discount > 0 ? ` — save ${tier.discount}%` : ''}
                      {tier.pricePer > 0 ? ` (₹${tier.pricePer.toLocaleString('en-IN')}/pc)` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Separator className="bg-gold/10" />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <Calculator className="h-4 w-4 text-gold" />
            <span className="text-sm font-semibold text-foreground">
              Price Breakdown
            </span>
          </div>

          <div className="space-y-2 text-sm">
            {/* Base Price */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Base Price</span>
              <span className="font-medium">
                ₹{pricing.basePrice.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Variant Adjustment */}
            {matchingVariant && pricing.variantPrice !== pricing.basePrice && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Variant Adjustment
                  {matchingVariant.name && (
                    <span className="text-gold ml-1">
                      ({matchingVariant.name})
                    </span>
                  )}
                </span>
                <span className="font-medium">
                  ₹{pricing.variantPrice.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* Unit Price */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Unit Price</span>
              <span className="font-medium">
                ₹{pricing.unitPrice.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Quantity</span>
              <span className="font-medium">
                × {quantity.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Quantity Discount */}
            {pricing.discountPercent > 0 && (
              <div className="flex items-center justify-between text-green-600">
                <span className="flex items-center gap-1">
                  Quantity Discount
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {pricing.discountPercent}% off for ordering{' '}
                        {quantity.toLocaleString('en-IN')}+ pieces
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </span>
                <span className="font-medium">
                  - ₹{pricing.quantityDiscount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <Separator className="bg-gold/10" />

            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Subtotal</span>
              <span className="font-semibold">
                ₹{pricing.subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* GST */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                GST (18%)
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Goods & Services Tax at 18% as per Indian tax regulations</p>
                  </TooltipContent>
                </Tooltip>
              </span>
              <span className="font-medium">
                ₹{pricing.gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>

            <Separator className="bg-gold/10" />

            {/* Total */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-base font-bold text-foreground">Total</span>
              <span className="text-xl font-bold gold-gradient-text">
                ₹{pricing.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="flex items-center gap-3 p-3 rounded-lg border border-gold/15 bg-gold/5">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gold/10">
            <Truck className="h-5 w-5 text-gold" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Estimated Delivery</p>
            <p className="text-sm font-semibold text-foreground">
              {estimatedDelivery}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {product.productionDays || 3} business days production
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
