import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/admin-api-auth'

export async function GET(request: NextRequest) {
  const authError = verifyAdminAuth(request)
  if (authError) return authError
  try {
    // Get total revenue
    const revenueResult = await db.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: 'paid' },
    })
    const totalRevenue = revenueResult._sum.totalAmount || 0

    // Get order counts by status
    const orderCounts = await db.order.groupBy({
      by: ['status'],
      _count: { id: true },
    })

    const ordersByStatus: Record<string, number> = {}
    let totalOrders = 0
    for (const oc of orderCounts) {
      ordersByStatus[oc.status] = oc._count.id
      totalOrders += oc._count.id
    }

    // Get pending orders count
    const pendingOrders =
      (ordersByStatus['pending'] || 0) +
      (ordersByStatus['confirmed'] || 0) +
      (ordersByStatus['processing'] || 0)

    // Get customer count
    const totalCustomers = await db.user.count({
      where: { role: 'customer', isActive: true },
    })

    // Get product count
    const totalProducts = await db.product.count({
      where: { isActive: true },
    })

    // Get recent orders
    const recentOrders = await db.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        items: {
          select: { id: true, name: true, quantity: true, total: true },
        },
      },
    })

    // Get monthly revenue (last 6 months)
    const now = new Date()
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    const monthlyOrders = await db.order.findMany({
      where: {
        paymentStatus: 'paid',
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    })

    // Group by month
    const monthlyRevenue: Record<string, number> = {}
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthlyRevenue[key] = 0
    }

    for (const order of monthlyOrders) {
      const key = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`
      if (key in monthlyRevenue) {
        monthlyRevenue[key] += order.totalAmount
      }
    }

    // Get top products
    const topProductItems = await db.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, total: true },
      _count: { id: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    })

    const topProducts = await Promise.all(
      topProductItems.map(async (item) => {
        const product = await db.product.findUnique({
          where: { id: item.productId },
          select: { id: true, name: true, slug: true, images: true },
        })
        return {
          product: product
            ? {
                ...product,
                images: JSON.parse(product.images || '[]'),
              }
            : null,
          totalQuantity: item._sum.quantity || 0,
          totalRevenue: item._sum.total || 0,
          orderCount: item._count.id,
        }
      })
    )

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        totalCustomers,
        totalProducts,
        ordersByStatus,
      },
      recentOrders,
      monthlyRevenue,
      topProducts,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
