# vue-multi-page

>This is a project based on vue-cli transformation



``` 
这是一个基于vue-cli改造的一个vue多页应用脚手架,废话不多说。
首先 
npm i vue-cli -g
vue init webpack initrep
cd initrep&&npm i or cd initrep&&cnpm i or cd initrep&&yarn
```
```
首先我们先打开build里的utils.js
在path下面引入
var glob = require('glob')
然后在底部加入
exports.getEntries = function (globPath) {
  var entries = {}
  glob.sync(globPath).forEach(function (entry) {
    var basename = path.basename(entry, path.extname(entry), 'router.js') // 过滤router.js
    var tmp = entry.split('/').splice(-3)
    var moduleName = tmp.slice(1, 2);
    entries[moduleName] = entry
  });
  return entries;
}
这是通过glob中间件(一个全局的中间件,可以理解为fs模块)
这个方法可以收集到路径
有兴趣的可以console一下
```
```
打开webpack.base.conf
 entry: utils.getEntries('./src/module/**/*.js'),
 把入口改为这个
 打开webpack.dev.conf
 在底部加入这个，将脚手架原有的HtmlWebpackPlugin删掉
 var pages = utils.getEntries('./src/module/**/*.html')
for(var page in pages) {
  var conf = {
    //文件名
    filename: page+'.html',
    //路径
    template: pages[page],
    //注入
    inject: true,
    excludeChunks: Object.keys(pages).filter(item => {
      return (item != page)
    })
  }
  module.exports.plugins.push(new HtmlWebpackPlugin(conf))
}
```
```
打开webpack.prod.conf
在底部加入这个
var pages = utils.getEntries('./src/module/**/*.html')
for(var page in pages) {
  // 配置生成的html文件，定义路径等
  var conf = {
    filename: page + '.html',
    template: pages[page], //模板路径
    inject: true,
    chunksSortMode: 'dependency',
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    },
    excludeChunks: Object.keys(pages).filter(item => {
      return (item != page)
    })
  }
  module.exports.plugins.push(new HtmlWebpackPlugin(conf))
}
现在就可以npm run dev了
可以通过http://127.0.0.1:8080/模块名.html(是module内的模块文件夹名字)
如果觉得这样访问比较麻烦 请打开源码的dev-server 54行进行查看如何修改
###End
```