import { NextRequest, NextResponse } from 'next/server'
import { setOrder } from '@/lib/razorpay-cache'

// Test mode Razorpay key (platform owner will add real keys in production)
const RAZORPAY_KEY_ID = 'rzp_test_MurlidharOffset'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = 'INR', receipt, notes } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      )
    }

    // Convert amount to paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(amount * 100)

    // Generate a mock Razorpay order ID
    // In production, this would use the actual Razorpay SDK:
    // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
    // const order = await razorpay.orders.create({ amount: amountInPaise, currency, receipt, notes })
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`

    // Store in memory cache for verification
    setOrder(orderId, {
      amount: amountInPaise,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      createdAt: Date.now(),
    })

    console.log(`[Razorpay] Created simulated order: ${orderId} for ₹${amount} (${amountInPaise} paise)`)

    return NextResponse.json({
      orderId,
      amount: amountInPaise,
      currency,
      key: RAZORPAY_KEY_ID,
      notes: notes || {},
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
