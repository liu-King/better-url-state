<template>
  <div class="complex-demo">
    <h1>🔥 超复杂示例</h1>
    <p class="desc">大量表单 + 复杂表格的 URL 状态管理</p>

    <div class="url-display">
      <code>{{ currentUrl }}</code>
    </div>

    <!-- 表单区域 -->
    <div class="section">
      <h2>📋 高级搜索表单</h2>

      <div class="form-grid">
        <!-- 基础信息 -->
        <div class="form-group">
          <label>订单编号</label>
          <input
            :value="form.orderNo"
            @input="setForm({ orderNo: $event.target.value })"
            placeholder="请输入订单编号"
          />
        </div>

        <div class="form-group">
          <label>客户名称</label>
          <input
            :value="form.customerName"
            @input="setForm({ customerName: $event.target.value })"
            placeholder="请输入客户名称"
          />
        </div>

        <div class="form-group">
          <label>订单状态</label>
          <select :value="form.status" @change="setForm({ status: $event.target.value })">
            <option value="">全部状态</option>
            <option value="pending">待处理</option>
            <option value="processing">处理中</option>
            <option value="shipped">已发货</option>
            <option value="delivered">已送达</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>

        <div class="form-group">
          <label>订单类型</label>
          <select :value="form.type" @change="setForm({ type: $event.target.value })">
            <option value="">全部类型</option>
            <option value="retail">零售订单</option>
            <option value="wholesale">批发订单</option>
            <option value="dropship">代发订单</option>
            <option value="custom">定制订单</option>
          </select>
        </div>

        <!-- 日期范围 -->
        <div class="form-group">
          <label>开始日期</label>
          <input
            type="date"
            :value="form.startDate"
            @input="setForm({ startDate: $event.target.value })"
          />
        </div>

        <div class="form-group">
          <label>结束日期</label>
          <input
            type="date"
            :value="form.endDate"
            @input="setForm({ endDate: $event.target.value })"
          />
        </div>

        <!-- 数值范围 -->
        <div class="form-group">
          <label>最小金额 (¥)</label>
          <input
            type="number"
            :value="form.minAmount"
            @input="setForm({ minAmount: Number($event.target.value) || 0 })"
            placeholder="0"
          />
        </div>

        <div class="form-group">
          <label>最大金额 (¥)</label>
          <input
            type="number"
            :value="form.maxAmount"
            @input="setForm({ maxAmount: Number($event.target.value) || 0 })"
            placeholder="999999"
          />
        </div>
      </div>

      <!-- 标签筛选 -->
      <div class="form-row">
        <label>订单标签:</label>
        <div class="tag-selector">
          <label
            v-for="tag in tagOptions"
            :key="tag"
            class="tag-checkbox"
            :class="{ active: form.tags.includes(tag) }"
          >
            <input
              type="checkbox"
              :checked="form.tags.includes(tag)"
              @change="toggleTag(tag)"
            />
            <span>{{ tag }}</span>
          </label>
        </div>
      </div>

      <!-- 优先级多选 -->
      <div class="form-row">
        <label>优先级:</label>
        <div class="priority-selector">
          <label
            v-for="p in priorityOptions"
            :key="p.value"
            class="priority-item"
            :class="[p.class, { active: form.priorities.includes(p.value) }]"
          >
            <input
              type="checkbox"
              :checked="form.priorities.includes(p.value)"
              @change="togglePriority(p.value)"
            />
            <span>{{ p.label }}</span>
          </label>
        </div>
      </div>

      <!-- 扩展选项 -->
      <div class="form-row">
        <label class="switch-label">
          <input
            type="checkbox"
            :checked="form.extendedOptions.enabled"
            @change="setForm({
              extendedOptions: { ...form.extendedOptions, enabled: $event.target.checked }
            })"
          />
          <span>启用高级选项</span>
        </label>
      </div>

      <div v-if="form.extendedOptions.enabled" class="extended-panel">
        <div class="form-grid">
          <div class="form-group">
            <label>发货仓库</label>
            <select
              :value="form.extendedOptions.warehouse"
              @change="setForm({
                extendedOptions: { ...form.extendedOptions, warehouse: $event.target.value }
              })"
            >
              <option value="">全部仓库</option>
              <option value="shanghai">上海仓</option>
              <option value="beijing">北京仓</option>
              <option value="guangzhou">广州仓</option>
              <option value="chengdu">成都仓</option>
            </select>
          </div>

          <div class="form-group">
            <label>物流方式</label>
            <select
              :value="form.extendedOptions.shippingMethod"
              @change="setForm({
                extendedOptions: { ...form.extendedOptions, shippingMethod: $event.target.value }
              })"
            >
              <option value="">全部</option>
              <option value="sf">顺丰速运</option>
              <option value="jd">京东物流</option>
              <option value="ems">EMS</option>
              <option value="yto">圆通快递</option>
            </select>
          </div>

          <div class="form-group">
            <label>支付方式</label>
            <select
              :value="form.extendedOptions.paymentMethod"
              @change="setForm({
                extendedOptions: { ...form.extendedOptions, paymentMethod: $event.target.value }
              })"
            >
              <option value="">全部</option>
              <option value="alipay">支付宝</option>
              <option value="wechat">微信支付</option>
              <option value="card">银行卡</option>
              <option value="credit">账期支付</option>
            </select>
          </div>

          <div class="form-group">
            <label>发票类型</label>
            <select
              :value="form.extendedOptions.invoiceType"
              @change="setForm({
                extendedOptions: { ...form.extendedOptions, invoiceType: $event.target.value }
              })"
            >
              <option value="">全部</option>
              <option value="none">不开发票</option>
              <option value="personal">个人发票</option>
              <option value="company">企业发票</option>
              <option value="vat">增值税专用发票</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <label class="checkbox-label">
            <input
              type="checkbox"
              :checked="form.extendedOptions.includeDeleted"
              @change="setForm({
                extendedOptions: { ...form.extendedOptions, includeDeleted: $event.target.checked }
              })"
            />
            <span>包含已删除订单</span>
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              :checked="form.extendedOptions.includeSubOrders"
              @change="setForm({
                extendedOptions: { ...form.extendedOptions, includeSubOrders: $event.target.checked }
              })"
            />
            <span>包含子订单</span>
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              :checked="form.extendedOptions.urgentOnly"
              @change="setForm({
                extendedOptions: { ...form.extendedOptions, urgentOnly: $event.target.checked }
              })"
            />
            <span>仅显示加急订单</span>
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn-secondary" @click="resetForm">重置条件</button>
        <button class="btn-primary" @click="handleSearch">搜索订单</button>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="section">
      <div class="table-header">
        <h2>📊 订单列表 ({{ pagination.total }}条)</h2>

        <div class="table-controls">
          <!-- 列显示控制 -->
          <div class="column-toggle">
            <button class="btn-icon" @click="showColumnPanel = !showColumnPanel">
              ⚙️ 列设置
            </button>
            <div v-if="showColumnPanel" class="column-panel">
              <label
                v-for="col in columnOptions"
                :key="col.key"
                class="column-item"
              >
                <input
                  type="checkbox"
                  :checked="table.columns.includes(col.key)"
                  @change="toggleColumn(col.key)"
                />
                <span>{{ col.label }}</span>
              </label>
            </div>
          </div>

          <!-- 密度切换 -->
          <div class="density-toggle">
            <button
              v-for="d in densityOptions"
              :key="d.value"
              :class="{ active: table.density === d.value }"
              @click="setTable({ density: d.value })"
            >
              {{ d.label }}
            </button>
          </div>

          <!-- 导出按钮 -->
          <button class="btn-icon" @click="exportData">📥 导出</button>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table-wrapper" :class="table.density">
        <table class="data-table">
          <thead>
            <tr>
              <th v-if="table.columns.includes('checkbox')" class="checkbox-col">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                />
              </th>
              <th
                v-if="table.columns.includes('orderNo')"
                class="sortable"
                @click="toggleSort('orderNo')"
              >
                订单编号
                <span class="sort-icon">{{ getSortIcon('orderNo') }}</span>
              </th>
              <th v-if="table.columns.includes('customer')">客户信息</th>
              <th
                v-if="table.columns.includes('amount')"
                class="sortable"
                @click="toggleSort('amount')"
              >
                订单金额
                <span class="sort-icon">{{ getSortIcon('amount') }}</span>
              </th>
              <th v-if="table.columns.includes('status')">状态</th>
              <th v-if="table.columns.includes('priority')">优先级</th>
              <th v-if="table.columns.includes('tags')">标签</th>
              <th
                v-if="table.columns.includes('createTime')"
                class="sortable"
                @click="toggleSort('createTime')"
              >
                创建时间
                <span class="sort-icon">{{ getSortIcon('createTime') }}</span>
              </th>
              <th v-if="table.columns.includes('warehouse')">仓库</th>
              <th v-if="table.columns.includes('shipping')">物流</th>
              <th class="actions-col">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in tableData"
              :key="row.id"
              :class="{ selected: table.selectedRows.includes(row.id), highlight: row.priority === 'urgent' }"
            >
              <td v-if="table.columns.includes('checkbox')">
                <input
                  type="checkbox"
                  :checked="table.selectedRows.includes(row.id)"
                  @change="toggleRowSelection(row.id)"
                />
              </td>
              <td v-if="table.columns.includes('orderNo')">
                <span class="order-no">{{ row.orderNo }}</span>
              </td>
              <td v-if="table.columns.includes('customer')">
                <div class="customer-info">
                  <strong>{{ row.customerName }}</strong>
                  <span class="customer-id">ID: {{ row.customerId }}</span>
                </div>
              </td>
              <td v-if="table.columns.includes('amount')">
                <span class="amount">¥{{ row.amount.toFixed(2) }}</span>
              </td>
              <td v-if="table.columns.includes('status')">
                <span class="status-badge" :class="row.status">
                  {{ statusMap[row.status] }}
                </span>
              </td>
              <td v-if="table.columns.includes('priority')">
                <span class="priority-badge" :class="row.priority">
                  {{ priorityMap[row.priority] }}
                </span>
              </td>
              <td v-if="table.columns.includes('tags')">
                <span
                  v-for="tag in row.tags"
                  :key="tag"
                  class="data-tag"
                >
                  {{ tag }}
                </span>
              </td>
              <td v-if="table.columns.includes('createTime')">
                {{ row.createTime }}
              </td>
              <td v-if="table.columns.includes('warehouse')">
                {{ warehouseMap[row.warehouse] }}
              </td>
              <td v-if="table.columns.includes('shipping')">
                {{ shippingMap[row.shippingMethod] }}
              </td>
              <td class="actions">
                <button class="btn-text" @click="viewDetail(row)">查看</button>
                <button class="btn-text" @click="editOrder(row)">编辑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="pagination-bar">
        <div class="pagination-info">
          显示第 {{ pagination.start }} 到 {{ pagination.end }} 条，共 {{ pagination.total }} 条
        </div>

        <div class="pagination-controls">
          <button
            :disabled="pagination.page <= 1"
            @click="setPagination({ page: pagination.page - 1 })"
          >
            上一页
          </button>

          <span class="page-numbers">
            <button
              v-for="p in visiblePages"
              :key="p"
              :class="{ active: pagination.page === p }"
              @click="setPagination({ page: p })"
            >
              {{ p }}
            </button>
          </span>

          <button
            :disabled="pagination.page >= pagination.totalPages"
            @click="setPagination({ page: pagination.page + 1 })"
          >
            下一页
          </button>
        </div>

        <div class="page-size-selector">
          <select
            :value="pagination.pageSize"
            @change="setPagination({ pageSize: Number($event.target.value), page: 1 })"
          >
            <option :value="10">10条/页</option>
            <option :value="20">20条/页</option>
            <option :value="50">50条/页</option>
            <option :value="100">100条/页</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 批量操作栏 -->
    <div v-if="table.selectedRows.length > 0" class="batch-bar">
      <span>已选择 {{ table.selectedRows.length }} 项</span>
      <button @click="batchProcess">批量处理</button>
      <button @click="batchExport">批量导出</button>
      <button class="btn-danger" @click="batchDelete">批量删除</button>
      <button class="btn-text" @click="clearSelection">清除选择</button>
    </div>

    <!-- 状态预览 -->
    <div class="debug-section">
      <h3>🔧 状态调试</h3>
      <div class="debug-tabs">
        <button
          v-for="t in debugTabs"
          :key="t.key"
          :class="{ active: activeDebugTab === t.key }"
          @click="activeDebugTab = t.key"
        >
          {{ t.label }}
        </button>
      </div>
      <pre class="debug-content">{{ debugContent }}</pre>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUrlState } from '@liucm/better-url-state'

