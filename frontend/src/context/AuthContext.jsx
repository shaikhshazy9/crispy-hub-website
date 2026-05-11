import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('ch_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (user) localStorage.setItem('ch_user', JSON.stringify(user))
    else localStorage.removeItem('ch_user')
  }, [user])

  const clearError = () => setError(null)

  // ── Login ────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Invalid email or password.')
      localStorage.setItem('ch_token', data.token)
      setUser(data.user)
      return { success: true }
    } catch (err) {
      const msg = err.message || 'Invalid email or password.'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  // ── Sign Up ──────────────────────────────────────────────────────────────
  const signup = async (name, email, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Sign up failed. Please try again.')
      localStorage.setItem('ch_token', data.token)
      setUser(data.user)
      return { success: true }
    } catch (err) {
      const msg = err.message || 'Sign up failed. Please try again.'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('ch_token')
    setUser(null)
    setError(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
