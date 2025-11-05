<template>
  <div
    class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border-l-4"
    :class="priorityBorderClass"
  >
    <div class="flex items-start gap-4">
      <!-- Checkbox -->
      <button
        @click="$emit('toggle', todo._id!)"
        class="mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
        :class="
          todo.completed
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 hover:border-green-500'
        "
      >
        <svg
          v-if="todo.completed"
          class="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>

      <!-- Contenido -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <h3
            class="text-lg font-semibold text-gray-800 break-words"
            :class="{ 'line-through text-gray-400': todo.completed }"
          >
            {{ todo.title }}
          </h3>

          <!-- Badge de prioridad -->
          <span
            class="flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full"
            :class="priorityBadgeClass"
          >
            {{ priorityText }}
          </span>
        </div>

        <p
          v-if="todo.description"
          class="mt-2 text-gray-600 text-sm break-words"
          :class="{ 'line-through text-gray-400': todo.completed }"
        >
          {{ todo.description }}
        </p>

        <!-- Tags -->
        <div v-if="todo.tags.length > 0" class="flex flex-wrap gap-2 mt-3">
          <span
            v-for="tag in todo.tags"
            :key="tag"
            class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
          >
            #{{ tag }}
          </span>
        </div>

        <!-- Fecha y acciones -->
        <div class="flex items-center justify-between mt-3 text-sm">
          <div class="flex items-center gap-3 text-gray-500">
            <span v-if="todo.dueDate" class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {{ formatDate(todo.dueDate) }}
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ formatDate(todo.createdAt!) }}
            </span>
          </div>

          <!-- Botones de acción -->
          <div class="flex gap-2">
            <button
              @click="$emit('edit', todo)"
              class="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Editar"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              @click="$emit('delete', todo._id!)"
              class="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Eliminar"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Todo } from '@/types'

interface Props {
  todo: Todo
}

const props = defineProps<Props>()

defineEmits<{
  toggle: [id: string]
  edit: [todo: Todo]
  delete: [id: string]
}>()

const priorityBorderClass = computed(() => {
  switch (props.todo.priority) {
    case 'high':
      return 'border-red-500'
    case 'medium':
      return 'border-yellow-500'
    case 'low':
      return 'border-green-500'
    default:
      return 'border-gray-300'
  }
})

const priorityBadgeClass = computed(() => {
  switch (props.todo.priority) {
    case 'high':
      return 'bg-red-100 text-red-700'
    case 'medium':
      return 'bg-yellow-100 text-yellow-700'
    case 'low':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})

const priorityText = computed(() => {
  switch (props.todo.priority) {
    case 'high':
      return 'Alta'
    case 'medium':
      return 'Media'
    case 'low':
      return 'Baja'
    default:
      return ''
  }
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
</script>

