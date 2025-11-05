import type { Todo, TodoStats } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error desconocido' }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Todos endpoints
  async getTodos(filters?: { status?: string; priority?: string }): Promise<Todo[]> {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.priority) params.append('priority', filters.priority)

    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request<Todo[]>(`/todos${query}`)
  }

  async getTodoById(id: string): Promise<Todo> {
    return this.request<Todo>(`/todos/${id}`)
  }

  async createTodo(todo: Omit<Todo, '_id' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
    return this.request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
    })
  }

  async updateTodo(id: string, todo: Partial<Todo>): Promise<Todo> {
    return this.request<Todo>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(todo),
    })
  }

  async toggleTodo(id: string): Promise<Todo> {
    return this.request<Todo>(`/todos/${id}/toggle`, {
      method: 'PATCH',
    })
  }

  async deleteTodo(id: string): Promise<void> {
    return this.request<void>(`/todos/${id}`, {
      method: 'DELETE',
    })
  }

  async getStats(): Promise<TodoStats> {
    return this.request<TodoStats>('/stats')
  }
}

export const api = new ApiService()

