import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

// 使用函数延迟加载，避免路径空格问题
const loadView = (name) => {
  return () => import(`./views/${name}.vue`)
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: loadView('Home') },
    { path: '/list', component: loadView('List') },
    { path: '/settings', component: loadView('Settings') },
    { path: '/complex', component: loadView('Complex') },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
