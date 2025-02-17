import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Category } from '@/types/faq'
import { deleteCategory } from '@/api/faqApi'

interface CategoryListProps {
  categories: Category[]
  onCategoryDeleted: () => void
}

export function CategoryList({ categories, onCategoryDeleted }: CategoryListProps) {
  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(categoryId)
      onCategoryDeleted()
    }
  }

  return (
    <ul className="space-y-2">
      {categories.map((category) => (
        <li 
          key={category._id} 
          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="font-medium">
            {category.name} 
            <span className="text-gray-500 text-sm ml-1">
              ({category.role})
            </span>
          </span>
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleDeleteCategory(category._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  )
}

