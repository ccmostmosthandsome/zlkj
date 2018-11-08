import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/views/layout/layout.vue'
import Home from '@/views/home/index.vue'
// import Login from '@/views/login/index.vue'
import loginPrimary from '@/views/login/loginPrimary.vue'
import Register from '@/views/register/index.vue'
import PasswordReset from '@/views/password_reset/index.vue'

import a from '@/views/a'
import b from '@/views/b'
import empty from '@/views/empty.vue'
import c1 from '@/views/c1.vue'
import c2 from '@/views/c2.vue'
import c3 from '@/views/c3.vue'
import c4 from '@/views/c4.vue'
import c5 from '@/views/c5.vue'
import c6 from '@/views/c6.vue'
import c7 from '@/views/c7.vue'
import c8 from '@/views/c8.vue'
import c9 from '@/views/c9.vue'
import c10 from '@/views/c10.vue'
import d1 from '@/views/d1.vue'
import d2 from '@/views/d2.vue'
import d3 from '@/views/d3.vue'
import d4 from '@/views/d4.vue'
import e from '@/views/e'
import f from '@/views/f'
import g from '@/views/g'
// import h from '@/views/h'
import Tree from '@/views/tree'

import Upload from '@/views/upload/index.vue'
import Model from '@/views/model/index.vue'
import Photo from '@/views/photo/index.vue'
import Profile from '@/views/profile/index.vue'

import NotFound from '@/views/404/index.vue'

// r就是resolve  路由懒加载
// const Model = r => require.ensure([], () => r(require('@/views/model/index.vue')), 'Model')

Vue.use(Router)

const routes = [
  {
    path: '',
    component: Layout,
    children: [{
      name: 'home',
      path: '',
      component: Home
    }, {
      name: 'upload',
      path: 'upload',
      component: Upload
    }, {
      name: 'model',
      path: 'model',
      component: Model
    }, {
      name: 'photo',
      path: 'photo',
      component: Photo
    }, {
      name: 'profile',
      path: 'profile',
      component: Profile
    }, {
      name: 'passwordReset',
      path: 'password_reset',
      component: PasswordReset
    }]
  }, {
    name: 'login',
    path: '/login',
    // component: Login
    component: loginPrimary
  }, {
    name: 'register',
    path: '/register',
    component: Register
  }, {
    path: '/a',
    component: a
  }, {
    path: '/b',
    component: b
  }, {
    path: '/c',
    component: empty,
    children: [{
      path: '1',
      component: c1
    }, {
      path: '2',
      component: c2
    }, {
      path: '3',
      component: c3
    }, {
      path: '4',
      component: c4
    }, {
      path: '5',
      component: c5
    }, {
      path: '6',
      component: c6
    }, {
      path: '7',
      component: c7
    }, {
      path: '8',
      component: c8
    }, {
      path: '9',
      component: c9
    }, {
      path: '10',
      component: c10
    }]
  }, {
    path: '/d',
    component: empty,
    children: [{
      path: '1',
      component: d1
    }, {
      path: '2',
      component: d2
    }, {
      path: '3',
      component: d3
    }, {
      path: '4',
      component: d4
    }]
  }, {
    path: '/e',
    component: e
  }, {
    path: '/f',
    component: f
  }, {
    path: '/g',
    component: g
  },
  // {
  //   path: '/h',
  //   component: h
  // },
  {
    path: '/tree',
    component: Tree,
    name: 'Tree'
  }, {
    path: '*',
    component: NotFound,
    name: '404'
  }
]

export default new Router({
  mode: 'history',
  routes
})

// const { href } = this.$router.resolve({
//   name: 'foo',
//   query: {
//     bar
//   }
// })
// window.open(href, '_blank')
// 2.1.0版本后，使用路由对象的resolve方法解析路由，可以得到location、router、href等目标路由的信息。得到href就可以使用window.open开新窗口了。
