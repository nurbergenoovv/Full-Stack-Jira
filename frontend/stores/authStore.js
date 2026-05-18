import { create } from 'zustand'
import { api } from '../lib/api'

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const data = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      })
      return data
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  register: async (fullName, email, password) => {
    set({ isLoading: true })
    try {
      const data = await api.post('/auth/register', { fullName, email, password })
      localStorage.setItem('token', data.token)
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      })
      return data
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  loadUser: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ isLoading: false })
      return
    }
    set({ isLoading: true, token })
    try {
      const user = await api.get('/auth/me')
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      localStorage.removeItem('token')
      set({ user: null, token: null, isAuthenticated: false, isLoading: false })
    }
  },

  updateProfile: async (data) => {
    const updated = await api.put('/users/profile', data)
    set((state) => ({ user: { ...state.user, ...updated } }))
    return updated
  },

  updateAvatar: async (avatarUrl) => {
    const updated = await api.post('/users/avatar', { avatarUrl })
    set((state) => ({ user: { ...state.user, avatar: avatarUrl, ...updated } }))
    return updated
  },
}))

export default useAuthStore
