import { create } from 'zustand'

export interface CartItem {
  id: string
  productId: string
  name: string
  quantity: number
  price: number
  image: string
  variantName: string
  variantId: string | null
  attrs: Record<string, string>
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  _hydrate: () => void
}

const GST_RATE = 0.18
const CART_STORAGE_KEY = 'murlidhar-offset-cart'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

function loadFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) return JSON.parse(stored) as CartItem[]
  } catch {}
  return []
}

function saveToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => {
    const { items } = get()
    const existingIndex = items.findIndex(
      (i) =>
        i.productId === item.productId &&
        i.variantId === item.variantId &&
        JSON.stringify(i.attrs) === JSON.stringify(item.attrs)
    )

    let updatedItems: CartItem[]
    if (existingIndex >= 0) {
      updatedItems = items.map((i, idx) =>
        idx === existingIndex ? { ...i, quantity: i.quantity + item.quantity } : i
      )
    } else {
      updatedItems = [...items, { ...item, id: generateId() }]
    }

    set({ items: updatedItems })
    saveToStorage(updatedItems)
  },

  removeItem: (id) => {
    const updatedItems = get().items.filter((i) => i.id !== id)
    set({ items: updatedItems })
    saveToStorage(updatedItems)
  },

  updateQuantity: (id, quantity) => {
    if (quantity < 1) {
      get().removeItem(id)
      return
    }
    const updatedItems = get().items.map((i) => (i.id === id ? { ...i, quantity } : i))
    set({ items: updatedItems })
    saveToStorage(updatedItems)
  },

  clearCart: () => {
    set({ items: [] })
    saveToStorage([])
  },

  _hydrate: () => {
    set({ items: loadFromStorage() })
  },
}))

// Selector hooks for computed values - these cause re-renders when items change
export const useCartSubtotal = () => useCartStore((s) => s.items.reduce((sum, item) => sum + item.price * item.quantity, 0))
export const useCartGstAmount = () => useCartStore((s) => s.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * GST_RATE)
export const useCartTotalAmount = () => {
  const subtotal = useCartSubtotal()
  return subtotal + subtotal * GST_RATE
}
export const useCartItemCount = () => useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0))
