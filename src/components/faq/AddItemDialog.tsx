import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Category } from '@/types/faq'
import { createCategory, createQuestion } from '@/api/faqApi'

interface AddItemDialogProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  onCategoryAdded: () => void
  onQuestionAdded: () => void
}

export function AddItemDialog({
  isOpen,
  onClose,
  categories,
  onCategoryAdded,
  onQuestionAdded,
}: AddItemDialogProps) {
  const [activeTab, setActiveTab] = useState('category')
  const [categoryName, setCategoryName] = useState('')
  const [categoryRole, setCategoryRole] = useState<'seeker' | 'provider'>('seeker')
  const [questionCategory, setQuestionCategory] = useState('')
  const [questionText, setQuestionText] = useState('')
  const [answerText, setAnswerText] = useState('')

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    await createCategory({ name: categoryName, role: categoryRole })
    onCategoryAdded()
    resetForm()
    onClose()
  }

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    await createQuestion({
      category_id: questionCategory,
      question: questionText,
      answer: answerText,
    })
    onQuestionAdded()
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setCategoryName('')
    setCategoryRole('seeker')
    setQuestionCategory('')
    setQuestionText('')
    setAnswerText('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="category">Category</TabsTrigger>
            <TabsTrigger value="question">Question</TabsTrigger>
          </TabsList>
          <TabsContent value="category">
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryRole">Role</Label>
                <Select value={categoryRole} onValueChange={(value: string) => {
                  if (value === 'seeker' || value === 'provider') {
                    setCategoryRole(value)
                  }
                }}>
                  <SelectTrigger id="categoryRole">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seeker">Seeker</SelectItem>
                    <SelectItem value="provider">Provider</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Create Category</Button>
            </form>
          </TabsContent>
          <TabsContent value="question">
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="questionCategory">Category</Label>
                <Select value={questionCategory} onValueChange={setQuestionCategory}>
                  <SelectTrigger id="questionCategory">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name} ({category.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="questionText">Question</Label>
                <Input
                  id="questionText"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answerText">Answer</Label>
                <Textarea
                  id="answerText"
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  required
                />
              </div>
              <Button type="submit">Create Question</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

