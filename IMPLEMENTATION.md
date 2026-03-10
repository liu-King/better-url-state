# @liucm/better-url-state 实现原理解析

## 概述

`@liucm/better-url-state` 是一个 Vue 3 的 URL 状态管理 Hook，它将组件状态同步到 URL 查询参数中，实现：
- 刷新页面状态不丢失
- 通过 URL 分享特定状态
- 浏览器前进/后退同步状态

---

## 核心架构

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Vue Component │────▶│  useUrlState │────▶│   URL Query     │
│                 │◀────│              │◀────│                 │
└─────────────────┘     └──────────────┘     └─────────────────┘
        │                                            │
        │              ┌──────────────┐              │
        └─────────────▶│  Vue Ref     │◀─────────────┘
                       └──────────────┘
```

---

## 1. 序列化系统 (Serialization)

### 1.1 格式设计

采用 `key:type:value` 的格式，支持多种数据类型：

```typescript
// 字符串: key:str:encodedValue
theme:str:dark

// 数字: key:num:value
fontSize:num:14

// 布尔: key:bool:value
active:bool:true

// 嵌套对象: key:json:base64EncodedJson
notifications:json:JTdCJTIyZW1haWwlMjIlM0F0cnVlJTdE
```

### 1.2 实现逻辑

```typescript
function serialize<T extends Record<string, any>>(state: T): string {
  const parts: string[] = []

  for (const [key, value] of Object.entries(state)) {
    if (value === undefined || value === null) continue

    if (typeof value === 'object' && !Array.isArray(value)) {
      // 嵌套对象 → JSON → Base64
      const jsonStr = JSON.stringify(value)
      parts.push(`${key}:json:${safeBtoa(encodeURIComponent(jsonStr))}`)
    } else if (typeof value === 'boolean') {
      parts.push(`${key}:bool:${value}`)
    } else if (typeof value === 'number') {
      parts.push(`${key}:num:${value}`)
    } else {
      parts.push(`${key}:str:${encodeURIComponent(String(value))}`)
    }
  }

  return parts.join(',')
}
```

### 1.3 为什么用 Base64？

1. **避免特殊字符冲突** - URL 中的 `&`, `=`, `?` 等字符会干扰查询参数解析
2. **保留 JSON 结构** - 嵌套对象的逗号不会被误解析为字段分隔符
3. **URL 安全** - Base64 输出只包含 `A-Z a-z 0-9 + / =`，都是 URL 安全字符

---

## 2. 反序列化系统 (Deserialization)

### 2.1 智能分割

使用正则表达式处理嵌套对象中的逗号：

```typescript
// 正则匹配逗号，但忽略 JSON 内部的逗号
const parts = str.split(/,(?=[^:]*:)/)

// 示例:
// "a:str:1,b:json:{"x":1,"y":2}" 会被正确分割为:
// ["a:str:1", "b:json:{"x":1,"y":2}"]
```

### 2.2 类型还原

```typescript
function deserialize<T extends Record<string, any>>(str: string): T {
  const parts = str.split(/,(?=[^:]*:)/)

  for (const part of parts) {
    const firstColon = part.indexOf(':')
    const key = part.slice(0, firstColon)
    const rest = part.slice(firstColon + 1)

    if (rest.startsWith('json:')) {
      // Base64 → decodeURIComponent → JSON.parse
      const base64 = rest.slice(5)
      const jsonStr = decodeURIComponent(safeAtob(base64))
      result[key] = JSON.parse(jsonStr)
    } else if (rest.startsWith('bool:')) {
      result[key] = rest.slice(5) === 'true'
    } else if (rest.startsWith('num:')) {
      result[key] = parseFloat(rest.slice(4))
    } else if (rest.startsWith('str:')) {
      result[key] = decodeURIComponent(rest.slice(4))
    }
  }
}
```

---

## 3. 深度合并 (Deep Merge)

### 3.1 问题背景

浅合并会导致嵌套对象被完全覆盖：

```typescript
// 浅合并 ❌
const defaults = { notifications: { email: true, push: false } }
const urlState = { notifications: { email: false } }
{ ...defaults, ...urlState }
// → { notifications: { email: false } }  // push 丢失了！

