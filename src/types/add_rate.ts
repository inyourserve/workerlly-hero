// types/add_rate.ts

export interface City {
    id: string;
    name: string;
  }
  
  export interface Category {
    id: string;
    name: string;
  }
  
  export interface Rate {
    city_id: string;
    category_id: string;
    rate_per_hour: number;
    min_hourly_rate: number;
    max_hourly_rate: number;
  }
  
  export interface CategoryRate {
    category_id: string;
    category_name: string;
    rate_per_hour: number;
    min_hourly_rate: number;
    max_hourly_rate: number;
    has_existing_rate: boolean;
  }
  
  export interface RatesResponse {
    rates: Rate[];
    cities?: City[];
    categories?: Category[];
  }
  
  export interface RateQueryParams {
    city_id: string;
    page: number;
    per_page: number;
  }