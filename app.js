var express = require('express');
var config = require('./config/index');
var app = express();
var router = require('./controller/router.js');
var session = require('express-session');
var indexRouter = express.Router();

//数据库连接
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sell');
//设置session
app.use(session({
  secret: 'houtai',
  // 过期时间，10天
  expires : new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
  // 两个默认的配置，API要求
  resave: false,
  saveUninitialized: true
}));

indexRouter.get('/', function (req, res, next) {
  req.url = '/index.html';
  next();
});

app.use(indexRouter);

var appData = require('./data2.json');
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

var apiRoutes = express.Router();

apiRoutes.get('/seller', function (req, res) {
  res.json({
    errno: 0,
    data: seller
  });
});

apiRoutes.get('/goods', function (req, res) {
  res.json({
    errno: 0,
    data: goods
  });
});

apiRoutes.get('/ratings', function (req, res) {
  res.json({
    errno: 0,
    data: ratings
  });
});

app.use('/api', apiRoutes);


app.use(express.static("./dist"));
app.listen(3003);
console.log('Listening at http://localhost:3003')
