// app/api/roleApi.ts
import Cookies from 'js-cookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.workerlly.in/api/v1/admin"

export interface Permission {
  resource: string
  actions: string[]
}

export interface Role {
  _id: string
  name: string
  description: string
  permissions: Permission[]
  created_at?: string
  updated_at?: string
}

export interface RoleCreateInput {
  name: string
  description: string
  permissions: Permission[]
}

export interface RoleUpdateInput {
  name?: string
  description?: string
  permissions?: Permission[]
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = Cookies.get('authToken')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export async function fetchRoles(search?: string): Promise<Role[]> {
  try {
    const queryParams = new URLSearchParams()
    if (search) {
      queryParams.append('search', search)
    }

    const response = await fetch(`${API_BASE_URL}/roles?${queryParams}`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to fetch roles')
    }
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching roles:', error)
    throw error
  }
}

export async function createRole(role: RoleCreateInput): Promise<Role> {
  try {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(role),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to create role')
    }
    
    return response.json()
  } catch (error) {
    console.error('Error creating role:', error)
    throw error
  }
}

export async function updateRole(id: string, role: RoleUpdateInput): Promise<Role> {
  try {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(role),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to update role')
    }
    
    return response.json()
  } catch (error) {
    console.error('Error updating role:', error)
    throw error
  }
}

export async function deleteRole(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to delete role')
    }
  } catch (error) {
    console.error('Error deleting role:', error)
    throw error
  }
}

// New function to fetch a single role
export async function fetchRole(id: string): Promise<Role> {
  try {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to fetch role')
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching role:', error)
    throw error
  }
}
