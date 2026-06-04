import { create } from 'zustand'

export interface RecentlyViewedItem {
  productId: string
  name: string
  price: number
  image: string
  slug: string
  category: string
  viewedAt: string
}

interface RecentlyViewedState {
  items: RecentlyViewedItem[]
  addItem: (item: Omit<RecentlyViewedItem, 'viewedAt'>) => void
  clearAll: () => void
  _hydrate: () => void
}

const MAX_ITEMS = 12
const STORAGE_KEY = 'murlidhar-offset-recently-viewed'

function loadFromStorage(): RecentlyViewedItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as RecentlyViewedItem[]
  } catch {}
  return []
}

function saveToStorage(items: RecentlyViewedItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

export const useRecentlyViewedStore = create<RecentlyViewedState>((set, get) => ({
  items: [],

  addItem: (item) => {
    const { items } = get()
    // Remove existing item if present (will re-add at front)
    const filtered = items.filter((i) => i.productId !== item.productId)
    // Add new item at the front with current timestamp
    const updatedItems = [
      { ...item, viewedAt: new Date().toISOString() },
      ...filtered,
    ].slice(0, MAX_ITEMS)
    set({ items: updatedItems })
    saveToStorage(updatedItems)
  },

  clearAll: () => {
    set({ items: [] })
    saveToStorage([])
  },

  _hydrate: () => {
    set({ items: loadFromStorage() })
  },
}))

// Selector hooks
export const useRecentlyViewedItems = () => useRecentlyViewedStore((s) => s.items)
export const useRecentlyViewedCount = () => useRecentlyViewedStore((s) => s.items.length)
