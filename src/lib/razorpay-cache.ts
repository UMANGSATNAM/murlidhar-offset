// Shared in-memory cache for Razorpay order IDs
// Used by both create-order and verify routes

interface CachedOrder {
  amount: number
  currency: string
  receipt: string
  createdAt: number
}

const razorpayOrderCache = new Map<string, CachedOrder>()

// Clean up old entries every 10 minutes (orders older than 30 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    const thirtyMinutes = 30 * 60 * 1000
    for (const [key, value] of razorpayOrderCache.entries()) {
      if (now - value.createdAt > thirtyMinutes) {
        razorpayOrderCache.delete(key)
      }
    }
  }, 10 * 60 * 1000)
}

export function setOrder(orderId: string, data: CachedOrder) {
  razorpayOrderCache.set(orderId, data)
}

export function getOrder(orderId: string): CachedOrder | undefined {
  return razorpayOrderCache.get(orderId)
}

export function deleteOrder(orderId: string) {
  razorpayOrderCache.delete(orderId)
}
