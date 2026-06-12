import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    // Check if an admin already exists
    const existingAdmin = await db.user.findFirst({
      where: {
        role: {
          in: ['admin', 'super_admin']
        }
      }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'An admin account already exists. Please login via the Admin Dashboard.' },
        { status: 400 }
      )
    }

    // Hash a default password
    const hashedPassword = await hash('admin123', 12)

    // Create the super_admin
    const newAdmin = await db.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@murlidhar.com',
        password: hashedPassword,
        phone: '1234567890',
        role: 'super_admin',
        isVerified: true,
      }
    })

    return NextResponse.json(
      {
        message: 'Admin account created successfully!',
        credentials: {
          email: 'admin@murlidhar.com',
          password: 'admin123'
        },
        actionRequired: 'Please login and change your password immediately, then DELETE this setup route.'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to setup admin:', error)
    return NextResponse.json(
      { message: 'Failed to create admin account' },
      { status: 500 }
    )
  }
}
