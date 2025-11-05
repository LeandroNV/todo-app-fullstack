<template>
  <div class="bg-white rounded-lg shadow-md p-4 mb-6">
    <div class="flex flex-col md:flex-row gap-4">
      <!-- Búsqueda -->
      <div class="flex-1">
        <input
          :value="search"
          @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Buscar tareas..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      <!-- Filtro por estado -->
      <div class="w-full md:w-48">
        <select
          :value="status"
          @change="$emit('update:status', ($event.target as HTMLSelectElement).value)"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="all">Todas</option>
          <option value="pending">Pendientes</option>
          <option value="completed">Completadas</option>
        </select>
      </div>

      <!-- Filtro por prioridad -->
      <div class="w-full md:w-48">
        <select
          :value="priority"
          @change="$emit('update:priority', ($event.target as HTMLSelectElement).value)"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="all">Todas las prioridades</option>
          <option value="high">Alta</option>
          <option value="medium">Media</option>
          <option value="low">Baja</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  search: string
  status: string
  priority: string
}

defineProps<Props>()

defineEmits<{
  'update:search': [value: string]
  'update:status': [value: string]
  'update:priority': [value: string]
}>()
</script>

