import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: '控制台',
        meta: { title: '控制台', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: '文档',
        meta: { title: '文档', icon: 'documentation' }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: '导航',
        meta: { title: '导航', icon: 'guide', noCache: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: '个人信息',
        meta: { title: '个人信息', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/server',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    name: '服务端',
    meta: {
      title: '服务端',
      icon: 'nested'
    },
    children: []
  },

  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  chartsRouter,
  nestedRouter,

  {
    path: '/example',
    component: Layout,
    name: '我的作品',
    meta: {
      title: '我的项目',
      icon: 'example'
    },
    children: [
      {
        path: '/example/create',
        component: () => import('@/views/example/create'),
        name: '添加项目',
        meta: { title: '添加项目', icon: 'edit' }
      },
      {
        path: '/example/list',
        component: () => import('@/views/example/list'),
        name: '项目列表',
        meta: { title: '项目列表', icon: 'list' }
      },
      {
        path: '/example/detail',
        hidden: true,
        component: () => import('@/views/example/detail'),
        name: '文章详情',
        meta: { title: '文章详情' }
      }
    ]
  },

  {
    path: '/bussiness',
    component: Layout,
    name: '商业小纸条',
    meta: { title: '商业小纸条', icon: 'pdf' },
    children: [
      {
        path: '/bussiness/analyze',
        component: () => import('@/views/goods/index'),
        name: '商品分析',
        meta: { title: '商品分析', icon: 'money' }
      },
      {
        path: '/bussiness/pdf',
        component: () => import('@/views/pdf/index'),
        name: '文档列表',
        meta: { title: '文档列表', icon: 'list' }
      },
      {
        path: '/bussiness/finance',
        component: () => import('@/views/finance/index'),
        name: '股市分析',
        meta: { title: '股市分析', icon: 'list' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRoutes, ...asyncRoutes]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export async function resetRouter() {
  const newRouter = createRouter()
  const accessRoutes = await store.dispatch('permission/generateRoutes', [])
  if (router.options.routes.length === 0) {
    router.addRoutes(accessRoutes)
  }
  router.matcher = newRouter.matcher // reset router
}

export default router
