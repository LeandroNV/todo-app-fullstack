<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-blue-600 p-2 rounded-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h1 class="text-3xl font-bold text-gray-900">Todo App</h1>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <div
              class="w-3 h-3 rounded-full"
              :class="apiConnected ? 'bg-green-500' : 'bg-red-500'"
            />
            <span>{{ apiConnected ? 'Conectado' : 'Desconectado' }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Error Message -->
      <div
        v-if="store.state.error"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{{ store.state.error }}</span>
        </div>
        <button @click="store.state.error = null" class="text-red-700 hover:text-red-900">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Stats -->
      <TodoStats :stats="store.state.stats" />

      <!-- Filters -->
      <TodoFilters
        v-model:search="store.state.filter.search"
        v-model:status="store.state.filter.status"
        v-model:priority="store.state.filter.priority"
      />

      <!-- Form -->
      <TodoForm
        :initial-data="editingTodo"
        :loading="store.state.loading"
        @submit="handleSubmit"
        @cancel="editingTodo = undefined"
      />

      <!-- Loading State -->
      <div v-if="store.state.loading && store.state.todos.length === 0" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"
        />
        <p class="mt-4 text-gray-600">Cargando tareas...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="store.filteredTodos.value.length === 0"
        class="text-center py-12 bg-white rounded-lg shadow-md"
      >
        <svg
          class="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">
          {{ store.state.todos.length === 0 ? '¡No hay tareas!' : 'No se encontraron tareas' }}
        </h3>
        <p class="text-gray-500">
          {{
            store.state.todos.length === 0
              ? 'Crea tu primera tarea usando el formulario de arriba'
              : 'Intenta cambiar los filtros'
          }}
        </p>
      </div>

      <!-- Todo List -->
      <div v-else class="space-y-4">
        <TodoItem
          v-for="todo in store.filteredTodos.value"
          :key="todo._id"
          :todo="todo"
          @toggle="handleToggle"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </main>

    <!-- Footer -->
    <footer class="mt-12 pb-8 text-center text-gray-600 text-sm">
      <p>Hecho con Vue 3 + Tailwind CSS + Node.js + MongoDB</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import type { Todo } from '@/types'
import TodoForm from '@/components/TodoForm.vue'
import TodoItem from '@/components/TodoItem.vue'
import TodoFilters from '@/components/TodoFilters.vue'
import TodoStats from '@/components/TodoStats.vue'

const store = useTodoStore()
const editingTodo = ref<Todo | undefined>(undefined)
const apiConnected = ref(false)

onMounted(async () => {
  try {
    await store.fetchTodos()
    await store.fetchStats()
    apiConnected.value = true
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error)
    apiConnected.value = false
  }
})

const handleSubmit = async (todoData: Omit<Todo, '_id' | 'createdAt' | 'updatedAt'>) => {
  try {
    if (editingTodo.value) {
      await store.updateTodo(editingTodo.value._id!, todoData)
      editingTodo.value = undefined
    } else {
      await store.createTodo(todoData)
    }
  } catch (error) {
    console.error('Error al guardar tarea:', error)
  }
}

const handleToggle = async (id: string) => {
  try {
    await store.toggleTodo(id)
  } catch (error) {
    console.error('Error al cambiar estado:', error)
  }
}

const handleEdit = (todo: Todo) => {
  editingTodo.value = todo
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleDelete = async (id: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
    try {
      await store.deleteTodo(id)
      if (editingTodo.value?._id === id) {
        editingTodo.value = undefined
      }
    } catch (error) {
      console.error('Error al eliminar tarea:', error)
    }
  }
}
</script>
