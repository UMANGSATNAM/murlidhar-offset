import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Use a fresh PrismaClient to ensure schema changes are picked up
const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    const errors: string[] = []

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Name is required and must be at least 2 characters')
    }

    if (!email || typeof email !== 'string') {
      errors.push('Email is required')
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.trim())) {
        errors.push('Please provide a valid email address')
      }
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length < 2) {
      errors.push('Subject is required')
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      errors.push('Message is required and must be at least 10 characters')
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors },
        { status: 400 }
      )
    }

    // Store the submission in the database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        subject: subject.trim(),
        message: message.trim(),
        status: 'new',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully! We will get back to you within 2 business hours.',
        id: submission.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again later.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (status) {
      where.status = status
    }

    const [submissions, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contactSubmission.count({ where }),
    ])

    return NextResponse.json({
      submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching contact submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}
