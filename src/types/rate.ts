// types/rate.ts

export interface City {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface RateQueryParams {
  city_id?: string;
  category_id?: string;
  page: number;
  per_page: number;
}

export interface Rate {
  id: string;
  city_id: string;
  city_name: string;
  category_id: string;
  category_name: string;
  rate_per_hour: number;
  min_hourly_rate: number;
  max_hourly_rate: number;
}

export interface RateResponse {
  categories: Category[];  // Update if needed
  cities: City[];
  rates: Rate[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface RateCreate {
  city_id: string;
  category_id: string;
  rate_per_hour: number;
  min_hourly_rate: number;
  max_hourly_rate: number;
}