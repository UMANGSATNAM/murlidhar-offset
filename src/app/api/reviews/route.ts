import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || 'newest'

    if (!productId) {
      return NextResponse.json(
        { error: 'productId query parameter is required' },
        { status: 400 }
      )
    }

    const skip = (page - 1) * limit

    // Build orderBy based on sort parameter
    let orderBy: Record<string, string> = { createdAt: 'desc' }
    switch (sort) {
      case 'highest':
        orderBy = { rating: 'desc' }
        break
      case 'lowest':
        orderBy = { rating: 'asc' }
        break
      case 'helpful':
        orderBy = { helpful: 'desc' }
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    const where = {
      productId,
      isActive: true,
    }

    const [reviews, total] = await Promise.all([
      db.review.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.review.count({ where }),
    ])

    // Calculate average rating
    const ratingStats = await db.review.aggregate({
      where,
      _avg: { rating: true },
      _count: { rating: true },
    })

    return NextResponse.json({
      reviews,
      stats: {
        average: ratingStats._avg.rating
          ? Math.round(ratingStats._avg.rating * 10) / 10
          : 0,
        count: ratingStats._count.rating,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, userName, rating, title, comment, userId } = body

    // Validate required fields
    const errors: string[] = []

    if (!productId || typeof productId !== 'string') {
      errors.push('Product ID is required')
    }

    if (!userName || typeof userName !== 'string' || userName.trim().length < 2) {
      errors.push('Name is required (min 2 characters)')
    }

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      errors.push('Rating must be between 1 and 5')
    }

    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      errors.push('Title is required (min 3 characters)')
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length < 10) {
      errors.push('Comment is required (min 10 characters)')
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors },
        { status: 400 }
      )
    }

    // Verify product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const review = await db.review.create({
      data: {
        productId,
        userId: userId || null,
        userName: userName.trim(),
        rating,
        title: title.trim(),
        comment: comment.trim(),
        helpful: 0,
        isActive: true,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    })

    return NextResponse.json(
      {
        review,
        message: 'Review submitted successfully!',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}
