// AI email generation uses a dedicated worker service (mini-services/email-worker)
// to avoid Turbopack compilation issues with z-ai-web-dev-sdk
import { db } from '@/lib/db'

// ==================== TYPES ====================

export type EmailType =
  | 'contact_form'
  | 'order_confirmation'
  | 'order_status'
  | 'welcome'
  | 'quote'

export interface SendEmailParams {
  to: string
  from?: string
  subject: string
  body: string
  type: EmailType
  userId?: string
  orderId?: string
}

export interface ContactFormEmailData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface OrderConfirmationEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  gstAmount: number
  shippingCost: number
  discountAmount: number
  totalAmount: number
  shippingAddress?: string
  estimatedDelivery?: string
  paymentMethod?: string
  userId?: string
  orderId?: string
}

export interface OrderStatusEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  newStatus: string
  note?: string
  trackingNumber?: string
  trackingUrl?: string
  userId?: string
  orderId?: string
}

export interface WelcomeEmailData {
  name: string
  email: string
  userId?: string
}

export interface QuoteRequestEmailData {
  name: string
  email: string
  phone?: string
  productName?: string
  quantity?: number
  specifications?: string
  message: string
}

// ==================== EMAIL TEMPLATES ====================

function wrapInEmailLayout(content: string, previewText: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Murlidhar Offset</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%); padding: 30px 40px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
    .header p { color: #fecaca; margin: 5px 0 0; font-size: 14px; }
    .body { padding: 30px 40px; color: #1f2937; line-height: 1.6; }
    .body h2 { color: #b91c1c; font-size: 20px; margin: 0 0 15px; }
    .body p { margin: 0 0 12px; font-size: 15px; }
    .highlight-box { background-color: #fef2f2; border-left: 4px solid #b91c1c; padding: 15px 20px; margin: 20px 0; border-radius: 0 6px 6px 0; }
    .table-container { width: 100%; margin: 20px 0; border-collapse: collapse; }
    .table-container th { background-color: #f9fafb; padding: 10px 12px; text-align: left; font-size: 13px; color: #6b7280; border-bottom: 2px solid #e5e7eb; }
    .table-container td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #f3f4f6; }
    .total-row { font-weight: 700; background-color: #fef2f2; }
    .btn { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%); color: #ffffff !important; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 600; margin: 15px 0; }
    .footer { background-color: #f9fafb; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { color: #9ca3af; font-size: 12px; margin: 4px 0; }
    .footer a { color: #b91c1c; text-decoration: none; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; text-transform: capitalize; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MURLIDHAR OFFSET</h1>
      <p>Premium Offset Printing Solutions</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p><strong>Murlidhar Offset</strong> — Premium Offset Printing Since 1985</p>
      <p>Gujarat, India | <a href="mailto:info@murlidharoffset.com">info@murlidharoffset.com</a></p>
      <p>This is an automated email. Please do not reply directly to this message.</p>
    </div>
  </div>
</body>
</html>`
}

// ==================== TEMPLATE GENERATORS ====================

function generateContactFormAutoReply(data: ContactFormEmailData): string {
  const content = `
    <h2>Thank You for Contacting Us, ${data.name}!</h2>
    <p>We have received your inquiry regarding <strong>"${data.subject}"</strong> and wanted to let you know that our team is already reviewing your message.</p>
    <div class="highlight-box">
      <p style="margin:0"><strong>Your Message:</strong></p>
      <p style="margin:5px 0 0;color:#4b5563">${data.message}</p>
    </div>
    <p>We take pride in responding to all inquiries within <strong>2 business hours</strong>. If your request is urgent, please don't hesitate to call us directly.</p>
    <p>Here's what happens next:</p>
    <ul style="padding-left:20px;margin:10px 0">
      <li>Our team reviews your requirements</li>
      <li>We prepare a detailed response or quote</li>
      <li>You receive a personalized reply via email or phone</li>
    </ul>
    <p>We look forward to working with you!</p>
    <p>Warm regards,<br><strong>Team Murlidhar Offset</strong></p>`
  return wrapInEmailLayout(content, `Thank you for your inquiry, ${data.name}`)
}

function generateContactFormAdminNotification(data: ContactFormEmailData): string {
  const content = `
    <h2>New Contact Form Submission</h2>
    <p>A new inquiry has been submitted through the website contact form.</p>
    <div class="highlight-box">
      <table style="width:100%;border:none">
        <tr><td style="padding:4px 0;font-weight:600;width:100px">Name:</td><td>${data.name}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600">Email:</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
        ${data.phone ? `<tr><td style="padding:4px 0;font-weight:600">Phone:</td><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>` : ''}
        <tr><td style="padding:4px 0;font-weight:600">Subject:</td><td>${data.subject}</td></tr>
      </table>
    </div>
    <p><strong>Message:</strong></p>
    <div class="highlight-box">
      <p style="margin:0;color:#4b5563">${data.message}</p>
    </div>
    <p>Please respond to this inquiry at your earliest convenience.</p>`
  return wrapInEmailLayout(content, 'New Contact Form Submission')
}

function generateOrderConfirmationEmail(data: OrderConfirmationEmailData): string {
  const itemsRows = data.items
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td style="text-align:center">${item.quantity}</td>
      <td style="text-align:right">₹${item.price.toFixed(2)}</td>
      <td style="text-align:right">₹${item.total.toFixed(2)}</td>
    </tr>`
    )
    .join('')

  const shippingAddressHtml = data.shippingAddress
    ? `<div class="highlight-box">
        <p style="margin:0"><strong>Shipping Address:</strong></p>
        <p style="margin:5px 0 0;color:#4b5563">${data.shippingAddress}</p>
      </div>`
    : ''

  const estimatedDeliveryHtml = data.estimatedDelivery
    ? `<p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>`
    : ''

  const paymentMethodHtml = data.paymentMethod
    ? `<p><strong>Payment Method:</strong> ${data.paymentMethod === 'cod' ? 'Cash on Delivery' : data.paymentMethod.toUpperCase()}</p>`
    : ''

  const discountHtml =
    data.discountAmount > 0
      ? `<tr><td colspan="3" style="text-align:right;padding:8px 12px">Discount:</td><td style="text-align:right;padding:8px 12px;color:#b91c1c">-₹${data.discountAmount.toFixed(2)}</td></tr>`
      : ''

  const content = `
    <h2>Order Confirmed! 🎉</h2>
    <p>Dear ${data.customerName},</p>
    <p>Thank you for your order! We're excited to bring your printing project to life. Your order has been confirmed and is now being processed.</p>
    <div class="highlight-box">
      <p style="margin:0"><strong>Order Number:</strong> ${data.orderNumber}</p>
      ${paymentMethodHtml}
      ${estimatedDeliveryHtml}
    </div>
    <h3 style="color:#374151;margin:20px 0 10px;font-size:16px">Order Details</h3>
    <table class="table-container">
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align:center">Qty</th>
          <th style="text-align:right">Price</th>
          <th style="text-align:right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
        <tr><td colspan="3" style="text-align:right;padding:8px 12px">Subtotal:</td><td style="text-align:right;padding:8px 12px">₹${data.subtotal.toFixed(2)}</td></tr>
        <tr><td colspan="3" style="text-align:right;padding:8px 12px">GST (18%):</td><td style="text-align:right;padding:8px 12px">₹${data.gstAmount.toFixed(2)}</td></tr>
        ${discountHtml}
        <tr><td colspan="3" style="text-align:right;padding:8px 12px">Shipping:</td><td style="text-align:right;padding:8px 12px">${data.shippingCost === 0 ? '<span style="color:#16a34a">FREE</span>' : `₹${data.shippingCost.toFixed(2)}`}</td></tr>
        <tr class="total-row"><td colspan="3" style="text-align:right;padding:10px 12px;font-size:16px">Total:</td><td style="text-align:right;padding:10px 12px;font-size:16px">₹${data.totalAmount.toFixed(2)}</td></tr>
      </tbody>
    </table>
    ${shippingAddressHtml}
    <p>We'll send you another email when your order ships. If you have any questions, feel free to reach out to us.</p>
    <p>Thank you for choosing <strong>Murlidhar Offset</strong>!</p>`
  return wrapInEmailLayout(content, `Order ${data.orderNumber} Confirmed`)
}

function generateOrderStatusEmail(data: OrderStatusEmailData): string {
  const statusColors: Record<string, string> = {
    pending: 'background-color:#fef3c7;color:#92400e',
    confirmed: 'background-color:#dbeafe;color:#1e40af',
    processing: 'background-color:#e0e7ff;color:#3730a3',
    printing: 'background-color:#fce7f3;color:#9d174d',
    quality_check: 'background-color:#fef9c3;color:#854d0e',
    shipped: 'background-color:#d1fae5;color:#065f46',
    delivered: 'background-color:#dcfce7;color:#166534',
    cancelled: 'background-color:#fee2e2;color:#991b1b',
    refunded: 'background-color:#f3e8ff;color:#6b21a8',
  }

  const statusStyle = statusColors[data.newStatus] || 'background-color:#f3f4f6;color:#374151'
  const statusLabel = data.newStatus.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  const trackingHtml =
    data.trackingNumber
      ? `<div class="highlight-box">
          <p style="margin:0"><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
          ${data.trackingUrl ? `<p style="margin:5px 0 0"><a href="${data.trackingUrl}" class="btn" style="font-size:13px;padding:8px 20px">Track Your Order</a></p>` : ''}
        </div>`
      : ''

  const noteHtml = data.note
    ? `<p><strong>Note:</strong> ${data.note}</p>`
    : ''

  const statusDescriptions: Record<string, string> = {
    pending: 'Your order has been received and is awaiting confirmation.',
    confirmed: 'Your order has been confirmed and will soon move into production.',
    processing: 'Your order is now being processed and prepared for printing.',
    printing: 'Your order is currently on the press! Our skilled team is bringing your design to life.',
    quality_check: 'Your order has passed the printing stage and is undergoing our rigorous quality check.',
    shipped: 'Great news! Your order has been shipped and is on its way to you.',
    delivered: 'Your order has been delivered. We hope you love the results!',
    cancelled: 'Your order has been cancelled. If you believe this is an error, please contact us immediately.',
    refunded: 'A refund has been processed for your order.',
  }

  const statusDescription = statusDescriptions[data.newStatus] || 'Your order status has been updated.'

  const content = `
    <h2>Order Status Update</h2>
    <p>Dear ${data.customerName},</p>
    <p>We wanted to let you know that there's an update on your order.</p>
    <div class="highlight-box">
      <p style="margin:0"><strong>Order Number:</strong> ${data.orderNumber}</p>
      <p style="margin:8px 0 0"><strong>Status:</strong> <span class="status-badge" style="${statusStyle}">${statusLabel}</span></p>
    </div>
    <p>${statusDescription}</p>
    ${trackingHtml}
    ${noteHtml}
    <p>If you have any questions about your order, please don't hesitate to contact us.</p>
    <p>Best regards,<br><strong>Team Murlidhar Offset</strong></p>`
  return wrapInEmailLayout(content, `Order ${data.orderNumber} - ${statusLabel}`)
}

function generateWelcomeEmail(data: WelcomeEmailData): string {
  const content = `
    <h2>Welcome to Murlidhar Offset, ${data.name}! 🎉</h2>
    <p>We're thrilled to have you join our community of satisfied customers. At Murlidhar Offset, we've been delivering premium offset printing solutions since 1985, and we can't wait to bring your ideas to life.</p>
    <div class="highlight-box">
      <p style="margin:0"><strong>Here's what you can do with your new account:</strong></p>
      <ul style="margin:10px 0 0;padding-left:20px">
        <li>Browse our extensive catalog of premium printing products</li>
        <li>Design and customize products with our online tools</li>
        <li>Track your orders in real-time</li>
        <li>Save your favorite designs and products</li>
        <li>Get exclusive member-only discounts and offers</li>
      </ul>
    </div>
    <p>Whether you need business cards, wedding invitations, brochures, packaging, or any other printed material, we've got you covered with the finest quality and fastest turnaround.</p>
    <p>If you have any questions, our team is always here to help. Just reply to this email or give us a call.</p>
    <p>We look forward to a wonderful partnership!</p>
    <p>Warm regards,<br><strong>Team Murlidhar Offset</strong></p>`
  return wrapInEmailLayout(content, `Welcome to Murlidhar Offset, ${data.name}!`)
}

function generateQuoteRequestEmail(data: QuoteRequestEmailData): string {
  const productHtml = data.productName
    ? `<tr><td style="padding:4px 0;font-weight:600;width:120px">Product:</td><td>${data.productName}</td></tr>`
    : ''
  const quantityHtml = data.quantity
    ? `<tr><td style="padding:4px 0;font-weight:600;width:120px">Quantity:</td><td>${data.quantity}</td></tr>`
    : ''
  const specsHtml = data.specifications
    ? `<tr><td style="padding:4px 0;font-weight:600;width:120px">Specs:</td><td>${data.specifications}</td></tr>`
    : ''

  const content = `
    <h2>Quote Request Received</h2>
    <p>Dear ${data.name},</p>
    <p>Thank you for requesting a quote from Murlidhar Offset. We've received your requirements and our team is preparing a competitive quote for you.</p>
    <div class="highlight-box">
      <table style="width:100%;border:none">
        <tr><td style="padding:4px 0;font-weight:600;width:120px">Name:</td><td>${data.name}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600">Email:</td><td>${data.email}</td></tr>
        ${data.phone ? `<tr><td style="padding:4px 0;font-weight:600">Phone:</td><td>${data.phone}</td></tr>` : ''}
        ${productHtml}
        ${quantityHtml}
        ${specsHtml}
      </table>
    </div>
    <p><strong>Your Message:</strong></p>
    <div class="highlight-box">
      <p style="margin:0;color:#4b5563">${data.message}</p>
    </div>
    <p>We typically respond to quote requests within <strong>4 business hours</strong>. For urgent requirements, please call us directly.</p>
    <p>Best regards,<br><strong>Team Murlidhar Offset</strong></p>`
  return wrapInEmailLayout(content, 'Quote Request Received')
}

// ==================== AI-POWERED EMAIL GENERATION ====================

async function generateAIEmailContent(
  emailType: string,
  context: string
): Promise<string> {
  try {
    // Call the dedicated email worker service (runs on port 3031)
    // This avoids importing z-ai-web-dev-sdk in the Next.js process
    const response = await fetch('http://localhost:3031/generate?XTransformPort=3031', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailType, context }),
      signal: AbortSignal.timeout(8000), // 8 second timeout
    })

    if (response.ok) {
      const data = await response.json() as { content: string }
      return data.content || ''
    }
    return ''
  } catch {
    // Email worker unavailable — fall back to template
    return ''
  }
}

// ==================== CORE SEND EMAIL FUNCTION ====================

export async function sendEmail(params: SendEmailParams): Promise<{
  success: boolean
  emailLogId?: string
  error?: string
}> {
  const { to, from, subject, body, type, userId, orderId } = params

  try {
    // Create email log entry with pending status
    const emailLog = await db.emailLog.create({
      data: {
        to,
        from: from || 'noreply@murlidharoffset.com',
        subject,
        body,
        type,
        status: 'pending',
        userId: userId || null,
        orderId: orderId || null,
      },
    })

    try {
      // In production, this would send via SMTP/API
      // For now, log to console AND store in DB
      console.log('📧 EMAIL SENT ────────────────────────────────')
      console.log(`  From: ${from || 'noreply@murlidharoffset.com'}`)
      console.log(`  To: ${to}`)
      console.log(`  Subject: ${subject}`)
      console.log(`  Type: ${type}`)
      console.log(`  User ID: ${userId || 'N/A'}`)
      console.log(`  Order ID: ${orderId || 'N/A'}`)
      console.log('─────────────────────────────────────────────')

      // Update the email log to "sent" status
      await db.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: 'sent',
          sentAt: new Date(),
        },
      })

      return { success: true, emailLogId: emailLog.id }
    } catch (sendError) {
      // Update the email log to "failed" status
      const errorMessage =
        sendError instanceof Error ? sendError.message : 'Unknown error'
      await db.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: 'failed',
          error: errorMessage,
        },
      })

      console.error('Failed to send email:', errorMessage)
      return { success: false, emailLogId: emailLog.id, error: errorMessage }
    }
  } catch (dbError) {
    console.error('Failed to log email:', dbError)
    return {
      success: false,
      error:
        dbError instanceof Error ? dbError.message : 'Failed to log email',
    }
  }
}

