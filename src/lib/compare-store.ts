import { create } from 'zustand'

export interface CompareItem {
  productId: string
  name: string
  price: number
  image: string
  slug: string
  category: string
  materials: string[]
  sizes: string[]
  finishes: string[]
  turnaround: string
  addedAt: string
}

const MAX_COMPARE_ITEMS = 3

interface CompareState {
  items: CompareItem[]
  addItem: (item: Omit<CompareItem, 'addedAt'>) => boolean
  removeItem: (productId: string) => void
  isInCompare: (productId: string) => boolean
  clearAll: () => void
  _hydrate: () => void
}

const COMPARE_STORAGE_KEY = 'murlidhar-offset-compare'

function loadFromStorage(): CompareItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(COMPARE_STORAGE_KEY)
    if (stored) return JSON.parse(stored) as CompareItem[]
  } catch {}
  return []
}

function saveToStorage(items: CompareItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

export const useCompareStore = create<CompareState>((set, get) => ({
  items: [],

  addItem: (item) => {
    const { items } = get()
    if (items.some((i) => i.productId === item.productId)) return true
    if (items.length >= MAX_COMPARE_ITEMS) return false
    const updatedItems = [...items, { ...item, addedAt: new Date().toISOString() }]
    set({ items: updatedItems })
    saveToStorage(updatedItems)
    return true
  },

  removeItem: (productId) => {
    const updatedItems = get().items.filter((i) => i.productId !== productId)
    set({ items: updatedItems })
    saveToStorage(updatedItems)
  },

  isInCompare: (productId) => {
    return get().items.some((i) => i.productId === productId)
  },

  clearAll: () => {
    set({ items: [] })
    saveToStorage([])
  },

  _hydrate: () => {
    set({ items: loadFromStorage() })
  },
}))

// Selector hook for item count
export const useCompareCount = () => useCompareStore((s) => s.items.length)
