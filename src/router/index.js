import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/projectManage', component: _import('projectManage/index'), hidden: true },
  { path: '/user_manage', component: _import('user_manage/index'), hidden: true },
  { path: '/register', component: _import('register/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'projectManage',
    hidden: true,
    children: [{
      path: 'projectManage',
      component: _import('projectManage/index'),
      name: 'projectManage',
      meta: { title: 'projectManage', noCache: true }
    }]
  },
  {
    path: '/dashboard',
    component: Layout,
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  /* { path: '*', redirect: '/404', hidden: true },
  {
    path: '/components',
    component: Layout,
    children: [{ path: 'index', component: _import('components/index'), name: 'components', meta: { title: 'components', icon: 'components1' }}]
  },
  {
    path: '/componentTypes',
    component: Layout,
    hidden: true,
    children: [{ path: 'index', component: _import('componentTypes/index'), name: 'componentTypes', meta: { title: 'componentTypes', icon: 'components1' }}]
  },
  {
    path: '/device',
    component: Layout,
    children: [{ path: 'device', component: _import('device/device'), name: 'device', meta: { title: 'device', icon: 'computer' }}]
  },
  {
    path: '/scan',
    component: Layout,
    children: [{ path: 'index', component: _import('scan/index'), name: 'scan', meta: { title: 'scan', icon: 'scan2' }}]
  },
  {
    path: '/log',
    component: Layout,
    children: [{ path: 'index', component: _import('log/index'), name: 'log', meta: { title: 'log', icon: 'log' }}]
  },
  {
    path: '/softPackage',
    component: Layout,
    children: [{ path: 'index', component: _import('softPackage/index'), name: 'softPackage', meta: { title: 'softPackage', icon: 'package' }}]
  },
  {
    path: '/deployPlan',
    component: Layout,
    children: [{ path: 'deployPlan', component: _import('deployPlan/deployPlan'), name: 'deployPlan', meta: { title: 'deployPlan', icon: 'example' }}]
  },
  {
    path: '/deployPlanDetail',
    component: Layout,
    hidden: true,
    children: [{ path: 'deployPlanDetail/:id', component: _import('deployPlanDetail/deployPlanDetail'), name: 'deployPlanDetail', meta: { title: 'deployPlanDetail', icon: 'example' }}]
  },
  {
    path: '/deployBind',
    component: Layout,
    hidden: true,
    children: [{ path: 'deployBind/:id', component: _import('deployBind/deployBind'), name: 'deployBind', meta: { title: 'deployBind', icon: 'example' }}]
  },
  {
    path: '/usermanage',
    component: Layout,
    meta: {
      title: 'usermanage',
      roles: ['admin'] // or you can only set roles in sub nav
    },
    children: [{ path: 'index', component: _import('usermanage/index'), name: 'usermanage', meta: { title: 'usermanage', icon: 'peoples' }}]
  },
  {
    path: '/project',
    component: Layout,
    children: [{ path: 'project', component: _import('project/project'), name: 'project', meta: { title: 'project', icon: 'excel' }}]
  },
  {
    path: '/deploy',
    component: Layout,
    children: [{ path: 'deploy/:id', component: _import('deploy/deploy'), name: 'deploy', meta: { title: 'deploy', icon: 'excel' }}]
  },
  {
    path: '/baseline',
    component: Layout,
    children: [{ path: 'baseline', component: _import('baseline/baseline'), name: 'baseline', meta: { title: 'baseline', icon: 'example' }}]
  }*/
]