// ==================== HIGH-LEVEL EMAIL FUNCTIONS ====================

/**
 * Send an auto-reply to a customer who submitted the contact form
 */
export async function sendContactFormAutoReply(
  data: ContactFormEmailData
): Promise<{ success: boolean; emailLogId?: string }> {
  // First try AI-generated content
  const aiContent = await generateAIEmailContent(
    'contact_form_auto_reply',
    `Customer name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nSubject: ${data.subject}\nMessage: ${data.message}`
  )

  // Use AI content if available, otherwise use template
  const body = aiContent
    ? wrapInEmailLayout(
        `<h2>Thank You for Contacting Us, ${data.name}!</h2><p>${aiContent.replace(/\n/g, '<br>')}</p>`,
        `Thank you for your inquiry, ${data.name}`
      )
    : generateContactFormAutoReply(data)

  return sendEmail({
    to: data.email,
    subject: `We've Received Your Inquiry — ${data.subject}`,
    body,
    type: 'contact_form',
  })
}

/**
 * Send a notification to admin about a new contact form submission
 */
export async function sendContactFormAdminNotification(
  data: ContactFormEmailData
): Promise<{ success: boolean; emailLogId?: string }> {
  const body = generateContactFormAdminNotification(data)

  return sendEmail({
    to: 'info@murlidharoffset.com',
    subject: `New Contact Form Submission: ${data.subject}`,
    body,
    type: 'contact_form',
  })
}