// ============ 选项数据 ============
const tagOptions = ['新客户', 'VIP', '批量订单', '定制需求', '加急', '赠品', '发票待开', '售后跟进']
const priorityOptions = [
  { value: 'low', label: '低', class: 'low' },
  { value: 'normal', label: '中', class: 'normal' },
  { value: 'high', label: '高', class: 'high' },
  { value: 'urgent', label: '紧急', class: 'urgent' }
]
const columnOptions = [
  { key: 'checkbox', label: '选择' },
  { key: 'orderNo', label: '订单编号' },
  { key: 'customer', label: '客户信息' },
  { key: 'amount', label: '订单金额' },
  { key: 'status', label: '状态' },
  { key: 'priority', label: '优先级' },
  { key: 'tags', label: '标签' },
  { key: 'createTime', label: '创建时间' },
  { key: 'warehouse', label: '仓库' },
  { key: 'shipping', label: '物流' }
]
const densityOptions = [
  { value: 'default', label: '默认' },
  { value: 'compact', label: '紧凑' },
  { value: 'loose', label: '宽松' }
]
const statusMap = {
  pending: '待处理',
  processing: '处理中',
  shipped: '已发货',
  delivered: '已送达',
  cancelled: '已取消'
}
const priorityMap = {
  low: '低',
  normal: '中',
  high: '高',
  urgent: '紧急'
}
const warehouseMap = {
  shanghai: '上海仓',
  beijing: '北京仓',
  guangzhou: '广州仓',
  chengdu: '成都仓'
}
const shippingMap = {
  sf: '顺丰速运',
  jd: '京东物流',
  ems: 'EMS',
  yto: '圆通快递'
}

