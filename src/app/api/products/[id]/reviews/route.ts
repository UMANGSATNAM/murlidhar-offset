import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || 'newest'

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

    // Get rating distribution
    const ratingDistribution = await Promise.all(
      [5, 4, 3, 2, 1].map(async (star) => {
        const count = await db.review.count({
          where: { ...where, rating: star },
        })
        return { rating: star, count }
      })
    )

    return NextResponse.json({
      reviews,
      stats: {
        average: ratingStats._avg.rating
          ? Math.round(ratingStats._avg.rating * 10) / 10
          : 0,
        count: ratingStats._count.rating,
        distribution: ratingDistribution,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching product reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
