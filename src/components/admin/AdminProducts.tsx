'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Star,
  Eye,
  EyeOff,
  Layers,
  AlertTriangle,
  Image as ImageIcon,
  Save,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

// ==================== TYPES ====================

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  shortDesc: string | null
  categoryId: string
  images: string[]
  basePrice: number
  comparePrice: number | null
  isActive: boolean
  isFeatured: boolean
  isCustomizable: boolean
  templateType: string
  minQty: number
  maxQty: number
  productionDays: number
  seoTitle: string | null
  seoDesc: string | null
  seoKeywords: string | null
  category: { id: string; name: string; slug: string }
  variantCount: number
  orderCount: number
  createdAt: string
}

interface ProductVariant {
  id: string
  productId: string
  name: string
  sku: string | null
  price: number
  stock: number
  isActive: boolean
  image: string | null
  attrs: Record<string, string>
  createdAt: string
}

interface VariantOptionInput {
  type: string
  label: string
  values: string[]
  required: boolean
  sortOrder: number
}

interface QuantityPriceInput {
  minQty: number
  maxQty: number
  pricePer: number
  discount: number
}

interface FormErrors {
  name?: string
  slug?: string
  categoryId?: string
  basePrice?: string
  imageUrl?: string
}

const emptyProduct = {
  name: '',
  slug: '',
  description: '',
  shortDesc: '',
  categoryId: '',
  images: [] as string[],
  basePrice: 0,
  comparePrice: 0,
  isActive: true,
  isFeatured: false,
  isCustomizable: true,
  templateType: 'standard',
  minQty: 1,
  maxQty: 10000,
  productionDays: 3,
  seoTitle: '',
  seoDesc: '',
  seoKeywords: '',
}

const emptyVariant = {
  name: '',
  sku: '',
  price: 0,
  stock: 0,
  isActive: true,
  image: '',
  attrs: {} as Record<string, string>,
}

// ==================== COMPONENT ====================

