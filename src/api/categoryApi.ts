import Cookies from "js-cookie"
import type { Category, Subcategory } from "@/types/category"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.workerlly.in/api/v1/admin"
// const API_BASE_URL =  "http://127.0.0.1:8000/api/v1/admin"


// Helper function to get auth headers
const getAuthHeaders = (contentType: string = '') => {
  const token = Cookies.get("authToken")
  if (!token) {
    throw new Error("No auth token found")
  }
  
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  }
  if (contentType) {
    headers["Content-Type"] = contentType
  }
  return headers
}

async function handleResponse(response: Response) {
  const contentType = response.headers.get("content-type")
  
  if (!response.ok) {
    let errorMessage = "An error occurred"
    try {
      if (contentType?.includes("application/json")) {
        const errorData = await response.json()
        errorMessage = errorData.detail || errorData.message || "An error occurred"
      } else {
        errorMessage = await response.text()
      }
    } catch (e) {
      console.error("Error parsing error response:", e)
    }
    throw new Error(errorMessage)
  }

  if (contentType?.includes("application/json")) {
    try {
      const jsonData = await response.json()
      return jsonData.data || jsonData
    } catch (e) {
      console.error("Error parsing JSON response:", e)
      throw new Error("Invalid JSON response")
    }
  }
  
  return response.text()
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    console.log('Fetching categories...')
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: getAuthHeaders("application/json")
    })
    const result = await handleResponse(response)
    console.log('Categories fetched:', result)
    return result
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export async function createCategory(categoryData: FormData): Promise<Category> {
  try {
    console.log('Creating category...')
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: categoryData,
    })
    const result = await handleResponse(response)
    console.log('Category created:', result)
    return result
  } catch (error) {
    console.error("Error creating category:", error)
    throw error
  }
}

export async function updateCategory(id: string, categoryData: FormData): Promise<Category> {
  try {
    console.log('=== Updating category ===');
    console.log('Category ID:', id);
    console.log('Form data contents:');
    for (let pair of categoryData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: categoryData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update failed:', errorText);
      throw new Error(errorText);
    }

    const result = await handleResponse(response);
    console.log('Update response:', result);
    return result;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

export async function updateCategoryOrder(id: string, newOrder: number): Promise<Category> {
  try {
    console.log('Updating category order:', { id, newOrder })
    const formData = new FormData()
    formData.append('order', String(newOrder))
    return await updateCategory(id, formData)
  } catch (error) {
    console.error("Error updating category order:", error)
    throw error
  }
}

export async function swapCategoryOrders(
  firstCategoryId: string, 
  secondCategoryId: string
): Promise<void> {
  try {
    console.log('Swapping category orders:', { firstCategoryId, secondCategoryId })
    
    const formData = new FormData()
    formData.append('firstCategoryId', firstCategoryId)
    formData.append('secondCategoryId', secondCategoryId)

    const response = await fetch(`${API_BASE_URL}/categories/swap-order`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData
    })

    const result = await handleResponse(response)
    console.log('Categories swapped:', result)
    return result
  } catch (error) {
    console.error("Error swapping category orders:", error)
    throw error
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    console.log('Deleting category:', id)
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders("application/json")
    })
    const result = await handleResponse(response)
    console.log('Category deleted:', result)
    return result
  } catch (error) {
    console.error("Error deleting category:", error)
    throw error
  }
}

export async function createSubcategory(categoryId: string, subcategoryData: FormData): Promise<Subcategory> {
  try {
    console.log('Creating subcategory for category:', categoryId)
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/subcategories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: subcategoryData,
    })
    const result = await handleResponse(response)
    console.log('Subcategory created:', result)
    return result
  } catch (error) {
    console.error("Error creating subcategory:", error)
    throw error
  }
}

export async function updateSubcategory(
  categoryId: string,
  subcategoryId: string,
  subcategoryData: FormData,
): Promise<Subcategory> {
  try {
    console.log('Updating subcategory:', { categoryId, subcategoryId })
    const response = await fetch(
      `${API_BASE_URL}/categories/${categoryId}/subcategories/${subcategoryId}`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: subcategoryData,
      }
    )
    const result = await handleResponse(response)
    console.log('Subcategory updated:', result)
    return result
  } catch (error) {
    console.error("Error updating subcategory:", error)
    throw error
  }
}

export async function deleteSubcategory(categoryId: string, subcategoryId: string): Promise<void> {
  try {
    console.log('Deleting subcategory:', { categoryId, subcategoryId })
    const response = await fetch(
      `${API_BASE_URL}/categories/${categoryId}/subcategories/${subcategoryId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders("application/json")
      }
    )
    const result = await handleResponse(response)
    console.log('Subcategory deleted:', result)
    return result
  } catch (error) {
    console.error("Error deleting subcategory:", error)
    throw error
  }
}

// Helper function to check if the data is FormData
function isFormData(data: any): data is FormData {
  return data instanceof FormData
}