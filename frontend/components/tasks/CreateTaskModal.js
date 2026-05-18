'use client'

import { useState } from 'react'
import useTaskStore from '../../stores/taskStore'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import styles from '../../styles/task.module.css'

const STATUSES = ['Backlog', 'Todo', 'In Progress', 'Review', 'Done']
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

export default function CreateTaskModal({ isOpen, onClose, projectId, members = [] }) {
  const { createTask } = useTaskStore()
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Backlog',
    priority: 'Medium',
    dueDate: '',
    assignee: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Task title is required')
      return
    }
    setLoading(true)
    try {
      const payload = { ...form }
      if (!payload.assignee) delete payload.assignee
      if (!payload.dueDate) delete payload.dueDate
      await createTask(projectId, payload)
      setForm({ title: '', description: '', status: 'Backlog', priority: 'Medium', dueDate: '', assignee: '' })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setForm({ title: '', description: '', status: 'Backlog', priority: 'Medium', dueDate: '', assignee: '' })
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Task">
      <form onSubmit={handleSubmit} className={styles.taskForm}>
        {error && <div className={styles.formError}>{error}</div>}

        <Input
          label="Task Title"
          name="title"
          placeholder="e.g. Design login screen"
          value={form.title}
          onChange={handleChange}
          required
        />

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Description</label>
          <textarea
            name="description"
            placeholder="Describe the task..."
            value={form.description}
            onChange={handleChange}
            className={styles.textarea}
            rows={3}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={styles.select}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className={styles.select}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className={styles.select}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Assignee</label>
            <select
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>{m.fullName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formActions}>
          <Button variant="ghost" onClick={handleClose} type="button">Cancel</Button>
          <Button type="submit" loading={loading}>Create Task</Button>
        </div>
      </form>
    </Modal>
  )
}
