'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle2,
  Printer,
  MessageSquare,
  Package,
  IndianRupee,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
import { Separator } from '@/components/ui/separator'

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  total: number
  attrs: Record<string, string>
  product: {
    id: string
    name: string
    slug: string
    images: string[]
  }
}

interface TimelineEntry {
  id: string
  status: string
  note: string | null
  createdAt: string
}

interface OrderNote {
  id: string
  note: string
  isInternal: boolean
  createdBy: string | null
  createdAt: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  subtotal: number
  gstAmount: number
  gstPercent: number
  shippingCost: number
  discountAmount: number
  totalAmount: number
  paymentMethod: string | null
  paymentStatus: string
  notes: string | null
  trackingNumber: string | null
  trackingUrl: string | null
  estimatedDelivery: string | null
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
    phone: string | null
    companyName: string | null
  }
  items: OrderItem[]
  shippingAddress: Record<string, string> | null
  timeline: TimelineEntry[]
  internalNotes: OrderNote[]
}

const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  pending: { color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  confirmed: { color: 'text-blue-700', bg: 'bg-blue-100', icon: CheckCircle2 },
  processing: { color: 'text-purple-700', bg: 'bg-purple-100', icon: Package },
  printing: { color: 'text-indigo-700', bg: 'bg-indigo-100', icon: Printer },
  shipped: { color: 'text-cyan-700', bg: 'bg-cyan-100', icon: Truck },
  delivered: { color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle2 },
  cancelled: { color: 'text-red-700', bg: 'bg-red-100', icon: IndianRupee },
  refunded: { color: 'text-gray-700', bg: 'bg-gray-100', icon: IndianRupee },
}

const paymentStatusConfig: Record<string, { color: string; bg: string }> = {
  pending: { color: 'text-yellow-700', bg: 'bg-yellow-50' },
  paid: { color: 'text-green-700', bg: 'bg-green-50' },
  failed: { color: 'text-red-700', bg: 'bg-red-50' },
  refunded: { color: 'text-gray-700', bg: 'bg-gray-50' },
}

