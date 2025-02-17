// types/user.ts

export interface User {
  _id: string
  mobile: string
  roles: string[]
  status: boolean
  is_user_blocked: boolean
  created_at: string
}

export interface PersonalInfo {
  name: string
  gender: string | null
  dob: string | null
  marital_status: string | null
  religion: string | null
  diet: string | null
  profile_image: string
  email?: string
}

export interface SubCategory {
  _id: string
  sub_category_name: string
}

export interface Category {
  category_id: string
  category_name: string
  sub_categories: SubCategory[]
}

export interface Location {
  latitude: number
  longitude: number
}

export interface UserStatus {
  current_status: 'available' | 'occupied' | 'offline'
  current_job_id?: string
  reason: string
  status_updated_at: string
}

export interface SeekerStats {
  wallet_balance: number
  city_id: string
  city_name: string
  category: Category
  location: Location
  experience: number
  user_status: UserStatus
  total_jobs_done: number
  total_earned: number
  total_hours_worked: number
  total_reviews: number
  avg_rating: number
  sum_ratings: number
  aadhar: string
}

export interface ProviderStats {
  city_id: string
  city_name: string
  total_jobs_posted: number
  total_jobs_completed: number
  total_jobs_cancelled: number
  total_spent: number
  total_reviews: number
  avg_rating: number
  sum_ratings: number
}

export interface UserProfile extends User {
  personal_info: PersonalInfo
  provider_stats?: ProviderStats
  seeker_stats?: SeekerStats
}

export interface UsersResponse {
  users: User[]
  total: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface UserFilters {
  search?: string
  role?: string
  status?: boolean
  skip: number
  limit: number
}