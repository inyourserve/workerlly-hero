// api/seekerApi.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.workerlly.in/api/v1/admin";

// Helper function for handling API errors
const handleApiError = (error: any, defaultMessage: string): never => {
  if (error instanceof Response && error.status) {
    throw new Error(`API Error: ${error.status}`);
  }
  console.error('API Error:', error);
  throw new Error(defaultMessage);
};

export interface City {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
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
}

export interface SeekerQueryParams {
  search?: string;
  status?: string;
  category_id?: string;
  city_id?: string;
  page: number;
  limit: number;
}

export interface SeekerResponse {
  data: Seeker[];
  cities: City[];
  categories: Category[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export async function fetchSeekers(params: SeekerQueryParams): Promise<SeekerResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params.category_id && params.category_id !== 'all') queryParams.append('category_id', params.category_id);
    if (params.city_id && params.city_id !== 'all') queryParams.append('city_id', params.city_id);
    queryParams.append('page', params.page.toString());
    queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/seekers?${queryParams}`);
    
    if (!response.ok) {
      throw response;
    }
    
    return response.json();
  } catch (error) {
    return handleApiError(error, 'Failed to fetch seekers');
  }
}

export async function fetchSeekerDetails(id: string): Promise<Seeker> {
  try {
    const response = await fetch(`${API_BASE_URL}/seekers/${id}`);
    
    if (!response.ok) {
      throw response;
    }
    
    return response.json();
  } catch (error) {
    return handleApiError(error, 'Failed to fetch seeker details');
  }
}