'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import ProtectedRoute from '../../../components/layout/ProtectedRoute'
import Navbar from '../../../components/layout/Navbar'
import Sidebar from '../../../components/layout/Sidebar'
import TaskDetail from '../../../components/tasks/TaskDetail'
import useTaskStore from '../../../stores/taskStore'
import useProjectStore from '../../../stores/projectStore'
import styles from './TaskPage.module.css'

function TaskContent({ id }) {
  const { currentTask, fetchTask, isLoading } = useTaskStore()
  const { currentProject } = useProjectStore()

  useEffect(() => {
    fetchTask(id)
  }, [id])

  const members = currentProject?.members || []

  return (
    <>
      <Navbar />
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          {isLoading ? (
            <div className="page-loading">
              <div className="spinner" />
            </div>
          ) : currentTask ? (
            <TaskDetail task={currentTask} members={members} />
          ) : (
            <div className={styles.notFound}>
              <p>Task not found.</p>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default function TaskPage() {
  const { id } = useParams()
  return (
    <ProtectedRoute>
      <TaskContent id={id} />
    </ProtectedRoute>
  )
}
