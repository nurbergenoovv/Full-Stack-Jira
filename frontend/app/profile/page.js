'use client'

import { useState } from 'react'
import ProtectedRoute from '../../components/layout/ProtectedRoute'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import useAuthStore from '../../stores/authStore'
import { UploadButton } from '../../lib/uploadthing'
import styles from './ProfilePage.module.css'

function ProfileContent() {
  const { user, updateProfile, updateAvatar } = useAuthStore()
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!form.fullName.trim()) {
      setError('Name is required')
      return
    }
    setLoading(true)
    try {
      await updateProfile(form)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (res) => {
    if (res && res[0]) {
      setAvatarUploading(true)
      try {
        await updateAvatar(res[0].url)
        setSuccess('Avatar updated!')
      } catch (err) {
        setError(err.message || 'Failed to update avatar')
      } finally {
        setAvatarUploading(false)
      }
    }
  }

  return (
    <>
      <Navbar />
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.profileContainer}>
            <h1 className={styles.title}>My Profile</h1>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Profile Photo</h2>
              <div className={styles.avatarSection}>
                <Avatar user={user} size={80} />
                <div className={styles.avatarUpload}>
                  <p className={styles.avatarHint}>
                    Upload a new profile photo. Supported: JPG, PNG, WebP.
                  </p>
                  {avatarUploading ? (
                    <div className="spinner" />
                  ) : (
                    <UploadButton
                      endpoint="avatarUploader"
                      headers={() => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })}
                      onClientUploadComplete={handleAvatarUpload}
                      onUploadError={(err) => setError(err.message)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Personal Information</h2>

              {error && <div className={styles.errorMsg}>{error}</div>}
              {success && <div className={styles.successMsg}>{success}</div>}

              <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                  label="Full Name"
                  value={form.fullName}
                  onChange={(e) => {
                    setForm({ ...form, fullName: e.target.value })
                    setError('')
                    setSuccess('')
                  }}
                  placeholder="Your full name"
                  required
                />

                <div className={styles.readonlyField}>
                  <span className={styles.readonlyLabel}>Email</span>
                  <span className={styles.readonlyValue}>{user?.email}</span>
                </div>

                <div className={styles.readonlyField}>
                  <span className={styles.readonlyLabel}>Member since</span>
                  <span className={styles.readonlyValue}>
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '—'}
                  </span>
                </div>

                <div className={styles.formActions}>
                  <Button type="submit" loading={loading}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}
