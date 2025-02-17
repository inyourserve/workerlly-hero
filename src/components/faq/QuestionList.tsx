import { Trash2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Category, Question } from '@/types/faq'
import { deleteQuestion } from '@/api/faqApi'

interface QuestionListProps {
  categories: Category[]
  questions: Question[]
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  onQuestionDeleted: () => void
}

export function QuestionList({
  categories,
  questions,
  selectedCategory,
  onCategoryChange,
  onQuestionDeleted,
}: QuestionListProps) {
  const handleDeleteQuestion = async (questionId: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      await deleteQuestion(questionId)
      onQuestionDeleted()
    }
  }

  return (
    <div className="space-y-4">
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category" />
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category._id} value={category._id}>
              {category.name} ({category.role})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <ul className="space-y-4">
        {questions.map((question) => (
          <li key={question._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Q: {question.question}</h3>
                <p className="text-gray-600">A: {question.answer}</p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => handleDeleteQuestion(question._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

