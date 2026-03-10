import { describe, it, expect } from 'vitest'
import { serialize, deserialize, mergeState } from './index'

describe('vue-url-state', () => {
  describe('serialize', () => {
    it('应该正确序列化简单对象', () => {
      const state = { status: 'active', page: 1 }
      expect(serialize(state)).toBe('status:active,page:1')
    })

    it('应该正确序列化数字', () => {
      const state = { count: 100, price: 99.99 }
      expect(serialize(state)).toBe('count:100,price:99.99')
    })

    it('应该正确序列化布尔值', () => {
      const state = { active: true, deleted: false }
      expect(serialize(state)).toBe('active:true,deleted:false')
    })

    it('应该忽略 undefined 和 null', () => {
      const state = { a: 1, b: undefined, c: null, d: 2 }
      expect(serialize(state)).toBe('a:1,d:2')
    })

    it('应该正确处理特殊字符', () => {
      const state = { name: 'hello world', tag: 'a,b,c' }
      const result = serialize(state)
      expect(result).toContain('name:hello%20world')
      expect(result).toContain('tag:a%2Cb%2Cc')
    })
  })

  describe('deserialize', () => {
    it('应该正确反序列化字符串', () => {
      const result = deserialize('status:active,page:1')
      expect(result).toEqual({ status: 'active', page: 1 })
    })

    it('应该正确识别数字', () => {
      const result = deserialize('count:100,page:1')
      expect(result).toEqual({ count: 100, page: 1 })
    })

    it('应该正确识别浮点数', () => {
      const result = deserialize('price:99.99,rate:3.14')
      expect(result).toEqual({ price: 99.99, rate: 3.14 })
    })

    it('应该正确识别布尔值', () => {
      const result = deserialize('active:true,deleted:false')
      expect(result).toEqual({ active: true, deleted: false })
    })

    it('应该处理空字符串', () => {
      const result = deserialize('')
      expect(result).toEqual({})
    })

    it('应该处理特殊字符', () => {
      const result = deserialize('name:hello%20world,tag:a%2Cb%2Cc')
      expect(result).toEqual({ name: 'hello world', tag: 'a,b,c' })
    })
  })

  describe('mergeState', () => {
    it('应该正确合并默认值和 URL 状态', () => {
      const defaults = { status: 'active', page: 1, limit: 10 }
      const urlState = { status: 'inactive', page: 2 }
      const result = mergeState(defaults, urlState)

      expect(result).toEqual({
        status: 'inactive',
        page: 2,
        limit: 10
      })
    })

    it('URL 状态为空时返回默认值', () => {
      const defaults = { status: 'active', page: 1 }
      const urlState = {}
      const result = mergeState(defaults, urlState)

      expect(result).toEqual({ status: 'active', page: 1 })
    })

    it('应该保留默认值中未在 URL 状态中定义的字段', () => {
      const defaults = { a: 1, b: 2, c: 3 }
      const urlState = { a: 10 }
      const result = mergeState(defaults, urlState)

      expect(result).toEqual({ a: 10, b: 2, c: 3 })
    })
  })

  describe('序列化-反序列化往返', () => {
    it('应该保持数据一致性', () => {
      const original = {
        status: 'active',
        page: 1,
        limit: 10,
        showDetails: true,
        count: 100
      }

      const serialized = serialize(original)
      const deserialized = deserialize<typeof original>(serialized)

      expect(deserialized).toEqual(original)
    })
  })
})
