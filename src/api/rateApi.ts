// api/rateApi.ts
import { RateQueryParams, RateResponse, RateCreate } from '@/types/rate';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.workerlly.in/api/v1/admin"

// Helper function for handling API errors
const handleApiError = (error: any, defaultMessage: string): never => {
  if (error instanceof Response && error.status) {
    throw new Error(`API Error: ${error.status}`);
  }
  console.error('API Error:', error);
  throw new Error(defaultMessage);
};

export async function fetchRates(params: RateQueryParams): Promise<RateResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.city_id && params.city_id !== 'all') {
      queryParams.append('city_id', params.city_id);
    }
    if (params.category_id && params.category_id !== 'all') {
      queryParams.append('category_id', params.category_id);
    }
    
    queryParams.append('page', params.page.toString());
    queryParams.append('per_page', params.per_page.toString());

    const response = await fetch(`${API_BASE_URL}/rates?${queryParams}`);
    
    if (!response.ok) {
      throw response;
    }
    
    return response.json();
  } catch (error) {
    return handleApiError(error, 'Failed to fetch rates');
  }
}

export async function createOrUpdateRate(rate: RateCreate): Promise<{ success: boolean; message: string; rate_id?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/rates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rate),
    });
    
    if (!response.ok) {
      throw response;
    }
    
    return response.json();
  } catch (error) {
    return handleApiError(error, 'Failed to create/update rate');
  }
}