// 深度合并 ✅
deepMerge(defaults, urlState)
// → { notifications: { email: false, push: false } }  // push 保留
```

### 3.2 递归实现

```typescript
function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target }

  for (const key in source) {
    if (source[key] !== undefined && source[key] !== null) {
      if (
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        typeof result[key] === 'object' &&
        !Array.isArray(result[key])
      ) {
        // 递归合并嵌套对象
        result[key] = deepMerge(result[key], source[key])
      } else {
        result[key] = source[key] as any
      }
    }
  }

  return result
}
```

---

## 4. 核心 Hook 实现

### 4.1 useUrlState 流程图

```
初始化
  │
  ▼
┌─────────────────────┐
│  getStateFromUrl()  │
│  ─────────────────  │
│  1. 读取 URL 参数   │
│  2. 反序列化        │
│  3. 深度合并默认值  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   ref(initialState) │  ← Vue 响应式状态
└─────────┬───────────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
更新状态    监听URL变化
(setState)  (popstate)
    │           │
    ▼           ▼
┌─────────┐  ┌─────────────┐
│1. 深度合 │  │1. 重新读取URL│
│  并新值  │  │2. 反序列化   │
│2. 更新ref │  │3. 更新ref   │
│3. 序列化  │  └─────────────┘
│4. 更新URL │
└─────────┘
```

### 4.2 关键代码

```typescript
export function useUrlState<T extends Record<string, any>>(
  key: string,                    // URL 参数名
  defaultValue: T                // 默认值
): [Ref<T>, setState, resetState] {

  // ===== 初始化：从 URL 读取状态 =====
  const getStateFromUrl = (): T => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlValue = urlParams.get(key) || ''
    const urlState = deserialize<Partial<T>>(urlValue)
    return mergeState(defaultValue, urlState)  // 深度合并
  }

  // 创建响应式状态
  const state = ref<T>(getStateFromUrl())

  // ===== 更新 URL =====
  const updateUrl = (newState: T) => {
    const serialized = serialize(newState)
    const url = new URL(window.location.href)

    if (serialized) {
      url.searchParams.set(key, serialized)
    } else {
      url.searchParams.delete(key)
    }

    window.history.pushState({}, '', url.toString())
  }

  // ===== 设置状态 =====
  const setState = (value: Partial<T> | ((prev: T) => Partial<T>)) => {
    const partialValue = typeof value === 'function'
      ? value(state.value)
      : value

    // 深度合并，不是简单替换
    const newState = deepMerge(state.value, partialValue)

    state.value = newState
    updateUrl(newState)
  }

  // ===== 监听浏览器前进/后退 =====
  const handlePopState = () => {
    state.value = getStateFromUrl()
  }

  onMounted(() => {
    window.addEventListener('popstate', handlePopState)
  })

  onUnmounted(() => {
    window.removeEventListener('popstate', handlePopState)
  })

  return [state, setState, resetState]
}
```

---

## 5. useUrlParam 简化版

### 5.1 设计思路

`useUrlParam` 是对 `useUrlState` 的包装，用于管理单值状态（如字符串、数字）：

```typescript
// 使用 useUrlState
const [state, setState] = useUrlState('tab', { value: 'home' })
state.value.value  // 需要两层 .value

// 使用 useUrlParam（简化）
const [tab, setTab] = useUrlParam('tab', 'home')
tab.value          // 直接获取值
```

### 5.2 实现方式

```typescript
export function useUrlParam<T = string>(
  key: string,
  defaultValue: T
): [Ref<T>, setState, resetState] {

  // 内部使用 useUrlState，包装成单值对象
  const [stateObj, setStateObj, resetObj] = useUrlState(key, { _v: defaultValue })

  // 创建 getter，代理到内部对象的 _v 属性
  const state = {
    get value() {
      return stateObj.value._v
    },
    set value(v: T) {
      // 只读
    }
  } as Ref<T>

  const setState = (value: T | ((prev: T) => T)) => {
    const newValue = typeof value === 'function'
      ? value(stateObj.value._v)
      : value
    setStateObj({ _v: newValue })
  }

  return [state, setState, resetState]
}
```

---

## 6. 完整数据流

### 6.1 用户操作 → URL 更新

```
用户点击 "下一页"
    │
    ▼
