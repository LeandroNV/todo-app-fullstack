import { Router } from 'express'
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  getStats,
} from '../controllers/todoController.js'

const router = Router()

// Rutas de estadísticas
router.get('/stats', getStats)

// Rutas de todos
router.get('/todos', getTodos)
router.get('/todos/:id', getTodoById)
router.post('/todos', createTodo)
router.put('/todos/:id', updateTodo)
router.patch('/todos/:id/toggle', toggleTodo)
router.delete('/todos/:id', deleteTodo)

export default router

