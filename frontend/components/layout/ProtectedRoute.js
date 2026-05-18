'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '../../stores/authStore'

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return children
}
