<template>
  <div v-if="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
    <!-- Total -->
    <div class="bg-white rounded-lg shadow-md p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-500 text-sm">Total</p>
          <p class="text-2xl font-bold text-gray-800">{{ stats.total }}</p>
        </div>
        <div class="bg-blue-100 p-3 rounded-lg">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Completadas -->
    <div class="bg-white rounded-lg shadow-md p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-500 text-sm">Completadas</p>
          <p class="text-2xl font-bold text-green-600">{{ stats.completed }}</p>
        </div>
        <div class="bg-green-100 p-3 rounded-lg">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Pendientes -->
    <div class="bg-white rounded-lg shadow-md p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-500 text-sm">Pendientes</p>
          <p class="text-2xl font-bold text-orange-600">{{ stats.pending }}</p>
        </div>
        <div class="bg-orange-100 p-3 rounded-lg">
          <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Prioridad Alta -->
    <div class="bg-white rounded-lg shadow-md p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-500 text-sm">Alta Prioridad</p>
          <p class="text-2xl font-bold text-red-600">{{ stats.byPriority.high }}</p>
        </div>
        <div class="bg-red-100 p-3 rounded-lg">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Progreso -->
    <div class="bg-white rounded-lg shadow-md p-4">
      <div class="flex items-center justify-between mb-2">
        <div>
          <p class="text-gray-500 text-sm">Progreso</p>
          <p class="text-2xl font-bold text-purple-600">{{ progressPercentage }}%</p>
        </div>
        <div class="bg-purple-100 p-3 rounded-lg">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-purple-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${progressPercentage}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TodoStats } from '@/types'

interface Props {
  stats: TodoStats | null
}

const props = defineProps<Props>()

const progressPercentage = computed(() => {
  if (!props.stats || props.stats.total === 0) return 0
  return Math.round((props.stats.completed / props.stats.total) * 100)
})
</script>

