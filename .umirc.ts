import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '房屋租赁中介管理系统',
    locale: false,
  },
  routes: [
    {
      path: '/login',
      layout: false,
      component: './Login',
      name: '登录',
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      name: '中介工作台',
      path: '/dashboard',
      component: './Dashboard',
      icon: 'DashboardOutlined',
      access: 'canAccess',
    },
    {
      name: '房源管理',
      path: '/houses',
      icon: 'HomeOutlined',
      access: 'canAccess',
      routes: [
        {
          path: '/houses',
          redirect: '/houses/list',
        },
        {
          name: '房源列表',
          path: '/houses/list',
          component: './Houses/List',
        },
        {
          name: '添加房源',
          path: '/houses/add',
          component: './Houses/Add',
        },
        {
          name: '房源详情',
          path: '/houses/detail/:id',
          component: './Houses/Detail',
          hideInMenu: true,
        },
      ],
    },
    {
      name: '客户管理',
      path: '/tenants',
      icon: 'UserOutlined',
      access: 'canAccess',
      routes: [
        {
          path: '/tenants',
          redirect: '/tenants/list',
        },
        {
          name: '客户列表',
          path: '/tenants/list',
          component: './Tenants/List',
        },
        {
          name: '添加客户',
          path: '/tenants/add',
          component: './Tenants/Add',
        },
        {
          name: '咨询跟进',
          path: '/tenants/consultation',
          component: './Tenants/Consultation',
        },
        {
          name: '预约看房',
          path: '/tenants/appointments',
          component: './Tenants/Appointments',
        },
        {
          name: '客户详情',
          path: '/tenants/detail/:id',
          component: './Tenants/Detail',
          hideInMenu: true,
        },
      ],
    },
    {
      name: '合同管理',
      path: '/contracts',
      icon: 'FileTextOutlined',
      access: 'canAccess',
      routes: [
        {
          path: '/contracts',
          redirect: '/contracts/list',
        },
        {
          name: '合同列表',
          path: '/contracts/list',
          component: './Contracts/List',
        },
        {
          name: '合同详情',
          path: '/contracts/detail/:id',
          component: './Contracts/Detail',
          hideInMenu: true,
        },
      ],
    },
    {
      name: '业绩统计',
      path: '/statistics',
      component: './Statistics',
      icon: 'BarChartOutlined',
      access: 'canAccess',
    },
    {
      name: '系统管理',
      path: '/system',
      icon: 'SettingOutlined',
      access: 'isAdmin',
      routes: [
        {
          path: '/system',
          redirect: '/system/users',
        },
        {
          name: '用户管理',
          path: '/system/users',
          component: './Users/List',
        },
      ],
    },
    {
      name: '个人中心',
      path: '/user',
      component: './User',
      hideInMenu: true,
      access: 'canAccess',
    },
  ],
  npmClient: 'pnpm',
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    },
  },
});