setFilters({ page: 2 })
    │
    ▼
deepMerge(currentState, { page: 2 })
    │
    ▼
state.value = newState  ← Vue 响应式更新 UI
    │
    ▼
serialize(newState)
    │
    ▼
window.history.pushState({}, '', newUrl)
    │
    ▼
URL 更新: /list?filters=page:num:2,...
```

### 6.2 URL 变化 → UI 更新

```
用户点击浏览器后退
    │
    ▼
popstate 事件触发
    │
    ▼
handlePopState()
    │
    ▼
getStateFromUrl()
    │
    ▼
deserialize(urlParam)
    │
    ▼
state.value = restoredState  ← Vue 响应式更新 UI
```

### 6.3 新标签页打开 URL

```
打开带参 URL: /list?filters=page:num:2,category:str:tech
    │
    ▼
useUrlState 初始化
    │
    ▼
getStateFromUrl()
    │
    ▼
deserialize('page:num:2,category:str:tech')
    │
    ▼
{ page: 2, category: 'tech' }
    │
    ▼
mergeState(defaults, urlState)  ← 深度合并
    │
    ▼
state.value = mergedState  ← 初始状态即恢复
```

---

## 7. 关键设计决策

### 7.1 为什么选择 Base64 而不是 encodeURIComponent？

| 方案 | 问题 |
|------|------|
| `encodeURIComponent(JSON.stringify(obj))` | JSON 中的 `&` 会被解释为查询参数分隔符 |
| `btoa(JSON.stringify(obj))` | 安全，Base64 只有 URL 安全字符 |

### 7.2 为什么使用 pushState 而不是 hash？

- **pushState**: URL 美观 `/list?page=1`，服务端可解析
- **hash**: URL 丑陋 `/list#page=1`，服务端收不到 hash

### 7.3 为什么需要深度合并？

Vue 应用常见嵌套状态结构：

```typescript
const filters = {
  pagination: { page: 1, pageSize: 10 },
  sort: { field: 'date', order: 'desc' },
  filters: { status: 'active', category: null }
}
```

用户只修改 `page` 时，不希望 `pageSize`, `sort`, `filters` 丢失。

---

## 8. 使用示例

### 8.1 基础用法

```vue
<script setup>
import { useUrlState, useUrlParam } from 'vue-url-state'

// 单值状态
const [search, setSearch] = useUrlParam('search', '')

// 复杂对象
const [filters, setFilters, resetFilters] = useUrlState('filters', {
  page: 1,
  pageSize: 10,
  sortBy: 'date'
})
</script>

<template>
  <!-- 单值直接绑定 -->
  <input :value="search.value" @input="setSearch($event.target.value)" />

  <!-- 复杂对象部分更新 -->
  <button @click="setFilters({ page: filters.value.page + 1 })">
    下一页
  </button>

  <!-- 重置 -->
  <button @click="resetFilters()">重置</button>
</template>
```

### 8.2 URL 效果

| 操作 | URL 结果 |
|------|----------|
| 初始 | `/list` |
| 搜索 "vue" | `/list?search:str:vue` |
| 第2页 | `/list?filters=page:num:2` |
| 综合 | `/list?search:str:vue&filters=page:num:2,sortBy:str:name` |

---

## 9. 总结

`vue-url-state` 通过以下技术实现 URL 状态管理：

1. **类型安全的序列化** - 支持字符串、数字、布尔、嵌套对象
2. **深度合并** - 部分更新时保持其他字段不变
3. **双向同步** - 状态变化更新 URL，URL 变化更新状态
4. **Vue 响应式集成** - 使用 ref 和生命周期钩子
5. **浏览器兼容** - 支持 SSR、前进后退、新标签页打开
