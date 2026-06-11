'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Store,
  Zap,
  Plus,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle2,
  ShoppingBag,
  PackageCheck,
  Home,
  Command,
} from 'lucide-react'
import { useNavigationStore, type PageName } from '@/lib/store'
import { useAdminAuthStore } from '@/lib/admin-auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import AdminDashboard from './AdminDashboard'
import AdminProducts from './AdminProducts'
import AdminOrders from './AdminOrders'
import AdminCMS from './AdminCMS'
import AdminSettings from './AdminSettings'
import AdminCustomers from './AdminCustomers'
import AdminLogin from './AdminLogin'

interface NavItem {
  label: string
  page: PageName
  icon: React.ElementType
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: '',
    items: [{ label: 'Dashboard', page: 'admin' as PageName, icon: LayoutDashboard }],
  },
  {
    label: 'Management',
    items: [
      { label: 'Products', page: 'admin-products' as PageName, icon: Package },
      { label: 'Orders', page: 'admin-orders' as PageName, icon: ShoppingCart },
      { label: 'Customers', page: 'admin-customers' as PageName, icon: Users },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'CMS', page: 'admin-cms' as PageName, icon: FileText },
      { label: 'Settings', page: 'admin-settings' as PageName, icon: Settings },
    ],
  },
]

const pageTitles: Record<string, { title: string; icon: React.ElementType }> = {
  admin: { title: 'Dashboard', icon: LayoutDashboard },
  'admin-products': { title: 'Products', icon: Package },
  'admin-orders': { title: 'Orders', icon: ShoppingCart },
  'admin-customers': { title: 'Customers', icon: Users },
  'admin-cms': { title: 'Content Management', icon: FileText },
  'admin-settings': { title: 'Settings', icon: Settings },
}

interface Notification {
  id: string
  type: 'order' | 'payment' | 'alert'
  title: string
  description: string
  time: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'New order received',
    description: 'Order #MO-1048 from Rajesh Kumar',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment confirmed',
    description: '₹12,450 for order #MO-1042',
    time: '15 min ago',
    read: false,
  },
  {
    id: '3',
    type: 'alert',
    title: 'Low stock alert',
    description: 'Business Cards Premium is running low',
    time: '1 hour ago',
    read: true,
  },
  {
    id: '4',
    type: 'order',
    title: 'Order shipped',
    description: 'Order #MO-1035 shipped via Delhivery',
    time: '2 hours ago',
    read: true,
  },
]

const quickActionItems = [
  { label: 'Add Product', icon: Plus, page: 'admin-products' as PageName },
  { label: 'View Orders', icon: Eye, page: 'admin-orders' as PageName },
  { label: 'Manage CMS', icon: FileText, page: 'admin-cms' as PageName },
  { label: 'Settings', icon: Settings, page: 'admin-settings' as PageName },
]