export default function AdminProducts() {
  // Products state
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    outOfStock: 0,
  })

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Product dialog state
  const [showDialog, setShowDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState(emptyProduct)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [variantOptions, setVariantOptions] = useState<VariantOptionInput[]>([])
  const [quantityPrices, setQuantityPrices] = useState<QuantityPriceInput[]>([])
  const [saving, setSaving] = useState(false)

  // Delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteName, setDeleteName] = useState('')

  // Variant management
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [selectedProductName, setSelectedProductName] = useState('')
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [variantsLoading, setVariantsLoading] = useState(false)

  // Variant dialog
  const [showVariantDialog, setShowVariantDialog] = useState(false)
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null)
  const [variantForm, setVariantForm] = useState(emptyVariant)
  const [variantFormErrors, setVariantFormErrors] = useState<{ name?: string; price?: string }>({})
  const [variantSaving, setVariantSaving] = useState(false)

  // Variant delete dialog
  const [deleteVariantId, setDeleteVariantId] = useState<string | null>(null)
  const [deleteVariantName, setDeleteVariantName] = useState('')

  // Bulk action loading
  const [bulkLoading, setBulkLoading] = useState(false)

  // ==================== FETCH PRODUCTS ====================

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '10')
      if (search) params.set('search', search)
      if (filterStatus !== 'all') params.set('status', filterStatus)
      if (filterCategory !== 'all') params.set('category', filterCategory)

      const res = await fetch(`/api/admin/products?${params}`)
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products)
        setTotalPages(data.pagination.totalPages)
        setTotal(data.pagination.total)
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [page, search, filterStatus, filterCategory])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data.categories || data || [])
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/products?limit=1000')
      if (res.ok) {
        const data = await res.json()
        const allProducts: Product[] = data.products
        setStats({
          total: data.pagination.total,
          active: allProducts.filter((p) => p.isActive).length,
          draft: allProducts.filter((p) => !p.isActive).length,
          outOfStock: allProducts.filter((p) => p.variantCount === 0).length,
        })
      }
    } catch {
      // silently fail
    }
  }, [])

  useEffect(() => {
    fetchCategories()
    fetchStats()
  }, [fetchStats])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // ==================== FORM VALIDATION ====================

  const validateProductForm = (): boolean => {
    const errors: FormErrors = {}

    if (!formData.name.trim()) {
      errors.name = 'Product name is required'
    }
    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required'
    }
    if (!formData.categoryId) {
      errors.categoryId = 'Category is required'
    }
    if (formData.basePrice < 0) {
      errors.basePrice = 'Price cannot be negative'
    }
    if (formData.basePrice === 0 && !editingProduct) {
      errors.basePrice = 'Price must be greater than 0'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ==================== PRODUCT CRUD ====================

  const handleOpenCreate = () => {
    setEditingProduct(null)
    setFormData(emptyProduct)
    setFormErrors({})
    setImageUrlInput('')
    setVariantOptions([])
    setQuantityPrices([])
    setShowDialog(true)
  }

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      shortDesc: product.shortDesc || '',
      categoryId: product.categoryId,
      images: product.images || [],
      basePrice: product.basePrice,
      comparePrice: product.comparePrice || 0,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      isCustomizable: product.isCustomizable,
      templateType: product.templateType,
      minQty: product.minQty,
      maxQty: product.maxQty,
      productionDays: product.productionDays,
      seoTitle: product.seoTitle || '',
      seoDesc: product.seoDesc || '',
      seoKeywords: product.seoKeywords || '',
    })
    setFormErrors({})
    setImageUrlInput('')
    setVariantOptions([])
    setQuantityPrices([])
    setShowDialog(true)
  }

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) {
      setFormErrors({ ...formErrors, imageUrl: 'Please enter an image URL' })
      return
    }
    setFormData({ ...formData, images: [...formData.images, imageUrlInput.trim()] })
    setImageUrlInput('')
    setFormErrors({ ...formErrors, imageUrl: undefined })
  }

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const handleSave = async () => {
    if (!validateProductForm()) return

    setSaving(true)
    try {
      const payload = {
        ...formData,
        slug: formData.slug || generateSlug(formData.name),
        variantOptions,
        quantityPrices,
      }

      const isEdit = !!editingProduct
      const res = await fetch('/api/admin/products', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { id: editingProduct.id, ...payload } : payload),
      })

      if (res.ok) {
        toast.success(isEdit ? 'Product updated successfully' : 'Product created successfully')
        setShowDialog(false)
        fetchProducts()
        fetchStats()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to save product')
      }
    } catch (err) {
      console.error('Failed to save product:', err)
      toast.error('An error occurred while saving')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (product: Product) => {
    try {
      const res = await fetch(`/api/admin/products`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, isActive: !product.isActive }),
      })
      if (res.ok) {
        toast.success(product.isActive ? 'Product deactivated' : 'Product activated')
        fetchProducts()
        fetchStats()
      }
    } catch (err) {
      console.error('Failed to toggle product:', err)
      toast.error('Failed to update product status')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/admin/products?id=${deleteId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('Product deleted successfully')
        fetchProducts()
        fetchStats()
        if (selectedProductId === deleteId) {
          setSelectedProductId(null)
          setVariants([])
        }
      } else {
        toast.error('Failed to delete product')
      }
    } catch (err) {
      console.error('Failed to delete product:', err)
      toast.error('An error occurred while deleting')
    } finally {
      setDeleteId(null)
      setDeleteName('')
    }
  }

  // ==================== BULK ACTIONS ====================

  const toggleSelectAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIds(next)
  }

  const handleBulkAction = async (action: 'activate' | 'deactivate') => {
    if (selectedIds.size === 0) return
    setBulkLoading(true)
    try {
      const promises = Array.from(selectedIds).map((id) =>
        fetch(`/api/admin/products`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, isActive: action === 'activate' }),
        })
      )
      await Promise.all(promises)
      toast.success(`${selectedIds.size} products ${action}d successfully`)
      setSelectedIds(new Set())
      fetchProducts()
      fetchStats()
    } catch {
      toast.error('Bulk action failed')
    } finally {
      setBulkLoading(false)
    }
  }

  // ==================== VARIANT OPTIONS ====================

  const addVariantOption = () => {
    setVariantOptions([
      ...variantOptions,
      { type: '', label: '', values: [], required: true, sortOrder: variantOptions.length },
    ])
  }

  const removeVariantOption = (index: number) => {
    setVariantOptions(variantOptions.filter((_, i) => i !== index))
  }

  const updateVariantOption = (index: number, field: string, value: string | boolean | number) => {
    const updated = [...variantOptions]
    updated[index] = { ...updated[index], [field]: value }
    setVariantOptions(updated)
  }

  const addQuantityPrice = () => {
    setQuantityPrices([
      ...quantityPrices,
      { minQty: 100, maxQty: 500, pricePer: 0, discount: 0 },
    ])
  }

  const removeQuantityPrice = (index: number) => {
    setQuantityPrices(quantityPrices.filter((_, i) => i !== index))
  }

  const updateQuantityPrice = (index: number, field: string, value: number) => {
    const updated = [...quantityPrices]
    updated[index] = { ...updated[index], [field]: value }
    setQuantityPrices(updated)
  }

  // ==================== VARIANT MANAGEMENT ====================

  const fetchVariants = async (productId: string) => {
    setVariantsLoading(true)
    try {
      const res = await fetch(`/api/admin/products/variants?productId=${productId}`)
      if (res.ok) {
        const data = await res.json()
        setVariants(data.variants)
      }
    } catch {
      toast.error('Failed to load variants')
    } finally {
      setVariantsLoading(false)
    }
  }

  const handleSelectProductForVariants = (product: Product) => {
    if (selectedProductId === product.id) {
      setSelectedProductId(null)
      setVariants([])
      return
    }
    setSelectedProductId(product.id)
    setSelectedProductName(product.name)
    fetchVariants(product.id)
  }

  const handleOpenCreateVariant = () => {
    setEditingVariant(null)
    setVariantForm({ ...emptyVariant, attrs: { material: '', size: '', finish: '' } })
    setVariantFormErrors({})
    setShowVariantDialog(true)
  }

  const handleOpenEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant)
    setVariantForm({
      name: variant.name,
      sku: variant.sku || '',
      price: variant.price,
      stock: variant.stock,
      isActive: variant.isActive,
      image: variant.image || '',
      attrs: { material: '', size: '', finish: '', ...variant.attrs },
    })
    setVariantFormErrors({})
    setShowVariantDialog(true)
  }

  const validateVariantForm = (): boolean => {
    const errors: { name?: string; price?: string } = {}
    if (!variantForm.name.trim()) errors.name = 'Variant name is required'
    if (variantForm.price <= 0) errors.price = 'Price must be greater than 0'
    setVariantFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveVariant = async () => {
    if (!validateVariantForm() || !selectedProductId) return
    setVariantSaving(true)
    try {
      const isEdit = !!editingVariant
      const res = await fetch('/api/admin/products/variants', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isEdit
            ? { id: editingVariant.id, ...variantForm }
            : { productId: selectedProductId, ...variantForm }
        ),
      })
      if (res.ok) {
        toast.success(isEdit ? 'Variant updated' : 'Variant created')
        setShowVariantDialog(false)
        fetchVariants(selectedProductId)
        fetchProducts()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to save variant')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setVariantSaving(false)
    }
  }

  const handleDeleteVariant = async () => {
    if (!deleteVariantId || !selectedProductId) return
    try {
      const res = await fetch(`/api/admin/products/variants?id=${deleteVariantId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('Variant deleted')
        fetchVariants(selectedProductId)
        fetchProducts()
      } else {
        toast.error('Failed to delete variant')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setDeleteVariantId(null)
      setDeleteVariantName('')
    }
  }

  // ==================== RENDER ====================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
            <Package className="h-6 w-6 text-gold" />
            Products
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your product catalog, variants, and pricing
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="gold-gradient text-navy font-semibold hover:opacity-90 hover-shimmer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="premium-shadow border-0">
              <CardContent className="p-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
              <Card className="premium-shadow border-0 hover-lift cursor-default">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Products</p>
                    <div className="h-8 w-8 rounded-lg bg-navy/5 flex items-center justify-center">
                      <Package className="h-4 w-4 text-navy" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-navy mt-1">{stats.total}</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card className="premium-shadow border-0 hover-lift cursor-default">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active</p>
                    <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center">
                      <Eye className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="premium-shadow border-0 hover-lift cursor-default">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Draft</p>
                    <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                      <EyeOff className="h-4 w-4 text-amber-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{stats.draft}</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card className="premium-shadow border-0 hover-lift cursor-default">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Out of Stock</p>
                    <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-red-500 mt-1">{stats.outOfStock}</p>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>

      {/* Filters */}
      <Card className="premium-shadow border-0">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search products by name or slug..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9 bg-white border-gray-200 focus:border-gold h-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-36 h-9 bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={(v) => { setFilterCategory(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-44 h-9 bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="gold-border bg-gold/5 border-0">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-navy">
                      {selectedIds.size} product{selectedIds.size !== 1 ? 's' : ''} selected
                    </span>
                    <Separator orientation="vertical" className="h-5" />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-green-700 border-green-200 hover:bg-green-50"
                      onClick={() => handleBulkAction('activate')}
                      disabled={bulkLoading}
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      Activate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-amber-700 border-amber-200 hover:bg-amber-50"
                      onClick={() => handleBulkAction('deactivate')}
                      disabled={bulkLoading}
                    >
                      <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                      Deactivate
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-muted-foreground"
                    onClick={() => setSelectedIds(new Set())}
                  >
                    Clear selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      <Card className="premium-shadow border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80">
                  <TableHead className="w-10 px-3">
                    <Checkbox
                      checked={products.length > 0 && selectedIds.size === products.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-navy">Image</TableHead>
                  <TableHead className="text-xs font-semibold text-navy">Name</TableHead>
                  <TableHead className="text-xs font-semibold text-navy hidden sm:table-cell">Category</TableHead>
                  <TableHead className="text-xs font-semibold text-navy">Price</TableHead>
                  <TableHead className="text-xs font-semibold text-navy hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-navy hidden lg:table-cell">Variants</TableHead>
                  <TableHead className="text-xs font-semibold text-navy text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-10 rounded-lg" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-14" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Package className="h-10 w-10 text-gray-300" />
                        <p className="text-sm font-medium">No products found</p>
                        <p className="text-xs">Try adjusting your search or filters</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleOpenCreate}
                          className="mt-1 text-gold border-gold/30 hover:bg-gold/10"
                        >
                          <Plus className="mr-1.5 h-3.5 w-3.5" />
                          Add your first product
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow
                      key={product.id}
                      className={`hover:bg-gray-50/50 transition-colors ${
                        selectedProductId === product.id ? 'bg-gold/5' : ''
                      } ${selectedIds.has(product.id) ? 'bg-blue-50/50' : ''}`}
                    >
                      <TableCell className="px-3">
                        <Checkbox
                          checked={selectedIds.has(product.id)}
                          onCheckedChange={() => toggleSelect(product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium text-navy truncate max-w-[180px]">
                              {product.name}
                            </p>
                            {product.isFeatured && (
                              <Star className="h-3.5 w-3.5 text-gold fill-gold flex-shrink-0" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{product.slug}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="secondary" className="text-xs bg-navy/5 text-navy hover:bg-navy/10">
                          {product.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="text-sm font-semibold text-navy">
                            ₹{product.basePrice.toLocaleString('en-IN')}
                          </span>
                          {product.comparePrice && product.comparePrice > product.basePrice && (
                            <span className="ml-1.5 text-xs text-muted-foreground line-through">
                              ₹{product.comparePrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={product.isActive ? 'default' : 'secondary'}
                          className={`text-xs ${
                            product.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-100'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {product.variantCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleOpenEdit(product)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSelectProductForVariants(product)}>
                              <Layers className="mr-2 h-4 w-4" />
                              Manage Variants
                              {product.variantCount > 0 && (
                                <Badge className="ml-auto text-[10px] px-1.5 py-0 bg-gold/20 text-gold-dark">
                                  {product.variantCount}
                                </Badge>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleActive(product)}>
                              {product.isActive ? (
                                <>
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => {
                                setDeleteId(product.id)
                                setDeleteName(product.name)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total} products
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (page <= 3) {
                    pageNum = i + 1
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = page - 2 + i
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'default' : 'outline'}
                      size="icon"
                      className={`h-8 w-8 ${
                        page === pageNum
                          ? 'gold-gradient text-navy font-semibold'
                          : ''
                      }`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ==================== VARIANT MANAGEMENT SECTION ==================== */}
      <AnimatePresence>
        {selectedProductId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="premium-shadow border-0">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg text-navy flex items-center gap-2">
                      <Layers className="h-5 w-5 text-gold" />
                      Variants for{' '}
                      <span className="gold-gradient-text">{selectedProductName}</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage material, size, finish options and pricing
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => {
                        setSelectedProductId(null)
                        setVariants([])
                      }}
                    >
                      <X className="mr-1.5 h-3.5 w-3.5" />
                      Close
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleOpenCreateVariant}
                      className="gold-gradient text-navy font-semibold hover:opacity-90"
                    >
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      Add Variant
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {variantsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-20 ml-auto" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    ))}
                  </div>
                ) : variants.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Layers className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-medium">No variants yet</p>
                    <p className="text-xs mt-1">Add variants for different materials, sizes, and finishes</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOpenCreateVariant}
                      className="mt-3 text-gold border-gold/30 hover:bg-gold/10"
                    >
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      Add first variant
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/80">
                          <TableHead className="text-xs font-semibold text-navy">Variant Name</TableHead>
                          <TableHead className="text-xs font-semibold text-navy hidden sm:table-cell">Material</TableHead>
                          <TableHead className="text-xs font-semibold text-navy hidden md:table-cell">Size</TableHead>
                          <TableHead className="text-xs font-semibold text-navy hidden md:table-cell">Finish</TableHead>
                          <TableHead className="text-xs font-semibold text-navy">Price</TableHead>
                          <TableHead className="text-xs font-semibold text-navy">Stock</TableHead>
                          <TableHead className="text-xs font-semibold text-navy hidden sm:table-cell">Status</TableHead>
                          <TableHead className="text-xs font-semibold text-navy text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {variants.map((variant) => (
                          <TableRow key={variant.id} className="hover:bg-gray-50/50">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {variant.image ? (
                                  <img
                                    src={variant.image}
                                    alt={variant.name}
                                    className="h-8 w-8 rounded object-cover"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center">
                                    <Package className="h-3.5 w-3.5 text-gray-400" />
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium text-navy truncate max-w-[160px]">
                                    {variant.name}
                                  </p>
                                  {variant.sku && (
                                    <p className="text-xs text-muted-foreground">{variant.sku}</p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <span className="text-sm text-muted-foreground">
                                {variant.attrs?.material || '—'}
                              </span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="text-sm text-muted-foreground">
                                {variant.attrs?.size || '—'}
                              </span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="text-sm text-muted-foreground">
                                {variant.attrs?.finish || '—'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-semibold text-navy">
                                ₹{variant.price.toLocaleString('en-IN')}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={variant.stock > 0 ? 'default' : 'secondary'}
                                className={`text-xs ${
                                  variant.stock > 0
                                    ? 'bg-green-100 text-green-700'
                                    : variant.stock === 0
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                {variant.stock}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge
                                variant={variant.isActive ? 'default' : 'secondary'}
                                className={`text-xs ${
                                  variant.isActive
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                {variant.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-navy"
                                  onClick={() => handleOpenEditVariant(variant)}
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-red-400 hover:text-red-600"
                                  onClick={() => {
                                    setDeleteVariantId(variant.id)
                                    setDeleteVariantName(variant.name)
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== ADD/EDIT PRODUCT DIALOG ==================== */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-gold" />
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Update product details, pricing, and settings'
                : 'Fill in the details to create a new product'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy border-b pb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      })
                      if (formErrors.name) setFormErrors({ ...formErrors, name: undefined })
                    }}
                    placeholder="e.g. Premium Business Cards"
                    className={`focus:border-gold ${formErrors.name ? 'border-red-400 focus:border-red-400' : ''}`}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm">
                    Slug <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => {
                      setFormData({ ...formData, slug: e.target.value })
                      if (formErrors.slug) setFormErrors({ ...formErrors, slug: undefined })
                    }}
                    placeholder="premium-business-cards"
                    className={`focus:border-gold ${formErrors.slug ? 'border-red-400 focus:border-red-400' : ''}`}
                  />
                  {formErrors.slug && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {formErrors.slug}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortDesc" className="text-sm">Short Description</Label>
                <Input
                  id="shortDesc"
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  placeholder="Brief product description"
                  className="focus:border-gold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm">Full Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed product description..."
                  rows={4}
                  className="focus:border-gold"
                />
              </div>
            </div>

            {/* Image URL with Preview */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy border-b pb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Product Images
              </h3>
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <Input
                    placeholder="Enter image URL (e.g., /products/image.png)"
                    value={imageUrlInput}
                    onChange={(e) => {
                      setImageUrlInput(e.target.value)
                      if (formErrors.imageUrl) setFormErrors({ ...formErrors, imageUrl: undefined })
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddImage()
                      }
                    }}
                    className={`focus:border-gold ${formErrors.imageUrl ? 'border-red-400' : ''}`}
                  />
                  {formErrors.imageUrl && (
                    <p className="text-xs text-red-500">{formErrors.imageUrl}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={handleAddImage}
                  className="text-gold border-gold/30 hover:bg-gold/10"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                      <img
                        src={img}
                        alt={`Product image ${index + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = ''
                          ;(e.target as HTMLImageElement).alt = 'Failed to load'
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-white hover:text-red-400"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {index === 0 && (
                        <Badge className="absolute top-1 left-1 text-[10px] px-1.5 py-0 gold-gradient text-navy">
                          Cover
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing & Category */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy border-b pb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Pricing & Category
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(v) => {
                      setFormData({ ...formData, categoryId: v })
                      if (formErrors.categoryId) setFormErrors({ ...formErrors, categoryId: undefined })
                    }}
                  >
                    <SelectTrigger className={`focus:border-gold ${formErrors.categoryId ? 'border-red-400' : ''}`}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.categoryId && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {formErrors.categoryId}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">
                    Base Price (₹) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => {
                      setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })
                      if (formErrors.basePrice) setFormErrors({ ...formErrors, basePrice: undefined })
                    }}
                    className={`focus:border-gold ${formErrors.basePrice ? 'border-red-400' : ''}`}
                  />
                  {formErrors.basePrice && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {formErrors.basePrice}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Compare Price (₹)</Label>
                  <Input
                    type="number"
                    value={formData.comparePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, comparePrice: parseFloat(e.target.value) || 0 })
                    }
                    className="focus:border-gold"
                  />
                </div>
              </div>
            </div>

            {/* Product Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy border-b pb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Product Settings
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Min Qty</Label>
                  <Input
                    type="number"
                    value={formData.minQty}
                    onChange={(e) =>
                      setFormData({ ...formData, minQty: parseInt(e.target.value) || 1 })
                    }
                    className="focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Max Qty</Label>
                  <Input
                    type="number"
                    value={formData.maxQty}
                    onChange={(e) =>
                      setFormData({ ...formData, maxQty: parseInt(e.target.value) || 10000 })
                    }
                    className="focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Production Days</Label>
                  <Input
                    type="number"
                    value={formData.productionDays}
                    onChange={(e) =>
                      setFormData({ ...formData, productionDays: parseInt(e.target.value) || 3 })
                    }
                    className="focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Template</Label>
                  <Select
                    value={formData.templateType}
                    onValueChange={(v) => setFormData({ ...formData, templateType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="wedding_card">Wedding Card</SelectItem>
                      <SelectItem value="business_card">Business Card</SelectItem>
                      <SelectItem value="brochure">Brochure</SelectItem>
                      <SelectItem value="flyer">Flyer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6 pt-1">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
                    className="data-[state=checked]:bg-green-500"
                  />
                  <Label className="text-sm">Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isFeatured}
                    onCheckedChange={(v) => setFormData({ ...formData, isFeatured: v })}
                    className="data-[state=checked]:bg-gold"
                  />
                  <Label className="text-sm flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-gold" />
                    Featured
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isCustomizable}
                    onCheckedChange={(v) => setFormData({ ...formData, isCustomizable: v })}
                  />
                  <Label className="text-sm">Customizable</Label>
                </div>
              </div>
            </div>

            {/* Variant Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-navy border-b pb-2 flex-1 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  Variant Options
                </h3>
                <Button variant="outline" size="sm" onClick={addVariantOption} className="ml-3 text-gold border-gold/30">
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Option
                </Button>
              </div>
              {variantOptions.length === 0 && (
                <p className="text-xs text-muted-foreground">No variant options added yet. You can add them later via the Variants section.</p>
              )}
              {variantOptions.map((vo, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
                  <Input
                    placeholder="Type (e.g., material)"
                    value={vo.type}
                    onChange={(e) => updateVariantOption(index, 'type', e.target.value)}
                    className="bg-white focus:border-gold h-9"
                  />
                  <Input
                    placeholder="Label (e.g., Paper Type)"
                    value={vo.label}
                    onChange={(e) => updateVariantOption(index, 'label', e.target.value)}
                    className="bg-white focus:border-gold h-9"
                  />
                  <Input
                    placeholder="Values (comma separated)"
                    value={vo.values.join(', ')}
                    onChange={(e) =>
                      updateVariantOption(
                        index,
                        'values',
                        e.target.value.split(',').map((v) => v.trim())
                      )
                    }
                    className="bg-white focus:border-gold h-9"
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={vo.required}
                      onCheckedChange={(v) => updateVariantOption(index, 'required', v)}
                    />
                    <span className="text-xs">Required</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 ml-auto text-red-500 hover:text-red-700"
                      onClick={() => removeVariantOption(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity Pricing */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-navy border-b pb-2 flex-1 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  Quantity Pricing Tiers
                </h3>
                <Button variant="outline" size="sm" onClick={addQuantityPrice} className="ml-3 text-gold border-gold/30">
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Tier
                </Button>
              </div>
              {quantityPrices.length === 0 && (
                <p className="text-xs text-muted-foreground">No quantity tiers added yet.</p>
              )}
              {quantityPrices.map((qp, index) => (
                <div key={index} className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-xs">Min Qty</Label>
                    <Input
                      type="number"
                      value={qp.minQty}
                      onChange={(e) => updateQuantityPrice(index, 'minQty', parseInt(e.target.value) || 0)}
                      className="bg-white focus:border-gold h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Max Qty</Label>
                    <Input
                      type="number"
                      value={qp.maxQty}
                      onChange={(e) => updateQuantityPrice(index, 'maxQty', parseInt(e.target.value) || 0)}
                      className="bg-white focus:border-gold h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Price/Unit (₹)</Label>
                    <Input
                      type="number"
                      value={qp.pricePer}
                      onChange={(e) => updateQuantityPrice(index, 'pricePer', parseFloat(e.target.value) || 0)}
                      className="bg-white focus:border-gold h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Discount %</Label>
                    <Input
                      type="number"
                      value={qp.discount}
                      onChange={(e) => updateQuantityPrice(index, 'discount', parseFloat(e.target.value) || 0)}
                      className="bg-white focus:border-gold h-9"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-red-500 hover:text-red-700"
                      onClick={() => removeQuantityPrice(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* SEO */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy border-b pb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                SEO
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">SEO Title</Label>
                  <Input
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    placeholder="Page title for search engines"
                    className="focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">SEO Description</Label>
                  <Textarea
                    value={formData.seoDesc}
                    onChange={(e) => setFormData({ ...formData, seoDesc: e.target.value })}
                    placeholder="Meta description"
                    rows={2}
                    className="focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">SEO Keywords</Label>
                  <Input
                    value={formData.seoKeywords}
                    onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                    placeholder="comma, separated, keywords"
                    className="focus:border-gold"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !formData.name || !formData.categoryId}
              className="gold-gradient text-navy font-semibold hover:opacity-90 hover-shimmer"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== DELETE PRODUCT CONFIRMATION ==================== */}
      <AlertDialog open={!!deleteId} onOpenChange={() => { setDeleteId(null); setDeleteName('') }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Product?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong className="text-navy">{deleteName}</strong>?
              This action cannot be undone. All associated variants, options, and pricing tiers
              will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ==================== ADD/EDIT VARIANT DIALOG ==================== */}
      <Dialog open={showVariantDialog} onOpenChange={setShowVariantDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-navy flex items-center gap-2">
              <Layers className="h-5 w-5 text-gold" />
              {editingVariant ? 'Edit Variant' : 'Add New Variant'}
            </DialogTitle>
            <DialogDescription>
              {editingVariant
                ? 'Update variant details and pricing'
                : 'Create a new product variant with material, size, and finish options'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm">
                Variant Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={variantForm.name}
                onChange={(e) => {
                  setVariantForm({ ...variantForm, name: e.target.value })
                  if (variantFormErrors.name) setVariantFormErrors({ ...variantFormErrors, name: undefined })
                }}
                placeholder="e.g., 300 GSM Matte + Gloss Finish + Standard Size"
                className={`focus:border-gold ${variantFormErrors.name ? 'border-red-400' : ''}`}
              />
              {variantFormErrors.name && (
                <p className="text-xs text-red-500">{variantFormErrors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">SKU</Label>
                <Input
                  value={variantForm.sku}
                  onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })}
                  placeholder="e.g., BC-300G-M-STD"
                  className="focus:border-gold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">
                  Price (₹) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={variantForm.price}
                  onChange={(e) => {
                    setVariantForm({ ...variantForm, price: parseFloat(e.target.value) || 0 })
                    if (variantFormErrors.price) setVariantFormErrors({ ...variantFormErrors, price: undefined })
                  }}
                  className={`focus:border-gold ${variantFormErrors.price ? 'border-red-400' : ''}`}
                />
                {variantFormErrors.price && (
                  <p className="text-xs text-red-500">{variantFormErrors.price}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Stock</Label>
              <Input
                type="number"
                value={variantForm.stock}
                onChange={(e) => setVariantForm({ ...variantForm, stock: parseInt(e.target.value) || 0 })}
                className="focus:border-gold"
              />
            </div>

            {/* Attributes */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-navy border-b pb-2">Attributes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Material</Label>
                  <Input
                    value={variantForm.attrs?.material || ''}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        attrs: { ...variantForm.attrs, material: e.target.value },
                      })
                    }
                    placeholder="e.g., 300 GSM Matte"
                    className="focus:border-gold h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Size</Label>
                  <Input
                    value={variantForm.attrs?.size || ''}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        attrs: { ...variantForm.attrs, size: e.target.value },
                      })
                    }
                    placeholder="e.g., 3.5 x 2 inches"
                    className="focus:border-gold h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Finish</Label>
                  <Input
                    value={variantForm.attrs?.finish || ''}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        attrs: { ...variantForm.attrs, finish: e.target.value },
                      })
                    }
                    placeholder="e.g., Gloss Laminate"
                    className="focus:border-gold h-9"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Image URL</Label>
              <Input
                value={variantForm.image}
                onChange={(e) => setVariantForm({ ...variantForm, image: e.target.value })}
                placeholder="Variant image URL"
                className="focus:border-gold"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={variantForm.isActive}
                onCheckedChange={(v) => setVariantForm({ ...variantForm, isActive: v })}
                className="data-[state=checked]:bg-green-500"
              />
              <Label className="text-sm">Active</Label>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setShowVariantDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveVariant}
              disabled={variantSaving}
              className="gold-gradient text-navy font-semibold hover:opacity-90"
            >
              {variantSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editingVariant ? (
                'Update Variant'
              ) : (
                'Create Variant'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== DELETE VARIANT CONFIRMATION ==================== */}
      <AlertDialog open={!!deleteVariantId} onOpenChange={() => { setDeleteVariantId(null); setDeleteVariantName('') }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Variant?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the variant{' '}
              <strong className="text-navy">{deleteVariantName}</strong>? This action cannot be
              undone and any orders using this variant may be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVariant}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Variant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
