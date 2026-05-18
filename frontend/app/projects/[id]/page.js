'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import ProtectedRoute from '../../../components/layout/ProtectedRoute'
import Navbar from '../../../components/layout/Navbar'
import Sidebar from '../../../components/layout/Sidebar'
import KanbanBoard from '../../../components/kanban/KanbanBoard'
import TaskFilters from '../../../components/tasks/TaskFilters'
import CreateTaskModal from '../../../components/tasks/CreateTaskModal'
import OnlineUsers from '../../../components/members/OnlineUsers'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import Avatar from '../../../components/ui/Avatar'
import useProjectStore from '../../../stores/projectStore'
import useTaskStore from '../../../stores/taskStore'
import useAuthStore from '../../../stores/authStore'
import useWebsocketStore from '../../../stores/websocketStore'
import { UploadButton } from '../../../lib/uploadthing'
import styles from './ProjectPage.module.css'

function ProjectContent({ id }) {
  const router = useRouter()
  const { user } = useAuthStore()
  const { currentProject, fetchProject, updateProject, deleteProject, inviteMember, removeMember, updateCover } = useProjectStore()
  const { tasks, fetchTasks, filters } = useTaskStore()
  const { joinProject, leaveProject } = useWebsocketStore()

  const [showCreateTask, setShowCreateTask] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteError, setInviteError] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [editForm, setEditForm] = useState({ title: '', description: '' })
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const project = await fetchProject(id)
        await fetchTasks(id, filters)
        setEditForm({ title: project.title, description: project.description || '' })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    init()
    joinProject(id)
    return () => leaveProject(id)
  }, [id])

  const handleInvite = async (e) => {
    e.preventDefault()
    setInviteError('')
    setInviteLoading(true)
    try {
      await inviteMember(id, inviteEmail)
      setInviteEmail('')
      setShowInvite(false)
    } catch (err) {
      setInviteError(err.message)
    } finally {
      setInviteLoading(false)
    }
  }

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Remove this member from the project?')) return
    try {
      await removeMember(id, memberId)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleUpdateProject = async (e) => {
    e.preventDefault()
    setEditError('')
    setEditLoading(true)
    try {
      await updateProject(id, editForm)
      setShowSettings(false)
    } catch (err) {
      setEditError(err.message)
    } finally {
      setEditLoading(false)
    }
  }

  const handleDeleteProject = async () => {
    if (!confirm(`Delete project "${currentProject?.title}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await deleteProject(id)
      router.push('/dashboard')
    } catch (err) {
      alert(err.message)
      setDeleting(false)
    }
  }

  const handleCoverUpload = async (res) => {
    if (res && res[0]) {
      try {
        await updateCover(id, res[0].url)
      } catch (err) {
        alert(err.message)
      }
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page-loading">
          <div className="spinner" />
        </div>
      </>
    )
  }

  if (!currentProject) {
    return (
      <>
        <Navbar />
        <div className={styles.notFound}>
          <p>Project not found.</p>
          <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
        </div>
      </>
    )
  }

  const isOwner =
    currentProject.owner?._id === user?._id ||
    currentProject.owner === user?._id

  const members = currentProject.members || []

  return (
    <>
      <Navbar />
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.projectHeader}>
            {currentProject.coverImage && (
              <div className={styles.coverImage}>
                <Image
                  src={currentProject.coverImage}
                  alt={currentProject.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
                <div className={styles.coverOverlay} />
              </div>
            )}
            <div className={styles.projectInfo}>
              <div className={styles.projectTitleRow}>
                <div>
                  <h1 className={styles.projectTitle}>{currentProject.title}</h1>
                  {currentProject.description && (
                    <p className={styles.projectDesc}>{currentProject.description}</p>
                  )}
                </div>
                <div className={styles.projectActions}>
                  {isOwner && (
                    <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
                      Settings
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setShowInvite(true)}>
                    + Invite
                  </Button>
                  <Button size="sm" onClick={() => setShowCreateTask(true)}>
                    + New Task
                  </Button>
                </div>
              </div>

              <div className={styles.projectMeta}>
                <div className={styles.membersRow}>
                  {members.slice(0, 6).map((m) => (
                    <Avatar key={m._id || m} user={typeof m === 'object' ? m : null} size={28} />
                  ))}
                  {members.length > 6 && (
                    <span className={styles.moreMembers}>+{members.length - 6}</span>
                  )}
                </div>
                <OnlineUsers projectId={id} members={members} />
              </div>
            </div>
          </div>

          <div className={styles.filtersWrap}>
            <TaskFilters projectId={id} members={members} />
          </div>

          <KanbanBoard tasks={tasks} />
        </main>
      </div>

      <CreateTaskModal
        isOpen={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        projectId={id}
        members={members}
      />

      <Modal isOpen={showInvite} onClose={() => setShowInvite(false)} title="Invite Member">
        <form onSubmit={handleInvite} className={styles.inviteForm}>
          {inviteError && <div className={styles.formError}>{inviteError}</div>}
          <Input
            label="Member Email"
            type="email"
            placeholder="colleague@example.com"
            value={inviteEmail}
            onChange={(e) => { setInviteEmail(e.target.value); setInviteError('') }}
            required
          />

          {members.length > 0 && (
            <div className={styles.membersList}>
              <p className={styles.membersListTitle}>Current Members</p>
              {members.map((m) => (
                <div key={m._id || m} className={styles.memberItem}>
                  <Avatar user={typeof m === 'object' ? m : null} size={28} />
                  <span className={styles.memberName}>
                    {typeof m === 'object' ? m.fullName : 'Unknown'}
                  </span>
                  {typeof m === 'object' && m._id !== user?._id && isOwner && (
                    <button
                      type="button"
                      className={styles.removeMemberBtn}
                      onClick={() => handleRemoveMember(m._id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className={styles.formActions}>
            <Button variant="ghost" type="button" onClick={() => setShowInvite(false)}>Cancel</Button>
            <Button type="submit" loading={inviteLoading}>Send Invite</Button>
          </div>
        </form>
      </Modal>

      {isOwner && (
        <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Project Settings" size="lg">
          <div className={styles.settingsContent}>
            <form onSubmit={handleUpdateProject} className={styles.settingsForm}>
              <h3 className={styles.settingsSectionTitle}>General</h3>
              {editError && <div className={styles.formError}>{editError}</div>}
              <Input
                label="Project Title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                required
              />
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Project description..."
                />
              </div>
              <Button type="submit" loading={editLoading}>Save Changes</Button>
            </form>

            <div className={styles.settingsSection}>
              <h3 className={styles.settingsSectionTitle}>Cover Image</h3>
              <UploadButton
                endpoint="projectCover"
                headers={() => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })}
                onClientUploadComplete={handleCoverUpload}
                onUploadError={(err) => alert(err.message)}
              />
            </div>

            <div className={styles.settingsDanger}>
              <h3 className={styles.dangerTitle}>Danger Zone</h3>
              <p className={styles.dangerDesc}>
                Deleting a project is permanent and cannot be undone.
              </p>
              <Button variant="danger" loading={deleting} onClick={handleDeleteProject}>
                Delete Project
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default function ProjectPage() {
  const { id } = useParams()
  return (
    <ProtectedRoute>
      <ProjectContent id={id} />
    </ProtectedRoute>
  )
}
