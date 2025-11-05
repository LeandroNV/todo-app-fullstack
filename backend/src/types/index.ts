import { Document } from 'mongoose'

export interface ITodo extends Document {
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate: Date | null
  tags: string[]
  createdAt: Date
  updatedAt: Date
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

