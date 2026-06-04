import { create } from 'zustand'

export type PageName =
  | 'home'
  | 'products'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'auth'
  | 'dashboard'
  | 'admin'
  | 'admin-products'
  | 'admin-orders'
  | 'admin-cms'
  | 'admin-settings'
  | 'admin-customers'

interface NavigateParams {
  productId?: string | null
  categorySlug?: string | null
}

interface NavigationState {
  page: PageName
  productId: string | null
  categorySlug: string | null
  sidebarOpen: boolean
  searchQuery: string
  navigate: (page: PageName, params?: NavigateParams) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setSearchQuery: (query: string) => void
  goHome: () => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  page: 'home',
  productId: null,
  categorySlug: null,
  sidebarOpen: false,
  searchQuery: '',

  navigate: (page, params = {}) => {
    set({
      page,
      productId: params.productId ?? null,
      categorySlug: params.categorySlug ?? null,
      sidebarOpen: false,
    })
    // Scroll to top on navigation
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  goHome: () => {
    set({
      page: 'home',
      productId: null,
      categorySlug: null,
      searchQuery: '',
      sidebarOpen: false,
    })
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
}))
