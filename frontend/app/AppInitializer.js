'use client'

import { useEffect } from 'react'
import useAuthStore from '../stores/authStore'
import useWebsocketStore from '../stores/websocketStore'
import useNotificationStore from '../stores/notificationStore'

export default function AppInitializer() {
  const { loadUser, isAuthenticated, token } = useAuthStore()
  const { connect } = useWebsocketStore()
  const { fetchNotifications } = useNotificationStore()

  useEffect(() => {
    loadUser()
  }, [])

  useEffect(() => {
    if (isAuthenticated && token) {
      connect(token)
      fetchNotifications()
    }
  }, [isAuthenticated, token])

  return null
}
