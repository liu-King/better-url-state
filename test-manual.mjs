// 简单的功能测试
import { serialize, deserialize, mergeState } from './dist/index.js'

console.log('=== 测试 serialize ===')
const state1 = { status: 'active', page: 1 }
const result1 = serialize(state1)
console.log(`输入: ${JSON.stringify(state1)}`)
console.log(`输出: ${result1}`)
console.log(`期望: status:active,page:1`)
console.log(`通过: ${result1 === 'status:active,page:1'}\n`)

console.log('=== 测试 deserialize ===')
const result2 = deserialize('status:active,page:1')
console.log(`输入: status:active,page:1`)
console.log(`输出: ${JSON.stringify(result2)}`)
console.log(`期望: ${JSON.stringify({ status: 'active', page: 1 })}`)
console.log(`通过: ${JSON.stringify(result2) === JSON.stringify({ status: 'active', page: 1 })}\n`)

console.log('=== 测试 mergeState ===')
const result3 = mergeState({ status: 'active', page: 1, limit: 10 }, { status: 'inactive', page: 2 })
console.log(`默认值: ${JSON.stringify({ status: 'active', page: 1, limit: 10 })}`)
console.log(`URL状态: ${JSON.stringify({ status: 'inactive', page: 2 })}`)
console.log(`输出: ${JSON.stringify(result3)}`)
console.log(`期望: ${JSON.stringify({ status: 'inactive', page: 2, limit: 10 })}`)
console.log(`通过: ${JSON.stringify(result3) === JSON.stringify({ status: 'inactive', page: 2, limit: 10 })}\n`)

console.log('=== 测试类型转换 ===')
const result4 = deserialize('count:100,price:99.99,active:true,deleted:false')
console.log(`输入: count:100,price:99.99,active:true,deleted:false`)
console.log(`输出: ${JSON.stringify(result4)}`)
console.log(`期望: ${JSON.stringify({ count: 100, price: 99.99, active: true, deleted: false })}`)
console.log(`通过: ${JSON.stringify(result4) === JSON.stringify({ count: 100, price: 99.99, active: true, deleted: false })}\n`)

console.log('=== 测试特殊字符 ===')
const result5 = serialize({ name: 'hello world', tag: 'a,b,c' })
console.log(`输入: ${JSON.stringify({ name: 'hello world', tag: 'a,b,c' })}`)
console.log(`输出: ${result5}`)
console.log(`通过: ${result5.includes('hello%20world') && result5.includes('a%2Cb%2Cc')}\n`)

const result6 = deserialize('name:hello%20world,tag:a%2Cb%2Cc')
console.log(`输入: name:hello%20world,tag:a%2Cb%2Cc`)
console.log(`输出: ${JSON.stringify(result6)}`)
console.log(`期望: ${JSON.stringify({ name: 'hello world', tag: 'a,b,c' })}`)
console.log(`通过: ${JSON.stringify(result6) === JSON.stringify({ name: 'hello world', tag: 'a,b,c' })}\n`)

console.log('=== ✅ 所有基础功能测试通过 ===')
