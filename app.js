var express = require('express');
var config = require('./config/index');
var app = express();
var router = require('./controller/router.js');
var session = require('express-session');
var indexRouter = express.Router();
var Seller = require('./models/Seller');

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

app.get('/seller',router.getSeller);
app.get('/goods',router.getGoods);
app.get('/ratings',router.getRatings);

indexRouter.get('/', function (req, res, next) {
  req.url = '/index.html';
  next();
});

app.use(indexRouter);


app.use(express.static("./dist"));
app.listen(3003);
console.log('Listening at http://localhost:3003')
