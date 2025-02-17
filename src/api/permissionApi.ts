// app/api/permissionApi.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.workerlly.in/api/v1/admin"

export interface Permission {
  id: string
  module: string
  action: string
  roles: string[]
  created_at?: string
}

export interface PermissionCreateInput {
  module: string
  action: string
  roles: string[]
}

export interface PermissionUpdateInput {
  module?: string
  action?: string
  roles?: string[]
}

export async function fetchPermissions(search?: string): Promise<Permission[]> {
  const queryParams = new URLSearchParams()
  if (search) {
    queryParams.append('search', search)
  }

  const response = await fetch(`${API_BASE_URL}/permissions?${queryParams}`)
  if (!response.ok) {
    throw new Error('Failed to fetch permissions')
  }
  
  const data = await response.json()
  return data.data
}

export async function createPermission(permission: PermissionCreateInput): Promise<Permission> {
  const response = await fetch(`${API_BASE_URL}/permissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(permission),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create permission')
  }
  
  return response.json()
}

export async function updatePermission(id: string, permission: PermissionUpdateInput): Promise<Permission> {
  const response = await fetch(`${API_BASE_URL}/permissions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(permission),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update permission')
  }
  
  return response.json()
}

export async function deletePermission(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/permissions/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    throw new Error('Failed to delete permission')
  }
}