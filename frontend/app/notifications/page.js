'use client'

import ProtectedRoute from '../../components/layout/ProtectedRoute'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import NotificationList from '../../components/notifications/NotificationList'
import styles from './NotificationsPage.module.css'

function NotificationsContent() {
  return (
    <>
      <Navbar />
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <NotificationList />
        </main>
      </div>
    </>
  )
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsContent />
    </ProtectedRoute>
  )
}
