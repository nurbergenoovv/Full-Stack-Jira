import { create } from 'zustand'
import useTaskStore from './taskStore'
import useNotificationStore from './notificationStore'

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000'

const useWebsocketStore = create((set, get) => ({
  ws: null,
  isConnected: false,
  onlineUsers: {},

  connect: (token) => {
    if (typeof window === 'undefined') return
    const existing = get().ws
    if (existing && existing.readyState === WebSocket.OPEN) return

    const ws = new WebSocket(`${WS_URL}?token=${token}`)

    ws.onopen = () => {
      set({ isConnected: true })
    }

    ws.onclose = () => {
      set({ isConnected: false, ws: null })
    }

    ws.onerror = () => {
      set({ isConnected: false })
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        get()._handleMessage(msg)
      } catch {
      }
    }

    set({ ws })
  },

  disconnect: () => {
    const { ws } = get()
    if (ws) {
      ws.close()
    }
    set({ ws: null, isConnected: false, onlineUsers: {} })
  },

  joinProject: (projectId) => {
    const { ws } = get()
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'join:project', projectId }))
    }
  },

  leaveProject: (projectId) => {
    const { ws } = get()
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'leave:project', projectId }))
    }
  },

  setOnlineUsers: (projectId, userIds) => {
    set((state) => ({
      onlineUsers: { ...state.onlineUsers, [projectId]: userIds },
    }))
  },

  _handleMessage: (msg) => {
    const { event, data } = msg

    const taskStore = useTaskStore.getState()
    const notifStore = useNotificationStore.getState()

    switch (event) {
      case 'task:created':
        taskStore.addTaskFromWS(data.task)
        break
      case 'task:updated':
        taskStore.updateTaskFromWS(data.task)
        break
      case 'task:deleted':
        taskStore.deleteTaskFromWS(data.taskId)
        break
      case 'task:moved':
        taskStore.moveTaskFromWS(data.taskId, data.status)
        break
      case 'comment:added':
        taskStore.addCommentFromWS(data.comment)
        break
      case 'comment:updated':
        taskStore.updateCommentFromWS(data.comment)
        break
      case 'comment:deleted':
        taskStore.deleteCommentFromWS(data.commentId)
        break
      case 'notification:new':
        notifStore.addNotificationFromWS(data.notification)
        break
      case 'online:users':
        get().setOnlineUsers(data.projectId, data.userIds)
        break
      case 'user:online': {
        const { userId, projectId } = data
        set((state) => {
          const current = state.onlineUsers[projectId] || []
          if (current.includes(userId)) return {}
          return {
            onlineUsers: {
              ...state.onlineUsers,
              [projectId]: [...current, userId],
            },
          }
        })
        break
      }
      case 'user:offline': {
        const { userId, projectId } = data
        set((state) => {
          const current = state.onlineUsers[projectId] || []
          return {
            onlineUsers: {
              ...state.onlineUsers,
              [projectId]: current.filter((id) => id !== userId),
            },
          }
        })
        break
      }
      default:
        break
    }
  },
}))

export default useWebsocketStore