// ============ URL 状态 ============
const defaultForm = {
  orderNo: '',
  customerName: '',
  status: '',
  type: '',
  startDate: '',
  endDate: '',
  minAmount: 0,
  maxAmount: 0,
  tags: [],
  priorities: [],
  extendedOptions: {
    enabled: false,
    warehouse: '',
    shippingMethod: '',
    paymentMethod: '',
    invoiceType: '',
    includeDeleted: false,
    includeSubOrders: false,
    urgentOnly: false
  }
}

const [form, setForm, resetForm, currentUrl] = useUrlState('form', defaultForm)

const [pagination, setPagination] = useUrlState('pagination', {
  page: 1,
  pageSize: 20,
  total: 156,
  totalPages: 8
})

const [table, setTable, resetTable] = useUrlState('table', {
  columns: ['checkbox', 'orderNo', 'customer', 'amount', 'status', 'priority', 'tags', 'createTime', 'actions'],
  selectedRows: [],
  density: 'default',
  sortField: 'createTime',
  sortOrder: 'desc'
})

const isAllSelected = computed(() => {
  return tableData.value.length > 0 && tableData.value.every(row =>
    table.value.selectedRows.includes(row.id)
  )
})

const tableData = computed(() => {
  // 模拟大量数据
  const data = []
  const start = (pagination.value.page - 1) * pagination.value.pageSize

  for (let i = 0; i < pagination.value.pageSize; i++) {
    const id = start + i + 1
    data.push({
      id,
      orderNo: `ORD${String(id).padStart(6, '0')}`,
      customerName: `客户${id}`,
      customerId: `C${10000 + id}`,
      amount: Math.random() * 10000 + 100,
      status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
      priority: ['low', 'normal', 'high', 'urgent'][Math.floor(Math.random() * 4)],
      tags: tagOptions.slice(0, Math.floor(Math.random() * 3) + 1),
      createTime: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      warehouse: ['shanghai', 'beijing', 'guangzhou', 'chengdu'][Math.floor(Math.random() * 4)],
      shippingMethod: ['sf', 'jd', 'ems', 'yto'][Math.floor(Math.random() * 4)]
    })
  }

  return data
})

