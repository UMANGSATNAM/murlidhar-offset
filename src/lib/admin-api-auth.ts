import { NextRequest, NextResponse } from 'next/server'

// Hardcoded admin credentials (same as frontend)
const ADMIN_CREDENTIALS = {
  email: 'admin@murlidhar.com',
  password: 'Murlidhar@2024',
}

export function verifyAdminAuth(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')
  // Token format: base64(email:password) — matches the hardcoded credentials
  try {
    const decoded = Buffer.from(token, 'base64').toString()
    const [email, password] = decoded.split(':')
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      return null // Auth passed
    }
  } catch {
    // Invalid token format
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
