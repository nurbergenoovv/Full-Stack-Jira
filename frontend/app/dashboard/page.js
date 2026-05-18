'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '../../components/layout/ProtectedRoute'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import ProjectCard from '../../components/dashboard/ProjectCard'
import CreateProjectModal from '../../components/dashboard/CreateProjectModal'
import Button from '../../components/ui/Button'
import useProjectStore from '../../stores/projectStore'
import styles from '../../styles/dashboard.module.css'

function DashboardContent() {
  const { projects, fetchProjects, isLoading } = useProjectStore()
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <>
      <Navbar />
      <div className={styles.dashboardLayout}>
        <Sidebar />
        <main className={styles.dashboardMain}>
          <div className={styles.dashboardHeader}>
            <div>
              <h1 className={styles.dashboardTitle}>My Projects</h1>
              <p className={styles.dashboardSubtitle}>
                {projects.length} project{projects.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button onClick={() => setShowCreate(true)}>
              + New Project
            </Button>
          </div>

          {isLoading ? (
            <div className="spinner" />
          ) : projects.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              <h2 className={styles.emptyTitle}>No projects yet</h2>
              <p className={styles.emptyDesc}>
                Create your first project to get started with Jira.
              </p>
              <Button onClick={() => setShowCreate(true)}>
                Create your first project
              </Button>
            </div>
          ) : (
            <div className={styles.projectGrid}>
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </main>
      </div>

      <CreateProjectModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