const paginationInfo = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.pageSize + 1
  const end = Math.min(start + pagination.value.pageSize - 1, pagination.value.total)
  return { start, end }
})

const visiblePages = computed(() => {
  const current = pagination.value.page
  const total = pagination.value.totalPages
  const pages = []

  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)

  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// ============ 方法 ============
function toggleTag(tag) {
  const currentTags = [...form.value.tags]
  const index = currentTags.indexOf(tag)

  if (index > -1) {
    currentTags.splice(index, 1)
  } else {
    currentTags.push(tag)
  }

  setForm({ tags: currentTags })
}

function togglePriority(priority) {
  const current = [...form.value.priorities]
  const index = current.indexOf(priority)

  if (index > -1) {
    current.splice(index, 1)
  } else {
    current.push(priority)
  }

  setForm({ priorities: current })
}

function toggleColumn(key) {
  const current = [...table.value.columns]
  const index = current.indexOf(key)

  if (index > -1) {
    if (current.length > 3) {
      current.splice(index, 1)
    }
  } else {
    current.push(key)
  }

  setTable({ columns: current })
}

function toggleSort(field) {
  let order = 'asc'
  if (table.value.sortField === field && table.value.sortOrder === 'asc') {
    order = 'desc'
  }
  setTable({ sortField: field, sortOrder: order })
}

function getSortIcon(field) {
  if (table.value.sortField !== field) return '⇅'
  return table.value.sortOrder === 'asc' ? '↑' : '↓'
}

function toggleRowSelection(id) {
  const current = [...table.value.selectedRows]
  const index = current.indexOf(id)

  if (index > -1) {
    current.splice(index, 1)
  } else {
    current.push(id)
  }

  setTable({ selectedRows: current })
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    setTable({ selectedRows: [] })
  } else {
    setTable({ selectedRows: tableData.value.map(row => row.id) })
  }
}

