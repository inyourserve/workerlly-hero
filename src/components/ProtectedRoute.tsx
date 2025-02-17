// components/ProtectedRoute.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { usePermissions } from '@/hooks/usePermission'

interface ProtectedRouteProps {
  children: React.ReactNode
  resource: string
  action: string
}

export function ProtectedRoute({ children, resource, action }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const { hasPermission, isSuperAdmin } = usePermissions()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/')
        return
      }

      if (!isSuperAdmin() && !hasPermission(resource, action)) {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, isLoading, resource, action, router, hasPermission, isSuperAdmin])

  if (isLoading || !isAuthenticated || (!isSuperAdmin() && !hasPermission(resource, action))) {
    return null
  }

  return <>{children}</>
}
