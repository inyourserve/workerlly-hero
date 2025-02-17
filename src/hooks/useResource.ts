// hooks/useResource.ts
import { AVAILABLE_RESOURCES, ResourceKey, ActionType } from '@/lib/constants'
import { usePermissions } from './usePermission'

export function useResource(resource: ResourceKey) {
  const { hasPermission, isSuperAdmin } = usePermissions()

  const canAccess = (action: ActionType): boolean => {
    if (isSuperAdmin()) return true
    return hasPermission(resource, action)
  }

  const config = AVAILABLE_RESOURCES[resource]

  return {
    canAccess,
    config,
    canView: canAccess('read'),
    canCreate: canAccess('create'),
    canUpdate: canAccess('update'),
    canDelete: canAccess('delete')
  }
}
