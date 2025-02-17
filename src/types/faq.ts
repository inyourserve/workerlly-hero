export interface Category {
    _id: string
    name: string
    role: 'seeker' | 'provider'
  }
  
  export interface Question {
    _id: string
    category_id: string
    question: string
    answer: string
  }
  
  