const allStatuses = ['pending', 'confirmed', 'processing', 'printing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Detail dialog
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [noteText, setNoteText] = useState('')
  const [updating, setUpdating] = useState(false)

  // Status counts
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({})

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '10')
      if (search) params.set('search', search)
      if (filterStatus !== 'all') params.set('status', filterStatus)

      const res = await fetch(`/api/admin/orders?${params}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders)
        setTotalPages(data.pagination.totalPages)
        setTotal(data.pagination.total)

        // Calculate status counts from a separate call if needed, or estimate
        // For now, we'll count from what we have
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }, [page, search, filterStatus])

  // Fetch status counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch('/api/admin/dashboard')
        if (res.ok) {
          const data = await res.json()
          setStatusCounts(data.stats?.ordersByStatus || {})
        }
      } catch (err) {
        console.error('Failed to fetch counts:', err)
      }
    }
    fetchCounts()
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setNoteText('')
    setShowDetail(true)
  }

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return
    setUpdating(true)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: newStatus,
          note: noteText || undefined,
        }),
      })
      if (res.ok) {
        setShowDetail(false)
        fetchOrders()
      }
    } catch (err) {
      console.error('Failed to update order:', err)
    } finally {
      setUpdating(false)
    }
  }

  const statusStats = [
    { key: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { key: 'printing', label: 'Printing', icon: Printer, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { key: 'shipped', label: 'Shipped', icon: Truck, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  return (
    <div className="space-y-6">
      {/* Status Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statusStats.map((stat) => {
          const Icon = stat.icon
          const count = statusCounts[stat.key] || 0
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={`cursor-pointer premium-shadow border-0 transition-all hover-lift ${
                  filterStatus === stat.key ? 'ring-2 ring-gold' : ''
                }`}
                onClick={() => {
                  setFilterStatus(filterStatus === stat.key ? 'all' : stat.key)
                  setPage(1)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${stat.bg}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-navy">{count}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Filters */}
      <Card className="premium-shadow border-0">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by order number..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9 bg-white border-gray-200 focus:border-gold h-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-40 h-9 bg-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {allStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="premium-shadow border-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80">
                <TableHead className="text-xs font-semibold text-navy">Order #</TableHead>
                <TableHead className="text-xs font-semibold text-navy">Customer</TableHead>
                <TableHead className="text-xs font-semibold text-navy hidden sm:table-cell">Items</TableHead>
                <TableHead className="text-xs font-semibold text-navy">Total</TableHead>
                <TableHead className="text-xs font-semibold text-navy">Status</TableHead>
                <TableHead className="text-xs font-semibold text-navy hidden md:table-cell">Date</TableHead>
                <TableHead className="text-xs font-semibold text-navy text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-5 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ShoppingCart className="h-8 w-8" />
                      <p className="text-sm">No orders found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => {
                  const sc = statusConfig[order.status] || statusConfig.pending
                  const pc = paymentStatusConfig[order.paymentStatus] || paymentStatusConfig.pending
                  return (
                    <TableRow
                      key={order.id}
                      className="hover:bg-gray-50/50 cursor-pointer"
                      onClick={() => handleViewOrder(order)}
                    >
                      <TableCell className="font-medium text-navy text-sm">
                        #{order.orderNumber}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>
                          <p className="font-medium text-navy">
                            {order.user.name || order.user.email}
                          </p>
                          {order.user.companyName && (
                            <p className="text-xs text-muted-foreground">{order.user.companyName}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-navy">
                        {formatCurrency(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            className={`text-[10px] px-2 py-0.5 font-medium ${sc.bg} ${sc.color} border-0`}
                          >
                            {order.status}
                          </Badge>
                          <Badge
                            className={`text-[9px] px-1.5 py-0 ${pc.bg} ${pc.color} border-0 w-fit`}
                          >
                            {order.paymentStatus}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden md:table-cell">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gold hover:text-gold-dark"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewOrder(order)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages} ({total} orders)
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

      {/* Order Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-navy text-lg">
                    Order #{selectedOrder.orderNumber}
                  </DialogTitle>
                  <Badge
                    className={`${
                      (statusConfig[selectedOrder.status] || statusConfig.pending).bg
                    } ${
                      (statusConfig[selectedOrder.status] || statusConfig.pending).color
                    } border-0`}
                  >
                    {selectedOrder.status}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Order Info + Customer Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Order Info */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-navy">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order Date</span>
                        <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment</span>
                        <span className="font-medium">{selectedOrder.paymentMethod || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Status</span>
                        <Badge
                          className={`text-[10px] ${
                            (paymentStatusConfig[selectedOrder.paymentStatus] || paymentStatusConfig.pending).bg
                          } ${
                            (paymentStatusConfig[selectedOrder.paymentStatus] || paymentStatusConfig.pending).color
                          } border-0`}
                        >
                          {selectedOrder.paymentStatus}
                        </Badge>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tracking</span>
                          <span className="font-medium text-gold">{selectedOrder.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-navy">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name</span>
                        <span className="font-medium">{selectedOrder.user.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium">{selectedOrder.user.email}</span>
                      </div>
                      {selectedOrder.user.phone && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone</span>
                          <span className="font-medium">{selectedOrder.user.phone}</span>
                        </div>
                      )}
                      {selectedOrder.user.companyName && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Company</span>
                          <span className="font-medium">{selectedOrder.user.companyName}</span>
                        </div>
                      )}
                    </div>
                    {selectedOrder.shippingAddress && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Shipping Address</p>
                        <p className="text-xs text-navy">
                          {selectedOrder.shippingAddress.address1}
                          {selectedOrder.shippingAddress.address2 &&
                            `, ${selectedOrder.shippingAddress.address2}`}
                          <br />
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                          {selectedOrder.shippingAddress.pincode}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Items */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-navy">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
                      >
                        <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center overflow-hidden flex-shrink-0 border">
                          {item.product?.images && item.product.images.length > 0 ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-navy truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-navy">
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="rounded-lg bg-gray-50 p-3 space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GST ({selectedOrder.gstPercent}%)</span>
                      <span>{formatCurrency(selectedOrder.gstAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{formatCurrency(selectedOrder.shippingCost)}</span>
                    </div>
                    {selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(selectedOrder.discountAmount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-base font-bold text-navy">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Timeline */}
                {selectedOrder.timeline.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-navy">Order Timeline</h4>
                    <div className="space-y-3">
                      {selectedOrder.timeline.map((entry) => {
                        const sc = statusConfig[entry.status] || statusConfig.pending
                        const Icon = sc.icon
                        return (
                          <div key={entry.id} className="flex items-start gap-3">
                            <div className={`rounded-full p-1.5 ${sc.bg} mt-0.5`}>
                              <Icon className={`h-3.5 w-3.5 ${sc.color}`} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-navy capitalize">
                                {entry.status}
                              </p>
                              {entry.note && (
                                <p className="text-xs text-muted-foreground">{entry.note}</p>
                              )}
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {new Date(entry.createdAt).toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Internal Notes */}
                {selectedOrder.internalNotes.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-navy">Internal Notes</h4>
                    <div className="space-y-2">
                      {selectedOrder.internalNotes.map((note) => (
                        <div key={note.id} className="rounded-lg bg-amber-50 p-3">
                          <p className="text-sm text-navy">{note.note}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {new Date(note.createdAt).toLocaleString('en-IN')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Change Status */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-navy">Update Order</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Change Status</Label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {allStatuses.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Internal Note</Label>
                      <Textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add a note for this status change..."
                        rows={2}
                        className="focus:border-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="border-t pt-4 gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="text-navy"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Invoice
                </Button>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={updating || newStatus === selectedOrder.status}
                  className="gold-gradient text-navy font-semibold hover:opacity-90"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
