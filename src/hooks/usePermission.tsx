'use client'

import { useAuth } from '@/contexts/AuthContext'

export const usePermissions = () => {
  const { user } = useAuth()

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user?.role?.permissions) return false
    
    return user.role.permissions.some(
      permission => 
        permission.resource === resource && 
        permission.actions.includes(action)
    )
  }

  const isSuperAdmin = (): boolean => {
    return user?.role?.name === 'super_admin'
  }

  const isAdmin = (): boolean => {
    const adminRoles = ['admin', 'super_admin']
    return adminRoles.includes(user?.role?.name || '')
  }

  return {
    hasPermission,
    isSuperAdmin,
    isAdmin
  }
}