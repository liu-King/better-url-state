import { ref, onMounted, onUnmounted, type Ref } from 'vue'

// 安全的 base64 编码（支持 Unicode 和 SSR）
function safeBtoa(str: string): string {
  if (typeof window !== 'undefined' && window.btoa) {
    return window.btoa(str)
  }
  // Node.js 环境或 fallback
  return Buffer.from(str).toString('base64')
}

// 安全的 base64 解码
function safeAtob(str: string): string {
  if (typeof window !== 'undefined' && window.atob) {
    return window.atob(str)
  }
  // Node.js 环境或 fallback
  return Buffer.from(str, 'base64').toString()
}

/**
 * 序列化对象为 URL 友好格式
 * 基础类型使用 key:value 格式，嵌套对象使用 JSON 编码
 */
export function serialize<T extends Record<string, any>>(state: T): string {
  const parts: string[] = []

  for (const [key, value] of Object.entries(state)) {
    if (value === undefined || value === null) continue

    if (typeof value === 'object' && !Array.isArray(value)) {
      // 嵌套对象使用 JSON 编码，并标记为 json: 前缀
      const jsonStr = JSON.stringify(value)
      parts.push(`${key}:json:${safeBtoa(encodeURIComponent(jsonStr))}`)
    } else if (typeof value === 'boolean') {
      parts.push(`${key}:bool:${value}`)
    } else if (typeof value === 'number') {
      parts.push(`${key}:num:${value}`)
    } else {
      // 字符串
      parts.push(`${key}:str:${encodeURIComponent(String(value))}`)
    }
  }

  return parts.join(',')
}

/**
 * 解析值（兼容旧格式）
 */
function parseValue(value: string): any {
  if (value === 'true') return true
  if (value === 'false') return false
  if (/^\d+$/.test(value)) return parseInt(value, 10)
  if (/^\d+\.\d+$/.test(value)) return parseFloat(value)
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * 从 URL 格式反序列化为对象
 */
export function deserialize<T extends Record<string, any>>(str: string): T {
  if (!str) return {} as T

  const result: Record<string, any> = {}
  // 使用更智能的分割，处理 JSON 中的逗号
  const parts = str.split(/,(?=[^:]*:)/)

  for (const part of parts) {
    // 查找第一个 :type: 标记
    const firstColon = part.indexOf(':')
    if (firstColon === -1) continue

    const key = part.slice(0, firstColon)
    const rest = part.slice(firstColon + 1)

    // 检查类型标记
    if (rest.startsWith('json:')) {
      try {
        const base64 = rest.slice(5)
        const jsonStr = decodeURIComponent(safeAtob(base64))
        result[key] = JSON.parse(jsonStr)
      } catch {
        // 如果解析失败，尝试旧格式兼容
        result[key] = parseValue(rest.slice(5))
      }
    } else if (rest.startsWith('bool:')) {
      result[key] = rest.slice(5) === 'true'
    } else if (rest.startsWith('num:')) {
      const numStr = rest.slice(4)
      result[key] = numStr.includes('.') ? parseFloat(numStr) : parseInt(numStr, 10)
    } else if (rest.startsWith('str:')) {
      result[key] = decodeURIComponent(rest.slice(4))
    } else {
      // 旧格式兼容处理
      result[key] = parseValue(rest)
    }
  }

  return result as T
}

/**
 * 深度合并对象
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target }

  for (const key in source) {
    if (source[key] !== undefined && source[key] !== null) {
      if (
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        typeof result[key] === 'object' &&
        !Array.isArray(result[key])
      ) {
        // 深度合并嵌套对象
        result[key] = deepMerge(result[key], source[key])
      } else {
        result[key] = source[key] as any
      }
    }
  }

  return result
}

/**
 * 合并默认值和 URL 状态
 */
export function mergeState<T extends Record<string, any>>(
  defaults: T,
  urlState: Partial<T>
): T {
  return deepMerge(defaults, urlState)
}

/**
 * 创建响应式的 URL ref
 */
function createCurrentUrlRef(): Ref<string> {
  const urlRef = ref(typeof window !== 'undefined' ? window.location.href : '')

  if (typeof window !== 'undefined') {
    const updateUrl = () => {
      urlRef.value = window.location.href
    }

    // 监听 pushState/replaceState
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState

    window.history.pushState = function (...args) {
      originalPushState.apply(this, args)
      updateUrl()
    }

    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args)
      updateUrl()
    }

    // 监听 popstate
    window.addEventListener('popstate', updateUrl)

    onUnmounted(() => {
      window.removeEventListener('popstate', updateUrl)
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
    })
  }

  return urlRef
}