/**
 * Send an order confirmation email to the customer
 */
export async function sendOrderConfirmationEmail(
  data: OrderConfirmationEmailData
): Promise<{ success: boolean; emailLogId?: string }> {
  const body = generateOrderConfirmationEmail(data)

  return sendEmail({
    to: data.customerEmail,
    subject: `Order Confirmed — ${data.orderNumber} | Murlidhar Offset`,
    body,
    type: 'order_confirmation',
    userId: data.userId,
    orderId: data.orderId,
  })
}

/**
 * Send an order status update email to the customer
 */
export async function sendOrderStatusUpdateEmail(
  data: OrderStatusEmailData
): Promise<{ success: boolean; emailLogId?: string }> {
  const statusLabel = data.newStatus.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  // Try AI-generated personalized status message
  const aiContent = await generateAIEmailContent(
    'order_status_update',
    `Customer name: ${data.customerName}\nOrder number: ${data.orderNumber}\nNew status: ${statusLabel}\nNote: ${data.note || 'None'}`
  )

  const body = aiContent
    ? wrapInEmailLayout(
        `<h2>Order Status Update — ${data.orderNumber}</h2><p>Dear ${data.customerName},</p><p>${aiContent.replace(/\n/g, '<br>')}</p>`,
        `Order ${data.orderNumber} - ${statusLabel}`
      )
    : generateOrderStatusEmail(data)

  return sendEmail({
    to: data.customerEmail,
    subject: `Order Update: ${statusLabel} — ${data.orderNumber} | Murlidhar Offset`,
    body,
    type: 'order_status',
    userId: data.userId,
    orderId: data.orderId,
  })
}

