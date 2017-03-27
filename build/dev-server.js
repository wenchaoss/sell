var path = require('path')
var express = require('express')
var webpack = require('webpack')
var config = require('../config')
var router = require('../controller/router')
var session = require('express-session');
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

//数据库连接
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sell');
// var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
//   replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
// var uri = 'mongodb://wenchao:yezizhuhao293@ds153689.mlab.com:53689/webmongo/sell';
// mongoose.connect('mongodb://wenchao293:yezizhuhao293@ds153689.mlab.com:53689/webmongo')
// mongoose.connect(uri,options);
var app = express()
//设置session
app.use(session({
  secret: 'houtai',
  // 过期时间，10天
  expires : new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
  // 两个默认的配置，API要求
  resave: false,
  saveUninitialized: true
}));

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable


//定义mock数据请求
var appData = require('../data.json');
var allseller = require('../allseller.json');
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

var apiRoutes = express.Router();
// apiRoutes.get('/seller',function (req,res) {
//   res.json({
//     errno: 0,
//     data: seller
//   });
// })
// apiRoutes.get('/goods',function (req,res) {
//   res.json({
//     errno: 0,
//     data: goods
//   });
// })
// apiRoutes.get('/ratings',function (req,res) {
//   res.json({
//     errno: 0,
//     data: ratings
//   });
// })
// apiRoutes.get('/allSeller',function (req,res) {
//   res.json({
//     errno: 0,
//     data: allseller
//   });
// })
apiRoutes.get('/allSeller',router.allSeller)
//业务逻辑
apiRoutes.get('/checkLogin',router.checkLogin);
apiRoutes.post('/login',router.login);
apiRoutes.get('/logout',router.logout);
apiRoutes.get("/checkexist",router.checkExist);
apiRoutes.post('/createuser',router.createuser);
apiRoutes.post('/pay',router.pay);
apiRoutes.get('/addorder',router.addorder);
apiRoutes.get('/getorderlist',router.getorderlist);
apiRoutes.get('/getsellerorder',router.getsellerorder);
apiRoutes.get('/changephone',router.changephone);
apiRoutes.post('/addaddress',router.addaddress);
apiRoutes.get('/changeadr',router.changeadr);
apiRoutes.get('/deleteadr',router.deleteadr);
apiRoutes.get('/jiedan',router.jiedan);
apiRoutes.get('/paisong',router.paisong);
apiRoutes.get('/shouhuo',router.shouhuo);
apiRoutes.post('/subrating',router.subrating);
apiRoutes.post('/addinfo',router.addinfo);
apiRoutes.get('/deinfo',router.deinfo);
apiRoutes.post('/changebaseinfo',router.changebaseinfo);
apiRoutes.post('/changebulletin',router.changebulletin);
apiRoutes.post('/addType',router.addType);
apiRoutes.get('/removeType',router.removeType);
apiRoutes.post('/changegood',router.changegood);


app.use(apiRoutes);






var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
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
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
