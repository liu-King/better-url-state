<template>
  <div class="container">
    <h1>多状态示例</h1>
    <p>URL: {{ currentUrl }}</p>

    <div class="section">
      <h2>标签页切换</h2>
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="{ active: currentTab === tab }"
          @click="setTab(tab)"
        >
          {{ tab }}
        </button>
      </div>
      <div class="tab-content">当前标签: {{ currentTab }}</div>
    </div>

    <div class="section">
      <h2>筛选器</h2>
      <div class="controls">
        <label>
          类型:
          <select :value="filters.type" @change="setFilters({ type: $event.target.value })">
            <option value="">全部</option>
            <option value="article">文章</option>
            <option value="video">视频</option>
            <option value="image">图片</option>
          </select>
        </label>

        <label>
          排序:
          <select :value="filters.sort" @change="setFilters({ sort: $event.target.value })">
            <option value="date">日期</option>
            <option value="popularity">热度</option>
            <option value="title">标题</option>
          </select>
        </label>
      </div>
      <div class="display">
        <pre>{{ JSON.stringify(filters, null, 2) }}</pre>
      </div>
    </div>

    <div class="section">
      <h2>视图设置</h2>
      <div class="controls">
        <label>
          <input
            type="checkbox"
            :checked="viewSettings.showDetails"
            @change="setViewSettings({ showDetails: $event.target.checked })"
          />
          显示详情
        </label>

        <label>
          <input
            type="checkbox"
            :checked="viewSettings.compactMode"
            @change="setViewSettings({ compactMode: $event.target.checked })"
          />
          紧凑模式
        </label>
      </div>
      <div class="display">
        <pre>{{ JSON.stringify(viewSettings, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUrlParam, useUrlState } from '../src/index'
import { computed } from 'vue'

const [currentTab, setTab] = useUrlParam('tab', 'home')
const tabs = ['home', 'about', 'contact']

const [filters, setFilters] = useUrlState('filters', {
  type: '',
  sort: 'date'
})

const [viewSettings, setViewSettings] = useUrlState('view', {
  showDetails: false,
  compactMode: false
})

const currentUrl = computed(() => window.location.href)
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

.tabs {
  display: flex;
  gap: 10px;
}

.tabs button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.tabs button.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.tab-content {
  margin-top: 15px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 4px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 15px 0;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 8px;
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
