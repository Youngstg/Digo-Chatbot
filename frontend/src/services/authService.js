import api from './api'

const TOKEN_KEY = 'digo_admin_token'
const USER_KEY = 'digo_admin_user'

export const authService = {
  login: async ({ usernameOrEmail, password }) => {
    const response = await api.post('/auth/login', {
      usernameOrEmail,
      password,
    })
    const data = response.data
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token)
      if (data.admin) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.admin))
      }
    }
    return data
  },

  getMe: async () => {
    const response = await api.get('/auth/me')
    const data = response.data
    if (data.admin) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.admin))
    }
    return data
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Abaikan error pada logout API jika token sudah kedaluwarsa
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY)
  },

  getUser: () => {
    const userStr = localStorage.getItem(USER_KEY)
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY)
  },

  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}

