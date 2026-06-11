'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  Home,
  PackageOpen,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useNavigationStore } from '@/lib/store'
import ProductCard from './ProductCard'
import ProductFilters, { FilterState } from './ProductFilters'

interface Product {
  id: string
  name: string
  slug: string
  basePrice: number
  comparePrice?: number | null
  images: string[] | string
  shortDesc?: string | null
  isFeatured?: boolean
  minQty?: number
  category: {
    id: string
    name: string
    slug: string
    icon?: string | null
  }
  variants?: Array<{
    id: string
    name: string
    price: number
  }>
}

export default function ProductCatalog() {
  const { categorySlug, searchQuery, navigate, setSearchQuery } =
    useNavigationStore()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })
  const [categoryName, setCategoryName] = useState<string>('')

  const [filters, setFilters] = useState<FilterState>({
    search: searchQuery || '',
    categories: categorySlug ? [categorySlug] : [],
    priceRange: [0, 50000],
    materials: [],
    sortBy: 'sortOrder',
    sortOrder: 'asc',
  })

  // Sync search query from store
  useEffect(() => {
    if (searchQuery !== filters.search) {
      setFilters((prev) => ({ ...prev, search: searchQuery || '' }))
    }
  }, [searchQuery, filters.search])

  // Sync category from store
  useEffect(() => {
    if (categorySlug && !filters.categories.includes(categorySlug)) {
      setFilters((prev) => ({
        ...prev,
        categories: [categorySlug],
      }))
    }
  }, [categorySlug, filters.categories])

  // Fetch category name
  useEffect(() => {
    if (categorySlug) {
      fetch('/api/categories')
        .then((res) => res.json())
        .then((data) => {
          if (data.categories) {
            const cat = data.categories.find(
              (c: { slug: string; name: string }) => c.slug === categorySlug
            )
            if (cat) setCategoryName(cat.name)
          }
        })
        .catch(() => {})
    } else {
      setCategoryName('')
    }
  }, [categorySlug])

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', pagination.page.toString())
      params.set('limit', pagination.limit.toString())
      params.set('sortBy', filters.sortBy)
      params.set('sortOrder', filters.sortOrder)

      if (filters.search) params.set('search', filters.search)
      if (filters.categories.length > 0)
        params.set('category', filters.categories[0])

      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()

      if (data.products) {
        let filteredProducts = data.products as Product[]

        // Client-side price filtering
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) {
          filteredProducts = filteredProducts.filter(
            (p) =>
              p.basePrice >= filters.priceRange[0] &&
              p.basePrice <= filters.priceRange[1]
          )
        }

        // Client-side material filtering
        if (filters.materials.length > 0) {
          filteredProducts = filteredProducts.filter((p) => {
            const variantOptions = (p as Record<string, unknown>)
              .variantOptions as
              | Array<{ type: string; values: string[] }>
              | undefined
            if (!variantOptions) return false
            return variantOptions.some(
              (vo) =>
                vo.type === 'material' &&
                vo.values.some((v) => filters.materials.includes(v))
            )
          })
        }

        setProducts(filteredProducts)
        setPagination((prev) => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, filters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Breadcrumb items
  const breadcrumbs = [
    { label: 'Home', action: () => navigate('home') },
    { label: categoryName || 'Products', action: () => {} },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="navy-gradient-deep py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-4">
            {breadcrumbs.map((crumb, i) => (
              <div key={i} className="flex items-center gap-2">
                {i === 0 && <Home className="h-4 w-4 text-gold" />}
                {i > 0 && (
                  <ChevronRight className="h-3 w-3 text-white/40" />
                )}
                <button
                  onClick={crumb.action}
                  className={`text-sm transition-colors ${
                    i === breadcrumbs.length - 1
                      ? 'text-gold font-medium'
                      : 'text-white/60 hover:text-gold'
                  }`}
                >
                  {crumb.label}
                </button>
              </div>
            ))}
          </nav>

          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              {categoryName || 'Our Products'}
            </h1>
            <p className="text-white/60 mt-2 text-sm sm:text-base">
              Premium offset printing solutions for every need
            </p>
            <div className="h-0.5 w-16 gold-gradient rounded-full mt-4" />
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <ProductFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            maxPrice={50000}
          />

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filters */}
            <div className="lg:hidden mb-4 flex items-center gap-3">
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                maxPrice={50000}
              />
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) => {
                    handleFiltersChange({
                      ...filters,
                      search: e.target.value,
                    })
                    setSearchQuery(e.target.value)
                  }}
                  className="pl-9 h-9 bg-background border-gold/20 rounded-lg"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm text-muted-foreground">
                {loading ? (
                  <Skeleton className="h-4 w-40" />
                ) : (
                  <>
                    Showing{' '}
                    <span className="font-medium text-foreground">
                      {products.length}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium text-foreground">
                      {pagination.total}
                    </span>{' '}
                    products
                  </>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-card premium-shadow overflow-hidden"
                  >
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <div className="flex justify-between items-center pt-2">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-9 w-9 rounded-lg" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!loading && products.length > 0 && (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {products.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 sm:py-24"
              >
                <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <PackageOpen className="h-10 w-10 text-gold" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground text-sm text-center max-w-md">
                  We couldn&apos;t find any products matching your criteria. Try
                  adjusting your filters or search term.
                </p>
                <Button
                  onClick={() =>
                    handleFiltersChange({
                      search: '',
                      categories: [],
                      priceRange: [0, 50000],
                      materials: [],
                      sortBy: 'sortOrder',
                      sortOrder: 'asc',
                    })
                  }
                  className="mt-6 gold-gradient text-navy font-semibold rounded-lg"
                >
                  Clear All Filters
                </Button>
              </motion.div>
            )}

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="border-gold/30 text-gold hover:bg-gold/10 rounded-lg"
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(pagination.totalPages, 5) },
                    (_, i) => {
                      const pageNum =
                        pagination.page <= 3
                          ? i + 1
                          : pagination.page >= pagination.totalPages - 2
                            ? pagination.totalPages - 4 + i
                            : pagination.page - 2 + i

                      if (pageNum < 1 || pageNum > pagination.totalPages)
                        return null

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pagination.page === pageNum ? 'default' : 'outline'
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className={
                            pagination.page === pageNum
                              ? 'gold-gradient text-navy font-semibold rounded-lg min-w-[36px]'
                              : 'border-gold/30 text-foreground hover:bg-gold/10 rounded-lg min-w-[36px]'
                          }
                        >
                          {pageNum}
                        </Button>
                      )
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="border-gold/30 text-gold hover:bg-gold/10 rounded-lg"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}