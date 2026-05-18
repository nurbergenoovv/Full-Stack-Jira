'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useNotificationStore from '../../stores/notificationStore'
import Button from '../ui/Button'
import styles from '../../styles/notifications.module.css'

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

const NOTIF_ICONS = {
  task_assigned: '👤',
  task_updated: '✏️',
  comment_added: '💬',
  project_invited: '📩',
}

export default function NotificationList() {
  const router = useRouter()
  const { notifications, unreadCount, fetchNotifications, markRead, markAllRead } =
    useNotificationStore()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleClick = async (notif) => {
    if (!notif.isRead) {
      await markRead(notif._id)
    }
    if (notif.relatedTask) {
      router.push(`/tasks/${notif.relatedTask?._id || notif.relatedTask}`)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Notifications</h1>
          {unreadCount > 0 && (
            <p className={styles.subtitle}>{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className={styles.list}>
        {notifications.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔔</div>
            <p className={styles.emptyText}>No notifications yet</p>
          </div>
        )}

        {notifications.map((notif) => (
          <div
            key={notif._id}
            className={`${styles.notifItem} ${!notif.isRead ? styles.unread : ''}`}
            onClick={() => handleClick(notif)}
          >
            <div className={styles.notifIcon}>
              {NOTIF_ICONS[notif.type] || '🔔'}
            </div>
            <div className={styles.notifContent}>
              <p className={styles.notifText}>{notif.text}</p>
              <span className={styles.notifTime}>{timeAgo(notif.createdAt)}</span>
            </div>
            {!notif.isRead && <div className={styles.unreadDot} />}
          </div>
        ))}
      </div>
    </div>
  )
}
