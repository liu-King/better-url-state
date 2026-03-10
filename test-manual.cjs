// 简单的功能测试
const { serialize, deserialize, mergeState } = require('./dist/index.js')

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

console.log('=== 所有基础功能测试完成 ===')
