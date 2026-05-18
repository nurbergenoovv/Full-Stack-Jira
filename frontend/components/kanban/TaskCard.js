'use client'

import { useRouter } from 'next/navigation'
import Avatar from '../ui/Avatar'
import styles from '../../styles/kanban.module.css'

const PRIORITY_COLORS = {
  Low: '#22c55e',
  Medium: '#f59e0b',
  High: '#f97316',
  Critical: '#ef4444',
}

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function isPastDue(dateStr) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

export default function TaskCard({ task, onDragStart }) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/tasks/${task._id}`)
  }

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task._id)
    e.dataTransfer.effectAllowed = 'move'
    if (onDragStart) onDragStart(task._id)
  }

  const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium
  const overdue = isPastDue(task.dueDate)

  return (
    <div
      className={styles.taskCard}
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      {task.priority && (
        <div className={styles.priorityBar} style={{ background: priorityColor }} />
      )}

      <div className={styles.taskCardBody}>
        <p className={styles.taskTitle}>{task.title}</p>

        {task.description && (
          <p className={styles.taskDesc}>{task.description}</p>
        )}

        <div className={styles.taskMeta}>
          {task.priority && (
            <span
              className={styles.priorityBadge}
              style={{ color: priorityColor, borderColor: priorityColor }}
            >
              {task.priority}
            </span>
          )}
          {task.dueDate && (
            <span className={`${styles.dueDate} ${overdue ? styles.dueDateOverdue : ''}`}>
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        {task.assignee && (
          <div className={styles.taskAssignee}>
            <Avatar
              user={typeof task.assignee === 'object' ? task.assignee : null}
              size={22}
            />
            {typeof task.assignee === 'object' && (
              <span className={styles.assigneeName}>{task.assignee.fullName}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
