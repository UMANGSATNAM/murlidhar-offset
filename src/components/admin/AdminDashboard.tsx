'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Package,
  ArrowRight,
  Plus,
  Eye,
  Tag,
  Bell,
  CreditCard,
  Upload,
  Truck,
  UserPlus,
  Image,
  FileText,
  Settings,
  Zap,
  BarChart3,
  Calendar,
  Activity,
  ChevronRight,
  ShoppingBag,
  PackageCheck,
  AlertTriangle,
  CheckCircle2,
  Star,
  Target,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { useNavigationStore } from '@/lib/store'
import { adminFetch } from '@/lib/admin-fetch'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  pendingOrders: number
  totalCustomers: number
  totalProducts: number
  ordersByStatus: Record<string, number>
}

interface RecentOrder {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  createdAt: string
  user: { name: string | null; email: string }
  items: { id: string; name: string; quantity: number; total: number }[]
}

interface TopProduct {
  product: {
    id: string
    name: string
    slug: string
    images: string[]
  } | null
  totalQuantity: number
  totalRevenue: number
  orderCount: number
}

interface ActivityItem {
  id: string
  type: 'order' | 'payment' | 'design' | 'shipment' | 'customer'
  description: string
  timeAgo: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  printing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
}

const pieColors = ['#0D1B3D', '#C9A227', '#1A2D52', '#D4B54E', '#4B5563', '#6B7280']

// Mock activity feed data
const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'order',
    description: 'New order #MO-1048 placed by Rajesh Kumar',
    timeAgo: '2 min ago',
    icon: ShoppingCart,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: '2',
    type: 'payment',
    description: 'Payment of ₹12,450 received for order #MO-1042',
    timeAgo: '15 min ago',
    icon: CreditCard,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: '3',
    type: 'design',
    description: 'Design uploaded for Wedding Cards order #MO-1039',
    timeAgo: '32 min ago',
    icon: Upload,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: '4',
    type: 'shipment',
    description: 'Order #MO-1035 shipped via Delhivery Express',
    timeAgo: '1 hr ago',
    icon: Truck,
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
  },
  {
    id: '5',
    type: 'customer',
    description: 'New customer Priya Sharma registered',
    timeAgo: '2 hr ago',
    icon: UserPlus,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    id: '6',
    type: 'order',
    description: 'New order #MO-1047 placed by Amit Patel',
    timeAgo: '3 hr ago',
    icon: ShoppingCart,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: '7',
    type: 'payment',
    description: 'Payment of ₹8,200 received for order #MO-1041',
    timeAgo: '4 hr ago',
    icon: CreditCard,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: '8',
    type: 'design',
    description: 'Design approved for Brochures order #MO-1038',
    timeAgo: '5 hr ago',
    icon: Image,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
]

