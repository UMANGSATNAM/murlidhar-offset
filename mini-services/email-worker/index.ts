/**
 * Murlidhar Offset - AI Email Worker
 * 
 * This standalone service handles AI-powered email generation
 * using z-ai-web-dev-sdk. It runs outside the Next.js process
 * to avoid Turbopack compilation issues.
 * 
 * Port: 3031
 * 
 * Endpoints:
 *   POST /generate - Generate AI email content
 *     Body: { emailType: string, context: string }
 *     Response: { content: string }
 */

const PORT = 3031

// Only import ZAI if we're in Bun runtime
async function generateEmail(emailType: string, context: string): Promise<string> {
  try {
    const { default: ZAI } = await import('z-ai-web-dev-sdk')
    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content:
            'You are a professional customer service agent for Murlidhar Offset, a premium offset printing company in Gujarat, India. Write a warm, professional email acknowledging the customer\'s inquiry. Keep the email concise, friendly, and on-brand. Do not include any HTML — write plain text only. Sign off as "Team Murlidhar Offset".',
        },
        {
          role: 'user',
          content: `Email type: ${emailType}\n\nCustomer context:\n${context}\n\nWrite a professional, warm email response for this customer.`,
        },
      ],
      thinking: { type: 'disabled' },
    })

    return completion.choices?.[0]?.message?.content?.trim() || ''
  } catch (error) {
    console.error('AI email generation failed:', error)
    return ''
  }
}

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url)

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    if (url.pathname === '/generate' && req.method === 'POST') {
      try {
        const body = await req.json() as { emailType: string; context: string }
        const content = await generateEmail(body.emailType, body.context)
        return Response.json({ content }, { headers: corsHeaders })
      } catch (error) {
        return Response.json(
          { error: 'Failed to generate email content' },
          { status: 500, headers: corsHeaders }
        )
      }
    }

    if (url.pathname === '/health') {
      return Response.json({ status: 'ok', service: 'email-worker' }, { headers: corsHeaders })
    }

    return Response.json({ error: 'Not found' }, { status: 404, headers: corsHeaders })
  },
})

console.log(`📧 Email Worker running on port ${PORT}`)
