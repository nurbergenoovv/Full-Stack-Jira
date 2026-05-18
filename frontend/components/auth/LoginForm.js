'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useAuthStore from '../../stores/authStore'
import useWebsocketStore from '../../stores/websocketStore'
import Input from '../ui/Input'
import Button from '../ui/Button'
import styles from '../../styles/auth.module.css'

export default function LoginForm() {
  const router = useRouter()
  const { login } = useAuthStore()
  const { connect } = useWebsocketStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(form.email, form.password)
      connect(data.token)
      router.push('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.authLogo}>T</div>
          <h1 className={styles.authTitle}>Welcome back</h1>
          <p className={styles.authSubtitle}>Sign in to your Jira account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorAlert}>{error}</div>}

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
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" loading={loading} size="lg" className={styles.submitBtn}>
            Sign In
          </Button>
        </form>

        <p className={styles.authFooter}>
          Don&apos;t have an account?{' '}
          <Link href="/register" className={styles.authLink}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
