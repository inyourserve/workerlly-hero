import Cookies from "js-cookie"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.workerlly.in/api/v1"

// Types
export interface Admin {
  id: string
  name: string
  email: string
  mobile: string
  roleId: string
  roleName: string
  status: boolean
  mobile_verified: boolean
  created_at: string
  last_login: string | null
  updated_at: string
}

export interface Role {
  _id: string
  name: string
  description: string
  permissions: {
    resource: string
    actions: string[]
  }[]
  created_at: string
  updated_at: string
}

export interface Permission {
  resource: string
  actions: string[]
}

export interface AdminCreateInput {
  name: string
  email: string
  mobile: string
  password: string
  roleId: string
  status: boolean
}

export interface ApiResponse<T> {
  total: number
  page: number
  page_size: number
  results: T[]
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = Cookies.get("authToken")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

// API Functions
export const fetchAdmins = async (
  page: number,
  limit: number,
  search?: string,
  status?: string,
  roleId?: string,
): Promise<ApiResponse<Admin>> => {
  try {
    const url = new URL(`${API_BASE_URL}/admins`)
    url.searchParams.append("skip", String((page - 1) * limit))
    url.searchParams.append("limit", String(limit))
    if (search) url.searchParams.append("search", search)
    if (status) url.searchParams.append("status", status)
    if (roleId) url.searchParams.append("roleId", roleId)

    const response = await fetch(url.toString(), {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to fetch admins")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching admins:", error)
    throw error
  }
}

export const createAdmin = async (adminData: AdminCreateInput): Promise<Admin> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admins`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(adminData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to create admin")
    }

    return response.json()
  } catch (error) {
    console.error("Error creating admin:", error)
    throw error
  }
}

export const updateAdmin = async (id: string, adminData: Partial<Admin>): Promise<Admin> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admins/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(adminData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to update admin")
    }

    return response.json()
  } catch (error) {
    console.error("Error updating admin:", error)
    throw error
  }
}

export const deleteAdmin = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admins/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to delete admin")
    }
  } catch (error) {
    console.error("Error deleting admin:", error)
    throw error
  }
}

export const resetAdminPassword = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admins/${id}/reset-password`, {
      method: "POST",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to reset password")
    }
  } catch (error) {
    console.error("Error resetting password:", error)
    throw error
  }
}

export const verifyAdmin = async (mobile: string, otp: string): Promise<Admin> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admins/verify`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ mobile, otp }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to verify admin")
    }

    return response.json()
  } catch (error) {
    console.error("Error verifying admin:", error)
    throw error
  }
}

// Fetch available roles
export const fetchRoles = async (): Promise<Role[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to fetch roles")
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching roles:", error)
    throw error
  }
}

