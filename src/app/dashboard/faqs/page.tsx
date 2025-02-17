'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { CategoryList } from '@/components/faq/CategoryList'
import { QuestionList } from '@/components/faq/QuestionList'
import { AddItemDialog } from '@/components/faq/AddItemDialog'
import { fetchCategories, fetchQuestions } from '@/api/faqApi'
import { Category, Question } from '@/types/faq'

export default function FAQManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      loadQuestions(selectedCategory)
    }
  }, [selectedCategory])

  const loadCategories = async () => {
    const fetchedCategories = await fetchCategories()
    setCategories(fetchedCategories)
  }

  const loadQuestions = async (categoryId: string) => {
    const fetchedQuestions = await fetchQuestions(categoryId)
    setQuestions(fetchedQuestions)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">FAQ Management</h1>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <CategoryList
              categories={categories}
              onCategoryDeleted={loadCategories}
            />
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <QuestionList
              categories={categories}
              questions={questions}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onQuestionDeleted={() => loadQuestions(selectedCategory)}
            />
          </CardContent>
        </Card>
      </div>

      <AddItemDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        categories={categories}
        onCategoryAdded={loadCategories}
        onQuestionAdded={() => loadQuestions(selectedCategory)}
      />
    </div>
  )
}

