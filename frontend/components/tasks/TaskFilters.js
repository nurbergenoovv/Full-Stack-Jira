'use client'

import { useState, useEffect, useRef } from 'react'
import useTaskStore from '../../stores/taskStore'
import styles from '../../styles/task.module.css'

const STATUSES = ['', 'Backlog', 'Todo', 'In Progress', 'Review', 'Done']
const PRIORITIES = ['', 'Low', 'Medium', 'High', 'Critical']

export default function TaskFilters({ projectId, members = [] }) {
  const { filters, setFilters, fetchTasks } = useTaskStore()
  const [search, setSearch] = useState(filters.search || '')
  const debounceRef = useRef(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (search !== filters.search) {
        const newFilters = { ...filters, search }
        setFilters({ search })
        fetchTasks(projectId, newFilters)
      }
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [search])

  const handleSelect = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters({ [key]: value })
    fetchTasks(projectId, newFilters)
  }

  const handleClear = () => {
    const cleared = { status: '', priority: '', assignee: '', search: '' }
    setSearch('')
    setFilters(cleared)
    fetchTasks(projectId, cleared)
  }

  const hasActiveFilters =
    filters.status || filters.priority || filters.assignee || filters.search

  return (
    <div className={styles.filters}>
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />

      <select
        value={filters.status}
        onChange={(e) => handleSelect('status', e.target.value)}
        className={styles.filterSelect}
      >
        <option value="">All Statuses</option>
        {STATUSES.filter(Boolean).map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={filters.priority}
        onChange={(e) => handleSelect('priority', e.target.value)}
        className={styles.filterSelect}
      >
        <option value="">All Priorities</option>
        {PRIORITIES.filter(Boolean).map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <select
        value={filters.assignee}
        onChange={(e) => handleSelect('assignee', e.target.value)}
        className={styles.filterSelect}
      >
        <option value="">All Assignees</option>
        {members.map((m) => (
          <option key={m._id} value={m._id}>
            {m.fullName}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button onClick={handleClear} className={styles.clearFilters}>
          Clear filters
        </button>
      )}
    </div>
  )
}