function clearSelection() {
  setTable({ selectedRows: [] })
}

function handleSearch() {
  setPagination({ page: 1 })
  // 模拟搜索
  alert('搜索条件已保存到 URL，可复制当前链接分享搜索结果')
}

function viewDetail(row) {
  alert(`查看订单详情: ${row.orderNo}`)
}

function editOrder(row) {
  alert(`编辑订单: ${row.orderNo}`)
}

function exportData() {
  alert('导出当前筛选结果')
}

function batchProcess() {
  alert(`批量处理 ${table.value.selectedRows.length} 个订单`)
}

function batchExport() {
  alert(`批量导出 ${table.value.selectedRows.length} 个订单`)
}

function batchDelete() {
  if (confirm(`确定要删除选中的 ${table.value.selectedRows.length} 个订单吗？`)) {
    setTable({ selectedRows: [] })
    alert('删除成功')
  }
}

// ============ Debug ============
const showColumnPanel = ref(false)
const activeDebugTab = ref('form')
const debugTabs = [
  { key: 'form', label: '表单' },
  { key: 'pagination', label: '分页' },
  { key: 'table', label: '表格' }
]

const debugContent = computed(() => {
  switch (activeDebugTab.value) {
    case 'form':
      return JSON.stringify(form.value, null, 2)
    case 'pagination':
      return JSON.stringify(pagination.value, null, 2)
    case 'table':
      return JSON.stringify(table.value, null, 2)
    default:
      return ''
  }
})
</script>

<style scoped>
.complex-demo {
  max-width: 1400px;
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

.section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 18px;
}

/* 表单样式 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.form-group input,
.form-group select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #1890ff;
  outline: none;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.form-row > label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
  min-width: 80px;
}

/* 标签选择器 */
.tag-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-checkbox {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.tag-checkbox.active {
  background: #e6f7ff;
  color: #1890ff;
}

.tag-checkbox input {
  display: none;
}

/* 优先级选择器 */
.priority-selector {
  display: flex;
  gap: 8px;
}

.priority-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  opacity: 0.5;
  transition: all 0.2s;
}

.priority-item.active {
  opacity: 1;
  font-weight: 500;
}

