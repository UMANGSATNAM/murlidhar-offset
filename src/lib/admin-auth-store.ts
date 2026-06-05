import { create } from 'zustand'

// Hardcoded admin credentials (NOT stored in database)
const ADMIN_CREDENTIALS = {
  email: 'admin@murlidhar.com',
  password: 'Murlidhar@2024',
}

const AUTH_STORAGE_KEY = 'murlidhar-admin-auth'

interface AdminAuthState {
  isLoggedIn: boolean
  token: string | null
  login: (email: string, password: string) => boolean
  logout: () => void
  _hydrate: () => void
}

function generateToken(email: string, password: string): string {
  if (typeof window !== 'undefined') {
    return btoa(`${email}:${password}`)
  }
  return Buffer.from(`${email}:${password}`).toString('base64')
}

function loadAuthFromStorage(): { isLoggedIn: boolean; token: string | null } {
  if (typeof window === 'undefined') return { isLoggedIn: false, token: null }
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      return { isLoggedIn: !!data.isLoggedIn, token: data.token || null }
    }
  } catch {
    // ignore
  }
  return { isLoggedIn: false, token: null }
}

function saveAuthToStorage(isLoggedIn: boolean, token: string | null): void {
  if (typeof window === 'undefined') return
  try {
    if (isLoggedIn) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ isLoggedIn, token }))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  } catch {
    // ignore
  }
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  isLoggedIn: false,
  token: null,

  login: (email: string, password: string): boolean => {
    if (
      email === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const token = generateToken(email, password)
      set({ isLoggedIn: true, token })
      saveAuthToStorage(true, token)
      return true
    }
    return false
  },

  logout: () => {
    set({ isLoggedIn: false, token: null })
    saveAuthToStorage(false, null)
  },

  _hydrate: () => {
    const stored = loadAuthFromStorage()
    if (stored.isLoggedIn) {
      set({ isLoggedIn: true, token: stored.token })
    }
  },
}))
