import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/admin-api-auth'

// GET /api/admin/orders - List all orders with filtering
export async function GET(request: NextRequest) {
  const authError = verifyAdminAuth(request)
  if (authError) return authError
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ]
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              companyName: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                },
              },
            },
          },
          timeline: {
            orderBy: { createdAt: 'desc' },
          },
          internalNotes: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.order.count({ where }),
    ])

    // Parse JSON fields
    const parsedOrders = orders.map((order) => ({
      ...order,
      shippingAddress: order.shippingAddress
        ? JSON.parse(order.shippingAddress)
        : null,
      billingAddress: order.billingAddress
        ? JSON.parse(order.billingAddress)
        : null,
      items: order.items.map((item) => ({
        ...item,
        attrs: JSON.parse(item.attrs || '{}'),
        product: {
          ...item.product,
          images: JSON.parse(item.product.images || '[]'),
        },
      })),
    }))

    // Compute summary stats
    const totalRevenue = await db.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: 'paid' },
    })

    return NextResponse.json({
      orders: parsedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        totalRevenue: totalRevenue._sum.totalAmount || 0,
      },
    })
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/orders - Update order status
export async function PATCH(request: NextRequest) {
  const authError = verifyAdminAuth(request)
  if (authError) return authError
  try {
    const body = await request.json()
    const { orderId, status, paymentStatus, trackingNumber, trackingUrl, note, estimatedDelivery } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId is required' },
        { status: 400 }
      )
    }

    const existingOrder = await db.order.findUnique({
      where: { id: orderId },
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const updateData: Record<string, unknown> = {}

    if (status) {
      updateData.status = status
    }
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus
    }
    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber
    }
    if (trackingUrl !== undefined) {
      updateData.trackingUrl = trackingUrl
    }
    if (estimatedDelivery !== undefined) {
      updateData.estimatedDelivery = estimatedDelivery ? new Date(estimatedDelivery) : null
    }

    // If status is delivered, set deliveredAt
    if (status === 'delivered') {
      updateData.deliveredAt = new Date()
    }

    const order = await db.order.update({
      where: { id: orderId },
      data: updateData,
    })

    // Add timeline entry if status changed
    if (status && status !== existingOrder.status) {
      await db.orderTimeline.create({
        data: {
          orderId,
          status,
          note: note || `Order status changed to ${status}`,
        },
      })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
