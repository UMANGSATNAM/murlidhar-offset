import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'

// Hardcoded admin credentials (NOT stored in database)
const ADMIN_CREDENTIALS = {
  email: 'admin@murlidhar.com',
  password: 'Murlidhar@2024',
}

const JWT_SECRET = new TextEncoder().encode(
  'MURLIDHAR_OFFSET_JWT_SECRET_2024_PROD'
)

const EXPIRES_IN_SECONDS = 24 * 60 * 60 // 24 hours

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (
      email !== ADMIN_CREDENTIALS.email ||
      password !== ADMIN_CREDENTIALS.password
    ) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const now = Math.floor(Date.now() / 1000)

    const token = await new SignJWT({
      sub: email,
      role: 'admin',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now)
      .setExpirationTime(now + EXPIRES_IN_SECONDS)
      .sign(JWT_SECRET)

    return NextResponse.json({
      token,
      expiresIn: EXPIRES_IN_SECONDS,
    })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
