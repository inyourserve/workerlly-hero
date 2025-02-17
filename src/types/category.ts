// types/category.ts
export interface Category {
  _id: string
  name: string
  thumbnail: string
  description?: string | null
  order?: number
  created_at?: string
  updated_at?: string
  subcategories?: Subcategory[]
  sub_categories?: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  thumbnail: string
  categoryId?: string
  created_at?: string
  updated_at?: string
}

export interface CategoryResponse {
  status: string
  data: Category[]
  pagination: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}