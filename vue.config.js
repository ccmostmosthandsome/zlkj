const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

const debug = process.env.NODE_ENV !== 'production'
let cesiumSource = './node_modules/cesium/Source'
let cesiumWorkers = '../Build/Cesium/Workers'
module.exports = {
  // baseUrl: '',
  // devServer: {
  //   port: 8080
  // },
  configureWebpack: {
    output: {
      sourcePrefix: ' '
    },
    amd: {
      toUrlUndefined: true
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': path.resolve('src'),
        'cesium': path.resolve(__dirname, cesiumSource)
      }
    },
    // plugins: [
    //   new CopyWebpackPlugin([ { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers'}]),
    //   new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Assets'), to: 'Assets'}]),
    //   new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets'}]),
    //   new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers'}]),
    //   // copy custom static assets
    //   // new CopyWebpackPlugin([
    //   //   {
    //   //     from: path.resolve(__dirname, 'b3dm'),
    //   //     // to: config.dev.assetsSubDirectory,
    //   //     to: 'b3dm',
    //   //     ignore: ['.*']
    //   //   }
    //   // ]),
    //   // new webpack.DefinePlugin({
    //   //   CESIUM_BASE_URL: JSON.stringify('./'),
    //   // })
    // ],
    module: {
      unknownContextCritical: /^.\/.*$/,
      unknownContextCritical: false
    }
  },
  // pages: {
  //   index: {
  //     // entry for the page page的入口
  //     // entry: 'src/login/login.js',
  //     entry: 'src/router/index.js',
  //     // the source template模板来源
  //     // title: "Login page",
  //     // template: 'src/login/login.html',
  //     template: 'public/index.html',
  //     // output as dist/index.html
  //     // 在 dist/index.html 的输出
  //     filename: 'index.html',
  //     // 当使用 title 选项时，
  //     // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
  //     title: '筑理软件',
  //     // 在这个页面中包含的块，默认情况下会包含
  //     // 提取出来的通用 chunk 和 vendor chunk。
  //     chunks: ['chunk-vendors', 'chunk-common', 'index']
  //   },
  //   // main: {
  //   //   entry: 'src/main.js',
  //   //   // title: "main page",
  //   //   template: 'src/index.html',
  //   //   filename: 'main.html',
  //   //   chunks: ['app']
  //   // }
  //   // 当使用只有入口的字符串格式时，
  //   // 模板会被推导为 `public/subpage.html`
  //   // 并且如果找不到的话，就回退到 `public/index.html`。
  //   // 输出文件名会被推导为 `subpage.html`。
  //   subpage: 'src/subpage/main.js'
  // }
}
