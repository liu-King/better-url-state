<template>
  <div class="home">
    <h1>🚀 vue-url-state 演示</h1>
    <p class="subtitle">一个简单、强大的 Vue 3 URL 状态管理 Hook</p>

    <div class="url-box">
      <h3>当前 URL</h3>
      <code>{{ currentUrl }}</code>
    </div>

    <div class="features">
      <div class="feature-card">
        <h3>✨ 特性</h3>
        <ul>
          <li>自动同步状态到 URL</li>
          <li>刷新页面不丢失状态</li>
          <li>通过链接复现场景</li>
          <li>完整的 TypeScript 支持</li>
          <li>比 nuqs 更简洁的 API</li>
        </ul>
      </div>

      <div class="feature-card">
        <h3>📝 快速开始</h3>
        <pre><code>import { useUrlState } from '@liucm/better-url-state'

const [filters, setFilters] = useUrlState('filters', {
  status: 'active',
  page: 1
})</code></pre>
      </div>
    </div>

    <div class="demo-section">
      <h2>🎮 交互演示</h2>

      <div class="control-group">
        <h3>标签页切换 (useUrlParam)</h3>
        <div class="tabs">
          <button
            v-for="t in tabs"
            :key="t"
            :class="{ active: tab.value === t }"
            @click="setTab(t)"
          >
            {{ t }}
          </button>
        </div>
        <p>当前选中: <strong>{{ tab.value }}</strong></p>
      </div>

      <div class="control-group">
        <h3>搜索 (useUrlParam)</h3>
        <div class="search-box">
          <input
            v-model="searchInput"
            @input="handleSearch"
            placeholder="输入搜索内容..."
          />
          <button @click="setSearch('')">清空</button>
        </div>
        <p v-if="search.value">搜索结果: <strong>{{ search.value }}</strong></p>
      </div>

      <div class="control-group">
        <h3>复杂状态 (useUrlState)</h3>
        <div class="filters">
          <label>
            状态:
            <select :value="config.status" @change="setConfig({ status: $event.target.value })">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </label>

          <label>
            排序:
            <select :value="config.sort" @change="setConfig({ sort: $event.target.value })">
              <option value="date">日期</option>
              <option value="name">名称</option>
              <option value="priority">优先级</option>
            </select>
          </label>

          <label class="checkbox">
            <input
              type="checkbox"
              :checked="config.descending"
              @change="setConfig({ descending: $event.target.checked })"
            />
            降序排列
          </label>
        </div>

        <div class="state-preview">
          <h4>当前状态:</h4>
          <pre>{{ JSON.stringify(config, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <div class="tips">
      <h3>💡 测试提示</h3>
      <ol>
        <li>修改上面的状态，观察 URL 的变化</li>
        <li>复制当前 URL，在新标签页打开</li>
        <li>刷新页面，所有状态保持不变</li>
        <li>使用浏览器的前进/后退按钮，状态会同步更新</li>
        <li>切换到"列表演示"和"设置演示"页面查看更多用法</li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUrlState, useUrlParam } from '@liucm/better-url-state'

// 使用 useUrlParam 管理简单状态
const [tab, setTab] = useUrlParam('tab', 'all')
const [search, setSearch] = useUrlParam('search', '')

// 使用 useUrlState 管理复杂对象状态
const [config, setConfig, , currentUrl] = useUrlState('config', {
  status: 'active',
  sort: 'date',
  descending: true
})

const tabs = ['all', 'active', 'completed', 'archived']
const searchInput = computed({
  get: () => search.value,
  set: (val) => setSearch(val)
})

// 防抖处理搜索输入
let timeout
const handleSearch = (e) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    setSearch(e.target.value)
  }, 300)
}
</script>

<style scoped>
.home {
  max-width: 800px;
}

h1 {
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  margin-bottom: 25px;
}

.url-box {
  background: #1e1e1e;
  color: #4ec9b0;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 25px;
}

.url-box h3 {
  color: #fff;
  margin-bottom: 10px;
  font-size: 14px;
}

.url-box code {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  word-break: break-all;
}

.features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.feature-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.feature-card h3 {
  margin-bottom: 15px;
  color: #333;
}

.feature-card ul {
  padding-left: 20px;
}

.feature-card li {
  margin: 8px 0;
  color: #555;
}

.feature-card pre {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 13px;
}

.demo-section {
  margin: 30px 0;
}

.demo-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.control-group {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.control-group h3 {
  margin-bottom: 15px;
  color: #444;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.tabs button {
  padding: 8px 20px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.tabs button:hover {
  background: #f0f0f0;
}

.tabs button.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.search-box input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.search-box button {
  padding: 10px 20px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.filters {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.filters label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filters select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.filters .checkbox {
  cursor: pointer;
}

.state-preview {
  margin-top: 20px;
  padding: 15px;
  background: #e3f2fd;
  border-radius: 6px;
}

.state-preview h4 {
  margin-bottom: 10px;
  color: #1976d2;
}

.state-preview pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.tips {
  background: #fff3e0;
  padding: 20px;
  border-radius: 8px;
  margin-top: 30px;
}

.tips h3 {
  margin-bottom: 15px;
  color: #e65100;
}

.tips ol {
  padding-left: 20px;
}

.tips li {
  margin: 10px 0;
  color: #555;
}

@media (max-width: 600px) {
  .features {
    grid-template-columns: 1fr;
  }

  .filters {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
