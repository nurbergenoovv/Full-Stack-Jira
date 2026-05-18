'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import useTaskStore from '../../stores/taskStore'
import useAuthStore from '../../stores/authStore'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import EditTaskModal from './EditTaskModal'
import CommentList from '../comments/CommentList'
import styles from '../../styles/task.module.css'

const PRIORITY_COLORS = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
}

const STATUS_COLORS = {
  Backlog: '#64748b',
  Todo: '#3b82f6',
  'In Progress': '#f59e0b',
  Review: '#a855f7',
  Done: '#22c55e',
}

function formatDate(dateStr) {
  if (!dateStr) return 'Not set'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function TaskDetail({ task, members = [] }) {
  const router = useRouter()
  const { deleteTask } = useTaskStore()
  const { user } = useAuthStore()
  const [editOpen, setEditOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Delete this task? This cannot be undone.')) return
    setDeleting(true)
    try {
      await deleteTask(task._id)
      router.back()
    } catch (err) {
      alert(err.message)
      setDeleting(false)
    }
  }

  const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium
  const statusColor = STATUS_COLORS[task.status] || STATUS_COLORS.Backlog

  return (
    <div className={styles.taskDetail}>
      <div className={styles.taskDetailHeader}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
        <div className={styles.taskDetailActions}>
          <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
            Edit Task
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={deleting}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className={styles.taskDetailContent}>
        <div className={styles.taskDetailMain}>
          <div className={styles.taskDetailTitleRow}>
            <h1 className={styles.taskDetailTitle}>{task.title}</h1>
          </div>

          <div className={styles.taskBadges}>
            <span
              className={styles.statusBadge}
              style={{ background: `${statusColor}20`, color: statusColor, borderColor: statusColor }}
            >
              {task.status}
            </span>
            {task.priority && (
              <span
                className={styles.priorityBadgeLg}
                style={{ background: `${priorityColor}20`, color: priorityColor, borderColor: priorityColor }}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </span>
            )}
          </div>

          {task.description && (
            <div className={styles.taskDetailSection}>
              <h3 className={styles.sectionTitle}>Description</h3>
              <p className={styles.taskDescription}>{task.description}</p>
            </div>
          )}

          {task.attachments && task.attachments.length > 0 && (
            <div className={styles.taskDetailSection}>
              <h3 className={styles.sectionTitle}>Attachments</h3>
              <div className={styles.attachments}>
                {task.attachments.map((att, i) => (
                  <a
                    key={i}
                    href={att.url || att}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.attachmentItem}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                    {att.name || att.url || `Attachment ${i + 1}`}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className={styles.taskDetailSection}>
            <h3 className={styles.sectionTitle}>Comments</h3>
            <CommentList taskId={task._id} currentUser={user} />
          </div>
        </div>

        <div className={styles.taskDetailSidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarItem}>
              <span className={styles.sidebarLabel}>Assignee</span>
              {task.assignee ? (
                <div className={styles.assigneeInfo}>
                  <Avatar
                    user={typeof task.assignee === 'object' ? task.assignee : null}
                    size={28}
                  />
                  <span className={styles.sidebarValue}>
                    {typeof task.assignee === 'object'
                      ? task.assignee.fullName
                      : 'Unknown'}
                  </span>
                </div>
              ) : (
                <span className={styles.sidebarValue}>Unassigned</span>
              )}
            </div>

            <div className={styles.sidebarItem}>
              <span className={styles.sidebarLabel}>Due Date</span>
              <span className={styles.sidebarValue}>{formatDate(task.dueDate)}</span>
            </div>

            <div className={styles.sidebarItem}>
              <span className={styles.sidebarLabel}>Created By</span>
              <div className={styles.assigneeInfo}>
                {task.createdBy && (
                  <>
                    <Avatar
                      user={typeof task.createdBy === 'object' ? task.createdBy : null}
                      size={28}
                    />
                    <span className={styles.sidebarValue}>
                      {typeof task.createdBy === 'object'
                        ? task.createdBy.fullName
                        : 'Unknown'}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className={styles.sidebarItem}>
              <span className={styles.sidebarLabel}>Created</span>
              <span className={styles.sidebarValue}>
                {formatDate(task.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <EditTaskModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        task={task}
        members={members}
      />
    </div>
  )
}
