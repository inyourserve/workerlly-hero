// api/jobApi.ts
import { JobQueryParams, JobResponse, JobDetailsResponse } from '@/types/jobs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.workerlly.in/api/v1/admin"

// Helper function for handling API errors
const handleApiError = (error: any, defaultMessage: string): never => {
  if (error instanceof Response && error.status) {
    throw new Error(`API Error: ${error.status}`);
  }
  console.error('API Error:', error);
  throw new Error(defaultMessage);
};

export async function fetchJobs(params: JobQueryParams): Promise<JobResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params.category_id && params.category_id !== 'all') queryParams.append('category_id', params.category_id);
    if (params.city_id && params.city_id !== 'all') queryParams.append('city_id', params.city_id);
    
    queryParams.append('page', params.page.toString());
    queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/jobs?${queryParams}`);
    
    if (!response.ok) {
      throw response;
    }
    
    return response.json();
  } catch (error) {
    return handleApiError(error, 'Failed to fetch jobs');
  }
}

export async function fetchJobDetails(jobId: string): Promise<JobDetailsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
    
    if (!response.ok) {
      throw response;
    }
    
    return response.json();
  } catch (error) {
    return handleApiError(error, 'Failed to fetch job details');
  }
}