import { create } from 'zustand'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  phone: string | null
  role: string
  gstNumber: string | null
  companyName: string | null
  image: string | null
}

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (user: AuthUser) => void
  logout: () => void
  setUser: (user: AuthUser) => void
  _hydrate: () => void
}

const AUTH_STORAGE_KEY = 'murlidhar-offset-auth'

function loadAuthFromStorage(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as AuthUser
    }
  } catch {
    // ignore
  }
  return null
}

function saveAuthToStorage(user: AuthUser | null): void {
  if (typeof window === 'undefined') return
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  } catch {
    // ignore
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isLoggedIn: false,

  login: (user: AuthUser) => {
    set({ user, isLoggedIn: true })
    saveAuthToStorage(user)
  },

  logout: () => {
    set({ user: null, isLoggedIn: false })
    saveAuthToStorage(null)
  },

  setUser: (user: AuthUser) => {
    set({ user, isLoggedIn: true })
    saveAuthToStorage(user)
  },

  _hydrate: () => {
    const storedUser = loadAuthFromStorage()
    if (storedUser) {
      set({ user: storedUser, isLoggedIn: true })
    }
  },
}))
