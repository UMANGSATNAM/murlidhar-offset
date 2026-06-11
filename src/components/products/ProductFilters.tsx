'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

export interface FilterState {
  search: string
  categories: string[]
  priceRange: [number, number]
  materials: string[]
  sortBy: string
  sortOrder: string
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  icon?: string | null
  productCount: number
  children?: Array<{
    id: string
    name: string
    slug: string
  }>
}

const SORT_OPTIONS = [
  { value: 'sortOrder-asc', label: 'Default' },
  { value: 'basePrice-asc', label: 'Price: Low to High' },
  { value: 'basePrice-desc', label: 'Price: High to Low' },
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
]

const MATERIAL_OPTIONS = [
  'Art Card (300 GSM)',
  'Art Card (350 GSM)',
  'Matte Finish',
  'Gloss Finish',
  'Kraft Paper',
  'Textured',
  'Metallic',
  'Recycled',
]

// Filter content component - defined outside the parent to avoid lint error
function FilterContentSection({
  filters,
  onFiltersChange,
  maxPrice,
  categories,
  expandedSections,
  toggleSection,
}: {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  maxPrice: number
  categories: Category[]
  expandedSections: { categories: boolean; price: boolean; materials: boolean }
  toggleSection: (section: 'categories' | 'price' | 'materials') => void
}) {
  const updateFilter = (key: keyof FilterState, value: unknown) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleCategory = (slug: string) => {
    const newCategories = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug]
    updateFilter('categories', newCategories)
  }

  const toggleMaterial = (material: string) => {
    const newMaterials = filters.materials.includes(material)
      ? filters.materials.filter((m) => m !== material)
      : [...filters.materials, material]
    updateFilter('materials', newMaterials)
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      categories: [],
      priceRange: [0, maxPrice],
      materials: [],
      sortBy: 'sortOrder',
      sortOrder: 'asc',
    })
  }

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    filters.categories.length +
    filters.materials.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0) +
    (filters.sortBy !== 'sortOrder' ? 1 : 0)

  return (
    <div className="flex flex-col gap-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-9 h-10 bg-background border-gold/20 focus:border-gold rounded-lg"
        />
        {filters.search && (
          <button
            onClick={() => updateFilter('search', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Separator className="bg-gold/10" />

      {/* Sort By */}
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
          Sort By
        </Label>
        <Select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onValueChange={(val) => {
            const [sortBy, sortOrder] = val.split('-')
            onFiltersChange({ ...filters, sortBy, sortOrder })
          }}
        >
          <SelectTrigger className="h-9 bg-background border-gold/20 rounded-lg">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-gold/10" />

      {/* Categories */}
      <div>
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full group"
        >
          <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold group-hover:text-gold transition-colors">
            Categories
          </Label>
          {expandedSections.categories ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.categories && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex flex-col gap-2.5">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-2.5">
                    <Checkbox
                      id={`cat-${cat.slug}`}
                      checked={filters.categories.includes(cat.slug)}
                      onCheckedChange={() => toggleCategory(cat.slug)}
                      className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold data-[state=checked]:text-navy"
                    />
                    <Label
                      htmlFor={`cat-${cat.slug}`}
                      className="text-sm text-foreground cursor-pointer hover:text-gold transition-colors flex-1"
                    >
                      {cat.name}
                    </Label>
                    <Badge
                      variant="secondary"
                      className="text-[10px] bg-gold/10 text-gold"
                    >
                      {cat.productCount || 0}
                    </Badge>
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-xs text-muted-foreground py-2">
                    No categories available
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="bg-gold/10" />

      {/* Price Range */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full group"
        >
          <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold group-hover:text-gold transition-colors">
            Price Range
          </Label>
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 px-1">
                <Slider
                  value={filters.priceRange}
                  max={maxPrice}
                  step={100}
                  onValueChange={(val) =>
                    updateFilter('priceRange', val as [number, number])
                  }
                  className="[&_[role=slider]]:bg-gold [&_[role=slider]]:border-gold [&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-medium text-foreground">
                    ₹{filters.priceRange[0].toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    ₹{filters.priceRange[1].toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="bg-gold/10" />

      {/* Materials */}
      <div>
        <button
          onClick={() => toggleSection('materials')}
          className="flex items-center justify-between w-full group"
        >
          <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold group-hover:text-gold transition-colors">
            Material
          </Label>
          {expandedSections.materials ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.materials && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex flex-col gap-2.5">
                {MATERIAL_OPTIONS.map((material) => (
                  <div key={material} className="flex items-center gap-2.5">
                    <Checkbox
                      id={`mat-${material}`}
                      checked={filters.materials.includes(material)}
                      onCheckedChange={() => toggleMaterial(material)}
                      className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold data-[state=checked]:text-navy"
                    />
                    <Label
                      htmlFor={`mat-${material}`}
                      className="text-sm text-foreground cursor-pointer hover:text-gold transition-colors"
                    >
                      {material}
                    </Label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="bg-gold/10" />

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="w-full border-gold/30 text-gold hover:bg-gold/10 hover:text-gold rounded-lg"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear All Filters ({activeFilterCount})
        </Button>
      )}
    </div>
  )
}

// Main ProductFilters component
interface ProductFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  maxPrice?: number
}

export default function ProductFilters({
  filters,
  onFiltersChange,
  maxPrice = 50000,
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    materials: false,
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories)
        }
      })
      .catch(() => {})
  }, [])

  const toggleSection = useCallback(
    (section: 'categories' | 'price' | 'materials') => {
      setExpandedSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }))
    },
    []
  )

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    filters.categories.length +
    filters.materials.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0) +
    (filters.sortBy !== 'sortOrder' ? 1 : 0)

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-4 rounded-xl bg-card premium-shadow gold-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="h-5 w-5 text-gold" />
            <h3 className="font-semibold text-foreground">Filters</h3>
            {activeFilterCount > 0 && (
              <Badge className="gold-gradient text-navy text-[10px] border-0 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <ScrollArea className="max-h-[calc(100vh-180px)]">
            <FilterContentSection
              filters={filters}
              onFiltersChange={onFiltersChange}
              maxPrice={maxPrice}
              categories={categories}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            />
          </ScrollArea>
        </div>
      </div>

      {/* Mobile Filter Button & Sheet */}
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="border-gold/30 text-gold hover:bg-gold/10 rounded-lg"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-2 gold-gradient text-navy text-[10px] border-0 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-80 bg-card border-gold/20"
          >
            <SheetTitle className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="h-5 w-5 text-gold" />
              <span className="font-semibold">Filters</span>
              {activeFilterCount > 0 && (
                <Badge className="gold-gradient text-navy text-[10px] border-0 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  {activeFilterCount}
                </Badge>
              )}
            </SheetTitle>
            <ScrollArea className="max-h-[calc(100vh-80px)]">
              <FilterContentSection
                filters={filters}
                onFiltersChange={onFiltersChange}
                maxPrice={maxPrice}
                categories={categories}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