/**
 * URL 状态管理 Hook
 * @param key URL 参数名
 * @param defaultValue 默认值
 * @returns [state, setState, resetState, currentUrl]
 */
export function useUrlState<T extends Record<string, any>>(
  key: string,
  defaultValue: T
): [state: Ref<T>, setState: (value: Partial<T> | ((prev: T) => Partial<T>)) => void, resetState: () => void, currentUrl: Ref<string>] {
  // 从 URL 读取状态
  const getStateFromUrl = (): T => {
    let urlValue = ''
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      urlValue = urlParams.get(key) || ''
    }

    const urlState = deserialize<Partial<T>>(urlValue || '')
    return mergeState(defaultValue, urlState)
  }

  // 创建响应式状态
  const state = ref<T>(getStateFromUrl()) as Ref<T>

  // 创建响应式 URL
  const currentUrl = createCurrentUrlRef()

  // 更新 URL 的方法
  const updateUrl = (newState: T, replace: boolean = false) => {
    const serialized = serialize(newState)

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (serialized) {
        url.searchParams.set(key, serialized)
      } else {
        url.searchParams.delete(key)
      }
      window.history[replace ? 'replaceState' : 'pushState']({}, '', url.toString())
      // URL 更新后，currentUrl 会通过重写的 history 方法自动更新
    }
  }

  // setState 方法 - 使用深度合并
  const setState = (value: Partial<T> | ((prev: T) => Partial<T>)) => {
    const partialValue = typeof value === 'function'
      ? (value as (prev: T) => Partial<T>)(state.value)
      : value

    // 使用深度合并而不是浅合并
    const newState = deepMerge(state.value, partialValue)

    state.value = newState
    updateUrl(newState)
  }

  // resetState 方法 - 完全重置为默认值
  const resetState = () => {
    state.value = { ...defaultValue }
    updateUrl(defaultValue)
  }

  // 监听 URL 变化
  if (typeof window !== 'undefined') {
    const handlePopState = () => {
      state.value = getStateFromUrl()
    }

    onMounted(() => {
      window.addEventListener('popstate', handlePopState)
    })

    onUnmounted(() => {
      window.removeEventListener('popstate', handlePopState)
    })
  }

  return [state, setState, resetState, currentUrl]
}

/**
 * 简化版本 - 单值状态
 */
export function useUrlParam<T = string>(
  key: string,
  defaultValue: T
): [state: Ref<T>, setState: (value: T | ((prev: T) => T)) => void, resetState: () => void, currentUrl: Ref<string>] {
  const [stateObj, setStateObj, resetObj, currentUrl] = useUrlState(key, { _v: defaultValue })

  // 使用 computed 风格的 getter/setter
  const state = {
    get value() {
      return stateObj.value._v
    },
    set value(v: T) {
      // 只读，通过 setState 修改
    }
  } as Ref<T>

  const setState = (value: T | ((prev: T) => T)) => {
    const newValue = typeof value === 'function'
      ? (value as (prev: T) => T)(stateObj.value._v)
      : value
    setStateObj({ _v: newValue })
  }

  const resetState = () => {
    resetObj()
  }

  return [state, setState, resetState, currentUrl]
}

export default useUrlState
