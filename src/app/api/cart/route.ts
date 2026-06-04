import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/cart?userId=xxx - Get user's cart items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const cartItems = await db.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true,
            isActive: true,
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
            price: true,
            sku: true,
            image: true,
            attrs: true,
            stock: true,
            isActive: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Parse JSON fields
    const parsed = cartItems.map((item) => ({
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
    }))

    // Compute totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const gstAmount = subtotal * 0.18
    const totalAmount = subtotal + gstAmount

    return NextResponse.json({
      items: parsed,
      summary: {
        subtotal: Math.round(subtotal * 100) / 100,
        gstAmount: Math.round(gstAmount * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        gstPercent: 18,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      },
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, productId, variantId, quantity, price, attrs } = body

    if (!userId || !productId || !price) {
      return NextResponse.json(
        { error: 'userId, productId, and price are required' },
        { status: 400 }
      )
    }

    // Check if same product+variant exists
    const existing = await db.cartItem.findFirst({
      where: {
        userId,
        productId,
        variantId: variantId || null,
      },
    })

    let cartItem

    if (existing) {
      // Update quantity
      cartItem = await db.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + (quantity || 1),
          attrs: JSON.stringify(attrs || {}),
        },
      })
    } else {
      // Create new
      cartItem = await db.cartItem.create({
        data: {
          userId,
          productId,
          variantId: variantId || null,
          quantity: quantity || 1,
          price,
          attrs: JSON.stringify(attrs || {}),
        },
      })
    }

    return NextResponse.json({ item: cartItem }, { status: existing ? 200 : 201 })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart?id=xxx - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!id) {
      return NextResponse.json(
        { error: 'Cart item id is required' },
        { status: 400 }
      )
    }

    // Verify ownership if userId provided
    if (userId) {
      const item = await db.cartItem.findUnique({ where: { id } })
      if (!item || item.userId !== userId) {
        return NextResponse.json(
          { error: 'Cart item not found or unauthorized' },
          { status: 404 }
        )
      }
    }

    await db.cartItem.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    )
  }
}
