'use client'

import useTaskStore from '../../stores/taskStore'
import KanbanColumn from './KanbanColumn'
import styles from '../../styles/kanban.module.css'

const STATUSES = ['Backlog', 'Todo', 'In Progress', 'Review', 'Done']

export default function KanbanBoard({ tasks }) {
  const { moveTask } = useTaskStore()

  const getTasksByStatus = (status) =>
    tasks.filter((t) => t.status === status)

  const handleDrop = async (taskId, newStatus) => {
    const task = tasks.find((t) => t._id === taskId)
    if (!task || task.status === newStatus) return
    try {
      await moveTask(taskId, newStatus)
    } catch (err) {
      console.error('Failed to move task:', err)
    }
  }

  return (
    <div className={styles.board}>
      {STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={getTasksByStatus(status)}
          onDrop={handleDrop}
        />
      ))}
    </div>
  )
}
