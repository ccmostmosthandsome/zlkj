import router from './router'
// import { getToken } from './utils/auth'
import axios from './http/http.js'
import Cookies from 'js-cookie'
import store from '@/store/index.js'
// import { mapMutations } from 'vuex'

// no redirect白名单
// const whiteList = ['/', '/login']
// redirect名单
const restrictList = ['/upload', '/model', '/photo', '/profile']

router.beforeEach((to, from, next) => {
  // store.commit('updateLoadingStatus', {isLoading: true})
  // store.mapMutations(['updateLoadingStatus'])
  // console.log(store)
  store._mutations.updateLoadingStatus[0]({isLoading: true})

  if (store.state.user.isLogin) {
    // 已经登录
    if (to.path === '/login') {

      next({ path: '/' })
    } else {

      next()
    }
  } else {
    // 未登录，刷新
    if (Cookies.get('token')) {

      axios({
        method: 'post',
        url: 'checkLogin.php',
        data: {
          token: Cookies.get('token')
        }
      }).then((res) => {

        console.log(res)
        
        if (res.data.code === 1) {

          store.state.user.isLogin = true

          store.state.user.userInfo = res.data.data
          
          if (to.path === '/login') {

            next({ path: '/' })
          } else {

            next()
          }
        } else {
          // token过期，先登录
          next({ name: 'login', params: { toPath: to.path } })
        }
      }).catch((err) => {

        console.log(err)
      })
    } else {

      // if (whiteList.indexOf(to.path) !== -1) {

      //   next()
      // } else {
      //   // 否则重定向到登录页
      //   // next('/login')
      //   // 调用next时传递参数
      //   // next({path: '/login', query: { toPath: to.path }})
      //   next({ name: 'login', params: { toPath: to.path }})
      // }

      if (restrictList.indexOf(to.path) !== -1) {
        // console.log(to)
        next({ name: 'login', params: { toPath: to.path } })
      } else {

        next()
      }
    }
  }
})

router.afterEach(function (to) {

  // store.commit('updateLoadingStatus', {isLoading: false})
  store._mutations.updateLoadingStatus[0]({isLoading: false})
})
