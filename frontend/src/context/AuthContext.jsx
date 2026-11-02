import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get('/admin/auth/me')
      setAdmin(response.data.data)
    } catch {
      setAdmin(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (email, password) => {
    const response = await api.post('/admin/auth/login', { email, password })
    setAdmin(response.data.data.admin)
    return response.data
  }

  const logout = async () => {
    try {
      await api.post('/admin/auth/logout')
    } catch {
    } finally {
      setAdmin(null)
    }
  }

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}