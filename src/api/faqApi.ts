import { Category, Question } from '@/types/faq'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.workerlly.in/api/v1/admin"

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'An error occurred while fetching data')
  }
  return response.json()
}

// Category endpoints
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/faq/categories`)
  return handleResponse<Category[]>(response)
}

export async function createCategory(categoryData: Omit<Category, '_id'>): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/faq/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoryData),
  })
  return handleResponse<Category>(response)
}

export async function updateCategory(
  categoryId: string, 
  categoryData: Partial<Omit<Category, '_id'>>
): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/faq/categories/${categoryId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoryData),
  })
  return handleResponse<Category>(response)
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/faq/categories/${categoryId}`, {
    method: 'DELETE',
  })
  await handleResponse<void>(response)
}

// Question endpoints
export async function fetchQuestions(categoryId?: string): Promise<Question[]> {
  const url = new URL(`${API_BASE_URL}/faq/questions`)
  if (categoryId) {
    url.searchParams.append('category_id', categoryId)
  }
  const response = await fetch(url)
  return handleResponse<Question[]>(response)
}

export async function createQuestion(questionData: Omit<Question, '_id'>): Promise<Question> {
  const response = await fetch(`${API_BASE_URL}/faq/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(questionData),
  })
  return handleResponse<Question>(response)
}

export async function updateQuestion(
  questionId: string,
  questionData: Partial<Omit<Question, '_id'>>
): Promise<Question> {
  const response = await fetch(`${API_BASE_URL}/faq/questions/${questionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(questionData),
  })
  return handleResponse<Question>(response)
}

export async function deleteQuestion(questionId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/faq/questions/${questionId}`, {
    method: 'DELETE',
  })
  await handleResponse<void>(response)
}

