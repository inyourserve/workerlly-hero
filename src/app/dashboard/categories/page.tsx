//src/app/dashboard/categories/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { Category, CategoryResponse } from '@/types/category'
import { useToast } from '@/components/ui/use-toast'
import { CategoryItem } from '@/components/CategoryItem'
import * as categoryApi from '@/api/categoryApi'

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newCategory, setNewCategory] = useState<{ name: string; thumbnail: File | null }>({ 
    name: '', 
    thumbnail: null 
  })
  const [newSubcategory, setNewSubcategory] = useState<{ 
    name: string; 
    thumbnail: File | null; 
    categoryId: string 
  }>({
    name: '',
    thumbnail: null,
    categoryId: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = await categoryApi.fetchCategories()
      const data = (response as unknown as CategoryResponse).data || response
      // Sort categories by order
      const sortedData = Array.isArray(data) ? 
        [...data].sort((a, b) => (a.order || Infinity) - (b.order || Infinity)) : 
        []
      setCategories(sortedData)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast({
        title: "Error",
        description: "Failed to fetch categories. Please try again later.",
        variant: "destructive",
      })
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.thumbnail) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData()
    formData.append('name', newCategory.name)
    formData.append('thumbnail', newCategory.thumbnail)
    // Add order for new category
    formData.append('order', String(categories.length + 1))

    try {
      await categoryApi.createCategory(formData)
      await fetchCategories()
      setNewCategory({ name: '', thumbnail: null })
      toast({
        title: "Success",
        description: "Category has been successfully created.",
      })
    } catch (error) {
      console.error('Error adding category:', error)
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCategoryOrder = async (categoryId: string, newOrder: number) => {
    try {
      await categoryApi.updateCategoryOrder(categoryId, newOrder)
      await fetchCategories()
      toast({
        title: "Success",
        description: "Category order updated successfully.",
      })
    } catch (error) {
      console.error('Error updating category order:', error)
      toast({
        title: "Error",
        description: "Failed to update category order. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSwapCategoryOrders = async (firstCategoryId: string, secondCategoryId: string) => {
    try {
      await categoryApi.swapCategoryOrders(firstCategoryId, secondCategoryId)
      await fetchCategories()
      toast({
        title: "Success",
        description: "Category orders swapped successfully.",
      })
    } catch (error) {
      console.error('Error swapping category orders:', error)
      toast({
        title: "Error",
        description: "Failed to swap category orders. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddSubcategory = async () => {
    if (!newSubcategory.name || !newSubcategory.thumbnail || !newSubcategory.categoryId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData()
    formData.append('name', newSubcategory.name)
    formData.append('thumbnail', newSubcategory.thumbnail)

    try {
      await categoryApi.createSubcategory(newSubcategory.categoryId, formData)
      await fetchCategories()
      setNewSubcategory({ name: '', thumbnail: null, categoryId: '' })
      toast({
        title: "Success",
        description: "Subcategory has been successfully created.",
      })
    } catch (error) {
      console.error('Error adding subcategory:', error)
      toast({
        title: "Error",
        description: "Failed to create subcategory. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      await categoryApi.deleteCategory(categoryId)
      await fetchCategories()
      toast({
        title: "Success",
        description: "Category has been successfully deleted.",
      })
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return

    try {
      await categoryApi.deleteSubcategory(categoryId, subcategoryId)
      await fetchCategories()
      toast({
        title: "Success",
        description: "Subcategory has been successfully deleted.",
      })
    } catch (error) {
      console.error('Error deleting subcategory:', error)
      toast({
        title: "Error",
        description: "Failed to delete subcategory. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Category Management</h1>

        <div className="flex gap-4 mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="thumbnail">Thumbnail</Label>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setNewCategory({ ...newCategory, thumbnail: file })
                      }
                    }}
                  />
                </div>
              </div>
              <Button onClick={handleAddCategory}>
                Create Category
              </Button>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Subcategory
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Subcategory</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newSubcategory.categoryId}
                    onValueChange={(value) =>
                      setNewSubcategory({ ...newSubcategory, categoryId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subcategory-name">Subcategory Name</Label>
                  <Input
                    id="subcategory-name"
                    value={newSubcategory.name}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subcategory-thumbnail">Thumbnail</Label>
                  <Input
                    id="subcategory-thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setNewSubcategory({ ...newSubcategory, thumbnail: file })
                      }
                    }}
                  />
                </div>
              </div>
              <Button onClick={handleAddSubcategory}>
                Create Subcategory
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="text-center py-8">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No categories found. Create your first category to get started.
            </div>
          ) : (
            categories.map((category) => (
              <CategoryItem
                key={category._id}
                category={category}
                categories={categories}
                onDelete={handleDeleteCategory}
                onDeleteSubcategory={handleDeleteSubcategory}
                onRefetch={fetchCategories}
                onUpdateOrder={handleUpdateCategoryOrder}
                onSwapOrders={handleSwapCategoryOrders}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}