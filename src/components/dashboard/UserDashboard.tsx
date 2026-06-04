'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  Palette,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ShoppingBag,
  ChevronRight,
  Clock,
  IndianRupee,
  Loader2,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Truck,
  Printer,
  AlertCircle,
  X,
  Save,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react'
import { useNavigationStore } from '@/lib/store'
import { useAuthStore } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

type DashboardTab = 'overview' | 'orders' | 'designs' | 'wishlist' | 'addresses' | 'profile'

interface OrderData {
  id: string
  orderNumber: string
  status: string
  subtotal: number
  totalAmount: number
  createdAt: string
  items: { id: string; name: string; quantity: number; price: number; total: number; product: { name: string; images: string[] } }[]
  shippingAddress: { name: string; address1: string; city: string; state: string; pincode: string } | null
}

interface AddressData {
  id: string
  name: string
  phone: string
  address1: string
  address2: string | null
  city: string
  state: string
  pincode: string
  isDefault: boolean
  addressType: string
}

const SIDEBAR_ITEMS: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'designs', label: 'Saved Designs', icon: Palette },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'profile', label: 'Profile Settings', icon: Settings },
]

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  pending: { color: 'text-yellow-700', bg: 'bg-yellow-100 border-yellow-300', icon: Clock },
  confirmed: { color: 'text-blue-700', bg: 'bg-blue-100 border-blue-300', icon: CheckCircle2 },
  printing: { color: 'text-blue-700', bg: 'bg-blue-100 border-blue-300', icon: Printer },
  shipped: { color: 'text-purple-700', bg: 'bg-purple-100 border-purple-300', icon: Truck },
  delivered: { color: 'text-green-700', bg: 'bg-green-100 border-green-300', icon: CheckCircle2 },
  cancelled: { color: 'text-red-700', bg: 'bg-red-100 border-red-300', icon: AlertCircle },
}

