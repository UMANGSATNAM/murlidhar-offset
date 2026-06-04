'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calculator,
  ChevronDown,
  Sparkles,
  ArrowRight,
  IndianRupee,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigationStore } from '@/lib/store'

const productTypes = [
  { name: 'Business Cards', basePrice: 199, unit: '100 cards' },
  { name: 'Wedding Cards', basePrice: 1500, unit: '100 cards' },
  { name: 'Letterheads', basePrice: 899, unit: '100 sheets' },
  { name: 'Brochures', basePrice: 1200, unit: '100 pcs' },
  { name: 'Flyers', basePrice: 599, unit: '100 pcs' },
  { name: 'Stickers', basePrice: 499, unit: '100 pcs' },
  { name: 'Banners', basePrice: 450, unit: 'per sqft' },
  { name: 'Envelopes', basePrice: 699, unit: '100 pcs' },
  { name: 'Packaging Boxes', basePrice: 2500, unit: '100 pcs' },
  { name: 'Posters', basePrice: 799, unit: '100 pcs' },
]

const paperTypes = [
  { name: 'Standard Art Card', multiplier: 1.0 },
  { name: 'Premium Art Card', multiplier: 1.3 },
  { name: 'Textured Paper', multiplier: 1.5 },
  { name: 'Kraft Paper', multiplier: 1.2 },
  { name: 'Metallic Paper', multiplier: 1.8 },
  { name: 'Handmade Paper', multiplier: 2.0 },
]

const finishes = [
  { name: 'Matte', multiplier: 1.0 },
  { name: 'Glossy', multiplier: 1.1 },
  { name: 'Soft Touch Lamination', multiplier: 1.4 },
  { name: 'UV Coating', multiplier: 1.3 },
  { name: 'Embossing', multiplier: 1.5 },
  { name: 'Foil Stamping', multiplier: 1.6 },
  { name: 'Spot UV', multiplier: 1.35 },
]

const quantities = [
  { label: '100', value: 100 },
  { label: '250', value: 250 },
  { label: '500', value: 500 },
  { label: '1,000', value: 1000 },
  { label: '2,500', value: 2500 },
  { label: '5,000', value: 5000 },
  { label: '10,000', value: 10000 },
]

