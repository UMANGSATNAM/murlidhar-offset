'use client'

import { useState, useEffect } from 'react'
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
  Store,
} from 'lucide-react'
import { useNavigationStore, type PageName } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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

interface NavItem {
  label: string
  page: PageName
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { label: 'Dashboard', page: 'admin', icon: LayoutDashboard },
  { label: 'Products', page: 'admin-products', icon: Package },
  { label: 'Orders', page: 'admin-orders', icon: ShoppingCart },
  { label: 'Customers', page: 'admin-customers', icon: Users },
  { label: 'CMS', page: 'admin-cms', icon: FileText },
  { label: 'Settings', page: 'admin-settings', icon: Settings },
]

const pageTitles: Record<string, string> = {
  admin: 'Dashboard',
  'admin-products': 'Products',
  'admin-orders': 'Orders',
  'admin-customers': 'Customers',
  'admin-cms': 'Content Management',
  'admin-settings': 'Settings',
}

export default function AdminLayout() {
  const { page, navigate, sidebarOpen, setSidebarOpen, toggleSidebar } =
    useNavigationStore()
  const [searchValue, setSearchValue] = useState('')
  const [notifications] = useState(3)

  const pageTitle = pageTitles[page] || 'Dashboard'
  const currentNavPage = page as PageName

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

  // Close sidebar on route change (mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setSidebarOpen])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-navy transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gold-gradient">
            <Store className="h-5 w-5 text-navy" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">Murlidhar</span>
            <Badge
              variant="secondary"
              className="bg-gold/20 text-gold text-[10px] px-1.5 py-0 font-semibold"
            >
              Admin
            </Badge>
          </div>
          <button
            className="ml-auto rounded-md p-1 text-white/60 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentNavPage === item.page
              const Icon = item.icon
              return (
                <button
                  key={item.page}
                  onClick={() => navigate(item.page)}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-gold border-l-[3px] border-gold pl-[9px]'
                      : 'text-white/70 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent pl-[9px]'
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] transition-colors ${
                      isActive ? 'text-gold' : 'text-white/50 group-hover:text-white/80'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.page === 'admin-orders' && (
                    <Badge className="ml-auto bg-gold/20 text-gold text-[10px] px-1.5 py-0 h-5">
                      3
                    </Badge>
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => navigate('home')}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-[18px] w-[18px]" />
            <span>Back to Store</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:px-6 premium-shadow">
          {/* Mobile menu button */}
          <button
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Page title */}
          <h1 className="text-lg font-semibold text-navy hidden sm:block">
            {pageTitle}
          </h1>

          {/* Search */}
          <div className="ml-auto flex items-center gap-3 sm:ml-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-64 pl-9 bg-gray-50 border-gray-200 focus:border-gold focus:ring-gold/20 h-9 text-sm"
              />
            </div>

            {/* Notification bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-500 hover:text-navy"
                >
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-navy">
                      {notifications}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-semibold text-navy">Notifications</p>
                </div>
                <DropdownMenuItem className="py-2.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">New order received</span>
                    <span className="text-xs text-muted-foreground">2 minutes ago</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">Payment confirmed</span>
                    <span className="text-xs text-muted-foreground">15 minutes ago</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">Low stock alert</span>
                    <span className="text-xs text-muted-foreground">1 hour ago</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-navy text-gold text-xs font-bold">
                      MO
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-navy">Admin</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('admin-settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('home')}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Back to Store
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
