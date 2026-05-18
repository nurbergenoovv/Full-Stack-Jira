import { create } from 'zustand'
import { api } from '../lib/api'

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    try {
      const notifications = await api.get('/notifications')
      const unreadCount = notifications.filter((n) => !n.isRead).length
      set({ notifications, unreadCount })
    } catch (err) {
      throw err
    }
  },

  markRead: async (id) => {
    await api.patch(`/notifications/${id}/read`)
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      )
      const unreadCount = notifications.filter((n) => !n.isRead).length
      return { notifications, unreadCount }
    })
  },

  markAllRead: async () => {
    await api.patch('/notifications/read-all')
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }))
  },

  addNotificationFromWS: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }))
  },
}))

export default useNotificationStore
