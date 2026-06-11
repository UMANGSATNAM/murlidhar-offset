import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/addresses?userId=xxx - List addresses for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const addresses = await db.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    })

    return NextResponse.json({ addresses })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

// POST /api/addresses - Create a new address
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, phone, address1, address2, city, state, pincode, country, addressType, isDefault } = body

    if (!userId || !name || !phone || !address1 || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If this is the default address, unset other defaults
    if (isDefault) {
      await db.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }

    const address = await db.address.create({
      data: {
        userId,
        name,
        phone,
        address1,
        address2: address2 || null,
        city,
        state,
        pincode,
        country: country || 'India',
        addressType: addressType || 'home',
        isDefault: isDefault || false,
      },
    })

    return NextResponse.json({ address }, { status: 201 })
  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    )
  }
}

// DELETE /api/addresses?id=xxx - Delete an address
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Address id is required' },
        { status: 400 }
      )
    }

    await db.address.delete({ where: { id } })

    return NextResponse.json({ message: 'Address deleted' })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    )
  }
}