/**
 * Send a welcome email to a newly registered user
 */
export async function sendWelcomeEmail(
  data: WelcomeEmailData
): Promise<{ success: boolean; emailLogId?: string }> {
  const body = generateWelcomeEmail(data)

  return sendEmail({
    to: data.email,
    subject: 'Welcome to Murlidhar Offset — Premium Printing Solutions',
    body,
    type: 'welcome',
    userId: data.userId,
  })
}

/**
 * Send a quote request acknowledgment email
 */
export async function sendQuoteRequestEmail(
  data: QuoteRequestEmailData
): Promise<{ success: boolean; emailLogId?: string }> {
  // Try AI-generated content
  const aiContent = await generateAIEmailContent(
    'quote_request',
    `Customer name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nProduct: ${data.productName || 'N/A'}\nQuantity: ${data.quantity || 'N/A'}\nSpecifications: ${data.specifications || 'N/A'}\nMessage: ${data.message}`
  )

  const body = aiContent
    ? wrapInEmailLayout(
        `<h2>Quote Request Received</h2><p>Dear ${data.name},</p><p>${aiContent.replace(/\n/g, '<br>')}</p>`,
        'Quote Request Received'
      )
    : generateQuoteRequestEmail(data)

  return sendEmail({
    to: data.email,
    subject: 'Quote Request Received — Murlidhar Offset',
    body,
    type: 'quote',
  })
}

/**
 * Send a quote request notification to admin
 */
export async function sendQuoteRequestAdminNotification(
  data: QuoteRequestEmailData
): Promise<{ success: boolean; emailLogId?: string }> {
  const body = generateQuoteRequestEmail(data)

  return sendEmail({
    to: 'info@murlidharoffset.com',
    subject: `New Quote Request from ${data.name}`,
    body,
    type: 'quote',
  })
}
