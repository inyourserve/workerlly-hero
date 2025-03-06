// api/addRateApi.ts

import { Rate, RateQueryParams, RatesResponse } from '@/types/add_rate'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.workerlly.in/api/v1/admin"

export async function fetchRates(params: RateQueryParams): Promise<RatesResponse> {
  const queryString = new URLSearchParams({
    city_id: params.city_id,
    page: params.page.toString(),
    per_page: params.per_page.toString()
  }).toString()

  const response = await fetch(`${API_BASE_URL}/rates?${queryString}`)
  if (!response.ok) {
    throw new Error('Failed to fetch rates')
  }
  return response.json()
}

export async function createOrUpdateRate(rate: Rate): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/rates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rate),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create/update rate')
  }
}