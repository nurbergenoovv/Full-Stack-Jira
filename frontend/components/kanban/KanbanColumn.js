'use client'

import { useState } from 'react'
import TaskCard from './TaskCard'
import styles from '../../styles/kanban.module.css'

const STATUS_COLORS = {
  Backlog: '#64748b',
  Todo: '#3b82f6',
  'In Progress': '#f59e0b',
  Review: '#a855f7',
  Done: '#22c55e',
}

export default function KanbanColumn({ status, tasks, onDrop }) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const taskId = e.dataTransfer.getData('taskId')
    if (taskId && onDrop) {
      onDrop(taskId, status)
    }
  }

  const color = STATUS_COLORS[status] || '#64748b'

  return (
    <div
      className={`${styles.column} ${isDragOver ? styles.columnDragOver : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={styles.columnHeader}>
        <div className={styles.columnTitleRow}>
          <span className={styles.columnDot} style={{ background: color }} />
          <span className={styles.columnTitle}>{status}</span>
          <span className={styles.columnCount}>{tasks.length}</span>
        </div>
      </div>

      <div className={styles.taskList}>
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}

        {tasks.length === 0 && (
          <div className={styles.emptyColumn}>
            <p>No tasks</p>
          </div>
        )}
      </div>
    </div>
  )
}
