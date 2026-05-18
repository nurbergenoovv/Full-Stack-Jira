'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useAuthStore from '../../stores/authStore'
import useWebsocketStore from '../../stores/websocketStore'
import Input from '../ui/Input'
import Button from '../ui/Button'
import styles from '../../styles/auth.module.css'

export default function RegisterForm() {
  const router = useRouter()
  const { register } = useAuthStore()
  const { connect } = useWebsocketStore()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const data = await register(form.fullName, form.email, form.password)
      connect(data.token)
      router.push('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.authLogo}>T</div>
          <h1 className={styles.authTitle}>Create account</h1>
          <p className={styles.authSubtitle}>Start managing projects with Jira</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          <Input
            label="Full Name"
            type="text"
            name="fullName"
            placeholder="John Doe"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirm"
            placeholder="Repeat password"
            value={form.confirm}
            onChange={handleChange}
            required
          />

          <Button type="submit" loading={loading} size="lg" className={styles.submitBtn}>
            Create Account
          </Button>
        </form>

        <p className={styles.authFooter}>
          Already have an account?{' '}
          <Link href="/login" className={styles.authLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
