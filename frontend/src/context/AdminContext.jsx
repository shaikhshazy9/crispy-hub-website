import { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ch_admin')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (admin) localStorage.setItem('ch_admin', JSON.stringify(admin))
    else localStorage.removeItem('ch_admin')
  }, [admin])

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Invalid credentials.')
      localStorage.setItem('ch_admin_token', data.token)
      setAdmin(data.admin)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('ch_admin_token')
    setAdmin(null)
    setError(null)
  }

  return (
    <AdminContext.Provider value={{ admin, loading, error, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