export default function AdminLayout() {
  const { page, navigate, sidebarOpen, setSidebarOpen, toggleSidebar } =
    useNavigationStore()
  const adminAuth = useAdminAuthStore()
  const [searchValue, setSearchValue] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [lastLogin] = useState(() => {
    const now = new Date()
    now.setHours(now.getHours() - 2)
    return now
  })

  // Hydrate admin auth state from localStorage
  useEffect(() => {
    adminAuth._hydrate()
  }, [])

  const pageTitle = pageTitles[page]?.title || 'Dashboard'
  const PageIcon = pageTitles[page]?.icon || LayoutDashboard
  const currentNavPage = page as PageName

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const renderContent = () => {
    switch (page) {
      case 'admin':
        return <AdminDashboard />
      case 'admin-products':
        return <AdminProducts />
      case 'admin-orders':
        return <AdminOrders />
      case 'admin-customers':
        return <AdminCustomers />
      case 'admin-cms':
        return <AdminCMS />
      case 'admin-settings':
        return <AdminSettings />
      default:
        return <AdminDashboard />
    }
  }

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setSidebarOpen])

  // If not logged in, show login page
  if (!adminAuth.isLoggedIn) {
    return <AdminLogin />
  }

  const adminName = 'Murlidhar Admin'
  const adminEmail = 'admin@murlidhar.com'
  const adminInitials = 'MA'

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F5F7]">
      {/* Subtle background pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #0D1B3D 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          background: 'linear-gradient(180deg, #0D1B3D 0%, #132347 50%, #0F1F3F 100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Logo */}
        <div className="flex h-[68px] items-center gap-3 px-5 border-b border-white/[0.08]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gold-gradient shadow-lg shadow-gold/20">
            <Store className="h-5 w-5 text-navy" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tracking-tight">
                Murlidhar
              </span>
              <Badge className="bg-gold/20 text-gold text-[9px] px-1.5 py-0 font-bold uppercase tracking-wider border border-gold/30">
                Admin
              </Badge>
            </div>
            <span className="text-[10px] text-white/40 tracking-wide">
              Offset Printing
            </span>
          </div>
          <button
            className="ml-auto rounded-lg p-1.5 text-white/40 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
          {navGroups.map((group, groupIndex) => (
            <div key={groupIndex} className={groupIndex > 0 ? 'mt-4' : ''}>
              {group.label && (
                <div className="mb-2 px-3">
                  <Separator className="bg-white/[0.06] mb-3" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
                    {group.label}
                  </p>
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = currentNavPage === item.page
                  const Icon = item.icon
                  return (
                    <motion.button
                      key={item.page}
                      onClick={() => navigate(item.page)}
                      className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'text-gold'
                          : 'text-white/60 hover:text-white/90'
                      }`}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Active glow background */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavBg"
                          className="absolute inset-0 rounded-xl bg-white/[0.08]"
                          style={{
                            boxShadow: 'inset 0 0 0 1px rgba(201,162,39,0.15), 0 0 20px rgba(201,162,39,0.1)',
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 350,
                            damping: 30,
                          }}
                        />
                      )}
                      {/* Active left bar */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-gold"
                          style={{
                            boxShadow: '0 0 8px rgba(201,162,39,0.5)',
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 350,
                            damping: 30,
                          }}
                        />
                      )}
                      <Icon
                        className={`relative h-[18px] w-[18px] transition-colors ${
                          isActive
                            ? 'text-gold'
                            : 'text-white/40 group-hover:text-white/70'
                        }`}
                      />
                      <span className="relative">{item.label}</span>
                      {item.page === 'admin-orders' && (
                        <Badge className="relative ml-auto bg-gold/20 text-gold text-[10px] px-1.5 py-0 h-5 border border-gold/30">
                          3
                        </Badge>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Admin Profile Section */}
        <div className="border-t border-white/[0.08] p-3">
          {/* Back to store link */}
          <button
            onClick={() => navigate('home')}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white/40 transition-all duration-200 hover:bg-white/5 hover:text-white/70"
          >
            <Home className="h-[18px] w-[18px]" />
            <span>Back to Store</span>
            <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <Separator className="bg-white/[0.06] my-2" />

          {/* Admin profile card */}
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-3 border border-white/[0.06]">
            <div className="relative">
              <Avatar className="h-9 w-9 border border-gold/30">
                <AvatarFallback className="bg-gold/20 text-gold text-xs font-bold">
                  {adminInitials}
                </AvatarFallback>
              </Avatar>
              {/* Online status indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#0D1B3D]" />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/90 truncate">
                {adminName}
              </p>
              <p className="text-[10px] text-white/40 truncate">{adminEmail}</p>
            </div>
            <button
              onClick={() => adminAuth.logout()}
              className="rounded-lg p-1.5 text-white/30 hover:text-red-400 hover:bg-white/5 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Top bar */}
        <header className="flex h-[68px] items-center gap-4 border-b border-gray-200/80 bg-white/80 backdrop-blur-md px-4 lg:px-6 z-10">
          {/* Mobile menu button */}
          <button
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-navy transition-colors lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumb page title */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy/[0.06]">
              <PageIcon className="h-4 w-4 text-navy" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  Admin
                </span>
                <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                <span className="text-[10px] text-gold font-semibold uppercase tracking-wider">
                  {pageTitle}
                </span>
              </div>
              <h1 className="text-base font-bold text-navy leading-tight">
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* Right side controls */}
          <div className="ml-auto flex items-center gap-2">
            {/* Last login */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-muted-foreground mr-2">
              <Clock className="h-3.5 w-3.5" />
              <span>
                Last login:{' '}
                {lastLogin.toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`w-56 lg:w-64 pl-9 pr-10 bg-gray-50/80 border-gray-200/80 h-9 text-sm rounded-lg transition-all duration-200 ${
                  searchFocused
                    ? 'border-gold/50 ring-2 ring-gold/10 bg-white w-72'
                    : ''
                }`}
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
                <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[9px] font-medium text-gray-400 shadow-sm">
                  <Command className="h-2.5 w-2.5" />K
                </kbd>
              </div>
            </div>

            {/* Quick Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-500 hover:text-navy hover:bg-gold/5 h-9 w-9"
                >
                  <Zap className="h-4.5 w-4.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-3 py-2 border-b">
                  <p className="text-xs font-semibold text-navy">Quick Actions</p>
                </div>
                {quickActionItems.map((action) => {
                  const ActionIcon = action.icon
                  return (
                    <DropdownMenuItem
                      key={action.label}
                      onClick={() => navigate(action.page)}
                      className="py-2 cursor-pointer"
                    >
                      <ActionIcon className="mr-2 h-4 w-4 text-navy/60" />
                      <span>{action.label}</span>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notification bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-500 hover:text-navy hover:bg-gold/5 h-9 w-9"
                >
                  <Bell className="h-[18px] w-[18px]" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-navy shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="px-4 py-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-navy">
                      Notifications
                    </p>
                    {unreadCount > 0 && (
                      <Badge className="bg-gold/10 text-gold text-[10px] px-1.5 py-0 h-5">
                        {unreadCount} new
                      </Badge>
                    )}
                  </div>
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-gold hover:text-gold-dark font-medium"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => {
                    const NotificationIcon =
                      notification.type === 'order'
                        ? ShoppingBag
                        : notification.type === 'payment'
                        ? CheckCircle2
                        : AlertCircle
                    const iconColor =
                      notification.type === 'order'
                        ? 'text-green-600'
                        : notification.type === 'payment'
                        ? 'text-blue-600'
                        : 'text-amber-600'
                    const iconBg =
                      notification.type === 'order'
                        ? 'bg-green-50'
                        : notification.type === 'payment'
                        ? 'bg-blue-50'
                        : 'bg-amber-50'

                    return (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-gold/[0.03]' : ''
                        }`}
                      >
                        <div
                          className={`rounded-lg p-2 shrink-0 ${iconBg}`}
                        >
                          <NotificationIcon
                            className={`h-4 w-4 ${iconColor}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-navy leading-snug">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="mt-1.5 h-2 w-2 rounded-full bg-gold shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {notification.description}
                          </p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="px-4 py-2.5 border-t bg-gray-50/50">
                  <button className="text-xs text-gold hover:text-gold-dark font-medium w-full text-center">
                    View all notifications
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Separator */}
            <div className="hidden sm:block h-6 w-px bg-gray-200" />

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-gray-100/80 transition-colors">
                  <Avatar className="h-8 w-8 border-2 border-gold/20">
                    <AvatarFallback className="bg-navy text-gold text-xs font-bold">
                      {adminInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-navy leading-tight">
                      {adminName}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Super Admin
                    </p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-semibold text-navy">
                    {adminName}
                  </p>
                  <p className="text-xs text-muted-foreground">{adminEmail}</p>
                </div>
                <DropdownMenuItem
                  onClick={() => navigate('admin-settings')}
                  className="py-2 cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4 text-navy/60" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate('home')}
                  className="py-2 cursor-pointer"
                >
                  <Store className="mr-2 h-4 w-4 text-navy/60" />
                  Visit Store
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => adminAuth.logout()}
                  className="py-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
