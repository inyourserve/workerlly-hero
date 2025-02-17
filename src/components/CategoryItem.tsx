// components/CategoryItem.tsx
import { useState } from 'react'
import { Category, Subcategory } from '@/types/category'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ChevronDown, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import * as categoryApi from '@/api/categoryApi'
import CategoryOrder from './CategoryOrder'  // Add this import

interface CategoryItemProps {
  category: Category
  categories: Category[]
  onDelete: (categoryId: string) => Promise<void>
  onDeleteSubcategory: (categoryId: string, subcategoryId: string) => Promise<void>
  onRefetch: () => Promise<void>
  onUpdateOrder: (categoryId: string, newOrder: number) => Promise<void>
  onSwapOrders: (firstCategoryId: string, secondCategoryId: string) => Promise<void>
}

export function CategoryItem({ 
  category, 
  categories,  // Add this parameter
  onDelete, 
  onDeleteSubcategory, 
  onRefetch 
}: CategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [editData, setEditData] = useState<{
    type: 'category' | 'subcategory'
    id: string
    name: string
  } | null>(null)
  const { toast } = useToast()
  
  const subcategories = category.subcategories?.length ? category.subcategories : category.sub_categories || []
  const AWS_URL = process.env.NEXT_PUBLIC_AWS_URL

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editData) return

    const formData = new FormData(e.currentTarget)
    try {
      if (editData.type === 'category') {
        await categoryApi.updateCategory(editData.id, formData)
      } else {
        await categoryApi.updateSubcategory(category._id, editData.id, formData)
      }
      await onRefetch()
      setEditData(null)
      toast({ title: "Success", description: `${editData.type} updated successfully.` })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update ${editData.type}.`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4">
      <div className="p-4 border-b cursor-pointer hover:bg-gray-50 flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <div className="flex items-center gap-3">
            {category.thumbnail && (
              <img
                src={`${AWS_URL}${category.thumbnail}`}
                alt={category.name}
                className="w-10 h-10 object-cover rounded"
              />
            )}
            <h3 className="font-medium">{category.name}</h3>
          </div>
        </div>
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          <CategoryOrder 
            category={category}
            categories={categories}
            onRefetch={onRefetch}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditData({
              type: 'category',
              id: category._id,
              name: category.name
            })}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(category._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {isExpanded && subcategories.length > 0 && (
        <div className="p-4 space-y-3">
          {subcategories.map((sub) => (
            <div key={sub.id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {sub.thumbnail && (
                  <img
                    src={`${AWS_URL}${sub.thumbnail}`}
                    alt={sub.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                )}
                <span>{sub.name}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditData({
                    type: 'subcategory',
                    id: sub.id,
                    name: sub.name
                  })}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteSubcategory(category._id, sub.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editData && (
        <Dialog open={!!editData} onOpenChange={() => setEditData(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit {editData.type}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editData.name}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="thumbnail">Thumbnail (Optional)</Label>
                  <Input
                    id="thumbnail"
                    name="thumbnail"
                    type="file"
                    accept="image/*"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}