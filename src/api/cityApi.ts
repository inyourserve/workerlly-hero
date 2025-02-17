import { City, PaginatedResponse, State } from '@/types/city'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.workerlly.in/api/v1/admin"

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'An error occurred while fetching data')
  }
  return response.json()
}

export async function fetchCities(
  page: number = 1,
  per_page: number = 10,
  state_id?: string,
  is_served?: boolean,
  search?: string
): Promise<PaginatedResponse<City>> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
  })
  
  if (state_id && state_id !== 'all') {
    params.append('state_id', state_id)
  }
  if (is_served !== undefined) {
    params.append('is_served', is_served.toString())
  }
  if (search) {
    params.append('search', search)
  }
  
  const response = await fetch(`${API_BASE_URL}/cities?${params}`)
  return handleResponse<PaginatedResponse<City>>(response)
}

export async function fetchStates(): Promise<State[]> {
  const response = await fetch(`${API_BASE_URL}/states`)
  const data = await handleResponse<{ states: State[] }>(response)
  return data.states
}

export async function createCity(cityData: { 
  name: string; 
  is_served: boolean;
  state_id: string;
}): Promise<City> {
  const response = await fetch(`${API_BASE_URL}/cities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cityData),
  })
  return handleResponse<City>(response)
}

export async function updateCity(
  cityId: string, 
  updateData: { is_served: boolean }
): Promise<City> {
  const response = await fetch(`${API_BASE_URL}/cities/${cityId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  })
  return handleResponse<City>(response)
}

export async function deleteCity(cityId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/cities/${cityId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return handleResponse<void>(response)
}
