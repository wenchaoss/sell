var formidable = require("formidable");
var fs = require("fs");
var crypto = require("crypto");             //加密
var url = require("url");

var Seller = require('../models/Seller');
var User = require('../models/User');

//检查是否登录
exports.checkLogin = function(req,res){
  if(req.session.login == true){
    res.send({
      data: req.session.username,
      errno: 0
    })
  }else{
    res.send({
      data: '',
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
    if(type){
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
        res.send(results[0].username);
      })
    }else{
      res.send("-1");
      return;
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
  if(type){
    User.checkExist(username,function(bollean){
      res.send(bollean.toString());
    })
  }else {
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
    if(type) {
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
    }else{
      var s = new Seller({
        "username": fields.username,
        "password": passwordSha256
      });
      s.save(function(err){
        if(err){
          res.send("-1");
          return;
        }
        res.send("1");
      })
    }

  })
};

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
