require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
var uilts = require('./utils')
var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
const router = express.Router()
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})
// 由于是多页应用 没有了主路由
// 访问页面还需要增加.html后缀
// 修改connect-history-api-fallback 可以解决这一问题
// to 里面的html名字是模块的名字,不是你模块内的名字
// 为了达到你的前端路由和你修改的history路由一样  请将各个模块里的router里加一个配置
/*
如]
export default new VueRouter({
  mode: 'history',
  base: '/pc',
  routes
})
如果模块过多的话,请使用utils内的方法*/
/*const rewrites = {
  rewrites: []
  }*/
//var pages = utils.getEntries('./src/module/**/*.html')
/*for(page in pages){
  rewrites.rewrites.push(  { from: '/'+page+'/', to: '/'+page+'.html' },  { from: '/'+page+'.html', to: '/'+page+'/' })
}
*/ 
const root = __dirname + '/src'
app.use(express.static(root));
const rewrites = {
  rewrites: [
      { from: '/pc/', to: '/pc.html' },
      { from: '/mobile/', to: '/mobile.html' }
    ]
}

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')(rewrites))
// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
