// types/provider.ts

export interface City {
    id: string;
    name: string;
  }
  
  export interface Provider {
    id: string;
    name: string;
    mobile: string;
    city: string;
    rating: number;
    total_jobs: number;
    total_spent: number;
    is_blocked: boolean;
  }
  
  export interface ProviderQueryParams {
    city_id?: string;
    status?: string;
    page: number;
    limit: number;
  }
  
  export interface ProviderResponse {
    data: Provider[];
    cities: City[];
    pagination: {
      total: number;
      page: number;
      page_size: number;
      total_pages: number;
    };
  }
  