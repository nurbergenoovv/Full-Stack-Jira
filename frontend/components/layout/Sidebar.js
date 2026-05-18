'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useProjectStore from '../../stores/projectStore'
import useUiStore from '../../stores/uiStore'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  const pathname = usePathname()
  const { projects } = useProjectStore()
  const { sidebarOpen, closeSidebar } = useUiStore()

  return (
    <>
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Navigation</div>
          <nav className={styles.nav}>
            <Link
              href="/dashboard"
              onClick={closeSidebar}
              className={`${styles.navItem} ${pathname === '/dashboard' ? styles.active : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Dashboard
            </Link>
            <Link
              href="/notifications"
              onClick={closeSidebar}
              className={`${styles.navItem} ${pathname === '/notifications' ? styles.active : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              Notifications
            </Link>
            <Link
              href="/profile"
              onClick={closeSidebar}
              className={`${styles.navItem} ${pathname === '/profile' ? styles.active : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Profile
            </Link>
          </nav>
        </div>

        {projects.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Projects</div>
            <nav className={styles.nav}>
              {projects.slice(0, 8).map((project) => (
                <Link
                  key={project._id}
                  href={`/projects/${project._id}`}
                  onClick={closeSidebar}
                  className={`${styles.navItem} ${pathname === `/projects/${project._id}` ? styles.active : ''}`}
                >
                  <span className={styles.projectDot} />
                  <span className={styles.projectName}>{project.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </aside>
    </>
  )
}
