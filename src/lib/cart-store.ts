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
  subtotal: () => number
  gstAmount: () => number
  totalAmount: () => number
  itemCount: () => number
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
    if (stored) {
      return JSON.parse(stored) as CartItem[]
    }
  } catch {
    // ignore parse errors
  }
  return []
}

function saveToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore storage errors
  }
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => {
    const { items } = get()

    // Check if the same product+variant already exists in cart
    const existingIndex = items.findIndex(
      (i) =>
        i.productId === item.productId &&
        i.variantId === item.variantId &&
        JSON.stringify(i.attrs) === JSON.stringify(item.attrs)
    )

    let updatedItems: CartItem[]

    if (existingIndex >= 0) {
      // Update quantity of existing item
      updatedItems = items.map((i, idx) =>
        idx === existingIndex
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      )
    } else {
      // Add new item with generated ID
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
    const updatedItems = get().items.map((i) =>
      i.id === id ? { ...i, quantity } : i
    )
    set({ items: updatedItems })
    saveToStorage(updatedItems)
  },

  clearCart: () => {
    set({ items: [] })
    saveToStorage([])
  },

  subtotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },

  gstAmount: () => {
    return get().subtotal() * GST_RATE
  },

  totalAmount: () => {
    return get().subtotal() + get().gstAmount()
  },

  itemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0)
  },

  _hydrate: () => {
    const storedItems = loadFromStorage()
    set({ items: storedItems })
  },
}))
