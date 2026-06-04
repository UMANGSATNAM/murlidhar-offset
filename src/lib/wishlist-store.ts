import { create } from 'zustand'

export interface WishlistItem {
  productId: string
  name: string
  price: number
  image: string
  slug: string
  addedAt: string
}

interface WishlistState {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleItem: (item: Omit<WishlistItem, 'addedAt'>) => void
  clearWishlist: () => void
  _hydrate: () => void
}

const WISHLIST_STORAGE_KEY = 'murlidhar-offset-wishlist'

function loadFromStorage(): WishlistItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (stored) return JSON.parse(stored) as WishlistItem[]
  } catch {}
  return []
}

function saveToStorage(items: WishlistItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  addItem: (item) => {
    const { items } = get()
    if (items.some((i) => i.productId === item.productId)) return
    const updatedItems = [...items, { ...item, addedAt: new Date().toISOString() }]
    set({ items: updatedItems })
    saveToStorage(updatedItems)
  },

  removeItem: (productId) => {
    const updatedItems = get().items.filter((i) => i.productId !== productId)
    set({ items: updatedItems })
    saveToStorage(updatedItems)
  },

  isInWishlist: (productId) => {
    return get().items.some((i) => i.productId === productId)
  },

  toggleItem: (item) => {
    const { items } = get()
    if (items.some((i) => i.productId === item.productId)) {
      const updatedItems = items.filter((i) => i.productId !== item.productId)
      set({ items: updatedItems })
      saveToStorage(updatedItems)
    } else {
      const updatedItems = [...items, { ...item, addedAt: new Date().toISOString() }]
      set({ items: updatedItems })
      saveToStorage(updatedItems)
    }
  },

  clearWishlist: () => {
    set({ items: [] })
    saveToStorage([])
  },

  _hydrate: () => {
    set({ items: loadFromStorage() })
  },
}))

// Selector hook for item count
export const useWishlistCount = () => useWishlistStore((s) => s.items.length)
