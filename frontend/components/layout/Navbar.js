'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useAuthStore from '../../stores/authStore'
import useNotificationStore from '../../stores/notificationStore'
import useUiStore from '../../stores/uiStore'
import Avatar from '../ui/Avatar'
import styles from './Navbar.module.css'

export default function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { unreadCount } = useNotificationStore()
  const { sidebarOpen, toggleSidebar } = useUiStore()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <button
          className={styles.hamburger}
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>

        <Link href="/dashboard" className={styles.logo}>
          <span className={styles.logoIcon}>T</span>
          <span className={styles.logoText}>Jira</span>
        </Link>
      </div>

      <div className={styles.right}>
        <Link href="/dashboard" className={styles.navLink}>
          Dashboard
        </Link>

        <Link href="/notifications" className={styles.notifBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadCount > 0 && (
            <span className={styles.badge}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>

        <div className={styles.userMenu}>
          <Link href="/profile" className={styles.userInfo}>
            <Avatar user={user} size={32} />
            <span className={styles.userName}>{user?.fullName}</span>
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
