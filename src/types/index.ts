export interface Todo {
  _id?: string
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate: string | null
  tags: string[]
  createdAt?: string
  updatedAt?: string
}

export interface TodoStats {
  total: number
  completed: number
  pending: number
  byPriority: {
    low: number
    medium: number
    high: number
  }
}

