import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)
export const constantRouterMap = [
  {path: '/login', component: _import('login/index'), hidden: true},
  {path: '/signin', component: _import('app/signIn'), hidden: true},
  {path: '/404', component: _import('404'), hidden: true},
  {
    path: '/',
    component: Layout,
    redirect: '/personal/',
    name: '首页',
    hidden: true,
    children: [{
      path: 'MyPage', component: _import('personal/MyPage')
    }]
  }
]
export default new Router({
  mode: 'hash', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  ///一级菜单  个人中心
  {
    path: '/personal',
    component: Layout,
    redirect: '/personal/',
    name: '',
    meta: {title: '个人中心', icon: 'star'},
    children: [
      {
        path: '',
        name: '我的首页',
        component: _import('personal/MyPage'),
        meta: {title: '我的首页', icon: 'home'},
        menu: 'MyPage'
      },
      {
        path: 'MyInfo',
        name: '我的信息',
        component: _import('personal/MyInfo'),
        meta: {title: '我的信息', icon: 'edit'},
        menu: 'MyPage'
      },
    ]
  },

  ///一级菜单  课程中心
  {
    path: '/courses',
    component: Layout,
    redirect: '/courses/',
    name: '',
    meta: {title: '课程中心', icon: 'calendar-check'},
    children: [

      {
        path: 'CourseType',
        name: '课程种类',
        component: _import('courses/CourseType'),
        meta: {title: '课程种类', icon: 'gold'},
        menu: 'CourseType'
      },
      {
        path: '',
        name: '课程管理',
        component: _import('courses/Course'),
        meta: {title: '课程管理', icon: 'detail'},
        menu: 'cos'
      },
      {
        path: 'Class',
        name: '班级管理',
        component: _import('courses/Class'),
        meta: {title: '班级管理', icon: 'team'},
        menu: 'class'
      },
      {
        path: 'CourseSchedule',
        name: '课程表',
        component: _import('courses/CourseSchedule'),
        meta: {title: '课程表', icon: 'gold'},
        menu: 'schd'
      },
      {
        path: 'CourseSignIn',
        name: '课程签到',
        component: _import('courses/CourseSignIn'),
        meta: {title: '课程签到', icon: 'check'},
        menu: 'sign'
      },
      {
        path: 'CourseCalendar',
        name: '课程日历',
        component: _import('courses/CourseCalendar'),
        meta: {title: '课程日历', icon: 'calendar'},
        menu: 'CourseCalendar'
      },
      {
        path: 'ClassPhoto',
        name: '班级合影',
        component: _import('courses/ClassPhoto'),
        meta: {title: '班级合影', icon: 'camera'},
        menu: 'ClassPhoto'
      },
    ]
  },

  ///一级菜单  作业中心
  {
    path: '/homework',
    component: Layout,
    redirect: '/homework/',
    name: '',
    meta: {title: '作业中心', icon: 'read'},
    children: [
      {
        path: '',
        name: '我的作业',
        component: _import('homework/MyHomework'),
        meta: {title: '我的作业', icon: 'file-word'},
        menu: 'hwk'
      },
      {
        path: 'HomeworkRemark',
        name: '作业评阅',
        component: _import('homework/HomeworkRemark'),
        meta: {title: '作业评阅', icon: 'audit'},
        menu: 'hwkR'
      },
      {
        path: 'HomeworkStatistics',
        name: '作业完成情况',
        component: _import('homework/HomeworkStatistics'),
        meta: {title: '作业完成情况', icon: 'ordered list'},
        menu: 'HomeworkStatistics'
      },
    ]
  },

  ///一级菜单  系统管理
  {
    path: '/settings',
    component: Layout,
    redirect: '/settings/',
    name: '',
    meta: {title: '系统管理', icon: 'setting'},
    children: [
      {
        path: '',
        name: '用户列表',
        component: _import('user/user'),
        meta: {title: '用户列表', icon: 'user2'},
        menu: 'user'
      },
      {
        path: 'role',
        name: '权限管理',
        component: _import('user/role'),
        meta: {title: '权限管理', icon: 'lock'},
        menu: 'role'
      },
      {
        path: 'organizer',
        name: '承办方',
        component: _import('user/organizer'),
        meta: {title: '承办方', icon: 'team'},
        menu: 'org'
      },
    ]
  },


  // {
  //   path: '/user',
  //   component: Layout,
  //   redirect: '/user/',
  //   name: '',
  //   meta: {title: '用户权限', icon: 'table'},
  //   children: [
  //
  //   ]
  // },
  ///原菜单
  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/article',
  //   name: '功能模块',
  //   meta: {title: '功能模块', icon: 'tree'},
  //   children: [
  //
  //   ]
  // },

  {path: '*', redirect: '/404', hidden: true}
]
