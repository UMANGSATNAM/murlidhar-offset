const AUTH_STORAGE_KEY = 'murlidhar-admin-auth'

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      return data.token || null
    }
  } catch {
    // ignore
  }
  return null
}

export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAdminToken()
  const headers = new Headers(options.headers || {})
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return fetch(url, { ...options, headers })
}
