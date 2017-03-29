var formidable = require("formidable");
var fs = require("fs");
var crypto = require("crypto");             //加密
var url = require("url");
var _ = require("underscore");

var Seller = require('../models/Seller');
var User = require('../models/User');
var Order = require('../models/Order');

//检查是否登录
exports.checkLogin = function(req,res){
  if(req.session.login == true){
    if(req.session.usertype) {
      User.find({'username': req.session.username},function (err ,results) {
        if(err) { res.send("-1"); return;}
        res.send( {
          username: results[0].username,
          type: req.session.usertype,
          order:  results[0].order,
          phone: results[0].phone,
          address: results[0].address
        });
      })
    }else {
      Seller.find({'seller.username': req.session.username},function (err,results) {
        if(err) { res.send("-1"); return;}
        res.send( {
          username: results[0].seller.username,
          type: req.session.usertype,
          seller: results[0].seller,
          ratings: results[0].ratings,
          goods: results[0].goods
        });
      })
    }
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
          type: type,
          order:  results[0].order,
          phone: results[0].phone,
          address: results[0].address
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
        req.session._id = results[0]._id;
        req.session.usertype = false;      //用户状态为用户，false为商家
        res.send( {
          username: results[0].seller.username,
          type: type,
          seller: results[0].seller,
          ratings: results[0].ratings,
          goods: results[0].goods
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
  // if(!req.session.type) {return;}
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
//获取商家订单列表
exports.getsellerorder = function (req,res) {
  if(!req.session._id) {return;}
  Order.find({'seller_id': req.session._id},function (err,results) {
    if(err){res.send("-1");return;}
    res.send(results)
  })
}
//修改用户手机号
exports.changephone = function (req,res) {
  var phone = req.query.phone;
  User.find({"username": req.session.username},function (err,results) {
    if(err){res.send("-1");return;}
    console.log(results)
    results[0].phone = phone;
    results[0].save(function () {
      res.send("1")
    });
  })
}
//增加收货地址
exports.addaddress = function (req,res) {
  var form = new formidable.IncomingForm();
  form.parse(req,function(err,fields,files){
    if(err){
      res.send("-1");
      return;
    }
    var address = fields.address;
    User.find({"username": req.session.username},function (err,results) {
      if(err){res.send("-1");return;}
      results[0].address.push(address);
      results[0].save();
      res.send("1")
    })

  })
}
//修改收货地址
exports.changeadr = function (req,res) {
  var num = req.query.num;
  User.find({"username": req.session.username},function (err,results) {
    if(err){res.send("-1");return;}
    var i = results[0].address.splice(num,1);
    results[0].address.unshift(i);
    results[0].save();
    res.send("1")
  })
}
//删除收货地址
exports.deleteadr = function (req,res) {
  var num = req.query.num;
  User.find({"username": req.session.username},function (err,results) {
    if(err){res.send("-1");return;}
    results[0].address.splice(num,1);
    results[0].save();
    res.send("1")
  })
}
//接单
exports.jiedan = function (req,res) {
  var num = req.query.num;
  Order.find({"_id":num},function (err,results) {
    if(err){res.send("-1");return;}
    results[0].process = 1;
    results[0].save();
    res.send("1")
  })
}
//派送
exports.paisong = function (req,res) {
  var num = req.query.num;
  Order.find({"_id":num},function (err,results) {
    if(err){res.send("-1");return;}
    results[0].process = 2;
    results[0].save();
    res.send("1")
  })
}
//收货
exports.shouhuo = function (req,res) {
  var num = req.query.num;
  Order.find({"_id":num},function (err,results) {
    if(err){res.send("-1");return;}
    results[0].process = 3;
    results[0].save();
    res.send("1")
  })
}
//发表评论
exports.subrating = function (req,res) {
  var form = new formidable.IncomingForm();
  form.parse(req,function(err,fields,files){
    if(err){
      res.send("-1");
      return;
    }
    var rating = fields;
    var foods = fields.recommend;
    var orderid = fields.orderId;
    Seller.find({"_id": rating.seller_id},function (err,results) {
      if(err){res.send("-1");return;}
      results[0].ratings.push(rating);
      foods.forEach(function (v,i,arr) {
        results[0].goods.forEach(function (_v,_i,_arr) {
          _v.foods.forEach(function (__v,__i,__arr) {
            if(__v.name === v){
              results[0].goods[_i].foods[__i].ratings.push(rating);
            }
          })
        })
      })
      results[0].save();
      Order.find({"_id": orderid},function (err,doc) {
        if(err){res.send("-2");return;}
        doc[0].process = 5;
        doc[0].rating = rating;
        doc[0].save();
        res.send("1")
      })
    })
  })
}
//增加商家信息
exports.addinfo = function (req,res) {
  var form = new formidable.IncomingForm();
  form.parse(req,function(err,fields,files){
    if(err){
      res.send("-1");
      return;
    }
    var info = fields.info;
    Seller.find({"_id": req.session._id},function (err,results) {
      if(err){res.send("-1");}
      // console.log(info,results[0].seller)
      results[0].seller.infos.push(info);
      results[0].save();
      res.send("1");
    })

  })
}
//删除商家信息
exports.deinfo = function (req,res) {
  var num = req.query.num;
  Seller.find({"_id": req.session._id},function (err,results) {
    if(err){res.send("-1");return;}
    results[0].seller.infos.splice(num,1);
    results[0].save();
    res.send("1")
  })
}
//修改商家基础信息
exports.changebaseinfo = function (req,res) {
  var form = new formidable.IncomingForm();
  form.parse(req,function(err,fields,files){
    if(err){
      res.send("-1");
      return;
    }
    Seller.find({"_id": req.session._id},function (err,results) {
      if(err){res.send("-1");}
      // console.log(info,results[0].seller)
      results[0].seller.deliveryPrice = fields.deliveryPrice
      results[0].seller.name = fields.name;
      results[0].seller.description = fields.description;
      results[0].seller.minPrice = fields.minPrice;
      results[0].save();
      res.send("1");
    })

  })
}
//修改商家公告
exports.changebulletin = function (req,res) {
  var form = new formidable.IncomingForm();
  form.parse(req,function(err,fields,files){
    if(err){
      res.send("-1");
      return;
    }
    Seller.find({"_id": req.session._id},function (err,results) {
      if(err){res.send("-1");}
      // console.log(info,results[0].seller)
      results[0].seller.bulletin = fields.bulletin
      results[0].save();
      res.send("1");
    })

  })
}
//删除商品分类
exports.removeType = function(req,res){
  var num = req.query.num;
  Seller.find({"_id": req.session._id},function (err,results) {
    if(err){res.send("-1");return;}
    results[0].goods.splice(num,1);
    results[0].save();
    res.send("1")
  })
}
//增加商品分类
exports.addType = function (req,res) {
  var form = new formidable.IncomingForm();
  form.parse(req,function(err,fields,files){
    if(err){
      res.send("-1");
      return;
    }
    Seller.find({"_id": req.session._id},function (err,results) {
      if(err){res.send("-1");}
      results[0].goods.push({
        "foods":[],
        name: fields.newType
      })
      results[0].save();
      res.send("1");
    })

  })
}
//更改商品
exports.changegood = function (req,res) {
  var form = new formidable.IncomingForm();
  form.parse(req,function(err,fields,files){
    if(err){
      res.send("-1");
      return;
    }
    var detail = fields;
    var name = detail.oldname;
    Seller.find({"_id": req.session._id},function (err,results) {
      if(err){res.send("-1");}
      results[0].goods.forEach(function (v,i) {
        v.foods.forEach(function (_v,_i) {
          // _v.forEach(function (__v,__i) {
            if(_v.name === name){
              for(k in detail){
                if(detail[k])
                _v[k] = detail[k];
              }
            }
          // })
        })
      })
      results[0].save();
      res.send("1");
    })

  })
}
//上传图片
exports.addpic = function (req,res) {
  var form = new formidable.IncomingForm();
  //设置上传目录
  form.uploadDir = "./uploads";
  form.parse(req, function(err, fields, files) {
    //确认有文件上来
    if(files.length == 0){
      res.send("非法操作，请上传图片！");
      return;
    }
    //改名逻辑
    //改名，给上传的文件加上.jpg后缀
    fs.rename("./" + files.tupian.path , "./" + files.tupian.path + ".jpg",function(err){
      if(err){

        res.send("改名失败，请重新上传图片！");
        return;
      }
      // console.log(files.tupian.path.substr(8)+',jpg')
      req.session.newpicname = files.tupian.path.substr(8)+'.jpg';
      res.send(req.session.newpicname)
    })

  });
}
//增加商品
exports.addgood = function (req,res) {

  var form = new formidable.IncomingForm();
  form.parse(req,function(err,fields,files){
    if(err){
      res.send("-1");
      return;
    }
    if(!fields.newPicRef){
      res.send("-2");
      return;
    }
    var gooditem = {
      "image": fields.newPicRef,
      "icon": fields.newPicRef,
      "info": fields.info,
      "rating": 0,
      "sellCount": 0,
      "description": fields.description,
      "name": fields.name,
      "price": fields.price,
      "oldPrice": fields.oldPrice,
      "ratings": []
    }
    Seller.find({"_id": req.session._id},function (err,results) {
      if(err){res.send("-1");}
      results[0].goods.forEach(function (v,i) {
        fields.typeNum.forEach(function (_v,_i) {
          if(_v == i){
            results[0].goods[i].foods.push(gooditem);
          }
        })

      })
      results[0].save();
      res.send("1");
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
