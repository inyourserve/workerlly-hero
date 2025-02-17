// api/providerApi.ts
import { Provider, ProviderResponse, ProviderQueryParams } from '@/types/provider';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.workerlly.in/api/v1/admin"

// Helper function for handling API errors
const handleApiError = (error: any, defaultMessage: string): never => {
  if (error instanceof Response && error.status) {
    throw new Error(`API Error: ${error.status}`);
  }
  console.error('API Error:', error);
  throw new Error(defaultMessage);
};

export async function fetchProviders(params: ProviderQueryParams): Promise<ProviderResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.city_id && params.city_id !== 'all') {
      queryParams.append('city_id', params.city_id);
    }
    if (params.status && params.status !== 'all') {
      queryParams.append('status', params.status);
    }
    
    queryParams.append('page', params.page.toString());
    queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/providers?${queryParams}`);
    
    if (!response.ok) {
      throw response;
    }
    
    return response.json();
  } catch (error) {
    return handleApiError(error, 'Failed to fetch providers');
  }
}

export async function fetchProviderDetails(id: string): Promise<Provider> {
  try {
    const response = await fetch(`${API_BASE_URL}/providers/${id}`);
    
    if (!response.ok) {
      throw response;
    }
    
    return response.json();
  } catch (error) {
    return handleApiError(error, 'Failed to fetch provider details');
  }
}

export async function updateProviderStatus(id: string, is_blocked: boolean): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/providers/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_blocked }),
    });
    
    if (!response.ok) {
      throw response;
    }
    
    return response.json();
  } catch (error) {
    return handleApiError(error, 'Failed to update provider status');
  }
}
