import Vue from 'vue'
import Router from 'vue-router'

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


// 导入自定义的组件
import home from '@/components/home'

import articleList from '@/components/articleList'
const login = () => import('@/components/login')
const articleInfo = () => import('@/components/articleInfo')
const writing = () => import('@/components/writing')
const articleConsole = () => import('@/components/articleConsole')
const articleClass = () => import('@/components/articleClass')

// 懒加载路由的声明
// const users = () => import('@/components/home');

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      // redirect: '/articleList', // 重定向，代理路由
      // 为 home 声明子路由
      children: [
        {
          // 默认子路由
          path: '',
          name: 'articleList',
          component: articleList
        },
        {
          path: 'articleInfo',
          name: 'articleInfo',
          component: articleInfo
        },
        {
          path: 'articleConsole',
          name: 'articleConsole',
          component: articleConsole
        },
        {
          path: 'articleClass',
          name: 'articleClass',
          component: articleClass
        }
      ]
    },
    {
      path: '/writing/:uid/',
      name: 'writing',
      component: writing
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})
