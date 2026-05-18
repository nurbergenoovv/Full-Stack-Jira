'use client'

import { useEffect, useState } from 'react'
import useTaskStore from '../../stores/taskStore'
import CommentItem from './CommentItem'
import styles from './Comments.module.css'

export default function CommentList({ taskId, currentUser }) {
  const { comments, fetchComments, addComment } = useTaskStore()
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (taskId) fetchComments(taskId)
  }, [taskId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setSubmitting(true)
    try {
      await addComment(taskId, message)
      setMessage('')
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className={styles.commentList}>
      <div className={styles.comments}>
        {comments.length === 0 && (
          <p className={styles.noComments}>No comments yet. Be the first!</p>
        )}
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            currentUser={currentUser}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.addComment}>
        <textarea
          placeholder="Add a comment... (Enter to submit, Shift+Enter for newline)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.commentInput}
          rows={2}
          disabled={submitting}
        />
        <button
          type="submit"
          className={styles.submitComment}
          disabled={!message.trim() || submitting}
        >
          {submitting ? '...' : 'Comment'}
        </button>
      </form>
    </div>
  )
}
