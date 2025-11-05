import mongoose, { Schema } from 'mongoose'
import type { ITodo } from '../types/index.js'

const TodoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      maxlength: [200, 'El título no puede tener más de 200 caracteres'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'La descripción no puede tener más de 1000 caracteres'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

// Índices para mejorar el rendimiento
TodoSchema.index({ completed: 1 })
TodoSchema.index({ priority: 1 })
TodoSchema.index({ createdAt: -1 })
TodoSchema.index({ tags: 1 })

export const Todo = mongoose.model<ITodo>('Todo', TodoSchema)

