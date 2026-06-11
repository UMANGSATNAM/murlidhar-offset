import { NextRequest, NextResponse } from 'next/server'
import { getOrder, deleteOrder } from '@/lib/razorpay-cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { error: 'razorpay_order_id and razorpay_payment_id are required' },
        { status: 400 }
      )
    }

    // In production, this would verify the signature using HMAC-SHA256:
    // const crypto = require('crypto')
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    //   .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    //   .digest('hex')
    // const verified = expectedSignature === razorpay_signature

    // For simulated mode, verify the order exists in our cache
    const cachedOrder = getOrder(razorpay_order_id)

    if (!cachedOrder) {
      return NextResponse.json(
        { error: 'Invalid order ID. Order not found or expired.' },
        { status: 400 }
      )
    }

    // Simulate signature verification
    // In test mode, we accept any signature as valid
    if (razorpay_signature) {
      console.log(`[Razorpay] Signature provided: ${razorpay_signature} (simulated verification)`)
    }

    // Remove the order from cache after successful verification
    deleteOrder(razorpay_order_id)

    console.log(`[Razorpay] Payment verified: order=${razorpay_order_id}, payment=${razorpay_payment_id}`)

    return NextResponse.json({
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    })
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
