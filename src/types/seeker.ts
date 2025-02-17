// types/seeker.ts

export interface City {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface SeekerQueryParams {
  search?: string;
  status?: string;
  category_id?: string;
  city_id?: string;
  page: number;
  limit: number;
}

export interface Seeker {
  id: string;
  name: string;
  mobile: string;
  category: string;
  city: string;
  current_status: string;
  total_jobs: number;
  total_earned: number;
  status_updated_at: string;
}

export interface SeekerResponse {
  data: Seeker[];
  categories: Category[];
  cities: City[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface SeekerStats {
  total_seekers: number;
  total_jobs_completed: number;
  total_wallet_balance: number;
  average_rating: number;
  status_breakdown: {
    [key: string]: number;
  };
}