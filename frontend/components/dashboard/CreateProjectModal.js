'use client'

import { useState } from 'react'
import useProjectStore from '../../stores/projectStore'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import styles from '../../styles/dashboard.module.css'

export default function CreateProjectModal({ isOpen, onClose }) {
  const { createProject } = useProjectStore()
  const [form, setForm] = useState({ title: '', description: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Project title is required')
      return
    }
    setLoading(true)
    try {
      await createProject(form)
      setForm({ title: '', description: '' })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setForm({ title: '', description: '' })
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Project">
      <form onSubmit={handleSubmit} className={styles.createForm}>
        {error && <div className={styles.formError}>{error}</div>}

        <Input
          label="Project Title"
          name="title"
          placeholder="e.g. Website Redesign"
          value={form.title}
          onChange={handleChange}
          required
        />

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Description</label>
          <textarea
            name="description"
            placeholder="What is this project about?"
            value={form.description}
            onChange={handleChange}
            className={styles.textarea}
            rows={3}
          />
        </div>

        <div className={styles.formActions}>
          <Button variant="ghost" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  )
}
