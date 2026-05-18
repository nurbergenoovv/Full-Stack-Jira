import { create } from 'zustand'
import { api } from '../lib/api'

const useTaskStore = create((set, get) => ({
  tasks: [],
  currentTask: null,
  filters: { status: '', priority: '', assignee: '', search: '' },
  isLoading: false,

  fetchTasks: async (projectId, filters = {}) => {
    set({ isLoading: true })
    try {
      const params = new URLSearchParams()
      if (filters.status) params.set('status', filters.status)
      if (filters.priority) params.set('priority', filters.priority)
      if (filters.assignee) params.set('assignee', filters.assignee)
      if (filters.search) params.set('search', filters.search)
      const query = params.toString() ? `?${params.toString()}` : ''
      const tasks = await api.get(`/tasks/project/${projectId}${query}`)
      set({ tasks, isLoading: false })
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  fetchTask: async (id) => {
    set({ isLoading: true })
    try {
      const task = await api.get(`/tasks/${id}`)
      set({ currentTask: task, isLoading: false })
      return task
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  createTask: async (projectId, data) => {
    const task = await api.post(`/tasks/project/${projectId}`, data)
    set((state) => ({ tasks: [...state.tasks] }))
    return task
  },

  updateTask: async (id, data) => {
    const task = await api.put(`/tasks/${id}`, data)
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === id ? task : t)),
      currentTask: state.currentTask?._id === id ? task : state.currentTask,
    }))
    return task
  },

  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`)
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== id),
      currentTask: state.currentTask?._id === id ? null : state.currentTask,
    }))
  },

  moveTask: async (id, status) => {
    const task = await api.patch(`/tasks/${id}/status`, { status })
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === id ? { ...t, status } : t)),
      currentTask:
        state.currentTask?._id === id
          ? { ...state.currentTask, status }
          : state.currentTask,
    }))
    return task
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }))
  },

  addTaskFromWS: (task) => {
    set((state) => {
      const exists = state.tasks.find((t) => t._id === task._id)
      if (exists) return {}
      return { tasks: [task, ...state.tasks] }
    })
  },

  updateTaskFromWS: (task) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === task._id ? task : t)),
      currentTask:
        state.currentTask?._id === task._id ? task : state.currentTask,
    }))
  },

  deleteTaskFromWS: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== taskId),
      currentTask: state.currentTask?._id === taskId ? null : state.currentTask,
    }))
  },

  moveTaskFromWS: (taskId, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === taskId ? { ...t, status } : t
      ),
      currentTask:
        state.currentTask?._id === taskId
          ? { ...state.currentTask, status }
          : state.currentTask,
    }))
  },

  comments: [],

  fetchComments: async (taskId) => {
    const comments = await api.get(`/comments/task/${taskId}`)
    set({ comments })
    return comments
  },

  addComment: async (taskId, message) => {
    const comment = await api.post(`/comments/task/${taskId}`, { message })
    set((state) => ({ comments: [...state.comments, comment] }))
    return comment
  },

  updateComment: async (id, message) => {
    const comment = await api.put(`/comments/${id}`, { message })
    set((state) => ({
      comments: state.comments.map((c) => (c._id === id ? comment : c)),
    }))
    return comment
  },

  deleteComment: async (id) => {
    await api.delete(`/comments/${id}`)
    set((state) => ({
      comments: state.comments.filter((c) => c._id !== id),
    }))
  },

  addCommentFromWS: (comment) => {
    set((state) => {
      const exists = state.comments.find((c) => c._id === comment._id)
      if (exists) return {}
      return { comments: [...state.comments, comment] }
    })
  },

  updateCommentFromWS: (comment) => {
    set((state) => ({
      comments: state.comments.map((c) =>
        c._id === comment._id ? comment : c
      ),
    }))
  },

  deleteCommentFromWS: (commentId) => {
    set((state) => ({
      comments: state.comments.filter((c) => c._id !== commentId),
    }))
  },
}))

export default useTaskStore
