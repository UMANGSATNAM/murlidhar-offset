import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/orders?userId=xxx - List orders for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { userId }
    if (status) {
      where.status = status
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
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
              variant: {
                select: {
                  id: true,
                  name: true,
                  attrs: true,
                },
              },
            },
          },
          timeline: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.order.count({ where }),
    ])

    // Parse JSON fields in items
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
        variant: item.variant
          ? {
              ...item.variant,
              attrs: JSON.parse(item.variant.attrs || '{}'),
            }
          : null,
      })),
    }))

    return NextResponse.json({
      orders: parsedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
      couponCode,
    } = body

    if (!userId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'userId and items are required' },
        { status: 400 }
      )
    }

    // Calculate totals
    let subtotal = 0
    const orderItemsData = []

    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 }
        )
      }

      let unitPrice = item.price || product.basePrice

      // If variant specified, get variant price
      if (item.variantId) {
        const variant = await db.productVariant.findUnique({
          where: { id: item.variantId },
        })
        if (variant) {
          unitPrice = variant.price
        }
      }

      // Check quantity pricing
      const qtyPrice = await db.quantityPrice.findFirst({
        where: {
          productId: item.productId,
          minQty: { lte: item.quantity },
          maxQty: { gte: item.quantity },
        },
      })

      if (qtyPrice) {
        unitPrice = qtyPrice.pricePer
        if (qtyPrice.discount > 0) {
          unitPrice = unitPrice * (1 - qtyPrice.discount / 100)
        }
      }

      const itemTotal = unitPrice * item.quantity
      subtotal += itemTotal

      orderItemsData.push({
        productId: item.productId,
        variantId: item.variantId || null,
        name: product.name,
        quantity: item.quantity,
        price: unitPrice,
        total: itemTotal,
        attrs: JSON.stringify(item.attrs || {}),
        uploadId: item.uploadId || null,
      })
    }

    const gstPercent = 18
    const gstAmount = subtotal * (gstPercent / 100)
    let discountAmount = 0
    let couponId: string | null = null

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await db.coupon.findUnique({
        where: { code: couponCode },
      })
      if (coupon && coupon.isActive) {
        couponId = coupon.id
        if (coupon.type === 'percentage') {
          discountAmount = subtotal * (coupon.value / 100)
          if (coupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscount)
          }
        } else {
          discountAmount = coupon.value
        }
        // Ensure discount doesn't exceed subtotal
        discountAmount = Math.min(discountAmount, subtotal)
      }
    }

    const shippingCost = 0 // Free shipping for now
    const totalAmount = subtotal + gstAmount + shippingCost - discountAmount

    // Generate order number
    const orderCount = await db.order.count()
    const orderNumber = `MO-${Date.now().toString(36).toUpperCase()}-${(orderCount + 1).toString().padStart(4, '0')}`

    // Create order with items and timeline
    const order = await db.order.create({
      data: {
        orderNumber,
        userId,
        subtotal,
        gstAmount,
        gstPercent,
        shippingCost,
        discountAmount,
        totalAmount,
        couponId,
        paymentMethod: paymentMethod || null,
        notes: notes || null,
        shippingAddress: shippingAddress
          ? JSON.stringify(shippingAddress)
          : null,
        billingAddress: billingAddress
          ? JSON.stringify(billingAddress)
          : null,
        items: {
          create: orderItemsData,
        },
        timeline: {
          create: {
            status: 'pending',
            note: 'Order placed successfully',
          },
        },
      },
      include: {
        items: true,
        timeline: true,
      },
    })

    // Clear user's cart after successful order
    await db.cartItem.deleteMany({ where: { userId } })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
