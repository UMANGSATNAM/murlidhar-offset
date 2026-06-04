import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
        variants: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
        },
        variantOptions: {
          orderBy: { sortOrder: 'asc' },
        },
        quantityPrices: {
          orderBy: { minQty: 'asc' },
        },
        faqs: {
          orderBy: { sortOrder: 'asc' },
        },
        reviews: {
          where: { isActive: true },
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const parsedProduct = {
      ...product,
      images: JSON.parse(product.images || '[]'),
      variants: product.variants.map((v) => ({
        ...v,
        attrs: JSON.parse(v.attrs || '{}'),
      })),
      variantOptions: product.variantOptions.map((vo) => ({
        ...vo,
        values: JSON.parse(vo.values || '[]'),
      })),
    }

    // Compute average rating
    const reviewCount = product.reviews.length
    const avgRating =
      reviewCount > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0

    return NextResponse.json({
      product: parsedProduct,
      reviewStats: {
        average: Math.round(avgRating * 10) / 10,
        count: reviewCount,
      },
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
