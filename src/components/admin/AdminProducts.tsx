'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Package,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Star,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
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

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Dialog state
  const [showDialog, setShowDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState(emptyProduct)
  const [variantOptions, setVariantOptions] = useState<VariantOptionInput[]>([])
  const [quantityPrices, setQuantityPrices] = useState<QuantityPriceInput[]>([])
  const [saving, setSaving] = useState(false)

  // Delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null)

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

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleOpenCreate = () => {
    setEditingProduct(null)
    setFormData(emptyProduct)
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
    setVariantOptions([])
    setQuantityPrices([])
    setShowDialog(true)
  }

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        ...formData,
        slug: formData.slug || generateSlug(formData.name),
        variantOptions,
        quantityPrices,
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setShowDialog(false)
        fetchProducts()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to save product')
      }
    } catch (err) {
      console.error('Failed to save product:', err)
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
        fetchProducts()
      }
    } catch (err) {
      console.error('Failed to toggle product:', err)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/admin/products?id=${deleteId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchProducts()
      }
    } catch (err) {
      console.error('Failed to delete product:', err)
    } finally {
      setDeleteId(null)
    }
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy">Products</h2>
          <p className="text-sm text-muted-foreground">{total} total products</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="gold-gradient text-navy font-semibold hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="premium-shadow border-0">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search products..."
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

      {/* Products Table */}
      <Card className="premium-shadow border-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80">
                <TableHead className="text-xs font-semibold text-navy">Product</TableHead>
                <TableHead className="text-xs font-semibold text-navy">Category</TableHead>
                <TableHead className="text-xs font-semibold text-navy">Price</TableHead>
                <TableHead className="text-xs font-semibold text-navy">Status</TableHead>
                <TableHead className="text-xs font-semibold text-navy text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-5 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Package className="h-8 w-8" />
                      <p className="text-sm">No products found</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleOpenCreate}
                        className="text-gold border-gold/30 hover:bg-gold/10"
                      >
                        Add your first product
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-navy truncate max-w-[200px]">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{product.slug}</span>
                            {product.isFeatured && (
                              <Star className="h-3 w-3 text-gold fill-gold" />
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs bg-navy/5 text-navy">
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
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={product.isActive}
                          onCheckedChange={() => handleToggleActive(product)}
                          className="data-[state=checked]:bg-green-500"
                        />
                        <span className={`text-xs ${product.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEdit(product)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(product)}>
                            {product.isActive ? (
              <>
                <ToggleLeft className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <ToggleRight className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => setDeleteId(product.id)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
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

      {/* Add/Edit Product Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy text-lg">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      })
                    }}
                    placeholder="e.g. Premium Business Cards"
                    className="focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="premium-business-cards"
                    className="focus:border-gold"
                  />
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

            {/* Pricing & Category */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy border-b pb-2">Pricing & Category</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(v) => setFormData({ ...formData, categoryId: v })}
                  >
                    <SelectTrigger className="focus:border-gold">
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
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Base Price (₹) *</Label>
                  <Input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })
                    }
                    className="focus:border-gold"
                  />
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
              <h3 className="text-sm font-semibold text-navy border-b pb-2">Product Settings</h3>
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
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
                  />
                  <Label className="text-sm">Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isFeatured}
                    onCheckedChange={(v) => setFormData({ ...formData, isFeatured: v })}
                  />
                  <Label className="text-sm">Featured</Label>
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
                <h3 className="text-sm font-semibold text-navy border-b pb-2 flex-1">Variant Options</h3>
                <Button variant="outline" size="sm" onClick={addVariantOption} className="ml-3 text-gold border-gold/30">
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Option
                </Button>
              </div>
              {variantOptions.length === 0 && (
                <p className="text-xs text-muted-foreground">No variant options added yet</p>
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
                <h3 className="text-sm font-semibold text-navy border-b pb-2 flex-1">Quantity Pricing Tiers</h3>
                <Button variant="outline" size="sm" onClick={addQuantityPrice} className="ml-3 text-gold border-gold/30">
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Tier
                </Button>
              </div>
              {quantityPrices.length === 0 && (
                <p className="text-xs text-muted-foreground">No quantity tiers added yet</p>
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
              <h3 className="text-sm font-semibold text-navy border-b pb-2">SEO</h3>
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
              className="gold-gradient text-navy font-semibold hover:opacity-90"
            >
              {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product and all
              associated variants, options, and pricing tiers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
