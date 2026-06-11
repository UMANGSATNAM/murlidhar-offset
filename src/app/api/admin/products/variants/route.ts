import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/admin-api-auth'

// GET /api/admin/products/variants?productId=xxx
export async function GET(request: NextRequest) {
  const authError = verifyAdminAuth(request)
  if (authError) return authError
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      )
    }

    const variants = await db.productVariant.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    })

    const parsedVariants = variants.map((v) => ({
      ...v,
      attrs: JSON.parse(v.attrs || '{}'),
    }))

    return NextResponse.json({ variants: parsedVariants })
  } catch (error) {
    console.error('Error fetching variants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch variants' },
      { status: 500 }
    )
  }
}

// POST /api/admin/products/variants - Create a new variant
export async function POST(request: NextRequest) {
  const authError = verifyAdminAuth(request)
  if (authError) return authError
  try {
    const body = await request.json()
    const { productId, name, sku, price, stock, isActive, image, attrs } = body

    if (!productId || !name || price === undefined) {
      return NextResponse.json(
        { error: 'productId, name, and price are required' },
        { status: 400 }
      )
    }

    const variant = await db.productVariant.create({
      data: {
        productId,
        name,
        sku: sku || null,
        price: parseFloat(price),
        stock: stock || 0,
        isActive: isActive !== undefined ? isActive : true,
        image: image || null,
        attrs: JSON.stringify(attrs || {}),
      },
    })

    return NextResponse.json({ variant }, { status: 201 })
  } catch (error) {
    console.error('Error creating variant:', error)
    return NextResponse.json(
      { error: 'Failed to create variant' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/products/variants - Update a variant
export async function PATCH(request: NextRequest) {
  const authError = verifyAdminAuth(request)
  if (authError) return authError
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Variant id is required' },
        { status: 400 }
      )
    }

    const existing = await db.productVariant.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      )
    }

    const data: Record<string, unknown> = {}
    const allowedFields = ['name', 'sku', 'price', 'stock', 'isActive', 'image']

    for (const field of allowedFields) {
      if (field in updateData) {
        data[field] = updateData[field]
      }
    }

    if (updateData.attrs !== undefined) {
      data.attrs = JSON.stringify(updateData.attrs)
    }

    if (data.price !== undefined) {
      data.price = parseFloat(data.price as string)
    }
    if (data.stock !== undefined) {
      data.stock = parseInt(data.stock as string)
    }

    const variant = await db.productVariant.update({
      where: { id },
      data,
    })

    return NextResponse.json({ variant })
  } catch (error) {
    console.error('Error updating variant:', error)
    return NextResponse.json(
      { error: 'Failed to update variant' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/products/variants?id=xxx
export async function DELETE(request: NextRequest) {
  const authError = verifyAdminAuth(request)
  if (authError) return authError
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Variant id is required' },
        { status: 400 }
      )
    }

    const existing = await db.productVariant.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      )
    }

    await db.productVariant.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting variant:', error)
    return NextResponse.json(
      { error: 'Failed to delete variant' },
      { status: 500 }
    )
  }
}
