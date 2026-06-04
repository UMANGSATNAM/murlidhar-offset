import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/auth — Login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'register') {
      return await handleRegister(body)
    }

    return await handleLogin(body)
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

async function handleLogin(body: {
  email: string
  password: string
}) {
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  const user = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (!user) {
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    )
  }

  if (!user.isActive) {
    return NextResponse.json(
      { error: 'Account is deactivated. Please contact support.' },
      { status: 403 }
    )
  }

  // Simple password check (in production, use bcrypt)
  if (user.password !== password) {
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    )
  }

  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
    gstNumber: user.gstNumber,
    companyName: user.companyName,
    image: user.image,
  }

  return NextResponse.json({
    user: userData,
    message: 'Login successful',
  })
}

async function handleRegister(body: {
  name: string
  email: string
  phone?: string
  password: string
  gstNumber?: string
  companyName?: string
}) {
  const { name, email, password, phone, gstNumber, companyName } = body

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: 'Name, email, and password are required' },
      { status: 400 }
    )
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: 'Password must be at least 6 characters' },
      { status: 400 }
    )
  }

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (existingUser) {
    return NextResponse.json(
      { error: 'An account with this email already exists' },
      { status: 409 }
    )
  }

  // Create user (in production, hash the password with bcrypt)
  const user = await db.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      phone: phone || null,
      password, // In production: await bcrypt.hash(password, 10)
      gstNumber: gstNumber || null,
      companyName: companyName || null,
      role: 'customer',
    },
  })

  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
    gstNumber: user.gstNumber,
    companyName: user.companyName,
    image: user.image,
  }

  return NextResponse.json(
    {
      user: userData,
      message: 'Registration successful',
    },
    { status: 201 }
  )
}
