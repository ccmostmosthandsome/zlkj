import axios from 'axios'

const instance = new axios.create({
  // baseURL: 'http://local.guihuao.com/earth/',
  // baseURL: '/ghoapi/',
  // baseURL: 'http://192.168.1.188/Earth/PHP/',
  // baseURL: 'zlkj',
  baseURL: 'http://www.ardea.cn/Earth/PHP/',
  timeout: 5000,
  header: {
    'Content-type': 'application/x-www-form-urlencoded'
  },
  transformRequest: [function (data, headers) {
    // Do whatever you want to transform the data
    let ret = ''
    for (let key in data) {
      ret += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
    }
    return ret
  }]
})

export default instance