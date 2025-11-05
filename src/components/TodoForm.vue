<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">
      {{ editMode ? 'Editar Tarea' : 'Nueva Tarea' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Título -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
          Título *
        </label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Ej: Comprar víveres"
        />
      </div>

      <!-- Descripción -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          v-model="form.description"
          rows="3"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          placeholder="Describe tu tarea..."
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Prioridad -->
        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">
            Prioridad
          </label>
          <select
            id="priority"
            v-model="form.priority"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>

        <!-- Fecha límite -->
        <div>
          <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-1">
            Fecha límite
          </label>
          <input
            id="dueDate"
            v-model="form.dueDate"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <!-- Estado (solo en modo edición) -->
        <div v-if="editMode">
          <label for="completed" class="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="completed"
            v-model="form.completed"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option :value="false">Pendiente</option>
            <option :value="true">Completada</option>
          </select>
        </div>
      </div>

      <!-- Tags -->
      <div>
        <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">
          Etiquetas (separadas por comas)
        </label>
        <input
          id="tags"
          v-model="tagsInput"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Ej: personal, urgente, hogar"
        />
      </div>

      <!-- Botones -->
      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {{ loading ? 'Guardando...' : editMode ? 'Actualizar' : 'Crear Tarea' }}
        </button>
        <button
          v-if="editMode"
          type="button"
          @click="handleCancel"
          class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Todo } from '@/types'

interface Props {
  initialData?: Todo
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialData: undefined,
  loading: false,
})

const emit = defineEmits<{
  submit: [todo: Omit<Todo, '_id' | 'createdAt' | 'updatedAt'>]
  cancel: []
}>()

const editMode = ref(!!props.initialData)

const form = ref({
  title: '',
  description: '',
  completed: false,
  priority: 'medium' as 'low' | 'medium' | 'high',
  dueDate: null as string | null,
  tags: [] as string[],
})

const tagsInput = ref('')

// Inicializar formulario con datos existentes
if (props.initialData) {
  form.value = {
    title: props.initialData.title,
    description: props.initialData.description,
    completed: props.initialData.completed,
    priority: props.initialData.priority,
    dueDate: props.initialData.dueDate,
    tags: [...props.initialData.tags],
  }
  tagsInput.value = props.initialData.tags.join(', ')
}

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      editMode.value = true
      form.value = {
        title: newData.title,
        description: newData.description,
        completed: newData.completed,
        priority: newData.priority,
        dueDate: newData.dueDate,
        tags: [...newData.tags],
      }
      tagsInput.value = newData.tags.join(', ')
    } else {
      editMode.value = false
    }
  },
)

const handleSubmit = () => {
  // Procesar tags
  const tags = tagsInput.value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)

  emit('submit', {
    ...form.value,
    tags,
  })

  // Resetear formulario si no estamos en modo edición
  if (!editMode.value) {
    form.value = {
      title: '',
      description: '',
      completed: false,
      priority: 'medium',
      dueDate: null,
      tags: [],
    }
    tagsInput.value = ''
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>

