import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getUser())
  const [token, setToken] = useState(() => authService.getToken())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verifikasi token saat pertama kali aplikasi dimuat jika token ada
    const verifyExistingSession = async () => {
      const storedToken = authService.getToken()
      if (storedToken) {
        try {
          const res = await authService.getMe()
          if (res?.admin) {
            setUser(res.admin)
            setToken(storedToken)
          }
        } catch {
          // Token tidak valid atau kedaluwarsa
          authService.clearSession()
          setUser(null)
          setToken(null)
        }
      }
      setLoading(false)
    }

    verifyExistingSession()
  }, [])

  const login = async (usernameOrEmail, password) => {
    const data = await authService.login({ usernameOrEmail, password })
    if (data.token) {
      setToken(data.token)
      setUser(data.admin)
    }
    return data
  }

  const logout = async () => {
    await authService.logout()
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

