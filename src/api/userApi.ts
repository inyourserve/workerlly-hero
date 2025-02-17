// api/userApi.ts

import { User, UsersResponse, UserProfile } from '@/types/user'

export interface UserFilters {
  search?: string
  role?: string
  status?: boolean
  skip: number
  limit: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.workerlly.in/api/v1/admin"

/**
 * Fetch users with pagination and filters
 */
export async function fetchUsers(filters: UserFilters): Promise<UsersResponse> {
  const queryParams = new URLSearchParams()
  
  // Add search filter
  if (filters.search) queryParams.append('search', filters.search)
  
  // Add role filter
  if (filters.role) queryParams.append('role', filters.role)
  
  // Add status filter
  if (filters.status !== undefined) queryParams.append('status', filters.status.toString())
  
  // Calculate current page from skip and limit
  const currentPage = Math.floor(filters.skip / filters.limit) + 1
  queryParams.append('page', currentPage.toString())
  queryParams.append('page_size', filters.limit.toString())

  try {
    const response = await fetch(`${API_BASE_URL}/users?${queryParams}`, {
      headers: {
        'Accept': 'application/json',
      },
    })
  
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }

    const data = await response.json()
    
    // Transform API response to match expected format
    return {
      users: data.data || [], 
      total: data.pagination?.total || 0,
      currentPage: data.pagination?.page || 1,
      totalPages: data.pagination?.total_pages || 1,
      hasNextPage: data.pagination?.has_next || false,
      hasPreviousPage: data.pagination?.has_previous || false
    }
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

/**
 * Fetch detailed user profile information
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user profile')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    throw error
  }
}

/**
 * Toggle user block status
 */
export async function toggleUserBlock(userId: string): Promise<{ success: boolean; is_blocked: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/toggle-block`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to update user block status')
    }

    const data = await response.json()
    return {
      success: true,
      is_blocked: data.is_blocked
    }
  } catch (error) {
    console.error('Failed to toggle user block status:', error)
    throw error
  }
}

/**
 * Helper function to handle API errors
 */
function handleApiError(error: any): never {
  // Log the error for debugging
  console.error('API Error:', error)

  // If it's already an Error object with a message, throw it directly
  if (error instanceof Error) {
    throw error
  }

  // If it's a string, wrap it in an Error
  if (typeof error === 'string') {
    throw new Error(error)
  }

  // Default error message
  throw new Error('An unexpected error occurred')
}
