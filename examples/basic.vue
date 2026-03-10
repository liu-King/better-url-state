<template>
  <div class="container">
    <h1>基础示例</h1>

    <div class="section">
      <h2>筛选器状态</h2>
      <p>URL: {{ currentUrl }}</p>

      <div class="controls">
        <label>
          状态:
          <select :value="filters.status" @change="setFilters({ status: $event.target.value })">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="all">All</option>
          </select>
        </label>

        <label>
          页码: {{ filters.page }}
          <button @click="prevPage" :disabled="filters.page <= 1">上一页</button>
          <button @click="nextPage">下一页</button>
        </label>

        <label>
          每页数量:
          <input type="number" :value="filters.limit" @change="setFilters({ limit: Number($event.target.value) })" />
        </label>

        <button @click="resetFilters">重置</button>
      </div>

      <div class="display">
        <pre>{{ JSON.stringify(filters, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUrlState } from '../src/index'
import { computed } from 'vue'

const [filters, setFilters] = useUrlState('filters', {
  status: 'active',
  page: 1,
  limit: 10
})

const currentUrl = computed(() => window.location.href)

function prevPage() {
  setFilters({ page: filters.value.page - 1 })
}

function nextPage() {
  setFilters({ page: filters.value.page + 1 })
}

function resetFilters() {
  setFilters({
    status: 'active',
    page: 1,
    limit: 10
  })
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 20px 0;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.controls button {
  padding: 6px 12px;
  cursor: pointer;
}

.controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.display {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
}

pre {
  margin: 0;
}
</style>
