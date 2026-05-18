import { create } from 'zustand'
import { api } from '../lib/api'

const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,

  fetchProjects: async () => {
    set({ isLoading: true })
    try {
      const projects = await api.get('/projects')
      set({ projects, isLoading: false })
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  fetchProject: async (id) => {
    set({ isLoading: true })
    try {
      const project = await api.get(`/projects/${id}`)
      set({ currentProject: project, isLoading: false })
      return project
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  createProject: async (data) => {
    const project = await api.post('/projects', data)
    set((state) => ({ projects: [project, ...state.projects] }))
    return project
  },

  updateProject: async (id, data) => {
    const project = await api.put(`/projects/${id}`, data)
    set((state) => ({
      projects: state.projects.map((p) => (p._id === id ? project : p)),
      currentProject:
        state.currentProject?._id === id ? project : state.currentProject,
    }))
    return project
  },

  deleteProject: async (id) => {
    await api.delete(`/projects/${id}`)
    set((state) => ({
      projects: state.projects.filter((p) => p._id !== id),
      currentProject:
        state.currentProject?._id === id ? null : state.currentProject,
    }))
  },

  inviteMember: async (projectId, email) => {
    const project = await api.post(`/projects/${projectId}/members`, { email })
    set((state) => ({
      projects: state.projects.map((p) => (p._id === projectId ? project : p)),
      currentProject:
        state.currentProject?._id === projectId
          ? project
          : state.currentProject,
    }))
    return project
  },

  removeMember: async (projectId, userId) => {
    const project = await api.delete(
      `/projects/${projectId}/members/${userId}`
    )
    set((state) => ({
      projects: state.projects.map((p) => (p._id === projectId ? project : p)),
      currentProject:
        state.currentProject?._id === projectId
          ? project
          : state.currentProject,
    }))
    return project
  },

  updateCover: async (projectId, coverUrl) => {
    const project = await api.post(`/projects/${projectId}/cover`, { coverUrl })
    set((state) => ({
      projects: state.projects.map((p) => (p._id === projectId ? project : p)),
      currentProject:
        state.currentProject?._id === projectId
          ? project
          : state.currentProject,
    }))
    return project
  },
}))

export default useProjectStore