function SelectField({
  label,
  options,
  value,
  onChange,
  formatOption,
}: {
  label: string
  options: Array<{ name: string; multiplier?: number; value?: number; label?: string }>
  value: string
  onChange: (val: string) => void
  formatOption?: (opt: typeof options[0]) => string
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find(
    (o) => o.name === value || String(o.value) === value
  )

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-gold uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-white/5 border border-gold/20 text-white text-sm hover:border-gold/40 transition-colors text-left"
      >
        <span className="truncate">
          {selected
            ? formatOption
              ? formatOption(selected)
              : selected.name
            : `Select ${label}`}
        </span>
        <ChevronDown
          className={`size-4 text-gold/60 shrink-0 ml-2 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 top-full left-0 right-0 mt-1 bg-navy-light border border-gold/20 rounded-lg overflow-hidden premium-shadow-lg"
          >
            <div className="max-h-48 overflow-y-auto py-1 scrollbar-thin">
              {options.map((opt) => {
                const optValue = opt.name || String(opt.value)
                const isSelected = optValue === value
                return (
                  <button
                    key={optValue}
                    onClick={() => {
                      onChange(optValue)
                      setOpen(false)
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      isSelected
                        ? 'bg-gold/15 text-gold'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {formatOption ? formatOption(opt) : opt.name}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AIQuoteEstimator() {
  const { navigate } = useNavigationStore()
  const [productType, setProductType] = useState('')
  const [quantity, setQuantity] = useState('')
  const [paperType, setPaperType] = useState('')
  const [finish, setFinish] = useState('')

  const estimate = useMemo(() => {
    if (!productType || !quantity || !paperType || !finish) return null

    const product = productTypes.find((p) => p.name === productType)
    const paper = paperTypes.find((p) => p.name === paperType)
    const fin = finishes.find((f) => f.name === finish)
    const qty = parseInt(quantity)

    if (!product || !paper || !fin) return null

    // Base calculation
    const baseCost = product.basePrice
    const qtyMultiplier = qty <= 100 ? 1 : qty <= 500 ? 0.85 : qty <= 1000 ? 0.7 : qty <= 5000 ? 0.55 : 0.45
    const paperMultiplier = paper.multiplier
    const finishMultiplier = fin.multiplier

    const estimatedPrice = Math.round(
      baseCost * qtyMultiplier * paperMultiplier * finishMultiplier * (qty / 100)
    )

    // Price range with ±15% variation
    const low = Math.round(estimatedPrice * 0.85)
    const high = Math.round(estimatedPrice * 1.15)

    return {
      low: Math.max(low, 99),
      high: Math.max(high, low + 100),
      unit: product.unit,
    }
  }, [productType, quantity, paperType, finish])

  const isComplete = productType && quantity && paperType && finish

  return (
    <div className="glass-navy rounded-2xl p-6 sm:p-8 gold-border-glow relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold/3 rounded-full blur-xl pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center premium-shadow">
            <Calculator className="size-5 text-navy" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Quick Quote Estimator</h3>
            <p className="text-white/50 text-xs">Get an instant price estimate</p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold/10 border border-gold/20">
              <Sparkles className="size-3 text-gold" />
              <span className="text-gold text-[10px] font-semibold">AI-Powered</span>
            </div>
          </div>
        </div>

        {/* Selectors grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <SelectField
            label="Product Type"
            options={productTypes.map((p) => ({ name: p.name }))}
            value={productType}
            onChange={setProductType}
          />
          <SelectField
            label="Quantity"
            options={quantities.map((q) => ({
              name: String(q.value),
              label: q.label,
              value: q.value,
            }))}
            value={quantity}
            onChange={setQuantity}
            formatOption={(opt) => opt.label || opt.name}
          />
          <SelectField
            label="Paper Type"
            options={paperTypes.map((p) => ({ name: p.name }))}
            value={paperType}
            onChange={setPaperType}
          />
          <SelectField
            label="Finish"
            options={finishes.map((f) => ({ name: f.name }))}
            value={finish}
            onChange={setFinish}
          />
        </div>

        {/* Price estimate result */}
        <AnimatePresence mode="wait">
          {isComplete && estimate ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl bg-gold/5 border border-gold/20 p-5 text-center"
            >
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                Estimated Price Range
              </p>
              <div className="flex items-center justify-center gap-1">
                <IndianRupee className="size-5 text-gold" />
                <span className="text-3xl sm:text-4xl font-bold text-gold">
                  {estimate.low.toLocaleString('en-IN')}
                </span>
                <span className="text-white/40 mx-2">—</span>
                <IndianRupee className="size-5 text-gold" />
                <span className="text-3xl sm:text-4xl font-bold text-gold">
                  {estimate.high.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-white/40 text-xs mt-1">
                per {estimate.unit} (approx.)
              </p>

              <div className="mt-4 pt-4 border-t border-gold/10">
                <Button
                  onClick={() => navigate('products')}
                  className="gold-gradient font-semibold px-6 py-2.5 text-sm rounded-lg hover:opacity-90 transition-opacity gold-shadow h-auto"
                >
                  Get Exact Quote
                  <ArrowRight className="size-3.5 ml-1.5" />
                </Button>
                <p className="text-white/30 text-[10px] mt-2">
                  *Prices are estimates. Final price may vary based on design & specifications.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl bg-white/[0.03] border border-white/10 border-dashed p-5 text-center"
            >
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mx-auto mb-2">
                <Calculator className="size-5 text-gold/50" />
              </div>
              <p className="text-white/40 text-sm">
                Select all options above to get your instant estimate
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
