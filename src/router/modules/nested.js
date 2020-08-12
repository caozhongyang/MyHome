/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const nestedRouter = {
  path: '/nested',
  component: Layout,
  redirect: '/nested/menu1/menu1-1',
  name: '渗透测试',
  meta: {
    title: '渗透测试',
    icon: 'nested'
  },
  children: [
    {
      path: 'menu1',
      component: () => import('@/views/nested/menu1/index'), // Parent router-view
      name: '信息收集',
      meta: { title: '信息收集' },
      redirect: '/nested/menu1/menu1-1',
      children: [
        {
          path: 'menu1-1',
          component: () => import('@/views/nested/menu1/menu1-1'),
          name: 'Menu1-1',
          meta: { title: 'Menu 1-1' }
        },
        {
          path: 'menu1-2',
          component: () => import('@/views/nested/menu1/menu1-2'),
          name: 'Menu1-2',
          redirect: '/nested/menu1/menu1-2/menu1-2-1',
          meta: { title: 'Menu 1-2' },
          children: [
            {
              path: 'menu1-2-1',
              component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
              name: 'Menu1-2-1',
              meta: { title: 'Menu 1-2-1' }
            },
            {
              path: 'menu1-2-2',
              component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
              name: 'Menu1-2-2',
              meta: { title: 'Menu 1-2-2' }
            }
          ]
        },
        {
          path: 'menu1-3',
          component: () => import('@/views/nested/menu1/menu1-3'),
          name: 'Menu1-3',
          meta: { title: 'Menu 1-3' }
        }
      ]
    },
    {
      path: 'menu2',
      name: '漏洞扫描',
      component: () => import('@/views/nested/menu2/index'),
      meta: { title: '漏洞扫描' }
    },
    {
      path: 'menu3',
      name: '漏洞利用',
      component: () => import('@/views/nested/menu2/index'),
      meta: { title: '漏洞利用' }
    },
    {
      path: 'menu4',
      name: '权限提升',
      component: () => import('@/views/nested/menu2/index'),
      meta: { title: '权限提升' }
    },
    {
      path: 'menu4',
      name: '密码攻击',
      component: () => import('@/views/nested/menu2/index'),
      meta: { title: '密码攻击' }
    },
    {
      path: 'menu4',
      name: '无线网络渗透',
      component: () => import('@/views/nested/menu2/index'),
      meta: { title: '无线网络渗透' }
    }
  ]
}

export default nestedRouter