.priority-item.low { background: #f6ffed; color: #52c41a; }
.priority-item.normal { background: #e6f7ff; color: #1890ff; }
.priority-item.high { background: #fff7e6; color: #fa8c16; }
.priority-item.urgent { background: #fff1f0; color: #f5222d; }

.priority-item input {
  display: none;
}

/* 扩展选项 */
.switch-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.extended-panel {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
}

/* 按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.btn-primary {
  padding: 8px 24px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-secondary {
  padding: 8px 24px;
  background: white;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-secondary:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.btn-icon {
  padding: 6px 12px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.btn-text {
  padding: 4px 8px;
  background: transparent;
  border: none;
  color: #1890ff;
  cursor: pointer;
  font-size: 13px;
}

.btn-text:hover {
  text-decoration: underline;
}

.btn-danger {
  padding: 8px 24px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

/* 表格头部 */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.column-toggle {
  position: relative;
}

.column-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 12px;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 100;
}

.column-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  cursor: pointer;
}

.density-toggle {
  display: flex;
  gap: 4px;
}

.density-toggle button {
  padding: 4px 12px;
  background: white;
  border: 1px solid #d9d9d9;
  cursor: pointer;
  font-size: 13px;
}

.density-toggle button:first-child {
  border-radius: 4px 0 0 4px;
}

.density-toggle button:last-child {
  border-radius: 0 4px 4px 0;
}

.density-toggle button.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

/* 表格 */
.table-wrapper {
  overflow-x: auto;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th,
.data-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.data-table th {
  background: #fafafa;
  font-weight: 500;
  color: #333;
}

.data-table tbody tr:hover {
  background: #f5f5f5;
}

.data-table tbody tr.selected {
  background: #e6f7ff;
}

.data-table tbody tr.highlight {
  border-left: 3px solid #f5222d;
}

/* 密度 */
.table-wrapper.compact .data-table th,
.table-wrapper.compact .data-table td {
  padding: 8px 12px;
  font-size: 13px;
}

.table-wrapper.loose .data-table th,
.table-wrapper.loose .data-table td {
  padding: 16px 20px;
}

/* 表格列样式 */
.checkbox-col {
  width: 40px;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background: #f0f0f0;
}

.sort-icon {
  margin-left: 4px;
  color: #999;
}

.order-no {
  font-family: 'Courier New', monospace;
  color: #1890ff;
}

.customer-info {
  display: flex;
  flex-direction: column;
}

.customer-id {
  font-size: 12px;
  color: #999;
}

.amount {
  font-weight: 500;
  color: #f5222d;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-badge.pending { background: #fff7e6; color: #fa8c16; }
.status-badge.processing { background: #e6f7ff; color: #1890ff; }
.status-badge.shipped { background: #f6ffed; color: #52c41a; }
.status-badge.delivered { background: #f6ffed; color: #52c41a; }
.status-badge.cancelled { background: #f5f5f5; color: #999; }

.priority-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.priority-badge.low { background: #f6ffed; color: #52c41a; }
.priority-badge.normal { background: #e6f7ff; color: #1890ff; }
.priority-badge.high { background: #fff7e6; color: #fa8c16; }
.priority-badge.urgent { background: #fff1f0; color: #f5222d; }

.data-tag {
  display: inline-block;
  padding: 2px 6px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 4px;
  margin-bottom: 4px;
}

.actions {
  display: flex;
  gap: 8px;
}

.actions-col {
  width: 100px;
}

/* 分页 */
.pagination-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.pagination-info {
  color: #666;
  font-size: 13px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-controls button {
  padding: 6px 12px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-controls button:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-numbers button.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.page-size-selector select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

/* 批量操作栏 */
.batch-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  background: white;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
}

.batch-bar span {
  font-weight: 500;
  color: #1890ff;
}

.batch-bar button {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.batch-bar button:hover {
  border-color: #1890ff;
  color: #1890ff;
}

/* 调试区域 */
.debug-section {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
}

.debug-section h3 {
  margin-bottom: 12px;
  color: #389e0d;
}

.debug-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.debug-tabs button {
  padding: 6px 16px;
  background: white;
  border: 1px solid #b7eb8f;
  border-radius: 4px;
  cursor: pointer;
}

.debug-tabs button.active {
  background: #52c41a;
  color: white;
}

.debug-content {
  background: white;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  max-height: 300px;
  overflow-y: auto;
}

/* 响应式 */
@media (max-width: 1200px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .pagination-bar {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
