# @liucm/better-url-state

一个简单、强大的 Vue 3 URL 状态管理 Hook。

## 特性

- 🚀 **简单易用** - 比 nuqs 更简洁的 API
- 🔗 **URL 同步** - 自动将状态同步到 URL
- 🔄 **持久化** - 刷新页面不丢失状态
- 📤 **可分享** - 通过链接完美复现场景
- 💪 **TypeScript** - 完整的类型支持
- 🎯 **Vue 3 专用** - 深度集成 Vue 3 和 Vue Router

## 安装

```bash
npm install @liucm/better-url-state
# 或
yarn add @liucm/better-url-state
# 或
pnpm add @liucm/better-url-state
```

## 基础用法

### 对象状态

```vue
<script setup>
import { useUrlState } from '@liucm/better-url-state'

const [filters, setFilters] = useUrlState('filters', {
  status: 'active',
  page: 1,
  limit: 10
})

// 更新状态
function updateStatus(status) {
  setFilters({ status })
}

// 批量更新
function resetFilters() {
  setFilters({
    status: 'active',
    page: 1
  })
}
</script>

<template>
  <div>
    <select :value="filters.status" @change="updateStatus($event.target.value)">
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>

    <p>当前页码: {{ filters.page }}</p>

    <button @click="setFilters({ page: filters.page + 1 })">下一页</button>
  </div>
</template>
```

URL 会变成: `?filters=status:active,page:1,limit:10`

### 单值状态

```vue
<script setup>
import { useUrlParam } from '@liucm/better-url-state'

const [tab, setTab] = useUrlParam('tab', 'home')
const [search, setSearch] = useUrlParam('search', '')
</script>

<template>
  <div>
    <button :class="{ active: tab === 'home' }" @click="setTab('home')">
      Home
    </button>
    <button :class="{ active: tab === 'profile' }" @click="setTab('profile')">
      Profile
    </button>

    <input v-model="search" @input="setSearch($event.target.value)" placeholder="搜索..." />
  </div>
</template>
```

## 高级用法

### 函数式更新

```javascript
// 类似 React setState 的函数式更新
setFilters(prev => ({
  page: prev.page + 1
}))
```

### 复杂类型

```javascript
const [config, setConfig] = useUrlState('config', {
  sort: 'date',
  order: 'desc',
  filters: 'price:100-500' // 嵌套结构可以手动序列化
})
```

## API

### `useUrlState(key, defaultValue)`

返回 `[state, setState]` 的元组。

#### 参数

- `key: string` - URL 参数名
- `defaultValue: T` - 默认值对象

#### 返回值

- `state: Readonly<T>` - 只读状态对象
- `setState: (value: Partial<T> | ((prev: T) => Partial<T>)) => void` - 状态更新函数

### `useUrlParam(key, defaultValue)`

用于单个参数的简化版本。

#### 参数

- `key: string` - URL 参数名
- `defaultValue: T` - 默认值

#### 返回值

- `state: T` - 状态值
- `setState: (value: T | ((prev: T) => T)) => void` - 状态更新函数

## URL 格式

默认 URL 格式为: `?key=field1:value1,field2:value2`

例如:
```javascript
useUrlState('filters', { status: 'active', page: 1, limit: 10 })
// URL: ?filters=status:active,page:1,limit:10
```

## 类型支持

完整支持 TypeScript:

```typescript
interface Filters {
  status: 'active' | 'inactive' | 'all'
  page: number
  limit: number
  search?: string
}

const [filters, setFilters] = useUrlState<Filters>('filters', {
  status: 'active',
  page: 1,
  limit: 10
})

// filters 的类型为 Readonly<Filters>
// setFilters 完整的类型推断
```

## Vue Router 集成

`@liucm/better-url-state` 自动集成 Vue Router:

```javascript
// 在路由组件中使用
import { useUrlState } from '@liucm/better-url-state'

const [state, setState] = useUrlState('key', { /* ... */ })

// 状态变化会自动调用 router.push 更新 URL
```

如果没有使用 Vue Router,`useUrlState` 会回退到使用原生 History API。

## 与 nuqs 对比

| 特性 | @liucm/better-url-state | nuqs |
|------|-------------------------|------|
| Vue 3 集成 | ✅ 原生支持 | ✅ 支持 |
| API 简洁度 | ✅ 元组式 API | ⚠️ 对象式 API |
| TypeScript | ✅ 完整支持 | ✅ 支持 |
| 学习曲线 | ✅ 平缓 | ⚠️ 较陡 |
| 嵌套对象 | ✅ 深度合并支持 | ✅ 支持 |
| URL 格式 | ✅ 紧凑 | ⚠️ 较长 |

## 示例

更多示例请查看 `examples` 目录。

## License

MIT
