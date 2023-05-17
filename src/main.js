import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import * as VueRouter from 'vue-router'
import routes from "./config/route.js"
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

// 创建路由实例并传递 `routes` 配置
const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

router.beforeEach((to, from, next) => {
    const userRole = localStorage.getItem('role') // 从pinia中获取用户角色
    const roles = to.meta.roles
    console.log('userRole', userRole)
    console.log('roles', roles)
    if (roles === undefined || (roles && roles.includes(userRole))) {
        // 当前用户有权限访问该路由
        console.log('有权限')
        next()

    } else {
        // 当前用户没有权限访问该路由
        console.log('当前用户没有权限访问该路由')
        // next('/index')
        next()
    }
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Antd)
app.mount('#app')