export default function UserDashboard() {
  const { navigate } = useNavigationStore()
  const { user, isLoggedIn, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Data states
  const [orders, setOrders] = useState<OrderData[]>([])
  const [addresses, setAddresses] = useState<AddressData[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null)

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    gstNumber: '',
  })
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPassword: '',
    confirm: '',
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'home' as 'home' | 'office',
  })

  useEffect(() => {
    useAuthStore.getState()._hydrate()
    requestAnimationFrame(() => setMounted(true))
  }, [])

  useEffect(() => {
    if (isLoggedIn && user) {
      setProfileForm({
        name: user.name || '',
        email: user.email,
        phone: user.phone || '',
        companyName: user.companyName || '',
        gstNumber: user.gstNumber || '',
      })
      fetchOrders()
      fetchAddresses()
    }
  }, [isLoggedIn, user])

  const fetchOrders = async () => {
    if (!user) return
    setIsLoadingOrders(true)
    try {
      const response = await fetch(`/api/orders?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch {
      // silently fail
    } finally {
      setIsLoadingOrders(false)
    }
  }

  const fetchAddresses = async () => {
    if (!user) return
    try {
      const response = await fetch(`/api/addresses?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses || [])
      }
    } catch {
      // Demo addresses
      setAddresses([])
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="size-8 text-gold animate-spin" />
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Package className="size-16 text-gold mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Please log in</h2>
          <p className="text-muted-foreground mb-6">You need to be logged in to access your dashboard</p>
          <Button onClick={() => navigate('auth')} className="gold-gradient gold-shadow">
            Login / Register
          </Button>
        </motion.div>
      </div>
    )
  }

  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed' || o.status === 'printing').length
  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0)

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveAddress = () => {
    const newAddr: AddressData = {
      id: `addr-${Date.now()}`,
      name: addressForm.name,
      phone: addressForm.phone,
      address1: addressForm.address1,
      address2: addressForm.address2 || null,
      city: addressForm.city,
      state: addressForm.state,
      pincode: addressForm.pincode,
      isDefault: addresses.length === 0,
      addressType: addressForm.addressType,
    }
    setAddresses([...addresses, newAddr])
    setShowAddressForm(false)
    setAddressForm({ name: '', phone: '', address1: '', address2: '', city: '', state: '', pincode: '', addressType: 'home' })
  }

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id))
  }

  const handleLogout = () => {
    logout()
    navigate('home')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, {user?.name || 'User'}!</p>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="size-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="flex gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:block w-56 flex-shrink-0">
              <Card className="premium-shadow sticky top-24 overflow-hidden">
                <div className="bg-navy p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="text-gold font-bold text-lg">{(user?.name || 'U').charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm truncate">{user?.name}</p>
                    <p className="text-gold-light text-xs truncate">{user?.email}</p>
                  </div>
                </div>
                <nav className="p-2">
                  {SIDEBAR_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === item.id
                          ? 'bg-gold-muted text-gold-dark'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <item.icon className="size-4" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </Card>
            </aside>

            {/* Mobile Sidebar Toggle */}
            <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
              <Button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-full gold-gradient gold-shadow h-12"
              >
                <LayoutDashboard className="size-4 mr-2" />
                {SIDEBAR_ITEMS.find(i => i.id === activeTab)?.label || 'Menu'}
              </Button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  className="w-72 h-full bg-background shadow-xl p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">Menu</h3>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                      <X className="size-4" />
                    </Button>
                  </div>
                  <nav className="space-y-1">
                    {SIDEBAR_ITEMS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          activeTab === item.id
                            ? 'bg-gold-muted text-gold-dark'
                            : 'text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        <item.icon className="size-4" />
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </motion.div>
              </div>
            )}

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Welcome Banner */}
                    <Card className="navy-gradient overflow-hidden">
                      <CardContent className="p-6">
                        <h2 className="text-xl font-bold text-white mb-1">Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋</h2>
                        <p className="text-white/70 text-sm">Manage your orders, designs, and account settings from your dashboard.</p>
                      </CardContent>
                    </Card>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { label: 'Total Orders', value: totalOrders, icon: Package, color: 'text-gold' },
                        { label: 'Pending Orders', value: pendingOrders, icon: Clock, color: 'text-yellow-600' },
                        { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, icon: IndianRupee, color: 'text-green-600' },
                      ].map((stat) => (
                        <Card key={stat.label} className="premium-shadow hover-lift">
                          <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                              </div>
                              <div className="w-10 h-10 rounded-lg bg-gold-muted flex items-center justify-center">
                                <stat.icon className={`size-5 ${stat.color}`} />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Recent Orders */}
                    <Card className="premium-shadow">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Recent Orders</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')} className="text-gold text-xs">
                          View All <ChevronRight className="size-3 ml-1" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {isLoadingOrders ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="size-6 text-gold animate-spin" />
                          </div>
                        ) : orders.length === 0 ? (
                          <div className="text-center py-8">
                            <Package className="size-12 text-muted-foreground/50 mx-auto mb-3" />
                            <p className="text-muted-foreground text-sm">No orders yet</p>
                            <Button variant="outline" size="sm" onClick={() => navigate('products')} className="mt-3">
                              Start Shopping
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {orders.slice(0, 5).map((order) => {
                              const statusConf = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                              return (
                                <div
                                  key={order.id}
                                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-gold/30 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${statusConf.bg}`}>
                                      <statusConf.icon className={`size-4 ${statusConf.color}`} />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">{order.orderNumber}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-semibold">₹{order.totalAmount.toLocaleString()}</p>
                                    <Badge variant="outline" className={`text-[10px] ${statusConf.bg} ${statusConf.color} border-0`}>
                                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </Badge>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* MY ORDERS TAB */}
                {activeTab === 'orders' && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h2 className="text-xl font-bold">My Orders</h2>

                    {isLoadingOrders ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="size-8 text-gold animate-spin" />
                      </div>
                    ) : orders.length === 0 ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <Package className="size-16 text-muted-foreground/30 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                          <p className="text-muted-foreground text-sm mb-4">When you place your first order, it will appear here.</p>
                          <Button onClick={() => navigate('products')} className="gold-gradient gold-shadow">
                            Browse Products
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => {
                          const statusConf = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                          return (
                            <Card key={order.id} className="premium-shadow hover-lift">
                              <CardContent className="p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${statusConf.bg}`}>
                                      <statusConf.icon className={`size-5 ${statusConf.color}`} />
                                    </div>
                                    <div>
                                      <p className="font-semibold text-sm">{order.orderNumber}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        {' • '}
                                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="text-right">
                                      <p className="font-bold text-lg">₹{order.totalAmount.toLocaleString()}</p>
                                      <Badge variant="outline" className={`text-xs ${statusConf.bg} ${statusConf.color} border-0`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                      </Badge>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                                    >
                                      <Eye className="size-3.5 mr-1" />
                                      Details
                                    </Button>
                                  </div>
                                </div>

                                {/* Expanded Order Details */}
                                <AnimatePresence>
                                  {selectedOrder?.id === order.id && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="overflow-hidden"
                                    >
                                      <Separator className="my-4" />
                                      <div className="space-y-3">
                                        <h4 className="text-sm font-semibold">Items:</h4>
                                        {order.items.map((item) => (
                                          <div key={item.id} className="flex items-center gap-3 text-sm">
                                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                                              <ShoppingBag className="size-4 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="font-medium truncate">{item.name}</p>
                                              <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.price}</p>
                                            </div>
                                            <p className="font-medium">₹{item.total.toLocaleString()}</p>
                                          </div>
                                        ))}
                                        {order.shippingAddress && (
                                          <div className="mt-3 p-3 rounded-lg bg-muted/50">
                                            <p className="text-xs font-semibold mb-1">Shipping Address:</p>
                                            <p className="text-xs text-muted-foreground">
                                              {order.shippingAddress.name}, {order.shippingAddress.address1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* SAVED DESIGNS TAB */}
                {activeTab === 'designs' && (
                  <motion.div
                    key="designs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-bold mb-4">Saved Designs</h2>
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Palette className="size-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No saved designs</h3>
                        <p className="text-muted-foreground text-sm mb-4">Your design projects will appear here when you create them.</p>
                        <Button variant="outline" onClick={() => navigate('products')}>Explore Products</Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* WISHLIST TAB */}
                {activeTab === 'wishlist' && (
                  <motion.div
                    key="wishlist"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-bold mb-4">Wishlist</h2>
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Heart className="size-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                        <p className="text-muted-foreground text-sm mb-4">Save items you love for later!</p>
                        <Button variant="outline" onClick={() => navigate('products')}>Browse Products</Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* ADDRESSES TAB */}
                {activeTab === 'addresses' && (
                  <motion.div
                    key="addresses"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">My Addresses</h2>
                      <Button
                        onClick={() => setShowAddressForm(true)}
                        className="gold-gradient gold-shadow text-sm"
                        size="sm"
                      >
                        <Plus className="size-4 mr-1" />
                        Add Address
                      </Button>
                    </div>

                    {/* Address Form */}
                    <AnimatePresence>
                      {showAddressForm && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <Card className="gold-border">
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <MapPin className="size-4 text-gold" />
                                Add New Address
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium mb-1.5 block">Full Name *</Label>
                                  <Input
                                    placeholder="Full name"
                                    value={addressForm.name}
                                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-medium mb-1.5 block">Phone *</Label>
                                  <Input
                                    placeholder="Phone number"
                                    value={addressForm.phone}
                                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium mb-1.5 block">Address Line 1 *</Label>
                                <Input
                                  placeholder="House No., Building, Street"
                                  value={addressForm.address1}
                                  onChange={(e) => setAddressForm({ ...addressForm, address1: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium mb-1.5 block">Address Line 2</Label>
                                <Input
                                  placeholder="Area, Colony, Landmark"
                                  value={addressForm.address2}
                                  onChange={(e) => setAddressForm({ ...addressForm, address2: e.target.value })}
                                />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                  <Label className="text-sm font-medium mb-1.5 block">City *</Label>
                                  <Input
                                    placeholder="City"
                                    value={addressForm.city}
                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-medium mb-1.5 block">State *</Label>
                                  <Input
                                    placeholder="State"
                                    value={addressForm.state}
                                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-medium mb-1.5 block">Pincode *</Label>
                                  <Input
                                    placeholder="Pincode"
                                    value={addressForm.pincode}
                                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                                    maxLength={6}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <Label className="text-sm">Type:</Label>
                                {(['home', 'office'] as const).map(type => (
                                  <button
                                    key={type}
                                    onClick={() => setAddressForm({ ...addressForm, addressType: type })}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                                      addressForm.addressType === type
                                        ? 'border-gold bg-gold-muted text-gold-dark'
                                        : 'border-border text-muted-foreground hover:border-gold/30'
                                    }`}
                                  >
                                    {type === 'home' ? '🏠 Home' : '🏢 Office'}
                                  </button>
                                ))}
                              </div>
                              <div className="flex gap-3 pt-2">
                                <Button onClick={handleSaveAddress} className="gold-gradient gold-shadow">
                                  <Save className="size-4 mr-1" />
                                  Save Address
                                </Button>
                                <Button variant="outline" onClick={() => setShowAddressForm(false)}>
                                  Cancel
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Saved Addresses */}
                    {addresses.length === 0 && !showAddressForm ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <MapPin className="size-16 text-muted-foreground/30 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No saved addresses</h3>
                          <p className="text-muted-foreground text-sm">Add your first address for faster checkout.</p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <Card key={addr.id} className={`hover-lift ${addr.isDefault ? 'gold-border' : ''}`}>
                            <CardContent className="p-5">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">
                                    {addr.addressType === 'home' ? '🏠' : '🏢'}
                                  </span>
                                  <Badge variant="secondary" className="text-[10px]">
                                    {addr.addressType}
                                  </Badge>
                                  {addr.isDefault && (
                                    <Badge className="text-[10px] bg-green-100 text-green-700 border-0">Default</Badge>
                                  )}
                                </div>
                              </div>
                              <p className="font-medium text-sm">{addr.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {addr.address1}
                                {addr.address2 && `, ${addr.address2}`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {addr.city}, {addr.state} - {addr.pincode}
                              </p>
                              <p className="text-xs text-muted-foreground">Phone: {addr.phone}</p>
                              <div className="flex gap-2 mt-3">
                                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                                  <Edit3 className="size-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteAddress(addr.id)}
                                >
                                  <Trash2 className="size-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* PROFILE SETTINGS TAB */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold">Profile Settings</h2>

                    {/* Personal Information */}
                    <Card className="premium-shadow">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Settings className="size-4 text-gold" />
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium mb-1.5 block">Full Name</Label>
                            <Input
                              value={profileForm.name}
                              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium mb-1.5 block">Email Address</Label>
                            <Input
                              type="email"
                              value={profileForm.email}
                              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                              disabled
                            />
                            <p className="text-[10px] text-muted-foreground mt-1">Email cannot be changed</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium mb-1.5 block">Phone Number</Label>
                            <Input
                              value={profileForm.phone}
                              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium mb-1.5 block">Company Name</Label>
                            <Input
                              value={profileForm.companyName}
                              onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                              placeholder="Optional"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium mb-1.5 block">GST Number</Label>
                          <Input
                            value={profileForm.gstNumber}
                            onChange={(e) => setProfileForm({ ...profileForm, gstNumber: e.target.value.toUpperCase() })}
                            placeholder="Optional - for business orders"
                            maxLength={15}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Change Password */}
                    <Card className="premium-shadow">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Lock className="size-4 text-gold" />
                          Change Password
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium mb-1.5 block">Current Password</Label>
                          <div className="relative">
                            <Input
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordForm.current}
                              onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                              placeholder="Enter current password"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                              {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium mb-1.5 block">New Password</Label>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                              placeholder="Min 6 characters"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                              {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium mb-1.5 block">Confirm New Password</Label>
                          <Input
                            type="password"
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            placeholder="Re-enter new password"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="gold-gradient gold-shadow hover:opacity-90 font-semibold"
                      >
                        {isSaving ? (
                          <Loader2 className="size-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="size-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                      {saveSuccess && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-green-600 text-sm font-medium flex items-center gap-1"
                        >
                          <CheckCircle2 className="size-4" />
                          Saved successfully!
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </motion.div>
      </div>
      {/* Bottom padding for mobile nav */}
      <div className="h-20 md:hidden" />
    </div>
  )
}
