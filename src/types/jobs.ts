// types/jobs.ts

// Common interfaces
export interface City {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

// Query parameters interface
export interface JobQueryParams {
  search?: string;
  status?: string;
  category_id?: string;
  city_id?: string;
  page: number;
  limit: number;
}

// Base job interface for list view
export interface JobBase {
  id: string;
  task_id: string;
  title: string;
  description: string;
  category: string;
  category_id: string;
  city: string;
  city_id: string | null;
  status: string;
  created_at: string;
  hourly_rate: number;
  total_amount: number;
  estimated_time: number;
  total_hours_worked: string;
  billable_hours: number;
}

// User related interfaces
export interface UserProfile {
  name: string;
  gender: string | null;
  profile_image: string;
}

export interface UserStats {
  total_jobs_done?: number;
  total_jobs_posted?: number;
  total_jobs_completed?: number;
  avg_rating: number;
  total_reviews: number;
}

export interface UserDetails {
  profile: UserProfile;
  stats: UserStats;
  mobile: string;
}

// Extended job interface for detailed view
export interface Job extends JobBase {
  payment_status: {
    paid: boolean;
    payment_method: string | null;
    paid_at: string | null;
  };
  address_snapshot: {
    address_line1: string;
    address_line2?: string;
    apartment_number?: string;
    landmark?: string;
    label?: string;
    location?: {
      type: string;
      coordinates: [number, number];
    };
  };
  job_start_otp?: {
    OTP: number;
    is_verified: boolean;
    verified_at: string | null;
  };
  job_done_otp?: {
    OTP: number;
    is_verified: boolean;
    verified_at: string | null;
  };
  is_reached?: boolean;
  reached_at?: string;
  job_booking_time?: string;
  provider_details?: UserDetails;
  seeker_details?: UserDetails;
  provider_review?: {
    provider_review_done: boolean;
    provider_review_id: string;
    reviewed_at: string;
  };
  seeker_review?: {
    seeker_review_done: boolean;
    seeker_review_id: string;
    reviewed_at: string;
  };
}

// Response interfaces
export interface JobResponse {
  data: JobBase[];
  filters: {
    cities: City[];
    categories: Category[];
  };
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface JobDetailsResponse {
  data: Job;
}

// Status type for type-safety
export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// Status colors mapping
export const STATUS_COLORS: Record<JobStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
} as const;

// Status options for select
export const JOB_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
] as const;