# @liucm/better-url-state

一个简单、强大的 Vue 3 URL 状态管理 Hook。

## 快速开始

```bash
npm install @liucm/better-url-state
```

```vue
<script setup>
import { useUrlState } from '@liucm/better-url-state'

const [filters, setFilters] = useUrlState('filters', {
  status: 'active',
  page: 1
})
</script>

<template>
  <div>
    <select :value="filters.status" @change="setFilters({ status: $event.target.value })">
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
    <p>当前页码: {{ filters.page }}</p>
  </div>
</template>
```

## 特性

- 🚀 简单易用
- 🔗 URL 同步
- 🔄 刷新不丢失
- 📤 可分享链接
- 💪 TypeScript 支持
- 🎯 Vue 3 专用

查看 [README.md](./README.md) 获取完整文档。
