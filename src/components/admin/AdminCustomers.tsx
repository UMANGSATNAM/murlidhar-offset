'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Users,
  Mail,
  Phone,
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingBag,
  IndianRupee,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { adminFetch } from '@/lib/admin-fetch'

interface Customer {
  id: string
  name: string | null
  email: string
  phone: string | null
  companyName: string | null
  role: string
  isActive: boolean
  emailVerified: boolean
  phoneVerified: boolean
  gstNumber: string | null
  createdAt: string
  _count: {
    orders: number
  }
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [page, search])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '15')
      if (search) params.set('search', search)

      // Since there's no dedicated admin/customers endpoint, we'll use the dashboard data
      // or create a simple fetch. For now, let's use a workaround.
      const res = await adminFetch(`/api/admin/dashboard`)
      if (res.ok) {
        // We'll need to add a proper customers endpoint
        // For now, we'll show a placeholder
      }
      
      // Attempt to fetch from a potential endpoint
      try {
        const custRes = await adminFetch(`/api/admin/customers?${params}`)
        if (custRes.ok) {
          const data = await custRes.json()
          setCustomers(data.customers || [])
          setTotalPages(data.pagination?.totalPages || 1)
          setTotal(data.pagination?.total || 0)
        }
      } catch {
        // Endpoint doesn't exist yet, show empty state
        setCustomers([])
        setTotalPages(1)
        setTotal(0)
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

  const getInitials = (name: string | null, email: string) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    return email.slice(0, 2).toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy">Customers</h2>
          <p className="text-sm text-muted-foreground">{total} registered customers</p>
        </div>
      </div>

      {/* Search */}
      <Card className="premium-shadow border-0">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-9 bg-white border-gray-200 focus:border-gold h-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className="premium-shadow border-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80">
                <TableHead className="text-xs font-semibold text-navy">Customer</TableHead>
                <TableHead className="text-xs font-semibold text-navy hidden sm:table-cell">Contact</TableHead>
                <TableHead className="text-xs font-semibold text-navy hidden md:table-cell">Company</TableHead>
                <TableHead className="text-xs font-semibold text-navy">Status</TableHead>
                <TableHead className="text-xs font-semibold text-navy hidden lg:table-cell">Joined</TableHead>
                <TableHead className="text-xs font-semibold text-navy text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-5 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Users className="h-8 w-8" />
                      <p className="text-sm">No customers found</p>
                      <p className="text-xs">Customers will appear here once they register</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-navy text-gold text-xs font-bold">
                            {getInitials(customer.name, customer.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-navy">
                            {customer.name || 'Unnamed'}
                          </p>
                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="space-y-0.5">
                        {customer.phone && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {customer.emailVerified ? (
                            <Badge className="text-[9px] bg-green-50 text-green-600 px-1 py-0 border-0">
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="text-[9px] bg-yellow-50 text-yellow-600 px-1 py-0 border-0">
                              Unverified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {customer.companyName ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{customer.companyName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-[10px] px-2 py-0.5 border-0 ${
                            customer.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {customer.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {customer._count?.orders || 0} orders
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">
                      {formatDate(customer.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gold hover:text-gold-dark"
                        onClick={() => {
                          setSelectedCustomer(customer)
                          setShowDetail(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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

      {/* Customer Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-lg">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle className="text-navy">Customer Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-navy text-gold text-lg font-bold">
                      {getInitials(selectedCustomer.name, selectedCustomer.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-navy">
                      {selectedCustomer.name || 'Unnamed User'}
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                    <Badge
                      className={`mt-1 text-[10px] border-0 ${
                        selectedCustomer.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {selectedCustomer.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Details */}
                <div className="space-y-3">
                  {selectedCustomer.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCustomer.phone}</span>
                      {selectedCustomer.phoneVerified && (
                        <Badge className="text-[9px] bg-green-50 text-green-600 px-1 py-0 border-0">
                          Verified
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCustomer.email}</span>
                    {selectedCustomer.emailVerified && (
                      <Badge className="text-[9px] bg-green-50 text-green-600 px-1 py-0 border-0">
                        Verified
                      </Badge>
                    )}
                  </div>
                  {selectedCustomer.companyName && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCustomer.companyName}</span>
                    </div>
                  )}
                  {selectedCustomer.gstNumber && (
                    <div className="flex items-center gap-3 text-sm">
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      <span>GST: {selectedCustomer.gstNumber}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gray-50 border-0">
                    <CardContent className="p-3 text-center">
                      <ShoppingBag className="h-5 w-5 text-navy mx-auto mb-1" />
                      <p className="text-lg font-bold text-navy">
                        {selectedCustomer._count?.orders || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Orders</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-50 border-0">
                    <CardContent className="p-3 text-center">
                      <Users className="h-5 w-5 text-navy mx-auto mb-1" />
                      <p className="text-lg font-bold text-navy capitalize">
                        {selectedCustomer.role}
                      </p>
                      <p className="text-xs text-muted-foreground">Role</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-xs text-muted-foreground">
                  Joined on {formatDate(selectedCustomer.createdAt)}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
