import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/', name: '', component: () => import('@/page/login.vue')
    },
    {
      path: '/manage', name: '', component: () => import('@/page/manage.vue'),
      children: [
        {
          path: '',
          component: () => import('@/page/home.vue'),
          meta: []
        }, {
          path: '/addShop',
          component: () => import('@/page/addShop.vue'),
          meta: ['添加数据', '添加商铺']
        }, {
          path: '/addGoods',
          component: () => import("@/page/addGoods.vue"),
          meta: ['添加数据', '添加商品']
        }, {
          path: '/userList',
          component: () => import('@/page/userList.vue'),
          meta: ['数据管理', '用户列表']
        }, {
          path: '/shopList',
          component: () => import('@/page/shopList.vue'),
          meta: ['数据管理', '商家列表']
        }, {
          path: '/foodList',
          component: () => import('@/page/foodList.vue'),
          meta: ['数据管理', '食品列表']
        }, {
          path: '/orderList',
          component: () => import('@/page/orderList.vue'),
          meta: ['数据管理', '订单列表']
        }, {
          path: '/adminList',
          component: () => import('@/page/adminList.vue'),
          meta: ['数据管理', '管理员列表']
        }, {
          path: '/visitor',
          component: () => import('@/page/visitor.vue'),
          meta: ['图表', '用户分布']
        }, {
          path: '/newMember',
          component: () => import('@/page/newMember.vue'),
          meta: ['图表', '用户数据']
        }, {
          path: '/uploadImg',
          component: () => import('@/page/uploadImg.vue'),
          meta: ['文本编辑', 'Markdown']
        }, {
          path: '/vueEdit',
          component: () => import('@/page/vueEdit.vue'),
          meta: ['编辑', '文本编辑']
        }, {
          path: '/adminSet',
          component: () => import('@/page/adminSet.vue'),
          meta: ['设置', '设置管理员']
        }, {
          path: '/sendMessage',
          component: () => import('@/page/sendMessage.vue'),
          meta: ['设置', '发送通知']
        }, {
          path: '/explain',
          component: () => import('@/page/explain.vue'),
          meta: ['说明', '说明']
        }
      ]
    }
  ]
})

export default router
