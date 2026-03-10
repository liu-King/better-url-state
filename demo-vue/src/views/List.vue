<template>
  <div class="list-demo">
    <h1>📋 列表演示</h1>
    <p class="desc">展示分页、筛选等复杂状态管理</p>

    <div class="url-display">
      <code>{{ currentUrl }}</code>
    </div>

    <div class="toolbar">
      <div class="filter-group">
        <label>
          分类:
          <select :value="filters.category" @change="setFilters({ category: $event.target.value, page: 1 })">
            <option value="">全部</option>
            <option value="tech">技术</option>
            <option value="design">设计</option>
            <option value="business">商业</option>
          </select>
        </label>

        <label>
          状态:
          <select :value="filters.status" @change="setFilters({ status: $event.target.value, page: 1 })">
            <option value="all">全部</option>
            <option value="published">已发布</option>
            <option value="draft">草稿</option>
            <option value="archived">已归档</option>
          </select>
        </label>

        <label>
          排序:
          <select :value="filters.sortBy" @change="setFilters({ sortBy: $event.target.value })">
            <option value="newest">最新</option>
            <option value="oldest">最早</option>
            <option value="popular">最热</option>
          </select>
        </label>
      </div>

      <button class="reset-btn" @click="resetFilters">重置筛选</button>
    </div>

    <div class="view-options">
      <label class="checkbox">
        <input
          type="checkbox"
          :checked="view.compact"
          @change="setView({ compact: $event.target.checked })"
        />
        紧凑视图
      </label>

      <label class="checkbox">
        <input
          type="checkbox"
          :checked="view.showImages"
          @change="setView({ showImages: $event.target.checked })"
        />
        显示图片
      </label>
    </div>

    <div class="mock-list" :class="{ compact: view.compact }">
      <div
        v-for="item in mockItems"
        :key="item.id"
        class="list-item"
        :class="{ 'no-image': !view.showImages }"
      >
        <div v-if="view.showImages" class="item-image">📄</div>
        <div class="item-content">
          <h4>{{ item.title }}</h4>
          <p>{{ item.desc }}</p>
          <div class="item-meta">
            <span class="tag" :class="item.category">{{ item.category }}</span>
            <span class="date">{{ item.date }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button
        :disabled="filters.page <= 1"
        @click="setFilters({ page: filters.page - 1 })"
      >
        上一页
      </button>

      <span class="page-info">
        第 {{ filters.page }} 页 / 共 {{ totalPages }} 页
      </span>

      <button
        :disabled="filters.page >= totalPages"
        @click="setFilters({ page: filters.page + 1 })"
      >
        下一页
      </button>

      <select
        :value="filters.pageSize"
        @change="setFilters({ pageSize: Number($event.target.value), page: 1 })"
      >
        <option :value="5">5条/页</option>
        <option :value="10">10条/页</option>
        <option :value="20">20条/页</option>
      </select>
    </div>

    <div class="state-debug">
      <h3>🔧 状态调试</h3>
      <div class="debug-grid">
        <div class="debug-section">
          <h4>filters</h4>
          <pre>{{ JSON.stringify(filters, null, 2) }}</pre>
        </div>
        <div class="debug-section">
          <h4>view</h4>
          <pre>{{ JSON.stringify(view, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUrlState } from '@liucm/better-url-state'

// 筛选器状态
const [filters, setFilters, resetFilters, currentUrl] = useUrlState('filters', {
  category: '',
  status: 'all',
  sortBy: 'newest',
  page: 1,
  pageSize: 10
})

// 视图状态
const [view, setView] = useUrlState('view', {
  compact: false,
  showImages: true
})
const totalPages = computed(() => Math.ceil(50 / filters.value.pageSize))

// 模拟数据
const mockItems = computed(() => {
  const start = (filters.value.page - 1) * filters.value.pageSize
  return Array.from({ length: filters.value.pageSize }, (_, i) => ({
    id: start + i + 1,
    title: `文章标题 ${start + i + 1}`,
    desc: '这是一段示例描述文字，用于展示列表项的内容...',
    category: ['tech', 'design', 'business'][i % 3],
    date: '2024-01-' + String(i + 1).padStart(2, '0')
  }))
})
</script>

<style scoped>
.list-demo {
  max-width: 900px;
}

h1 {
  margin-bottom: 8px;
}

.desc {
  color: #666;
  margin-bottom: 20px;
}

.url-display {
  background: #1e1e1e;
  color: #4ec9b0;
  padding: 12px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  word-break: break-all;
  margin-bottom: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-group label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.reset-btn {
  padding: 8px 16px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.view-options {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.mock-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
}

.list-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s;
}

.list-item:hover {
  background: #e9ecef;
}

.compact .list-item {
  padding: 10px 15px;
}

.compact .item-content p {
  display: none;
}

.item-image {
  width: 60px;
  height: 60px;
  background: #e3f2fd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.no-image .item-image {
  display: none;
}

.item-content {
  flex: 1;
}

.item-content h4 {
  margin-bottom: 8px;
  color: #333;
}

.item-content p {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.item-meta {
  display: flex;
  gap: 15px;
  align-items: center;
}

.tag {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  text-transform: uppercase;
}

.tag.tech {
  background: #e3f2fd;
  color: #1976d2;
}

.tag.design {
  background: #fce4ec;
  color: #c2185b;
}

.tag.business {
  background: #f3e5f5;
  color: #7b1fa2;
}

.date {
  color: #999;
  font-size: 12px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.pagination button {
  padding: 8px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-info {
  font-weight: 500;
}

.pagination select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.state-debug {
  margin-top: 30px;
  padding: 20px;
  background: #fff3e0;
  border-radius: 8px;
}

.state-debug h3 {
  margin-bottom: 15px;
  color: #e65100;
}

.debug-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.debug-section {
  background: white;
  padding: 15px;
  border-radius: 6px;
}

.debug-section h4 {
  margin-bottom: 10px;
  color: #666;
}

.debug-section pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
}

@media (max-width: 600px) {
  .toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-group {
    flex-direction: column;
  }

  .debug-grid {
    grid-template-columns: 1fr;
  }
}
</style>
