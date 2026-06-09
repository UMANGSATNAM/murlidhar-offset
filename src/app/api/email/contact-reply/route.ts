import { NextRequest, NextResponse } from 'next/server'
import {
  sendContactFormAutoReply,
  sendContactFormAdminNotification,
  type ContactFormEmailData,
} from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    const emailData: ContactFormEmailData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || undefined,
      subject: subject.trim(),
      message: message.trim(),
    }

    // Send auto-reply to customer
    const autoReplyResult = await sendContactFormAutoReply(emailData)

    // Send notification to admin
    const adminNotifyResult = await sendContactFormAdminNotification(emailData)

    return NextResponse.json({
      success: true,
      autoReply: {
        sent: autoReplyResult.success,
        emailLogId: autoReplyResult.emailLogId,
      },
      adminNotification: {
        sent: adminNotifyResult.success,
        emailLogId: adminNotifyResult.emailLogId,
      },
    })
  } catch (error) {
    console.error('Error sending contact form reply:', error)
    return NextResponse.json(
      { error: 'Failed to send email reply' },
      { status: 500 }
    )
  }
}
