'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '../../stores/authStore'
import LoginForm from '../../components/auth/LoginForm'

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    )
  }

  if (isAuthenticated) return null

  return <LoginForm />
}
