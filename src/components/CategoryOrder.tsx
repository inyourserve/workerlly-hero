import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Category } from '@/types/category';
import * as categoryApi from '@/api/categoryApi';

interface CategoryOrderProps {
  category: Category;
  categories: Category[];
  onRefetch: () => Promise<void>;
}

const CategoryOrder: React.FC<CategoryOrderProps> = ({ category, categories, onRefetch }) => {
  const { toast } = useToast();

  const handleMove = async (direction: 'up' | 'down') => {
    try {
      console.log('=== Starting order update ===');
      console.log('Current category:', category);
      console.log('Target direction:', direction);

      // Find adjacent category based on current order
      const currentOrder = category.order || 0;
      const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
      
      const adjacentCategory = categories.find(cat => cat.order === targetOrder);
      
      if (!adjacentCategory) {
        console.log('No adjacent category found');
        return;
      }

      console.log('Adjacent category:', adjacentCategory);

      // Create form data for current category
      const currentFormData = new FormData();
      currentFormData.append('order', String(targetOrder));
      
      // Log FormData contents for debugging
      console.log('Current category form data entries:');
      for (let pair of currentFormData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // Create form data for adjacent category
      const adjacentFormData = new FormData();
      adjacentFormData.append('order', String(currentOrder));
      
      // Log FormData contents for debugging
      console.log('Adjacent category form data entries:');
      for (let pair of adjacentFormData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // Update both categories
      console.log(`Updating current category (${category._id}) order to:`, targetOrder);
      await categoryApi.updateCategory(category._id, currentFormData);

      console.log(`Updating adjacent category (${adjacentCategory._id}) order to:`, currentOrder);
      await categoryApi.updateCategory(adjacentCategory._id, adjacentFormData);

      // Refresh the category list
      await onRefetch();

      toast({
        title: "Success",
        description: "Category order updated successfully",
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update category order",
        variant: "destructive",
      });
    }
  };

  const isFirst = category.order === 1;
  const isLast = category.order === categories.length;

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleMove('up')}
        disabled={isFirst}
        className="p-2"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleMove('down')}
        disabled={isLast}
        className="p-2"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CategoryOrder;