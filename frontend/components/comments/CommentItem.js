'use client'

import { useState } from 'react'
import useTaskStore from '../../stores/taskStore'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import styles from './Comments.module.css'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function CommentItem({ comment, currentUser }) {
  const { updateComment, deleteComment } = useTaskStore()
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState(comment.message)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isOwner =
    comment.author?._id === currentUser?._id ||
    comment.author === currentUser?._id

  const handleSave = async () => {
    if (!message.trim()) return
    setSaving(true)
    try {
      await updateComment(comment._id, message)
      setEditing(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return
    setDeleting(true)
    try {
      await deleteComment(comment._id)
    } catch (err) {
      alert(err.message)
      setDeleting(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') {
      setEditing(false)
      setMessage(comment.message)
    }
  }

  return (
    <div className={styles.commentItem}>
      <Avatar
        user={typeof comment.author === 'object' ? comment.author : null}
        size={32}
      />
      <div className={styles.commentContent}>
        <div className={styles.commentHeader}>
          <span className={styles.commentAuthor}>
            {typeof comment.author === 'object'
              ? comment.author.fullName
              : 'Unknown'}
          </span>
          <span className={styles.commentTime}>{timeAgo(comment.createdAt)}</span>
          {comment.edited && (
            <span className={styles.editedLabel}>(edited)</span>
          )}
        </div>

        {editing ? (
          <div className={styles.editArea}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.commentTextarea}
              autoFocus
              rows={2}
            />
            <div className={styles.editActions}>
              <Button size="sm" loading={saving} onClick={handleSave}>
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditing(false)
                  setMessage(comment.message)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className={styles.commentMessage}>{comment.message}</p>
        )}

        {isOwner && !editing && (
          <div className={styles.commentActions}>
            <button
              className={styles.commentActionBtn}
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
            <button
              className={`${styles.commentActionBtn} ${styles.deleteAction}`}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? '...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
