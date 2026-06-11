import { NextRequest, NextResponse } from 'next/server'
import {
  sendOrderConfirmationEmail,
  type OrderConfirmationEmailData,
} from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      orderNumber,
      customerName,
      customerEmail,
      items,
      subtotal,
      gstAmount,
      shippingCost,
      discountAmount,
      totalAmount,
      shippingAddress,
      estimatedDelivery,
      paymentMethod,
      userId,
      orderId,
    } = body

    // Validate required fields
    if (!orderNumber || !customerName || !customerEmail || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'orderNumber, customerName, customerEmail, and items are required' },
        { status: 400 }
      )
    }

    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
      return NextResponse.json(
        { error: 'totalAmount must be a positive number' },
        { status: 400 }
      )
    }

    const emailData: OrderConfirmationEmailData = {
      orderNumber,
      customerName,
      customerEmail,
      items: items.map((item: { name: string; quantity: number; price: number; total: number }) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      subtotal: subtotal || 0,
      gstAmount: gstAmount || 0,
      shippingCost: shippingCost || 0,
      discountAmount: discountAmount || 0,
      totalAmount,
      shippingAddress: shippingAddress || undefined,
      estimatedDelivery: estimatedDelivery || undefined,
      paymentMethod: paymentMethod || undefined,
      userId: userId || undefined,
      orderId: orderId || undefined,
    }

    const result = await sendOrderConfirmationEmail(emailData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Order confirmation email sent successfully',
        emailLogId: result.emailLogId,
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to send order confirmation email', details: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return NextResponse.json(
      { error: 'Failed to send order confirmation email' },
      { status: 500 }
    )
  }
}
