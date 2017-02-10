var formidable = require("formidable");
var fs = require("fs");
var crypto = require("crypto");             //加密
var url = require("url");

var Seller = require('../models/Seller');
var User = require('../models/User');
var Order = require('../models/Order');

//检查是否登录
exports.checkLogin = function(req,res){
  if(req.session.login == true){
    res.send({
      data: {
        username: req.session.username,
        type: req.session.usertype
      },
      errno: 0
    })
  }else{
    res.send({
      data: {
        username: '',
        type: true
      },
      errno: 0
    })
  }
};
//登陆
//-1服务器错误
//-2没有这个用户
//-3密码不正确
//1登陆成功
exports.login = function (req,res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){
    if(err){
      res.send("-1");
      return;
    }
    var hash = crypto.createHash("sha256");
    var username = fields.username;
    var password = fields.password;
    var passwordSha256 = hash.update(password).digest("hex");
    var type = fields.logintype;
    if(type) {
      User.find({'username': username},function (err ,results) {
        if(err) { res.send("-1"); return;}
        if(results.length == 0){
          res.send("-2");
          return;
        }
        if(results[0].password != passwordSha256){
          res.send("-3");
          return;
        }
        req.session.login = true;
        req.session.username = username;
        req.session.usertype = true;      //用户状态为用户，false为商家
        res.send( {
          username: results[0].username,
          type: type
        });
      })
    }else{
      Seller.find({'seller.username': username},function (err,results) {
        if(err) { res.send("-1"); return;}
        if(results.length == 0){
          res.send("-2");
          return;
        }
        if(results[0].seller.password != passwordSha256){
          res.send("-3");
          return;
        }
        req.session.login = true;
        req.session.username = username;
        req.session.usertype = false;      //用户状态为用户，false为商家
        res.send( {
          username: results[0].seller.username,
          type: type
        });
      })
    }
  })
}

//登出
exports.logout = function(req,res){
  req.session.login = false;
  req.session.username = null;
  res.send('1');
}
//检查注册邮箱是否被占用
exports.checkExist = function(req,res){
  var username = req.query.username;
  var type = req.query.subtype;     //true用户 false商家
  // console.log(username)
  if(type == 'true') {
    User.checkExist(username,function(bollean){
      res.send(bollean.toString());
    })
  }else if(type == 'false'){
    Seller.checkExist(username,function(bollean){
      res.send(bollean.toString());
    })
  }

}

//创建用户
//-1服务器错误
//1成功
exports.createuser = function(req,res){
  var form = new formidable.IncomingForm();
  form.parse(req,function(err,fields,files){
    if(err){
      res.send("-1");
      return;
    }
    var hash = crypto.createHash("sha256");
    var passwordSha256 = hash.update(fields.password).digest("hex");
    var type = fields.subtype;
    console.log(type)
    if(type == 'true') {
      var u = new User({
        "username": fields.username,
        "password": passwordSha256
      });
      u.save(function(err){
        if(err){
          res.send("-1");
          return;
        }
        res.send("1");
      })
    }else if(type == 'false'){
      var s = new Seller({
        "seller": {
          "username": fields.username,
          "password": passwordSha256,
          "checkout": 1
        },
        "goods": [],
        "ratings": []
      });
      s.save(function(err){
        if(err){
          res.send("-1");
          return;
        }
        res.send("1");
      })
    }
    //给第二家设置调试账号密码   dierjia   yezizhuhao
    // Seller.find({'seller.name': '第二家'},function (err, results) {
    //   if(err) { res.send("-1"); return;}
    //   results[0].seller.username = fields.username;
    //   results[0].seller.password = passwordSha256;
    //   results[0].save()
    // })
  })
};

var setDateString = function () {

  return new Date().getFullYear().toString() + (new Date().getMonth() <9 ? ('0' + (new Date().getMonth()+1).toString()) : (new Date().getMonth()+1).toString()).toString() + (new Date().getDate() <9 ? ('0' + (new Date().getDate()).toString()) : (new Date().getDate()).toString()).toString() + (parseInt(Math.random()*10000)).toString()

}
//支付创建订单
//-1服务器错误
//返回订单mongo _id成功
exports.pay = function (req,res) {
  var form = new formidable.IncomingForm();
  form.parse(req,function(err,fields,files){
    if(err){
      res.send("-1");
      return;
    }
    var order = fields;
    order.date = +new Date();
    order.ordernumber = setDateString();
    order.process = 0;
    var v = new Order(order);
    v.save(function(err){
      if(err){
        res.send("-1");
        return;
      }
      res.send(v._id);
    })

  })
}

//为用户增加订单
exports.addorder = function (req,res) {
  var id = req.query.id;
  User.find({'username': req.session.username},function (err,results) {
    if(err){res.send("-1");return;}
    results[0].order.push(id);
    results[0].save(function () {
      res.send("1")
    })

  })
}

//获取订单列表
exports.getorderlist = function (req,res) {
  User.find({'username': req.session.username},function (err,results) {
    if(err){res.send("-1");return;}
    var orderlistid = results[0].order;
    Order.find()
      .where('_id').in(orderlistid)
      .exec(function (err,results) {
        res.send(results)
      })

  })
}

exports.allSeller = function (req,res) {
  Seller.find({},function (err,results) {
    if(err){res.send("-1");return;}
    res.json({
      errno: 0,
      data: results
    })
  })
}
// exports.getSeller = function (req,res) {
//   Seller.find({"seller.name": "第二个商家"},function (err,results) {
//     if(err){
//       res.send("-1");
//       return;
//     }
//     res.json({
//       errno: 0,
//       data: results[0].seller
//     })
//   })
// }
// exports.getGoods = function (req,res) {
//   Seller.find({'seller.name': '第二个商家'},function (err,results) {
//     if(err){
//       res.send("-1");
//       return;
//     }
//     res.json({
//       errno: 0,
//       data: results[0].goods
//     })
//   })
// }
// exports.getRatings = function (req,res) {
//   Seller.find({'seller.name': '第二个商家'},function (err,results) {
//     if(err){
//       res.send("-1");
//       return;
//     }
//     res.json({
//       errno: 0,
//       data: results[0].ratings
//     })
//   })
// }
