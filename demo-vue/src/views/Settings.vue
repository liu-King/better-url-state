<template>
  <div class="settings-demo">
    <h1>⚙️ 设置演示</h1>
    <p class="desc">展示表单状态持久化</p>

    <div class="url-display">
      <code>{{ currentUrl }}</code>
    </div>

    <div class="settings-form">
      <div class="form-section">
        <h3>外观设置</h3>

        <div class="form-group">
          <label>主题模式</label>
          <div class="radio-group">
            <label class="radio">
              <input
                type="radio"
                value="light"
                :checked="settings.theme === 'light'"
                @change="setSettings({ theme: 'light' })"
              />
              <span>☀️ 浅色</span>
            </label>
            <label class="radio">
              <input
                type="radio"
                value="dark"
                :checked="settings.theme === 'dark'"
                @change="setSettings({ theme: 'dark' })"
              />
              <span>🌙 深色</span>
            </label>
            <label class="radio">
              <input
                type="radio"
                value="auto"
                :checked="settings.theme === 'auto'"
                @change="setSettings({ theme: 'auto' })"
              />
              <span>🔄 自动</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>字体大小</label>
          <input
            type="range"
            min="12"
            max="20"
            :value="settings.fontSize"
            @input="setSettings({ fontSize: Number($event.target.value) })"
          />
          <span class="range-value">{{ settings.fontSize }}px</span>
        </div>

        <div class="form-group">
          <label>界面密度</label>
          <div class="radio-group">
            <label class="radio">
              <input
                type="radio"
                value="compact"
                :checked="settings.density === 'compact'"
                @change="setSettings({ density: 'compact' })"
              />
              <span>紧凑</span>
            </label>
            <label class="radio">
              <input
                type="radio"
                value="comfortable"
                :checked="settings.density === 'comfortable'"
                @change="setSettings({ density: 'comfortable' })"
              />
              <span>舒适</span>
            </label>
            <label class="radio">
              <input
                type="radio"
                value="spacious"
                :checked="settings.density === 'spacious'"
                @change="setSettings({ density: 'spacious' })"
              />
              <span>宽敞</span>
            </label>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>通知设置</h3>

        <div class="form-group checkbox-group">
          <label class="checkbox">
            <input
              type="checkbox"
              :checked="settings.notifications.email"
              @change="setSettings({
                notifications: { ...settings.notifications, email: $event.target.checked }
              })"
            />
            <span>📧 邮件通知</span>
          </label>

          <label class="checkbox">
            <input
              type="checkbox"
              :checked="settings.notifications.push"
              @change="setSettings({
                notifications: { ...settings.notifications, push: $event.target.checked }
              })"
            />
            <span>🔔 推送通知</span>
          </label>

          <label class="checkbox">
            <input
              type="checkbox"
              :checked="settings.notifications.sms"
              @change="setSettings({
                notifications: { ...settings.notifications, sms: $event.target.checked }
              })"
            />
            <span>📱 短信通知</span>
          </label>
        </div>
      </div>

      <div class="form-section">
        <h3>语言与地区</h3>

        <div class="form-group">
          <label>语言</label>
          <select
            :value="settings.language"
            @change="setSettings({ language: $event.target.value })"
          >
            <option value="zh-CN">简体中文</option>
            <option value="zh-TW">繁體中文</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
          </select>
        </div>

        <div class="form-group">
          <label>时区</label>
          <select
            :value="settings.timezone"
            @change="setSettings({ timezone: $event.target.value })"
          >
            <option value="Asia/Shanghai">北京时间 (UTC+8)</option>
            <option value="Asia/Tokyo">东京时间 (UTC+9)</option>
            <option value="America/New_York">纽约时间 (UTC-5)</option>
            <option value="Europe/London">伦敦时间 (UTC+0)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <button class="reset-btn" @click="resetSettings">恢复默认</button>
        <button class="save-btn" @click="saveSettings">保存设置</button>
      </div>
    </div>

    <div class="preview-section">
      <h3>📋 当前设置预览</h3>
      <pre>{{ JSON.stringify(settings, null, 2) }}</pre>
    </div>

    <div class="tips">
      <h3>💡 提示</h3>
      <ul>
        <li>所有设置会自动保存到 URL</li>
        <li>刷新页面后设置不会丢失</li>
        <li>可以将当前 URL 分享给他人，对方会看到你相同的设置</li>
        <li>点击"恢复默认"可以重置所有设置</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUrlState } from '@liucm/better-url-state'

const defaultSettings = {
  theme: 'light',
  fontSize: 14,
  density: 'comfortable',
  notifications: {
    email: true,
    push: false,
    sms: false
  },
  language: 'zh-CN',
  timezone: 'Asia/Shanghai'
}

const [settings, setSettings, resetSettings, currentUrl] = useUrlState('settings', defaultSettings)

const saveSettings = () => {
  // 实际项目中这里会调用 API 保存到服务器
  alert('设置已保存到 URL！\n\n你可以复制当前 URL 分享给他人。')
}
</script>

<style scoped>
.settings-demo {
  max-width: 700px;
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

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.form-section h3 {
  margin-bottom: 20px;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group > label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #444;
}

.radio-group {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.radio {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 10px 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid #ddd;
  transition: all 0.2s;
}

.radio:hover {
  border-color: #4CAF50;
}

.radio input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #4CAF50;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 10px;
  background: white;
  border-radius: 6px;
}

.checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #4CAF50;
}

input[type="range"] {
  width: 100%;
  max-width: 300px;
  margin-right: 15px;
}

.range-value {
  font-weight: 500;
  color: #4CAF50;
}

select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  min-width: 200px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding-top: 10px;
}

.reset-btn {
  padding: 12px 24px;
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.reset-btn:hover {
  background: #e0e0e0;
}

.save-btn {
  padding: 12px 24px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.save-btn:hover {
  background: #45a049;
}

.preview-section {
  margin-top: 30px;
  padding: 20px;
  background: #e3f2fd;
  border-radius: 8px;
}

.preview-section h3 {
  margin-bottom: 15px;
  color: #1976d2;
}

.preview-section pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  background: white;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
}

.tips {
  margin-top: 30px;
  padding: 20px;
  background: #fff3e0;
  border-radius: 8px;
}

.tips h3 {
  margin-bottom: 15px;
  color: #e65100;
}

.tips ul {
  padding-left: 20px;
}

.tips li {
  margin: 10px 0;
  color: #555;
}

@media (max-width: 600px) {
  .radio-group {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
