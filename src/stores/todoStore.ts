import { reactive, computed } from 'vue'
import type { Todo, TodoStats } from '@/types'
import { api } from '@/services/api'

interface TodoState {
  todos: Todo[]
  stats: TodoStats | null
  loading: boolean
  error: string | null
  filter: {
    status: string
    priority: string
    search: string
  }
}

const state = reactive<TodoState>({
  todos: [],
  stats: null,
  loading: false,
  error: null,
  filter: {
    status: 'all',
    priority: 'all',
    search: '',
  },
})

export const useTodoStore = () => {
  const filteredTodos = computed(() => {
    let result = state.todos

    // Filtrar por estado
    if (state.filter.status === 'completed') {
      result = result.filter((todo) => todo.completed)
    } else if (state.filter.status === 'pending') {
      result = result.filter((todo) => !todo.completed)
    }

    // Filtrar por prioridad
    if (state.filter.priority !== 'all') {
      result = result.filter((todo) => todo.priority === state.filter.priority)
    }

    // Filtrar por búsqueda
    if (state.filter.search) {
      const search = state.filter.search.toLowerCase()
      result = result.filter(
        (todo) =>
          todo.title.toLowerCase().includes(search) ||
          todo.description.toLowerCase().includes(search) ||
          todo.tags.some((tag) => tag.toLowerCase().includes(search)),
      )
    }

    return result
  })

  const fetchTodos = async () => {
    state.loading = true
    state.error = null
    try {
      const filters: { status?: string; priority?: string } = {}
      if (state.filter.status !== 'all') filters.status = state.filter.status
      if (state.filter.priority !== 'all') filters.priority = state.filter.priority

      state.todos = await api.getTodos(filters)
    } catch (error) {
      state.error = error instanceof Error ? error.message : 'Error al cargar las tareas'
      console.error('Error fetching todos:', error)
    } finally {
      state.loading = false
    }
  }

  const fetchStats = async () => {
    try {
      state.stats = await api.getStats()
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const createTodo = async (todo: Omit<Todo, '_id' | 'createdAt' | 'updatedAt'>) => {
    state.loading = true
    state.error = null
    try {
      const newTodo = await api.createTodo(todo)
      state.todos.unshift(newTodo)
      await fetchStats()
    } catch (error) {
      state.error = error instanceof Error ? error.message : 'Error al crear la tarea'
      throw error
    } finally {
      state.loading = false
    }
  }

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    state.loading = true
    state.error = null
    try {
      const updatedTodo = await api.updateTodo(id, updates)
      const index = state.todos.findIndex((todo) => todo._id === id)
      if (index !== -1) {
        state.todos[index] = updatedTodo
      }
      await fetchStats()
    } catch (error) {
      state.error = error instanceof Error ? error.message : 'Error al actualizar la tarea'
      throw error
    } finally {
      state.loading = false
    }
  }

  const toggleTodo = async (id: string) => {
    try {
      const updatedTodo = await api.toggleTodo(id)
      const index = state.todos.findIndex((todo) => todo._id === id)
      if (index !== -1) {
        state.todos[index] = updatedTodo
      }
      await fetchStats()
    } catch (error) {
      state.error = error instanceof Error ? error.message : 'Error al cambiar el estado'
      throw error
    }
  }

  const deleteTodo = async (id: string) => {
    state.loading = true
    state.error = null
    try {
      await api.deleteTodo(id)
      state.todos = state.todos.filter((todo) => todo._id !== id)
      await fetchStats()
    } catch (error) {
      state.error = error instanceof Error ? error.message : 'Error al eliminar la tarea'
      throw error
    } finally {
      state.loading = false
    }
  }

  const setFilter = (filterType: keyof TodoState['filter'], value: string) => {
    state.filter[filterType] = value
  }

  return {
    state,
    filteredTodos,
    fetchTodos,
    fetchStats,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
  }
}

