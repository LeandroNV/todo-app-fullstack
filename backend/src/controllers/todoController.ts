import { Request, Response } from 'express'
import { Todo } from '../models/Todo.js'
import type { TodoStats } from '../types/index.js'

// GET /api/todos - Obtener todas las tareas (con filtros opcionales)
export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, priority } = req.query

    const filter: Record<string, unknown> = {}

    if (status === 'completed') {
      filter.completed = true
    } else if (status === 'pending') {
      filter.completed = false
    }

    if (priority && ['low', 'medium', 'high'].includes(priority as string)) {
      filter.priority = priority
    }

    const todos = await Todo.find(filter).sort({ createdAt: -1 })

    res.json(todos)
  } catch (error) {
    console.error('Error al obtener tareas:', error)
    res.status(500).json({ message: 'Error al obtener las tareas' })
  }
}

// GET /api/todos/:id - Obtener una tarea por ID
export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const todo = await Todo.findById(id)

    if (!todo) {
      res.status(404).json({ message: 'Tarea no encontrada' })
      return
    }

    res.json(todo)
  } catch (error) {
    console.error('Error al obtener tarea:', error)
    res.status(500).json({ message: 'Error al obtener la tarea' })
  }
}

// POST /api/todos - Crear una nueva tarea
export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, completed, priority, dueDate, tags } = req.body

    if (!title || title.trim() === '') {
      res.status(400).json({ message: 'El título es obligatorio' })
      return
    }

    const todo = new Todo({
      title: title.trim(),
      description: description?.trim() || '',
      completed: completed || false,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      tags: tags || [],
    })

    await todo.save()

    res.status(201).json(todo)
  } catch (error) {
    console.error('Error al crear tarea:', error)
    res.status(500).json({ message: 'Error al crear la tarea' })
  }
}

// PUT /api/todos/:id - Actualizar una tarea completa
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { title, description, completed, priority, dueDate, tags } = req.body

    if (title !== undefined && (!title || title.trim() === '')) {
      res.status(400).json({ message: 'El título no puede estar vacío' })
      return
    }

    const todo = await Todo.findByIdAndUpdate(
      id,
      {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(completed !== undefined && { completed }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate }),
        ...(tags !== undefined && { tags }),
      },
      { new: true, runValidators: true },
    )

    if (!todo) {
      res.status(404).json({ message: 'Tarea no encontrada' })
      return
    }

    res.json(todo)
  } catch (error) {
    console.error('Error al actualizar tarea:', error)
    res.status(500).json({ message: 'Error al actualizar la tarea' })
  }
}

// PATCH /api/todos/:id/toggle - Cambiar el estado de completado
export const toggleTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const todo = await Todo.findById(id)

    if (!todo) {
      res.status(404).json({ message: 'Tarea no encontrada' })
      return
    }

    todo.completed = !todo.completed
    await todo.save()

    res.json(todo)
  } catch (error) {
    console.error('Error al cambiar estado de tarea:', error)
    res.status(500).json({ message: 'Error al cambiar el estado de la tarea' })
  }
}

// DELETE /api/todos/:id - Eliminar una tarea
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const todo = await Todo.findByIdAndDelete(id)

    if (!todo) {
      res.status(404).json({ message: 'Tarea no encontrada' })
      return
    }

    res.json({ message: 'Tarea eliminada correctamente' })
  } catch (error) {
    console.error('Error al eliminar tarea:', error)
    res.status(500).json({ message: 'Error al eliminar la tarea' })
  }
}

// GET /api/stats - Obtener estadísticas de las tareas
export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const total = await Todo.countDocuments()
    const completed = await Todo.countDocuments({ completed: true })
    const pending = await Todo.countDocuments({ completed: false })
    const highPriority = await Todo.countDocuments({ priority: 'high' })
    const mediumPriority = await Todo.countDocuments({ priority: 'medium' })
    const lowPriority = await Todo.countDocuments({ priority: 'low' })

    const stats: TodoStats = {
      total,
      completed,
      pending,
      byPriority: {
        high: highPriority,
        medium: mediumPriority,
        low: lowPriority,
      },
    }

    res.json(stats)
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    res.status(500).json({ message: 'Error al obtener las estadísticas' })
  }
}

