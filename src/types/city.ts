export interface City {
  _id: string
  name: string
  is_served: boolean
  state_id?: string
  state_name?: string
}

export interface State {
  id: string
  name: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}