<template>
  <div class="app">
    <nav class="nav">
      <router-link to="/">首页</router-link>
      <router-link to="/list">列表演示</router-link>
      <router-link to="/settings">设置演示</router-link>
      <router-link to="/complex">🔥 复杂示例</router-link>
    </nav>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
}

.app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.nav {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.nav a {
  text-decoration: none;
  color: #666;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav a:hover {
  background: #f0f0f0;
}

.nav a.router-link-active {
  background: #4CAF50;
  color: white;
}

.main {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
