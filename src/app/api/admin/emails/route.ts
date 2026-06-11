import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/admin-api-auth'

// GET /api/admin/emails — List all email logs with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authError = await verifyAdminAuth(request)
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Validate pagination
    const validPage = Math.max(1, page)
    const validLimit = Math.min(100, Math.max(1, limit))
    const skip = (validPage - 1) * validLimit

    // Build where clause
    const where: Record<string, unknown> = {}
    if (type) {
      where.type = type
    }
    if (status) {
      where.status = status
    }
    if (search) {
      where.OR = [
        { to: { contains: search } },
        { from: { contains: search } },
        { subject: { contains: search } },
      ]
    }

    const [emails, total] = await Promise.all([
      db.emailLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: validLimit,
        select: {
          id: true,
          to: true,
          from: true,
          subject: true,
          type: true,
          status: true,
          userId: true,
          orderId: true,
          error: true,
          sentAt: true,
          createdAt: true,
          // Exclude 'body' from list for performance — available via individual GET
        },
      }),
      db.emailLog.count({ where }),
    ])

    // Get summary stats
    const [sentCount, failedCount, pendingCount] = await Promise.all([
      db.emailLog.count({ where: { status: 'sent' } }),
      db.emailLog.count({ where: { status: 'failed' } }),
      db.emailLog.count({ where: { status: 'pending' } }),
    ])

    return NextResponse.json({
      emails,
      pagination: {
        page: validPage,
        limit: validLimit,
        total,
        totalPages: Math.ceil(total / validLimit),
      },
      stats: {
        sent: sentCount,
        failed: failedCount,
        pending: pendingCount,
      },
    })
  } catch (error) {
    console.error('Error fetching email logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email logs' },
      { status: 500 }
    )
  }
}
