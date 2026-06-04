import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/cms?section=xxx - Get CMS content by section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const key = searchParams.get('key')

    const where: Record<string, unknown> = { isActive: true }

    if (section) {
      where.section = section
    }
    if (key) {
      where.key = key
    }

    const contents = await db.cmsContent.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    })

    // Parse metadata JSON
    const parsed = contents.map((item) => ({
      ...item,
      metadata: JSON.parse(item.metadata || '{}'),
    }))

    // If fetching a single key, return it directly
    if (section && key) {
      const item = parsed[0]
      if (!item) {
        return NextResponse.json(
          { error: 'CMS content not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ content: item })
    }

    // Group by section if no specific key
    const grouped: Record<string, typeof parsed> = {}
    for (const item of parsed) {
      if (!grouped[item.section]) {
        grouped[item.section] = []
      }
      grouped[item.section].push(item)
    }

    return NextResponse.json({
      contents: section ? parsed : grouped,
    })
  } catch (error) {
    console.error('Error fetching CMS content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CMS content' },
      { status: 500 }
    )
  }
}

// POST /api/cms - Create or update CMS content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { section, key, title, subtitle, content, image, metadata, sortOrder, isActive } = body

    if (!section || !key) {
      return NextResponse.json(
        { error: 'section and key are required' },
        { status: 400 }
      )
    }

    // Upsert: create or update based on section+key unique constraint
    const result = await db.cmsContent.upsert({
      where: {
        section_key: { section, key },
      },
      create: {
        section,
        key,
        title: title || null,
        subtitle: subtitle || null,
        content: content || null,
        image: image || null,
        metadata: JSON.stringify(metadata || {}),
        sortOrder: sortOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
      update: {
        title: title !== undefined ? title : undefined,
        subtitle: subtitle !== undefined ? subtitle : undefined,
        content: content !== undefined ? content : undefined,
        image: image !== undefined ? image : undefined,
        metadata: metadata !== undefined ? JSON.stringify(metadata) : undefined,
        sortOrder: sortOrder !== undefined ? sortOrder : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    })

    return NextResponse.json({
      content: {
        ...result,
        metadata: JSON.parse(result.metadata || '{}'),
      },
    })
  } catch (error) {
    console.error('Error updating CMS content:', error)
    return NextResponse.json(
      { error: 'Failed to update CMS content' },
      { status: 500 }
    )
  }
}