const quickActionGrid = [
  {
    label: 'Add Product',
    icon: Plus,
    page: 'admin-products' as const,
    gradient: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    label: 'Process Order',
    icon: PackageCheck,
    page: 'admin-orders' as const,
    gradient: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Send Notification',
    icon: Bell,
    page: 'admin-cms' as const,
    gradient: 'from-purple-500 to-purple-600',
    bgLight: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    label: 'View Reports',
    icon: BarChart3,
    page: 'admin' as const,
    gradient: 'from-amber-500 to-amber-600',
    bgLight: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
]

export default function AdminDashboard() {
  const { navigate } = useNavigationStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [monthlyRevenue, setMonthlyRevenue] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await adminFetch('/api/admin/dashboard')
        if (res.ok) {
          const data = await res.json()
          setStats(data.stats)
          setRecentOrders(data.recentOrders || [])
          setTopProducts(data.topProducts || [])
          setMonthlyRevenue(data.monthlyRevenue || {})
        }
      } catch (err) {
        console.error('Failed to fetch dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)

  // Prepare chart data
  const revenueChartData = Object.entries(monthlyRevenue)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => {
      const [year, month] = key.split('-')
      const date = new Date(parseInt(year), parseInt(month) - 1)
      return {
        month: date.toLocaleDateString('en-IN', { month: 'short' }),
        revenue: value,
      }
    })

  const orderStatusData = stats?.ordersByStatus
    ? Object.entries(stats.ordersByStatus).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
      }))
    : []

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats ? formatCurrency(stats.totalRevenue) : '₹0',
      icon: IndianRupee,
      trend: '+12.5%',
      trendUp: true,
      gradient: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      sparkUp: true,
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders?.toLocaleString('en-IN') || '0',
      icon: ShoppingCart,
      trend: '+8.2%',
      trendUp: true,
      gradient: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50',
      iconColor: 'text-blue-600',
      sparkUp: true,
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers?.toLocaleString('en-IN') || '0',
      icon: Users,
      trend: '+5.1%',
      trendUp: true,
      gradient: 'from-purple-500 to-violet-600',
      bgLight: 'bg-purple-50',
      iconColor: 'text-purple-600',
      sparkUp: true,
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders?.toLocaleString('en-IN') || '0',
      icon: Clock,
      trend: '-2.3%',
      trendUp: false,
      gradient: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50',
      iconColor: 'text-amber-600',
      sparkUp: false,
    },
  ]

  // Today's highlights mock data
  const todayHighlights = [
    {
      label: "Today's Orders",
      value: stats ? Math.max(Math.floor(stats.totalOrders * 0.08), 3) : 3,
      icon: ShoppingBag,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: "Today's Revenue",
      value: stats ? formatCurrency(Math.max(stats.totalRevenue * 0.05, 4500)) : '₹4,500',
      icon: IndianRupee,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'New Customers',
      value: stats ? Math.max(Math.floor(stats.totalCustomers * 0.04), 2) : 2,
      icon: UserPlus,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Design Approvals',
      value: 5,
      icon: CheckCircle2,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse border-0">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200/60 rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse border-0">
              <CardContent className="p-6">
                <div className="h-64 bg-gray-200/60 rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Professional Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, #0D1B3D 0%, #152952 40%, #1A3366 70%, #0D1B3D 100%)',
        }}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full -translate-y-1/3 translate-x-1/4 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-gold/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Welcome text */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-gold/20 text-gold border border-gold/30 text-[10px] px-2 py-0.5 font-semibold uppercase tracking-wider">
                  <Activity className="h-3 w-3 mr-1" />
                  Live
                </Badge>
                <span className="text-white/40 text-xs">
                  {currentTime.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Welcome back,{' '}
                <span className="gold-gradient-text">Admin</span> 👋
              </h2>
              <p className="text-white/50 text-sm">
                Here&apos;s what&apos;s happening with your store today.{' '}
                <span className="text-gold/70">
                  {currentTime.toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </p>

              {/* Quick stats inline */}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-2 bg-white/[0.06] rounded-lg px-3 py-1.5 border border-white/[0.08]">
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-white/70">
                    {stats?.totalOrders || 0} orders
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.06] rounded-lg px-3 py-1.5 border border-white/[0.08]">
                  <div className="h-2 w-2 rounded-full bg-gold" />
                  <span className="text-xs text-white/70">
                    {stats ? formatCurrency(stats.totalRevenue) : '₹0'} revenue
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.06] rounded-lg px-3 py-1.5 border border-white/[0.08]">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  <span className="text-xs text-white/70">
                    {stats?.totalCustomers || 0} customers
                  </span>
                </div>
              </div>
            </div>

            {/* Quick actions on the welcome banner */}
            <div className="grid grid-cols-2 gap-2 w-full lg:w-auto">
              {quickActionGrid.map((action) => {
                const ActionIcon = action.icon
                return (
                  <Button
                    key={action.label}
                    variant="ghost"
                    className="bg-white/[0.06] hover:bg-white/[0.1] text-white/80 hover:text-white border border-white/[0.08] h-12 justify-start px-4 rounded-xl text-xs font-medium"
                    onClick={() => navigate(action.page)}
                  >
                    <div className={`rounded-lg p-1.5 mr-2.5 ${action.bgLight}`}>
                      <ActionIcon className={`h-3.5 w-3.5 ${action.iconColor}`} />
                    </div>
                    {action.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Gold accent line at bottom */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </motion.div>

      {/* Today's Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardHeader className="pb-3 pt-4 px-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/10">
                  <Star className="h-3.5 w-3.5 text-gold" />
                </div>
                <CardTitle className="text-sm font-semibold text-navy">
                  Today&apos;s Highlights
                </CardTitle>
              </div>
              <Badge variant="secondary" className="text-[10px] bg-gold/10 text-gold-dark font-medium">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-4 pt-0">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {todayHighlights.map((item) => {
                const HighlightIcon = item.icon
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 border border-gray-100/80 hover:border-gold/20 hover:bg-gold/[0.02] transition-all duration-200"
                  >
                    <div className={`rounded-lg p-2 ${item.bg}`}>
                      <HighlightIcon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-bold text-navy">{item.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.08, duration: 0.4 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  {/* Gradient top accent bar */}
                  <div className={`h-1 bg-gradient-to-r ${card.gradient}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-lg p-2 ${card.bgLight} group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className={`h-4.5 w-4.5 ${card.iconColor}`} />
                          </div>
                          <p className="text-xs font-medium text-muted-foreground">
                            {card.title}
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-navy tracking-tight">
                          {card.value}
                        </p>
                        <div className="flex items-center gap-1.5">
                          {card.trendUp ? (
                            <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                          )}
                          <span
                            className={`text-xs font-semibold ${
                              card.trendUp ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {card.trend}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            vs last month
                          </span>
                        </div>
                      </div>
                      {/* Sparkline */}
                      <svg width="64" height="28" viewBox="0 0 64 28" className="opacity-50 shrink-0 mt-2">
                        {card.sparkUp ? (
                          <>
                            <path
                              d="M0 22 Q8 20 16 16 T32 10 T48 6 T64 2"
                              fill="none"
                              stroke="#22c55e"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M0 22 Q8 20 16 16 T32 10 T48 6 T64 2 L64 28 L0 28 Z"
                              fill="url(#sparkGreen)"
                              opacity="0.15"
                            />
                            <defs>
                              <linearGradient id="sparkGreen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22c55e" />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                          </>
                        ) : (
                          <>
                            <path
                              d="M0 6 Q8 8 16 12 T32 18 T48 22 T64 24"
                              fill="none"
                              stroke="#ef4444"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M0 6 Q8 8 16 12 T32 18 T48 22 T64 24 L64 28 L0 28 Z"
                              fill="url(#sparkRed)"
                              opacity="0.15"
                            />
                            <defs>
                              <linearGradient id="sparkRed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                          </>
                        )}
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-navy via-gold/40 to-navy" />
            <CardHeader className="pb-2 pt-4 px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
                    <TrendingUp className="h-3.5 w-3.5 text-navy" />
                  </div>
                  <CardTitle className="text-navy text-sm font-semibold">
                    Revenue Overview
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="text-[10px] bg-gold/10 text-gold-dark font-medium">
                  Last 6 months
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-5 pb-4">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0D1B3D" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#0D1B3D" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="revenueStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0D1B3D" />
                        <stop offset="50%" stopColor="#1A2D52" />
                        <stop offset="100%" stopColor="#0D1B3D" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: '#9CA3AF' }}
                      axisLine={false}
                      tickLine={false}
                      dy={8}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#9CA3AF' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                      dx={-4}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        formatCurrency(value),
                        'Revenue',
                      ]}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        padding: '10px 14px',
                      }}
                      labelStyle={{ fontWeight: 600, color: '#0D1B3D', marginBottom: 4 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="url(#revenueStroke)"
                      strokeWidth={2.5}
                      fill="url(#revenueGradient)"
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: '#0D1B3D',
                        stroke: '#fff',
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          <Card className="border-0 shadow-sm h-full overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-gold/40 via-navy/40 to-gold/40" />
            <CardHeader className="pb-2 pt-4 px-5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/10">
                  <Target className="h-3.5 w-3.5 text-gold" />
                </div>
                <CardTitle className="text-navy text-sm font-semibold">
                  Order Distribution
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-5 pb-4">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {orderStatusData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={pieColors[index % pieColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [value, 'Orders']}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 space-y-2">
                {orderStatusData.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs px-1"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: pieColors[index % pieColors.length],
                        }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold text-navy">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row: Recent Orders + Activity Timeline + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-navy via-gold/40 to-navy" />
            <CardHeader className="pb-3 pt-4 px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/5">
                    <ShoppingBag className="h-3.5 w-3.5 text-navy" />
                  </div>
                  <CardTitle className="text-navy text-sm font-semibold">
                    Recent Orders
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gold hover:text-gold-dark text-xs h-8 gap-1"
                  onClick={() => navigate('admin-orders')}
                >
                  View All
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-5 pb-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100">
                    <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Order</TableHead>
                    <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Customer</TableHead>
                    <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Amount</TableHead>
                    <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <Package className="h-8 w-8 text-gray-300" />
                          <span className="text-sm">No orders yet</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentOrders.slice(0, 5).map((order) => (
                      <TableRow
                        key={order.id}
                        className="hover:bg-gold/[0.03] transition-colors border-b border-gray-50"
                      >
                        <TableCell className="font-semibold text-navy text-sm py-3">
                          #{order.orderNumber}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 py-3">
                          {order.user.name || order.user.email}
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            className={`text-[10px] px-2.5 py-0.5 font-medium rounded-full ${
                              statusColors[order.status] || 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm font-semibold text-navy py-3">
                          {formatCurrency(order.totalAmount)}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground py-3">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column: Quick Actions + Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="space-y-6"
        >
          {/* Quick Actions Grid */}
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="h-[2px] gold-gradient" />
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gold/10">
                  <Zap className="h-3 w-3 text-gold" />
                </div>
                <h3 className="text-xs font-semibold text-navy uppercase tracking-wider">
                  Quick Actions
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quickActionGrid.map((action) => {
                  const ActionIcon = action.icon
                  return (
                    <motion.button
                      key={action.label}
                      onClick={() => navigate(action.page)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50/80 border border-gray-100 hover:border-gold/30 hover:bg-gold/[0.04] transition-all duration-200 group"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`rounded-lg p-2 ${action.bgLight} group-hover:scale-110 transition-transform duration-200`}>
                        <ActionIcon className={`h-4 w-4 ${action.iconColor}`} />
                      </div>
                      <span className="text-[11px] font-medium text-navy/70 group-hover:text-navy">
                        {action.label}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Timeline */}
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-gold/40 via-navy/40 to-gold/40" />
            <CardHeader className="pb-2 pt-4 px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-navy/5">
                    <Activity className="h-3 w-3 text-navy" />
                  </div>
                  <CardTitle className="text-navy text-sm font-semibold">
                    Recent Activity
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="text-[9px] bg-green-50 text-green-700 font-medium border border-green-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1 animate-pulse" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-5 pb-4">
              <div className="space-y-0 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
                {mockActivities.map((activity, index) => {
                  const ActivityIcon = activity.icon
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.25 }}
                      className="relative flex items-start gap-3 py-2.5 group"
                    >
                      {/* Timeline connector line */}
                      {index < mockActivities.length - 1 && (
                        <div className="absolute left-[13px] top-9 bottom-0 w-px bg-gray-100 group-last:bg-transparent" />
                      )}
                      <div className={`rounded-lg p-1.5 shrink-0 border border-gray-100 ${activity.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                        <ActivityIcon className={`h-3 w-3 ${activity.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-navy leading-relaxed group-hover:text-navy/80">
                          {activity.description}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                          {activity.timeAgo}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Best Sellers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-navy via-gold/40 to-navy" />
          <CardHeader className="pb-3 pt-4 px-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/10">
                  <Star className="h-3.5 w-3.5 text-gold" />
                </div>
                <CardTitle className="text-navy text-sm font-semibold">
                  Best Sellers
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gold hover:text-gold-dark text-xs h-8 gap-1"
                onClick={() => navigate('admin-products')}
              >
                View All
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-5 pb-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {topProducts.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8 col-span-full">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-8 w-8 text-gray-300" />
                    <span>No sales data yet</span>
                  </div>
                </div>
              ) : (
                topProducts.slice(0, 5).map((item, index) => (
                  <motion.div
                    key={item.product?.id || index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 border border-gray-100/80 hover:border-gold/20 hover:shadow-sm transition-all duration-200"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-navy to-navy/80 text-xs font-bold text-gold shrink-0 shadow-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-navy truncate">
                        {item.product?.name || 'Unknown Product'}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {item.totalQuantity} sold · {item.orderCount} orders
                      </p>
                    </div>
                    <span className="text-xs font-bold text-gold">
                      {formatCurrency(item.totalRevenue)}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
