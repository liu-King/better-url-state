<template>
  <div class="container">
    <h1>函数式更新示例</h1>
    <p>URL: {{ currentUrl }}</p>

    <div class="section">
      <h2>计数器</h2>
      <div class="counter">
        <button @click="decrement">-1</button>
        <span class="count">{{ counter.count }}</span>
        <button @click="increment">+1</button>
        <button @click="incrementBy5">+5</button>
        <button @click="double">×2</button>
      </div>
      <div class="display">
        <pre>{{ JSON.stringify(counter, null, 2) }}</pre>
      </div>
    </div>

    <div class="section">
      <h2>页码控制</h2>
      <div class="pagination">
        <button @click="goToFirst">首页</button>
        <button @click="goToPrev">上一页</button>
        <span class="page-info">第 {{ pagination.page }} 页</span>
        <button @click="goToNext">下一页</button>
        <button @click="goToLast">末页</button>
      </div>
      <div class="display">
        <pre>{{ JSON.stringify(pagination, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUrlState } from '../src/index'
import { computed } from 'vue'

const [counter, setCounter] = useUrlState('counter', {
  count: 0
})

const [pagination, setPagination] = useUrlState('pagination', {
  page: 1,
  pageSize: 10,
  total: 100
})

const currentUrl = computed(() => window.location.href)

function increment() {
  setCounter(prev => ({
    count: prev.count + 1
  }))
}

function decrement() {
  setCounter(prev => ({
    count: prev.count - 1
  }))
}

function incrementBy5() {
  setCounter(prev => ({
    count: prev.count + 5
  }))
}

function double() {
  setCounter(prev => ({
    count: prev.count * 2
  }))
}

function goToFirst() {
  setPagination({ page: 1 })
}

function goToPrev() {
  setPagination(prev => ({
    page: Math.max(1, prev.page - 1)
  }))
}

function goToNext() {
  setPagination(prev => ({
    page: Math.min(Math.ceil(prev.total / prev.pageSize), prev.page + 1)
  }))
}

function goToLast() {
  setPagination(prev => ({
    page: Math.ceil(prev.total / prev.pageSize)
  }))
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

.counter, .pagination {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 0;
}

.count, .page-info {
  font-size: 1.2em;
  font-weight: bold;
  padding: 0 15px;
}

button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}

button:hover {
  background: #f0f0f0;
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
